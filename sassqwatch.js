require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

module.exports = function(el) {
  return (typeof el === 'string') ? $(el) : el;
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/**
 * Preload an image and call a callback onload
 * @param src The source of the image to load
 * @param callback The function to call when the image is loaded
 */
var preloader = function(src, callback) {
  var
    loaded = false,
    img = new Image();

  var loadHandler = function() {
    if (loaded) {
      return;
    }
    loaded = true;
    callback(src);
    img = null;
  };

  img.addEventListener('load', loadHandler);
  img.src = src;
  if (img.complete) {
    loadHandler();
  }
};

module.exports = preloader;
},{}],3:[function(require,module,exports){
(function (global){
/**
 * Module to automatically swap image src's across css @media breakpoints
 */

module.exports = function(options) {

  // Dependencies
  var
    $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
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
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./elementify":1,"./preloader":2,"./sassqwatch":"sassqwatch","./toDashed":5}],4:[function(require,module,exports){
var jq_throttle;

exports.throttle = jq_throttle = function( delay, no_trailing, callback, debounce_mode ) {
  // After wrapper has stopped being called, this timeout ensures that
  // `callback` is executed at the proper times in `throttle` and `end`
  // debounce modes.
  var timeout_id,
    
    // Keep track of the last time `callback` was executed.
    last_exec = 0;
  
  // `no_trailing` defaults to falsy.
  if ( typeof no_trailing !== 'boolean' ) {
    debounce_mode = callback;
    callback = no_trailing;
    no_trailing = undefined;
  }
  
  // The `wrapper` function encapsulates all of the throttling / debouncing
  // functionality and when executed will limit the rate at which `callback`
  // is executed.
  function wrapper() {
    var that = this,
      elapsed = +new Date() - last_exec,
      args = arguments;
    
    // Execute `callback` and update the `last_exec` timestamp.
    function exec() {
      last_exec = +new Date();
      callback.apply( that, args );
    };
    
    // If `debounce_mode` is true (at_begin) this is used to clear the flag
    // to allow future `callback` executions.
    function clear() {
      timeout_id = undefined;
    };
    
    if ( debounce_mode && !timeout_id ) {
      // Since `wrapper` is being called for the first time and
      // `debounce_mode` is true (at_begin), execute `callback`.
      exec();
    }
    
    // Clear any existing timeout.
    timeout_id && clearTimeout( timeout_id );
    
    if ( debounce_mode === undefined && elapsed > delay ) {
      // In throttle mode, if `delay` time has been exceeded, execute
      // `callback`.
      exec();
      
    } else if ( no_trailing !== true ) {
      // In trailing throttle mode, since `delay` time has not been
      // exceeded, schedule `callback` to execute `delay` ms after most
      // recent execution.
      // 
      // If `debounce_mode` is true (at_begin), schedule `clear` to execute
      // after `delay` ms.
      // 
      // If `debounce_mode` is false (at end), schedule `callback` to
      // execute after `delay` ms.
      timeout_id = setTimeout( debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay );
    }
  };
  
  // Return the wrapper function.
  return wrapper;
};

exports.debounce = function( delay, at_begin, callback ) {
  return callback === undefined
    ? jq_throttle( delay, at_begin, false )
    : jq_throttle( delay, callback, at_begin !== false );
};
},{}],5:[function(require,module,exports){
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
},{}],"sassqwatch":[function(require,module,exports){
(function (global){

// Dependencies
var
  $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null),
  td = require('./throttleDebounce');

// SassQwatch object
var sassqwatch = {};

// Elements
var
  $window = $(window),
  $body = $('body'),
  $orderElement = $('title'),
  $listenElement = $('head');

// Module variables
var
  currentMediaQuery = '',
  mqOrderNamed = {},
  mqOrderNumbered = [];

/**
 * Internal: Checks if the media query name is a match
 * @param which The media query to check against
 */
var matches = function(which) {
  // See if the current media query matches the requested one
  return (fetchMediaQuery() == which);
};

/**
 * Internal: When the browser is resized, update the media query
 */
var onResize = function () {
  var lastMediaQuery = currentMediaQuery;

  // Set the global current media query
  currentMediaQuery = fetchMediaQuery();

  // The media query does not match the old
  if (currentMediaQuery != lastMediaQuery) {
    // Fire an event noting that the media query has changed
    $listenElement.trigger('mediaQueryChange', [currentMediaQuery, lastMediaQuery]);
  }
};

/**
 * Internal: Sets the order of media queries
 */
var setOrder = function () {
  var mediaQueries = $orderElement.css('font-family');
  mqOrderNumbered = mediaQueries.replace(/['"\s]/g, "").split(',');

  $.each(mqOrderNumbered, function(index, value) {
    mqOrderNamed[value] = index;
  });
};

var onMediaQueryChange = function(callback) {
  $listenElement.on('mediaQueryChange', function(e, newMediaQuery, oldMediaQuery) {
    callback(newMediaQuery, oldMediaQuery);
  });
};

/**
 * Public: Checks if the media query is greater than the specified
 * @param which The media query to check against
 */
var isAbove = function (which) {
  var currentMq = mqOrderNamed[fetchMediaQuery()],
    whichMq = mqOrderNamed[which];

  return (currentMq >= whichMq);
};

/**
 * Public: Checks if the media query is less than the specified
 * @param which The media query to check against
 */
var isBelow = function (which) {
  var currentMq = mqOrderNamed[fetchMediaQuery()],
    whichMq = mqOrderNamed[which];

  return (currentMq < whichMq);
};

/**
 * Public: Read in the media query
 */
var fetchMediaQuery = function() {
  // We read in the media query name from the html element's font family
  var mq = $listenElement.css('font-family');

  // Strip out quotes and commas
  mq = mq.replace(/['",]/g, '');

  return mq;
};

/**
 * Public: Fetch the index of a named breakpoint
 * @param mediaQuery A string referencing the desired breakpoint
 */
var fetchMqIndex = function(mediaQuery) {
  return mqOrderNamed[mediaQuery];
};

/**
 * Public: Fetch the name of a breakpoint by its index
 * @param index An integer referencing the desired breakpoint in the order
 */
var fetchMqName = function(index) {
  return mqOrderNumbered[index];
};

/**
 * Public: Turn throttling ON for more effecient resizing events
 */
var throttleOn = function(duration) {
  $window.on('resize.throttle', td.throttle(duration || 250, onResize));
  $window.off('resize.no-throttle');
  return this;
};

/**
 * Public: Turn throttling OFF for precise resizing events
 */
var throttleOff = function() {
  $window.on('resize.no-throttle', onResize);
  $window.off('resize.throttle');
  return this;
};

/**
 * Public: Responsive Images module
 */
var responsiveImages = require('./responsiveImages');

/**
 * Set everything up
 */
(function() {
  // set the order of the breakpoints
  setOrder();

  // fetch the current media query
  currentMediaQuery = fetchMediaQuery();

  // no resize throttling by default
  throttleOff();

  // bundle up the public properties & methods
  sassqwatch = {
    onMediaQueryChange: onMediaQueryChange,
    fetchMediaQuery: fetchMediaQuery,
    fetchMqIndex: fetchMqIndex,
    fetchMqName: fetchMqName,
    isAbove: isAbove,
    isBelow: isBelow,
    throttleOn: throttleOn,
    throttleOff: throttleOff,
    responsiveImages: responsiveImages
  };

  module.exports = sassqwatch;
})();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./responsiveImages":3,"./throttleDebounce":4}]},{},[]);
