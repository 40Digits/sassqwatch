/** @jsx React.DOM */
var React = require('React'),
  classnames = require('classnames'),
  sassqwatch = require('sassqwatch');

module.exports = React.createClass({
  render: function() {
    var id = 'bp-' + this.props.name,
      classes = classnames({
      'c-scale__point': true,
      'js-scale-breakpoint': true,
      'js-is-affected': this.props.isAffected,
      'js-is-active': this.props.isActive,
      'js-is-target': this.props.isTarget
    });

    return (
      <div className={classes} id={id}>
        <div className="c-scale__label" onClick={this.props.changeTarget}>{this.props.name}</div>
      </div>
    );
  }
});