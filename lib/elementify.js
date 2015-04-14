var $ = require('jquery');

module.exports = function(el) {
  return (typeof el === 'string') ? $(el) : el;
};