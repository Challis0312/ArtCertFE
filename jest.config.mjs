export default {
  // Use jsdom to simulate a browser environment
  testEnvironment: "jsdom",

  // Tell Jest how to handle JSX/TSX files
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },

  // Extensions Jest should recognize
  moduleFileExtensions: ["js", "jsx", "json", "node"],

  // Run this file before each test suite (for TextEncoder, fetch, etc.)
  setupFiles: ["<rootDir>/jest.setup.js"],

  // Ignore transforming everything in node_modules except modules you need
  transformIgnorePatterns: [
    "node_modules/(?!(react-router|react-router-dom)/)"
  ],

  // Mock static assets like images, CSS
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/tests/__mocks__/fileMock.js",
  },
};