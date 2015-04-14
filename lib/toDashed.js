/**
 * Turns camelcase string into dashed
 * @param string The string to manipulate
 */
module.exports = function(string) {
  var
    words = [],
    currentChar = '',
    currentWord = '',
    i = 0;

  for (i; string.length >= i; i++) {
    currentChar = string.charAt(i);
    
    if ( currentChar === currentChar.toUpperCase() ) {
      words.push(currentWord);
      currentWord = currentChar.toLowerCase();
    } else {
      currentWord = currentWord + currentChar;
    }
  }
  
  return words.join('-');
};