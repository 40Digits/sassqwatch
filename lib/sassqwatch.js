// Dependencies
var
  $ = require('jquery'),
  td = require('./throttleDebounce');

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
 * Public: A convenience method to fire a callback when above, below, or on a specified breakpoint
 * @param direction - A string "above", "below", or "on"
 * @param which - The media query to check against
 * @param callback - The function to call when the event is fired
 */
var when = function(direction, which, callback) {
  var
    dir = direction.toLowerCase(),
    check;

  if (dir === 'above') {
    check = function(e, newMediaQuery) {
      if (isAbove(which)) {
        callback(newMediaQuery);
      }
    }
  } else if (dir === 'below') {
    check = function(e, newMediaQuery) {
      if (isBelow(which)) {
        callback(newMediaQuery);
      }
    }
  } else if (dir === 'on') {
    check = function(e, newMediaQuery, oldMediaQuery) {
      if (matches(which)) {
        callback(oldMediaQuery);
      }
    }
  }

  if (typeof check === 'function') {
    check();
    $listenElement.on('mediaQueryChange', check);
  }

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
 * Public: Turn throttling ON for more effecient resizing events
 * @param duration - An integer specifying the duration of the throttling
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
 * Internal: Immediately invoked constructor function
 * Sets everything up and then returns all the public methods.
 */
var constructor = function() {
  // set the order of the breakpoints
  setOrder();

  // fetch the current media query
  currentMediaQuery = fetchMediaQuery();

  // no resize throttling by default
  throttleOff();

  // return the public methods
  return {
    onMediaQueryChange: onMediaQueryChange,
    when:               when,
    fetchMediaQuery:    fetchMediaQuery,
    fetchMqIndex:       fetchMqIndex,
    fetchMqName:        fetchMqName,
    isAbove:            isAbove,
    isBelow:            isBelow,
    throttleOn:         throttleOn,
    throttleOff:        throttleOff,
    responsiveImages:   responsiveImages
  };
}.call();

module.exports = constructor;