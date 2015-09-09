var React = require('React'),
  sassqwatch = require('sassqwatch');

module.exports = React.createClass({
  componentDidMount: function () {
    sassqwatch.responsiveImages();
  },
  render: function() {
    var component = this,
      data = {
        className: 'sassqwatch',
        src: this.props.initial
      };

    Object.keys(component.props.images).forEach(function(breakpoint) {
      data['data-' + breakpoint] = component.props.images[breakpoint];
    });

    return React.DOM.img(data);
  }
});