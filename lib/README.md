# Library Utilities

## Storage (`lib/storage.ts`)

Cross-platform secure storage utility that abstracts platform differences.

### Usage

```typescript
import storage from '@/lib/storage';

// Save data
await storage.setItem('key', 'value');

// Retrieve data
const value = await storage.getItem('key'); // returns string | null

// Remove data
await storage.removeItem('key');
```

### Platform Behavior

- **iOS/Android**: Uses `expo-secure-store` for encrypted keychain/keystore storage
- **Web**: Uses browser `localStorage` (not encrypted, but standard for web apps)

### Important Notes

1. **Always use this utility instead of `expo-secure-store` directly** to ensure web compatibility
2. All methods are async and return Promises
3. Values must be strings (use `JSON.stringify()` for objects)
4. Web storage is not encrypted - avoid storing highly sensitive data if web support is critical
5. The Supabase client (`lib/supabase/client.ts`) has its own storage adapter and doesn't use this utility

### Example: Storing Objects

```typescript
// Save
const userData = { name: 'John', age: 30 };
await storage.setItem('user', JSON.stringify(userData));

// Retrieve
const userJson = await storage.getItem('user');
if (userJson) {
  const userData = JSON.parse(userJson);
  console.log(userData.name); // 'John'
}
```

## Supabase Client (`lib/supabase/client.ts`)

Configured Supabase client with platform-specific storage adapters for auth persistence.

### Usage

```typescript
import { supabase } from '@/lib/supabase/client';

// Use Supabase as normal
const { data, error } = await supabase.auth.signIn({ email, password });
```

### Storage Behavior

The client automatically handles auth token storage:
- **iOS/Android**: Uses `expo-secure-store` with keychain service
- **Web**: Uses browser `localStorage`

You don't need to manually manage auth tokens - Supabase handles this internally.

## Testing

### Storage Mock

The storage utility is automatically mocked in Jest tests via `jest.setup.js`. The mock is available globally and provides default implementations for all methods.

#### Using the Mock in Tests

```typescript
// Access the global mock
const mockStorage = (global as any).mockStorage;

// Verify method calls
expect(mockStorage.setItem).toHaveBeenCalledWith('key', 'value');
expect(mockStorage.getItem).toHaveBeenCalledWith('key');

// Mock specific return values
mockStorage.getItem.mockResolvedValueOnce('test-value');

// Mock implementation for a single test
mockStorage.setItem.mockImplementationOnce(
  () => new Promise(resolve => setTimeout(resolve, 100))
);

// Clear mock history between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

#### Default Mock Behavior

- `getItem(key)`: Returns `Promise<null>`
- `setItem(key, value)`: Returns `Promise<undefined>`
- `removeItem(key)`: Returns `Promise<undefined>`

#### Important Notes

1. **Don't redefine the mock** in individual test files - use the global mock
2. **Clear mocks between tests** using `jest.clearAllMocks()` in `beforeEach`
3. **Access via global** to avoid import issues with Jest's module hoisting
