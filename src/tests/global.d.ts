declare namespace NodeJS {
  interface Global {
    chrome: any; // or a more specific type if available
    fetch: typeof jest.fn; // or a more specific type if available
  }
} 