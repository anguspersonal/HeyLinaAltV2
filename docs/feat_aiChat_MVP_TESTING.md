# AI Chat MVP - Testing Strategy

**Target:** 99.5% message send success rate

---

## Unit Tests

**Coverage Target: 80%+ for critical paths**

```typescript
// Example test structure
describe('useSendMessage', () => {
  it('should send message and update UI optimistically', async () => {
    // Test optimistic UI update
  });
  
  it('should retry on network failure', async () => {
    // Test retry logic
  });
  
  it('should mark message as failed after max retries', async () => {
    // Test failure state
  });
  
  it('should handle concurrent message sends', async () => {
    // Test race conditions
  });
});

describe('chatApi', () => {
  it('should handle 500 errors gracefully', async () => {
    // Test server error handling
  });
  
  it('should timeout after 15 seconds', async () => {
    // Test timeout logic
  });
});
```

**Critical Test Cases:**
- Message send success path
- Network failure + retry logic
- Database write failures
- Concurrent message sends
- Message ordering preservation
- Offline message queuing (if implemented)

---

## Integration Tests

**Test real API interactions with Supabase:**

```typescript
describe('Message Persistence Integration', () => {
  it('should save user message to Supabase', async () => {
    // Real Supabase test instance
  });
  
  it('should retrieve messages with RLS applied', async () => {
    // Test row-level security
  });
  
  it('should handle database connection failures', async () => {
    // Test resilience
  });
});
```

**Test Environment:**
- Separate Supabase test project
- Seed data for consistent tests
- Clean up after each test run

---

## End-to-End Tests

**Use Detox or Maestro for React Native E2E testing:**

```yaml
# Example Maestro flow
appId: com.heylina.app
---
- launchApp
- tapOn: "Chat"
- inputText: "Hello Lina"
- tapOn: "Send"
- assertVisible: "Hello Lina"  # User message appears
- assertVisible: ".*typing.*"   # Typing indicator
- assertVisible: 
    timeout: 10000
    text: ".*"                  # AI response appears
- stopApp
- launchApp
- tapOn: "Chat"
- assertVisible: "Hello Lina"   # Message persisted
```

**Critical E2E Scenarios:**
1. **Happy path**: Send message → receive response → verify persistence
2. **Network interruption**: Send message → kill network → verify retry
3. **App backgrounding**: Send message → background app → verify completion
4. **Multiple messages**: Send 5 messages rapidly → verify all persist
5. **Fresh install**: Load chat → verify empty state → send first message

---

## Performance Testing

**Load Testing (Backend):**
- Simulate 100 concurrent users sending messages
- Measure p50, p95, p99 response times
- Verify database doesn't become bottleneck

**Frontend Performance:**
- Test scroll performance with 500+ messages loaded
- Measure time to interactive on chat screen
- Profile memory usage during long sessions

---

## Manual QA Checklist

### Device Testing
- [ ] iOS (latest 2 versions)
- [ ] Android (latest 2 versions)
- [ ] Low-end device (e.g., older Android)
- [ ] Tablet form factor

### Network Conditions
- [ ] WiFi (good connection)
- [ ] 4G/5G mobile data
- [ ] Slow 3G (throttled)
- [ ] Airplane mode → reconnect
- [ ] Intermittent connection (flaky WiFi)

### Edge Cases
- [ ] Send very long message (1000 chars)
- [ ] Send empty message (should be blocked)
- [ ] Send message with emojis/special characters
- [ ] Send 10 messages in rapid succession
- [ ] Kill app mid-send
- [ ] Logout/login mid-conversation
- [ ] Database quota exceeded (Supabase limits)

---

## Monitoring & Observability

### Required Metrics
- Message send success rate (by platform, network type)
- API response time distribution (p50, p95, p99)
- Database write latency
- Error rate by error type
- Retry attempt distribution

### Alerting
- Alert if success rate drops below 99% (5-minute window)
- Alert if p95 response time > 5 seconds
- Alert if database errors > 0.1%

### Tools
- Sentry for error tracking
- Supabase built-in analytics
- Custom analytics events for success/failure tracking

---

**Related:** [AI Chat MVP PRD](file:///c:/Users/angus/Dev/HeyLinaAltV2/docs/feat_aiChat_MVP_PRD.md)
