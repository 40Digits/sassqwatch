/** @jsx React.DOM */
var React = require('React'),
  Option = require('./Option.jsx');

module.exports = React.createClass({
  render: function() {
    var options = [],
      demo,
      i = 0;

    for (i; i < this.props.demos.length; i++) {
      demo = this.props.demos[i];
      options.push(
        <Option
          demos={this.props.demos}
          method={demo.method}
          isActive={this.props.active == demo}
          index={i}
          switchHandler={this.props.switchHandler} />
      );
    }

    return (
      <fieldset className="c-ui-list c-demo__options" id="js-demo-options" role="navigation">
        <div className="c-headline--small">Choose a method:</div>
        {options}
      </fieldset>
    );
  }
});