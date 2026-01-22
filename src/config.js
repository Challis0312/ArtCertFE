/**************************************************************************************************/

/**
 * @file        config.js
 * @description 
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Joshua El-Khoury, Jamila Tomines]
 * @created     11/08/2025
 * @license     -- tbd
 */
const config = {
    PIXELS_PER_REM: parseInt(import.meta.env.VITE_PIXELS_PER_REM) || 16,
}

export default config;