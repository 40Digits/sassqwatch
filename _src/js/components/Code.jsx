var React = require('React'),
  hljs = require('hljs');

function highlightSyntax() {
  if (this.props.html) {
    hljs.highlightBlock(React.findDOMNode(this.refs['html-' + this.state.method]));
  }
  hljs.highlightBlock(React.findDOMNode(this.refs['js-' + this.state.method]));
}

module.exports = React.createClass({
  getInitialState: function() {
    return {
      method: this.props.method,
      target: this.props.target
    };
  },
  componentDidMount: highlightSyntax,
  componentDidUpdate: highlightSyntax,
  componentWillReceiveProps: function(newProps) {
    this.setState({
      method: newProps.method,
      target: newProps.target
    });
  },
  render: function() {
    var htmlRef = 'html-' + this.state.method,
      jsRef = 'js-' + this.state.method,
      js = this.props.js.replace(/({\s?target\s?})/g, this.state.target),
      html = function() {
        if (this.props.html) {
          return (
            <pre>
              <code className="html" ref={htmlRef}>{this.props.html}</code>
            </pre>
          );
        }
      }.call(this);

    return (
      <div className="c-demo__output">
        {html}
        <pre>
          <code className="javascript" ref={jsRef}>{js}</code>
        </pre>
      </div>
    );
  }
});