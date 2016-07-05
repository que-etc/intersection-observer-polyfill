/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _IntersectionObserver = __webpack_require__(1);

	var _IntersectionObserver2 = _interopRequireDefault(_IntersectionObserver);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var $observResults = document.getElementById('observation-result');

	var el1 = document.getElementById('target1');
	var el2 = document.getElementById('target2');
	var el3 = document.getElementById('target3');

	var config = {
	    rootMargin: '0px 0px',
	    threshold: '0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1',
	    idleTimeout: 50,
	    trackHovers: false,
	    compact: false,
	    useNative: false,
	    animate: false,
	    transitionDelay: 0
	};

	var ObserverConstructor = void 0,
	    observer = void 0,
	    entries = void 0;

	entries = [{
	    intersectionRect: {
	        bottom: 0,
	        height: 0,
	        left: 0,
	        right: 0,
	        top: 0,
	        width: 0
	    },
	    intersectionRatio: 0,
	    time: 0
	}];

	entries[2] = entries[1] = entries[0];

	function number(current, previous) {
	    if (current !== previous) {
	        return '<span class="number changed">' + current + '</span>';
	    }

	    return '<span class="number">' + current + '</span>';
	}

	function text(value) {
	    return '<span class="text">' + value + '</span>';
	}

	function intersectioHandler(intersections) {
	    var tobs1 = entries[0],
	        tobs2 = entries[1],
	        tobs3 = entries[2];

	    for (var _iterator = intersections, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	        var _ref;

	        if (_isArray) {
	            if (_i >= _iterator.length) break;
	            _ref = _iterator[_i++];
	        } else {
	            _i = _iterator.next();
	            if (_i.done) break;
	            _ref = _i.value;
	        }

	        var entry = _ref;

	        switch (entry.target) {
	            case el1:
	                tobs1 = entry;
	                break;
	            case el2:
	                tobs2 = entry;
	                break;
	            case el3:
	                tobs3 = entry;
	                break;
	        }
	    }

	    var content = '\n[{\n    ' + text('intersectionRatio') + ': ' + number(tobs1.intersectionRatio, entries[0].intersectionRatio) + ',\n    ' + text('intersectionRect') + ': {\n        ' + text('bottom') + ': ' + number(tobs1.intersectionRect.bottom, entries[0].intersectionRect.bottom) + ',\n        ' + text('height') + ': ' + number(tobs1.intersectionRect.height, entries[0].intersectionRect.height) + ',\n        ' + text('left') + ': ' + number(tobs1.intersectionRect.left, entries[0].intersectionRect.left) + ',\n        ' + text('right') + ': ' + number(tobs1.intersectionRect.right, entries[0].intersectionRect.right) + ',\n        ' + text('top') + ': ' + number(tobs1.intersectionRect.top, entries[0].intersectionRect.top) + ',\n        ' + text('width') + ': ' + number(tobs1.intersectionRect.width, entries[0].intersectionRect.width) + '\n    },\n    ' + text('target') + ': div#target1,\n    ' + text('time') + ': ' + number(tobs1.time, entries[0].time) + '\n}, {\n    ' + text('intersectionRatio') + ': ' + number(tobs2.intersectionRatio, entries[1].intersectionRatio) + ',\n    ' + text('intersectionRect') + ': {\n        ' + text('bottom') + ': ' + number(tobs2.intersectionRect.bottom, entries[1].intersectionRect.bottom) + ',\n        ' + text('height') + ': ' + number(tobs2.intersectionRect.height, entries[1].intersectionRect.height) + ',\n        ' + text('left') + ': ' + number(tobs2.intersectionRect.left, entries[1].intersectionRect.left) + ',\n        ' + text('right') + ': ' + number(tobs2.intersectionRect.right, entries[1].intersectionRect.right) + ',\n        ' + text('top') + ': ' + number(tobs2.intersectionRect.top, entries[1].intersectionRect.top) + ',\n        ' + text('width') + ': ' + number(tobs2.intersectionRect.width, entries[1].intersectionRect.width) + '\n    },\n    ' + text('target') + ': div#target2,\n    ' + text('time') + ': ' + number(tobs2.time, entries[1].time) + '\n}, {\n    ' + text('intersectionRatio') + ': ' + number(tobs3.intersectionRatio, entries[2].intersectionRatio) + ',\n    ' + text('intersectionRect') + ': {\n        ' + text('bottom') + ': ' + number(tobs3.intersectionRect.bottom, entries[2].intersectionRect.bottom) + ',\n        ' + text('height') + ': ' + number(tobs3.intersectionRect.height, entries[2].intersectionRect.height) + ',\n        ' + text('left') + ': ' + number(tobs3.intersectionRect.left, entries[2].intersectionRect.left) + ',\n        ' + text('right') + ': ' + number(tobs3.intersectionRect.right, entries[2].intersectionRect.right) + ',\n        ' + text('top') + ': ' + number(tobs3.intersectionRect.top, entries[2].intersectionRect.top) + ',\n        ' + text('width') + ': ' + number(tobs3.intersectionRect.width, entries[2].intersectionRect.width) + '\n    },\n    ' + text('target') + ': div#target3,\n    ' + text('time') + ': ' + number(tobs3.time, entries[2].time) + '\n}]';

	    $observResults.innerHTML = content.split(/\n/g).map(function (line) {
	        return '<span class="line">' + line + '</span>';
	    }).join('\n');

	    entries[0] = tobs1;
	    entries[1] = tobs2;
	    entries[2] = tobs3;

	    console.log(intersections);
	}

	function initGui() {
	    var gui = new window.dat.GUI();

	    gui.add(config, 'rootMargin').onFinishChange(initObserver);
	    gui.add(config, 'threshold').onFinishChange(initObserver);

	    gui.add(config, 'idleTimeout', 0, 2000).onFinishChange(applyControllerSettings);
	    gui.add(config, 'transitionDelay', 0, 2000).step(5).onChange(applyTransitionDelay);
	    gui.add(config, 'trackHovers').onChange(applyControllerSettings);

	    if (window.IntersectionObserver) {
	        gui.add(config, 'useNative').onChange(initObserver);
	    }

	    gui.add(config, 'compact').onChange(function (value) {
	        document.getElementById('targets').classList.toggle('compact', value);
	    });

	    gui.add(config, 'animate').onChange(function (value) {
	        document.getElementById('targets').classList.toggle('collapse', value);
	    });
	}

	function initObserver() {
	    var tmpObserver = void 0;

	    if (observer) {
	        observer.disconnect();
	    }

	    ObserverConstructor = config.useNative ? window.IntersectionObserver : _IntersectionObserver2.default;

	    try {
	        tmpObserver = new ObserverConstructor(intersectioHandler, {
	            threshold: parseThreshold(config.threshold),
	            rootMargin: config.rootMargin
	        });

	        observer = tmpObserver;
	    } catch (e) {
	        alert(e.message);
	    }

	    observer.observe(el1);
	    observer.observe(el2);
	    observer.observe(el3);

	    applyControllerSettings();
	}

	function parseThreshold(threshold) {
	    return threshold.split(',').map(function (value) {
	        return Number(value.trim());
	    });
	}

	function applyControllerSettings() {
	    ObserverConstructor.idleTimeout = config.idleTimeout;
	    ObserverConstructor.trackHovers = config.trackHovers;
	}

	function applyTransitionDelay(value) {
	    value = value + 'ms';

	    el1.style.transitionDelay = value;
	    el2.style.transitionDelay = value;
	    el3.style.transitionDelay = value;
	}

	initGui();
	initObserver();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	!function (t, e) {
	  "object" == ( false ? "undefined" : _typeof(exports)) && "object" == ( false ? "undefined" : _typeof(module)) ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (e), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.IntersectionObserver = e() : t.IntersectionObserver = e();
	}(undefined, function () {
	  return function (t) {
	    function e(n) {
	      if (r[n]) return r[n].exports;var o = r[n] = { exports: {}, id: n, loaded: !1 };return t[n].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports;
	    }var r = {};return e.m = t, e.c = r, e.p = "", e(0);
	  }([function (t, e, r) {
	    "use strict";
	    function n(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }Object.defineProperty(e, "__esModule", { value: !0 });var o = r(1),
	        i = n(o),
	        s = void 0;s = "function" == typeof window.IntersectionObserver ? window.IntersectionObserver : i["default"], e["default"] = s, t.exports = e["default"];
	  }, function (t, e, r) {
	    "use strict";
	    function n(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e) {
	      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
	    }Object.defineProperty(e, "__esModule", { value: !0 });var i = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
	      return typeof t === "undefined" ? "undefined" : _typeof(t);
	    } : function (t) {
	      return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
	    },
	        s = function () {
	      function t(t, e) {
	        for (var r = 0; r < e.length; r++) {
	          var n = e[r];n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
	        }
	      }return function (e, r, n) {
	        return r && t(e.prototype, r), n && t(e, n), e;
	      };
	    }(),
	        a = r(2),
	        u = r(3),
	        c = n(u),
	        l = r(5),
	        h = n(l),
	        f = new c["default"](),
	        p = new a.WeakMap(),
	        d = function () {
	      function t(e, r) {
	        if (o(this, t), !arguments.length) throw new TypeError("1 argument required, but only 0 present.");var n = new h["default"](e, r, f, this);Object.defineProperties(this, { root: { value: n.root }, thresholds: { value: n.thresholds }, rootMargin: { value: n.rootMargin } }), p.set(this, n);
	      }return s(t, null, [{ key: "idleTimeout", get: function get() {
	          return f.idleTimeout;
	        }, set: function set(t) {
	          if ("number" != typeof t) throw new TypeError('type of "idleTimeout" value must be a number.');if (("undefined" == typeof t ? "undefined" : i(t)) < 0) throw new TypeError('"idleTimeout" value must be greater than 0.');f.idleTimeout = t;
	        } }, { key: "trackHovers", get: function get() {
	          return f.isHoverEnabled();
	        }, set: function set(t) {
	          if ("boolean" != typeof t) throw new TypeError('type of "trackHovers" value must be a boolean.');t ? f.enableHover() : f.disableHover();
	        } }]), t;
	    }();["observe", "unobserve", "disconnect", "takeRecords"].forEach(function (t) {
	      d.prototype[t] = function () {
	        var e;return (e = p.get(this))[t].apply(e, arguments);
	      };
	    }), e["default"] = d, t.exports = e["default"];
	  }, function (t, e) {
	    "use strict";
	    function r(t, e) {
	      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
	    }function n(t, e) {
	      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
	    }function o(t, e) {
	      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
	    }Object.defineProperty(e, "__esModule", { value: !0 });var i = function () {
	      function t(t, e) {
	        for (var r = 0; r < e.length; r++) {
	          var n = e[r];n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
	        }
	      }return function (e, r, n) {
	        return r && t(e.prototype, r), n && t(e, n), e;
	      };
	    }(),
	        s = "function" == typeof window.WeakMap && "function" == typeof window.Map,
	        a = function () {
	      function t(t, e) {
	        var r = -1;return t.some(function (t, n) {
	          var o = t[0] === e;return o && (r = n), o;
	        }), r;
	      }return s ? window.WeakMap : function () {
	        function e() {
	          o(this, e), this.__entries__ = [];
	        }return e.prototype.get = function (e) {
	          var r = t(this.__entries__, e);return this.__entries__[r][1];
	        }, e.prototype.set = function (e, r) {
	          var n = t(this.__entries__, e);~n ? this.__entries__[n][1] = r : this.__entries__.push([e, r]);
	        }, e.prototype["delete"] = function (e) {
	          var r = this.__entries__,
	              n = t(r, e);~n && r.splice(n, 1);
	        }, e.prototype.has = function (e) {
	          return !!~t(this.__entries__, e);
	        }, e;
	      }();
	    }(),
	        u = function () {
	      return s ? window.Map : function (t) {
	        function e() {
	          return o(this, e), r(this, t.apply(this, arguments));
	        }return n(e, t), e.prototype.clear = function () {
	          this.__entries__.splice(0, this.__entries__.length);
	        }, e.prototype.entries = function () {
	          return this.__entries__.slice();
	        }, e.prototype.keys = function () {
	          return this.__entries__.map(function (t) {
	            return t[0];
	          });
	        }, e.prototype.values = function () {
	          return this.__entries__.map(function (t) {
	            return t[1];
	          });
	        }, e.prototype.forEach = function (t) {
	          for (var e = arguments.length <= 1 || void 0 === arguments[1] ? null : arguments[1], r = this.__entries__, n = Array.isArray(r), o = 0, r = n ? r : r[Symbol.iterator]();;) {
	            var i;if (n) {
	              if (o >= r.length) break;i = r[o++];
	            } else {
	              if (o = r.next(), o.done) break;i = o.value;
	            }var s = i;t.call(e, s[1], s[0]);
	          }
	        }, i(e, [{ key: "size", get: function get() {
	            return this.__entries__.length;
	          } }]), e;
	      }(a);
	    }();e.Map = u, e.WeakMap = a;
	  }, function (t, e, r) {
	    "use strict";
	    function n(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e) {
	      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
	    }function i(t) {
	      var e = arguments.length <= 1 || void 0 === arguments[1] ? 0 : arguments[1],
	          r = !1;return function () {
	        for (var n = this, o = arguments.length, i = Array(o), s = 0; s < o; s++) {
	          i[s] = arguments[s];
	        }r !== !1 && clearTimeout(r), r = setTimeout(function () {
	          r = !1, t.apply(n, i);
	        }, e);
	      };
	    }Object.defineProperty(e, "__esModule", { value: !0 });var s = function () {
	      function t(t, e) {
	        for (var r = 0; r < e.length; r++) {
	          var n = e[r];n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
	        }
	      }return function (e, r, n) {
	        return r && t(e.prototype, r), n && t(e, n), e;
	      };
	    }(),
	        a = r(4),
	        u = n(a),
	        c = "function" == typeof window.MutationObserver,
	        l = function () {
	      return window.requestAnimationFrame ? window.requestAnimationFrame : function (t) {
	        return setTimeout(function () {
	          return t((0, u["default"])());
	        }, 1e3 / 60);
	      };
	    }(),
	        h = function () {
	      function t() {
	        var e = arguments.length <= 0 || void 0 === arguments[0] ? 50 : arguments[0],
	            r = !(arguments.length <= 1 || void 0 === arguments[1]) && arguments[1];o(this, t), this._idleTimeout = e, this._trackHovers = r, this._cycleStartTime = -1, this._isUpdateScheduled = !1, this._repeatCycle = !1, this._hoverInitiated = !1, this._mutationsObserver = null, this._isListening = !1, this._observers = [], this.startUpdateCycle = this.startUpdateCycle.bind(this), this.scheduleUpdate = this.scheduleUpdate.bind(this), this._onMutation = this._onMutation.bind(this), this._repeatHandler = i(this.scheduleUpdate, 200), this._onMouseOver = i(this.startUpdateCycle, 200);
	      }return t.prototype.connect = function (t) {
	        this.isConnected(t) || this._observers.push(t), this._isListening || this._initListeners();
	      }, t.prototype.disconnect = function (t) {
	        var e = this._observers,
	            r = e.indexOf(t);~r && e.splice(r, 1), !e.length && this._isListening && this._removeListeners();
	      }, t.prototype.isConnected = function (t) {
	        return !!~this._observers.indexOf(t);
	      }, t.prototype._updateObservers = function () {
	        for (var t = !1, e = this._observers, r = Array.isArray(e), n = 0, e = r ? e : e[Symbol.iterator]();;) {
	          var o;if (r) {
	            if (n >= e.length) break;o = e[n++];
	          } else {
	            if (n = e.next(), n.done) break;o = n.value;
	          }var i = o;i.updateObservations() && (t = !0), i.hasEntries() && i.notifySubscriber();
	        }return t;
	      }, t.prototype.startUpdateCycle = function () {
	        this._cycleStartTime = (0, u["default"])(), this.scheduleUpdate();
	      }, t.prototype.scheduleUpdate = function (t) {
	        var e = "number" == typeof t;if (e) {
	          var r = this._updateObservers();if (this._isUpdateScheduled = !1, !this._wasCycleStarted()) return;r ? this.startUpdateCycle() : this._hasIdleTimeEnded() ? this._onCycleEnded() : this.scheduleUpdate();
	        } else this._isUpdateScheduled || (l(this.scheduleUpdate), this._isUpdateScheduled = !0);
	      }, t.prototype._hasIdleTimeEnded = function () {
	        return (0, u["default"])() - this._cycleStartTime > this._idleTimeout;
	      }, t.prototype._wasCycleStarted = function () {
	        return this._cycleStartTime !== -1;
	      }, t.prototype._onCycleEnded = function () {
	        this._cycleStartTime = -1, this._repeatCycle && (this._cycleStartTime = 0, this._repeatHandler());
	      }, t.prototype._initListeners = function () {
	        this._isListening || (this._isListening = !0, window.addEventListener("resize", this.startUpdateCycle, !0), window.addEventListener("scroll", this.scheduleUpdate, !0), this._trackHovers && this._addHoverListener(), c ? (this._mutationsObserver = new MutationObserver(this._onMutation), this._mutationsObserver.observe(document, { attributes: !0, childList: !0, characterData: !0, subtree: !0 })) : (this._repeatCycle = !0, window.addEventListener("click", this.startUpdateCycle, !0), this.startUpdateCycle()));
	      }, t.prototype._removeListeners = function () {
	        this._isListening && (window.removeEventListener("resize", this.startUpdateCycle, !0), window.removeEventListener("scroll", this.scheduleUpdate, !0), this._removeHoverListener(), c ? this._mutationsObserver && (this._mutationsObserver.disconnect(), this._mutationsObserver = null) : (this._repeatCycle = !1, window.removeEventListener("click", this.startUpdateCycle, !0)), this._isListening = !1);
	      }, t.prototype.enableHover = function () {
	        this._trackHovers = !0, this._isListening && this._addHoverListener();
	      }, t.prototype.disableHover = function () {
	        this._trackHovers = !1, this._removeHoverListener();
	      }, t.prototype.isHoverEnabled = function () {
	        return this._trackHovers;
	      }, t.prototype._addHoverListener = function () {
	        this._hoverInitiated || (window.addEventListener("mouseover", this._onMouseOver, !0), this._hoverInitiated = !0);
	      }, t.prototype._removeHoverListener = function () {
	        this._hoverInitiated && (window.removeEventListener("mouseover", this._onMouseOver, !0), this._hoverInitiated = !1);
	      }, t.prototype._onMutation = function (t) {
	        var e = t.every(function (t) {
	          return "attributes" !== t.type;
	        });e ? this.scheduleUpdate() : this.startUpdateCycle();
	      }, s(t, [{ key: "idleTimeout", get: function get() {
	          return this._idleTimeout;
	        }, set: function set(t) {
	          this._idleTimeout = t;
	        } }]), t;
	    }();e["default"] = h, t.exports = e["default"];
	  }, function (t, e) {
	    "use strict";
	    Object.defineProperty(e, "__esModule", { value: !0 }), e["default"] = function () {
	      return window.performance && window.performance.now ? function () {
	        return window.performance.now();
	      } : function () {
	        return Date.now();
	      };
	    }(), t.exports = e["default"];
	  }, function (t, e, r) {
	    "use strict";
	    function n(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e) {
	      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
	    }function i() {
	      var t = arguments.length <= 0 || void 0 === arguments[0] ? 0 : arguments[0],
	          e = t;return Array.isArray(t) ? t.length || (e = [0]) : e = [t], e.map(function (t) {
	        if (t = Number(t), !window.isFinite(t)) throw new TypeError("The provided double value is non-finite.");if (t < 0 || t > 1) throw new RangeError("Threshold values must be between 0 and 1.");return t;
	      }).sort();
	    }function s() {
	      var t = arguments.length <= 0 || void 0 === arguments[0] ? "0px" : arguments[0];if (t = (t + "").split(/\s+/), t.length > 4) throw new Error("Extra text found at the end of rootMargin.");t[0] = t[0] || "0px", t[1] = t[1] || t[0], t[2] = t[2] || t[0], t[3] = t[3] || t[1];var e = t.join(" "),
	          r = t.map(function (t) {
	        var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t) || [],
	            r = e[1],
	            n = e[2],
	            o = "px" === n;if (r = parseFloat(r), !window.isFinite(r)) throw new Error("rootMargin must be specified in pixels or percent.");return o || (r /= 100), { value: r, pixels: o };
	      });return { rawData: e, parsedData: r };
	    }function a(t, e) {
	      e = e.map(function (e, r) {
	        var n = e.value;return e.pixels || (n *= r % 2 ? t.width : t.height), n;
	      });var r = { top: t.top - e[0], right: t.right + e[1], bottom: t.bottom + e[2], left: t.left - e[3] };return r.width = r.right - r.left, r.height = r.bottom - r.top, r;
	    }Object.defineProperty(e, "__esModule", { value: !0 });var u = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
	      return typeof t === "undefined" ? "undefined" : _typeof(t);
	    } : function (t) {
	      return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
	    },
	        c = r(2),
	        l = r(6),
	        h = r(7),
	        f = n(h),
	        p = function () {
	      function t(e) {
	        var r = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
	            n = arguments[2],
	            a = arguments[3];if (o(this, t), "function" != typeof e) throw new TypeError("The callback provided as parameter 1 is not a function.");if ("object" !== ("undefined" == typeof r ? "undefined" : u(r))) throw new TypeError("parameter 2 is not an object.");if ("root" in r && !(r.root instanceof Element)) throw new TypeError("member root is not of type Element.");var l = i(r.threshold),
	            h = s(r.rootMargin);this.root = r.root || null, this.rootMargin = h.rawData, this.thresholds = Object.freeze(l), this._root = r.root || document.documentElement, this._callback = e, this._rootMargin = h.parsedData, this._targets = new c.Map(), this._quedEntries = [], this._publicObserver = a || this, this.controller = n;
	      }return t.prototype.observe = function (t) {
	        if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");if (!(t instanceof Element)) throw new TypeError('parameter 1 is not of type "Element".');var e = this._targets;e.has(t) || (e.set(t, new f["default"](t, this)), this.controller.isConnected(this) || this.controller.connect(this), this.controller.startUpdateCycle());
	      }, t.prototype.unobserve = function (t) {
	        if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");if (!(t instanceof Element)) throw new TypeError('parameter 1 is not of type "Element".');var e = this._targets;e.has(t) && e["delete"](t), e.size || this.disconnect();
	      }, t.prototype.disconnect = function () {
	        this._targets.clear(), this.controller.disconnect(this);
	      }, t.prototype.takeRecords = function () {
	        return this._quedEntries.splice(0);
	      }, t.prototype.notifySubscriber = function () {
	        var t = this.takeRecords(),
	            e = this._publicObserver;t.length && this._callback.call(e, t, e);
	      }, t.prototype.queueEntry = function (t) {
	        this._quedEntries.push(t);
	      }, t.prototype.hasEntries = function () {
	        return !!this._quedEntries.length;
	      }, t.prototype.updateObservations = function () {
	        var t = this._root,
	            e = this.getRootRect(),
	            r = !1;return this._targets.forEach(function (n) {
	          var o = n.updateIntersection(t, e);(o.ratioChanged || o.targetRectChanged) && (r = !0);
	        }), r;
	      }, t.prototype.getThresholdGreaterThan = function (t) {
	        for (var e = this.thresholds, r = e.length, n = 0; n < r && e[n] <= t;) {
	          ++n;
	        }return n;
	      }, t.prototype.getRootRect = function () {
	        var t = (0, l.getRectangle)(this._root);return a(t, this._rootMargin);
	      }, t;
	    }();e["default"] = p, t.exports = e["default"];
	  }, function (t, e) {
	    "use strict";
	    function r(t) {
	      for (var e = {}, r = Object.keys(t), n = Array.isArray(r), o = 0, r = n ? r : r[Symbol.iterator]();;) {
	        var i;if (n) {
	          if (o >= r.length) break;i = r[o++];
	        } else {
	          if (o = r.next(), o.done) break;i = o.value;
	        }var s = i;e[s] = { value: t[s] };
	      }return Object.defineProperties({}, e);
	    }function n() {
	      var t = arguments.length <= 0 || void 0 === arguments[0] ? 0 : arguments[0],
	          e = arguments.length <= 1 || void 0 === arguments[1] ? 0 : arguments[1],
	          r = arguments.length <= 2 || void 0 === arguments[2] ? 0 : arguments[2],
	          n = arguments.length <= 3 || void 0 === arguments[3] ? 0 : arguments[3];return { left: t, top: e, width: r, height: n, bottom: e + n, right: t + r };
	    }function o(t) {
	      return t === document.documentElement ? n(0, 0, t.clientWidth, t.clientHeight) : t.getBoundingClientRect();
	    }function i(t) {
	      return t.width * t.height;
	    }function s(t) {
	      return 0 === t.height && 0 === t.width;
	    }function a(t, e) {
	      return t.top === e.top && t.left === e.left && t.right === e.right && t.bottom === e.bottom;
	    }Object.defineProperty(e, "__esModule", { value: !0 }), e.mapToClientRect = r, e.createRectangle = n, e.getRectangle = o, e.getArea = i, e.isEmpty = s, e.isEqual = a;
	  }, function (t, e, r) {
	    "use strict";
	    function n(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e) {
	      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
	    }function i(t, e) {
	      var r = document.documentElement;return t !== r && !r.contains(t) || !t.contains(e);
	    }function s(t, e) {
	      var r = Math.max(e.left, t.left),
	          n = Math.min(e.right, t.right),
	          o = Math.max(e.top, t.top),
	          i = Math.min(e.bottom, t.bottom),
	          s = n - r,
	          a = i - o;return (0, l.createRectangle)(r, o, s, a);
	    }function a(t, e, r, n) {
	      for (var o = n, i = e.parentNode, a = !1; !a;) {
	        var u = null;i === t || 1 !== i.nodeType ? (a = !0, u = r) : "visible" !== window.getComputedStyle(i).overflow && (u = (0, l.getRectangle)(i)), u && (o = s(o, u)), i = i.parentNode;
	      }return o;
	    }Object.defineProperty(e, "__esModule", { value: !0 });var u = r(4),
	        c = n(u),
	        l = r(6),
	        h = r(8),
	        f = n(h),
	        p = (0, l.createRectangle)(),
	        d = function () {
	      function t(e, r) {
	        o(this, t), this.target = e, this.observer = r, this.prevTargetRect = p, this.prevThreshold = 0, this.prevRatio = 0;
	      }return t.prototype.updateIntersection = function (t, e) {
	        var r = (0, l.getRectangle)(this.target),
	            n = this.getIntersectionData(t, e, r),
	            o = +n.exists,
	            i = n.ratio !== this.prevRatio,
	            s = !(0, l.isEqual)(r, this.prevTargetRect),
	            a = void 0;if (n.exists && !(0, l.isEmpty)(r) && (o = this.observer.getThresholdGreaterThan(n.ratio)), a = o !== this.prevThreshold, this.prevTargetRect = r, this.prevThreshold = o, this.prevRatio = n.ratio, n.exists || (n.ratio = 0, n.rect = p), a) {
	          var u = new f["default"](this.target, r, n.rect, n.ratio, e, (0, c["default"])());this.observer.queueEntry(u);
	        }return { ratioChanged: i, thresholdChanged: a, targetRectChanged: s };
	      }, t.prototype.getIntersectionData = function (t, e, r) {
	        var n = this.target;r || (r = (0, l.getRectangle)(this.target)), e || (e = (0, l.getRectangle)(t));var o = i(t, n),
	            s = o ? p : a(t, n, e, r),
	            u = !o && s.width >= 0 && s.height >= 0,
	            c = (0, l.getArea)(s) / (0, l.getArea)(r) || 0;return { rect: s, ratio: c, exists: u };
	      }, t;
	    }();e["default"] = d, t.exports = e["default"];
	  }, function (t, e, r) {
	    "use strict";
	    function n(t, e) {
	      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
	    }Object.defineProperty(e, "__esModule", { value: !0 });var o = r(6),
	        i = function s(t, e, r, i, a, u) {
	      n(this, s), Object.defineProperties(this, { boundingClientRect: { value: e }, intersectionRatio: { value: i }, intersectionRect: { value: (0, o.mapToClientRect)(r) }, rootBounds: { value: (0, o.mapToClientRect)(a) }, target: { value: t }, time: { value: u } });
	    };e["default"] = i, t.exports = e["default"];
	  }]);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ }
/******/ ]);