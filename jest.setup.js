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

// Mock the storage utility
const mockStorage = {
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/lib/storage', () => ({
  __esModule: true,
  default: mockStorage,
}));

// Export for test access
global.mockStorage = mockStorage;

// Mock expo modules to prevent import errors
global.__ExpoImportMetaRegistry = {};
global.structuredClone = global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock font functions
jest.mock('@/hooks/useFonts', () => ({
  useAppFonts: jest.fn(() => ({ loaded: true, error: null })),
  getCarattereFont: jest.fn(() => 'Carattere'),
  getInstrumentSansFont: jest.fn(() => 'InstrumentSans'),
  FONT_FILES: {},
}));

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

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn().mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    }),
    addEventListener: jest.fn(() => jest.fn()),
  },
}));

// Suppress console output during tests to reduce noise
// Tests can still verify console calls via spies if needed
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
