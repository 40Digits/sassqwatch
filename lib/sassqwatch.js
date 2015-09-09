// Polyfills
require('./forEach');

// Elements
var
  orderElement = document.getElementsByTagName('title')[0],
  listenElement = document.getElementsByTagName('head')[0];

// Module variables
var callbacks = { queue: [] };

/**
 * Internal: Creates a queue of functions to call when the media query changes. 
 * @param  {String}  currentMediaQuery The current media query.
 * @param  {String}  lastMediaQuery    The previous media query.
 */
callbacks.fire = function(currentMediaQuery, lastMediaQuery) {
  var i = 0;
  for(i; i < callbacks.queue.length; i++) {
    callbacks.queue[i].call(this, currentMediaQuery, lastMediaQuery);
  }
};

/**
 * Internal: When the browser is resized, update the media query
 */
function onResize() {
  // Set the last and current media queries
  exports.previous = exports.current;
  exports.current = exports.fetchMediaQuery();

  // The media query does not match the old
  if (exports.current !== exports.previous) {
    // Fire an event noting that the media query has changed
    callbacks.fire(exports.current, exports.previous);
  }
}

/**
 * Internal: Returns the order of media queries from the CSS
 */
function setOrder() {
  return getComputedStyle(orderElement).getPropertyValue('font-family').replace(/['"\s]/g, "").split(',');
}

/**
 * Internal: Returns the correct query method (isAbove, isBelow, or matches) given a string
 * @param  {String} type 'min', 'max', or 'only'
 * @return {Function}    The method.
 */
function getQueryMethod(type) {
  type = type.toLowerCase();

  if (type === 'min') {
    return exports.isAbove;
  } else if (type === 'max') {
    return exports.isBelow;
  } else if (type === 'only') {
    return exports.matches;
  } else {
    return function() {
      return false;
    }
  }
}

/**
 * Public: Manually returns the current media query
 */
exports.fetchMediaQuery = function() {
  // We read in the media query name from the html element's font family
  var mq = getComputedStyle(listenElement).getPropertyValue('font-family');

  // Strip out quotes and commas
  mq = mq.replace(/['",]/g, '');

  return mq;
};

/**
 * Public: Event fires when the media query changes
 * @param  {Function} callback The function to call when the media query changes
 * @return {Object}            The SassQwatch object
 */
exports.onChange = function(callback) {
  callbacks.queue.push(callback);
  return this;
};

/**
 * Public: A CSS-like query function to check against a min or max breakpoint. For convenience you can also query on a specific breakpoint.
 * @param  {String}   type     "min", "max", or "only"
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
exports.query = function(type, which, callback, fireOnce) {
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

  fireOnce = fireOnce ? fireOnce : true;
  check(exports.current, exports.previous);
  exports.onChange(check);

  return this;
};

/**
 * Public: A convenience function to call query with a 'min' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
exports.min = function(which, callback, fireOnce) {
  exports.query('min', which, callback, fireOnce);
  return this;
};

/**
 * Public: A convenience function to call query with a 'max' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
exports.max = function(which, callback, fireOnce) {
  exports.query('max', which, callback, fireOnce);
  return this;
};

/**
 * Public: A convenience function to call query with a 'only' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
exports.only = function(which, callback) {
  exports.query('only', which, callback);
  return this;
};

/**
 * Public: Checks if the current media query is greater than or equal to the specified breakpoint
 * @param  {String}  which The name of the media query to check against
 * @return {Boolean}       Is the current media query greater than or equal to the specified breakpoint?
 */
exports.isAbove = function (which, inclusive) {
  var currentMq = exports.breakpoints.indexOf(exports.current),
    whichMq = exports.breakpoints.indexOf(which);

  if (inclusive === false) {
    return (currentMq > whichMq);
  } else {
    return (currentMq >= whichMq);
  }
};

/**
 * Public: Checks if the current media query is less than the specified breakpoint
 * @param  {String}  which The name of the media query to check against
 * @return {Boolean}       Is the current media query less than the specified breakpoint?
 */
exports.isBelow = function (which, inclusive) {
  var currentMq = exports.breakpoints.indexOf(exports.current),
    whichMq = exports.breakpoints.indexOf(which);

  if (inclusive === true) {
    return (currentMq <= whichMq);
  } else {
    return (currentMq < whichMq);
  }
};

/**
 * Public: Checks if the current media query is the same as the the specified breakpoint
 * @param  {String}  which The name of the media query to check against
 * @return {Boolean}       Is the current media query the same as the specified breakpoint?
 */
exports.matches = function(which) {
  // See if the current media query matches the requested one
  return (exports.current == which);
};

// expose the responsiveImages module
exports.responsiveImages = require('./responsiveImages');

// setup the breakpoints
exports.breakpoints = setOrder();

// fetch the current media query
exports.current = exports.fetchMediaQuery();

exports.previous = '';

// handle resizing
window.onresize = onResize;