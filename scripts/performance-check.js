#!/usr/bin/env node

/**
 * Performance Check Script
 * 
 * This script analyzes the codebase for common performance issues
 * and provides recommendations.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, checks) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];

  checks.forEach(check => {
    if (check.test(content)) {
      issues.push(check.message);
    }
  });

  return issues;
}

function scanDirectory(dir, pattern, checks) {
  const results = {};
  
  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scan(filePath);
      } else if (stat.isFile() && pattern.test(file)) {
        const issues = checkFile(filePath, checks);
        if (issues.length > 0) {
          results[filePath] = issues;
        }
      }
    });
  }
  
  scan(dir);
  return results;
}

// Performance checks
const performanceChecks = [
  {
    test: (content) => /renderItem=\{[^}]*\{/.test(content) && !/useCallback/.test(content),
    message: 'FlatList renderItem should use useCallback to prevent re-renders',
  },
  {
    test: (content) => /<Image[^>]*source=\{\{[^}]*uri:/.test(content) && !content.includes('expo-image'),
    message: 'Consider using expo-image instead of React Native Image for better caching',
  },
  {
    test: (content) => /style=\{[^}]*\{[^}]*\}[^}]*\}/.test(content) && !/useMemo|StyleSheet/.test(content),
    message: 'Inline style objects should be memoized or moved to StyleSheet',
  },
  {
    test: (content) => /<FlatList/.test(content) && !/initialNumToRender/.test(content),
    message: 'FlatList should specify initialNumToRender for better performance',
  },
  {
    test: (content) => /<ScrollView/.test(content) && content.includes('map(') && !/<FlatList/.test(content),
    message: 'Consider using FlatList instead of ScrollView with map for better virtualization',
  },
];

// Run checks
log('\n🔍 Running Performance Checks...\n', 'cyan');

const results = scanDirectory(
  process.cwd(),
  /\.(tsx|ts|jsx|js)$/,
  performanceChecks
);

// Display results
let totalIssues = 0;
Object.entries(results).forEach(([file, issues]) => {
  log(`\n📄 ${file}`, 'blue');
  issues.forEach(issue => {
    log(`  ⚠️  ${issue}`, 'yellow');
    totalIssues++;
  });
});

// Summary
log('\n' + '='.repeat(60), 'cyan');
if (totalIssues === 0) {
  log('✅ No performance issues found!', 'green');
} else {
  log(`⚠️  Found ${totalIssues} potential performance issue(s)`, 'yellow');
  log('\nThese are suggestions, not errors. Review each case individually.', 'reset');
}
log('='.repeat(60) + '\n', 'cyan');

// Bundle size check
log('📦 Bundle Size Recommendations:\n', 'cyan');
log('  • Run: npx react-native-bundle-visualizer', 'reset');
log('  • Check for large dependencies', 'reset');
log('  • Consider code splitting for large features', 'reset');
log('  • Use dynamic imports for rarely-used modules\n', 'reset');

// Memory check
log('💾 Memory Optimization Tips:\n', 'cyan');
log('  • Profile with React DevTools', 'reset');
log('  • Check for memory leaks with useEffect cleanup', 'reset');
log('  • Monitor FlatList with long lists', 'reset');
log('  • Use removeClippedSubviews on Android\n', 'reset');

process.exit(totalIssues > 0 ? 1 : 0);
