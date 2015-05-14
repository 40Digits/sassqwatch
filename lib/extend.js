/**
 * Returns a new merged object from two objects
 * @param  {Object} obj1 The object to extend
 * @param  {Object} obj2 The object to merge into the original
 * @return {Object}      The merged object
 */
module.exports = function(obj1, obj2) {
  for(key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
}