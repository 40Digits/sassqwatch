module.exports = function(string) {
  return string.replace(/({{\s?space(\d)?\s?}})/g, function(match, p1, p2) {
    var array = new Array(parseInt(p2, 10));
    return new Array(parseInt(p2, 10) + 1).join(' ');
  });
};