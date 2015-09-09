/** @jsx React.DOM */
var React = require('React'),
  sassqwatch = require('sassqwatch'),
  config = require('../config/demo-data.js'),
  Demo = require('../components/Demo.jsx'),
  target = 'large',
  el = {
    demo: document.getElementById('demo'),
    options: document.getElementById('js-demo-options')
  };

React.render(<Demo demos={config} breakpoints={sassqwatch.breakpoints} target={target} />, el.demo);