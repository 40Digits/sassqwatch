/**
 * Configures and initializes highlight.js which is accessible from the global object
 */
var hljs = require('hljs');

hljs.configure({
  classPrefix: ''
});

hljs.initHighlighting();