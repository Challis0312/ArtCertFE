/**************************************************************************************************/

/**
 * @file        formatName.js
 * @description Format a name with first character capitalised and the remaining are lowercase.
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     18/08/2025
 * @license     -- tbd
 */

const formatName = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export default formatName;