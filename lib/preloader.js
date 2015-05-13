/**
 * Preload an image and call a callback onload
 * @param src The source of the image to load
 * @param callback The function to call when the image is loaded
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