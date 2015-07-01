require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
},{}],4:[function(require,module,exports){
/**
 * Returns the data attribute labels and values from a given element
 * @param  {Element} $el The element to get the data
 * @return {Object}      The data attributes
 */
module.exports = function($el) {
  if ($el.hasAttributes()) {
    var i = 0,
      data = {},
      mqName = '',
      attr;
    
    for(i; i < $el.attributes.length; i++) {
      attr = $el.attributes[i];
      
      if (attr.name.indexOf('data-') != -1) {
        mqName = attr.name.slice(5);
        data[mqName] = attr.value;
      }
    }
    
    return data;
  }
}
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"./elementify":1,"./extend":2,"./getData":4,"./preloader":5,"./sassqwatch":"sassqwatch"}],"sassqwatch":[function(require,module,exports){
// Polyfills
require('./forEach');

// Elements
var
  $body              = document.getElementsByTagName('body')[0],
  $orderElement      = document.getElementsByTagName('title')[0],
  $listenElement     = document.getElementsByTagName('head')[0];

// Module variables
var
  currentMediaQuery  = '',
  lastMediaQuery     = '',
  mqOrderNamed       = {},
  mqOrderNumbered    = [],
  callbackQueue      = [];

/**
 * Internal: Creates a queue of functions to call when the media query changes. 
 * @param  {String}  currentMediaQuery The current media query.
 * @param  {String}  lastMediaQuery    The previous media query.
 */
var hasChanged = function(currentMediaQuery, lastMediaQuery) {
  var i = 0;
  for(i; i < callbackQueue.length; i++) {
    callbackQueue[i].call(this, currentMediaQuery, lastMediaQuery);
  }
};

/**
 * Internal: When the browser is resized, update the media query
 */
var onResize = function() {
  lastMediaQuery = currentMediaQuery;

  // Set the global current media query
  currentMediaQuery = fetchMediaQuery();

  // The media query does not match the old
  if (currentMediaQuery != lastMediaQuery) {
    // Fire an event noting that the media query has changed
    hasChanged(currentMediaQuery, lastMediaQuery);
  }
};

/**
 * Internal: Sets the order of media queries
 */
var setOrder = function() {
  var mediaQueries = getComputedStyle($orderElement).getPropertyValue('font-family');
  mqOrderNumbered = mediaQueries.replace(/['"\s]/g, "").split(',');

  mqOrderNumbered.forEach(function(value, index) {
    mqOrderNamed[value] = index;
  });
};

/**
 * Public: Event fires when the media query changes
 * @param  {Function} callback The function to call when the media query changes
 * @return {Object}            The SassQwatch object
 */
var onChange = function(callback) {
  callbackQueue.push(callback);
  return this;
};

/**
 * Internal: Returns the correct query method (isAbove, isBelow, or matches) given a string
 * @param  {String} type 'min', 'max', or 'only'
 * @return {Function}    The method.
 */
var getQueryMethod = function(type) {
  type = type.toLowerCase();

  if (type === 'min') {
    return isAbove;
  } else if (type === 'max') {
    return isBelow;
  } else if (type === 'only') {
    return matches;
  } else {
    return function() {
      return false;
    }
  }
};

/**
 * Public: A CSS-like query function to check against a min or max breakpoint. For convenience you can also query on a specific breakpoint.
 * @param  {String}   type     "min", "max", or "only"
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
var query = function(type, which, callback, fireOnce) {
  var
    firedCount = 0,
    method = getQueryMethod(type),
    check = function(newMediaQuery, oldMediaQuery) {
      if (method(which)) {
        // Prevent the callback from firing again
        // if the condition was previously true
        if (!!fireOnce && firedCount > 0) {
          return false;
        }
        callback(newMediaQuery, oldMediaQuery);
        firedCount++;
      } else {
        firedCount = 0;
        return false;
      }
    };

  check(currentMediaQuery, lastMediaQuery);
  onChange(check);

  return this;
};

/**
 * Public: A convenience function to call query with a 'min' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
var min = function(which, callback, fireOnce) {
  query('min', which, callback, fireOnce);
  return this;
};

/**
 * Public: A convenience function to call query with a 'max' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
var max = function(which, callback, fireOnce) {
  query('max', which, callback, fireOnce);
  return this;
};

/**
 * Public: A convenience function to call query with a 'only' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
var only = function(which, callback) {
  query('only', which, callback);
  return this;
};

/**
 * Public: Checks if the current media query is greater than or equal to the specified breakpoint
 * @param  {String}  which The name of the media query to check against
 * @return {Boolean}       Is the current media query greater than or equal to the specified breakpoint?
 */
var isAbove = function (which) {
  var currentMq = mqOrderNamed[fetchMediaQuery()],
    whichMq = mqOrderNamed[which];

  return (currentMq >= whichMq);
};

/**
 * Public: Checks if the current media query is less than the specified breakpoint
 * @param  {String}  which The name of the media query to check against
 * @return {Boolean}       Is the current media query less than the specified breakpoint?
 */
var isBelow = function (which) {
  var currentMq = mqOrderNamed[fetchMediaQuery()],
    whichMq = mqOrderNamed[which];

  return (currentMq < whichMq);
};

/**
 * Public: Checks if the current media query is the same as the the specified breakpoint
 * @param  {String}  which The name of the media query to check against
 * @return {Boolean}       Is the current media query the same as the specified breakpoint?
 */
var matches = function(which) {
  // See if the current media query matches the requested one
  return (fetchMediaQuery() == which);
};

/**
 * Public: Manually returns the current media query
 */
var fetchMediaQuery = function() {
  // We read in the media query name from the html element's font family
  var mq = getComputedStyle($listenElement).getPropertyValue('font-family');

  // Strip out quotes and commas
  mq = mq.replace(/['",]/g, '');

  return mq;
};

/**
 * Public: Fetch the index of a named breakpoint
 * @param  {String} mediaQuery The name of the media query
 * @return {Number}            The index of the media query in the array of ordered media queries
 */
var fetchMqIndex = function(mediaQuery) {
  return mqOrderNamed[mediaQuery];
};

/**
 * Public: Fetch the name of breakpoint by its index
 * @param  {Number} index The index of the media query in the ordered array of media queries
 * @return {String}       The name of the media query
 */
var fetchMqName = function(index) {
  return mqOrderNumbered[index];
};

/**
 * Public: Responsive Images module
 */
var responsiveImages = require('./responsiveImages');

/**
 * Internal: Immediately invoked constructor function
 * Sets everything up and then returns all the public methods.
 */
var constructor = function() {
  // set the order of the breakpoints
  setOrder();

  // fetch the current media query
  currentMediaQuery = fetchMediaQuery();

  window.onresize = onResize;

  // return the public methods
  return {
    responsiveImages:   responsiveImages,
    fetchMediaQuery:    fetchMediaQuery,
    fetchMqIndex:       fetchMqIndex,
    fetchMqName:        fetchMqName,
    onChange:           onChange,
    isAbove:            isAbove,
    isBelow:            isBelow,
    matches:            matches,
    query:              query,
    only:               only,
    min:                min,
    max:                max
  };
}.call();

module.exports = constructor;
},{"./forEach":3,"./responsiveImages":6}]},{},[]);
