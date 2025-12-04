import type { Message } from '@/features/chat/types';

export type Conversation = {
  id: string;
  userId: string;
  title: string;
  lastMessageAt: string;
  messageCount: number;
  preview: string;
};

export type Bookmark = {
  id: string;
  userId: string;
  messageId: string;
  message: Message;
  note?: string;
  createdAt: string;
};

export type ConversationsResponse = {
  conversations: Conversation[];
  total: number;
};

export type BookmarksResponse = {
  bookmarks: Bookmark[];
  total: number;
};

export type ConversationDetail = {
  conversation: Conversation;
  messages: Message[];
};
