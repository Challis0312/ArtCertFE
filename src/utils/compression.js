/**************************************************************************************************/

/**
 * @file        compression.js
 * @description Gzip compression utilities.
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     05/10/2025
 * @license     -- tbd
 */

const gzipWithCompressionStream = async (file) => {
  if ('CompressionStream' in window) {
    const cs = new CompressionStream('gzip');
    const readableStream = file.stream();
    const writableStream = readableStream.pipeThrough(cs);
    const compressedFile = new Response(writableStream);
    return compressedFile.blob();
  }
  throw new Error('CompressionStream not supported');
};

export default gzipWithCompressionStream;