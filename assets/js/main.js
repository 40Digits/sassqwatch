(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
  classnames = require('classnames'),
  sassqwatch = require('sassqwatch');

module.exports = React.createClass({displayName: "exports",
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
      React.createElement("div", {className: classes, id: id}, 
        React.createElement("div", {className: "c-scale__label", onClick: this.props.changeTarget}, this.props.name)
      )
    );
  }
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":19,"sassqwatch":18}],2:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
  hljs = (typeof window !== "undefined" ? window['hljs'] : typeof global !== "undefined" ? global['hljs'] : null);

function highlightSyntax() {
  if (this.props.html) {
    hljs.highlightBlock(React.findDOMNode(this.refs['html-' + this.state.method]));
  }
  hljs.highlightBlock(React.findDOMNode(this.refs['js-' + this.state.method]));
}

module.exports = React.createClass({displayName: "exports",
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
            React.createElement("pre", null, 
              React.createElement("code", {className: "html", ref: htmlRef}, this.props.html)
            )
          );
        }
      }.call(this);

    return (
      React.createElement("div", {className: "c-demo__output"}, 
        html, 
        React.createElement("pre", null, 
          React.createElement("code", {className: "javascript", ref: jsRef}, js)
        )
      )
    );
  }
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
  sassqwatch = require('sassqwatch'),
  Options = require('./Options.jsx'),
  Scale = require('./Scale.jsx'),
  Images = require('./Images.jsx'),
  Breakpoint = require('./Breakpoint.jsx'),
  Code = require('./Code.jsx'),
  helpers = require('../lib/helpers.js');

module.exports = React.createClass({displayName: "exports",
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
        return React.createElement(Scale, {
            breakpoints: this.props.breakpoints, 
            demo: this.state.demo, 
            active: this.state.active, 
            target: this.state.target, 
            changeTarget: this.setTarget})
      } else {
        return React.createElement(Images, {
          initial: this.state.demo.initial, 
          images: this.state.demo.images});
      }
    }.call(this);

    return (
      React.createElement("div", {className: "c-section"}, 
        React.createElement("div", {className: "c-demo__wrap o-wrapper--standard"}, 
          React.createElement("header", null, 
            React.createElement("h1", {className: "c-section__headline c-headline--large c-headline--strong"}, "Demo")
          ), 
          React.createElement(Options, {demos: this.props.demos, switchHandler: this.setDemo, active: this.state.demo}), 
          React.createElement(Code, {method: this.state.demo.method, target: this.state.target, html: html, js: js}), 
          component
        ), 
        React.createElement("p", {className: "c-demo__hint"}, "‹‹ Resize your browser ››")
      )
    );
  }
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lib/helpers.js":9,"./Breakpoint.jsx":1,"./Code.jsx":2,"./Images.jsx":4,"./Options.jsx":6,"./Scale.jsx":7,"sassqwatch":18}],4:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
  sassqwatch = require('sassqwatch');

module.exports = React.createClass({displayName: "exports",
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


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"sassqwatch":18}],5:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
  classnames = require('classnames'),
  Demo = require('./Demo.jsx');

module.exports = React.createClass({displayName: "exports",
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
      React.createElement("button", {type: "button", 
        name: "options", 
        className: classes, 
        value: this.props.method, 
        onClick: this.props.switchHandler, 
        "data-index": this.props.index}, label)
    );
  }
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Demo.jsx":3,"classnames":19}],6:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
  Option = require('./Option.jsx');

module.exports = React.createClass({displayName: "exports",
  render: function() {
    var options = [],
      demo,
      i = 0;

    for (i; i < this.props.demos.length; i++) {
      demo = this.props.demos[i];
      options.push(
        React.createElement(Option, {
          demos: this.props.demos, 
          method: demo.method, 
          isActive: this.props.active == demo, 
          index: i, 
          switchHandler: this.props.switchHandler})
      );
    }

    return (
      React.createElement("fieldset", {className: "c-ui-list c-demo__options", id: "js-demo-options", role: "navigation"}, 
        React.createElement("div", {className: "c-headline--small"}, "Choose a method:"), 
        options
      )
    );
  }
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Option.jsx":5}],7:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
  helpers = require('../lib/helpers.js'),
  Code = require('./Code.jsx'),
  Breakpoint = require('./Breakpoint.jsx');

module.exports = React.createClass({displayName: "exports",
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
        React.createElement(Breakpoint, {
          name: breakpoint, 
          isActive: this.state.active === breakpoint, 
          isAffected: affected, 
          isTarget: this.state.target === breakpoint, 
          changeTarget: this.props.changeTarget})
      );
    }

    return (
      React.createElement("div", {className: "c-scale"}, 
        React.createElement("div", {className: "c-scale__breakpoints"}, 
          breakpoints
        ), 
        React.createElement("p", {className: "c-scale__explanation c-type-large"}, "The callback has ", currentIsAffected, " been fired because the current breakpoint of the browser, ", React.createElement("strong", {className: "u-text-teal"}, this.state.active), ", is ", currentIsAffected, " ", this.state.demo.explanationString, " ", React.createElement("strong", {className: "u-text-orange"}, this.state.target), ".")
      )
    );
  }
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lib/helpers.js":9,"./Breakpoint.jsx":1,"./Code.jsx":2}],8:[function(require,module,exports){
module.exports = [
  {
    method: 'min',
    scale: true,
    explanationString: 'above',
    js: 'sassqwatch.min(\'{target}\', callback);'
  },
  {
    method: 'max',
    scale: true,
    explanationString: 'below',
    js: 'sassqwatch.max(\'{target}\', callback);'
  },
  {
    method: 'only',
    scale: true,
    explanationString: '',
    js: 'sassqwatch.only(\'{target}\', callback);'
  },
  {
    method: 'responsiveImages',
    scale: false,
    initial: '/assets/images/480x270.jpg',
    images: {
      'tiny': '/assets/images/480x270.jpg',
      'tiny-2x': '/assets/images/480x270-retina.jpg',
      'small': '/assets/images/800x450.jpg',
      'small-2x': '/assets/images/800x450-retina.jpg',
      'large': '/assets/images/1024x575.jpg',
      'large-2x': '/assets/images/1024x575-retina.jpg',
    },
    js: 'sassqwatch.responsiveImages();',
    html: '<img\n' +
      '  data-tiny="/assets/images/480x270.jpg"\n' + 
      '  data-tiny-2x="/assets/images/480x270-retina.jpg"\n' + 
      '  data-small="/assets/images/800x450.jpg"\n' + 
      '  data-small-2x="/assets/images/800x450-retina.jpg"\n' + 
      '  data-large="/assets/images/1024x575.jpg"\n' + 
      '  data-large-2x="/assets/images/1024x575-retina.jpg" />'
  }
];


},{}],9:[function(require,module,exports){
var sassqwatch = require('sassqwatch'),
  getAffected = {};

getAffected.min = function(target) {
  if (sassqwatch.isAbove(target)) {
    return sassqwatch.breakpoints.slice(sassqwatch.breakpoints.indexOf(target));
  } else {
    return [];
  }
};

getAffected.max = function(target) {
  if (sassqwatch.isBelow(target)) {
    return sassqwatch.breakpoints.slice(0, sassqwatch.breakpoints.indexOf(target));
  } else {
    return [];
  }
};

getAffected.only = function(target) {
  if (sassqwatch.matches(target)) {
    return [target];
  } else {
    return [];
  }
};

exports.getAffected = getAffected;


},{"sassqwatch":18}],10:[function(require,module,exports){
(function (global){
/**
 * Configures and initializes highlight.js which is accessible from the global object
 */
var hljs = (typeof window !== "undefined" ? window['hljs'] : typeof global !== "undefined" ? global['hljs'] : null);

hljs.configure({
  classPrefix: ''
});

hljs.initHighlighting();


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
  sassqwatch = require('sassqwatch'),
  config = require('../config/demo-data.js'),
  Demo = require('../components/Demo.jsx'),
  target = 'large',
  el = {
    demo: document.getElementById('demo'),
    options: document.getElementById('js-demo-options')
  };

React.render(React.createElement(Demo, {demos: config, breakpoints: sassqwatch.breakpoints, target: target}), el.demo);


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../components/Demo.jsx":3,"../config/demo-data.js":8,"sassqwatch":18}],12:[function(require,module,exports){
/**
 * Returns an element object from an element identifier
 * @param  {String} el An element identifier – Must be a class or ID reference
 * @return {Element}   The element object reference
 */
module.exports = function(el) {
  if (typeof el === 'string') {
    var identifier = el.slice(0, 1),
      string = el.slice(1, el.length);

    if (identifier == '.') {
      return document.getElementsByClassName(string);
    } else if (identifier == '#') {
      return document.getElementsById(string);
    }
  } else {
    return el;
  }
};


},{}],13:[function(require,module,exports){
/**
 * Returns a new merged object from two objects
 * @param  {Object} obj1 The object to extend
 * @param  {Object} obj2 The object to merge into the original
 * @return {Object}      The merged object
 */
module.exports = function(obj1, obj2) {
  for(key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
}


},{}],14:[function(require,module,exports){
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}


},{}],15:[function(require,module,exports){
/**
 * Returns the data attribute labels and values from a given element
 * @param  {Element} $el The element to get the data
 * @return {Object}      The data attributes
 */
module.exports = function($el) {
  if ($el.hasAttributes()) {
    var i = 0,
      data = {},
      mqName = '',
      attr;
    
    for(i; i < $el.attributes.length; i++) {
      attr = $el.attributes[i];
      
      if (attr.name.indexOf('data-') != -1) {
        mqName = attr.name.slice(5);
        data[mqName] = attr.value;
      }
    }
    
    return data;
  }
}


},{}],16:[function(require,module,exports){
/**
 * Preload an image and call a function onload
 * @param  {String}   src      The source url to preload
 * @param  {Object}   obj      An object to pass through for reference in the callback
 * @param  {Function} callback The function to call when the image is done loading
 */
var preloader = function(src, obj, callback) {
  var
    loaded = false,
    img = new Image();

  var loadHandler = function() {
    if (loaded) {
      return;
    }
    loaded = true;
    callback(src, obj);
    img = null;
  };

  img.addEventListener('load', loadHandler);
  img.src = src;
  if (img.complete) {
    loadHandler();
  }
};

module.exports = preloader;


},{}],17:[function(require,module,exports){
/**
 * Module to automatically swap image src's across css @media breakpoints
 * @param  {Object} options Options for module
 * @return {Object}         The SassQwatch object, for method chaining
 */
module.exports = function(options) {

  // Dependencies
  var
    sassqwatch      = require('./sassqwatch'),
    elementify      = require('./elementify'),
    preloader       = require('./preloader'),
    extend          = require('./extend'),
    getData         = require('./getData');

  // Module Variables
  var
    defaultSelector = elementify('.sassqwatch'),
    settings = extend({ selector: defaultSelector }, options),
    knownSizes = [],
    retina = (window.devicePixelRatio >= 1.5) ? true : false,
    i = 0;

  /**
   * Stores the image sources attached to each responsive image, making each check on mq change more effecient
   * @param  {Element} $image The element to receive the image sizes from
   */
  var storeSizes = function($image) {
    var
      src = getSource($image),
      sizes = {
        $image: $image,
        loaded: [],
        originalSrc: src,
        activeSrc: src
      };

    // merge the pre-existing sizes object with the object of image size urls
    sizes = extend(sizes, getData($image));
    // add the original src as a loaded src
    sizes.loaded.push(sizes.originalSrc);
    // add the sizes for this image to the known sizes
    knownSizes.push(sizes);
  };

  /**
   * Returns the source url on an element
   * @param  {Element} $el The element to get the source from
   * @return {String}      The source URL
   */
  var getSource = function ($el) {
    var src = '';
    // check if this the element is an img with a src
    // or is another element with a background image
    if ($el.tagName == 'IMG') {
      src = $el.getAttribute('src');
    } else {
      // get the computed style of the element
      src = getComputedStyle($el).getPropertyValue('background-image');
      // get the html css collection if getComputedStyle doesn't work
      src = src ? src : $el.style.backgroundImage;
      // remove the 'url()'
      src = src.replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
    }

    return src;
  };

  /**
   * Swap out either an <img>s source or the background image of an element.
   * @param  {Element} $el         The element that needs its source swapped
   * @param  {String}  newImageSrc The new src to show
   */
  var swapImage = function($el, newImageSrc) {
    if ($el.tagName === 'IMG') {
      $el.setAttribute('src', newImageSrc);
    } else {
      $el.style.backgroundImage = 'url(' + newImageSrc + ')';
    }
  };

  /**
   * Checks to see if there is a retina src provided on an image
   * @param  {object} imageObject An object in the array of known image sizes
   * @param  {string} mediaQuery  The name of the media query to check against
   * @return {string}             The image src
   */
  var checkForRetinaSrc = function(imageObject, mediaQuery) {
    // if this is a retina screen and there is a retina src
    if (retina && imageObject[mediaQuery + '-2x']) {
      return imageObject[mediaQuery + '-2x'];
    } else {
      return imageObject[mediaQuery];
    }
  };

  /**
   * Run through each responsive image and see if an image exists at that media query
   */
  var updateImages = function() {
    var
      isLoaded      = false,
      thisMQ        = undefined,
      thisImage     = undefined,
      newSource     = undefined,
      i             = 0,
      ii            = 0;

    // Loop over each known size
    // and update the image src if it has one for this breakpoint
    for(i; i < knownSizes.length; i++) {
      thisImage = knownSizes[i];
      // checks if we're on a retina screen and if there is a 2x src defined
      newSource = checkForRetinaSrc(thisImage, sassqwatch.current);

      // if a new source isn't set
      if (!newSource) {
        // get the index of the current media query to start from
        ii = sassqwatch.breakpoints.indexOf(sassqwatch.current);

        // decrement through the numbered mq's
        for (ii; ii > 0; ii--) {
          thisMQ = sassqwatch.breakpoints[ii];
          newSource = checkForRetinaSrc(thisImage, thisMQ);

          // break the loop if a source is found
          if (newSource) break;
        }
        // if after all that no source was found
        // then just revert back to the original source
        newSource = newSource ? newSource : thisImage.originalSrc;
      }

      // if the new source is not the active source
      if (newSource.indexOf(thisImage.activeSrc) === -1) {
        ii = 0;

        // loop over all loaded src's for this image
        // and see if the new source has been loaded
        for(ii; ii < thisImage.loaded.length; ii++) {
          if (thisImage.loaded[ii].indexOf(newSource) != -1) {
            isLoaded = true;
            break;
          }
        };

        // if the new source has been loaded
        if (isLoaded) {
          swapImage(thisImage.$image, newSource);
        } else {
          // preload the image to swap
          // and update the list of loaded src's
          preloader(newSource, thisImage, function(src, obj) {
            swapImage(obj.$image, src);
            obj.loaded.push(src);
          });
        }

        // update the active src
        thisImage.activeSrc = newSource;
      }
    };
  };

  // if a custom 'el' has been passed in
  // make sure that it is actually a jquery element
  // before initializing the module
  if (settings.selector !== defaultSelector) {
    settings.selector = elementify(settings.selector);
  }

  // Loop through each element and store its original source
  for(i; i < settings.selector.length; i++) {
    storeSizes(settings.selector[i]);
  }

  updateImages();

  // Listen for media query changes
  sassqwatch.onChange(updateImages);

  return sassqwatch;
};


},{"./elementify":12,"./extend":13,"./getData":15,"./preloader":16,"./sassqwatch":18}],18:[function(require,module,exports){
// Polyfills
require('./forEach');

// Elements
var
  orderElement = document.getElementsByTagName('title')[0],
  listenElement = document.getElementsByTagName('head')[0];

// Module variables
var callbacks = { queue: [] };

/**
 * Internal: Creates a queue of functions to call when the media query changes. 
 * @param  {String}  currentMediaQuery The current media query.
 * @param  {String}  lastMediaQuery    The previous media query.
 */
callbacks.fire = function(currentMediaQuery, lastMediaQuery) {
  var i = 0;
  for(i; i < callbacks.queue.length; i++) {
    callbacks.queue[i].call(this, currentMediaQuery, lastMediaQuery);
  }
};

/**
 * Internal: When the browser is resized, update the media query
 */
function onResize() {
  // Set the last and current media queries
  exports.previous = exports.current;
  exports.current = exports.fetchMediaQuery();

  // The media query does not match the old
  if (exports.current !== exports.previous) {
    // Fire an event noting that the media query has changed
    callbacks.fire(exports.current, exports.previous);
  }
}

/**
 * Internal: Returns the order of media queries from the CSS
 */
function setOrder() {
  return getComputedStyle(orderElement).getPropertyValue('font-family').replace(/['"\s]/g, "").split(',');
}

/**
 * Internal: Returns the correct query method (isAbove, isBelow, or matches) given a string
 * @param  {String} type 'min', 'max', or 'only'
 * @return {Function}    The method.
 */
function getQueryMethod(type) {
  type = type.toLowerCase();

  if (type === 'min') {
    return exports.isAbove;
  } else if (type === 'max') {
    return exports.isBelow;
  } else if (type === 'only') {
    return exports.matches;
  } else {
    return function() {
      return false;
    }
  }
}

/**
 * Public: Manually returns the current media query
 */
exports.fetchMediaQuery = function() {
  // We read in the media query name from the html element's font family
  var mq = getComputedStyle(listenElement).getPropertyValue('font-family');

  // Strip out quotes and commas
  mq = mq.replace(/['",]/g, '');

  return mq;
};

/**
 * Public: Event fires when the media query changes
 * @param  {Function} callback The function to call when the media query changes
 * @return {Object}            The SassQwatch object
 */
exports.onChange = function(callback) {
  callbacks.queue.push(callback);
  return this;
};

/**
 * Public: A CSS-like query function to check against a min or max breakpoint. For convenience you can also query on a specific breakpoint.
 * @param  {String}   type     "min", "max", or "only"
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
exports.query = function(type, which, callback, fireOnce) {
  var
    firedCount = 0,
    method = getQueryMethod(type),
    check = function(newMediaQuery, oldMediaQuery) {
      if (method(which)) {
        // Prevent the callback from firing again
        // if the condition was previously true
        if (!!fireOnce && firedCount > 0) {
          return false;
        }
        callback(newMediaQuery, oldMediaQuery);
        firedCount++;
      } else {
        firedCount = 0;
        return false;
      }
    };

  fireOnce = fireOnce ? fireOnce : true;
  check(exports.current, exports.previous);
  exports.onChange(check);

  return this;
};

/**
 * Public: A convenience function to call query with a 'min' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
exports.min = function(which, callback, fireOnce) {
  exports.query('min', which, callback, fireOnce);
  return this;
};

/**
 * Public: A convenience function to call query with a 'max' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
exports.max = function(which, callback, fireOnce) {
  exports.query('max', which, callback, fireOnce);
  return this;
};

/**
 * Public: A convenience function to call query with a 'only' value
 * @param  {String}   which    The name of the media query to check against
 * @param  {Function} callback The callback function
 * @return {Object}            The SassQwatch object
 */
exports.only = function(which, callback) {
  exports.query('only', which, callback);
  return this;
};

/**
 * Public: Checks if the current media query is greater than or equal to the specified breakpoint
 * @param  {String}  which The name of the media query to check against
 * @return {Boolean}       Is the current media query greater than or equal to the specified breakpoint?
 */
exports.isAbove = function (which, inclusive) {
  var currentMq = exports.breakpoints.indexOf(exports.current),
    whichMq = exports.breakpoints.indexOf(which);

  if (inclusive === false) {
    return (currentMq > whichMq);
  } else {
    return (currentMq >= whichMq);
  }
};

/**
 * Public: Checks if the current media query is less than the specified breakpoint
 * @param  {String}  which The name of the media query to check against
 * @return {Boolean}       Is the current media query less than the specified breakpoint?
 */
exports.isBelow = function (which, inclusive) {
  var currentMq = exports.breakpoints.indexOf(exports.current),
    whichMq = exports.breakpoints.indexOf(which);

  if (inclusive === true) {
    return (currentMq <= whichMq);
  } else {
    return (currentMq < whichMq);
  }
};

/**
 * Public: Checks if the current media query is the same as the the specified breakpoint
 * @param  {String}  which The name of the media query to check against
 * @return {Boolean}       Is the current media query the same as the specified breakpoint?
 */
exports.matches = function(which) {
  // See if the current media query matches the requested one
  return (exports.current == which);
};

// expose the responsiveImages module
exports.responsiveImages = require('./responsiveImages');

// setup the breakpoints
exports.breakpoints = setOrder();

// fetch the current media query
exports.current = exports.fetchMediaQuery();

exports.previous = '';

// handle resizing
window.onresize = onResize;


},{"./forEach":14,"./responsiveImages":17}],19:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

(function () {
	'use strict';

	function classNames () {

		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if ('string' === argType || 'number' === argType) {
				classes += ' ' + arg;

			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);

			} else if ('object' === argType) {
				for (var key in arg) {
					if (arg.hasOwnProperty(key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd){
		// AMD. Register as an anonymous module.
		define(function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}

}());

},{}]},{},[10,11]);
