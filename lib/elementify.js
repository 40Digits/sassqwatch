/**
 * Returns an element object from an element identifier
 * @param  {String} el An element identifier – Must be a class or ID reference
 * @return {Element}   The element object reference
 */
module.exports = function(el) {
  if (typeof el === 'string') {
    var identifier = el.slice(0, 1),
      string = el.slice(1, el.length);

    if (identifier == '.') {
      return document.getElementsByClassName(string);
    } else if (identifier == '#') {
      return document.getElementsById(string);
    }
  } else {
    return el;
  }
};