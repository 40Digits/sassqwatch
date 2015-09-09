/** @jsx React.DOM */
var React = require('React'),
  sassqwatch = require('sassqwatch'),
  Options = require('./Options.jsx'),
  Scale = require('./Scale.jsx'),
  Images = require('./Images.jsx'),
  Breakpoint = require('./Breakpoint.jsx'),
  Code = require('./Code.jsx'),
  helpers = require('../lib/helpers.js');

module.exports = React.createClass({
  getInitialState: function() {
    sassqwatch.onChange(this.setBreakpoints);
    return {
      demo: this.props.demos[0],
      target: this.props.target,
      active: sassqwatch.current
    };
  },
  getDemo: function(prop, value) {
    var i = 0,
      demo;

    for(i; i < this.props.demos.length; i++) {
      if (this.props.demos[i][prop] === value) {
        demo = this.props.demos[i];
        break;
      }
    }

    return demo;
  },
  setBreakpoints: function(current) {
    this.setState({
      active: current,
    });
  },
  setTarget: function(e) {
    var newTarget = e.target.innerHTML;
    this.setState({
      target: newTarget,
    });
  },
  setDemo: function(e) {
    var newDemo = this.getDemo('method', e.target.value);
    this.setState({
      demo: newDemo
    });
  },
  getArgs: function(arg) {
    return arg.indexOf('{target}') !== -1 ? "'" + this.state.target + "'" : arg;
  },
  render: function() {
    var args = this.state.demo.args ? this.state.demo.args.map(this.getArgs) : [];
    var html = this.state.demo.html ? this.state.demo.html : undefined;
    var js = this.state.demo.js ? this.state.demo.js.replace('{target}', this.state.target) : undefined;
    var component = function() {
      if (this.state.demo.scale) {
        return <Scale
            breakpoints={this.props.breakpoints}
            demo={this.state.demo}
            active={this.state.active}
            target={this.state.target}
            changeTarget={this.setTarget} />
      } else {
        return <Images
          initial={this.state.demo.initial}
          images={this.state.demo.images} />;
      }
    }.call(this);

    return (
      <div className="c-section">
        <div className="c-demo__wrap o-wrapper--standard">
          <header>
            <h1 className="c-section__headline c-headline--large c-headline--strong">Demo</h1>
          </header>
          <Options demos={this.props.demos} switchHandler={this.setDemo} active={this.state.demo} />
          <Code method={this.state.demo.method} target={this.state.target} html={html} js={js} />
          {component}
        </div>
        <p className="c-demo__hint">&lsaquo;&lsaquo; Resize your browser &rsaquo;&rsaquo;</p>
      </div>
    );
  }
});