# Metro Bundler Fix Summary

## Issue Description

When running `npx expo start`, the app encountered Metro bundler errors:

1. **React version mismatch**: react@19.2.1 vs expected 19.1.0
2. **Module resolution failures**: 
   - Unable to resolve `expo-router/node/render.js`
   - Unable to resolve `@expo/metro-runtime/src/error-overlay/ErrorOverlay`

## Root Causes

### 1. React Version Incompatibility
- **Problem**: React 19.2.1 was installed, but Expo 54 expects React 19.1.0
- **Impact**: Peer dependency warnings and potential runtime issues

### 2. Metro Config Issue
- **Problem**: `disableHierarchicalLookup: true` in metro.config.js was preventing proper module resolution
- **Impact**: Metro couldn't find modules in node_modules, causing bundling failures

## Solutions Applied

### Fix 1: Downgrade React to Compatible Version

```bash
npm install react@19.1.0 react-dom@19.1.0 --save-exact
```

**Result**: React version now matches Expo 54 requirements

### Fix 2: Update Metro Configuration

**Before** (metro.config.js):
```javascript
config.resolver = {
  ...config.resolver,
  disableHierarchicalLookup: true, // ❌ Caused module resolution issues
};
```

**After** (metro.config.js):
```javascript
// Keep default resolver settings for better compatibility
// Removed disableHierarchicalLookup as it was causing module resolution issues
```

**Result**: Metro can now properly resolve modules from node_modules

### Fix 3: Clear All Caches

```bash
rm -r -fo node_modules\.cache
rm -r -fo .expo
npx expo start --clear
```

**Result**: Fresh start with no stale cache issues

## Verification

After applying fixes:
- ✅ Metro bundler starts successfully
- ✅ Web bundling completes without errors
- ✅ No module resolution errors
- ✅ React version warnings resolved

## Key Learnings

### 1. Version Compatibility Matters
Always use the exact versions recommended by Expo. Even minor version differences (19.1.0 vs 19.2.1) can cause issues.

### 2. Metro Config Optimizations Can Backfire
The `disableHierarchicalLookup` optimization was intended to improve performance but actually broke module resolution. Sometimes the default config is best.

### 3. Cache Clearing is Essential
When making dependency or config changes, always clear caches:
```bash
npx expo start --clear
```

## Testing vs Runtime

### Why Tests Passed But App Didn't Start

**Important Distinction**:
- **Jest tests** run in a Node.js environment with their own module resolution
- **Metro bundler** uses a different resolution algorithm for React Native

This means:
- ✅ Tests can pass with React 19.2.1
- ❌ Metro bundler fails with React 19.2.1

**Lesson**: Passing tests don't guarantee the app will bundle/run correctly. Always test the actual app startup.

## Prevention

### 1. Use Exact Versions
In package.json, use exact versions for critical dependencies:
```json
{
  "dependencies": {
    "react": "19.1.0",  // No ^ or ~
    "react-dom": "19.1.0"
  }
}
```

### 2. Follow Expo Recommendations
When Expo warns about version mismatches, address them immediately:
```
The following packages should be updated for best compatibility:
react@19.2.1 - expected version: 19.1.0
```

### 3. Test Metro Config Changes
When modifying metro.config.js, always test with `npx expo start --clear` to ensure bundling still works.

### 4. Keep Metro Config Simple
Avoid aggressive optimizations unless you've thoroughly tested them. The default Expo Metro config is well-tested and reliable.

## Commands Reference

### Check Dependency Versions
```bash
npm list expo-router @expo/metro-runtime react react-dom
```

### Clear Caches
```bash
# PowerShell
rm -r -fo node_modules\.cache
rm -r -fo .expo

# Bash
rm -rf node_modules/.cache
rm -rf .expo
```

### Start Fresh
```bash
npx expo start --clear
```

### Install Exact Versions
```bash
npm install package@version --save-exact
```

## Related Files

- `package.json` - Dependency versions
- `metro.config.js` - Metro bundler configuration
- `.expo/` - Expo cache directory
- `node_modules/.cache/` - Metro cache directory

## Status

✅ **RESOLVED** - Metro bundler now starts successfully with proper module resolution.

## Date

December 7, 2025
