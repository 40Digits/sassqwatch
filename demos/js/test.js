var
  sassqwatch = require('sassqwatch'),
  breakpoint = 'mq-medium';

// you can chain methods!
sassqwatch
  .responsiveImages({
  	selector: '.responsive'
  });