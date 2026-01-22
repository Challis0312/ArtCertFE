/**************************************************************************************************/

/**
 * @file        isValidDate.js
 * @description Check if a date is valid (exists in the calendar).
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     18/08/2025
 * @license     -- tbd
 */

const isValidDate = (year, month, day) => {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    !isNaN(date.getTime()) &&
    date <= Date.now()
  );
};

export default isValidDate;
