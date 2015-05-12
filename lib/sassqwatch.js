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
 * Public: A CSS-like query function to check against a min or max breakpoint. For convenience you can also query on a specific breakpoint.
 * @param  {String}   type     "min", "max", or "only"
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
var query = function(type, which, callback) {
  var check;

  switch (type.toLowerCase()) {
    case 'min':
      check = function(newMediaQuery) {
        if (isAbove(which)) {
          callback(newMediaQuery);
        }
      }
      break;
    case 'max':
      check = function(newMediaQuery) {
        if (isBelow(which)) {
          callback(newMediaQuery);
        }
      }
      break;
    case 'only':
      check = function(newMediaQuery, oldMediaQuery) {
        if (matches(which)) {
          callback(oldMediaQuery);
        }
      }
      break;
  }

  if (typeof check === 'function') {
    check(currentMediaQuery);
    onChange(check);
  }

  return this;
};

/**
 * Public: A convenience function to call query with a 'min' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
var min = function(which, callback) {
  query('min', which, callback);
  return this;
};

/**
 * Public: A convenience function to call query with a 'max' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
var max = function(which, callback) {
  query('max', which, callback);
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