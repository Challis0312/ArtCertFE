// Mock for authContext
const useAuth = jest.fn(() => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
  setTokens: jest.fn(),
}));

const AuthProvider = ({ children }) => children;

module.exports = {
  useAuth,
  AuthProvider,
};
