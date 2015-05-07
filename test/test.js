var
  sassqwatch = require('sassqwatch'),
  breakpoint = 'mq-medium';

// you can chain methods!
sassqwatch
  .responsiveImages({
  	selector: $('.responsive')
  })
  .min(breakpoint, function(newMQ) {
    console.log('breakpoint is a minimum of ' + breakpoint);
  })
  .max(breakpoint, function(newMQ) {
    console.log('breakpoint is ' + newMQ);
  })
  .only(breakpoint, function(oldMQ) {
    console.log('breakpoint was ' + oldMQ);
  });