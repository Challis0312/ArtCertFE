import { useState, useEffect } from "react";

/**************************************************************************************************/

/**
 * @file        useWindowWidth.jsx
 * @description (demo)Tracks the size of the window
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     18/08/2025
 * @license     -- tbd
 */

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default useWindowWidth;