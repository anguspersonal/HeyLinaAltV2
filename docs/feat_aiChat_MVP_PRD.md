# AI Chat MVP - Product Requirements Document

## Executive Summary

The AI Chat feature is the **core interaction surface** of HeyLina, where users engage in conversations about dating and relationships with an AI companion. This MVP focuses on delivering a functional chat experience that allows users to send messages, receive AI responses, and have their conversations stored securely.

**Success Criteria**: Users can have a complete conversation with Lina, with all messages persisted and retrievable across sessions.

---

## Problem Statement

Users need a dedicated space to talk through dating and relationship concerns with an AI companion. For MVP, the core requirement is:

- **A working chat interface** where users can send messages and receive AI responses
- **Persistent storage** so conversations are saved and can be continued later
- **Basic conversation management** to view and organize chat history

This MVP establishes the foundation for future enhancements like context awareness, pattern recognition, and advanced emotional intelligence features.

---

## User Context

**Primary Persona:** Julie, 28, London - Professional, actively dating, burnt out by apps, overthinks interactions

**Core Need:** A space to process dating anxiety and get clarity on relationship decisions

**Typical Triggers:** Ghosting, mixed signals, boundary violations, "Am I overthinking this?"

---

## MVP Scope

### What We're Building

**Core Chat Interface:**
- Message bubbles (user right, AI left)
- Text input + send button
- Typing indicator while AI responds
- Scrollable message history

**Data & Persistence:**
- All messages saved to Supabase
- Messages load on app open
- Offline viewing of loaded messages

**Error Handling:**
- Network errors with retry button
- Clear error messages
- Optimistic UI (show message immediately, mark failed if needed)

### Not in MVP (Future)
Multiple threads, quick actions, bookmarks, pattern recognition, RAG, voice chat, image sharing, message editing

---

## User Flow

**Basic Chat Journey:**
1. User opens chat → sees previous messages (or empty state)
2. Types message → taps send
3. Message appears immediately (optimistic UI)
4. Typing indicator shows
5. AI response appears
6. Messages persist to database
7. User closes app → returns later → sees full history

**Success Metrics:** 70%+ send first message, < 5% send failures, messages persist across sessions

---

## Technical Requirements

### Component Structure

```
features/chat/
├── components/
│   ├── MessageBubble.tsx
│   ├── TypingIndicator.tsx
│   └── ChatInput.tsx
├── screens/
│   └── ChatScreen.tsx
├── hooks/
│   ├── useMessages.ts
│   └── useSendMessage.ts
└── services/
    └── chatApi.ts
```

### Performance Targets
- **< 200ms** to show typing indicator after send
- **< 3s** AI response time (p95)
- **< 500ms** history load (p95)
- **60fps** scroll with 100+ messages

### Backend API Endpoints

#### Chat Management (MVP)

```typescript
// Get all messages for current user
GET /api/messages
Query: { limit?: number, offset?: number }
Response: { 
  messages: Array<Message>,
  total: number
}

// Send message and get AI response
POST /api/messages
Request: { content: string }
Response: { 
  userMessage: Message,
  aiResponse: Message
}
```

#### Message Schema

```typescript
interface Message {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
```

### Data Storage

**Supabase (Primary Storage):**
- All messages (user and AI)
- User authentication
- Message timestamps and metadata

**Local Cache (Optional):**
- Recently loaded messages for offline viewing
- Auth tokens (secure storage)



## Privacy & Safety (MVP)

### Data Handling

**What We Store:**
- All message content in Supabase
- User ID associated with each message
- Message timestamps

**Security:**
- Messages stored in Supabase with RLS (Row Level Security)
- Users can only access their own messages
- HTTPS for all API calls

### Safety (Future Enhancement)
- Crisis detection and safety resources will be added in future iteration
- For MVP, focus on secure data storage

---

## Success Criteria (MVP)

### Launch Readiness

- [ ] User can view chat screen
- [ ] User can type and send a message
- [ ] Message appears in chat UI immediately
- [ ] Typing indicator shows while waiting for AI
- [ ] AI response appears in chat
- [ ] Messages persist to Supabase database
- [ ] User can close and reopen app to see previous messages
- [ ] Error message shows if send fails
- [ ] Retry works for failed messages

### Post-Launch Success (2 Weeks)

**Functionality (Industry-Standard SLAs):**
- **99.5%+ message send success rate** (excluding user network issues)
- **99.9%+ database persistence rate** (all sent messages stored)
- **100% chat history load success** on app restart (with proper error handling)
- **< 3 seconds** average AI response time (p95)
- **< 500ms** message history load time (p95)

**Engagement:**
- 60%+ of users send at least one message
- Average 3+ messages per session

> [!IMPORTANT]
> **Why 99.5%?** This matches industry standards for messaging apps (WhatsApp, Slack, iMessage). Anything below 99% erodes user trust in a core feature. The 0.5% failure budget accounts for edge cases like device crashes, extreme network conditions, or backend incidents.

---

## Testing Strategy

**Target:** 99.5% message send success rate

**Required Testing:**
- **Unit tests** (80%+ coverage): Message send logic, retry mechanisms, error handling
- **Integration tests**: Supabase persistence, RLS policies
- **E2E tests** (Detox/Maestro): Full user flows, network interruptions, persistence
- **Manual QA**: Multiple devices, network conditions, edge cases
- **Monitoring**: Sentry, Supabase analytics, custom success/failure tracking

> [!NOTE]
> **Detailed testing strategy:** See [feat_aiChat_MVP_TESTING.md](file:///c:/Users/angus/Dev/HeyLinaAltV2/docs/feat_aiChat_MVP_TESTING.md) for complete test cases, E2E flows, and QA checklists.

---

## Risks & Mitigations (MVP)

### Risk 1: Message Persistence Failure
**Impact**: High - Users lose trust if messages disappear  
**Mitigation**:
- Supabase as reliable storage backend
- Test message persistence thoroughly
- Error handling for database failures

### Risk 2: API Response Time
**Impact**: Medium - Slow AI responses hurt UX  
**Mitigation**:
- Show typing indicator immediately
- Set reasonable timeout (15 seconds)
- Display error if timeout exceeded

### Risk 3: Message Send Failures
**Impact**: Medium - Frustrating user experience  
**Mitigation**:
- Clear error messages
- Retry button for failed sends
- Optimistic UI (show message immediately, mark as failed if needed)

---

## Open Questions (MVP)

1. **Message length limits**: Should we cap user messages? (Recommendation: 1000 characters for MVP)

2. **AI provider**: Which AI API will backend use? (OpenAI, Anthropic, etc.)

3. **Pagination**: How many messages to load initially? (Recommendation: 50 most recent)

---

## Dependencies (MVP)

### Internal
- Supabase database with messages table
- Backend API endpoint for sending messages and getting AI responses
- User authentication (Supabase Auth)

### External
- React Native environment
- Supabase client library
- Basic HTTP client (fetch/axios)

---

## Timeline (MVP)

### Week 1: UI & Basic Flow
- Create chat screen layout
- Build message bubble components
- Implement text input and send button
- Add typing indicator

### Week 2: Backend Integration
- Connect to Supabase
- Implement message sending API call
- Implement message fetching
- Handle loading and error states

### Week 3: Polish & Testing
- Test message persistence
- Fix bugs
- Performance optimization
- Basic QA testing

---

## Appendix

### Related Documents
- [HeyLina Mobile Dev Onboarding Pack](file:///c:/Users/angus/Dev/HeyLinaAltV2/HeyLinaMobileDevOnboardingPack.md)

### Database Schema (Supabase)

```sql
-- Messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);

-- RLS policies
alter table messages enable row level security;

create policy "Users can view own messages"
  on messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on messages for insert
  with check (auth.uid() = user_id);
```

---

**Document Version**: 2.0 (MVP Simplified)  
**Last Updated**: 2025-11-30  
**Owner**: Product Management  
**Status**: Ready for Implementation
