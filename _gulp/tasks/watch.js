var watch = require('../util/watch');

module.exports = function (gulp, config) {
  return function() {
    return watch({
      root: config.watch.base,
      match: config.watch.match
    });
  };
};