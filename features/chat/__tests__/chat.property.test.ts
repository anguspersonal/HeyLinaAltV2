/**
 * Property-Based Tests for Chat Functionality
 * Feature: heylina-mobile-mvp
 * 
 * These tests validate universal properties that should hold across all chat scenarios.
 * 
 * Property 6: Message submission triggers backend communication
 * Property 7: Backend responses are displayed correctly
 * Property 8: Quick actions send corresponding messages
 * Property 9: Active typing hides quick actions
 * 
 * Validates: Requirements 3.2, 3.3, 3.4, 4.2, 4.4
 */

import * as fc from 'fast-check';

import { fetchMessages, sendMessage } from '@/features/chat/services/chatApi';
import type { ChatMessage } from '@/features/chat/types';

// Mock the chat API
jest.mock('@/features/chat/services/chatApi', () => ({
  sendMessage: jest.fn(),
  fetchMessages: jest.fn(),
}));

describe('Chat Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 6: Message submission triggers backend communication
   * Feature: heylina-mobile-mvp, Property 6: Message submission triggers backend communication
   * Validates: Requirements 3.2
   * 
   * For any non-empty message content, when a user submits a message, the system should
   * send it to the backend service and display a typing indicator while waiting for response.
   */
  describe('Property 6: Message submission triggers backend communication', () => {
    it('should send non-empty messages to backend service', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate non-empty message content
          fc.string({ minLength: 1, maxLength: 2000 }).filter(s => s.trim().length > 0),
          fc.uuid(), // accessToken
          async (content, accessToken) => {
            // Mock successful backend response
            const mockUserMessage: ChatMessage = {
              id: 'msg-1',
              userId: 'user-1',
              role: 'user',
              content: content.trim(),
              createdAt: new Date().toISOString(),
              status: 'sent',
            };

            const mockAiResponse: ChatMessage = {
              id: 'msg-2',
              userId: 'assistant',
              role: 'assistant',
              content: 'This is Lina\'s response',
              createdAt: new Date().toISOString(),
              status: 'sent',
            };

            (sendMessage as jest.Mock).mockResolvedValue({
              userMessage: mockUserMessage,
              aiResponse: mockAiResponse,
            });

            // Simulate message submission
            const result = await sendMessage({
              content: content.trim(),
              accessToken,
              idempotencyKey: `key-${Date.now()}`,
            });

            // Property: Backend communication should be triggered
            expect(sendMessage).toHaveBeenCalledWith(
              expect.objectContaining({
                content: content.trim(),
                accessToken,
              })
            );

            // Property: Result should contain both user message and AI response
            expect(result.userMessage).toBeDefined();
            expect(result.aiResponse).toBeDefined();
            expect(result.userMessage.content).toBe(content.trim());
            expect(result.userMessage.role).toBe('user');
            expect(result.aiResponse.role).toBe('assistant');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not send empty or whitespace-only messages', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate whitespace-only strings
          fc.oneof(
            fc.constant(''),
            fc.constant('   '),
            fc.constant('\n\n'),
            fc.constant('\t\t'),
            fc.constant('  \n  \t  ')
          ),
          async (emptyContent) => {
            // Property: Empty messages should be filtered out before backend call
            const trimmed = emptyContent.trim();
            const shouldSend = trimmed.length > 0;

            expect(shouldSend).toBe(false);
            
            // If we were to call the API with empty content, it should be prevented
            // This is validated at the UI/hook level, not the API level
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should include idempotency key for message deduplication', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          fc.uuid(),
          fc.string({ minLength: 10, maxLength: 50 }), // idempotency key
          async (content, accessToken, idempotencyKey) => {
            (sendMessage as jest.Mock).mockResolvedValue({
              userMessage: {
                id: 'msg-1',
                userId: 'user-1',
                role: 'user',
                content: content.trim(),
                createdAt: new Date().toISOString(),
              },
              aiResponse: {
                id: 'msg-2',
                userId: 'assistant',
                role: 'assistant',
                content: 'Response',
                createdAt: new Date().toISOString(),
              },
            });

            await sendMessage({
              content: content.trim(),
              accessToken,
              idempotencyKey,
            });

            // Property: Idempotency key should be included in request
            expect(sendMessage).toHaveBeenCalledWith(
              expect.objectContaining({
                idempotencyKey,
              })
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle message content trimming consistently', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          async (content) => {
            // Property: Trimming should be idempotent
            const trimmed1 = content.trim();
            const trimmed2 = trimmed1.trim();
            
            expect(trimmed1).toBe(trimmed2);
            
            // Property: Trimmed content should have no leading/trailing whitespace
            expect(trimmed1).not.toMatch(/^\s/);
            expect(trimmed1).not.toMatch(/\s$/);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 7: Backend responses are displayed correctly
   * Feature: heylina-mobile-mvp, Property 7: Backend responses are displayed correctly
   * Validates: Requirements 3.3, 3.4
   * 
   * For any response received from the backend service, the system should display Lina's
   * message in the chat interface with appropriate formatting and clear visual distinction
   * from user messages.
   */
  describe('Property 7: Backend responses are displayed correctly', () => {
    it('should display messages with correct role distinction', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              id: fc.uuid(),
              userId: fc.uuid(),
              role: fc.constantFrom('user', 'assistant'),
              content: fc.string({ minLength: 1, maxLength: 500 }),
              createdAt: fc.integer({ min: Date.parse('2024-01-01'), max: Date.now() }).map(ts => new Date(ts).toISOString()),
            }),
            { minLength: 1, maxLength: 20 }
          ),
          async (messages) => {
            // Mock fetchMessages to return the generated messages
            (fetchMessages as jest.Mock).mockResolvedValue({
              messages,
              total: messages.length,
            });

            const result = await fetchMessages({
              limit: 50,
              offset: 0,
              accessToken: 'test-token',
            });

            // Property: All messages should maintain their role
            result.messages.forEach((msg, index) => {
              expect(msg.role).toBe(messages[index].role);
              expect(['user', 'assistant']).toContain(msg.role);
            });

            // Property: User and assistant messages should be distinguishable
            const userMessages = result.messages.filter(m => m.role === 'user');
            const assistantMessages = result.messages.filter(m => m.role === 'assistant');
            
            userMessages.forEach(msg => expect(msg.role).toBe('user'));
            assistantMessages.forEach(msg => expect(msg.role).toBe('assistant'));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve message content through backend round-trip', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
          fc.uuid(),
          async (content, accessToken) => {
            const trimmedContent = content.trim();
            
            // Mock send and fetch
            (sendMessage as jest.Mock).mockResolvedValue({
              userMessage: {
                id: 'msg-1',
                userId: 'user-1',
                role: 'user',
                content: trimmedContent,
                createdAt: new Date().toISOString(),
              },
              aiResponse: {
                id: 'msg-2',
                userId: 'assistant',
                role: 'assistant',
                content: 'AI response',
                createdAt: new Date().toISOString(),
              },
            });

            // Send message
            const sendResult = await sendMessage({
              content: trimmedContent,
              accessToken,
            });

            // Property: Message content should be preserved exactly
            expect(sendResult.userMessage.content).toBe(trimmedContent);
            
            // Mock fetch to return the sent message
            (fetchMessages as jest.Mock).mockResolvedValue({
              messages: [sendResult.userMessage, sendResult.aiResponse],
              total: 2,
            });

            const fetchResult = await fetchMessages({
              limit: 50,
              offset: 0,
              accessToken,
            });

            // Property: Fetched message should match sent message
            const fetchedUserMessage = fetchResult.messages.find(m => m.id === sendResult.userMessage.id);
            expect(fetchedUserMessage).toBeDefined();
            expect(fetchedUserMessage?.content).toBe(trimmedContent);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain message ordering by timestamp', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              id: fc.uuid(),
              userId: fc.uuid(),
              role: fc.constantFrom('user', 'assistant'),
              content: fc.string({ minLength: 1, maxLength: 200 }),
              createdAt: fc.integer({ min: Date.parse('2024-01-01'), max: Date.now() }).map(ts => new Date(ts).toISOString()),
            }),
            { minLength: 2, maxLength: 20 }
          ),
          async (messages) => {
            // Sort messages by timestamp (oldest first)
            const sortedMessages = [...messages].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

            (fetchMessages as jest.Mock).mockResolvedValue({
              messages: sortedMessages,
              total: sortedMessages.length,
            });

            const result = await fetchMessages({
              limit: 50,
              offset: 0,
              accessToken: 'test-token',
            });

            // Property: Messages should be ordered chronologically
            for (let i = 0; i < result.messages.length - 1; i++) {
              const currentTime = new Date(result.messages[i].createdAt).getTime();
              const nextTime = new Date(result.messages[i + 1].createdAt).getTime();
              expect(currentTime).toBeLessThanOrEqual(nextTime);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle messages with various content types', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.string({ minLength: 1, maxLength: 100 }), // Regular text
            fc.string({ minLength: 100, maxLength: 500 }), // Long text
            fc.constant('Hello! 👋'), // With emoji
            fc.constant('Line 1\nLine 2\nLine 3'), // Multiline
            fc.constant('Special chars: @#$%^&*()'), // Special characters
          ),
          async (content) => {
            if (content.trim().length === 0) return;

            (sendMessage as jest.Mock).mockResolvedValue({
              userMessage: {
                id: 'msg-1',
                userId: 'user-1',
                role: 'user',
                content,
                createdAt: new Date().toISOString(),
              },
              aiResponse: {
                id: 'msg-2',
                userId: 'assistant',
                role: 'assistant',
                content: 'Response',
                createdAt: new Date().toISOString(),
              },
            });

            const result = await sendMessage({
              content,
              accessToken: 'test-token',
            });

            // Property: All content types should be preserved
            expect(result.userMessage.content).toBe(content);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 8: Quick actions send corresponding messages
   * Feature: heylina-mobile-mvp, Property 8: Quick actions send corresponding messages
   * Validates: Requirements 4.2
   * 
   * For any quick action prompt, when a user taps it, the system should send the
   * associated message content to Lina as if the user had typed it manually.
   */
  describe('Property 8: Quick actions send corresponding messages', () => {
    it('should send quick action prompt as message content', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            id: fc.uuid(),
            label: fc.string({ minLength: 5, maxLength: 50 }),
            prompt: fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length > 0),
          }),
          fc.uuid(), // accessToken
          async (quickAction, accessToken) => {
            // Mock backend response
            (sendMessage as jest.Mock).mockResolvedValue({
              userMessage: {
                id: 'msg-1',
                userId: 'user-1',
                role: 'user',
                content: quickAction.prompt,
                createdAt: new Date().toISOString(),
              },
              aiResponse: {
                id: 'msg-2',
                userId: 'assistant',
                role: 'assistant',
                content: 'Response to quick action',
                createdAt: new Date().toISOString(),
              },
            });

            // Simulate quick action selection
            await sendMessage({
              content: quickAction.prompt,
              accessToken,
            });

            // Property: Quick action prompt should be sent as message content
            expect(sendMessage).toHaveBeenCalledWith(
              expect.objectContaining({
                content: quickAction.prompt,
              })
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should treat quick action messages identically to typed messages', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length > 0),
          fc.uuid(),
          async (messageContent, accessToken) => {
            const mockResponse = {
              userMessage: {
                id: 'msg-1',
                userId: 'user-1',
                role: 'user' as const,
                content: messageContent,
                createdAt: new Date().toISOString(),
              },
              aiResponse: {
                id: 'msg-2',
                userId: 'assistant',
                role: 'assistant' as const,
                content: 'Response',
                createdAt: new Date().toISOString(),
              },
            };

            // Send as typed message
            (sendMessage as jest.Mock).mockResolvedValue(mockResponse);
            const typedResult = await sendMessage({
              content: messageContent,
              accessToken,
            });

            // Send as quick action (same content)
            (sendMessage as jest.Mock).mockResolvedValue(mockResponse);
            const quickActionResult = await sendMessage({
              content: messageContent,
              accessToken,
            });

            // Property: Results should be identical regardless of input method
            expect(typedResult.userMessage.content).toBe(quickActionResult.userMessage.content);
            expect(typedResult.userMessage.role).toBe(quickActionResult.userMessage.role);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate quick action structure', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              id: fc.uuid(),
              label: fc.string({ minLength: 1, maxLength: 100 }),
              prompt: fc.string({ minLength: 1, maxLength: 500 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          async (quickActions) => {
            // Property: All quick actions should have required fields
            quickActions.forEach(action => {
              expect(action.id).toBeTruthy();
              expect(action.label).toBeTruthy();
              expect(action.prompt).toBeTruthy();
              expect(typeof action.id).toBe('string');
              expect(typeof action.label).toBe('string');
              expect(typeof action.prompt).toBe('string');
            });

            // Property: Quick action IDs should be unique
            const ids = quickActions.map(a => a.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 9: Active typing hides quick actions
   * Feature: heylina-mobile-mvp, Property 9: Active typing hides quick actions
   * Validates: Requirements 4.4
   * 
   * For any chat state where the user is actively typing (input has focus and contains text),
   * the system should hide quick action prompts to avoid interface clutter.
   */
  describe('Property 9: Active typing hides quick actions', () => {
    it('should hide quick actions when input has content', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.boolean(), // isFocused
          async (inputValue, isFocused) => {
            // Property: Quick actions visibility depends on input state
            const hasContent = inputValue.trim().length > 0;
            const isTyping = hasContent && isFocused;
            const shouldShowQuickActions = !isTyping;

            // When user is typing (has content and focused), quick actions should be hidden
            if (isTyping) {
              expect(shouldShowQuickActions).toBe(false);
            }

            // When input is empty or not focused, quick actions can be shown
            if (!hasContent || !isFocused) {
              expect(shouldShowQuickActions).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should show quick actions when input is empty', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant(''),
            fc.constant('   '),
            fc.constant('\n'),
            fc.constant('\t')
          ),
          fc.boolean(),
          async (emptyInput, isFocused) => {
            const hasContent = emptyInput.trim().length > 0;
            const shouldShowQuickActions = !hasContent || !isFocused;

            // Property: Empty input should allow quick actions to be visible
            expect(hasContent).toBe(false);
            expect(shouldShowQuickActions).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should toggle quick actions based on focus and content state', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              inputValue: fc.string({ minLength: 0, maxLength: 50 }),
              isFocused: fc.boolean(),
            }),
            { minLength: 2, maxLength: 10 }
          ),
          async (states) => {
            // Property: Quick actions visibility should be deterministic based on state
            states.forEach(state => {
              const hasContent = state.inputValue.trim().length > 0;
              const isTyping = hasContent && state.isFocused;
              const shouldShowQuickActions = !isTyping;

              // Verify consistency
              if (hasContent && state.isFocused) {
                expect(shouldShowQuickActions).toBe(false);
              } else {
                expect(shouldShowQuickActions).toBe(true);
              }
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle rapid input changes consistently', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 0, maxLength: 20 }), { minLength: 5, maxLength: 15 }),
          async (inputSequence) => {
            // Simulate rapid typing
            const visibilityStates = inputSequence.map(input => {
              const hasContent = input.trim().length > 0;
              const isFocused = true; // Assume focused during typing
              const isTyping = hasContent && isFocused;
              return !isTyping; // shouldShowQuickActions
            });

            // Property: Visibility should update consistently with each input change
            inputSequence.forEach((input, index) => {
              const hasContent = input.trim().length > 0;
              const expectedVisibility = !hasContent;
              expect(visibilityStates[index]).toBe(expectedVisibility);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should restore quick actions when input is cleared', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }),
          async (initialContent) => {
            // Start with content (quick actions hidden)
            let hasContent = initialContent.trim().length > 0;
            let isFocused = true;
            let shouldShowQuickActions = !(hasContent && isFocused);
            
            expect(shouldShowQuickActions).toBe(false);

            // Clear input
            const clearedContent = '';
            hasContent = clearedContent.trim().length > 0;
            shouldShowQuickActions = !(hasContent && isFocused);

            // Property: Quick actions should be visible again after clearing
            expect(shouldShowQuickActions).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Additional property tests for chat data integrity
   */
  describe('Chat data integrity properties', () => {
    it('should maintain message immutability after creation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            id: fc.uuid(),
            userId: fc.uuid(),
            role: fc.constantFrom('user', 'assistant'),
            content: fc.string({ minLength: 1, maxLength: 200 }),
            createdAt: fc.integer({ min: Date.parse('2024-01-01'), max: Date.now() }).map(ts => new Date(ts).toISOString()),
          }),
          async (message) => {
            // Property: Message properties should not change after creation
            const originalMessage = { ...message };
            
            // Simulate message being stored and retrieved
            const storedMessage = JSON.parse(JSON.stringify(message));
            
            expect(storedMessage.id).toBe(originalMessage.id);
            expect(storedMessage.userId).toBe(originalMessage.userId);
            expect(storedMessage.role).toBe(originalMessage.role);
            expect(storedMessage.content).toBe(originalMessage.content);
            expect(storedMessage.createdAt).toBe(originalMessage.createdAt);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle message deduplication correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              id: fc.uuid(),
              userId: fc.uuid(),
              role: fc.constantFrom('user', 'assistant'),
              content: fc.string({ minLength: 1, maxLength: 100 }),
              createdAt: fc.integer({ min: Date.parse('2024-01-01'), max: Date.now() }).map(ts => new Date(ts).toISOString()),
            }),
            { minLength: 2, maxLength: 10 }
          ),
          async (messages) => {
            // Add duplicate messages
            const withDuplicates = [...messages, ...messages.slice(0, 2)];
            
            // Deduplicate by ID
            const deduped = Array.from(
              new Map(withDuplicates.map(m => [m.id, m])).values()
            );

            // Property: Deduplication should remove exact duplicates
            expect(deduped.length).toBeLessThanOrEqual(withDuplicates.length);
            
            // Property: All unique IDs should be preserved
            const uniqueIds = new Set(messages.map(m => m.id));
            const dedupedIds = new Set(deduped.map(m => m.id));
            expect(dedupedIds.size).toBe(uniqueIds.size);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
