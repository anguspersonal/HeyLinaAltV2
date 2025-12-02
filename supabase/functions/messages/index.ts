// Updated messages Edge Function with CORS handling
console.info('messages function started');
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  // Basic CORS settings - adjust origins as needed
  const allowedOrigins = ['*']; // allow all
  const allowedMethods = ['GET', 'POST', 'OPTIONS'];
  const allowedHeaders = ['Content-Type', 'Authorization'];
  const allowCredentials = false;

  const origin = req.headers.get('origin') || '';
  const headers = new Headers();
  // Set CORS response headers
  if (allowedOrigins.includes('*')) {
    headers.set('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  }
  headers.set('Access-Control-Allow-Methods', allowedMethods.join(','));
  headers.set('Access-Control-Allow-Headers', allowedHeaders.join(','));
  if (allowCredentials) headers.set('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Your existing handler logic goes here. Example echo:
  try {
    const body = await req.json().catch(() => ({}));
    const response = { ok: true, data: body };
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify(response), { status: 200, headers });
  } catch (err) {
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers });
  }
});