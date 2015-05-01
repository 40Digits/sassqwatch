var
  sassqwatch = require('sassqwatch').throttleOn(),
  breakpoint1 = 'mq-medium',
  breakpoint2 = 'mq-small';

// you can chain methods!
sassqwatch
  .responsiveImages({
  	selector: $('.responsive')
  })
  .when('above', breakpoint1, function() {
    console.log('breakpoint is above ' + breakpoint1);
  })
  .when('on', breakpoint2, function() {
    console.log('breakpoint is ' + breakpoint2);
  });