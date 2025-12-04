import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

type MessageRow = {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

type ChatMessage = {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const openAiApiKey = Deno.env.get('OPENAI_API_KEY') ?? '';
const openAiModel = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini';
const systemPrompt =
  Deno.env.get('OPENAI_SYSTEM_PROMPT') ??
  'You are Lina, a warm, empathetic relationship guide. Keep responses concise and actionable.';

const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

const mapRowToMessage = (row: MessageRow): ChatMessage => ({
  id: row.id,
  userId: row.user_id,
  role: row.role,
  content: row.content,
  createdAt: row.created_at,
});

async function requireUser(req: Request) {
  if (!supabase) {
    throw jsonResponse(500, { ok: false, error: 'Supabase credentials are not configured.' });
  }

  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    throw jsonResponse(401, { ok: false, error: 'Missing bearer token' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    throw jsonResponse(401, { ok: false, error: 'Invalid or expired token' });
  }

  return data.user;
}

async function fetchMessages(userId: string, url: URL) {
  const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit')) || 50));
  const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);

  const { data, error, count } = await supabase!
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Failed to fetch messages', error);
    throw jsonResponse(500, { ok: false, error: 'Unable to load messages right now.' });
  }

  return {
    messages: (data ?? []).map(mapRowToMessage),
    total: count ?? (data ?? []).length,
  };
}

async function generateAiReply(content: string) {
  if (!openAiApiKey) {
    return 'I do not have an AI key configured yet, but I am here to listen.';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: openAiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error', response.status, errorText);
      return 'I ran into an issue generating a response. Please try again.';
    }

    const data = await response.json();
    const message = data?.choices?.[0]?.message?.content?.trim();
    return message || 'I am thinking about that. Could you ask again?';
  } catch (error) {
    console.error('OpenAI fetch failed', error);
    return 'I ran into an issue generating a response. Please try again.';
  }
}

async function handleSendMessage(userId: string, content: string) {
  const now = new Date().toISOString();
  const userMessage: MessageRow = {
    id: crypto.randomUUID(),
    user_id: userId,
    role: 'user',
    content,
    created_at: now,
  };

  const { error: userInsertError } = await supabase!.from('messages').insert(userMessage);
  if (userInsertError) {
    console.error('Failed to save user message', userInsertError);
    throw jsonResponse(500, { ok: false, error: 'Unable to save your message.' });
  }

  const aiContent = await generateAiReply(content);
  const aiMessage: MessageRow = {
    id: crypto.randomUUID(),
    user_id: userId,
    role: 'assistant',
    content: aiContent,
    created_at: new Date().toISOString(),
  };

  const { error: aiInsertError } = await supabase!.from('messages').insert(aiMessage);
  if (aiInsertError) {
    console.error('Failed to save AI message', aiInsertError);
    throw jsonResponse(500, { ok: false, error: 'Unable to save AI response.' });
  }

  return {
    userMessage: mapRowToMessage(userMessage),
    aiResponse: mapRowToMessage(aiMessage),
  };
}

console.info('messages function started');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const user = await requireUser(req);

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const data = await fetchMessages(user.id, url);
      return jsonResponse(200, { ok: true, data });
    }

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const content = typeof body?.content === 'string' ? body.content.trim() : '';
      if (!content) {
        return jsonResponse(400, { ok: false, error: 'Message content is required.' });
      }

      const data = await handleSendMessage(user.id, content);
      return jsonResponse(200, { ok: true, data });
    }

    return jsonResponse(405, { ok: false, error: 'Method not allowed' });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('Unexpected error in messages function', error);
    return jsonResponse(500, { ok: false, error: 'Unexpected error' });
  }
});
