/**************************************************************************************************/

/**
 * @file        pkce.js
 * @description PKCE flow helper functions
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     09/09/2025
 * @license     -- tbd
 */

export async function generatePkce() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
}

function generateCodeVerifier(length = 64) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const random = new Uint8Array(length);
  crypto.getRandomValues(random);
  return Array.from(random).map(b => charset[b % charset.length]).join("");
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64url(hash);
}

function base64url(buf) {
  const bytes = new Uint8Array(buf);
  let str = btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export default generatePkce;