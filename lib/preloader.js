/**
 * Preload an image and call a function onload
 * @param  {String}   src      The source url to preload
 * @param  {Object}   obj      An object to pass through for reference in the callback
 * @param  {Function} callback The function to call when the image is done loading
 */
var preloader = function(src, obj, callback) {
  var
    loaded = false,
    img = new Image();

  var loadHandler = function() {
    if (loaded) {
      return;
    }
    loaded = true;
    callback(src, obj);
    img = null;
  };

  img.addEventListener('load', loadHandler);
  img.src = src;
  if (img.complete) {
    loadHandler();
  }
};

module.exports = preloader;