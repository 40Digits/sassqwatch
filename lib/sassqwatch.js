// Dependencies
var
  $ = require('jquery'),

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
var onResize = function() {
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
var setOrder = function() {
  var mediaQueries = $orderElement.css('font-family');
  mqOrderNumbered = mediaQueries.replace(/['"\s]/g, "").split(',');

  $.each(mqOrderNumbered, function(index, value) {
    mqOrderNamed[value] = index;
  });
};

/**
 * Public: Event fires when the media query changes
 * @param callback - The function to call when the event is fired
 */
var onMediaQueryChange = function(callback) {
  $listenElement.on('mediaQueryChange', function(e, newMediaQuery, oldMediaQuery) {
    callback(newMediaQuery, oldMediaQuery);
  });
  return this;
};

/**
 * Public: A CSS-like query function to check against a min or max breakpoint. For convenience you can also query on a specific breakpoint.
 * @param type - A string "min", "max", or "on"
 * @param which - The media query to check against
 * @param callback - The function to call when the event is fired
 */
var query = function(type, which, callback) {
  var check;

  switch (type.toLowerCase()) {
    case 'min':
      check = function(e, newMediaQuery) {
        if (isAbove(which)) {
          callback(newMediaQuery);
        }
      }
      break;
    case 'max':
      check = function(e, newMediaQuery) {
        if (isBelow(which)) {
          callback(newMediaQuery);
        }
      }
      break;
    case 'only':
      check = function(e, newMediaQuery, oldMediaQuery) {
        if (matches(which)) {
          callback(oldMediaQuery);
        }
      }
      break;
  }

  if (typeof check === 'function') {
    check();
    $listenElement.on('mediaQueryChange', check);
  }

  return this;
};

/**
 * Public: A convenience function to call query with a 'min' value
 * @param which - The media query to check against
 * @param callback - The function to call when the event is fired
 */
var min = function(which, callback) {
  query('min', which, callback);
  return this;
};

/**
 * Public: A convenience function to call query with a 'max' value
 * @param which - The media query to check against
 * @param callback - The function to call when the event is fired
 */
var max = function(which, callback) {
  query('max', which, callback);
  return this;
};

/**
 * Public: A convenience function to call query with a 'only' value
 * @param which - The media query to check against
 * @param callback - The function to call when the event is fired
 */
var only = function(which, callback) {
  query('only', which, callback);
  return this;
};

/**
 * Public: Checks if the media query is greater than the specified
 * @param which - The media query to check against
 */
var isAbove = function (which) {
  var currentMq = mqOrderNamed[fetchMediaQuery()],
    whichMq = mqOrderNamed[which];

  return (currentMq >= whichMq);
};

/**
 * Public: Checks if the media query is less than the specified
 * @param which - The media query to check against
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
 * @param mediaQuery - A string referencing the desired breakpoint
 */
var fetchMqIndex = function(mediaQuery) {
  return mqOrderNamed[mediaQuery];
};

/**
 * Public: Fetch the name of a breakpoint by its index
 * @param index - An integer referencing the desired breakpoint in the order
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


  // return the public methods
  return {
    onMediaQueryChange: onMediaQueryChange,
    responsiveImages:   responsiveImages,
    fetchMediaQuery:    fetchMediaQuery,
    fetchMqIndex:       fetchMqIndex,
    fetchMqName:        fetchMqName,
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