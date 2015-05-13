/**
 * Module to automatically swap image src's across css @media breakpoints
 */
module.exports = function(options) {

  // Dependencies
  var
    sassqwatch      = require('./sassqwatch'),
    toDashed        = require('./toDashed'),
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
   * Store the image sources attached to each responsive image, making each check on mq change more effecient
   * @param $image Which element to pull sizes from
   */
  var storeSizes = function($image) {
    var
      src = getSource($image),
      sizes = {
        $image: $image,
        loaded: [],
        originalSrc: src,
        activeSrc: src
      },
      mqName;

    extend(sizes, getData($image));

    sizes.loaded.push(sizes.originalSrc);

    // add the sizes for this image to the array
    knownSizes.push(sizes);
  };

  /**
   * Return the current image source
   * @param $image Which element to store the source on
   */
  var getSource = function ($image) {
    var src = '';
    // check if this the element is an img with a src
    // or has a background image
    if ($image.tagName == 'IMG') {
      src = $image.getAttribute('src');
    } else {
      // get the computed style of the element
      src = getComputedStyle($image).getPropertyValue('background-image');
      // get the html css collection if getComputedStyle doesn't work
      src = src ? src : $image.style.backgroundImage;
      // remove the 'url()'
      src = src.replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
    }

    return src;
  };

  /**
   * Swap out either an <img>s source or the background image of another element.
   * @param $target The jQuery element you want to swap an image on
   * @param newImageSrc The source for the new image to use
   */
  var swapImage = function($target, newImageSrc) {
    if ($target.tagName === 'IMG') {
      $target.setAttribute('src', newImageSrc);
    } else {
      $target.style.backgroundImage = 'url(' + newImageSrc + ')';
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
   * @param newMediaQuery [current] The new media query to load
   */
  var updateImages = function() {
    var
      newMediaQuery = sassqwatch.fetchMediaQuery(),
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
      newSource = checkForRetinaSrc(thisImage, newMediaQuery);

      // if a new source isn't set
      if (!newSource) {
        // get the index of the current media query to start from
        ii = sassqwatch.fetchMqIndex(newMediaQuery);

        // decrement through the numbered mq's
        for (ii; ii > 0; ii--) {
          thisMQ = sassqwatch.fetchMqName(ii);
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
            // swap out the src on the first item in the waiting list
            swapImage(obj.$image, src);
            // store this src as loaded
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