var fs = require('fs');
var p = require('path');
var ejs = require('ejs');
var cheerio = require('cheerio');
var template = fs.readFileSync('./_src/js/templates/api.ejs', 'utf8');
var contentPath = '../../_src/js/config/api-config.js';
var apiSections = require(contentPath);

module.exports = function(gulp, gulpConfig, apiConfig) {
  return function() {
    return fs.readFile('./index.html', 'utf8', function(err, data) {
      var $ = cheerio.load(data),
        $api = $('#api-sections'),
        rendered;

      $api.html('');

      apiSections.forEach(function(section) {
        rendered = ejs.render(template, section);
        $api.append(rendered);
      });

      fs.writeFile('./index.html', $.html());
    });
  };
};