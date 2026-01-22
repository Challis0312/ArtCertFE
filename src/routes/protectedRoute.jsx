import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useEffect } from 'react';

/**************************************************************************************************/

/**
 * @file        protectedRoute.jsx
 * @description 
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     18/08/2025
 * @license     -- tbd
 */

export default function ProtectedRoute() {
  const { user, login, isReady } = useAuth();

  if (!isReady) return <p>Loading...</p>;

  if (isReady && !user) login();

  return <Outlet />;
}