import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./contexts/authContext.jsx";
import App from "./App.jsx";

/**************************************************************************************************/

/**
 * @file        main.jsx
 * @description
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Joshua El-Khoury]
 * @created     11/08/2025
 * @license     -- tbd
 */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
