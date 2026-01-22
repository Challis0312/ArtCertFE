import { TextEncoder, TextDecoder } from 'util';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

// Mock import.meta for Jest
global.importMeta = {
  env: {
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_COGNITO_DOMAIN: 'test-cognito-domain',
    VITE_COGNITO_CLIENT_ID: 'test-client-id',
    VITE_COGNITO_REDIRECT_URI: 'http://localhost:5173/callback',
  }
};