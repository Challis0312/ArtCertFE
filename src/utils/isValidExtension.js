import allowedExtensions from "../config/fileExtensionsConfig";

/**************************************************************************************************/

/**
 * @file        isValidExtension.js
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     25/08/2025
 * @license     -- tbd
 */

const isValidExtension = (fileName) => {
  let extension = fileName.split('.').pop();
  return allowedExtensions.includes(extension);
};

export default isValidExtension;
