/** @jsx React.DOM */
var React = require('React'),
  helpers = require('../lib/helpers.js'),
  Code = require('./Code.jsx'),
  Breakpoint = require('./Breakpoint.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      demo: this.props.demo,
      target: this.props.target,
      active: this.props.active,
      affected: this.getAffected(this.props.demo.method, this.props.target)
    };
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({
      demo: newProps.demo,
      target: newProps.target,
      active: newProps.active,
      affected: this.getAffected(newProps.demo.method, newProps.target)
    });
  },
  getAffected: function(method, target) {
    return helpers.getAffected[method].call(this, target);
  },
  render: function() {
    var breakpoints = [],
      breakpoint = '',
      affected = false,
      currentIsAffected = this.state.affected.indexOf(this.state.active) === -1 ? 'not' : '',
      i = 0;

    for (i; i < this.props.breakpoints.length; i++) {
      breakpoint = this.props.breakpoints[i];
      affected = this.state.affected.indexOf(breakpoint) > -1 ? true : false;

      breakpoints.push(
        <Breakpoint
          name={breakpoint}
          isActive={this.state.active === breakpoint}
          isAffected={affected}
          isTarget={this.state.target === breakpoint}
          changeTarget={this.props.changeTarget} />
      );
    }

    return (
      <div className="c-scale">
        <div className="c-scale__breakpoints">
          {breakpoints}
        </div>
        <p className="c-scale__explanation c-type-large">The callback has {currentIsAffected} been fired because the current breakpoint of the browser, <strong className="u-text-teal">{this.state.active}</strong>, is {currentIsAffected} {this.state.demo.explanationString} <strong className="u-text-orange">{this.state.target}</strong>.</p>
      </div>
    );
  }
});