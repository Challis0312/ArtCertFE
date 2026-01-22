import React, { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/authContext';
import { authApi } from '../services/api';

/**************************************************************************************************/

/**
 * @file        authCallback.jsx
 * @description Authentication callback component
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     09/09/2025
 * @license     -- tbd
 */

const AuthCallback = () => {
  const [params] = useSearchParams();
  const { setTokens } = useAuth();
  const navigate = useNavigate();
  const fired = useRef(false);

  useEffect(() => {
    const code = params.get('code');
    if (fired.current || !code) return;

    const codeVerifier = sessionStorage.getItem('pkce_code_verifier');// get state from backend to prevent CSRF attack
    if (!codeVerifier) {
      navigate("/login?error=session-expired", { replace: true });
      return;
    }

    fired.current = true;

    authApi.token(code, codeVerifier)
      .then((res) => {
        sessionStorage.removeItem('pkce_code_verifier');
        setTokens(res.data);
        navigate('/registry')
      })
      .catch((err) => {
        console.error("Callback error: ", err);
        navigate("/login?error=callback", { replace: true });
      })

  }, [params, navigate, setTokens])

  return (
    <p>Signing in...</p>
  )
}

export default AuthCallback