# SassQwatch - The Sass Query Watcher.

This lightweight script offers a way to do various checks against CSS media queries in JavaScript and offers the ability to replace images based on the result.

Best used with [Browserify](https://www.npmjs.com/package/browserify).

## Setup With Browserify

### 1. Install with NPM.
```bash
npm install sassqwatch
```

### 2. Reference in your modules.
```javascript
var sassqwatch = require('sassqwatch');
```
Requiring SassQwatch sets up the link to your Sass breakpoints then returns an object with [some helpful methods](#methods) that you can use in your modules.

### 3. Set up Sass/CSS Media Queries
SassQwatch looks at the `font-family` property of the `head` element in your CSS to check for the current breakpoint. It needs to know the order of your breakpoints, so list them on `title`. Then set up your media queries with appropriate names:
```sass
title {
  font-family: 'mq-tiny, mq-small, mq-medium, mq-large';
}
head {
  font-family: 'mq-tiny';

  @media (min-width: 480px) {
    font-family: 'mq-small';
  }
  @media (min-width: 600px) {
    font-family: 'mq-medium';
  }
  @media (min-width: 768px) {
    font-family: 'mq-large';
  }
}
```
Ideally you would use a nifty sass mixin to set all of this up.


## Setup Without Browserify
Not using Browserify? No sweat! Just include `sassqwatch.js` or `sassqwatch.min.js` in your project:
```html
<script src="sassqwatch.min.js"></script>
<script src="app.js"></script>
```
Then just `require` the `sassqwatch` module in your `js` files.

_sample **app.js**_
```javascript
// get a reference to the sassqwatch module
var sassqwatch = require('sassqwatch');

// then use the methods like you would in a browserify module

// example: call the responsiveImages module with some custom options
sassqwatch.responsiveImages({
  selector: '.responsive'
});
```

Easy peasy.

## Events

#### onChange( callback )
`callback` (function): the callback function to call when the media query changes

The callback is provided the name of the new media query and the name of the previous media query.

```javascript
sassqwatch.onChange(function (newMediaQuery, oldMediaQuery) {
  console.log('Media query switched to ' + newMediaQuery + ' from ' + oldMediaQuery);
});
```

## Methods

#### min( breakpoint, callback, fireOnce  )

`breakpoint` (string): the name of the media query to check against

`callback` (function): the callback function to call

`fireOnce` (boolean): setting this to true will cause the callback to only be fired the first time the condition is met. (Default: `false`)

A convenience method that functions similarly to a `min-width` media query in CSS. The callback is fired on the specified breakpoint as well as any breakpoint that is above it. The callback is provided the name of the current media query.

```javascript
sassqwatch.min('mq-medium', function (newMediaQuery) {
  console.log('now min mq-medium');
}, true);
```

#### max( breakpoint, callback, fireOnce )

`breakpoint` (string): the name of the media query to check against

`callback` (function): the callback function to call

`fireOnce` (boolean): setting this to true will cause the callback to only be fired the first time the condition is met. (Default: `false`)

A convenience method that functions similarly to a `max-width` media query in CSS. The callback is fired on the specified breakpoint as well as any breakpoint that is below it. The callback is provided the name of the current media query.

```javascript
sassqwatch.max('mq-medium', function (newMediaQuery) {
  console.log('now max mq-medium');
}, true);
```

#### only( breakpoint, callback, fireOnce )

`breakpoint` (string): the name of the media query to check against

`callback` (function): the callback function to call

`fireOnce` (boolean): setting this to true will cause the callback to only be fired the first time the condition is met. (Default: `false`)

A convenience method that fires a callback only on a specified breakpoint. The callback is provided the name of the previous media query.

```javascript
sassqwatch.min('mq-medium', function (oldMediaQuery) {
  console.log('now on mq-medium');
}, true);
```

#### query( type, breakpoint, callback )

`type` (string): "min", "max", or "only"

`breakpoint` (string): the name of the media query to check against

`callback` (function): the callback function to call

Fires a callback when the current breakpoint is min, max, or only the specified breakpoint. If checking for "min" or "max" then the callback receives the name of the new media query. If checking for "only" the callback receives the name of the old media query.

```javascript
sassqwatch.query('min', 'mq-medium', function (newMediaQuery) {
  console.log('now min mq-medium');
});
sassqwatch.query('only', 'mq-xxlarge', function (oldMediaQuery) {
  console.log('now on mq-xxlarge');
});
```

#### isBelow( breakpoint )
`breakpoint` (string): the media query to check against.

Returns `true` if the current media query is below a specified media query, and `false` otherwise.

```javascript
if ( sassqwatch.isBelow('mq-large') ) {
  console.log('Media query is below mq-large.');
}
```

#### isAbove( breakpoint )
`breakpoint` (string): the media query to check against.

Returns `true` if the current media query is above a specified media query, and `false` otherwise.

```javascript
if ( sassqwatch.isAbove('mq-tiny') ) {
  console.log('Media query is above mq-tiny.');
}
```

#### matches( breakpoint )
`breakpoint` (string): the media query to check against.

Returns `true` if the current media query matches a specified media query, and `false` otherwise.

```javascript
if ( sassqwatch.matches('mq-tiny') ) {
  console.log('Media query is mq-tiny.');
}
```

## Responsive Images Module
Replaces images automagically across specified breakpoints for selected elements. Use `data` attributes to provide the image sources. To use the module out of the box, add the class `sassqwatch` to the elements in your html.

#### responsiveImages( {options} )

### Usage
```javascript
var sassqwatch = require('sassqwatch');

// call it out of the box
sassqwatch.responsiveImages();

// or pass in some options
sassqwatch.responsiveImages({
  selector: '.my-custom-selector'
});
```

```html
<img class="sassqwatch" src="default-image.jpg" data-mq-mini="mini-image-src.jpg" data-mq-large="large-image-src.jpg" />
```

You can also use this with background images.
```html
<div class="sassqwatch" style="background-image: url(default-image.jpg)" data-mq-mini="mini-image-src.jpg" data-mq-large="large-image-src.jpg"></div>
```

*Note:* Make sure that the names of your data attributes match the names of the media queries that you [set up on `title` in your Sass/CSS](#4-set-up-sass-css-media-queries).

SassQwatch can even handle "retina" images on every media query for screens with a high pixel density. Just add a new media query data attribute with "2x" at the end and SassQwatch will do the rest.


```html
<img class="sassqwatch" src="default-image.jpg" data-mq-mini="mini-image-src.jpg" data-mq-mini-2x="large-image-src@2x.jpg" />
```

### Options
* `selector`: A custom selector for `responsiveImages` to bind to instead of the default `.sassqwatch`.

  ```javascript
  sassqwatch.responsiveImages({
    selector: '.responsive'
  });
  ```


## License
Sassqwatch is copyright (c) 2015 [40Digits](http://www.40digits.com) and is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Example images are [CC-by-SA](https://creativecommons.org/licenses/by-sa/2.0/) by [Jyrki Salmi](https://www.flickr.com/photos/salman2000/9321259912/).