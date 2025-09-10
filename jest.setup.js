// Mock Expo modules that might be causing issues
jest.mock('expo', () => ({}));
jest.mock('expo-router', () => ({}));
jest.mock('expo-constants', () => ({}));
jest.mock('expo-font', () => ({}));
jest.mock('expo-splash-screen', () => ({}));
jest.mock('expo-status-bar', () => ({}));
jest.mock('expo-haptics', () => ({}));
jest.mock('expo-image', () => ({}));
jest.mock('expo-linking', () => ({}));
jest.mock('expo-blur', () => ({}));
jest.mock('expo-symbols', () => ({}));

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn(),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn(),
  },
  View: 'View',
  Text: 'Text',
  ScrollView: 'ScrollView',
  TouchableOpacity: 'TouchableOpacity',
  Image: 'Image',
  TextInput: 'TextInput',
  FlatList: 'FlatList',
  ActivityIndicator: 'ActivityIndicator',
  Alert: {
    alert: jest.fn(),
  },
  NativeModules: {},
  TurboModuleRegistry: {
    getEnforcing: jest.fn(() => ({})),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();
