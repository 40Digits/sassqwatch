var
  sassqwatch = require('sassqwatch'),
  breakpoint = 'mq-medium';

// you can chain methods!
sassqwatch
  .responsiveImages({
  	selector: $('.responsive')
  })
  .onMediaQueryChange(function (newMediaQuery, oldMediaQuery) {
    console.log('Media query switched to ' + newMediaQuery + ' from ' + oldMediaQuery);
  })
  .when('below', breakpoint, function() {
    console.log('breakpoint is below ' + breakpoint);
  });