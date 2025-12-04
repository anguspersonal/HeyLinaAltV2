# Authentication Property-Based Tests

## Overview

This directory contains property-based tests for the authentication flows in the HeyLina mobile app.

## Test Files

- `auth.property.simple.test.ts` - Simplified property-based tests that validate authentication logic without requiring full Expo environment

## Properties Tested

### Property 1: Valid credentials create authenticated sessions
**Validates: Requirements 1.3, 1.5**

For any valid email and password combination, the system should:
- Accept valid email formats (containing @ and .)
- Accept passwords of at least 6 characters
- Normalize emails consistently to lowercase
- Handle email normalization idempotently

### Property 2: Invalid credentials are rejected with specific errors
**Validates: Requirements 1.4**

For any invalid credential input, the system should:
- Reject malformed email addresses
- Reject passwords shorter than 6 characters
- Reject empty or whitespace-only fields
- Provide consistent validation across all inputs

## Running Tests

```bash
npm test -- --testPathPatterns=auth.property.simple
```

## Test Framework

- **Jest**: Test runner
- **fast-check**: Property-based testing library (100 iterations per property)
- **@testing-library/react-native**: React Native testing utilities

## Known Issues

The full Expo testing environment has some configuration challenges with module imports. The simplified tests focus on the core authentication logic validation without requiring the full React Native/Expo environment.

## Future Improvements

1. Add integration tests with full Expo environment once module import issues are resolved
2. Add tests for token storage and retrieval
3. Add tests for session persistence across app restarts
4. Add tests for logout functionality (Property 19)
