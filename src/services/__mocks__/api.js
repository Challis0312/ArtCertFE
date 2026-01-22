// Mock for api services
const authApi = {
  login: jest.fn(),
  logout: jest.fn(),
  token: jest.fn(),
  refresh: jest.fn(),
};

const registryApi = {
  create: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  list: jest.fn(),
};

const marketplaceApi = {
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  updatePrice: jest.fn(),
  deleteById: jest.fn(),
};

const offerApi = {
  create: jest.fn(),
  listSent: jest.fn(),
  listReceived: jest.fn(),
  listReceivedByArtwork: jest.fn(),
  accept: jest.fn(),
  reject: jest.fn(),
  cancel: jest.fn(),
};

const verificationApi = {
  request: jest.fn(),
  getStatus: jest.fn(),
};

const userApi = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
};

module.exports = {
  authApi,
  registryApi,
  marketplaceApi,
  offerApi,
  verificationApi,
  userApi,
};
