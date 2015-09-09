/**
 * Module to automatically swap image src's across css @media breakpoints
 * @param  {Object} options Options for module
 * @return {Object}         The SassQwatch object, for method chaining
 */
module.exports = function(options) {

  // Dependencies
  var
    sassqwatch      = require('./sassqwatch'),
    elementify      = require('./elementify'),
    preloader       = require('./preloader'),
    extend          = require('./extend'),
    getData         = require('./getData');

  // Module Variables
  var
    defaultSelector = elementify('.sassqwatch'),
    settings = extend({ selector: defaultSelector }, options),
    knownSizes = [],
    retina = (window.devicePixelRatio >= 1.5) ? true : false,
    i = 0;

  /**
   * Stores the image sources attached to each responsive image, making each check on mq change more effecient
   * @param  {Element} $image The element to receive the image sizes from
   */
  var storeSizes = function($image) {
    var
      src = getSource($image),
      sizes = {
        $image: $image,
        loaded: [],
        originalSrc: src,
        activeSrc: src
      };

    // merge the pre-existing sizes object with the object of image size urls
    sizes = extend(sizes, getData($image));
    // add the original src as a loaded src
    sizes.loaded.push(sizes.originalSrc);
    // add the sizes for this image to the known sizes
    knownSizes.push(sizes);
  };

  /**
   * Returns the source url on an element
   * @param  {Element} $el The element to get the source from
   * @return {String}      The source URL
   */
  var getSource = function ($el) {
    var src = '';
    // check if this the element is an img with a src
    // or is another element with a background image
    if ($el.tagName == 'IMG') {
      src = $el.getAttribute('src');
    } else {
      // get the computed style of the element
      src = getComputedStyle($el).getPropertyValue('background-image');
      // get the html css collection if getComputedStyle doesn't work
      src = src ? src : $el.style.backgroundImage;
      // remove the 'url()'
      src = src.replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
    }

    return src;
  };

  /**
   * Swap out either an <img>s source or the background image of an element.
   * @param  {Element} $el         The element that needs its source swapped
   * @param  {String}  newImageSrc The new src to show
   */
  var swapImage = function($el, newImageSrc) {
    if ($el.tagName === 'IMG') {
      $el.setAttribute('src', newImageSrc);
    } else {
      $el.style.backgroundImage = 'url(' + newImageSrc + ')';
    }
  };

  /**
   * Checks to see if there is a retina src provided on an image
   * @param  {object} imageObject An object in the array of known image sizes
   * @param  {string} mediaQuery  The name of the media query to check against
   * @return {string}             The image src
   */
  var checkForRetinaSrc = function(imageObject, mediaQuery) {
    // if this is a retina screen and there is a retina src
    if (retina && imageObject[mediaQuery + '-2x']) {
      return imageObject[mediaQuery + '-2x'];
    } else {
      return imageObject[mediaQuery];
    }
  };

  /**
   * Run through each responsive image and see if an image exists at that media query
   */
  var updateImages = function() {
    var
      isLoaded      = false,
      thisMQ        = undefined,
      thisImage     = undefined,
      newSource     = undefined,
      i             = 0,
      ii            = 0;

    // Loop over each known size
    // and update the image src if it has one for this breakpoint
    for(i; i < knownSizes.length; i++) {
      thisImage = knownSizes[i];
      // checks if we're on a retina screen and if there is a 2x src defined
      newSource = checkForRetinaSrc(thisImage, sassqwatch.current);

      // if a new source isn't set
      if (!newSource) {
        // get the index of the current media query to start from
        ii = sassqwatch.breakpoints.indexOf(sassqwatch.current);

        // decrement through the numbered mq's
        for (ii; ii > 0; ii--) {
          thisMQ = sassqwatch.breakpoints[ii];
          newSource = checkForRetinaSrc(thisImage, thisMQ);

          // break the loop if a source is found
          if (newSource) break;
        }
        // if after all that no source was found
        // then just revert back to the original source
        newSource = newSource ? newSource : thisImage.originalSrc;
      }

      // if the new source is not the active source
      if (newSource.indexOf(thisImage.activeSrc) === -1) {
        ii = 0;

        // loop over all loaded src's for this image
        // and see if the new source has been loaded
        for(ii; ii < thisImage.loaded.length; ii++) {
          if (thisImage.loaded[ii].indexOf(newSource) != -1) {
            isLoaded = true;
            break;
          }
        };

        // if the new source has been loaded
        if (isLoaded) {
          swapImage(thisImage.$image, newSource);
        } else {
          // preload the image to swap
          // and update the list of loaded src's
          preloader(newSource, thisImage, function(src, obj) {
            swapImage(obj.$image, src);
            obj.loaded.push(src);
          });
        }

        // update the active src
        thisImage.activeSrc = newSource;
      }
    };
  };

  // if a custom 'el' has been passed in
  // make sure that it is actually a jquery element
  // before initializing the module
  if (settings.selector !== defaultSelector) {
    settings.selector = elementify(settings.selector);
  }

  // Loop through each element and store its original source
  for(i; i < settings.selector.length; i++) {
    storeSizes(settings.selector[i]);
  }

  updateImages();

  // Listen for media query changes
  sassqwatch.onChange(updateImages);

  return sassqwatch;
};