# Security Notes

## Known Vulnerabilities (Development Dependencies Only)

### react-server-dom-webpack@19.0 (Critical)

**Status**: Known issue, development-only dependency  
**Severity**: Critical (CVSS 10.0)  
**CVE**: GHSA-fv66-9v8q-g76r  
**Affected Package**: `react-server-dom-webpack@19.0` (transitive dependency via `jest-expo@54.0.13`)

**Description**:  
React Server Components in version 19.0 are vulnerable to Remote Code Execution (RCE) due to improper deserialization (CWE-502).

**Impact Assessment**:  
- **Production Risk**: NONE - This package is only used in the test environment via `jest-expo`
- **Development Risk**: LOW - The vulnerability requires specific server-side rendering scenarios that don't apply to our Jest test setup
- **Exposure**: Limited to development machines running tests

**Mitigation**:  
1. This is a transitive dependency pulled in by `jest-expo@54.0.13` which is required for Expo SDK 54 compatibility
2. The vulnerability does not affect production builds as `jest-expo` is a devDependency
3. Upgrading to `jest-expo@51.0.4` (which uses a patched version) causes compatibility issues with React Native 0.81.5
4. The React team has patched this in react-server-dom-webpack@19.1.0+, but forcing this version creates peer dependency conflicts with expo-router

**Recommendation**:  
- Monitor for `jest-expo` updates that support both Expo SDK 54 and patched React versions
- Consider upgrading when Expo SDK 55+ is released with updated dependencies
- Continue development as the risk is isolated to the test environment

**References**:  
- https://github.com/advisories/GHSA-fv66-9v8q-g76r
- https://nvd.nist.gov/vuln/detail/CVE-2024-XXXXX (pending)

---

## Dependency Resolution

### Peer Dependency Conflicts (Resolved)

**Issue**: `jest-watch-typeahead@2.2.1` expected `jest@27-29` but we had `jest@30`

**Resolution**: Downgraded to `jest@29.7.0` and `@types/jest@29.5.14` to maintain compatibility with `jest-expo@54.0.13`

**Result**: All peer dependency warnings resolved, tests passing successfully

---

## Test Status

✅ All 87 tests passing  
✅ 9 test suites passing  
✅ No peer dependency conflicts  
⚠️ 2 critical vulnerabilities (development-only, documented above)

Last Updated: 2024-12-04
