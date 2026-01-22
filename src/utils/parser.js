/**************************************************************************************************/

/**
 * @file        parser.js
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang, David Relacion]
 * @created     29/09/2025
 * @license     -- tbd
 */

export function parseDate(dateData) {
  const date = new Date(dateData);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
}


export function parseDateTime(isoString) {
  const date = new Date(isoString);
  // Format: DD/MM/YYYY

  return {
    date: date.toLocaleDateString("en-GB"),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }
}

export function parseDimensions(dimensionsString) {
  const match = dimensionsString.match(/([\d]+\.?[\d]*)x([\d]+\.?[\d]*)/);
  let width = 0, height = 0;
  if (match) {
    width = parseFloat(match[1]);
    height = parseFloat(match[2]);
  }

  return {
    width,
    height
  }
}