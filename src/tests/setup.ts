import '@testing-library/jest-dom';

declare global {
  namespace NodeJS {
    interface Global {
      chrome: any;
      fetch: typeof jest.fn;
    }
  }
}

// Mock chrome API
const mockChrome = {
  storage: {
    local: {
      get: jest.fn().mockResolvedValue({}),
      set: jest.fn().mockResolvedValue(undefined),
    },
    sync: {
      get: jest.fn().mockResolvedValue({}),
      set: jest.fn().mockResolvedValue(undefined),
    },
  },
  alarms: {
    create: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
  },
  notifications: {
    create: jest.fn().mockResolvedValue(undefined),
  },
  runtime: {
    sendMessage: jest.fn().mockResolvedValue(undefined),
    onMessage: {
      addListener: jest.fn(),
    },
  },
};

global.chrome = mockChrome as any;
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
}); 