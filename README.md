IntersectionObserver Polyfill
=============

A polyfill of IntersectionObserver API.

Implements event based tracking of changes in elements position. Uses MutationsObserver and falls back to an infinite dirty checking cycle if the first one is not supported. Handles long running CSS transitions/animations, attributes and nodes mutations along with changes made by :hover pseudo-class (optional).

Written in ES6 and compliant with the [spec](http://rawgit.com/WICG/IntersectionObserver/master/index.html) and native implementation. Doesn't contain any publicly available methods or properties except for those described in spec. Size is 4kb when minified and gzipped.

[Live demo](http://que-etc.github.io/intersection-observer-polyfill) (won't run in IE9).

## Installation

From NPM:

```sh
npm install --save intersection-observer-polyfill
```

From Bower:

```sh
bower install --save intersection-observer-polyfill
```

Or just grab one of the pre-built versions from [`dist`](https://github.com/que-etc/intersection-observer-polyfill/tree/master/dist).

## Browser Support

Polyfill has been tested and known to work in the following browsers:

* Firefox 31+
* Edge 13+
* Internet Explorer 11
* Internet Explorer 9-10 (tested in compatibility mode of IE11)
* Chrome 40+ (native support since 51)
* Opera 30+ (native support since 38)
* Safari was not tested but expected to work

## Usage Examples

If you are using ES6 modules with bundlers like [Webpack](https://webpack.github.io/) or [JSPM](http://jspm.io/):

```javascript
import IntersectionObserver from 'intersection-observer-polyfill';

const observer = new IntersectionObserver((entries, observer) => {}, {
    rootMargin: '100px 0px',
    threshold: [0, 0.1, 0.2, 0.5, 1]
});

// ...
```

Alternatively you can take a pre-built UMD version.

With AMD:

```javascript
define([
    'intersection-observer-polyfill/dist/IntersectionObserver'
], function (IntersectionObserver) {
    // ...
});
```

With CommonJS:

```javascript
var IntersectionObserver = require('intersection-observer-polyfill/dist/IntersectionObserver');
```

As browsers' global:

```xml
<script src="intersection-observer-polyfill/dist/IntersectionObserver.js"></script>
<script>
    (function () {
        var observer = new IntersectionObserver(function () {});
    })();
</script>
```
### Global exports

Optionally you can take a version that always exports itself globally.

With ES6 modules:

```javascript
import 'intersecton-observer-polyfill/index.global';

const observer = new IntersectionObserver(() => {});
```

With AMD/CommonJS:

```javascript
require('intersecton-observer-polyfill/dist/IntersectionObserver.global');
```

## Configuration

`IntersectionObserver` class additionally implements following static accessor properties:

### idleTimeot

When DOM elements change theirs attributes like `class` or `style` an update cycle
will be initiated. This cycle is used to catch possible CSS transitions/animations and the `idleTimeout` tells for how long we need run it if it doesn't detect any changes in elements position.

Default value is `50` milliseconds and you can increase it to match the delay of transitions, e.g. if transition starts after `500` milliseconds then you can set `idleTimeout` to the corresponding value: `IntersectionObserver.idleTimeout = 500;`. If you don't plan to use transitions then you can set this value to `0`. Otherwise it's safer to leave the default value, even if transition starts immediately.

### trackHovers

By default possible changes in position of elements caused by CSS `:hover` class are not tracked. You can set `IntersectionObserver.trackHovers = true` if you need them to be supported.

**NOTE:** Changes made to these properties will affect all instances of IntersectionObserver, even those that were already created.

## Acknowledgments

I'm very grateful to [Philip Walton](https://github.com/philipwalton) for the test suites of observe/unobserve methods that I took from his [implementation](https://github.com/WICG/IntersectionObserver/pull/135).
