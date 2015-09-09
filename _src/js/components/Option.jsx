/** @jsx React.DOM */
var React = require('React'),
  classnames = require('classnames'),
  Demo = require('./Demo.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      isActive: this.props.index == 0
    };
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({
      isActive: newProps.isActive
    });
  },
  render: function() {
    var label = '.' + this.props.method,
      classes = classnames({
        'c-button': true,
        'c-button--default': true,
        'c-demo__option': true,
        'js-demo__option': true,
        'js-is-active': this.state.isActive
      });

    return (
      <button type="button"
        name="options"
        className={classes}
        value={this.props.method}
        onClick={this.props.switchHandler}
        data-index={this.props.index}>{label}</button>
    );
  }
});