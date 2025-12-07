# History Feature

This feature provides conversation history and bookmark management for the HeyLina mobile app.

## Components

### Screens

- **HistoryListScreen**: Displays a list of past conversations sorted by recency with search functionality
- **ConversationDetailScreen**: Shows the full message history for a selected conversation
- **BookmarksScreen**: Displays all bookmarked messages with the ability to remove bookmarks

### Components

- **ConversationCard**: Card component for displaying conversation preview in the list
- **BookmarkItem**: Card component for displaying a bookmarked message with context

### Hooks

- **useBookmarks**: Custom hook for managing bookmark state and operations (add, remove, toggle)

### Services

- **historyApi**: API service for fetching conversations, conversation details, and managing bookmarks

## Usage

### Displaying Conversation History

```tsx
import { HistoryListScreen } from '@/features/history';

function HistoryTab() {
  const { session } = useAuth();
  
  const handleConversationPress = (conversationId: string) => {
    // Navigate to conversation detail
  };

  return (
    <HistoryListScreen
      accessToken={session?.access_token}
      onConversationPress={handleConversationPress}
    />
  );
}
```

### Managing Bookmarks

```tsx
import { useBookmarks } from '@/features/history';

function ChatScreen() {
  const { session } = useAuth();
  const { bookmarkedMessageIds, toggleBookmark } = useBookmarks({
    accessToken: session?.access_token,
  });

  const handleBookmark = async (messageId: string) => {
    await toggleBookmark(messageId);
  };

  return (
    <MessageBubble
      message={message}
      onBookmark={handleBookmark}
      isBookmarked={bookmarkedMessageIds.has(message.id)}
    />
  );
}
```

## Property-Based Tests

The history feature includes comprehensive property-based tests that verify:

- **Property 12**: Chat sessions are ordered by recency
- **Property 13**: Session selection displays full conversation
- **Property 14**: Bookmark round-trip preserves messages
- **Property 15**: Search returns matching conversations

Run tests with:
```bash
npm test -- features/history/__tests__/history.property.test.ts --watchAll=false
```

## API Endpoints

The feature expects the following backend endpoints:

- `GET /conversations?limit=50&offset=0&search=query` - Fetch conversations
- `GET /conversations/:id` - Fetch conversation detail with messages
- `GET /bookmarks?limit=50&offset=0` - Fetch bookmarks
- `POST /bookmarks` - Create a bookmark
- `DELETE /bookmarks/:id` - Delete a bookmark

All endpoints should return data in the format:
```json
{
  "ok": true,
  "data": { ... }
}
```
