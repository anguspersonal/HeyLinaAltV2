export type MessageRole = 'user' | 'assistant';

export type Message = {
  id: string;
  userId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  safetyFlag?: 'high-risk' | 'crisis' | 'self-harm' | 'abuse';
};

export type ChatMessageStatus = 'pending' | 'sent' | 'failed';

export type ChatMessage = Message & {
  localId?: string;
  status?: ChatMessageStatus;
};

export type MessagesResponse = {
  messages: Message[];
  total: number;
};

export type SendMessageResult = {
  userMessage: Message;
  aiResponse: Message;
};
