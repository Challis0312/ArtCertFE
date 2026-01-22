import React, { createContext, useContext, useEffect, useState } from "react";
import { generatePkce } from "../utils";
import { authApi } from "../services/api";

/**************************************************************************************************/

/**
 * @file        authContext.jsx
 * @description (demo)AuthContext provides a global authentication state for the app. It stores the 
 * current user and exposes login and logout functions. 
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     18/08/2025
 * @license     -- tbd
 */

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI;
const STORAGE_KEY = "auth_state_v1";

function base64urlDecode(input) {
  const pad = input.length % 4 ? "=".repeat(4 - (input.length % 4)) : "";
  const base64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64);
}

function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    return JSON.parse(base64urlDecode(parts[1]));
  } catch {
    return null;
  }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setIsReady(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.expiresAt > Date.now()) {
        setAccessToken(parsed.accessToken);
        setIdToken(parsed.idToken || null);
        setExpiresAt(parsed.expiresAt);
        const claims = decodeJwt(parsed.idToken);
        setUser(claims);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error parsing auth state:', error);
      sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (accessToken && expiresAt) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken,
          idToken,
          expiresAt,
        })
      );
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [accessToken, idToken, expiresAt]);

  const setTokens = ({ access_token, id_token, expiresIn }) => {
    setAccessToken(access_token);
    setIdToken(id_token || null);

    const claims = decodeJwt(id_token);
    const expMs = claims?.exp
      ? claims.exp * 1000
      : Date.now() + (expiresIn || 3600) * 1000;

    setExpiresAt(expMs);
    setUser(claims || null);
  }

  const login = async () => {
    const { codeVerifier, codeChallenge } = await generatePkce();
    sessionStorage.setItem("pkce_code_verifier", codeVerifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: "openid email phone profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    window.location.assign(`${COGNITO_DOMAIN}/login?${params.toString()}`);
  }

  const clear = () => {
    setAccessToken(null);
    setIdToken(null);
    setExpiresAt(null);
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const logout = async () => {
    try {
      // Call backend logout to clear server session & cookies
      await authApi.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      clear(); // always clear frontend state
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, setTokens, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
