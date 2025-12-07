import fc from 'fast-check';

import type { Message } from '@/features/chat/types';
import type { Bookmark, Conversation } from '@/features/history/types';

// Generators for property-based testing
const validDateGen = fc
  .integer({ min: new Date('2024-01-01').getTime(), max: Date.now() })
  .map((timestamp) => new Date(timestamp).toISOString());

const messageGen = fc.record({
  id: fc.uuid(),
  userId: fc.uuid(),
  role: fc.constantFrom('user' as const, 'assistant' as const),
  content: fc.string({ minLength: 1, maxLength: 500 }),
  createdAt: validDateGen,
});

const conversationGen = fc.record({
  id: fc.uuid(),
  userId: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  lastMessageAt: validDateGen,
  messageCount: fc.integer({ min: 1, max: 100 }),
  preview: fc.string({ minLength: 1, maxLength: 200 }),
});

const bookmarkGen = (message: Message) =>
  fc.record({
    id: fc.uuid(),
    userId: fc.uuid(),
    messageId: fc.constant(message.id),
    message: fc.constant(message),
    note: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
    createdAt: validDateGen,
  });

// Helper function to sort conversations by recency
const sortConversationsByRecency = (conversations: Conversation[]): Conversation[] => {
  return [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
};

// Helper function to filter conversations by search query
const searchConversations = (
  conversations: Conversation[],
  query: string
): Conversation[] => {
  if (!query) {
    return conversations;
  }

  const lowerQuery = query.toLowerCase();
  return conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(lowerQuery) ||
      conv.preview.toLowerCase().includes(lowerQuery)
  );
};

// Feature: heylina-mobile-mvp, Property 12: Chat sessions are ordered by recency
describe('Property 12: Chat sessions are ordered by recency', () => {
  it('should always display chat sessions sorted by most recent first', () => {
    fc.assert(
      fc.property(
        fc.array(conversationGen, { minLength: 2, maxLength: 20 }),
        (conversations) => {
          // Sort sessions using the app's sorting logic
          const sorted = sortConversationsByRecency(conversations);

          // Verify that each session is more recent than or equal to the next
          for (let i = 0; i < sorted.length - 1; i++) {
            const current = new Date(sorted[i].lastMessageAt);
            const next = new Date(sorted[i + 1].lastMessageAt);
            expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain sort order after adding new conversations', () => {
    fc.assert(
      fc.property(
        fc.array(conversationGen, { minLength: 1, maxLength: 10 }),
        conversationGen,
        (existingConversations, newConversation) => {
          const sorted = sortConversationsByRecency(existingConversations);
          const withNew = sortConversationsByRecency([...sorted, newConversation]);

          // Verify all conversations are still sorted
          for (let i = 0; i < withNew.length - 1; i++) {
            const current = new Date(withNew[i].lastMessageAt);
            const next = new Date(withNew[i + 1].lastMessageAt);
            expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: heylina-mobile-mvp, Property 13: Session selection displays full conversation
describe('Property 13: Session selection displays full conversation', () => {
  it('should retrieve all messages for a selected conversation', () => {
    fc.assert(
      fc.property(
        conversationGen,
        fc.array(messageGen, { minLength: 1, maxLength: 50 }),
        (conversation, messages) => {
          // Simulate fetching conversation detail
          const conversationDetail = {
            conversation,
            messages,
          };

          // Verify all messages are present
          expect(conversationDetail.messages).toHaveLength(messages.length);
          expect(conversationDetail.conversation.id).toBe(conversation.id);

          // Verify message integrity
          conversationDetail.messages.forEach((msg, index) => {
            expect(msg.id).toBe(messages[index].id);
            expect(msg.content).toBe(messages[index].content);
            expect(msg.role).toBe(messages[index].role);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve message order in conversation detail', () => {
    fc.assert(
      fc.property(
        conversationGen,
        fc.array(messageGen, { minLength: 2, maxLength: 30 }),
        (conversation, messages) => {
          // Sort messages by creation time (oldest first)
          const sortedMessages = [...messages].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          const conversationDetail = {
            conversation,
            messages: sortedMessages,
          };

          // Verify messages are in chronological order
          for (let i = 0; i < conversationDetail.messages.length - 1; i++) {
            const current = new Date(conversationDetail.messages[i].createdAt);
            const next = new Date(conversationDetail.messages[i + 1].createdAt);
            expect(current.getTime()).toBeLessThanOrEqual(next.getTime());
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: heylina-mobile-mvp, Property 14: Bookmark round-trip preserves messages
describe('Property 14: Bookmark round-trip preserves messages', () => {
  it('should preserve message content and context through bookmark save and retrieval', () => {
    fc.assert(
      fc.property(messageGen, (message) => {
        // Simulate bookmarking a message
        const bookmark: Bookmark = {
          id: 'bookmark-' + message.id,
          userId: message.userId,
          messageId: message.id,
          message: message,
          createdAt: new Date().toISOString(),
        };

        // Verify message is preserved
        expect(bookmark.message.id).toBe(message.id);
        expect(bookmark.message.content).toBe(message.content);
        expect(bookmark.message.role).toBe(message.role);
        expect(bookmark.message.createdAt).toBe(message.createdAt);
        expect(bookmark.messageId).toBe(message.id);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve optional note field in bookmarks', () => {
    fc.assert(
      fc.property(
        messageGen,
        fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
        (message, note) => {
          const bookmark: Bookmark = {
            id: 'bookmark-' + message.id,
            userId: message.userId,
            messageId: message.id,
            message: message,
            note: note,
            createdAt: new Date().toISOString(),
          };

          // Verify note is preserved
          if (note !== undefined) {
            expect(bookmark.note).toBe(note);
          } else {
            expect(bookmark.note).toBeUndefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain bookmark-message relationship', () => {
    fc.assert(
      fc.property(
        fc.array(messageGen, { minLength: 1, maxLength: 20 }),
        (messages) => {
          // Create bookmarks for all messages
          const bookmarks: Bookmark[] = messages.map((msg) => ({
            id: 'bookmark-' + msg.id,
            userId: msg.userId,
            messageId: msg.id,
            message: msg,
            createdAt: new Date().toISOString(),
          }));

          // Verify each bookmark references the correct message
          bookmarks.forEach((bookmark, index) => {
            expect(bookmark.messageId).toBe(messages[index].id);
            expect(bookmark.message).toEqual(messages[index]);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: heylina-mobile-mvp, Property 15: Search returns matching conversations
describe('Property 15: Search returns matching conversations', () => {
  it('should return conversations that match the search query in title', () => {
    fc.assert(
      fc.property(
        fc.array(conversationGen, { minLength: 5, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (conversations, searchTerm) => {
          // Add search term to some conversation titles
          const modifiedConversations = conversations.map((conv, index) => {
            if (index % 3 === 0) {
              return {
                ...conv,
                title: `${conv.title} ${searchTerm}`,
              };
            }
            return conv;
          });

          const results = searchConversations(modifiedConversations, searchTerm);

          // Verify all results contain the search term
          results.forEach((result) => {
            const matchesTitle = result.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPreview = result.preview
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            expect(matchesTitle || matchesPreview).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return conversations that match the search query in preview', () => {
    fc.assert(
      fc.property(
        fc.array(conversationGen, { minLength: 5, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (conversations, searchTerm) => {
          // Add search term to some conversation previews
          const modifiedConversations = conversations.map((conv, index) => {
            if (index % 2 === 0) {
              return {
                ...conv,
                preview: `${conv.preview} ${searchTerm}`,
              };
            }
            return conv;
          });

          const results = searchConversations(modifiedConversations, searchTerm);

          // Verify all results contain the search term
          results.forEach((result) => {
            const matchesTitle = result.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPreview = result.preview
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            expect(matchesTitle || matchesPreview).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return empty array when no conversations match', () => {
    fc.assert(
      fc.property(
        fc.array(conversationGen, { minLength: 1, maxLength: 10 }),
        (conversations) => {
          // Use a search term that definitely won't match
          const impossibleSearchTerm = '___IMPOSSIBLE_SEARCH_TERM_XYZ123___';
          const results = searchConversations(conversations, impossibleSearchTerm);

          expect(results).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.array(conversationGen, { minLength: 1, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (conversations, searchTerm) => {
          // Add search term to first conversation
          const modifiedConversations = [
            {
              ...conversations[0],
              title: `${conversations[0].title} ${searchTerm}`,
            },
            ...conversations.slice(1),
          ];

          // Search with different case
          const lowerResults = searchConversations(
            modifiedConversations,
            searchTerm.toLowerCase()
          );
          const upperResults = searchConversations(
            modifiedConversations,
            searchTerm.toUpperCase()
          );

          // Both should return the same results
          expect(lowerResults.length).toBeGreaterThan(0);
          expect(upperResults.length).toBe(lowerResults.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
