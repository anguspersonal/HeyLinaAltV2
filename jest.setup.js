// Mock expo modules that aren't available in test environment
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        supabase: {
          url: 'https://test.supabase.co',
          anonKey: 'test-anon-key',
        },
      },
    },
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock expo modules to prevent import errors
global.__ExpoImportMetaRegistry = {};
global.structuredClone = global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));

// Mock color scheme hook
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(() => 'dark'),
}));

// Mock Colors from theme
jest.mock('@/constants/theme', () => {
  const actualTheme = jest.requireActual('@/constants/theme');
  return {
    ...actualTheme,
    Colors: {
      light: {
        text: '#000',
        background: '#fff',
      },
      dark: {
        text: '#fff',
        background: '#000',
      },
    },
  };
});
