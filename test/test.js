var sassqwatch = require('sassqwatch').throttleOn(500);

sassqwatch.responsiveImages({
	selector: $('.responsive')
});

sassqwatch.onMediaQueryChange(function (newMediaQuery, oldMediaQuery) {
  console.log('Media query switched to ' + newMediaQuery + ' from ' + oldMediaQuery);
});