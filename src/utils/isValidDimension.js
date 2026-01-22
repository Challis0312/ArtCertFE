/**************************************************************************************************/

/**
 * @file        isValidDimension.js
 * @description Check if a dimension is a valid positive integer.
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     22/08/2025
 * @license     -- tbd
 */

const isValidDimension = (value) => {
  const dimension = parseInt(value);
  return !isNaN(value) && dimension > 0;
};

export default isValidDimension;
