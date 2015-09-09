var sassqwatch = require('sassqwatch'),
  getAffected = {};

getAffected.min = function(target) {
  if (sassqwatch.isAbove(target)) {
    return sassqwatch.breakpoints.slice(sassqwatch.breakpoints.indexOf(target));
  } else {
    return [];
  }
};

getAffected.max = function(target) {
  if (sassqwatch.isBelow(target)) {
    return sassqwatch.breakpoints.slice(0, sassqwatch.breakpoints.indexOf(target));
  } else {
    return [];
  }
};

getAffected.only = function(target) {
  if (sassqwatch.matches(target)) {
    return [target];
  } else {
    return [];
  }
};

exports.getAffected = getAffected;