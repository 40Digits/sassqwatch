/**
 * Module to automatically swap image src's across css @media breakpoints
 */

module.exports = function(options) {

  // Dependencies
  var
    $ = require('jquery'),
    sassqwatch = require('./sassqwatch'),
    toDashed = require('./toDashed'),
    elementify = require('./elementify'),
    preloader = require('./preloader');

  // Module Variables
  var
    defaultSelector = $('.sassqwatch'),
    settings = $.extend({
      selector: defaultSelector
    }, options),
    knownSizes = [];

  /**
   * Store the image sources attached to each responsive image, making each check on mq change more effecient
   * @param $image Which element to pull sizes from
   */
  var storeSizes = function($image) {
    var
      src = getSource($image),
      responsiveSrcs = $image.data(),
      sizes = {
        image: $image,
        loaded: [],
        originalSrc: src,
        activeSrc: src
      },
      mqName;

    // loop over all the data attr's on the image
    $.each(responsiveSrcs, function(key, value) {
      // jQuery turns data attr's into camelcase strings,
      // so make sure they are dashed instead
      mqName = toDashed(key);
      // make sure the stored src is an absolute url
      sizes[mqName] = value;
    });

    // add the sizes for this image to the array
    knownSizes.push(sizes);
  };

  /**
   * Return the current image source
   * @param $image Which element to store the source on
   */
  var getSource = function ($image) {
    var imageSrc;

    // check if this the element is an img with a src
    // or has a background image
    if ($image.is('img')) {
      imageSrc = $image.attr('src');
    } else {
      imageSrc = $image.css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
    }

    return imageSrc;
  };

  /**
   * Swap out either an <img>s source or the background image of another element.
   * @param $target The jQuery element you want to swap an image on
   * @param newImageSrc The source for the new image to use
   */
  var swapImage = function($target, newImageSrc) {
    if ($target.is('img')) {
        $target.attr('src', newImageSrc);
    } else {
      $target.css('background-image', 'url(' + newImageSrc + ')');
    }
  };

  /**
   * Run through each responsive image and see if an image exists at that media query
   * @param newMediaQuery [current] The new media query to load
   */
  var updateImages = function (newMediaQuery) {
    var isLoaded = false;

    // Default to the current media query - just run an update
    if (newMediaQuery == null) {
      newMediaQuery = sassqwatch.fetchMediaQuery();
    }

    // Loop over each known size
    // and update the image src if it has one for this breakpoint
    $.each(knownSizes, function (i) {
      var
        thisImage = knownSizes[i],
        newSource = thisImage[newMediaQuery];

      // if a new source isn't set
      if (!newSource) {
        var
          ii = sassqwatch.fetchMqIndex(newMediaQuery),
          thisMQ;

        // decrement through the numbered mq's
        for (ii; ii > 0; ii--) {
          thisMQ = sassqwatch.fetchMqName(ii);

          // if a matched mq is found on the image
          if (thisImage[thisMQ]) {
            newSource = thisImage[thisMQ];
            break;
          }
        }
        // if after all that no source was found
        // then just revert back to the original source
        newSource = newSource || thisImage.originalSrc;
      }

      // if the new source is not the active source
      if (newSource.indexOf(thisImage.activeSrc) === -1) {

        // loop over all loaded src's for this image
        // and see if the new source has been loaded
        $.each(thisImage.loaded, function(i) {
          if (thisImage.loaded[i].indexOf(newSource) > 0) {
            isLoaded = true;
            return;
          }
        });

        // if the new source has been loaded
        if (isLoaded) {
          swapImage(thisImage.image, newSource);
        } else {
          // preload the image to swap
          // and update the list of loaded src's
          preloader(newSource, function(src) {
            swapImage(thisImage.image, src);
            thisImage.loaded.push(src);
          });
        }

        // update the active src
        thisImage.activeSrc = newSource;
      }
    });
  };

  // if a custom 'el' has been passed in
  // make sure that it is actually a jquery element
  // before initializing the module
  if (settings.selector !== defaultSelector) {
    settings.selector = elementify(settings.selector);
  }

  // Loop through each element and store its original source
  settings.selector.each(function() {
    storeSizes($(this));
  });

  // Update the current responsive image size
  updateImages();

  // Listen for media query changes
  sassqwatch.onMediaQueryChange(updateImages);

  return sassqwatch;
};