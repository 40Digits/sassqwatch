# SassQwatch - The Sass Query Watcher.

This lightweight script offers a way to do various checks against CSS media queries in JavaScript and offers the ability to replace images based on the result.

Best used with [Browserify](https://www.npmjs.com/package/browserify).

## Setup

### 1. Install with NPM.
```bash
npm install sassqwatch
```

### 2. Reference in your modules.
```javascript
var sassqwatch = require('sassqwatch');
```
Requiring SassQwatch sets up the link to your Sass breakpoints then returns an object with [some helpful methods](#methods) that you can use in your modules.

### 3. Setup jQuery
SassQwatch depends on jQuery, which is a rather large library and is not bundled with SassQwatch. However, it is defined as a dependency in the module's `package.json` file, which means that jQuery will be downloaded into your `node_modules` directory after you run `npm install`. It is very important to properly setup jQuery in your project. If you would rather not have jQuery in your Browserify bundle and include it using a [CDN](https://developers.google.com/speed/libraries/), then consider using [browserify-shim](https://www.npmjs.com/package/browserify-shim) and using the alias `jquery` ([example](https://www.npmjs.com/package/browserify-shim#you-will-sometimes)). This will ensure that SassQwatch has a proper reference to the library when it uses `require('jquery')`.

### 4. Set up Sass/CSS Media Queries
SassQwatch looks at the `font-family` property of the `head` element in your CSS to check for the current breakpoint. It needs to know the order of your breakpoints, so list them on `title`. Then set up your media queries with appropriate names:
```sass
title {
  font-family: 'mq-small, mq-medium, mq-large';
}
head {
  @media (min-width: $break-small) {
    font-family: 'mq-small';
  }
  @media (min-width: $break-medium) {
    font-family: 'mq-small';
  }
  @media (min-width: $break-large) {
    font-family: 'mq-large';
  }
}
```
Ideally you would use a nifty sass mixin to set all of this up.


## Setup Without Browserify
Not using Browserify? No sweat! Just include `sassqwatch.js` or `sassqwatch.min.js` – in the root of the repo – in your html after jQuery like so:
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="sassqwatch.min.js"></script>
<script src="app.js"></script>
```
Then just `require` the `sassqwatch` module in your `js` files.

_sample **app.js**_
```javascript
// get a reference to the sassqwatch module
var sassqwatch = require('sassqwatch');

// then use the methods like you would in a browserify module

// example: globally throttle the resize event on the window
//          with a custom interval
sassqwatch.throttleOn(500);

// example: call the responsiveImages module with some custom options
sassqwatch.responsiveImages({
  selector: $('.responsive')
});
```

Easy peasy.

## Events

#### onMediaQueryChange( function )
`function`: the callback function to call when the media changes

The callback is provided the name of the new media query and the name of the previous media query.

```javascript
sassqwatch.onMediaQueryChange(function (newMediaQuery, oldMediaQuery) {
  console.log('Media query switched to ' + newMediaQuery + ' from ' + oldMediaQuery);
});
```

## Methods

#### fetchMediaQuery()

Manually returns the current media query.

```javascript
var thisBreakpoint = sassqwatch.fetchMediaQuery();
```

#### fetchMqName( number )
`number`: the index of the media query to return

Returns a string of the name of the requested media query from the ordered array of media queries.

```javascript
var i = something.length;
var breakpoint;

for (i; i > 0; i--) {
  breakpoint = sassqwatch.fetchMqName(i);
  // breakpoint = 'mq-xxlarge' (etc)
}
```

#### fetchMqIndex( string )
`string`: the name of the media query to return

Returns an integer of the index of the requested media query from the ordered array of media queries.

```javascript
sassqwatch.onMediaQueryChange(function (newMediaQuery, oldMediaQuery) {
  var breakpointIndex = sassqwatch.fetchMqIndex(newMediaQuery);
});
```

#### isBelow( string )
`string`: the media query to check against.

Returns `true` if the current media query is below a specified media query, and `false` otherwise.

```javascript
if ( sassqwatch.isBelow('mq-large') ) {
  console.log('Media query is below mq-large.');
}
```

#### isAbove( string )
`string`: the media query to check against.

Returns `true` if the current media query is above a specified media query, and `false` otherwise.

```javascript
if ( sassqwatch.isAbove('mq-tiny') ) {
  console.log('Media query is above mq-tiny.');
}
```

#### throttleOn( number )
`number`: the interval in milliseconds at which to throttle the event (default: `250`)

Turns throttling on for the resize event on the `$(window)`. This makes the window resizing on your app more effecient, but less precise.

```javascript
var sassqwatch = require('sassqwatch').throttleOn(1000);
```

#### throttleOff()

Turns throttling off for the resize event on the `$(window)`. Throttling is already OFF by default for precise breakpoint handling. However, this can be costly for the performance of your app, which is why we provided the [`throttleOn` method](#throttleon-number). You can use this method to manually turn throttling off again after calling `throttleOn`.

```javascript
var sassqwatch = require('sassqwatch').throttleOn(500);

// do some stuff

sassqwatch.throttleOff();
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

### Options
* `selector`: A custom selector for `responsiveImages` to bind to instead of the default `.sassqwatch`.

  ```javascript
  sassqwatch.responsiveImages({
    selector: $('.responsive')
  });

  // or

  sassqwatch.responsiveImages({
    selector: '.responsive'
  });
  ```


## License
Sassqwatch is copyright (c) 2015 [40Digits](http://www.40digits.com) and is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Example images are [CC-by-SA](https://creativecommons.org/licenses/by-sa/2.0/) by [Jyrki Salmi](https://www.flickr.com/photos/salman2000/9321259912/).