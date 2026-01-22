import axios from "axios";

/**************************************************************************************************/

/**
 * @file        api.js
 * @description Configure and set an axios instance
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang, Jamila Tomines]
 * @created     10/09/2025
 * @license     -- tbd
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true
});

// Request interceptor: attach Authorization if token exists
api.interceptors.request.use(
  (config) => {
    const authState = sessionStorage.getItem("auth_state_v1");
    if (authState) {
      try {
        const parsed = JSON.parse(authState);
        if (parsed.accessToken && parsed.expiresAt > Date.now()) {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${parsed.accessToken}`;
        }
      } catch (error) {
        console.warn("Failed to parse auth state:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- AUTH API ---
export const authApi = {

  token: (code, codeVerifier) => api.post(
    '/auth/token',
    { code, codeVerifier },
    { withCredentials: true }
  ),

  logout: () => api.post("/auth/logout", {}, { withCredentials: true }),
}

// --- PROFILE API ---
export const profileApi = {

  get: (userId) => api.get(`/profile/${userId}`).then(r => r.data),
};

// --- MARKETPLACE API ---
export const marketplaceApi = {

  list: (params) => api.get("/marketplace", { params }).then(r => r.data),


  getByArtworkId: (artworkId) => api.get(`/marketplace/artwork/${artworkId}`).then(r => r.data),


  listByArtistId: (artistId) => api.get(`/marketplace/artist/${artistId}`).then(r => r.data),


  updatePrice: (artworkId, price) =>
    api.put(`/marketplace/${artworkId}`, { price }).then(r => r.data),


  deleteById: (artworkId) =>
    api.delete(`/marketplace/${artworkId}`).then(r => r.data),
};

// --- REGISTRY API ---
export const registryApi = {
  // params: { offset, limit }

  list: (params) =>
    api.get(`/registry`, { params }).then(r => r.data),


  getById: (artworkId) =>
    api.get(`/registry/artwork/${artworkId}`).then(r => r.data),


  // payload: Artwork metadata
  create: (form, config) =>
    api.post("/registry", form, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(r => r.data),


  toggle: (artworkId) =>
    api.put(`/toggle/${artworkId}`).then(r => r.data),

  // Can only update the visibility(toggle) and listed status(public_record) of an artwork

  updateById: (artworkId, updates) =>
    api.put(`/registry/artwork/${artworkId}`, updates).then(r => r.data),

  deleteById: (artworkId) =>
    api.delete(`/registry/artwork/${artworkId}`).then(r => r.data)
};

// --- OFFER API ---
export const offerApi = {
  listReceived: () => api.get("/offer/received").then(r => r.data),

  listReceivedByArtwork: (artworkId) => api.get(`/offer/received/${artworkId}`).then(r => r.data),

  listSent: () => api.get("/offer/sent").then(r => r.data),


  create: (artworkId, payload) =>
    api.post(`/offer/artwork/${artworkId}`, payload).then(r => r.data),

  accept: (offerId) =>
    api.put(`/offer/${offerId}/accept`).then(r => r.data),

  reject: (offerId) =>
    api.put(`/offer/${offerId}/reject`).then(r => r.data),

  cancel: (offerId) =>
    api.put(`/offer/${offerId}/cancel`).then(r => r.data),
};

// --- VERIFICATION API ---
export const verificationApi = {
  list: (params) => api.get("/verification", { params }).then(r => r.data),

  request: (artworkId, payload) =>
    api.post(`/verification/${artworkId}`, payload, {
      timeout: 600000
    })
      .then(r => r.data)
      .catch(function (error) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Upload timeout - file may be too large');
        }
        if (error.response?.status === 504) {
          throw new Error('Server timeout - verification is taking too long');
        }
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }),
};

export default api;