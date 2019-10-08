(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
	(global = global || self, factory(global.ReactFlow = {}, global.React));
}(this, function (exports, React) { 'use strict';

	var React__default = 'default' in React ? React['default'] : React;

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var reactIs_production_min = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports,"__esModule",{value:!0});
	var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?Symbol.for("react.suspense_list"):
	60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.fundamental"):60117,w=b?Symbol.for("react.responder"):60118,x=b?Symbol.for("react.scope"):60119;function y(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case h:return a;default:return u}}case t:case r:case d:return u}}}function z(a){return y(a)===m}
	exports.typeOf=y;exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;
	exports.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===v||a.$$typeof===w||a.$$typeof===x)};exports.isAsyncMode=function(a){return z(a)||y(a)===l};exports.isConcurrentMode=z;exports.isContextConsumer=function(a){return y(a)===k};exports.isContextProvider=function(a){return y(a)===h};
	exports.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return y(a)===n};exports.isFragment=function(a){return y(a)===e};exports.isLazy=function(a){return y(a)===t};exports.isMemo=function(a){return y(a)===r};exports.isPortal=function(a){return y(a)===d};exports.isProfiler=function(a){return y(a)===g};exports.isStrictMode=function(a){return y(a)===f};exports.isSuspense=function(a){return y(a)===p};
	});

	unwrapExports(reactIs_production_min);
	var reactIs_production_min_1 = reactIs_production_min.typeOf;
	var reactIs_production_min_2 = reactIs_production_min.AsyncMode;
	var reactIs_production_min_3 = reactIs_production_min.ConcurrentMode;
	var reactIs_production_min_4 = reactIs_production_min.ContextConsumer;
	var reactIs_production_min_5 = reactIs_production_min.ContextProvider;
	var reactIs_production_min_6 = reactIs_production_min.Element;
	var reactIs_production_min_7 = reactIs_production_min.ForwardRef;
	var reactIs_production_min_8 = reactIs_production_min.Fragment;
	var reactIs_production_min_9 = reactIs_production_min.Lazy;
	var reactIs_production_min_10 = reactIs_production_min.Memo;
	var reactIs_production_min_11 = reactIs_production_min.Portal;
	var reactIs_production_min_12 = reactIs_production_min.Profiler;
	var reactIs_production_min_13 = reactIs_production_min.StrictMode;
	var reactIs_production_min_14 = reactIs_production_min.Suspense;
	var reactIs_production_min_15 = reactIs_production_min.isValidElementType;
	var reactIs_production_min_16 = reactIs_production_min.isAsyncMode;
	var reactIs_production_min_17 = reactIs_production_min.isConcurrentMode;
	var reactIs_production_min_18 = reactIs_production_min.isContextConsumer;
	var reactIs_production_min_19 = reactIs_production_min.isContextProvider;
	var reactIs_production_min_20 = reactIs_production_min.isElement;
	var reactIs_production_min_21 = reactIs_production_min.isForwardRef;
	var reactIs_production_min_22 = reactIs_production_min.isFragment;
	var reactIs_production_min_23 = reactIs_production_min.isLazy;
	var reactIs_production_min_24 = reactIs_production_min.isMemo;
	var reactIs_production_min_25 = reactIs_production_min.isPortal;
	var reactIs_production_min_26 = reactIs_production_min.isProfiler;
	var reactIs_production_min_27 = reactIs_production_min.isStrictMode;
	var reactIs_production_min_28 = reactIs_production_min.isSuspense;

	var reactIs_development = createCommonjsModule(function (module, exports) {
	});

	unwrapExports(reactIs_development);
	var reactIs_development_1 = reactIs_development.typeOf;
	var reactIs_development_2 = reactIs_development.AsyncMode;
	var reactIs_development_3 = reactIs_development.ConcurrentMode;
	var reactIs_development_4 = reactIs_development.ContextConsumer;
	var reactIs_development_5 = reactIs_development.ContextProvider;
	var reactIs_development_6 = reactIs_development.Element;
	var reactIs_development_7 = reactIs_development.ForwardRef;
	var reactIs_development_8 = reactIs_development.Fragment;
	var reactIs_development_9 = reactIs_development.Lazy;
	var reactIs_development_10 = reactIs_development.Memo;
	var reactIs_development_11 = reactIs_development.Portal;
	var reactIs_development_12 = reactIs_development.Profiler;
	var reactIs_development_13 = reactIs_development.StrictMode;
	var reactIs_development_14 = reactIs_development.Suspense;
	var reactIs_development_15 = reactIs_development.isValidElementType;
	var reactIs_development_16 = reactIs_development.isAsyncMode;
	var reactIs_development_17 = reactIs_development.isConcurrentMode;
	var reactIs_development_18 = reactIs_development.isContextConsumer;
	var reactIs_development_19 = reactIs_development.isContextProvider;
	var reactIs_development_20 = reactIs_development.isElement;
	var reactIs_development_21 = reactIs_development.isForwardRef;
	var reactIs_development_22 = reactIs_development.isFragment;
	var reactIs_development_23 = reactIs_development.isLazy;
	var reactIs_development_24 = reactIs_development.isMemo;
	var reactIs_development_25 = reactIs_development.isPortal;
	var reactIs_development_26 = reactIs_development.isProfiler;
	var reactIs_development_27 = reactIs_development.isStrictMode;
	var reactIs_development_28 = reactIs_development.isSuspense;

	var reactIs = createCommonjsModule(function (module) {

	{
	  module.exports = reactIs_production_min;
	}
	});

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	var ReactPropTypesSecret_1 = ReactPropTypesSecret;

	var has = Function.call.bind(Object.prototype.hasOwnProperty);

	function emptyFunction() {}
	function emptyFunctionWithReset() {}
	emptyFunctionWithReset.resetWarningCache = emptyFunction;

	var factoryWithThrowingShims = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret_1) {
	      // It is still safe when called from React.
	      return;
	    }
	    var err = new Error(
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	    err.name = 'Invariant Violation';
	    throw err;
	  }  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  }  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,

	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    elementType: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim,

	    checkPropTypes: emptyFunctionWithReset,
	    resetWarningCache: emptyFunction
	  };

	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};

	var propTypes = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	{
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = factoryWithThrowingShims();
	}
	});

	var obj;
	var NOTHING = typeof Symbol !== "undefined" ? Symbol("immer-nothing") : ( obj = {}, obj["immer-nothing"] = true, obj );
	var DRAFTABLE = typeof Symbol !== "undefined" && Symbol.for ? Symbol.for("immer-draftable") : "__$immer_draftable";
	var DRAFT_STATE = typeof Symbol !== "undefined" && Symbol.for ? Symbol.for("immer-state") : "__$immer_state";
	function isDraft(value) {
	  return !!value && !!value[DRAFT_STATE];
	}
	function isDraftable(value) {
	  if (!value || typeof value !== "object") { return false; }
	  if (Array.isArray(value)) { return true; }
	  var proto = Object.getPrototypeOf(value);
	  if (!proto || proto === Object.prototype) { return true; }
	  return !!value[DRAFTABLE] || !!value.constructor[DRAFTABLE];
	}
	var assign = Object.assign || function assign(target, value) {
	  for (var key in value) {
	    if (has$1(value, key)) {
	      target[key] = value[key];
	    }
	  }

	  return target;
	};
	var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function (obj) { return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj)); } : Object.getOwnPropertyNames;
	function shallowCopy(base, invokeGetters) {
	  if ( invokeGetters === void 0 ) invokeGetters = false;

	  if (Array.isArray(base)) { return base.slice(); }
	  var clone = Object.create(Object.getPrototypeOf(base));
	  ownKeys(base).forEach(function (key) {
	    if (key === DRAFT_STATE) {
	      return; // Never copy over draft state.
	    }

	    var desc = Object.getOwnPropertyDescriptor(base, key);
	    var value = desc.value;

	    if (desc.get) {
	      if (invokeGetters) {
	        value = desc.get.call(base);
	      }
	    }

	    if (desc.enumerable) {
	      clone[key] = value;
	    } else if (invokeGetters) {
	      Object.defineProperty(clone, key, {
	        value: value,
	        writable: true,
	        configurable: true
	      });
	    }
	  });
	  return clone;
	}
	function each(value, cb) {
	  if (Array.isArray(value)) {
	    for (var i = 0; i < value.length; i++) { cb(i, value[i], value); }
	  } else {
	    ownKeys(value).forEach(function (key) { return cb(key, value[key], value); });
	  }
	}
	function isEnumerable(base, prop) {
	  var desc = Object.getOwnPropertyDescriptor(base, prop);
	  return !!desc && desc.enumerable;
	}
	function has$1(thing, prop) {
	  return Object.prototype.hasOwnProperty.call(thing, prop);
	}
	function is(x, y) {
	  // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
	  if (x === y) {
	    return x !== 0 || 1 / x === 1 / y;
	  } else {
	    return x !== x && y !== y;
	  }
	}

	/** Each scope represents a `produce` call. */

	var ImmerScope = function ImmerScope(parent) {
	  this.drafts = [];
	  this.parent = parent; // Whenever the modified draft contains a draft from another scope, we
	  // need to prevent auto-freezing so the unowned draft can be finalized.

	  this.canAutoFreeze = true; // To avoid prototype lookups:

	  this.patches = null;
	};

	ImmerScope.prototype.usePatches = function usePatches (patchListener) {
	  if (patchListener) {
	    this.patches = [];
	    this.inversePatches = [];
	    this.patchListener = patchListener;
	  }
	};

	ImmerScope.prototype.revoke = function revoke$1 () {
	  this.leave();
	  this.drafts.forEach(revoke);
	  this.drafts = null; // Make draft-related methods throw.
	};

	ImmerScope.prototype.leave = function leave () {
	  if (this === ImmerScope.current) {
	    ImmerScope.current = this.parent;
	  }
	};
	ImmerScope.current = null;

	ImmerScope.enter = function () {
	  return this.current = new ImmerScope(this.current);
	};

	function revoke(draft) {
	  draft[DRAFT_STATE].revoke();
	}

	// but share them all instead

	var descriptors = {};
	function willFinalize(scope, result, isReplaced) {
	  scope.drafts.forEach(function (draft) {
	    draft[DRAFT_STATE].finalizing = true;
	  });

	  if (!isReplaced) {
	    if (scope.patches) {
	      markChangesRecursively(scope.drafts[0]);
	    } // This is faster when we don't care about which attributes changed.


	    markChangesSweep(scope.drafts);
	  } // When a child draft is returned, look for changes.
	  else if (isDraft(result) && result[DRAFT_STATE].scope === scope) {
	      markChangesSweep(scope.drafts);
	    }
	}
	function createProxy(base, parent) {
	  var isArray = Array.isArray(base);
	  var draft = clonePotentialDraft(base);
	  each(draft, function (prop) {
	    proxyProperty(draft, prop, isArray || isEnumerable(base, prop));
	  }); // See "proxy.js" for property documentation.

	  var scope = parent ? parent.scope : ImmerScope.current;
	  var state = {
	    scope: scope,
	    modified: false,
	    finalizing: false,
	    // es5 only
	    finalized: false,
	    assigned: {},
	    parent: parent,
	    base: base,
	    draft: draft,
	    copy: null,
	    revoke: revoke$1,
	    revoked: false // es5 only

	  };
	  createHiddenProperty(draft, DRAFT_STATE, state);
	  scope.drafts.push(draft);
	  return draft;
	}

	function revoke$1() {
	  this.revoked = true;
	}

	function source(state) {
	  return state.copy || state.base;
	} // Access a property without creating an Immer draft.


	function peek(draft, prop) {
	  var state = draft[DRAFT_STATE];

	  if (state && !state.finalizing) {
	    state.finalizing = true;
	    var value = draft[prop];
	    state.finalizing = false;
	    return value;
	  }

	  return draft[prop];
	}

	function get(state, prop) {
	  assertUnrevoked(state);
	  var value = peek(source(state), prop);
	  if (state.finalizing) { return value; } // Create a draft if the value is unmodified.

	  if (value === peek(state.base, prop) && isDraftable(value)) {
	    prepareCopy(state);
	    return state.copy[prop] = createProxy(value, state);
	  }

	  return value;
	}

	function set(state, prop, value) {
	  assertUnrevoked(state);
	  state.assigned[prop] = true;

	  if (!state.modified) {
	    if (is(value, peek(source(state), prop))) { return; }
	    markChanged(state);
	    prepareCopy(state);
	  }

	  state.copy[prop] = value;
	}

	function markChanged(state) {
	  if (!state.modified) {
	    state.modified = true;
	    if (state.parent) { markChanged(state.parent); }
	  }
	}

	function prepareCopy(state) {
	  if (!state.copy) { state.copy = clonePotentialDraft(state.base); }
	}

	function clonePotentialDraft(base) {
	  var state = base && base[DRAFT_STATE];

	  if (state) {
	    state.finalizing = true;
	    var draft = shallowCopy(state.draft, true);
	    state.finalizing = false;
	    return draft;
	  }

	  return shallowCopy(base);
	}

	function proxyProperty(draft, prop, enumerable) {
	  var desc = descriptors[prop];

	  if (desc) {
	    desc.enumerable = enumerable;
	  } else {
	    descriptors[prop] = desc = {
	      configurable: true,
	      enumerable: enumerable,

	      get: function get$1() {
	        return get(this[DRAFT_STATE], prop);
	      },

	      set: function set$1(value) {
	        set(this[DRAFT_STATE], prop, value);
	      }

	    };
	  }

	  Object.defineProperty(draft, prop, desc);
	}

	function assertUnrevoked(state) {
	  if (state.revoked === true) { throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(source(state))); }
	} // This looks expensive, but only proxies are visited, and only objects without known changes are scanned.


	function markChangesSweep(drafts) {
	  // The natural order of drafts in the `scope` array is based on when they
	  // were accessed. By processing drafts in reverse natural order, we have a
	  // better chance of processing leaf nodes first. When a leaf node is known to
	  // have changed, we can avoid any traversal of its ancestor nodes.
	  for (var i = drafts.length - 1; i >= 0; i--) {
	    var state = drafts[i][DRAFT_STATE];

	    if (!state.modified) {
	      if (Array.isArray(state.base)) {
	        if (hasArrayChanges(state)) { markChanged(state); }
	      } else if (hasObjectChanges(state)) { markChanged(state); }
	    }
	  }
	}

	function markChangesRecursively(object) {
	  if (!object || typeof object !== "object") { return; }
	  var state = object[DRAFT_STATE];
	  if (!state) { return; }
	  var base = state.base;
	  var draft = state.draft;
	  var assigned = state.assigned;

	  if (!Array.isArray(object)) {
	    // Look for added keys.
	    Object.keys(draft).forEach(function (key) {
	      // The `undefined` check is a fast path for pre-existing keys.
	      if (base[key] === undefined && !has$1(base, key)) {
	        assigned[key] = true;
	        markChanged(state);
	      } else if (!assigned[key]) {
	        // Only untouched properties trigger recursion.
	        markChangesRecursively(draft[key]);
	      }
	    }); // Look for removed keys.

	    Object.keys(base).forEach(function (key) {
	      // The `undefined` check is a fast path for pre-existing keys.
	      if (draft[key] === undefined && !has$1(draft, key)) {
	        assigned[key] = false;
	        markChanged(state);
	      }
	    });
	  } else if (hasArrayChanges(state)) {
	    markChanged(state);
	    assigned.length = true;

	    if (draft.length < base.length) {
	      for (var i = draft.length; i < base.length; i++) { assigned[i] = false; }
	    } else {
	      for (var i$1 = base.length; i$1 < draft.length; i$1++) { assigned[i$1] = true; }
	    }

	    for (var i$2 = 0; i$2 < draft.length; i$2++) {
	      // Only untouched indices trigger recursion.
	      if (assigned[i$2] === undefined) { markChangesRecursively(draft[i$2]); }
	    }
	  }
	}

	function hasObjectChanges(state) {
	  var base = state.base;
	  var draft = state.draft; // Search for added keys and changed keys. Start at the back, because
	  // non-numeric keys are ordered by time of definition on the object.

	  var keys = Object.keys(draft);

	  for (var i = keys.length - 1; i >= 0; i--) {
	    var key = keys[i];
	    var baseValue = base[key]; // The `undefined` check is a fast path for pre-existing keys.

	    if (baseValue === undefined && !has$1(base, key)) {
	      return true;
	    } // Once a base key is deleted, future changes go undetected, because its
	    // descriptor is erased. This branch detects any missed changes.
	    else {
	        var value = draft[key];
	        var state$1 = value && value[DRAFT_STATE];

	        if (state$1 ? state$1.base !== baseValue : !is(value, baseValue)) {
	          return true;
	        }
	      }
	  } // At this point, no keys were added or changed.
	  // Compare key count to determine if keys were deleted.


	  return keys.length !== Object.keys(base).length;
	}

	function hasArrayChanges(state) {
	  var draft = state.draft;
	  if (draft.length !== state.base.length) { return true; } // See #116
	  // If we first shorten the length, our array interceptors will be removed.
	  // If after that new items are added, result in the same original length,
	  // those last items will have no intercepting property.
	  // So if there is no own descriptor on the last position, we know that items were removed and added
	  // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
	  // the last one

	  var descriptor = Object.getOwnPropertyDescriptor(draft, draft.length - 1); // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)

	  if (descriptor && !descriptor.get) { return true; } // For all other cases, we don't have to compare, as they would have been picked up by the index setters

	  return false;
	}

	function createHiddenProperty(target, prop, value) {
	  Object.defineProperty(target, prop, {
	    value: value,
	    enumerable: false,
	    writable: true
	  });
	}

	var legacyProxy = /*#__PURE__*/Object.freeze({
	    willFinalize: willFinalize,
	    createProxy: createProxy
	});

	function willFinalize$1() {}
	function createProxy$1(base, parent) {
	  var scope = parent ? parent.scope : ImmerScope.current;
	  var state = {
	    // Track which produce call this is associated with.
	    scope: scope,
	    // True for both shallow and deep changes.
	    modified: false,
	    // Used during finalization.
	    finalized: false,
	    // Track which properties have been assigned (true) or deleted (false).
	    assigned: {},
	    // The parent draft state.
	    parent: parent,
	    // The base state.
	    base: base,
	    // The base proxy.
	    draft: null,
	    // Any property proxies.
	    drafts: {},
	    // The base copy with any updated values.
	    copy: null,
	    // Called by the `produce` function.
	    revoke: null
	  };
	  var ref = Array.isArray(base) ? // [state] is used for arrays, to make sure the proxy is array-ish and not violate invariants,
	  // although state itself is an object
	  Proxy.revocable([state], arrayTraps) : Proxy.revocable(state, objectTraps);
	  var revoke = ref.revoke;
	  var proxy = ref.proxy;
	  state.draft = proxy;
	  state.revoke = revoke;
	  scope.drafts.push(proxy);
	  return proxy;
	}
	var objectTraps = {
	  get: get$1,

	  has: function has(target, prop) {
	    return prop in source$1(target);
	  },

	  ownKeys: function ownKeys(target) {
	    return Reflect.ownKeys(source$1(target));
	  },

	  set: set$1,
	  deleteProperty: deleteProperty,
	  getOwnPropertyDescriptor: getOwnPropertyDescriptor,

	  defineProperty: function defineProperty() {
	    throw new Error("Object.defineProperty() cannot be used on an Immer draft"); // prettier-ignore
	  },

	  getPrototypeOf: function getPrototypeOf(target) {
	    return Object.getPrototypeOf(target.base);
	  },

	  setPrototypeOf: function setPrototypeOf() {
	    throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft"); // prettier-ignore
	  }

	};
	var arrayTraps = {};
	each(objectTraps, function (key, fn) {
	  arrayTraps[key] = function () {
	    arguments[0] = arguments[0][0];
	    return fn.apply(this, arguments);
	  };
	});

	arrayTraps.deleteProperty = function (state, prop) {
	  if (isNaN(parseInt(prop))) {
	    throw new Error("Immer only supports deleting array indices"); // prettier-ignore
	  }

	  return objectTraps.deleteProperty.call(this, state[0], prop);
	};

	arrayTraps.set = function (state, prop, value) {
	  if (prop !== "length" && isNaN(parseInt(prop))) {
	    throw new Error("Immer only supports setting array indices and the 'length' property"); // prettier-ignore
	  }

	  return objectTraps.set.call(this, state[0], prop, value);
	}; // returns the object we should be reading the current value from, which is base, until some change has been made


	function source$1(state) {
	  return state.copy || state.base;
	} // Access a property without creating an Immer draft.


	function peek$1(draft, prop) {
	  var state = draft[DRAFT_STATE];
	  var desc = Reflect.getOwnPropertyDescriptor(state ? source$1(state) : draft, prop);
	  return desc && desc.value;
	}

	function get$1(state, prop) {
	  if (prop === DRAFT_STATE) { return state; }
	  var drafts = state.drafts; // Check for existing draft in unmodified state.

	  if (!state.modified && has$1(drafts, prop)) {
	    return drafts[prop];
	  }

	  var value = source$1(state)[prop];

	  if (state.finalized || !isDraftable(value)) {
	    return value;
	  } // Check for existing draft in modified state.


	  if (state.modified) {
	    // Assigned values are never drafted. This catches any drafts we created, too.
	    if (value !== peek$1(state.base, prop)) { return value; } // Store drafts on the copy (when one exists).

	    drafts = state.copy;
	  }

	  return drafts[prop] = createProxy$1(value, state);
	}

	function set$1(state, prop, value) {
	  if (!state.modified) {
	    var baseValue = peek$1(state.base, prop); // Optimize based on value's truthiness. Truthy values are guaranteed to
	    // never be undefined, so we can avoid the `in` operator. Lastly, truthy
	    // values may be drafts, but falsy values are never drafts.

	    var isUnchanged = value ? is(baseValue, value) || value === state.drafts[prop] : is(baseValue, value) && prop in state.base;
	    if (isUnchanged) { return true; }
	    markChanged$1(state);
	  }

	  state.assigned[prop] = true;
	  state.copy[prop] = value;
	  return true;
	}

	function deleteProperty(state, prop) {
	  // The `undefined` check is a fast path for pre-existing keys.
	  if (peek$1(state.base, prop) !== undefined || prop in state.base) {
	    state.assigned[prop] = false;
	    markChanged$1(state);
	  }

	  if (state.copy) { delete state.copy[prop]; }
	  return true;
	} // Note: We never coerce `desc.value` into an Immer draft, because we can't make
	// the same guarantee in ES5 mode.


	function getOwnPropertyDescriptor(state, prop) {
	  var owner = source$1(state);
	  var desc = Reflect.getOwnPropertyDescriptor(owner, prop);

	  if (desc) {
	    desc.writable = true;
	    desc.configurable = !Array.isArray(owner) || prop !== "length";
	  }

	  return desc;
	}

	function markChanged$1(state) {
	  if (!state.modified) {
	    state.modified = true;
	    state.copy = assign(shallowCopy(state.base), state.drafts);
	    state.drafts = null;
	    if (state.parent) { markChanged$1(state.parent); }
	  }
	}

	var modernProxy = /*#__PURE__*/Object.freeze({
	    willFinalize: willFinalize$1,
	    createProxy: createProxy$1
	});

	function generatePatches(state, basePath, patches, inversePatches) {
	  Array.isArray(state.base) ? generateArrayPatches(state, basePath, patches, inversePatches) : generateObjectPatches(state, basePath, patches, inversePatches);
	}

	function generateArrayPatches(state, basePath, patches, inversePatches) {
	  var assign, assign$1;

	  var base = state.base;
	  var copy = state.copy;
	  var assigned = state.assigned; // Reduce complexity by ensuring `base` is never longer.

	  if (copy.length < base.length) {
	    (assign = [copy, base], base = assign[0], copy = assign[1]);
	    (assign$1 = [inversePatches, patches], patches = assign$1[0], inversePatches = assign$1[1]);
	  }

	  var delta = copy.length - base.length; // Find the first replaced index.

	  var start = 0;

	  while (base[start] === copy[start] && start < base.length) {
	    ++start;
	  } // Find the last replaced index. Search from the end to optimize splice patches.


	  var end = base.length;

	  while (end > start && base[end - 1] === copy[end + delta - 1]) {
	    --end;
	  } // Process replaced indices.


	  for (var i = start; i < end; ++i) {
	    if (assigned[i] && copy[i] !== base[i]) {
	      var path = basePath.concat([i]);
	      patches.push({
	        op: "replace",
	        path: path,
	        value: copy[i]
	      });
	      inversePatches.push({
	        op: "replace",
	        path: path,
	        value: base[i]
	      });
	    }
	  }

	  var useRemove = end != base.length;
	  var replaceCount = patches.length; // Process added indices.

	  for (var i$1 = end + delta - 1; i$1 >= end; --i$1) {
	    var path$1 = basePath.concat([i$1]);
	    patches[replaceCount + i$1 - end] = {
	      op: "add",
	      path: path$1,
	      value: copy[i$1]
	    };

	    if (useRemove) {
	      inversePatches.push({
	        op: "remove",
	        path: path$1
	      });
	    }
	  } // One "replace" patch reverses all non-splicing "add" patches.


	  if (!useRemove) {
	    inversePatches.push({
	      op: "replace",
	      path: basePath.concat(["length"]),
	      value: base.length
	    });
	  }
	}

	function generateObjectPatches(state, basePath, patches, inversePatches) {
	  var base = state.base;
	  var copy = state.copy;
	  each(state.assigned, function (key, assignedValue) {
	    var origValue = base[key];
	    var value = copy[key];
	    var op = !assignedValue ? "remove" : key in base ? "replace" : "add";
	    if (origValue === value && op === "replace") { return; }
	    var path = basePath.concat(key);
	    patches.push(op === "remove" ? {
	      op: op,
	      path: path
	    } : {
	      op: op,
	      path: path,
	      value: value
	    });
	    inversePatches.push(op === "add" ? {
	      op: "remove",
	      path: path
	    } : op === "remove" ? {
	      op: "add",
	      path: path,
	      value: origValue
	    } : {
	      op: "replace",
	      path: path,
	      value: origValue
	    });
	  });
	}

	function applyPatches(draft, patches) {
	  for (var i = 0; i < patches.length; i++) {
	    var patch = patches[i];
	    var path = patch.path;

	    if (path.length === 0 && patch.op === "replace") {
	      draft = patch.value;
	    } else {
	      var base = draft;

	      for (var i$1 = 0; i$1 < path.length - 1; i$1++) {
	        base = base[path[i$1]];
	        if (!base || typeof base !== "object") { throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/")); } // prettier-ignore
	      }

	      var key = path[path.length - 1];

	      switch (patch.op) {
	        case "replace":
	          base[key] = patch.value;
	          break;

	        case "add":
	          if (Array.isArray(base)) {
	            // TODO: support "foo/-" paths for appending to an array
	            base.splice(key, 0, patch.value);
	          } else {
	            base[key] = patch.value;
	          }

	          break;

	        case "remove":
	          if (Array.isArray(base)) {
	            base.splice(key, 1);
	          } else {
	            delete base[key];
	          }

	          break;

	        default:
	          throw new Error("Unsupported patch operation: " + patch.op);
	      }
	    }
	  }

	  return draft;
	}

	function verifyMinified() {}

	var configDefaults = {
	  useProxies: typeof Proxy !== "undefined" && typeof Reflect !== "undefined",
	  autoFreeze: typeof process !== "undefined" ? "production" !== "production" : verifyMinified.name === "verifyMinified",
	  onAssign: null,
	  onDelete: null,
	  onCopy: null
	};
	var Immer = function Immer(config) {
	  assign(this, configDefaults, config);
	  this.setUseProxies(this.useProxies);
	  this.produce = this.produce.bind(this);
	};

	Immer.prototype.produce = function produce (base, recipe, patchListener) {
	    var this$1 = this;

	  // curried invocation
	  if (typeof base === "function" && typeof recipe !== "function") {
	    var defaultBase = recipe;
	    recipe = base;
	    var self = this;
	    return function curriedProduce(base) {
	        var this$1 = this;
	        if ( base === void 0 ) base = defaultBase;
	        var args = [], len = arguments.length - 1;
	        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

	      return self.produce(base, function (draft) { return recipe.call.apply(recipe, [ this$1, draft ].concat( args )); }); // prettier-ignore
	    };
	  } // prettier-ignore


	  {
	    if (typeof recipe !== "function") {
	      throw new Error("The first or second argument to `produce` must be a function");
	    }

	    if (patchListener !== undefined && typeof patchListener !== "function") {
	      throw new Error("The third argument to `produce` must be a function or undefined");
	    }
	  }
	  var result; // Only plain objects, arrays, and "immerable classes" are drafted.

	  if (isDraftable(base)) {
	    var scope = ImmerScope.enter();
	    var proxy = this.createProxy(base);
	    var hasError = true;

	    try {
	      result = recipe(proxy);
	      hasError = false;
	    } finally {
	      // finally instead of catch + rethrow better preserves original stack
	      if (hasError) { scope.revoke(); }else { scope.leave(); }
	    }

	    if (result instanceof Promise) {
	      return result.then(function (result) {
	        scope.usePatches(patchListener);
	        return this$1.processResult(result, scope);
	      }, function (error) {
	        scope.revoke();
	        throw error;
	      });
	    }

	    scope.usePatches(patchListener);
	    return this.processResult(result, scope);
	  } else {
	    result = recipe(base);
	    if (result === undefined) { return base; }
	    return result !== NOTHING ? result : undefined;
	  }
	};

	Immer.prototype.createDraft = function createDraft (base) {
	  if (!isDraftable(base)) {
	    throw new Error("First argument to `createDraft` must be a plain object, an array, or an immerable object"); // prettier-ignore
	  }

	  var scope = ImmerScope.enter();
	  var proxy = this.createProxy(base);
	  proxy[DRAFT_STATE].isManual = true;
	  scope.leave();
	  return proxy;
	};

	Immer.prototype.finishDraft = function finishDraft (draft, patchListener) {
	  var state = draft && draft[DRAFT_STATE];

	  if (!state || !state.isManual) {
	    throw new Error("First argument to `finishDraft` must be a draft returned by `createDraft`"); // prettier-ignore
	  }

	  if (state.finalized) {
	    throw new Error("The given draft is already finalized"); // prettier-ignore
	  }

	  var scope = state.scope;
	  scope.usePatches(patchListener);
	  return this.processResult(undefined, scope);
	};

	Immer.prototype.setAutoFreeze = function setAutoFreeze (value) {
	  this.autoFreeze = value;
	};

	Immer.prototype.setUseProxies = function setUseProxies (value) {
	  this.useProxies = value;
	  assign(this, value ? modernProxy : legacyProxy);
	};

	Immer.prototype.applyPatches = function applyPatches$1 (base, patches) {
	  // Mutate the base state when a draft is passed.
	  if (isDraft(base)) {
	    return applyPatches(base, patches);
	  } // Otherwise, produce a copy of the base state.


	  return this.produce(base, function (draft) { return applyPatches(draft, patches); });
	};
	/** @internal */


	Immer.prototype.processResult = function processResult (result, scope) {
	  var baseDraft = scope.drafts[0];
	  var isReplaced = result !== undefined && result !== baseDraft;
	  this.willFinalize(scope, result, isReplaced);

	  if (isReplaced) {
	    if (baseDraft[DRAFT_STATE].modified) {
	      scope.revoke();
	      throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft."); // prettier-ignore
	    }

	    if (isDraftable(result)) {
	      // Finalize the result in case it contains (or is) a subset of the draft.
	      result = this.finalize(result, null, scope);
	    }

	    if (scope.patches) {
	      scope.patches.push({
	        op: "replace",
	        path: [],
	        value: result
	      });
	      scope.inversePatches.push({
	        op: "replace",
	        path: [],
	        value: baseDraft[DRAFT_STATE].base
	      });
	    }
	  } else {
	    // Finalize the base draft.
	    result = this.finalize(baseDraft, [], scope);
	  }

	  scope.revoke();

	  if (scope.patches) {
	    scope.patchListener(scope.patches, scope.inversePatches);
	  }

	  return result !== NOTHING ? result : undefined;
	};
	/**
	 * @internal
	 * Finalize a draft, returning either the unmodified base state or a modified
	 * copy of the base state.
	 */


	Immer.prototype.finalize = function finalize (draft, path, scope) {
	    var this$1 = this;

	  var state = draft[DRAFT_STATE];

	  if (!state) {
	    if (Object.isFrozen(draft)) { return draft; }
	    return this.finalizeTree(draft, null, scope);
	  } // Never finalize drafts owned by another scope.


	  if (state.scope !== scope) {
	    return draft;
	  }

	  if (!state.modified) {
	    return state.base;
	  }

	  if (!state.finalized) {
	    state.finalized = true;
	    this.finalizeTree(state.draft, path, scope);

	    if (this.onDelete) {
	      // The `assigned` object is unreliable with ES5 drafts.
	      if (this.useProxies) {
	        var assigned = state.assigned;

	        for (var prop in assigned) {
	          if (!assigned[prop]) { this.onDelete(state, prop); }
	        }
	      } else {
	        var base = state.base;
	          var copy = state.copy;
	        each(base, function (prop) {
	          if (!has$1(copy, prop)) { this$1.onDelete(state, prop); }
	        });
	      }
	    }

	    if (this.onCopy) {
	      this.onCopy(state);
	    } // At this point, all descendants of `state.copy` have been finalized,
	    // so we can be sure that `scope.canAutoFreeze` is accurate.


	    if (this.autoFreeze && scope.canAutoFreeze) {
	      Object.freeze(state.copy);
	    }

	    if (path && scope.patches) {
	      generatePatches(state, path, scope.patches, scope.inversePatches);
	    }
	  }

	  return state.copy;
	};
	/**
	 * @internal
	 * Finalize all drafts in the given state tree.
	 */


	Immer.prototype.finalizeTree = function finalizeTree (root, rootPath, scope) {
	    var this$1 = this;

	  var state = root[DRAFT_STATE];

	  if (state) {
	    if (!this.useProxies) {
	      // Create the final copy, with added keys and without deleted keys.
	      state.copy = shallowCopy(state.draft, true);
	    }

	    root = state.copy;
	  }

	  var needPatches = !!rootPath && !!scope.patches;

	  var finalizeProperty = function (prop, value, parent) {
	    if (value === parent) {
	      throw Error("Immer forbids circular references");
	    } // In the `finalizeTree` method, only the `root` object may be a draft.


	    var isDraftProp = !!state && parent === root;

	    if (isDraft(value)) {
	      var path = isDraftProp && needPatches && !state.assigned[prop] ? rootPath.concat(prop) : null; // Drafts owned by `scope` are finalized here.

	      value = this$1.finalize(value, path, scope); // Drafts from another scope must prevent auto-freezing.

	      if (isDraft(value)) {
	        scope.canAutoFreeze = false;
	      } // Preserve non-enumerable properties.


	      if (Array.isArray(parent) || isEnumerable(parent, prop)) {
	        parent[prop] = value;
	      } else {
	        Object.defineProperty(parent, prop, {
	          value: value
	        });
	      } // Unchanged drafts are never passed to the `onAssign` hook.


	      if (isDraftProp && value === state.base[prop]) { return; }
	    } // Unchanged draft properties are ignored.
	    else if (isDraftProp && is(value, state.base[prop])) {
	        return;
	      } // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
	      else if (isDraftable(value) && !Object.isFrozen(value)) {
	          each(value, finalizeProperty);
	        }

	    if (isDraftProp && this$1.onAssign) {
	      this$1.onAssign(state, prop, value);
	    }
	  };

	  each(root, finalizeProperty);
	  return root;
	};

	var immer = new Immer();
	/**
	 * Pass true to automatically freeze all copies created by Immer.
	 *
	 * By default, auto-freezing is disabled in production.
	 */

	var setAutoFreeze = immer.setAutoFreeze.bind(immer);
	/**
	 * Pass true to use the ES2015 `Proxy` class when creating drafts, which is
	 * always faster than using ES5 proxies.
	 *
	 * By default, feature detection is used, so calling this is rarely necessary.
	 */

	var setUseProxies = immer.setUseProxies.bind(immer);
	/**
	 * Apply an array of Immer patches to the first argument.
	 *
	 * This function is a producer, which means copy-on-write is in effect.
	 */

	var applyPatches$1 = immer.applyPatches.bind(immer);
	/**
	 * Create an Immer draft from the given base state, which may be a draft itself.
	 * The draft can be modified until you finalize it with the `finishDraft` function.
	 */

	var createDraft = immer.createDraft.bind(immer);
	/**
	 * Finalize an Immer draft from a `createDraft` call, returning the base state
	 * (if no changes were made) or a modified copy. The draft must *not* be
	 * mutated afterwards.
	 *
	 * Pass a function as the 2nd argument to generate Immer patches based on the
	 * changes that were made.
	 */

	var finishDraft = immer.finishDraft.bind(immer);

	function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;

		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	}

	/* global window */

	var root;

	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (typeof module !== 'undefined') {
	  root = module;
	} else {
	  root = Function('return this')();
	}

	var result = symbolObservablePonyfill(root);

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var randomString = function randomString() {
	  return Math.random().toString(36).substring(7).split('').join('.');
	};

	var ActionTypes = {
	  INIT: "@@redux/INIT" + randomString(),
	  REPLACE: "@@redux/REPLACE" + randomString(),
	  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
	    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
	  }
	};

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	function isPlainObject(obj) {
	  if (typeof obj !== 'object' || obj === null) return false;
	  var proto = obj;

	  while (Object.getPrototypeOf(proto) !== null) {
	    proto = Object.getPrototypeOf(proto);
	  }

	  return Object.getPrototypeOf(obj) === proto;
	}

	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [preloadedState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */

	function createStore(reducer, preloadedState, enhancer) {
	  var _ref2;

	  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
	    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
	  }

	  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = preloadedState;
	    preloadedState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, preloadedState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = preloadedState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;
	  /**
	   * This makes a shallow copy of currentListeners so we can use
	   * nextListeners as a temporary list while dispatching.
	   *
	   * This prevents any bugs around consumers calling
	   * subscribe/unsubscribe in the middle of a dispatch.
	   */

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */


	  function getState() {
	    if (isDispatching) {
	      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
	    }

	    return currentState;
	  }
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */


	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected the listener to be a function.');
	    }

	    if (isDispatching) {
	      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
	    }

	    var isSubscribed = true;
	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);
	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      if (isDispatching) {
	        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
	      }

	      isSubscribed = false;
	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */


	  function dispatch(action) {
	    if (!isPlainObject(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;

	    for (var i = 0; i < listeners.length; i++) {
	      var listener = listeners[i];
	      listener();
	    }

	    return action;
	  }
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */


	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
	    // Any reducers that existed in both the new and old rootReducer
	    // will receive the previous state. This effectively populates
	    // the new state tree with any relevant data from the old one.

	    dispatch({
	      type: ActionTypes.REPLACE
	    });
	  }
	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/tc39/proposal-observable
	   */


	  function observable() {
	    var _ref;

	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	      subscribe: function subscribe(observer) {
	        if (typeof observer !== 'object' || observer === null) {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return {
	          unsubscribe: unsubscribe
	        };
	      }
	    }, _ref[result] = function () {
	      return this;
	    }, _ref;
	  } // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.


	  dispatch({
	    type: ActionTypes.INIT
	  });
	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[result] = observable, _ref2;
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function ownKeys$1(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
	  }

	  if (enumerableOnly) keys = keys.filter(function (sym) {
	    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	  });
	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys$1(source, true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys$1(source).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */
	function compose() {
	  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  }

	  if (funcs.length === 1) {
	    return funcs[0];
	  }

	  return funcs.reduce(function (a, b) {
	    return function () {
	      return a(b.apply(void 0, arguments));
	    };
	  });
	}

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */

	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (createStore) {
	    return function () {
	      var store = createStore.apply(void 0, arguments);

	      var _dispatch = function dispatch() {
	        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
	      };

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch() {
	          return _dispatch.apply(void 0, arguments);
	        }
	      };
	      var chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = compose.apply(void 0, chain)(store.dispatch);
	      return _objectSpread2({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

	function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch,
	        getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }

	        return next(action);
	      };
	    };
	  };
	}

	var thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;

	function Similar() {
		this.list = [];
		this.lastItem = undefined;
		this.size = 0;

		return this;
	}

	Similar.prototype.get = function(key) {
		var index;

		if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
			return this.lastItem.val;
		}

		index = this.indexOf(key);
		if (index >= 0) {
			this.lastItem = this.list[index];
			return this.list[index].val;
		}

		return undefined;
	};

	Similar.prototype.set = function(key, val) {
		var index;

		if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
			this.lastItem.val = val;
			return this;
		}

		index = this.indexOf(key);
		if (index >= 0) {
			this.lastItem = this.list[index];
			this.list[index].val = val;
			return this;
		}

		this.lastItem = { key: key, val: val };
		this.list.push(this.lastItem);
		this.size++;

		return this;
	};

	Similar.prototype.delete = function(key) {
		var index;

		if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
			this.lastItem = undefined;
		}

		index = this.indexOf(key);
		if (index >= 0) {
			this.size--;
			return this.list.splice(index, 1)[0];
		}

		return undefined;
	};


	// important that has() doesn't use get() in case an existing key has a falsy value, in which case has() would return false
	Similar.prototype.has = function(key) {
		var index;

		if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
			return true;
		}

		index = this.indexOf(key);
		if (index >= 0) {
			this.lastItem = this.list[index];
			return true;
		}

		return false;
	};

	Similar.prototype.forEach = function(callback, thisArg) {
		var i;
		for (i = 0; i < this.size; i++) {
			callback.call(thisArg || this, this.list[i].val, this.list[i].key, this);
		}
	};

	Similar.prototype.indexOf = function(key) {
		var i;
		for (i = 0; i < this.size; i++) {
			if (this.isEqual(this.list[i].key, key)) {
				return i;
			}
		}
		return -1;
	};

	// check if the numbers are equal, or whether they are both precisely NaN (isNaN returns true for all non-numbers)
	Similar.prototype.isEqual = function(val1, val2) {
		return val1 === val2 || (val1 !== val1 && val2 !== val2);
	};

	var similar = Similar;

	var mapOrSimilar = function(forceSimilar) {
		if (typeof Map !== 'function' || forceSimilar) {
			var Similar = similar;
			return new Similar();
		}
		else {
			return new Map();
		}
	};

	var memoizerific = function (limit) {
		var cache = new mapOrSimilar(process.env.FORCE_SIMILAR_INSTEAD_OF_MAP === 'true'),
			lru = [];

		return function (fn) {
			var memoizerific = function () {
				var currentCache = cache,
					newMap,
					fnResult,
					argsLengthMinusOne = arguments.length - 1,
					lruPath = Array(argsLengthMinusOne + 1),
					isMemoized = true,
					i;

				if ((memoizerific.numArgs || memoizerific.numArgs === 0) && memoizerific.numArgs !== argsLengthMinusOne + 1) {
					throw new Error('Memoizerific functions should always be called with the same number of arguments');
				}

				// loop through each argument to traverse the map tree
				for (i = 0; i < argsLengthMinusOne; i++) {
					lruPath[i] = {
						cacheItem: currentCache,
						arg: arguments[i]
					};

					// climb through the hierarchical map tree until the second-last argument has been found, or an argument is missing.
					// if all arguments up to the second-last have been found, this will potentially be a cache hit (determined later)
					if (currentCache.has(arguments[i])) {
						currentCache = currentCache.get(arguments[i]);
						continue;
					}

					isMemoized = false;

					// make maps until last value
					newMap = new mapOrSimilar(process.env.FORCE_SIMILAR_INSTEAD_OF_MAP === 'true');
					currentCache.set(arguments[i], newMap);
					currentCache = newMap;
				}

				// we are at the last arg, check if it is really memoized
				if (isMemoized) {
					if (currentCache.has(arguments[argsLengthMinusOne])) {
						fnResult = currentCache.get(arguments[argsLengthMinusOne]);
					}
					else {
						isMemoized = false;
					}
				}

				// if the result wasn't memoized, compute it and cache it
				if (!isMemoized) {
					fnResult = fn.apply(null, arguments);
					currentCache.set(arguments[argsLengthMinusOne], fnResult);
				}

				// if there is a cache limit, purge any extra results
				if (limit > 0) {
					lruPath[argsLengthMinusOne] = {
						cacheItem: currentCache,
						arg: arguments[argsLengthMinusOne]
					};

					if (isMemoized) {
						moveToMostRecentLru(lru, lruPath);
					}
					else {
						lru.push(lruPath);
					}

					if (lru.length > limit) {
						removeCachedResult(lru.shift());
					}
				}

				memoizerific.wasMemoized = isMemoized;
				memoizerific.numArgs = argsLengthMinusOne + 1;

				return fnResult;
			};

			memoizerific.limit = limit;
			memoizerific.wasMemoized = false;
			memoizerific.cache = cache;
			memoizerific.lru = lru;

			return memoizerific;
		};
	};

	// move current args to most recent position
	function moveToMostRecentLru(lru, lruPath) {
		var lruLen = lru.length,
			lruPathLen = lruPath.length,
			isMatch,
			i, ii;

		for (i = 0; i < lruLen; i++) {
			isMatch = true;
			for (ii = 0; ii < lruPathLen; ii++) {
				if (!isEqual(lru[i][ii].arg, lruPath[ii].arg)) {
					isMatch = false;
					break;
				}
			}
			if (isMatch) {
				break;
			}
		}

		lru.push(lru.splice(i, 1)[0]);
	}

	// remove least recently used cache item and all dead branches
	function removeCachedResult(removedLru) {
		var removedLruLen = removedLru.length,
			currentLru = removedLru[removedLruLen - 1],
			tmp,
			i;

		currentLru.cacheItem.delete(currentLru.arg);

		// walk down the tree removing dead branches (size 0) along the way
		for (i = removedLruLen - 2; i >= 0; i--) {
			currentLru = removedLru[i];
			tmp = currentLru.cacheItem.get(currentLru.arg);

			if (!tmp || !tmp.size) {
				currentLru.cacheItem.delete(currentLru.arg);
			} else {
				break;
			}
		}
	}

	// check if the numbers are equal, or whether they are both precisely NaN (isNaN returns true for all non-numbers)
	function isEqual(val1, val2) {
		return val1 === val2 || (val1 !== val1 && val2 !== val2);
	}

	var StoreContext = React.createContext();

	// To get around it, we can conditionally useEffect on the server (no-op) and
	// useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
	// subscription callback always has the selector from the latest render commit
	// available, otherwise a store update may happen between render and the effect,
	// which may cause missed updates; we also must ensure the store subscription
	// is created synchronously, otherwise a store update may occur before the
	// subscription is created and an inconsistent state may be observed

	var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
	function createStoreStateHook(Context) {
	  return function useStoreState(mapState) {
	    var store = React.useContext(Context);
	    var mapStateRef = React.useRef(mapState);
	    var stateRef = React.useRef();
	    var mountedRef = React.useRef(true);
	    var subscriptionMapStateError = React.useRef();

	    var _useReducer = React.useReducer(function (s) {
	      return s + 1;
	    }, 0),
	        forceRender = _useReducer[1];

	    if (subscriptionMapStateError.current || mapStateRef.current !== mapState || stateRef.current === undefined) {
	      try {
	        stateRef.current = mapState(store.getState());
	      } catch (err) {
	        var errorMessage = "An error occurred trying to map state in a useStoreState hook: " + err.message + ".";

	        if (subscriptionMapStateError.current) {
	          errorMessage += "\nThis error may be related to the following error:\n" + subscriptionMapStateError.current.stack + "\n\nOriginal stack trace:";
	        }

	        throw new Error(errorMessage);
	      }
	    }

	    useIsomorphicLayoutEffect(function () {
	      mapStateRef.current = mapState;
	      subscriptionMapStateError.current = undefined;
	    });
	    useIsomorphicLayoutEffect(function () {
	      var checkMapState = function checkMapState() {
	        try {
	          var newState = mapStateRef.current(store.getState());

	          if (newState === stateRef.current) {
	            return;
	          }

	          stateRef.current = newState;
	        } catch (err) {
	          // see https://github.com/reduxjs/react-redux/issues/1179
	          // There is a possibility mapState will fail due to stale state or
	          // props, therefore we will just track the error and force our
	          // component to update. It should then receive the updated state
	          subscriptionMapStateError.current = err;
	        }

	        if (mountedRef.current) {
	          forceRender({});
	        }
	      };

	      var unsubscribe = store.subscribe(checkMapState);
	      checkMapState();
	      return function () {
	        mountedRef.current = false;
	        unsubscribe();
	      };
	    }, []);
	    return stateRef.current;
	  };
	}
	var useStoreState = createStoreStateHook(StoreContext);
	function createStoreActionsHook(Context) {
	  return function useStoreActions(mapActions) {
	    var store = React.useContext(Context);
	    return mapActions(store.getActions());
	  };
	}
	var useStoreActions = createStoreActionsHook(StoreContext);

	function _extends() {
	  _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	var actionSymbol = '🙈action🙈';
	var actionOnSymbol = '🙈actionOn🙈';
	var computedSymbol = '🙈computedSymbol🙈';
	var reducerSymbol = '🙈reducer🙈';
	var thunkOnSymbol = '🙈thunkOn🙈';
	var thunkSymbol = '🙈thunk🙈';
	var action = function action(fn) {
	  fn[actionSymbol] = {};
	  return fn;
	};

	var isStateObject = function isStateObject(x) {
	  return x !== null && typeof x === 'object' && !Array.isArray(x) && x.constructor === Object;
	};
	var get$2 = function get(path, target) {
	  return path.reduce(function (acc, cur) {
	    return isStateObject(acc) ? acc[cur] : undefined;
	  }, target);
	};
	var set$2 = function set(path, target, value) {
	  path.reduce(function (acc, cur, idx) {
	    if (idx + 1 === path.length) {
	      acc[cur] = value;
	    } else {
	      acc[cur] = acc[cur] || {};
	    }

	    return acc[cur];
	  }, target);
	};

	var newify = function newify(currentPath, currentState, finalValue) {
	  if (currentPath.length === 0) {
	    return finalValue;
	  }

	  var newState = _extends({}, currentState);

	  var key = currentPath[0];

	  if (currentPath.length === 1) {
	    newState[key] = finalValue;
	  } else {
	    newState[key] = newify(currentPath.slice(1), newState[key], finalValue);
	  }

	  return newState;
	};

	function createStoreInternals(_ref) {
	  var disableImmer = _ref.disableImmer,
	      initialState = _ref.initialState,
	      injections = _ref.injections,
	      model = _ref.model,
	      reducerEnhancer = _ref.reducerEnhancer,
	      references = _ref.references;

	  function simpleProduce(path, state, fn) {
	    if (disableImmer) {
	      var _current = get$2(path, state);

	      var next = fn(_current);

	      if (_current !== next) {
	        return newify(path, state, next);
	      }

	      return state;
	    }

	    var draft = createDraft(state);

	    var current = get$2(path, draft);

	    fn(current);
	    return finishDraft(draft);
	  }

	  var defaultState = initialState;
	  var actionCreatorDict = {};
	  var actionCreators = {};
	  var actionReducersDict = {};
	  var actionThunks = {};
	  var computedProperties = [];
	  var customReducers = [];
	  var listenerActionCreators = {};
	  var listenerActionMap = {};
	  var listenerDefinitions = [];
	  var computedState = {
	    isInReducer: false,
	    currentState: defaultState
	  };

	  var recursiveExtractDefsFromModel = function recursiveExtractDefsFromModel(current, parentPath) {
	    return Object.keys(current).forEach(function (key) {
	      var value = current[key];
	      var path = [].concat(parentPath, [key]);
	      var meta = {
	        parent: parentPath,
	        path: path
	      };

	      var handleValueAsState = function handleValueAsState() {
	        var initialParentRef = get$2(parentPath, initialState);

	        if (initialParentRef && key in initialParentRef) {
	          set$2(path, defaultState, initialParentRef[key]);
	        } else {
	          set$2(path, defaultState, value);
	        }
	      };

	      if (typeof value === 'function') {
	        if (value[actionSymbol] || value[actionOnSymbol]) {
	          var prefix = value[actionSymbol] ? '@action' : '@actionOn';
	          var type = prefix + "." + path.join('.');
	          var actionMeta = value[actionSymbol] || value[actionOnSymbol];
	          actionMeta.actionName = key;
	          actionMeta.type = type;
	          actionMeta.parent = meta.parent;
	          actionMeta.path = meta.path; // Action Reducer

	          actionReducersDict[type] = value; // Action Creator

	          var actionCreator = function actionCreator(payload) {
	            var actionDefinition = {
	              type: type,
	              payload: payload
	            };

	            if (value[actionOnSymbol] && actionMeta.resolvedTargets) {
	              payload.resolvedTargets = [].concat(actionMeta.resolvedTargets);
	            }

	            var result = references.dispatch(actionDefinition);
	            return result;
	          };

	          actionCreator.type = type;
	          actionCreatorDict[type] = actionCreator;

	          if (key !== 'easyPeasyReplaceState') {
	            if (value[actionOnSymbol]) {
	              listenerDefinitions.push(value);
	              set$2(path, listenerActionCreators, actionCreator);
	            } else {
	              set$2(path, actionCreators, actionCreator);
	            }
	          }
	        } else if (value[thunkSymbol] || value[thunkOnSymbol]) {
	          var _prefix = value[thunkSymbol] ? '@thunk' : '@thunkOn';

	          var _type = _prefix + "." + path.join('.');

	          var thunkMeta = value[thunkSymbol] || value[thunkOnSymbol];
	          thunkMeta.actionName = key;
	          thunkMeta.type = _type;
	          thunkMeta.parent = meta.parent;
	          thunkMeta.path = meta.path; // Thunk Action

	          var thunkHandler = function thunkHandler(payload) {
	            var helpers = {
	              dispatch: references.dispatch,
	              getState: function getState() {
	                return get$2(parentPath, references.getState());
	              },
	              getStoreActions: function getStoreActions() {
	                return actionCreators;
	              },
	              getStoreState: references.getState,
	              injections: injections,
	              meta: meta
	            };

	            if (value[thunkOnSymbol] && thunkMeta.resolvedTargets) {
	              payload.resolvedTargets = [].concat(thunkMeta.resolvedTargets);
	            }

	            return value(get$2(parentPath, actionCreators), payload, helpers);
	          };

	          set$2(path, actionThunks, thunkHandler); // Thunk Action Creator

	          var startType = _type + "(start)";
	          var successType = _type + "(success)";
	          var failType = _type + "(fail)";

	          var _actionCreator = function _actionCreator(payload) {
	            var dispatchError = function dispatchError(err) {
	              references.dispatch({
	                type: failType,
	                payload: payload,
	                error: err
	              });
	              references.dispatch({
	                type: _type,
	                payload: payload,
	                error: err
	              });
	            };

	            var dispatchSuccess = function dispatchSuccess(result) {
	              references.dispatch({
	                type: successType,
	                payload: payload,
	                result: result
	              });
	              references.dispatch({
	                type: _type,
	                payload: payload,
	                result: result
	              });
	            };

	            references.dispatch({
	              type: startType,
	              payload: payload
	            });

	            try {
	              var result = references.dispatch(function () {
	                return thunkHandler(payload);
	              });

	              if (typeof result === 'object' && typeof result.then === 'function') {
	                return result.then(function (resolved) {
	                  dispatchSuccess(resolved);
	                  return resolved;
	                }).catch(function (err) {
	                  dispatchError(err);
	                  throw err;
	                });
	              }

	              dispatchSuccess(result);
	              return result;
	            } catch (err) {
	              dispatchError(err);
	              throw err;
	            }
	          };

	          _actionCreator.type = _type;
	          _actionCreator.startType = startType;
	          _actionCreator.successType = successType;
	          _actionCreator.failType = failType;
	          actionCreatorDict[_type] = _actionCreator;

	          if (value[thunkOnSymbol]) {
	            listenerDefinitions.push(value);
	            set$2(path, listenerActionCreators, _actionCreator);
	          } else {
	            set$2(path, actionCreators, _actionCreator);
	          }
	        } else if (value[computedSymbol]) {
	          var parent = get$2(parentPath, defaultState);

	          var computedMeta = value[computedSymbol];
	          var memoisedResultFn = memoizerific(1)(value);

	          var createComputedProperty = function createComputedProperty(o) {
	            Object.defineProperty(o, key, {
	              configurable: true,
	              enumerable: true,
	              get: function get$1() {
	                var storeState;

	                if (computedState.isInReducer) {
	                  storeState = computedState.currentState;
	                } else if (references.getState == null) {
	                  return undefined;
	                } else {
	                  try {
	                    storeState = references.getState();
	                  } catch (err) {

	                    return undefined;
	                  }
	                }

	                var state = get$2(parentPath, storeState);

	                var inputs = computedMeta.stateResolvers.map(function (resolver) {
	                  return resolver(state, storeState);
	                });
	                return memoisedResultFn.apply(void 0, inputs);
	              }
	            });
	          };

	          createComputedProperty(parent);
	          computedProperties.push({
	            key: key,
	            parentPath: parentPath,
	            createComputedProperty: createComputedProperty
	          });
	        } else if (value[reducerSymbol]) {
	          customReducers.push({
	            key: key,
	            parentPath: parentPath,
	            reducer: value
	          });
	        } else {
	          handleValueAsState();
	        }
	      } else if (isStateObject(value)) {
	        var existing = get$2(path, defaultState);

	        if (existing == null) {
	          set$2(path, defaultState, {});
	        }

	        recursiveExtractDefsFromModel(value, path);
	      } else {
	        handleValueAsState();
	      }
	    });
	  };

	  recursiveExtractDefsFromModel(model, []);
	  listenerDefinitions.forEach(function (listenerActionOrThunk) {
	    var listenerMeta = listenerActionOrThunk[actionOnSymbol] || listenerActionOrThunk[thunkOnSymbol];
	    var targets = listenerMeta.targetResolver(get$2(listenerMeta.parent, actionCreators), actionCreators);
	    var targetTypes = (Array.isArray(targets) ? targets : [targets]).reduce(function (acc, target) {
	      if (typeof target === 'function' && target.type && actionCreatorDict[target.type]) {
	        acc.push(target.type);
	      } else if (typeof target === 'string') {
	        acc.push(target);
	      }

	      return acc;
	    }, []);
	    listenerMeta.resolvedTargets = targetTypes;
	    targetTypes.forEach(function (targetType) {
	      var listenerReg = listenerActionMap[targetType] || [];
	      listenerReg.push(actionCreatorDict[listenerMeta.type]);
	      listenerActionMap[targetType] = listenerReg;
	    });
	  });

	  var createReducer = function createReducer() {
	    var runActionReducerAtPath = function runActionReducerAtPath(state, action, actionReducer, path) {
	      return simpleProduce(path, state, function (draft) {
	        return actionReducer(draft, action.payload);
	      });
	    };

	    var reducerForActions = function reducerForActions(state, action) {
	      var actionReducer = actionReducersDict[action.type];

	      if (actionReducer) {
	        var actionMeta = actionReducer[actionSymbol] || actionReducer[actionOnSymbol];
	        return runActionReducerAtPath(state, action, actionReducer, actionMeta.parent);
	      }

	      return state;
	    };

	    var reducerForCustomReducers = function reducerForCustomReducers(state, action) {
	      return customReducers.reduce(function (acc, _ref2) {
	        var parentPath = _ref2.parentPath,
	            key = _ref2.key,
	            red = _ref2.reducer;
	        return simpleProduce(parentPath, acc, function (draft) {
	          draft[key] = red(draft[key], action);
	          return draft;
	        });
	      }, state);
	    };

	    var rootReducer = function rootReducer(state, action) {
	      var stateAfterActions = reducerForActions(state, action);
	      var next = customReducers.length > 0 ? reducerForCustomReducers(stateAfterActions, action) : stateAfterActions;

	      if (state !== next) {
	        computedProperties.forEach(function (_ref3) {
	          var parentPath = _ref3.parentPath,
	              createComputedProperty = _ref3.createComputedProperty;
	          createComputedProperty(get$2(parentPath, next));
	        });
	      }

	      return next;
	    };

	    return rootReducer;
	  };

	  return {
	    actionCreatorDict: actionCreatorDict,
	    actionCreators: actionCreators,
	    computedProperties: computedProperties,
	    computedState: computedState,
	    defaultState: defaultState,
	    listenerActionCreators: listenerActionCreators,
	    listenerActionMap: listenerActionMap,
	    reducer: reducerEnhancer(createReducer())
	  };
	}

	function createStore$1(model, options) {
	  if (options === void 0) {
	    options = {};
	  }

	  var _options = options,
	      compose$1 = _options.compose,
	      _options$devTools = _options.devTools,
	      devTools = _options$devTools === void 0 ? true : _options$devTools,
	      _options$disableImmer = _options.disableImmer,
	      disableImmer = _options$disableImmer === void 0 ? false : _options$disableImmer,
	      _options$enhancers = _options.enhancers,
	      enhancers = _options$enhancers === void 0 ? [] : _options$enhancers,
	      _options$initialState = _options.initialState,
	      initialState = _options$initialState === void 0 ? {} : _options$initialState,
	      injections = _options.injections,
	      _options$middleware = _options.middleware,
	      middleware = _options$middleware === void 0 ? [] : _options$middleware,
	      _options$mockActions = _options.mockActions,
	      mockActions = _options$mockActions === void 0 ? false : _options$mockActions,
	      _options$name = _options.name,
	      storeName = _options$name === void 0 ? "EasyPeasyStore" : _options$name,
	      _options$reducerEnhan = _options.reducerEnhancer,
	      reducerEnhancer = _options$reducerEnhan === void 0 ? function (rootReducer) {
	    return rootReducer;
	  } : _options$reducerEnhan;

	  var bindReplaceState = function bindReplaceState(modelDef) {
	    return _extends({}, modelDef, {
	      easyPeasyReplaceState: action(function (state, payload) {
	        return payload;
	      })
	    });
	  };

	  var modelDefinition = bindReplaceState(model);
	  var mockedActions = [];
	  var references = {};

	  var bindStoreInternals = function bindStoreInternals(state) {
	    if (state === void 0) {
	      state = {};
	    }

	    references.internals = createStoreInternals({
	      disableImmer: disableImmer,
	      initialState: state,
	      injections: injections,
	      model: modelDefinition,
	      reducerEnhancer: reducerEnhancer,
	      references: references
	    });
	  };

	  bindStoreInternals(initialState);

	  var listenerActionsMiddleware = function listenerActionsMiddleware() {
	    return function (next) {
	      return function (action) {
	        var result = next(action);

	        if (action && references.internals.listenerActionMap[action.type] && references.internals.listenerActionMap[action.type].length > 0) {
	          var sourceAction = references.internals.actionCreatorDict[action.type];
	          references.internals.listenerActionMap[action.type].forEach(function (actionCreator) {
	            actionCreator({
	              type: sourceAction ? sourceAction.type : action.type,
	              payload: action.payload,
	              error: action.error,
	              result: action.result
	            });
	          });
	        }

	        return result;
	      };
	    };
	  };

	  var mockActionsMiddleware = function mockActionsMiddleware() {
	    return function () {
	      return function (action) {
	        if (action != null) {
	          mockedActions.push(action);
	        }

	        return undefined;
	      };
	    };
	  };

	  var computedPropertiesMiddleware = function computedPropertiesMiddleware(store) {
	    return function (next) {
	      return function (action) {
	        references.internals.computedState.currentState = store.getState();
	        references.internals.computedState.isInReducer = true;
	        return next(action);
	      };
	    };
	  };

	  var easyPeasyMiddleware = [computedPropertiesMiddleware, thunk].concat(middleware, [listenerActionsMiddleware]);

	  if (mockActions) {
	    easyPeasyMiddleware.push(mockActionsMiddleware);
	  }

	  var composeEnhancers = compose$1 || (devTools && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
	    name: storeName
	  }) : compose);
	  var store = createStore(references.internals.reducer, references.internals.defaultState, composeEnhancers.apply(void 0, [applyMiddleware.apply(void 0, easyPeasyMiddleware)].concat(enhancers)));
	  store.subscribe(function () {
	    references.internals.computedState.isInReducer = false;
	  });
	  references.dispatch = store.dispatch;
	  references.getState = store.getState;

	  var bindActionCreators = function bindActionCreators() {
	    Object.keys(store.dispatch).forEach(function (actionsKey) {
	      delete store.dispatch[actionsKey];
	    });
	    Object.keys(references.internals.actionCreators).forEach(function (key) {
	      store.dispatch[key] = references.internals.actionCreators[key];
	    });
	  };

	  bindActionCreators();

	  var rebindStore = function rebindStore(removeKey) {
	    var currentState = store.getState();

	    if (removeKey) {
	      delete currentState[removeKey];
	    }

	    bindStoreInternals(store.getState());
	    store.replaceReducer(references.internals.reducer);
	    references.internals.actionCreatorDict['@action.easyPeasyReplaceState'](references.internals.defaultState);
	    bindActionCreators();
	  };

	  return Object.assign(store, {
	    addModel: function addModel(key, modelForKey) {
	      if (modelDefinition[key] && "production" !== 'production') {
	        // eslint-disable-next-line no-console
	        console.warn("easy-peasy: The store model already contains a model definition for \"" + key + "\"");
	        store.removeModel(key);
	      }

	      modelDefinition[key] = modelForKey;
	      rebindStore();
	    },
	    clearMockedActions: function clearMockedActions() {
	      mockedActions = [];
	    },
	    getActions: function getActions() {
	      return references.internals.actionCreators;
	    },
	    getListeners: function getListeners() {
	      return references.internals.listenerActionCreators;
	    },
	    getMockedActions: function getMockedActions() {
	      return [].concat(mockedActions);
	    },
	    reconfigure: function reconfigure(newModel) {
	      modelDefinition = bindReplaceState(newModel);
	      rebindStore();
	    },
	    removeModel: function removeModel(key) {
	      if (!modelDefinition[key]) {

	        return;
	      }

	      delete modelDefinition[key];
	      rebindStore(key);
	    }
	  });
	}

	var StoreProvider = function StoreProvider(_ref) {
	  var children = _ref.children,
	      store = _ref.store;
	  return React__default.createElement(StoreContext.Provider, {
	    value: store
	  }, children);
	};

	/**
	 * The auto freeze feature of immer doesn't seem to work in our testing. We have
	 * explicitly disabled it to avoid perf issues.
	 */

	setAutoFreeze(false);

	function _defineProperty$1(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$1() {
	  _extends$1 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$1.apply(this, arguments);
	}

	function ownKeys$2(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2$1(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys$2(source, true).forEach(function (key) {
	        _defineProperty$1(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys$2(source).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;

	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }

	  return target;
	}

	function _objectWithoutProperties(source, excluded) {
	  if (source == null) return {};

	  var target = _objectWithoutPropertiesLoose(source, excluded);

	  var key, i;

	  if (Object.getOwnPropertySymbols) {
	    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

	    for (i = 0; i < sourceSymbolKeys.length; i++) {
	      key = sourceSymbolKeys[i];
	      if (excluded.indexOf(key) >= 0) continue;
	      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
	      target[key] = source[key];
	    }
	  }

	  return target;
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  }
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	function _iterableToArrayLimit(arr, i) {
	  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
	    return;
	  }

	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}

	var noop = {value: function() {}};

	function dispatch() {
	  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
	    if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
	    _[t] = [];
	  }
	  return new Dispatch(_);
	}

	function Dispatch(_) {
	  this._ = _;
	}

	function parseTypenames(typenames, types) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
	    return {type: t, name: name};
	  });
	}

	Dispatch.prototype = dispatch.prototype = {
	  constructor: Dispatch,
	  on: function(typename, callback) {
	    var _ = this._,
	        T = parseTypenames(typename + "", _),
	        t,
	        i = -1,
	        n = T.length;

	    // If no callback was specified, return the callback of the given type and name.
	    if (arguments.length < 2) {
	      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$3(_[t], typename.name))) return t;
	      return;
	    }

	    // If a type was specified, set the callback for the given type and name.
	    // Otherwise, if a null callback was specified, remove callbacks of the given name.
	    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
	    while (++i < n) {
	      if (t = (typename = T[i]).type) _[t] = set$3(_[t], typename.name, callback);
	      else if (callback == null) for (t in _) _[t] = set$3(_[t], typename.name, null);
	    }

	    return this;
	  },
	  copy: function() {
	    var copy = {}, _ = this._;
	    for (var t in _) copy[t] = _[t].slice();
	    return new Dispatch(copy);
	  },
	  call: function(type, that) {
	    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  },
	  apply: function(type, that, args) {
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  }
	};

	function get$3(type, name) {
	  for (var i = 0, n = type.length, c; i < n; ++i) {
	    if ((c = type[i]).name === name) {
	      return c.value;
	    }
	  }
	}

	function set$3(type, name, callback) {
	  for (var i = 0, n = type.length; i < n; ++i) {
	    if (type[i].name === name) {
	      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
	      break;
	    }
	  }
	  if (callback != null) type.push({name: name, value: callback});
	  return type;
	}

	var xhtml = "http://www.w3.org/1999/xhtml";

	var namespaces = {
	  svg: "http://www.w3.org/2000/svg",
	  xhtml: xhtml,
	  xlink: "http://www.w3.org/1999/xlink",
	  xml: "http://www.w3.org/XML/1998/namespace",
	  xmlns: "http://www.w3.org/2000/xmlns/"
	};

	function namespace(name) {
	  var prefix = name += "", i = prefix.indexOf(":");
	  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
	}

	function creatorInherit(name) {
	  return function() {
	    var document = this.ownerDocument,
	        uri = this.namespaceURI;
	    return uri === xhtml && document.documentElement.namespaceURI === xhtml
	        ? document.createElement(name)
	        : document.createElementNS(uri, name);
	  };
	}

	function creatorFixed(fullname) {
	  return function() {
	    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	  };
	}

	function creator(name) {
	  var fullname = namespace(name);
	  return (fullname.local
	      ? creatorFixed
	      : creatorInherit)(fullname);
	}

	function none() {}

	function selector(selector) {
	  return selector == null ? none : function() {
	    return this.querySelector(selector);
	  };
	}

	function selection_select(select) {
	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function empty() {
	  return [];
	}

	function selectorAll(selector) {
	  return selector == null ? empty : function() {
	    return this.querySelectorAll(selector);
	  };
	}

	function selection_selectAll(select) {
	  if (typeof select !== "function") select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        subgroups.push(select.call(node, node.__data__, i, group));
	        parents.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, parents);
	}

	function matcher(selector) {
	  return function() {
	    return this.matches(selector);
	  };
	}

	function selection_filter(match) {
	  if (typeof match !== "function") match = matcher(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function sparse(update) {
	  return new Array(update.length);
	}

	function selection_enter() {
	  return new Selection(this._enter || this._groups.map(sparse), this._parents);
	}

	function EnterNode(parent, datum) {
	  this.ownerDocument = parent.ownerDocument;
	  this.namespaceURI = parent.namespaceURI;
	  this._next = null;
	  this._parent = parent;
	  this.__data__ = datum;
	}

	EnterNode.prototype = {
	  constructor: EnterNode,
	  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
	  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
	  querySelector: function(selector) { return this._parent.querySelector(selector); },
	  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
	};

	function constant(x) {
	  return function() {
	    return x;
	  };
	}

	var keyPrefix = "$"; // Protect against keys like “__proto__”.

	function bindIndex(parent, group, enter, update, exit, data) {
	  var i = 0,
	      node,
	      groupLength = group.length,
	      dataLength = data.length;

	  // Put any non-null nodes that fit into update.
	  // Put any null nodes into enter.
	  // Put any remaining data into enter.
	  for (; i < dataLength; ++i) {
	    if (node = group[i]) {
	      node.__data__ = data[i];
	      update[i] = node;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Put any non-null nodes that don’t fit into exit.
	  for (; i < groupLength; ++i) {
	    if (node = group[i]) {
	      exit[i] = node;
	    }
	  }
	}

	function bindKey(parent, group, enter, update, exit, data, key) {
	  var i,
	      node,
	      nodeByKeyValue = {},
	      groupLength = group.length,
	      dataLength = data.length,
	      keyValues = new Array(groupLength),
	      keyValue;

	  // Compute the key for each node.
	  // If multiple nodes have the same key, the duplicates are added to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if (node = group[i]) {
	      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
	      if (keyValue in nodeByKeyValue) {
	        exit[i] = node;
	      } else {
	        nodeByKeyValue[keyValue] = node;
	      }
	    }
	  }

	  // Compute the key for each datum.
	  // If there a node associated with this key, join and add it to update.
	  // If there is not (or the key is a duplicate), add it to enter.
	  for (i = 0; i < dataLength; ++i) {
	    keyValue = keyPrefix + key.call(parent, data[i], i, data);
	    if (node = nodeByKeyValue[keyValue]) {
	      update[i] = node;
	      node.__data__ = data[i];
	      nodeByKeyValue[keyValue] = null;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Add any remaining nodes that were not bound to data to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
	      exit[i] = node;
	    }
	  }
	}

	function selection_data(value, key) {
	  if (!value) {
	    data = new Array(this.size()), j = -1;
	    this.each(function(d) { data[++j] = d; });
	    return data;
	  }

	  var bind = key ? bindKey : bindIndex,
	      parents = this._parents,
	      groups = this._groups;

	  if (typeof value !== "function") value = constant(value);

	  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	    var parent = parents[j],
	        group = groups[j],
	        groupLength = group.length,
	        data = value.call(parent, parent && parent.__data__, j, parents),
	        dataLength = data.length,
	        enterGroup = enter[j] = new Array(dataLength),
	        updateGroup = update[j] = new Array(dataLength),
	        exitGroup = exit[j] = new Array(groupLength);

	    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

	    // Now connect the enter nodes to their following update node, such that
	    // appendChild can insert the materialized enter node before this node,
	    // rather than at the end of the parent node.
	    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	      if (previous = enterGroup[i0]) {
	        if (i0 >= i1) i1 = i0 + 1;
	        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
	        previous._next = next || null;
	      }
	    }
	  }

	  update = new Selection(update, parents);
	  update._enter = enter;
	  update._exit = exit;
	  return update;
	}

	function selection_exit() {
	  return new Selection(this._exit || this._groups.map(sparse), this._parents);
	}

	function selection_join(onenter, onupdate, onexit) {
	  var enter = this.enter(), update = this, exit = this.exit();
	  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
	  if (onupdate != null) update = onupdate(update);
	  if (onexit == null) exit.remove(); else onexit(exit);
	  return enter && update ? enter.merge(update).order() : update;
	}

	function selection_merge(selection) {

	  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Selection(merges, this._parents);
	}

	function selection_order() {

	  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	      if (node = group[i]) {
	        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
	        next = node;
	      }
	    }
	  }

	  return this;
	}

	function selection_sort(compare) {
	  if (!compare) compare = ascending;

	  function compareNode(a, b) {
	    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	  }

	  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        sortgroup[i] = node;
	      }
	    }
	    sortgroup.sort(compareNode);
	  }

	  return new Selection(sortgroups, this._parents).order();
	}

	function ascending(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function selection_call() {
	  var callback = arguments[0];
	  arguments[0] = this;
	  callback.apply(null, arguments);
	  return this;
	}

	function selection_nodes() {
	  var nodes = new Array(this.size()), i = -1;
	  this.each(function() { nodes[++i] = this; });
	  return nodes;
	}

	function selection_node() {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	      var node = group[i];
	      if (node) return node;
	    }
	  }

	  return null;
	}

	function selection_size() {
	  var size = 0;
	  this.each(function() { ++size; });
	  return size;
	}

	function selection_empty() {
	  return !this.node();
	}

	function selection_each(callback) {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) callback.call(node, node.__data__, i, group);
	    }
	  }

	  return this;
	}

	function attrRemove(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant(name, value) {
	  return function() {
	    this.setAttribute(name, value);
	  };
	}

	function attrConstantNS(fullname, value) {
	  return function() {
	    this.setAttributeNS(fullname.space, fullname.local, value);
	  };
	}

	function attrFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttribute(name);
	    else this.setAttribute(name, v);
	  };
	}

	function attrFunctionNS(fullname, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
	    else this.setAttributeNS(fullname.space, fullname.local, v);
	  };
	}

	function selection_attr(name, value) {
	  var fullname = namespace(name);

	  if (arguments.length < 2) {
	    var node = this.node();
	    return fullname.local
	        ? node.getAttributeNS(fullname.space, fullname.local)
	        : node.getAttribute(fullname);
	  }

	  return this.each((value == null
	      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
	      ? (fullname.local ? attrFunctionNS : attrFunction)
	      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
	}

	function defaultView(node) {
	  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
	      || (node.document && node) // node is a Window
	      || node.defaultView; // node is a Document
	}

	function styleRemove(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant(name, value, priority) {
	  return function() {
	    this.style.setProperty(name, value, priority);
	  };
	}

	function styleFunction(name, value, priority) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.style.removeProperty(name);
	    else this.style.setProperty(name, v, priority);
	  };
	}

	function selection_style(name, value, priority) {
	  return arguments.length > 1
	      ? this.each((value == null
	            ? styleRemove : typeof value === "function"
	            ? styleFunction
	            : styleConstant)(name, value, priority == null ? "" : priority))
	      : styleValue(this.node(), name);
	}

	function styleValue(node, name) {
	  return node.style.getPropertyValue(name)
	      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
	}

	function propertyRemove(name) {
	  return function() {
	    delete this[name];
	  };
	}

	function propertyConstant(name, value) {
	  return function() {
	    this[name] = value;
	  };
	}

	function propertyFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) delete this[name];
	    else this[name] = v;
	  };
	}

	function selection_property(name, value) {
	  return arguments.length > 1
	      ? this.each((value == null
	          ? propertyRemove : typeof value === "function"
	          ? propertyFunction
	          : propertyConstant)(name, value))
	      : this.node()[name];
	}

	function classArray(string) {
	  return string.trim().split(/^|\s+/);
	}

	function classList(node) {
	  return node.classList || new ClassList(node);
	}

	function ClassList(node) {
	  this._node = node;
	  this._names = classArray(node.getAttribute("class") || "");
	}

	ClassList.prototype = {
	  add: function(name) {
	    var i = this._names.indexOf(name);
	    if (i < 0) {
	      this._names.push(name);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  remove: function(name) {
	    var i = this._names.indexOf(name);
	    if (i >= 0) {
	      this._names.splice(i, 1);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  contains: function(name) {
	    return this._names.indexOf(name) >= 0;
	  }
	};

	function classedAdd(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.add(names[i]);
	}

	function classedRemove(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.remove(names[i]);
	}

	function classedTrue(names) {
	  return function() {
	    classedAdd(this, names);
	  };
	}

	function classedFalse(names) {
	  return function() {
	    classedRemove(this, names);
	  };
	}

	function classedFunction(names, value) {
	  return function() {
	    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	  };
	}

	function selection_classed(name, value) {
	  var names = classArray(name + "");

	  if (arguments.length < 2) {
	    var list = classList(this.node()), i = -1, n = names.length;
	    while (++i < n) if (!list.contains(names[i])) return false;
	    return true;
	  }

	  return this.each((typeof value === "function"
	      ? classedFunction : value
	      ? classedTrue
	      : classedFalse)(names, value));
	}

	function textRemove() {
	  this.textContent = "";
	}

	function textConstant(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.textContent = v == null ? "" : v;
	  };
	}

	function selection_text(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? textRemove : (typeof value === "function"
	          ? textFunction
	          : textConstant)(value))
	      : this.node().textContent;
	}

	function htmlRemove() {
	  this.innerHTML = "";
	}

	function htmlConstant(value) {
	  return function() {
	    this.innerHTML = value;
	  };
	}

	function htmlFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.innerHTML = v == null ? "" : v;
	  };
	}

	function selection_html(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? htmlRemove : (typeof value === "function"
	          ? htmlFunction
	          : htmlConstant)(value))
	      : this.node().innerHTML;
	}

	function raise() {
	  if (this.nextSibling) this.parentNode.appendChild(this);
	}

	function selection_raise() {
	  return this.each(raise);
	}

	function lower() {
	  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	}

	function selection_lower() {
	  return this.each(lower);
	}

	function selection_append(name) {
	  var create = typeof name === "function" ? name : creator(name);
	  return this.select(function() {
	    return this.appendChild(create.apply(this, arguments));
	  });
	}

	function constantNull() {
	  return null;
	}

	function selection_insert(name, before) {
	  var create = typeof name === "function" ? name : creator(name),
	      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	  return this.select(function() {
	    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	  });
	}

	function remove() {
	  var parent = this.parentNode;
	  if (parent) parent.removeChild(this);
	}

	function selection_remove() {
	  return this.each(remove);
	}

	function selection_cloneShallow() {
	  return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
	}

	function selection_cloneDeep() {
	  return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
	}

	function selection_clone(deep) {
	  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
	}

	function selection_datum(value) {
	  return arguments.length
	      ? this.property("__data__", value)
	      : this.node().__data__;
	}

	var filterEvents = {};

	var event = null;

	if (typeof document !== "undefined") {
	  var element = document.documentElement;
	  if (!("onmouseenter" in element)) {
	    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
	  }
	}

	function filterContextListener(listener, index, group) {
	  listener = contextListener(listener, index, group);
	  return function(event) {
	    var related = event.relatedTarget;
	    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
	      listener.call(this, event);
	    }
	  };
	}

	function contextListener(listener, index, group) {
	  return function(event1) {
	    var event0 = event; // Events can be reentrant (e.g., focus).
	    event = event1;
	    try {
	      listener.call(this, this.__data__, index, group);
	    } finally {
	      event = event0;
	    }
	  };
	}

	function parseTypenames$1(typenames) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    return {type: t, name: name};
	  });
	}

	function onRemove(typename) {
	  return function() {
	    var on = this.__on;
	    if (!on) return;
	    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	      } else {
	        on[++i] = o;
	      }
	    }
	    if (++i) on.length = i;
	    else delete this.__on;
	  };
	}

	function onAdd(typename, value, capture) {
	  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
	  return function(d, i, group) {
	    var on = this.__on, o, listener = wrap(value, i, group);
	    if (on) for (var j = 0, m = on.length; j < m; ++j) {
	      if ((o = on[j]).type === typename.type && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
	        o.value = value;
	        return;
	      }
	    }
	    this.addEventListener(typename.type, listener, capture);
	    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
	    if (!on) this.__on = [o];
	    else on.push(o);
	  };
	}

	function selection_on(typename, value, capture) {
	  var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

	  if (arguments.length < 2) {
	    var on = this.node().__on;
	    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	      for (i = 0, o = on[j]; i < n; ++i) {
	        if ((t = typenames[i]).type === o.type && t.name === o.name) {
	          return o.value;
	        }
	      }
	    }
	    return;
	  }

	  on = value ? onAdd : onRemove;
	  if (capture == null) capture = false;
	  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
	  return this;
	}

	function customEvent(event1, listener, that, args) {
	  var event0 = event;
	  event1.sourceEvent = event;
	  event = event1;
	  try {
	    return listener.apply(that, args);
	  } finally {
	    event = event0;
	  }
	}

	function dispatchEvent(node, type, params) {
	  var window = defaultView(node),
	      event = window.CustomEvent;

	  if (typeof event === "function") {
	    event = new event(type, params);
	  } else {
	    event = window.document.createEvent("Event");
	    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
	    else event.initEvent(type, false, false);
	  }

	  node.dispatchEvent(event);
	}

	function dispatchConstant(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params);
	  };
	}

	function dispatchFunction(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params.apply(this, arguments));
	  };
	}

	function selection_dispatch(type, params) {
	  return this.each((typeof params === "function"
	      ? dispatchFunction
	      : dispatchConstant)(type, params));
	}

	var root$1 = [null];

	function Selection(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection() {
	  return new Selection([[document.documentElement]], root$1);
	}

	Selection.prototype = selection.prototype = {
	  constructor: Selection,
	  select: selection_select,
	  selectAll: selection_selectAll,
	  filter: selection_filter,
	  data: selection_data,
	  enter: selection_enter,
	  exit: selection_exit,
	  join: selection_join,
	  merge: selection_merge,
	  order: selection_order,
	  sort: selection_sort,
	  call: selection_call,
	  nodes: selection_nodes,
	  node: selection_node,
	  size: selection_size,
	  empty: selection_empty,
	  each: selection_each,
	  attr: selection_attr,
	  style: selection_style,
	  property: selection_property,
	  classed: selection_classed,
	  text: selection_text,
	  html: selection_html,
	  raise: selection_raise,
	  lower: selection_lower,
	  append: selection_append,
	  insert: selection_insert,
	  remove: selection_remove,
	  clone: selection_clone,
	  datum: selection_datum,
	  on: selection_on,
	  dispatch: selection_dispatch
	};

	function select(selector) {
	  return typeof selector === "string"
	      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
	      : new Selection([[selector]], root$1);
	}

	function sourceEvent() {
	  var current = event, source;
	  while (source = current.sourceEvent) current = source;
	  return current;
	}

	function point(node, event) {
	  var svg = node.ownerSVGElement || node;

	  if (svg.createSVGPoint) {
	    var point = svg.createSVGPoint();
	    point.x = event.clientX, point.y = event.clientY;
	    point = point.matrixTransform(node.getScreenCTM().inverse());
	    return [point.x, point.y];
	  }

	  var rect = node.getBoundingClientRect();
	  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
	}

	function mouse(node) {
	  var event = sourceEvent();
	  if (event.changedTouches) event = event.changedTouches[0];
	  return point(node, event);
	}

	function touch(node, touches, identifier) {
	  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

	  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
	    if ((touch = touches[i]).identifier === identifier) {
	      return point(node, touch);
	    }
	  }

	  return null;
	}

	function noevent() {
	  event.preventDefault();
	  event.stopImmediatePropagation();
	}

	function dragDisable(view) {
	  var root = view.document.documentElement,
	      selection = select(view).on("dragstart.drag", noevent, true);
	  if ("onselectstart" in root) {
	    selection.on("selectstart.drag", noevent, true);
	  } else {
	    root.__noselect = root.style.MozUserSelect;
	    root.style.MozUserSelect = "none";
	  }
	}

	function yesdrag(view, noclick) {
	  var root = view.document.documentElement,
	      selection = select(view).on("dragstart.drag", null);
	  if (noclick) {
	    selection.on("click.drag", noevent, true);
	    setTimeout(function() { selection.on("click.drag", null); }, 0);
	  }
	  if ("onselectstart" in root) {
	    selection.on("selectstart.drag", null);
	  } else {
	    root.style.MozUserSelect = root.__noselect;
	    delete root.__noselect;
	  }
	}

	function define(constructor, factory, prototype) {
	  constructor.prototype = factory.prototype = prototype;
	  prototype.constructor = constructor;
	}

	function extend(parent, definition) {
	  var prototype = Object.create(parent.prototype);
	  for (var key in definition) prototype[key] = definition[key];
	  return prototype;
	}

	function Color() {}

	var darker = 0.7;
	var brighter = 1 / darker;

	var reI = "\\s*([+-]?\\d+)\\s*",
	    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
	    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
	    reHex = /^#([0-9a-f]{3,8})$/,
	    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
	    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
	    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
	    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
	    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
	    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

	var named = {
	  aliceblue: 0xf0f8ff,
	  antiquewhite: 0xfaebd7,
	  aqua: 0x00ffff,
	  aquamarine: 0x7fffd4,
	  azure: 0xf0ffff,
	  beige: 0xf5f5dc,
	  bisque: 0xffe4c4,
	  black: 0x000000,
	  blanchedalmond: 0xffebcd,
	  blue: 0x0000ff,
	  blueviolet: 0x8a2be2,
	  brown: 0xa52a2a,
	  burlywood: 0xdeb887,
	  cadetblue: 0x5f9ea0,
	  chartreuse: 0x7fff00,
	  chocolate: 0xd2691e,
	  coral: 0xff7f50,
	  cornflowerblue: 0x6495ed,
	  cornsilk: 0xfff8dc,
	  crimson: 0xdc143c,
	  cyan: 0x00ffff,
	  darkblue: 0x00008b,
	  darkcyan: 0x008b8b,
	  darkgoldenrod: 0xb8860b,
	  darkgray: 0xa9a9a9,
	  darkgreen: 0x006400,
	  darkgrey: 0xa9a9a9,
	  darkkhaki: 0xbdb76b,
	  darkmagenta: 0x8b008b,
	  darkolivegreen: 0x556b2f,
	  darkorange: 0xff8c00,
	  darkorchid: 0x9932cc,
	  darkred: 0x8b0000,
	  darksalmon: 0xe9967a,
	  darkseagreen: 0x8fbc8f,
	  darkslateblue: 0x483d8b,
	  darkslategray: 0x2f4f4f,
	  darkslategrey: 0x2f4f4f,
	  darkturquoise: 0x00ced1,
	  darkviolet: 0x9400d3,
	  deeppink: 0xff1493,
	  deepskyblue: 0x00bfff,
	  dimgray: 0x696969,
	  dimgrey: 0x696969,
	  dodgerblue: 0x1e90ff,
	  firebrick: 0xb22222,
	  floralwhite: 0xfffaf0,
	  forestgreen: 0x228b22,
	  fuchsia: 0xff00ff,
	  gainsboro: 0xdcdcdc,
	  ghostwhite: 0xf8f8ff,
	  gold: 0xffd700,
	  goldenrod: 0xdaa520,
	  gray: 0x808080,
	  green: 0x008000,
	  greenyellow: 0xadff2f,
	  grey: 0x808080,
	  honeydew: 0xf0fff0,
	  hotpink: 0xff69b4,
	  indianred: 0xcd5c5c,
	  indigo: 0x4b0082,
	  ivory: 0xfffff0,
	  khaki: 0xf0e68c,
	  lavender: 0xe6e6fa,
	  lavenderblush: 0xfff0f5,
	  lawngreen: 0x7cfc00,
	  lemonchiffon: 0xfffacd,
	  lightblue: 0xadd8e6,
	  lightcoral: 0xf08080,
	  lightcyan: 0xe0ffff,
	  lightgoldenrodyellow: 0xfafad2,
	  lightgray: 0xd3d3d3,
	  lightgreen: 0x90ee90,
	  lightgrey: 0xd3d3d3,
	  lightpink: 0xffb6c1,
	  lightsalmon: 0xffa07a,
	  lightseagreen: 0x20b2aa,
	  lightskyblue: 0x87cefa,
	  lightslategray: 0x778899,
	  lightslategrey: 0x778899,
	  lightsteelblue: 0xb0c4de,
	  lightyellow: 0xffffe0,
	  lime: 0x00ff00,
	  limegreen: 0x32cd32,
	  linen: 0xfaf0e6,
	  magenta: 0xff00ff,
	  maroon: 0x800000,
	  mediumaquamarine: 0x66cdaa,
	  mediumblue: 0x0000cd,
	  mediumorchid: 0xba55d3,
	  mediumpurple: 0x9370db,
	  mediumseagreen: 0x3cb371,
	  mediumslateblue: 0x7b68ee,
	  mediumspringgreen: 0x00fa9a,
	  mediumturquoise: 0x48d1cc,
	  mediumvioletred: 0xc71585,
	  midnightblue: 0x191970,
	  mintcream: 0xf5fffa,
	  mistyrose: 0xffe4e1,
	  moccasin: 0xffe4b5,
	  navajowhite: 0xffdead,
	  navy: 0x000080,
	  oldlace: 0xfdf5e6,
	  olive: 0x808000,
	  olivedrab: 0x6b8e23,
	  orange: 0xffa500,
	  orangered: 0xff4500,
	  orchid: 0xda70d6,
	  palegoldenrod: 0xeee8aa,
	  palegreen: 0x98fb98,
	  paleturquoise: 0xafeeee,
	  palevioletred: 0xdb7093,
	  papayawhip: 0xffefd5,
	  peachpuff: 0xffdab9,
	  peru: 0xcd853f,
	  pink: 0xffc0cb,
	  plum: 0xdda0dd,
	  powderblue: 0xb0e0e6,
	  purple: 0x800080,
	  rebeccapurple: 0x663399,
	  red: 0xff0000,
	  rosybrown: 0xbc8f8f,
	  royalblue: 0x4169e1,
	  saddlebrown: 0x8b4513,
	  salmon: 0xfa8072,
	  sandybrown: 0xf4a460,
	  seagreen: 0x2e8b57,
	  seashell: 0xfff5ee,
	  sienna: 0xa0522d,
	  silver: 0xc0c0c0,
	  skyblue: 0x87ceeb,
	  slateblue: 0x6a5acd,
	  slategray: 0x708090,
	  slategrey: 0x708090,
	  snow: 0xfffafa,
	  springgreen: 0x00ff7f,
	  steelblue: 0x4682b4,
	  tan: 0xd2b48c,
	  teal: 0x008080,
	  thistle: 0xd8bfd8,
	  tomato: 0xff6347,
	  turquoise: 0x40e0d0,
	  violet: 0xee82ee,
	  wheat: 0xf5deb3,
	  white: 0xffffff,
	  whitesmoke: 0xf5f5f5,
	  yellow: 0xffff00,
	  yellowgreen: 0x9acd32
	};

	define(Color, color, {
	  copy: function(channels) {
	    return Object.assign(new this.constructor, this, channels);
	  },
	  displayable: function() {
	    return this.rgb().displayable();
	  },
	  hex: color_formatHex, // Deprecated! Use color.formatHex.
	  formatHex: color_formatHex,
	  formatHsl: color_formatHsl,
	  formatRgb: color_formatRgb,
	  toString: color_formatRgb
	});

	function color_formatHex() {
	  return this.rgb().formatHex();
	}

	function color_formatHsl() {
	  return hslConvert(this).formatHsl();
	}

	function color_formatRgb() {
	  return this.rgb().formatRgb();
	}

	function color(format) {
	  var m, l;
	  format = (format + "").trim().toLowerCase();
	  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
	      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
	      : l === 8 ? new Rgb(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
	      : l === 4 ? new Rgb((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
	      : null) // invalid hex
	      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
	      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
	      : null;
	}

	function rgbn(n) {
	  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	}

	function rgba(r, g, b, a) {
	  if (a <= 0) r = g = b = NaN;
	  return new Rgb(r, g, b, a);
	}

	function rgbConvert(o) {
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Rgb;
	  o = o.rgb();
	  return new Rgb(o.r, o.g, o.b, o.opacity);
	}

	function rgb(r, g, b, opacity) {
	  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
	}

	function Rgb(r, g, b, opacity) {
	  this.r = +r;
	  this.g = +g;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define(Rgb, rgb, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  rgb: function() {
	    return this;
	  },
	  displayable: function() {
	    return (-0.5 <= this.r && this.r < 255.5)
	        && (-0.5 <= this.g && this.g < 255.5)
	        && (-0.5 <= this.b && this.b < 255.5)
	        && (0 <= this.opacity && this.opacity <= 1);
	  },
	  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
	  formatHex: rgb_formatHex,
	  formatRgb: rgb_formatRgb,
	  toString: rgb_formatRgb
	}));

	function rgb_formatHex() {
	  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
	}

	function rgb_formatRgb() {
	  var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	  return (a === 1 ? "rgb(" : "rgba(")
	      + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
	      + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
	      + Math.max(0, Math.min(255, Math.round(this.b) || 0))
	      + (a === 1 ? ")" : ", " + a + ")");
	}

	function hex(value) {
	  value = Math.max(0, Math.min(255, Math.round(value) || 0));
	  return (value < 16 ? "0" : "") + value.toString(16);
	}

	function hsla(h, s, l, a) {
	  if (a <= 0) h = s = l = NaN;
	  else if (l <= 0 || l >= 1) h = s = NaN;
	  else if (s <= 0) h = NaN;
	  return new Hsl(h, s, l, a);
	}

	function hslConvert(o) {
	  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Hsl;
	  if (o instanceof Hsl) return o;
	  o = o.rgb();
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      h = NaN,
	      s = max - min,
	      l = (max + min) / 2;
	  if (s) {
	    if (r === max) h = (g - b) / s + (g < b) * 6;
	    else if (g === max) h = (b - r) / s + 2;
	    else h = (r - g) / s + 4;
	    s /= l < 0.5 ? max + min : 2 - max - min;
	    h *= 60;
	  } else {
	    s = l > 0 && l < 1 ? 0 : h;
	  }
	  return new Hsl(h, s, l, o.opacity);
	}

	function hsl(h, s, l, opacity) {
	  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
	}

	function Hsl(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Hsl, hsl, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb(
	      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
	      hsl2rgb(h, m1, m2),
	      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
	      this.opacity
	    );
	  },
	  displayable: function() {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
	        && (0 <= this.l && this.l <= 1)
	        && (0 <= this.opacity && this.opacity <= 1);
	  },
	  formatHsl: function() {
	    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	    return (a === 1 ? "hsl(" : "hsla(")
	        + (this.h || 0) + ", "
	        + (this.s || 0) * 100 + "%, "
	        + (this.l || 0) * 100 + "%"
	        + (a === 1 ? ")" : ", " + a + ")");
	  }
	}));

	/* From FvD 13.37, CSS Color Module Level 3 */
	function hsl2rgb(h, m1, m2) {
	  return (h < 60 ? m1 + (m2 - m1) * h / 60
	      : h < 180 ? m2
	      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
	      : m1) * 255;
	}

	function constant$1(x) {
	  return function() {
	    return x;
	  };
	}

	function linear(a, d) {
	  return function(t) {
	    return a + t * d;
	  };
	}

	function exponential(a, b, y) {
	  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
	    return Math.pow(a + t * b, y);
	  };
	}

	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function(a, b) {
	    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
	  };
	}

	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
	}

	var interpolateRgb = (function rgbGamma(y) {
	  var color = gamma(y);

	  function rgb$1(start, end) {
	    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
	        g = color(start.g, end.g),
	        b = color(start.b, end.b),
	        opacity = nogamma(start.opacity, end.opacity);
	    return function(t) {
	      start.r = r(t);
	      start.g = g(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  rgb$1.gamma = rgbGamma;

	  return rgb$1;
	})(1);

	function interpolateNumber(a, b) {
	  return a = +a, b -= a, function(t) {
	    return a + b * t;
	  };
	}

	var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
	    reB = new RegExp(reA.source, "g");

	function zero(b) {
	  return function() {
	    return b;
	  };
	}

	function one(b) {
	  return function(t) {
	    return b(t) + "";
	  };
	}

	function interpolateString(a, b) {
	  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
	      am, // current match in a
	      bm, // current match in b
	      bs, // string preceding current number in b, if any
	      i = -1, // index in s
	      s = [], // string constants and placeholders
	      q = []; // number interpolators

	  // Coerce inputs to strings.
	  a = a + "", b = b + "";

	  // Interpolate pairs of numbers in a & b.
	  while ((am = reA.exec(a))
	      && (bm = reB.exec(b))) {
	    if ((bs = bm.index) > bi) { // a string precedes the next number in b
	      bs = b.slice(bi, bs);
	      if (s[i]) s[i] += bs; // coalesce with previous string
	      else s[++i] = bs;
	    }
	    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
	      if (s[i]) s[i] += bm; // coalesce with previous string
	      else s[++i] = bm;
	    } else { // interpolate non-matching numbers
	      s[++i] = null;
	      q.push({i: i, x: interpolateNumber(am, bm)});
	    }
	    bi = reB.lastIndex;
	  }

	  // Add remains of b.
	  if (bi < b.length) {
	    bs = b.slice(bi);
	    if (s[i]) s[i] += bs; // coalesce with previous string
	    else s[++i] = bs;
	  }

	  // Special optimization for only a single match.
	  // Otherwise, interpolate each of the numbers and rejoin the string.
	  return s.length < 2 ? (q[0]
	      ? one(q[0].x)
	      : zero(b))
	      : (b = q.length, function(t) {
	          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	          return s.join("");
	        });
	}

	var degrees = 180 / Math.PI;

	var identity = {
	  translateX: 0,
	  translateY: 0,
	  rotate: 0,
	  skewX: 0,
	  scaleX: 1,
	  scaleY: 1
	};

	function decompose(a, b, c, d, e, f) {
	  var scaleX, scaleY, skewX;
	  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	  return {
	    translateX: e,
	    translateY: f,
	    rotate: Math.atan2(b, a) * degrees,
	    skewX: Math.atan(skewX) * degrees,
	    scaleX: scaleX,
	    scaleY: scaleY
	  };
	}

	var cssNode,
	    cssRoot,
	    cssView,
	    svgNode;

	function parseCss(value) {
	  if (value === "none") return identity;
	  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
	  cssNode.style.transform = value;
	  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
	  cssRoot.removeChild(cssNode);
	  value = value.slice(7, -1).split(",");
	  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
	}

	function parseSvg(value) {
	  if (value == null) return identity;
	  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	  svgNode.setAttribute("transform", value);
	  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
	  value = value.matrix;
	  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
	}

	function interpolateTransform(parse, pxComma, pxParen, degParen) {

	  function pop(s) {
	    return s.length ? s.pop() + " " : "";
	  }

	  function translate(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push("translate(", null, pxComma, null, pxParen);
	      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
	    } else if (xb || yb) {
	      s.push("translate(" + xb + pxComma + yb + pxParen);
	    }
	  }

	  function rotate(a, b, s, q) {
	    if (a !== b) {
	      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
	      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
	    } else if (b) {
	      s.push(pop(s) + "rotate(" + b + degParen);
	    }
	  }

	  function skewX(a, b, s, q) {
	    if (a !== b) {
	      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
	    } else if (b) {
	      s.push(pop(s) + "skewX(" + b + degParen);
	    }
	  }

	  function scale(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
	      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
	    } else if (xb !== 1 || yb !== 1) {
	      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
	    }
	  }

	  return function(a, b) {
	    var s = [], // string constants and placeholders
	        q = []; // number interpolators
	    a = parse(a), b = parse(b);
	    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
	    rotate(a.rotate, b.rotate, s, q);
	    skewX(a.skewX, b.skewX, s, q);
	    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
	    a = b = null; // gc
	    return function(t) {
	      var i = -1, n = q.length, o;
	      while (++i < n) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    };
	  };
	}

	var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
	var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

	var rho = Math.SQRT2,
	    rho2 = 2,
	    rho4 = 4,
	    epsilon2 = 1e-12;

	function cosh(x) {
	  return ((x = Math.exp(x)) + 1 / x) / 2;
	}

	function sinh(x) {
	  return ((x = Math.exp(x)) - 1 / x) / 2;
	}

	function tanh(x) {
	  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
	}

	// p0 = [ux0, uy0, w0]
	// p1 = [ux1, uy1, w1]
	function interpolateZoom(p0, p1) {
	  var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
	      ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
	      dx = ux1 - ux0,
	      dy = uy1 - uy0,
	      d2 = dx * dx + dy * dy,
	      i,
	      S;

	  // Special case for u0 ≅ u1.
	  if (d2 < epsilon2) {
	    S = Math.log(w1 / w0) / rho;
	    i = function(t) {
	      return [
	        ux0 + t * dx,
	        uy0 + t * dy,
	        w0 * Math.exp(rho * t * S)
	      ];
	    };
	  }

	  // General case.
	  else {
	    var d1 = Math.sqrt(d2),
	        b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
	        b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
	        r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
	        r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
	    S = (r1 - r0) / rho;
	    i = function(t) {
	      var s = t * S,
	          coshr0 = cosh(r0),
	          u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
	      return [
	        ux0 + u * dx,
	        uy0 + u * dy,
	        w0 * coshr0 / cosh(rho * s + r0)
	      ];
	    };
	  }

	  i.duration = S * 1000;

	  return i;
	}

	var frame = 0, // is an animation frame pending?
	    timeout = 0, // is a timeout pending?
	    interval = 0, // are any timers active?
	    pokeDelay = 1000, // how frequently we check for clock skew
	    taskHead,
	    taskTail,
	    clockLast = 0,
	    clockNow = 0,
	    clockSkew = 0,
	    clock = typeof performance === "object" && performance.now ? performance : Date,
	    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

	function now() {
	  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
	}

	function clearNow() {
	  clockNow = 0;
	}

	function Timer() {
	  this._call =
	  this._time =
	  this._next = null;
	}

	Timer.prototype = timer.prototype = {
	  constructor: Timer,
	  restart: function(callback, delay, time) {
	    if (typeof callback !== "function") throw new TypeError("callback is not a function");
	    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
	    if (!this._next && taskTail !== this) {
	      if (taskTail) taskTail._next = this;
	      else taskHead = this;
	      taskTail = this;
	    }
	    this._call = callback;
	    this._time = time;
	    sleep();
	  },
	  stop: function() {
	    if (this._call) {
	      this._call = null;
	      this._time = Infinity;
	      sleep();
	    }
	  }
	};

	function timer(callback, delay, time) {
	  var t = new Timer;
	  t.restart(callback, delay, time);
	  return t;
	}

	function timerFlush() {
	  now(); // Get the current time, if not already set.
	  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
	  var t = taskHead, e;
	  while (t) {
	    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
	    t = t._next;
	  }
	  --frame;
	}

	function wake() {
	  clockNow = (clockLast = clock.now()) + clockSkew;
	  frame = timeout = 0;
	  try {
	    timerFlush();
	  } finally {
	    frame = 0;
	    nap();
	    clockNow = 0;
	  }
	}

	function poke() {
	  var now = clock.now(), delay = now - clockLast;
	  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
	}

	function nap() {
	  var t0, t1 = taskHead, t2, time = Infinity;
	  while (t1) {
	    if (t1._call) {
	      if (time > t1._time) time = t1._time;
	      t0 = t1, t1 = t1._next;
	    } else {
	      t2 = t1._next, t1._next = null;
	      t1 = t0 ? t0._next = t2 : taskHead = t2;
	    }
	  }
	  taskTail = t0;
	  sleep(time);
	}

	function sleep(time) {
	  if (frame) return; // Soonest alarm already set, or will be.
	  if (timeout) timeout = clearTimeout(timeout);
	  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
	  if (delay > 24) {
	    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
	    if (interval) interval = clearInterval(interval);
	  } else {
	    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
	    frame = 1, setFrame(wake);
	  }
	}

	function timeout$1(callback, delay, time) {
	  var t = new Timer;
	  delay = delay == null ? 0 : +delay;
	  t.restart(function(elapsed) {
	    t.stop();
	    callback(elapsed + delay);
	  }, delay, time);
	  return t;
	}

	var emptyOn = dispatch("start", "end", "cancel", "interrupt");
	var emptyTween = [];

	var CREATED = 0;
	var SCHEDULED = 1;
	var STARTING = 2;
	var STARTED = 3;
	var RUNNING = 4;
	var ENDING = 5;
	var ENDED = 6;

	function schedule(node, name, id, index, group, timing) {
	  var schedules = node.__transition;
	  if (!schedules) node.__transition = {};
	  else if (id in schedules) return;
	  create(node, id, {
	    name: name,
	    index: index, // For context during callback.
	    group: group, // For context during callback.
	    on: emptyOn,
	    tween: emptyTween,
	    time: timing.time,
	    delay: timing.delay,
	    duration: timing.duration,
	    ease: timing.ease,
	    timer: null,
	    state: CREATED
	  });
	}

	function init(node, id) {
	  var schedule = get$4(node, id);
	  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
	  return schedule;
	}

	function set$4(node, id) {
	  var schedule = get$4(node, id);
	  if (schedule.state > STARTED) throw new Error("too late; already running");
	  return schedule;
	}

	function get$4(node, id) {
	  var schedule = node.__transition;
	  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
	  return schedule;
	}

	function create(node, id, self) {
	  var schedules = node.__transition,
	      tween;

	  // Initialize the self timer when the transition is created.
	  // Note the actual delay is not known until the first callback!
	  schedules[id] = self;
	  self.timer = timer(schedule, 0, self.time);

	  function schedule(elapsed) {
	    self.state = SCHEDULED;
	    self.timer.restart(start, self.delay, self.time);

	    // If the elapsed delay is less than our first sleep, start immediately.
	    if (self.delay <= elapsed) start(elapsed - self.delay);
	  }

	  function start(elapsed) {
	    var i, j, n, o;

	    // If the state is not SCHEDULED, then we previously errored on start.
	    if (self.state !== SCHEDULED) return stop();

	    for (i in schedules) {
	      o = schedules[i];
	      if (o.name !== self.name) continue;

	      // While this element already has a starting transition during this frame,
	      // defer starting an interrupting transition until that transition has a
	      // chance to tick (and possibly end); see d3/d3-transition#54!
	      if (o.state === STARTED) return timeout$1(start);

	      // Interrupt the active transition, if any.
	      if (o.state === RUNNING) {
	        o.state = ENDED;
	        o.timer.stop();
	        o.on.call("interrupt", node, node.__data__, o.index, o.group);
	        delete schedules[i];
	      }

	      // Cancel any pre-empted transitions.
	      else if (+i < id) {
	        o.state = ENDED;
	        o.timer.stop();
	        o.on.call("cancel", node, node.__data__, o.index, o.group);
	        delete schedules[i];
	      }
	    }

	    // Defer the first tick to end of the current frame; see d3/d3#1576.
	    // Note the transition may be canceled after start and before the first tick!
	    // Note this must be scheduled before the start event; see d3/d3-transition#16!
	    // Assuming this is successful, subsequent callbacks go straight to tick.
	    timeout$1(function() {
	      if (self.state === STARTED) {
	        self.state = RUNNING;
	        self.timer.restart(tick, self.delay, self.time);
	        tick(elapsed);
	      }
	    });

	    // Dispatch the start event.
	    // Note this must be done before the tween are initialized.
	    self.state = STARTING;
	    self.on.call("start", node, node.__data__, self.index, self.group);
	    if (self.state !== STARTING) return; // interrupted
	    self.state = STARTED;

	    // Initialize the tween, deleting null tween.
	    tween = new Array(n = self.tween.length);
	    for (i = 0, j = -1; i < n; ++i) {
	      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
	        tween[++j] = o;
	      }
	    }
	    tween.length = j + 1;
	  }

	  function tick(elapsed) {
	    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
	        i = -1,
	        n = tween.length;

	    while (++i < n) {
	      tween[i].call(node, t);
	    }

	    // Dispatch the end event.
	    if (self.state === ENDING) {
	      self.on.call("end", node, node.__data__, self.index, self.group);
	      stop();
	    }
	  }

	  function stop() {
	    self.state = ENDED;
	    self.timer.stop();
	    delete schedules[id];
	    for (var i in schedules) return; // eslint-disable-line no-unused-vars
	    delete node.__transition;
	  }
	}

	function interrupt(node, name) {
	  var schedules = node.__transition,
	      schedule,
	      active,
	      empty = true,
	      i;

	  if (!schedules) return;

	  name = name == null ? null : name + "";

	  for (i in schedules) {
	    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
	    active = schedule.state > STARTING && schedule.state < ENDING;
	    schedule.state = ENDED;
	    schedule.timer.stop();
	    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
	    delete schedules[i];
	  }

	  if (empty) delete node.__transition;
	}

	function selection_interrupt(name) {
	  return this.each(function() {
	    interrupt(this, name);
	  });
	}

	function tweenRemove(id, name) {
	  var tween0, tween1;
	  return function() {
	    var schedule = set$4(this, id),
	        tween = schedule.tween;

	    // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.
	    if (tween !== tween0) {
	      tween1 = tween0 = tween;
	      for (var i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1 = tween1.slice();
	          tween1.splice(i, 1);
	          break;
	        }
	      }
	    }

	    schedule.tween = tween1;
	  };
	}

	function tweenFunction(id, name, value) {
	  var tween0, tween1;
	  if (typeof value !== "function") throw new Error;
	  return function() {
	    var schedule = set$4(this, id),
	        tween = schedule.tween;

	    // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.
	    if (tween !== tween0) {
	      tween1 = (tween0 = tween).slice();
	      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1[i] = t;
	          break;
	        }
	      }
	      if (i === n) tween1.push(t);
	    }

	    schedule.tween = tween1;
	  };
	}

	function transition_tween(name, value) {
	  var id = this._id;

	  name += "";

	  if (arguments.length < 2) {
	    var tween = get$4(this.node(), id).tween;
	    for (var i = 0, n = tween.length, t; i < n; ++i) {
	      if ((t = tween[i]).name === name) {
	        return t.value;
	      }
	    }
	    return null;
	  }

	  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
	}

	function tweenValue(transition, name, value) {
	  var id = transition._id;

	  transition.each(function() {
	    var schedule = set$4(this, id);
	    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
	  });

	  return function(node) {
	    return get$4(node, id).value[name];
	  };
	}

	function interpolate(a, b) {
	  var c;
	  return (typeof b === "number" ? interpolateNumber
	      : b instanceof color ? interpolateRgb
	      : (c = color(b)) ? (b = c, interpolateRgb)
	      : interpolateString)(a, b);
	}

	function attrRemove$1(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS$1(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant$1(name, interpolate, value1) {
	  var string00,
	      string1 = value1 + "",
	      interpolate0;
	  return function() {
	    var string0 = this.getAttribute(name);
	    return string0 === string1 ? null
	        : string0 === string00 ? interpolate0
	        : interpolate0 = interpolate(string00 = string0, value1);
	  };
	}

	function attrConstantNS$1(fullname, interpolate, value1) {
	  var string00,
	      string1 = value1 + "",
	      interpolate0;
	  return function() {
	    var string0 = this.getAttributeNS(fullname.space, fullname.local);
	    return string0 === string1 ? null
	        : string0 === string00 ? interpolate0
	        : interpolate0 = interpolate(string00 = string0, value1);
	  };
	}

	function attrFunction$1(name, interpolate, value) {
	  var string00,
	      string10,
	      interpolate0;
	  return function() {
	    var string0, value1 = value(this), string1;
	    if (value1 == null) return void this.removeAttribute(name);
	    string0 = this.getAttribute(name);
	    string1 = value1 + "";
	    return string0 === string1 ? null
	        : string0 === string00 && string1 === string10 ? interpolate0
	        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	  };
	}

	function attrFunctionNS$1(fullname, interpolate, value) {
	  var string00,
	      string10,
	      interpolate0;
	  return function() {
	    var string0, value1 = value(this), string1;
	    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
	    string0 = this.getAttributeNS(fullname.space, fullname.local);
	    string1 = value1 + "";
	    return string0 === string1 ? null
	        : string0 === string00 && string1 === string10 ? interpolate0
	        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	  };
	}

	function transition_attr(name, value) {
	  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
	  return this.attrTween(name, typeof value === "function"
	      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
	      : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
	      : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
	}

	function attrInterpolate(name, i) {
	  return function(t) {
	    this.setAttribute(name, i(t));
	  };
	}

	function attrInterpolateNS(fullname, i) {
	  return function(t) {
	    this.setAttributeNS(fullname.space, fullname.local, i(t));
	  };
	}

	function attrTweenNS(fullname, value) {
	  var t0, i0;
	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
	    return t0;
	  }
	  tween._value = value;
	  return tween;
	}

	function attrTween(name, value) {
	  var t0, i0;
	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
	    return t0;
	  }
	  tween._value = value;
	  return tween;
	}

	function transition_attrTween(name, value) {
	  var key = "attr." + name;
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error;
	  var fullname = namespace(name);
	  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
	}

	function delayFunction(id, value) {
	  return function() {
	    init(this, id).delay = +value.apply(this, arguments);
	  };
	}

	function delayConstant(id, value) {
	  return value = +value, function() {
	    init(this, id).delay = value;
	  };
	}

	function transition_delay(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each((typeof value === "function"
	          ? delayFunction
	          : delayConstant)(id, value))
	      : get$4(this.node(), id).delay;
	}

	function durationFunction(id, value) {
	  return function() {
	    set$4(this, id).duration = +value.apply(this, arguments);
	  };
	}

	function durationConstant(id, value) {
	  return value = +value, function() {
	    set$4(this, id).duration = value;
	  };
	}

	function transition_duration(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each((typeof value === "function"
	          ? durationFunction
	          : durationConstant)(id, value))
	      : get$4(this.node(), id).duration;
	}

	function easeConstant(id, value) {
	  if (typeof value !== "function") throw new Error;
	  return function() {
	    set$4(this, id).ease = value;
	  };
	}

	function transition_ease(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each(easeConstant(id, value))
	      : get$4(this.node(), id).ease;
	}

	function transition_filter(match) {
	  if (typeof match !== "function") match = matcher(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, this._name, this._id);
	}

	function transition_merge(transition) {
	  if (transition._id !== this._id) throw new Error;

	  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Transition(merges, this._parents, this._name, this._id);
	}

	function start(name) {
	  return (name + "").trim().split(/^|\s+/).every(function(t) {
	    var i = t.indexOf(".");
	    if (i >= 0) t = t.slice(0, i);
	    return !t || t === "start";
	  });
	}

	function onFunction(id, name, listener) {
	  var on0, on1, sit = start(name) ? init : set$4;
	  return function() {
	    var schedule = sit(this, id),
	        on = schedule.on;

	    // If this node shared a dispatch with the previous node,
	    // just assign the updated shared dispatch and we’re done!
	    // Otherwise, copy-on-write.
	    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

	    schedule.on = on1;
	  };
	}

	function transition_on(name, listener) {
	  var id = this._id;

	  return arguments.length < 2
	      ? get$4(this.node(), id).on.on(name)
	      : this.each(onFunction(id, name, listener));
	}

	function removeFunction(id) {
	  return function() {
	    var parent = this.parentNode;
	    for (var i in this.__transition) if (+i !== id) return;
	    if (parent) parent.removeChild(this);
	  };
	}

	function transition_remove() {
	  return this.on("end.remove", removeFunction(this._id));
	}

	function transition_select(select) {
	  var name = this._name,
	      id = this._id;

	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	        schedule(subgroup[i], name, id, i, subgroup, get$4(node, id));
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, name, id);
	}

	function transition_selectAll(select) {
	  var name = this._name,
	      id = this._id;

	  if (typeof select !== "function") select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        for (var children = select.call(node, node.__data__, i, group), child, inherit = get$4(node, id), k = 0, l = children.length; k < l; ++k) {
	          if (child = children[k]) {
	            schedule(child, name, id, k, children, inherit);
	          }
	        }
	        subgroups.push(children);
	        parents.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, parents, name, id);
	}

	var Selection$1 = selection.prototype.constructor;

	function transition_selection() {
	  return new Selection$1(this._groups, this._parents);
	}

	function styleNull(name, interpolate) {
	  var string00,
	      string10,
	      interpolate0;
	  return function() {
	    var string0 = styleValue(this, name),
	        string1 = (this.style.removeProperty(name), styleValue(this, name));
	    return string0 === string1 ? null
	        : string0 === string00 && string1 === string10 ? interpolate0
	        : interpolate0 = interpolate(string00 = string0, string10 = string1);
	  };
	}

	function styleRemove$1(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant$1(name, interpolate, value1) {
	  var string00,
	      string1 = value1 + "",
	      interpolate0;
	  return function() {
	    var string0 = styleValue(this, name);
	    return string0 === string1 ? null
	        : string0 === string00 ? interpolate0
	        : interpolate0 = interpolate(string00 = string0, value1);
	  };
	}

	function styleFunction$1(name, interpolate, value) {
	  var string00,
	      string10,
	      interpolate0;
	  return function() {
	    var string0 = styleValue(this, name),
	        value1 = value(this),
	        string1 = value1 + "";
	    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
	    return string0 === string1 ? null
	        : string0 === string00 && string1 === string10 ? interpolate0
	        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	  };
	}

	function styleMaybeRemove(id, name) {
	  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
	  return function() {
	    var schedule = set$4(this, id),
	        on = schedule.on,
	        listener = schedule.value[key] == null ? remove || (remove = styleRemove$1(name)) : undefined;

	    // If this node shared a dispatch with the previous node,
	    // just assign the updated shared dispatch and we’re done!
	    // Otherwise, copy-on-write.
	    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

	    schedule.on = on1;
	  };
	}

	function transition_style(name, value, priority) {
	  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
	  return value == null ? this
	      .styleTween(name, styleNull(name, i))
	      .on("end.style." + name, styleRemove$1(name))
	    : typeof value === "function" ? this
	      .styleTween(name, styleFunction$1(name, i, tweenValue(this, "style." + name, value)))
	      .each(styleMaybeRemove(this._id, name))
	    : this
	      .styleTween(name, styleConstant$1(name, i, value), priority)
	      .on("end.style." + name, null);
	}

	function styleInterpolate(name, i, priority) {
	  return function(t) {
	    this.style.setProperty(name, i(t), priority);
	  };
	}

	function styleTween(name, value, priority) {
	  var t, i0;
	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
	    return t;
	  }
	  tween._value = value;
	  return tween;
	}

	function transition_styleTween(name, value, priority) {
	  var key = "style." + (name += "");
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error;
	  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
	}

	function textConstant$1(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction$1(value) {
	  return function() {
	    var value1 = value(this);
	    this.textContent = value1 == null ? "" : value1;
	  };
	}

	function transition_text(value) {
	  return this.tween("text", typeof value === "function"
	      ? textFunction$1(tweenValue(this, "text", value))
	      : textConstant$1(value == null ? "" : value + ""));
	}

	function transition_transition() {
	  var name = this._name,
	      id0 = this._id,
	      id1 = newId();

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        var inherit = get$4(node, id0);
	        schedule(node, name, id1, i, group, {
	          time: inherit.time + inherit.delay + inherit.duration,
	          delay: 0,
	          duration: inherit.duration,
	          ease: inherit.ease
	        });
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id1);
	}

	function transition_end() {
	  var on0, on1, that = this, id = that._id, size = that.size();
	  return new Promise(function(resolve, reject) {
	    var cancel = {value: reject},
	        end = {value: function() { if (--size === 0) resolve(); }};

	    that.each(function() {
	      var schedule = set$4(this, id),
	          on = schedule.on;

	      // If this node shared a dispatch with the previous node,
	      // just assign the updated shared dispatch and we’re done!
	      // Otherwise, copy-on-write.
	      if (on !== on0) {
	        on1 = (on0 = on).copy();
	        on1._.cancel.push(cancel);
	        on1._.interrupt.push(cancel);
	        on1._.end.push(end);
	      }

	      schedule.on = on1;
	    });
	  });
	}

	var id = 0;

	function Transition(groups, parents, name, id) {
	  this._groups = groups;
	  this._parents = parents;
	  this._name = name;
	  this._id = id;
	}

	function transition(name) {
	  return selection().transition(name);
	}

	function newId() {
	  return ++id;
	}

	var selection_prototype = selection.prototype;

	Transition.prototype = transition.prototype = {
	  constructor: Transition,
	  select: transition_select,
	  selectAll: transition_selectAll,
	  filter: transition_filter,
	  merge: transition_merge,
	  selection: transition_selection,
	  transition: transition_transition,
	  call: selection_prototype.call,
	  nodes: selection_prototype.nodes,
	  node: selection_prototype.node,
	  size: selection_prototype.size,
	  empty: selection_prototype.empty,
	  each: selection_prototype.each,
	  on: transition_on,
	  attr: transition_attr,
	  attrTween: transition_attrTween,
	  style: transition_style,
	  styleTween: transition_styleTween,
	  text: transition_text,
	  remove: transition_remove,
	  tween: transition_tween,
	  delay: transition_delay,
	  duration: transition_duration,
	  ease: transition_ease,
	  end: transition_end
	};

	function cubicInOut(t) {
	  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
	}

	var defaultTiming = {
	  time: null, // Set on use.
	  delay: 0,
	  duration: 250,
	  ease: cubicInOut
	};

	function inherit(node, id) {
	  var timing;
	  while (!(timing = node.__transition) || !(timing = timing[id])) {
	    if (!(node = node.parentNode)) {
	      return defaultTiming.time = now(), defaultTiming;
	    }
	  }
	  return timing;
	}

	function selection_transition(name) {
	  var id,
	      timing;

	  if (name instanceof Transition) {
	    id = name._id, name = name._name;
	  } else {
	    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
	  }

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        schedule(node, name, id, i, group, timing || inherit(node, id));
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id);
	}

	selection.prototype.interrupt = selection_interrupt;
	selection.prototype.transition = selection_transition;

	function constant$2(x) {
	  return function() {
	    return x;
	  };
	}

	function ZoomEvent(target, type, transform) {
	  this.target = target;
	  this.type = type;
	  this.transform = transform;
	}

	function Transform(k, x, y) {
	  this.k = k;
	  this.x = x;
	  this.y = y;
	}

	Transform.prototype = {
	  constructor: Transform,
	  scale: function(k) {
	    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
	  },
	  translate: function(x, y) {
	    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
	  },
	  apply: function(point) {
	    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
	  },
	  applyX: function(x) {
	    return x * this.k + this.x;
	  },
	  applyY: function(y) {
	    return y * this.k + this.y;
	  },
	  invert: function(location) {
	    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
	  },
	  invertX: function(x) {
	    return (x - this.x) / this.k;
	  },
	  invertY: function(y) {
	    return (y - this.y) / this.k;
	  },
	  rescaleX: function(x) {
	    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
	  },
	  rescaleY: function(y) {
	    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
	  },
	  toString: function() {
	    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	  }
	};

	var identity$1 = new Transform(1, 0, 0);

	function nopropagation() {
	  event.stopImmediatePropagation();
	}

	function noevent$1() {
	  event.preventDefault();
	  event.stopImmediatePropagation();
	}

	// Ignore right-click, since that should open the context menu.
	function defaultFilter() {
	  return !event.ctrlKey && !event.button;
	}

	function defaultExtent() {
	  var e = this;
	  if (e instanceof SVGElement) {
	    e = e.ownerSVGElement || e;
	    if (e.hasAttribute("viewBox")) {
	      e = e.viewBox.baseVal;
	      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
	    }
	    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
	  }
	  return [[0, 0], [e.clientWidth, e.clientHeight]];
	}

	function defaultTransform() {
	  return this.__zoom || identity$1;
	}

	function defaultWheelDelta() {
	  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002);
	}

	function defaultTouchable() {
	  return navigator.maxTouchPoints || ("ontouchstart" in this);
	}

	function defaultConstrain(transform, extent, translateExtent) {
	  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
	      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
	      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
	      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
	  return transform.translate(
	    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
	    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
	  );
	}

	function zoom() {
	  var filter = defaultFilter,
	      extent = defaultExtent,
	      constrain = defaultConstrain,
	      wheelDelta = defaultWheelDelta,
	      touchable = defaultTouchable,
	      scaleExtent = [0, Infinity],
	      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
	      duration = 250,
	      interpolate = interpolateZoom,
	      listeners = dispatch("start", "zoom", "end"),
	      touchstarting,
	      touchending,
	      touchDelay = 500,
	      wheelDelay = 150,
	      clickDistance2 = 0;

	  function zoom(selection) {
	    selection
	        .property("__zoom", defaultTransform)
	        .on("wheel.zoom", wheeled)
	        .on("mousedown.zoom", mousedowned)
	        .on("dblclick.zoom", dblclicked)
	      .filter(touchable)
	        .on("touchstart.zoom", touchstarted)
	        .on("touchmove.zoom", touchmoved)
	        .on("touchend.zoom touchcancel.zoom", touchended)
	        .style("touch-action", "none")
	        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	  }

	  zoom.transform = function(collection, transform, point) {
	    var selection = collection.selection ? collection.selection() : collection;
	    selection.property("__zoom", defaultTransform);
	    if (collection !== selection) {
	      schedule(collection, transform, point);
	    } else {
	      selection.interrupt().each(function() {
	        gesture(this, arguments)
	            .start()
	            .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
	            .end();
	      });
	    }
	  };

	  zoom.scaleBy = function(selection, k, p) {
	    zoom.scaleTo(selection, function() {
	      var k0 = this.__zoom.k,
	          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
	      return k0 * k1;
	    }, p);
	  };

	  zoom.scaleTo = function(selection, k, p) {
	    zoom.transform(selection, function() {
	      var e = extent.apply(this, arguments),
	          t0 = this.__zoom,
	          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
	          p1 = t0.invert(p0),
	          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
	      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
	    }, p);
	  };

	  zoom.translateBy = function(selection, x, y) {
	    zoom.transform(selection, function() {
	      return constrain(this.__zoom.translate(
	        typeof x === "function" ? x.apply(this, arguments) : x,
	        typeof y === "function" ? y.apply(this, arguments) : y
	      ), extent.apply(this, arguments), translateExtent);
	    });
	  };

	  zoom.translateTo = function(selection, x, y, p) {
	    zoom.transform(selection, function() {
	      var e = extent.apply(this, arguments),
	          t = this.__zoom,
	          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
	      return constrain(identity$1.translate(p0[0], p0[1]).scale(t.k).translate(
	        typeof x === "function" ? -x.apply(this, arguments) : -x,
	        typeof y === "function" ? -y.apply(this, arguments) : -y
	      ), e, translateExtent);
	    }, p);
	  };

	  function scale(transform, k) {
	    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
	    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
	  }

	  function translate(transform, p0, p1) {
	    var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
	    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
	  }

	  function centroid(extent) {
	    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
	  }

	  function schedule(transition, transform, point) {
	    transition
	        .on("start.zoom", function() { gesture(this, arguments).start(); })
	        .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).end(); })
	        .tween("zoom", function() {
	          var that = this,
	              args = arguments,
	              g = gesture(that, args),
	              e = extent.apply(that, args),
	              p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
	              w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
	              a = that.__zoom,
	              b = typeof transform === "function" ? transform.apply(that, args) : transform,
	              i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
	          return function(t) {
	            if (t === 1) t = b; // Avoid rounding error on end.
	            else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
	            g.zoom(null, t);
	          };
	        });
	  }

	  function gesture(that, args, clean) {
	    return (!clean && that.__zooming) || new Gesture(that, args);
	  }

	  function Gesture(that, args) {
	    this.that = that;
	    this.args = args;
	    this.active = 0;
	    this.extent = extent.apply(that, args);
	    this.taps = 0;
	  }

	  Gesture.prototype = {
	    start: function() {
	      if (++this.active === 1) {
	        this.that.__zooming = this;
	        this.emit("start");
	      }
	      return this;
	    },
	    zoom: function(key, transform) {
	      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
	      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
	      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
	      this.that.__zoom = transform;
	      this.emit("zoom");
	      return this;
	    },
	    end: function() {
	      if (--this.active === 0) {
	        delete this.that.__zooming;
	        this.emit("end");
	      }
	      return this;
	    },
	    emit: function(type) {
	      customEvent(new ZoomEvent(zoom, type, this.that.__zoom), listeners.apply, listeners, [type, this.that, this.args]);
	    }
	  };

	  function wheeled() {
	    if (!filter.apply(this, arguments)) return;
	    var g = gesture(this, arguments),
	        t = this.__zoom,
	        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
	        p = mouse(this);

	    // If the mouse is in the same location as before, reuse it.
	    // If there were recent wheel events, reset the wheel idle timeout.
	    if (g.wheel) {
	      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
	        g.mouse[1] = t.invert(g.mouse[0] = p);
	      }
	      clearTimeout(g.wheel);
	    }

	    // If this wheel event won’t trigger a transform change, ignore it.
	    else if (t.k === k) return;

	    // Otherwise, capture the mouse point and location at the start.
	    else {
	      g.mouse = [p, t.invert(p)];
	      interrupt(this);
	      g.start();
	    }

	    noevent$1();
	    g.wheel = setTimeout(wheelidled, wheelDelay);
	    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

	    function wheelidled() {
	      g.wheel = null;
	      g.end();
	    }
	  }

	  function mousedowned() {
	    if (touchending || !filter.apply(this, arguments)) return;
	    var g = gesture(this, arguments, true),
	        v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
	        p = mouse(this),
	        x0 = event.clientX,
	        y0 = event.clientY;

	    dragDisable(event.view);
	    nopropagation();
	    g.mouse = [p, this.__zoom.invert(p)];
	    interrupt(this);
	    g.start();

	    function mousemoved() {
	      noevent$1();
	      if (!g.moved) {
	        var dx = event.clientX - x0, dy = event.clientY - y0;
	        g.moved = dx * dx + dy * dy > clickDistance2;
	      }
	      g.zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = mouse(g.that), g.mouse[1]), g.extent, translateExtent));
	    }

	    function mouseupped() {
	      v.on("mousemove.zoom mouseup.zoom", null);
	      yesdrag(event.view, g.moved);
	      noevent$1();
	      g.end();
	    }
	  }

	  function dblclicked() {
	    if (!filter.apply(this, arguments)) return;
	    var t0 = this.__zoom,
	        p0 = mouse(this),
	        p1 = t0.invert(p0),
	        k1 = t0.k * (event.shiftKey ? 0.5 : 2),
	        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, arguments), translateExtent);

	    noevent$1();
	    if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0);
	    else select(this).call(zoom.transform, t1);
	  }

	  function touchstarted() {
	    if (!filter.apply(this, arguments)) return;
	    var touches = event.touches,
	        n = touches.length,
	        g = gesture(this, arguments, event.changedTouches.length === n),
	        started, i, t, p;

	    nopropagation();
	    for (i = 0; i < n; ++i) {
	      t = touches[i], p = touch(this, touches, t.identifier);
	      p = [p, this.__zoom.invert(p), t.identifier];
	      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
	      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
	    }

	    if (touchstarting) touchstarting = clearTimeout(touchstarting);

	    if (started) {
	      if (g.taps < 2) touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
	      interrupt(this);
	      g.start();
	    }
	  }

	  function touchmoved() {
	    if (!this.__zooming) return;
	    var g = gesture(this, arguments),
	        touches = event.changedTouches,
	        n = touches.length, i, t, p, l;

	    noevent$1();
	    if (touchstarting) touchstarting = clearTimeout(touchstarting);
	    g.taps = 0;
	    for (i = 0; i < n; ++i) {
	      t = touches[i], p = touch(this, touches, t.identifier);
	      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
	      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
	    }
	    t = g.that.__zoom;
	    if (g.touch1) {
	      var p0 = g.touch0[0], l0 = g.touch0[1],
	          p1 = g.touch1[0], l1 = g.touch1[1],
	          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
	          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
	      t = scale(t, Math.sqrt(dp / dl));
	      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
	      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
	    }
	    else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
	    else return;
	    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
	  }

	  function touchended() {
	    if (!this.__zooming) return;
	    var g = gesture(this, arguments),
	        touches = event.changedTouches,
	        n = touches.length, i, t;

	    nopropagation();
	    if (touchending) clearTimeout(touchending);
	    touchending = setTimeout(function() { touchending = null; }, touchDelay);
	    for (i = 0; i < n; ++i) {
	      t = touches[i];
	      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
	      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
	    }
	    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
	    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
	    else {
	      g.end();
	      // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
	      if (g.taps === 2) {
	        var p = select(this).on("dblclick.zoom");
	        if (p) p.apply(this, arguments);
	      }
	    }
	  }

	  zoom.wheelDelta = function(_) {
	    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant$2(+_), zoom) : wheelDelta;
	  };

	  zoom.filter = function(_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$2(!!_), zoom) : filter;
	  };

	  zoom.touchable = function(_) {
	    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$2(!!_), zoom) : touchable;
	  };

	  zoom.extent = function(_) {
	    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$2([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
	  };

	  zoom.scaleExtent = function(_) {
	    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
	  };

	  zoom.translateExtent = function(_) {
	    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
	  };

	  zoom.constrain = function(_) {
	    return arguments.length ? (constrain = _, zoom) : constrain;
	  };

	  zoom.duration = function(_) {
	    return arguments.length ? (duration = +_, zoom) : duration;
	  };

	  zoom.interpolate = function(_) {
	    return arguments.length ? (interpolate = _, zoom) : interpolate;
	  };

	  zoom.on = function() {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? zoom : value;
	  };

	  zoom.clickDistance = function(_) {
	    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
	  };

	  return zoom;
	}

	// do not edit .js files directly - edit src/index.jst



	var fastDeepEqual = function equal(a, b) {
	  if (a === b) return true;

	  if (a && b && typeof a == 'object' && typeof b == 'object') {
	    if (a.constructor !== b.constructor) return false;

	    var length, i, keys;
	    if (Array.isArray(a)) {
	      length = a.length;
	      if (length != b.length) return false;
	      for (i = length; i-- !== 0;)
	        if (!equal(a[i], b[i])) return false;
	      return true;
	    }



	    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
	    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
	    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

	    keys = Object.keys(a);
	    length = keys.length;
	    if (length !== Object.keys(b).length) return false;

	    for (i = length; i-- !== 0;)
	      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

	    for (i = length; i-- !== 0;) {
	      var key = keys[i];
	      if (!equal(a[key], b[key])) return false;
	    }

	    return true;
	  }

	  // true if both NaN, false otherwise
	  return a!==a && b!==b;
	};

	var actions = {
	  setOnConnect: action(function (state, onConnect) {
	    state.onConnect = onConnect;
	  }),
	  setNodes: action(function (state, nodes) {
	    state.nodes = nodes;
	  }),
	  setEdges: action(function (state, edges) {
	    state.edges = edges;
	  }),
	  updateNodeData: action(function (state, _ref) {
	    var id = _ref.id,
	        data = _objectWithoutProperties(_ref, ["id"]);

	    state.nodes.forEach(function (n) {
	      if (n.id === id) {
	        n.__rg = _objectSpread2$1({}, n.__rg, {}, data);
	      }
	    });
	  }),
	  updateNodePos: action(function (state, _ref2) {
	    var id = _ref2.id,
	        pos = _ref2.pos;
	    state.nodes.forEach(function (n) {
	      if (n.id === id) {
	        n.__rg = _objectSpread2$1({}, n.__rg, {
	          position: pos
	        });
	      }
	    });
	  }),
	  setSelection: action(function (state, isActive) {
	    state.selectionActive = isActive;
	  }),
	  setNodesSelection: action(function (state, _ref3) {
	    var isActive = _ref3.isActive,
	        selection = _ref3.selection;

	    if (!isActive) {
	      state.nodesSelectionActive = false;
	      state.selectedElements = [];
	      return;
	    }

	    var selectedNodes = getNodesInside(state.nodes, selection, state.transform);
	    var selectedNodesBbox = getBoundingBox(selectedNodes);
	    state.selection = selection;
	    state.nodesSelectionActive = true;
	    state.selectedNodesBbox = selectedNodesBbox;
	    state.nodesSelectionActive = true;
	  }),
	  setSelectedElements: action(function (state, elements) {
	    var selectedElementsArr = Array.isArray(elements) ? elements : [elements];
	    var selectedElementsUpdated = !fastDeepEqual(selectedElementsArr, state.selectedElements);
	    var selectedElements = selectedElementsUpdated ? selectedElementsArr : state.selectedElements;
	    state.selectedElements = selectedElements;
	  }),
	  updateSelection: action(function (state, selection) {
	    var selectedNodes = getNodesInside(state.nodes, selection, state.transform);
	    var selectedEdges = getConnectedEdges(selectedNodes, state.edges);
	    var nextSelectedElements = [].concat(_toConsumableArray(selectedNodes), _toConsumableArray(selectedEdges));
	    var selectedElementsUpdated = !fastDeepEqual(nextSelectedElements, state.selectedElements);
	    state.selection = selection;
	    state.selectedElements = selectedElementsUpdated ? nextSelectedElements : state.selectedElements;
	  }),
	  updateTransform: action(function (state, transform) {
	    state.transform = [transform.x, transform.y, transform.k];
	  }),
	  updateSize: action(function (state, size) {
	    state.width = size.width;
	    state.height = size.height;
	  }),
	  initD3: action(function (state, _ref4) {
	    var zoom = _ref4.zoom,
	        selection = _ref4.selection;
	    state.d3Zoom = zoom;
	    state.d3Selection = selection;
	    state.d3Initialised = true;
	  }),
	  setConnectionPosition: action(function (state, position) {
	    state.connectionPosition = position;
	  }),
	  setConnectionSourceId: action(function (state, sourceId) {
	    state.connectionSourceId = sourceId;
	  })
	};

	var store = createStore$1(_objectSpread2$1({
	  width: 0,
	  height: 0,
	  transform: [0, 0, 1],
	  nodes: [],
	  edges: [],
	  selectedElements: [],
	  selectedNodesBbox: {
	    x: 0,
	    y: 0,
	    width: 0,
	    height: 0
	  },
	  d3Zoom: null,
	  d3Selection: null,
	  d3Initialised: false,
	  nodesSelectionActive: false,
	  selectionActive: false,
	  selection: {},
	  connectionSourceId: null,
	  connectionPosition: {
	    x: 0,
	    y: 0
	  },
	  onConnect: function onConnect() {}
	}, actions));

	var isFunction = function isFunction(obj) {
	  return !!(obj && obj.constructor && obj.call && obj.apply);
	};
	var isDefined = function isDefined(obj) {
	  return typeof obj !== 'undefined';
	};
	var inInputDOMNode = function inInputDOMNode(e) {
	  return e && e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);
	};
	var getDimensions = function getDimensions() {
	  var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  return {
	    width: node.offsetWidth,
	    height: node.offsetHeight
	  };
	};

	var isEdge = function isEdge(element) {
	  return element.source && element.target;
	};
	var isNode = function isNode(element) {
	  return !element.source && !element.target;
	};
	var getOutgoers = function getOutgoers(node, elements) {
	  if (!isNode(node)) {
	    return [];
	  }

	  var outgoerIds = elements.filter(function (e) {
	    return e.source === node.id;
	  }).map(function (e) {
	    return e.target;
	  });
	  return elements.filter(function (e) {
	    return outgoerIds.includes(e.id);
	  });
	};
	var removeElements = function removeElements(elementsToRemove, elements) {
	  var nodeIdsToRemove = elementsToRemove.map(function (n) {
	    return n.id;
	  });
	  return elements.filter(function (e) {
	    return !nodeIdsToRemove.includes(e.id) && !nodeIdsToRemove.includes(e.target) && !nodeIdsToRemove.includes(e.source);
	  });
	};

	function getEdgeId(params) {
	  return "reactflow__edge-".concat(params.source, "-").concat(params.target);
	}

	var addEdge = function addEdge(edgeParams, elements) {
	  if (!edgeParams.source || !edgeParams.target) {
	    throw new Error('Can not create edge. An edge needs a source and a target');
	  }

	  return elements.concat(_objectSpread2$1({}, edgeParams, {
	    id: isDefined(edgeParams.id) ? edgeParams.id : getEdgeId(edgeParams)
	  }));
	};

	var pointToRendererPoint = function pointToRendererPoint(_ref, transform) {
	  var x = _ref.x,
	      y = _ref.y;
	  var rendererX = (x - transform[0]) * (1 / [transform[2]]);
	  var rendererY = (y - transform[1]) * (1 / [transform[2]]);
	  return {
	    x: rendererX,
	    y: rendererY
	  };
	};

	var parseElement = function parseElement(e, transform) {
	  if (!e.id) {
	    throw new Error('All elements (nodes and edges) need to have an id.');
	  }

	  if (isEdge(e)) {
	    return _objectSpread2$1({}, e, {
	      id: e.id.toString(),
	      type: e.type || 'default'
	    });
	  }

	  return _objectSpread2$1({}, e, {
	    id: e.id.toString(),
	    type: e.type || 'default',
	    __rg: {
	      position: pointToRendererPoint(e.position, transform),
	      width: null,
	      height: null,
	      handleBounds: {}
	    }
	  });
	};
	var getBoundingBox = function getBoundingBox(nodes) {
	  var bbox = nodes.reduce(function (res, node) {
	    var position = node.__rg.position;
	    var x2 = position.x + node.__rg.width;
	    var y2 = position.y + node.__rg.height;

	    if (position.x < res.minX) {
	      res.minX = position.x;
	    }

	    if (x2 > res.maxX) {
	      res.maxX = x2;
	    }

	    if (position.y < res.minY) {
	      res.minY = position.y;
	    }

	    if (y2 > res.maxY) {
	      res.maxY = y2;
	    }

	    return res;
	  }, {
	    minX: Number.MAX_VALUE,
	    minY: Number.MAX_VALUE,
	    maxX: 0,
	    maxY: 0
	  });
	  return {
	    x: bbox.minX,
	    y: bbox.minY,
	    width: bbox.maxX - bbox.minX,
	    height: bbox.maxY - bbox.minY
	  };
	};
	var getNodesInside = function getNodesInside(nodes, bbox) {
	  var transform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 1];
	  var partially = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	  return nodes.filter(function (n) {
	    var bboxPos = {
	      x: (bbox.x - transform[0]) * (1 / transform[2]),
	      y: (bbox.y - transform[1]) * (1 / transform[2])
	    };
	    var bboxWidth = bbox.width * (1 / transform[2]);
	    var bboxHeight = bbox.height * (1 / transform[2]);
	    var _n$__rg = n.__rg,
	        position = _n$__rg.position,
	        width = _n$__rg.width,
	        height = _n$__rg.height;
	    var nodeWidth = partially ? -width : width;
	    var nodeHeight = partially ? 0 : height;
	    var offsetX = partially ? width : 0;
	    var offsetY = partially ? height : 0;
	    return position.x + offsetX > bboxPos.x && position.x + nodeWidth < bboxPos.x + bboxWidth && position.y + offsetY > bboxPos.y && position.y + nodeHeight < bboxPos.y + bboxHeight;
	  });
	};
	var getConnectedEdges = function getConnectedEdges(nodes, edges) {
	  var nodeIds = nodes.map(function (n) {
	    return n.id;
	  });
	  return edges.filter(function (e) {
	    var hasSourceHandleId = e.source.includes('__');
	    var hasTargetHandleId = e.target.includes('__');
	    var sourceId = hasSourceHandleId ? e.source.split('__')[0] : e.source;
	    var targetId = hasTargetHandleId ? e.target.split('__')[0] : e.target;
	    return nodeIds.includes(sourceId) || nodeIds.includes(targetId);
	  });
	};
	var fitView = function fitView() {
	  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	      _ref2$padding = _ref2.padding,
	      padding = _ref2$padding === void 0 ? 0 : _ref2$padding;

	  var state = store.getState();
	  var bounds = getBoundingBox(state.nodes);
	  var maxBoundsSize = Math.max(bounds.width, bounds.height);
	  var k = Math.min(state.width, state.height) / (maxBoundsSize + maxBoundsSize * padding);
	  var boundsCenterX = bounds.x + bounds.width / 2;
	  var boundsCenterY = bounds.y + bounds.height / 2;
	  var transform = [state.width / 2 - boundsCenterX * k, state.height / 2 - boundsCenterY * k];
	  var fittedTransform = identity$1.translate(transform[0], transform[1]).scale(k);
	  state.d3Selection.call(state.d3Zoom.transform, fittedTransform);
	};
	var zoomIn = function zoomIn() {
	  var state = store.getState();
	  state.d3Zoom.scaleTo(state.d3Selection, state.transform[2] + 0.2);
	};
	var zoomOut = function zoomOut() {
	  var state = store.getState();
	  state.d3Zoom.scaleTo(state.d3Selection, state.transform[2] - 0.2);
	};

	function renderNode(d, props, state) {
	  var nodeType = d.type || 'default';

	  if (!props.nodeTypes[nodeType]) {
	    console.warn("No node type found for type \"".concat(nodeType, "\". Using fallback type \"default\"."));
	  }

	  var NodeComponent = props.nodeTypes[nodeType] || props.nodeTypes["default"];
	  var selected = state.selectedElements.filter(isNode).map(function (e) {
	    return e.id;
	  }).includes(d.id);
	  return React__default.createElement(NodeComponent, {
	    key: d.id,
	    id: d.id,
	    type: d.type,
	    data: d.data,
	    xPos: d.__rg.position.x,
	    yPos: d.__rg.position.y,
	    onClick: props.onElementClick,
	    onNodeDragStop: props.onNodeDragStop,
	    transform: state.transform,
	    selected: selected,
	    style: d.style
	  });
	}

	var NodeRenderer = React.memo(function (props) {
	  var state = useStoreState(function (s) {
	    return {
	      nodes: s.nodes,
	      transform: s.transform,
	      selectedElements: s.selectedElements
	    };
	  });
	  var transform = state.transform,
	      nodes = state.nodes;
	  var transformStyle = {
	    transform: "translate(".concat(transform[0], "px,").concat(transform[1], "px) scale(").concat(transform[2], ")")
	  };
	  return React__default.createElement("div", {
	    className: "react-flow__nodes",
	    style: transformStyle
	  }, nodes.map(function (d) {
	    return renderNode(d, props, state);
	  }));
	});
	NodeRenderer.displayName = 'NodeRenderer';
	NodeRenderer.whyDidYouRender = false;

	var classnames = createCommonjsModule(function (module) {
	/*!
	  Copyright (c) 2017 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg) && arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if ( module.exports) {
			classNames.default = classNames;
			module.exports = classNames;
		} else {
			window.classNames = classNames;
		}
	}());
	});

	var ConnectionLine = (function (props) {
	  var _useState = React.useState(null),
	      _useState2 = _slicedToArray(_useState, 2),
	      sourceNode = _useState2[0],
	      setSourceNode = _useState2[1];

	  var hasHandleId = props.connectionSourceId.includes('__');
	  var sourceIdSplitted = props.connectionSourceId.split('__');
	  var nodeId = sourceIdSplitted[0];
	  var handleId = hasHandleId ? sourceIdSplitted[1] : null;
	  React.useEffect(function () {
	    setSourceNode(props.nodes.find(function (n) {
	      return n.id === nodeId;
	    }));
	  }, []);

	  if (!sourceNode) {
	    return null;
	  }

	  var style = props.connectionLineStyle || {};
	  var className = classnames('react-flow__edge', 'connection', props.className);
	  var sourceHandle = handleId ? sourceNode.__rg.handleBounds.source.find(function (d) {
	    return d.id === handleId;
	  }) : sourceNode.__rg.handleBounds.source[0];
	  var sourceHandleX = sourceHandle ? sourceHandle.x + sourceHandle.width / 2 : sourceNode.__rg.width / 2;
	  var sourceHandleY = sourceHandle ? sourceHandle.y + sourceHandle.height / 2 : sourceNode.__rg.height;
	  var sourceX = sourceNode.__rg.position.x + sourceHandleX;
	  var sourceY = sourceNode.__rg.position.y + sourceHandleY;
	  var targetX = (props.connectionPositionX - props.transform[0]) * (1 / props.transform[2]);
	  var targetY = (props.connectionPositionY - props.transform[1]) * (1 / props.transform[2]);
	  var dAttr = '';

	  if (props.connectionLineType === 'bezier') {
	    var yOffset = Math.abs(targetY - sourceY) / 2;
	    var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
	    dAttr = "M".concat(sourceX, ",").concat(sourceY, " C").concat(sourceX, ",").concat(centerY, " ").concat(targetX, ",").concat(centerY, " ").concat(targetX, ",").concat(targetY);
	  } else {
	    dAttr = "M".concat(sourceX, ",").concat(sourceY, " ").concat(targetX, ",").concat(targetY);
	  }

	  return React__default.createElement("g", {
	    className: className
	  }, React__default.createElement("path", _extends$1({
	    d: dAttr
	  }, style)));
	});

	function getHandlePosition(position, node) {
	  var handle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	  if (!handle) {
	    switch (position) {
	      case 'top':
	        return {
	          x: node.__rg.width / 2,
	          y: 0
	        };

	      case 'right':
	        return {
	          x: node.__rg.width,
	          y: node.__rg.height / 2
	        };

	      case 'bottom':
	        return {
	          x: node.__rg.width / 2,
	          y: node.__rg.height
	        };

	      case 'left':
	        return {
	          x: 0,
	          y: node.__rg.height / 2
	        };
	    }
	  }

	  switch (position) {
	    case 'top':
	      return {
	        x: handle.x + handle.width / 2,
	        y: handle.y
	      };

	    case 'right':
	      return {
	        x: handle.x + handle.width,
	        y: handle.y + handle.height / 2
	      };

	    case 'bottom':
	      return {
	        x: handle.x + handle.width / 2,
	        y: handle.y + handle.height
	      };

	    case 'left':
	      return {
	        x: handle.x,
	        y: handle.y + handle.height / 2
	      };
	  }
	}

	function getHandle(bounds, handleId) {
	  var handle = null;

	  if (!bounds) {
	    return null;
	  } // there is no handleId when there are no multiple handles/ handles with ids
	  // so we just pick the first one


	  if (bounds.length === 1 || !handleId) {
	    handle = bounds[0];
	  } else if (handleId) {
	    handle = bounds.find(function (d) {
	      return d.id === handleId;
	    });
	  }

	  return handle;
	}

	function getEdgePositions(_ref) {
	  var sourceNode = _ref.sourceNode,
	      sourceHandle = _ref.sourceHandle,
	      sourcePosition = _ref.sourcePosition,
	      targetNode = _ref.targetNode,
	      targetHandle = _ref.targetHandle,
	      targetPosition = _ref.targetPosition;
	  var sourceHandlePos = getHandlePosition(sourcePosition, sourceNode, sourceHandle);
	  var sourceX = sourceNode.__rg.position.x + sourceHandlePos.x;
	  var sourceY = sourceNode.__rg.position.y + sourceHandlePos.y;
	  var targetHandlePos = getHandlePosition(targetPosition, targetNode, targetHandle);
	  var targetX = targetNode.__rg.position.x + targetHandlePos.x;
	  var targetY = targetNode.__rg.position.y + targetHandlePos.y;
	  return {
	    sourceX: sourceX,
	    sourceY: sourceY,
	    targetX: targetX,
	    targetY: targetY
	  };
	}

	function renderEdge(e, props, state) {
	  var edgeType = e.type || 'default';
	  var hasSourceHandleId = e.source.includes('__');
	  var hasTargetHandleId = e.target.includes('__');
	  var sourceId = hasSourceHandleId ? e.source.split('__')[0] : e.source;
	  var targetId = hasTargetHandleId ? e.target.split('__')[0] : e.target;
	  var sourceHandleId = hasSourceHandleId ? e.source.split('__')[1] : null;
	  var targetHandleId = hasTargetHandleId ? e.target.split('__')[1] : null;
	  var sourceNode = state.nodes.find(function (n) {
	    return n.id === sourceId;
	  });
	  var targetNode = state.nodes.find(function (n) {
	    return n.id === targetId;
	  });

	  if (!sourceNode) {
	    throw new Error("couldn't create edge for source id: ".concat(sourceId));
	  }

	  if (!targetNode) {
	    throw new Error("couldn't create edge for target id: ".concat(targetId));
	  }

	  var EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes["default"];
	  var sourceHandle = getHandle(sourceNode.__rg.handleBounds.source, sourceHandleId);
	  var targetHandle = getHandle(targetNode.__rg.handleBounds.target, targetHandleId);
	  var sourcePosition = sourceHandle ? sourceHandle.position : 'bottom';
	  var targetPosition = targetHandle ? targetHandle.position : 'top';

	  var _getEdgePositions = getEdgePositions({
	    sourceNode: sourceNode,
	    sourceHandle: sourceHandle,
	    sourcePosition: sourcePosition,
	    targetNode: targetNode,
	    targetHandle: targetHandle,
	    targetPosition: targetPosition
	  }),
	      sourceX = _getEdgePositions.sourceX,
	      sourceY = _getEdgePositions.sourceY,
	      targetX = _getEdgePositions.targetX,
	      targetY = _getEdgePositions.targetY;

	  var selected = state.selectedElements.filter(isEdge).find(function (elm) {
	    return elm.source === sourceId && elm.target === targetId;
	  });
	  return React__default.createElement(EdgeComponent, {
	    key: e.id,
	    id: e.id,
	    type: e.type,
	    onClick: props.onElementClick,
	    selected: selected,
	    animated: e.animated,
	    style: e.style,
	    source: sourceId,
	    target: targetId,
	    sourceHandleId: sourceHandleId,
	    targetHandleId: targetHandleId,
	    sourceX: sourceX,
	    sourceY: sourceY,
	    targetX: targetX,
	    targetY: targetY,
	    sourcePosition: sourcePosition,
	    targetPosition: targetPosition
	  });
	}

	var EdgeRenderer = React.memo(function (props) {
	  var state = useStoreState(function (s) {
	    return {
	      nodes: s.nodes,
	      edges: s.edges,
	      transform: s.transform,
	      selectedElements: s.selectedElements,
	      connectionSourceId: s.connectionSourceId,
	      position: s.connectionPosition
	    };
	  });
	  var width = props.width,
	      height = props.height,
	      connectionLineStyle = props.connectionLineStyle,
	      connectionLineType = props.connectionLineType;

	  if (!width) {
	    return null;
	  }

	  var transform = state.transform,
	      edges = state.edges,
	      nodes = state.nodes,
	      connectionSourceId = state.connectionSourceId,
	      position = state.position;
	  var transformStyle = "translate(".concat(transform[0], ",").concat(transform[1], ") scale(").concat(transform[2], ")");
	  return React__default.createElement("svg", {
	    width: width,
	    height: height,
	    className: "react-flow__edges"
	  }, React__default.createElement("g", {
	    transform: transformStyle
	  }, edges.map(function (e) {
	    return renderEdge(e, props, state);
	  }), connectionSourceId && React__default.createElement(ConnectionLine, {
	    nodes: nodes,
	    connectionSourceId: connectionSourceId,
	    connectionPositionX: position.x,
	    connectionPositionY: position.y,
	    transform: transform,
	    connectionLineStyle: connectionLineStyle,
	    connectionLineType: connectionLineType
	  })));
	});
	EdgeRenderer.displayName = 'EdgeRenderer';

	var baseStyles = {
	  position: 'absolute',
	  top: 0,
	  left: 0
	};
	var Grid = React.memo(function (_ref) {
	  var gap = _ref.gap,
	      strokeColor = _ref.strokeColor,
	      strokeWidth = _ref.strokeWidth,
	      style = _ref.style,
	      className = _ref.className;

	  var _useStoreState = useStoreState(function (s) {
	    return s;
	  }),
	      width = _useStoreState.width,
	      height = _useStoreState.height,
	      _useStoreState$transf = _slicedToArray(_useStoreState.transform, 3),
	      x = _useStoreState$transf[0],
	      y = _useStoreState$transf[1],
	      scale = _useStoreState$transf[2];

	  var gridClasses = classnames('react-flow__grid', className);
	  var scaledGap = gap * scale;
	  var xStart = x % scaledGap;
	  var yStart = y % scaledGap;
	  var lineCountX = Math.ceil(width / scaledGap) + 1;
	  var lineCountY = Math.ceil(height / scaledGap) + 1;
	  var xValues = Array.from({
	    length: lineCountX
	  }, function (_, index) {
	    return "M".concat(index * scaledGap + xStart, " 0 V").concat(height);
	  });
	  var yValues = Array.from({
	    length: lineCountY
	  }, function (_, index) {
	    return "M0 ".concat(index * scaledGap + yStart, " H").concat(width);
	  });
	  var path = [].concat(_toConsumableArray(xValues), _toConsumableArray(yValues)).join(' ');
	  return React__default.createElement("svg", {
	    width: width,
	    height: height,
	    style: _objectSpread2$1({}, baseStyles, {}, style),
	    className: gridClasses
	  }, React__default.createElement("path", {
	    fill: "none",
	    stroke: strokeColor,
	    strokeWidth: strokeWidth,
	    d: path
	  }));
	});
	Grid.displayName = 'Grid';
	Grid.propTypes = {
	  gap: propTypes.number,
	  strokeColor: propTypes.string,
	  strokeWidth: propTypes.number,
	  style: propTypes.object,
	  className: propTypes.string
	};
	Grid.defaultProps = {
	  gap: 24,
	  strokeColor: '#999',
	  strokeWidth: 0.1,
	  style: {},
	  className: null
	};

	var bgComponents = {
	  grid: Grid
	};
	var BackgroundRenderer = React.memo(function (_ref) {
	  var backgroundType = _ref.backgroundType,
	      rest = _objectWithoutProperties(_ref, ["backgroundType"]);

	  var BackgroundComponent = bgComponents[backgroundType];
	  return React__default.createElement(BackgroundComponent, rest);
	});
	BackgroundRenderer.displayName = 'BackgroundRenderer';
	BackgroundRenderer.propTypes = {
	  backgroundType: propTypes.oneOf(['grid'])
	};
	BackgroundRenderer.defaultProps = {
	  backgroundType: 'grid'
	};

	var initialRect = {
	  startX: 0,
	  startY: 0,
	  x: 0,
	  y: 0,
	  width: 0,
	  height: 0,
	  draw: false
	};

	function getMousePosition(evt) {
	  var containerBounds = document.querySelector('.react-flow').getBoundingClientRect();
	  return {
	    x: evt.clientX - containerBounds.left,
	    y: evt.clientY - containerBounds.top
	  };
	}

	var UserSelection = React.memo(function () {
	  var selectionPane = React.useRef(null);

	  var _useState = React.useState(initialRect),
	      _useState2 = _slicedToArray(_useState, 2),
	      rect = _useState2[0],
	      setRect = _useState2[1];

	  var setSelection = useStoreActions(function (a) {
	    return a.setSelection;
	  });
	  var updateSelection = useStoreActions(function (a) {
	    return a.updateSelection;
	  });
	  var setNodesSelection = useStoreActions(function (a) {
	    return a.setNodesSelection;
	  });
	  React.useEffect(function () {
	    function onMouseDown(evt) {
	      var mousePos = getMousePosition(evt);
	      setRect(function (currentRect) {
	        return _objectSpread2$1({}, currentRect, {
	          startX: mousePos.x,
	          startY: mousePos.y,
	          x: mousePos.x,
	          y: mousePos.y,
	          draw: true
	        });
	      });
	      setSelection(true);
	    }

	    function onMouseMove(evt) {
	      setRect(function (currentRect) {
	        if (!currentRect.draw) {
	          return currentRect;
	        }

	        var mousePos = getMousePosition(evt);
	        var negativeX = mousePos.x < currentRect.startX;
	        var negativeY = mousePos.y < currentRect.startY;

	        var nextRect = _objectSpread2$1({}, currentRect, {
	          x: negativeX ? mousePos.x : currentRect.x,
	          y: negativeY ? mousePos.y : currentRect.y,
	          width: negativeX ? currentRect.startX - mousePos.x : mousePos.x - currentRect.startX,
	          height: negativeY ? currentRect.startY - mousePos.y : mousePos.y - currentRect.startY
	        });

	        updateSelection(nextRect);
	        return nextRect;
	      });
	    }

	    function onMouseUp() {
	      setRect(function (currentRect) {
	        setNodesSelection({
	          isActive: true,
	          selection: currentRect
	        });
	        setSelection(false);
	        return _objectSpread2$1({}, currentRect, {
	          draw: false
	        });
	      });
	    }

	    selectionPane.current.addEventListener('mousedown', onMouseDown);
	    selectionPane.current.addEventListener('mousemove', onMouseMove);
	    selectionPane.current.addEventListener('mouseup', onMouseUp);
	    return function () {
	      selectionPane.current.removeEventListener('mousedown', onMouseDown);
	      selectionPane.current.removeEventListener('mousemove', onMouseMove);
	      selectionPane.current.removeEventListener('mouseup', onMouseUp);
	    };
	  }, []);
	  return React__default.createElement("div", {
	    className: "react-flow__selectionpane",
	    ref: selectionPane
	  }, (rect.draw || rect.fixed) && React__default.createElement("div", {
	    className: "react-flow__selection",
	    style: {
	      width: rect.width,
	      height: rect.height,
	      transform: "translate(".concat(rect.x, "px, ").concat(rect.y, "px)")
	    }
	  }));
	});

	var scheduler_production_min = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports,"__esModule",{value:!0});var f,g,h,k,l;
	if("undefined"===typeof window||"function"!==typeof MessageChannel){var p=null,q=null,t=function(){if(null!==p)try{var a=exports.unstable_now();p(!0,a);p=null;}catch(b){throw setTimeout(t,0),b;}},u=Date.now();exports.unstable_now=function(){return Date.now()-u};f=function(a){null!==p?setTimeout(f,0,a):(p=a,setTimeout(t,0));};g=function(a,b){q=setTimeout(a,b);};h=function(){clearTimeout(q);};k=function(){return !1};l=exports.unstable_forceFrameRate=function(){};}else{var w=window.performance,x=window.Date,
	y=window.setTimeout,z=window.clearTimeout,A=window.requestAnimationFrame,B=window.cancelAnimationFrame;"undefined"!==typeof console&&("function"!==typeof A&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"),"function"!==typeof B&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"));if("object"===typeof w&&
	"function"===typeof w.now)exports.unstable_now=function(){return w.now()};else{var C=x.now();exports.unstable_now=function(){return x.now()-C};}var D=!1,E=null,F=-1,G=5,H=0;k=function(){return exports.unstable_now()>=H};l=function(){};exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing framerates higher than 125 fps is not unsupported"):G=0<a?Math.floor(1E3/a):33.33;};var I=new MessageChannel,J=I.port2;I.port1.onmessage=
	function(){if(null!==E){var a=exports.unstable_now();H=a+G;try{E(!0,a)?J.postMessage(null):(D=!1,E=null);}catch(b){throw J.postMessage(null),b;}}else D=!1;};f=function(a){E=a;D||(D=!0,J.postMessage(null));};g=function(a,b){F=y(function(){a(exports.unstable_now());},b);};h=function(){z(F);F=-1;};}function K(a,b){var c=a.length;a.push(b);a:for(;;){var d=Math.floor((c-1)/2),e=a[d];if(void 0!==e&&0<L(e,b))a[d]=b,a[c]=e,c=d;else break a}}function M(a){a=a[0];return void 0===a?null:a}
	function N(a){var b=a[0];if(void 0!==b){var c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length;d<e;){var m=2*(d+1)-1,n=a[m],v=m+1,r=a[v];if(void 0!==n&&0>L(n,c))void 0!==r&&0>L(r,n)?(a[d]=r,a[v]=c,d=v):(a[d]=n,a[m]=c,d=m);else if(void 0!==r&&0>L(r,c))a[d]=r,a[v]=c,d=v;else break a}}return b}return null}function L(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}var O=[],P=[],Q=1,R=null,S=3,T=!1,U=!1,V=!1;
	function W(a){for(var b=M(P);null!==b;){if(null===b.callback)N(P);else if(b.startTime<=a)N(P),b.sortIndex=b.expirationTime,K(O,b);else break;b=M(P);}}function X(a){V=!1;W(a);if(!U)if(null!==M(O))U=!0,f(Y);else{var b=M(P);null!==b&&g(X,b.startTime-a);}}
	function Y(a,b){U=!1;V&&(V=!1,h());T=!0;var c=S;try{W(b);for(R=M(O);null!==R&&(!(R.expirationTime>b)||a&&!k());){var d=R.callback;if(null!==d){R.callback=null;S=R.priorityLevel;var e=d(R.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?R.callback=e:R===M(O)&&N(O);W(b);}else N(O);R=M(O);}if(null!==R)var m=!0;else{var n=M(P);null!==n&&g(X,n.startTime-b);m=!1;}return m}finally{R=null,S=c,T=!1;}}
	function Z(a){switch(a){case 1:return -1;case 2:return 250;case 5:return 1073741823;case 4:return 1E4;default:return 5E3}}var aa=l;exports.unstable_ImmediatePriority=1;exports.unstable_UserBlockingPriority=2;exports.unstable_NormalPriority=3;exports.unstable_IdlePriority=5;exports.unstable_LowPriority=4;exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3;}var c=S;S=a;try{return b()}finally{S=c;}};
	exports.unstable_next=function(a){switch(S){case 1:case 2:case 3:var b=3;break;default:b=S;}var c=S;S=b;try{return a()}finally{S=c;}};
	exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();if("object"===typeof c&&null!==c){var e=c.delay;e="number"===typeof e&&0<e?d+e:d;c="number"===typeof c.timeout?c.timeout:Z(a);}else c=Z(a),e=d;c=e+c;a={id:Q++,callback:b,priorityLevel:a,startTime:e,expirationTime:c,sortIndex:-1};e>d?(a.sortIndex=e,K(P,a),null===M(O)&&a===M(P)&&(V?h():V=!0,g(X,e-d))):(a.sortIndex=c,K(O,a),U||T||(U=!0,f(Y)));return a};exports.unstable_cancelCallback=function(a){a.callback=null;};
	exports.unstable_wrapCallback=function(a){var b=S;return function(){var c=S;S=b;try{return a.apply(this,arguments)}finally{S=c;}}};exports.unstable_getCurrentPriorityLevel=function(){return S};exports.unstable_shouldYield=function(){var a=exports.unstable_now();W(a);var b=M(O);return b!==R&&null!==R&&null!==b&&null!==b.callback&&b.startTime<=a&&b.expirationTime<R.expirationTime||k()};exports.unstable_requestPaint=aa;exports.unstable_continueExecution=function(){U||T||(U=!0,f(Y));};
	exports.unstable_pauseExecution=function(){};exports.unstable_getFirstCallbackNode=function(){return M(O)};exports.unstable_Profiling=null;
	});

	unwrapExports(scheduler_production_min);
	var scheduler_production_min_1 = scheduler_production_min.unstable_now;
	var scheduler_production_min_2 = scheduler_production_min.unstable_forceFrameRate;
	var scheduler_production_min_3 = scheduler_production_min.unstable_ImmediatePriority;
	var scheduler_production_min_4 = scheduler_production_min.unstable_UserBlockingPriority;
	var scheduler_production_min_5 = scheduler_production_min.unstable_NormalPriority;
	var scheduler_production_min_6 = scheduler_production_min.unstable_IdlePriority;
	var scheduler_production_min_7 = scheduler_production_min.unstable_LowPriority;
	var scheduler_production_min_8 = scheduler_production_min.unstable_runWithPriority;
	var scheduler_production_min_9 = scheduler_production_min.unstable_next;
	var scheduler_production_min_10 = scheduler_production_min.unstable_scheduleCallback;
	var scheduler_production_min_11 = scheduler_production_min.unstable_cancelCallback;
	var scheduler_production_min_12 = scheduler_production_min.unstable_wrapCallback;
	var scheduler_production_min_13 = scheduler_production_min.unstable_getCurrentPriorityLevel;
	var scheduler_production_min_14 = scheduler_production_min.unstable_shouldYield;
	var scheduler_production_min_15 = scheduler_production_min.unstable_requestPaint;
	var scheduler_production_min_16 = scheduler_production_min.unstable_continueExecution;
	var scheduler_production_min_17 = scheduler_production_min.unstable_pauseExecution;
	var scheduler_production_min_18 = scheduler_production_min.unstable_getFirstCallbackNode;
	var scheduler_production_min_19 = scheduler_production_min.unstable_Profiling;

	var scheduler_development = createCommonjsModule(function (module, exports) {
	});

	unwrapExports(scheduler_development);
	var scheduler_development_1 = scheduler_development.unstable_now;
	var scheduler_development_2 = scheduler_development.unstable_forceFrameRate;
	var scheduler_development_3 = scheduler_development.unstable_ImmediatePriority;
	var scheduler_development_4 = scheduler_development.unstable_UserBlockingPriority;
	var scheduler_development_5 = scheduler_development.unstable_NormalPriority;
	var scheduler_development_6 = scheduler_development.unstable_IdlePriority;
	var scheduler_development_7 = scheduler_development.unstable_LowPriority;
	var scheduler_development_8 = scheduler_development.unstable_runWithPriority;
	var scheduler_development_9 = scheduler_development.unstable_next;
	var scheduler_development_10 = scheduler_development.unstable_scheduleCallback;
	var scheduler_development_11 = scheduler_development.unstable_cancelCallback;
	var scheduler_development_12 = scheduler_development.unstable_wrapCallback;
	var scheduler_development_13 = scheduler_development.unstable_getCurrentPriorityLevel;
	var scheduler_development_14 = scheduler_development.unstable_shouldYield;
	var scheduler_development_15 = scheduler_development.unstable_requestPaint;
	var scheduler_development_16 = scheduler_development.unstable_continueExecution;
	var scheduler_development_17 = scheduler_development.unstable_pauseExecution;
	var scheduler_development_18 = scheduler_development.unstable_getFirstCallbackNode;
	var scheduler_development_19 = scheduler_development.unstable_Profiling;

	var scheduler = createCommonjsModule(function (module) {

	{
	  module.exports = scheduler_production_min;
	}
	});

	function t(a){for(var b=a.message,c="https://reactjs.org/docs/error-decoder.html?invariant="+b,d=1;d<arguments.length;d++)c+="&args[]="+encodeURIComponent(arguments[d]);a.message="Minified React error #"+b+"; visit "+c+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ";return a}if(!React__default)throw t(Error(227));var ba=null,ca={};
	function da(){if(ba)for(var a in ca){var b=ca[a],c=ba.indexOf(a);if(!(-1<c))throw t(Error(96),a);if(!ea[c]){if(!b.extractEvents)throw t(Error(97),a);ea[c]=b;c=b.eventTypes;for(var d in c){var e=void 0;var f=c[d],g=b,h=d;if(fa.hasOwnProperty(h))throw t(Error(99),h);fa[h]=f;var k=f.phasedRegistrationNames;if(k){for(e in k)k.hasOwnProperty(e)&&ha(k[e],g,h);e=!0;}else f.registrationName?(ha(f.registrationName,g,h),e=!0):e=!1;if(!e)throw t(Error(98),d,a);}}}}
	function ha(a,b,c){if(ia[a])throw t(Error(100),a);ia[a]=b;ja[a]=b.eventTypes[c].dependencies;}var ea=[],fa={},ia={},ja={};function ka(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(m){this.onError(m);}}var la=!1,ma=null,na=!1,oa=null,pa={onError:function(a){la=!0;ma=a;}};function qa(a,b,c,d,e,f,g,h,k){la=!1;ma=null;ka.apply(pa,arguments);}
	function ra(a,b,c,d,e,f,g,h,k){qa.apply(this,arguments);if(la){if(la){var l=ma;la=!1;ma=null;}else throw t(Error(198));na||(na=!0,oa=l);}}var sa=null,ta=null,ua=null;function va(a,b,c){var d=a.type||"unknown-event";a.currentTarget=ua(c);ra(d,b,void 0,a);a.currentTarget=null;}function wa(a,b){if(null==b)throw t(Error(30));if(null==a)return b;if(Array.isArray(a)){if(Array.isArray(b))return a.push.apply(a,b),a;a.push(b);return a}return Array.isArray(b)?[a].concat(b):[a,b]}
	function xa(a,b,c){Array.isArray(a)?a.forEach(b,c):a&&b.call(c,a);}var ya=null;function za(a){if(a){var b=a._dispatchListeners,c=a._dispatchInstances;if(Array.isArray(b))for(var d=0;d<b.length&&!a.isPropagationStopped();d++)va(a,b[d],c[d]);else b&&va(a,b,c);a._dispatchListeners=null;a._dispatchInstances=null;a.isPersistent()||a.constructor.release(a);}}function Aa(a){null!==a&&(ya=wa(ya,a));a=ya;ya=null;if(a){xa(a,za);if(ya)throw t(Error(95));if(na)throw a=oa,na=!1,oa=null,a;}}
	var Ba={injectEventPluginOrder:function(a){if(ba)throw t(Error(101));ba=Array.prototype.slice.call(a);da();},injectEventPluginsByName:function(a){var b=!1,c;for(c in a)if(a.hasOwnProperty(c)){var d=a[c];if(!ca.hasOwnProperty(c)||ca[c]!==d){if(ca[c])throw t(Error(102),c);ca[c]=d;b=!0;}}b&&da();}};
	function Ca(a,b){var c=a.stateNode;if(!c)return null;var d=sa(c);if(!d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1;}if(a)return null;if(c&&"function"!==typeof c)throw t(Error(231),b,typeof c);
	return c}var Da=React__default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;Da.hasOwnProperty("ReactCurrentDispatcher")||(Da.ReactCurrentDispatcher={current:null});Da.hasOwnProperty("ReactCurrentBatchConfig")||(Da.ReactCurrentBatchConfig={suspense:null});
	var Ea=/^(.*)[\\\/]/,x="function"===typeof Symbol&&Symbol.for,Fa=x?Symbol.for("react.element"):60103,Ga=x?Symbol.for("react.portal"):60106,Ha=x?Symbol.for("react.fragment"):60107,Ia=x?Symbol.for("react.strict_mode"):60108,Ja=x?Symbol.for("react.profiler"):60114,Ka=x?Symbol.for("react.provider"):60109,La=x?Symbol.for("react.context"):60110,Ma=x?Symbol.for("react.concurrent_mode"):60111,Na=x?Symbol.for("react.forward_ref"):60112,Oa=x?Symbol.for("react.suspense"):60113,Pa=x?Symbol.for("react.suspense_list"):
	60120,Qa=x?Symbol.for("react.memo"):60115,Ra=x?Symbol.for("react.lazy"):60116;var Sa="function"===typeof Symbol&&Symbol.iterator;function Ta(a){if(null===a||"object"!==typeof a)return null;a=Sa&&a[Sa]||a["@@iterator"];return "function"===typeof a?a:null}
	function Ua(a){if(-1===a._status){a._status=0;var b=a._ctor;b=b();a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b);},function(b){0===a._status&&(a._status=2,a._result=b);});}}
	function Va(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case Ha:return "Fragment";case Ga:return "Portal";case Ja:return "Profiler";case Ia:return "StrictMode";case Oa:return "Suspense";case Pa:return "SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case La:return "Context.Consumer";case Ka:return "Context.Provider";case Na:var b=a.render;b=b.displayName||b.name||"";return a.displayName||(""!==b?"ForwardRef("+b+")":
	"ForwardRef");case Qa:return Va(a.type);case Ra:if(a=1===a._status?a._result:null)return Va(a)}return null}function Wa(a){var b="";do{a:switch(a.tag){case 3:case 4:case 6:case 7:case 10:case 9:var c="";break a;default:var d=a._debugOwner,e=a._debugSource,f=Va(a.type);c=null;d&&(c=Va(d.type));d=f;f="";e?f=" (at "+e.fileName.replace(Ea,"")+":"+e.lineNumber+")":c&&(f=" (created by "+c+")");c="\n    in "+(d||"Unknown")+f;}b+=c;a=a.return;}while(a);return b}
	var Xa=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),Ya=null,Za=null,$a=null;function ab(a){if(a=ta(a)){if("function"!==typeof Ya)throw t(Error(280));var b=sa(a.stateNode);Ya(a.stateNode,a.type,b);}}function bb(a){Za?$a?$a.push(a):$a=[a]:Za=a;}function cb(){if(Za){var a=Za,b=$a;$a=Za=null;ab(a);if(b)for(a=0;a<b.length;a++)ab(b[a]);}}function db(a,b){return a(b)}function eb(a,b,c,d){return a(b,c,d)}function fb(){}
	var gb=db,hb=!1,ib=!1;function jb(){if(null!==Za||null!==$a)fb(),cb();}var kb=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,lb=Object.prototype.hasOwnProperty,mb={},nb={};
	function ob(a){if(lb.call(nb,a))return !0;if(lb.call(mb,a))return !1;if(kb.test(a))return nb[a]=!0;mb[a]=!0;return !1}function pb(a,b,c,d){if(null!==c&&0===c.type)return !1;switch(typeof b){case "function":case "symbol":return !0;case "boolean":if(d)return !1;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return !1}}
	function qb(a,b,c,d){if(null===b||"undefined"===typeof b||pb(a,b,c,d))return !0;if(d)return !1;if(null!==c)switch(c.type){case 3:return !b;case 4:return !1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return !1}function B(a,b,c,d,e,f){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;}var C={};
	"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){C[a]=new B(a,0,!1,a,null,!1);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];C[b]=new B(b,1,!1,a[1],null,!1);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){C[a]=new B(a,2,!1,a.toLowerCase(),null,!1);});
	["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){C[a]=new B(a,2,!1,a,null,!1);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){C[a]=new B(a,3,!1,a.toLowerCase(),null,!1);});
	["checked","multiple","muted","selected"].forEach(function(a){C[a]=new B(a,3,!0,a,null,!1);});["capture","download"].forEach(function(a){C[a]=new B(a,4,!1,a,null,!1);});["cols","rows","size","span"].forEach(function(a){C[a]=new B(a,6,!1,a,null,!1);});["rowSpan","start"].forEach(function(a){C[a]=new B(a,5,!1,a.toLowerCase(),null,!1);});var rb=/[\-:]([a-z])/g;function sb(a){return a[1].toUpperCase()}
	"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(rb,
	sb);C[b]=new B(b,1,!1,a,null,!1);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(rb,sb);C[b]=new B(b,1,!1,a,"http://www.w3.org/1999/xlink",!1);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(rb,sb);C[b]=new B(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1);});["tabIndex","crossOrigin"].forEach(function(a){C[a]=new B(a,1,!1,a.toLowerCase(),null,!1);});
	C.xlinkHref=new B("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0);["src","href","action","formAction"].forEach(function(a){C[a]=new B(a,1,!1,a.toLowerCase(),null,!0);});function tb(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return ""}}
	function ub(a,b,c,d){var e=C.hasOwnProperty(b)?C[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(qb(b,c,e,d)&&(c=null),d||null===e?ob(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))));}
	function vb(a){var b=a.type;return (a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
	function xb(a){var b=vb(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a);}});Object.defineProperty(a,b,{enumerable:c.enumerable});return {getValue:function(){return d},setValue:function(a){d=""+a;},stopTracking:function(){a._valueTracker=
	null;delete a[b];}}}}function yb(a){a._valueTracker||(a._valueTracker=xb(a));}function zb(a){if(!a)return !1;var b=a._valueTracker;if(!b)return !0;var c=b.getValue();var d="";a&&(d=vb(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Ab(a,b){var c=b.checked;return objectAssign({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}
	function Bb(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=tb(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value};}function Cb(a,b){b=b.checked;null!=b&&ub(a,"checked",b,!1);}
	function Db(a,b){Cb(a,b);var c=tb(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c;}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?Eb(a,b.type,c):b.hasOwnProperty("defaultValue")&&Eb(a,b.type,tb(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked);}
	function Gb(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b;}c=a.name;""!==c&&(a.name="");a.defaultChecked=!a.defaultChecked;a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c);}
	function Eb(a,b,c){if("number"!==b||a.ownerDocument.activeElement!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c);}function Hb(a){var b="";React__default.Children.forEach(a,function(a){null!=a&&(b+=a);});return b}function Ib(a,b){a=objectAssign({children:void 0},b);if(b=Hb(b.children))a.children=b;return a}
	function Jb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0);}else{c=""+tb(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e]);}null!==b&&(b.selected=!0);}}
	function Kb(a,b){if(null!=b.dangerouslySetInnerHTML)throw t(Error(91));return objectAssign({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function Lb(a,b){var c=b.value;if(null==c){c=b.defaultValue;b=b.children;if(null!=b){if(null!=c)throw t(Error(92));if(Array.isArray(b)){if(!(1>=b.length))throw t(Error(93));b=b[0];}c=b;}null==c&&(c="");}a._wrapperState={initialValue:tb(c)};}
	function Mb(a,b){var c=tb(b.value),d=tb(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function Nb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b);}var Ob={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
	function Pb(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}function Qb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?Pb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
	var Rb,Sb=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if(a.namespaceURI!==Ob.svg||"innerHTML"in a)a.innerHTML=b;else{Rb=Rb||document.createElement("div");Rb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=Rb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
	function Tb(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}function Ub(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var Vb={animationend:Ub("Animation","AnimationEnd"),animationiteration:Ub("Animation","AnimationIteration"),animationstart:Ub("Animation","AnimationStart"),transitionend:Ub("Transition","TransitionEnd")},Wb={},Xb={};
	Xa&&(Xb=document.createElement("div").style,"AnimationEvent"in window||(delete Vb.animationend.animation,delete Vb.animationiteration.animation,delete Vb.animationstart.animation),"TransitionEvent"in window||delete Vb.transitionend.transition);function Yb(a){if(Wb[a])return Wb[a];if(!Vb[a])return a;var b=Vb[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Xb)return Wb[a]=b[c];return a}
	var Zb=Yb("animationend"),$b=Yb("animationiteration"),ac=Yb("animationstart"),bc=Yb("transitionend"),dc="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ec=!1,fc=[],gc=null,hc=null,ic=null,jc=new Map,kc=new Map,lc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput close cancel copy cut paste click change contextmenu reset submit".split(" "),
	mc="focus blur dragenter dragleave mouseover mouseout pointerover pointerout gotpointercapture lostpointercapture".split(" ");function nc(a){var b=oc(a);lc.forEach(function(c){pc(c,a,b);});mc.forEach(function(c){pc(c,a,b);});}function qc(a,b,c,d){return {blockedOn:a,topLevelType:b,eventSystemFlags:c|32,nativeEvent:d}}
	function rc(a,b){switch(a){case "focus":case "blur":gc=null;break;case "dragenter":case "dragleave":hc=null;break;case "mouseover":case "mouseout":ic=null;break;case "pointerover":case "pointerout":jc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":kc.delete(b.pointerId);}}function sc(a,b,c,d,e){if(null===a||a.nativeEvent!==e)return qc(b,c,d,e);a.eventSystemFlags|=d;return a}
	function tc(a,b,c,d){switch(b){case "focus":return gc=sc(gc,a,b,c,d),!0;case "dragenter":return hc=sc(hc,a,b,c,d),!0;case "mouseover":return ic=sc(ic,a,b,c,d),!0;case "pointerover":var e=d.pointerId;jc.set(e,sc(jc.get(e)||null,a,b,c,d));return !0;case "gotpointercapture":return e=d.pointerId,kc.set(e,sc(kc.get(e)||null,a,b,c,d)),!0}return !1}function uc(a){if(null!==a.blockedOn)return !1;var b=vc(a.topLevelType,a.eventSystemFlags,a.nativeEvent);return null!==b?(a.blockedOn=b,!1):!0}
	function wc(a,b,c){uc(a)&&c.delete(b);}function xc(){for(ec=!1;0<fc.length;){var a=fc[0];if(null!==a.blockedOn)break;var b=vc(a.topLevelType,a.eventSystemFlags,a.nativeEvent);null!==b?a.blockedOn=b:fc.shift();}null!==gc&&uc(gc)&&(gc=null);null!==hc&&uc(hc)&&(hc=null);null!==ic&&uc(ic)&&(ic=null);jc.forEach(wc);kc.forEach(wc);}function yc(a,b){a.blockedOn===b&&(a.blockedOn=null,ec||(ec=!0,scheduler.unstable_scheduleCallback(scheduler.unstable_NormalPriority,xc)));}
	function zc(a){function b(b){return yc(b,a)}if(0<fc.length){yc(fc[0],a);for(var c=1;c<fc.length;c++){var d=fc[c];d.blockedOn===a&&(d.blockedOn=null);}}null!==gc&&yc(gc,a);null!==hc&&yc(hc,a);null!==ic&&yc(ic,a);jc.forEach(b);kc.forEach(b);}var D=0,E=2,Ac=1024;function Bc(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else{a=b;do b=a,(b.effectTag&(E|Ac))!==D&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Cc(a){if(Bc(a)!==a)throw t(Error(188));}
	function Dc(a){var b=a.alternate;if(!b){b=Bc(a);if(null===b)throw t(Error(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Cc(e),a;if(f===d)return Cc(e),b;f=f.sibling;}throw t(Error(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===
	c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling;}if(!g)throw t(Error(189));}}if(c.alternate!==d)throw t(Error(190));}if(3!==c.tag)throw t(Error(188));return c.stateNode.current===c?a:b}function Ec(a){a=Dc(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return null}
	function Fc(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}function Gc(a){do a=a.return;while(a&&5!==a.tag);return a?a:null}function Hc(a,b,c){if(b=Ca(a,c.dispatchConfig.phasedRegistrationNames[b]))c._dispatchListeners=wa(c._dispatchListeners,b),c._dispatchInstances=wa(c._dispatchInstances,a);}
	function Ic(a){if(a&&a.dispatchConfig.phasedRegistrationNames){for(var b=a._targetInst,c=[];b;)c.push(b),b=Gc(b);for(b=c.length;0<b--;)Hc(c[b],"captured",a);for(b=0;b<c.length;b++)Hc(c[b],"bubbled",a);}}function Jc(a,b,c){a&&c&&c.dispatchConfig.registrationName&&(b=Ca(a,c.dispatchConfig.registrationName))&&(c._dispatchListeners=wa(c._dispatchListeners,b),c._dispatchInstances=wa(c._dispatchInstances,a));}function Kc(a){a&&a.dispatchConfig.registrationName&&Jc(a._targetInst,null,a);}
	function Lc(a){xa(a,Ic);}function Mc(){return !0}function Nc(){return !1}function F(a,b,c,d){this.dispatchConfig=a;this._targetInst=b;this.nativeEvent=c;a=this.constructor.Interface;for(var e in a)a.hasOwnProperty(e)&&((b=a[e])?this[e]=b(c):"target"===e?this.target=d:this[e]=c[e]);this.isDefaultPrevented=(null!=c.defaultPrevented?c.defaultPrevented:!1===c.returnValue)?Mc:Nc;this.isPropagationStopped=Nc;return this}
	objectAssign(F.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&(a.returnValue=!1),this.isDefaultPrevented=Mc);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=Mc);},persist:function(){this.isPersistent=Mc;},isPersistent:Nc,destructor:function(){var a=this.constructor.Interface,
	b;for(b in a)this[b]=null;this.nativeEvent=this._targetInst=this.dispatchConfig=null;this.isPropagationStopped=this.isDefaultPrevented=Nc;this._dispatchInstances=this._dispatchListeners=null;}});F.Interface={type:null,target:null,currentTarget:function(){return null},eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};
	F.extend=function(a){function b(){}function c(){return d.apply(this,arguments)}var d=this;b.prototype=d.prototype;var e=new b;objectAssign(e,c.prototype);c.prototype=e;c.prototype.constructor=c;c.Interface=objectAssign({},d.Interface,a);c.extend=d.extend;Oc(c);return c};Oc(F);function Pc(a,b,c,d){if(this.eventPool.length){var e=this.eventPool.pop();this.call(e,a,b,c,d);return e}return new this(a,b,c,d)}
	function Qc(a){if(!(a instanceof this))throw t(Error(279));a.destructor();10>this.eventPool.length&&this.eventPool.push(a);}function Oc(a){a.eventPool=[];a.getPooled=Pc;a.release=Qc;}var Rc=F.extend({animationName:null,elapsedTime:null,pseudoElement:null}),Sc=F.extend({clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),Tc=F.extend({view:null,detail:null}),Uc=Tc.extend({relatedTarget:null});
	function Vc(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}
	var Wc={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Xc={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",
	116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Yc={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Zc(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Yc[a])?!!b[a]:!1}function $c(){return Zc}
	var ad=Tc.extend({key:function(a){if(a.key){var b=Wc[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=Vc(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Xc[a.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:$c,charCode:function(a){return "keypress"===a.type?Vc(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===
	a.type?Vc(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),bd=0,cd=0,dd=!1,fd=!1,gd=Tc.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:$c,button:null,buttons:null,relatedTarget:function(a){return a.relatedTarget||(a.fromElement===a.srcElement?a.toElement:a.fromElement)},movementX:function(a){if("movementX"in a)return a.movementX;var b=bd;bd=a.screenX;return dd?"mousemove"===a.type?a.screenX-
	b:0:(dd=!0,0)},movementY:function(a){if("movementY"in a)return a.movementY;var b=cd;cd=a.screenY;return fd?"mousemove"===a.type?a.screenY-b:0:(fd=!0,0)}}),hd=gd.extend({pointerId:null,width:null,height:null,pressure:null,tangentialPressure:null,tiltX:null,tiltY:null,twist:null,pointerType:null,isPrimary:null}),id$1=gd.extend({dataTransfer:null}),jd=Tc.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:$c}),kd=F.extend({propertyName:null,
	elapsedTime:null,pseudoElement:null}),ld=gd.extend({deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:null,deltaMode:null}),md=[["blur","blur",0],["cancel","cancel",0],["click","click",0],["close","close",0],["contextmenu","contextMenu",0],["copy","copy",0],["cut","cut",0],["auxclick","auxClick",0],["dblclick","doubleClick",0],["dragend","dragEnd",
	0],["dragstart","dragStart",0],["drop","drop",0],["focus","focus",0],["input","input",0],["invalid","invalid",0],["keydown","keyDown",0],["keypress","keyPress",0],["keyup","keyUp",0],["mousedown","mouseDown",0],["mouseup","mouseUp",0],["paste","paste",0],["pause","pause",0],["play","play",0],["pointercancel","pointerCancel",0],["pointerdown","pointerDown",0],["pointerup","pointerUp",0],["ratechange","rateChange",0],["reset","reset",0],["seeked","seeked",0],["submit","submit",0],["touchcancel","touchCancel",
	0],["touchend","touchEnd",0],["touchstart","touchStart",0],["volumechange","volumeChange",0],["drag","drag",1],["dragenter","dragEnter",1],["dragexit","dragExit",1],["dragleave","dragLeave",1],["dragover","dragOver",1],["mousemove","mouseMove",1],["mouseout","mouseOut",1],["mouseover","mouseOver",1],["pointermove","pointerMove",1],["pointerout","pointerOut",1],["pointerover","pointerOver",1],["scroll","scroll",1],["toggle","toggle",1],["touchmove","touchMove",1],["wheel","wheel",1],["abort","abort",
	2],[Zb,"animationEnd",2],[$b,"animationIteration",2],[ac,"animationStart",2],["canplay","canPlay",2],["canplaythrough","canPlayThrough",2],["durationchange","durationChange",2],["emptied","emptied",2],["encrypted","encrypted",2],["ended","ended",2],["error","error",2],["gotpointercapture","gotPointerCapture",2],["load","load",2],["loadeddata","loadedData",2],["loadedmetadata","loadedMetadata",2],["loadstart","loadStart",2],["lostpointercapture","lostPointerCapture",2],["playing","playing",2],["progress",
	"progress",2],["seeking","seeking",2],["stalled","stalled",2],["suspend","suspend",2],["timeupdate","timeUpdate",2],[bc,"transitionEnd",2],["waiting","waiting",2]],nd={},od={},pd=0;for(;pd<md.length;pd++){var qd=md[pd],rd=qd[0],sd=qd[1],td=qd[2],ud="on"+(sd[0].toUpperCase()+sd.slice(1)),vd={phasedRegistrationNames:{bubbled:ud,captured:ud+"Capture"},dependencies:[rd],eventPriority:td};nd[sd]=vd;od[rd]=vd;}
	var wd={eventTypes:nd,getEventPriority:function(a){a=od[a];return void 0!==a?a.eventPriority:2},extractEvents:function(a,b,c,d){var e=od[a];if(!e)return null;switch(a){case "keypress":if(0===Vc(c))return null;case "keydown":case "keyup":a=ad;break;case "blur":case "focus":a=Uc;break;case "click":if(2===c.button)return null;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":a=gd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":a=
	id$1;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":a=jd;break;case Zb:case $b:case ac:a=Rc;break;case bc:a=kd;break;case "scroll":a=Tc;break;case "wheel":a=ld;break;case "copy":case "cut":case "paste":a=Sc;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":a=hd;break;default:a=F;}b=a.getPooled(e,b,c,d);Lc(b);return b}},xd=wd.getEventPriority,zd=10,Ad=[];
	function Bd(a){var b=a.targetInst,c=b;do{if(!c){a.ancestors.push(c);break}var d=c;if(3===d.tag)d=d.stateNode.containerInfo;else{for(;d.return;)d=d.return;d=3!==d.tag?null:d.stateNode.containerInfo;}if(!d)break;b=c.tag;5!==b&&6!==b||a.ancestors.push(c);c=Cd(d);}while(c);for(c=0;c<a.ancestors.length;c++){b=a.ancestors[c];var e=Fc(a.nativeEvent);d=a.topLevelType;for(var f=a.nativeEvent,g=a.eventSystemFlags,h=null,k=0;k<ea.length;k++){var l=ea[k];l&&(l=l.extractEvents(d,b,f,e,g))&&(h=wa(h,l));}Aa(h);}}
	var Dd=!0;function G(a,b){Ed(b,a,!1);}function Ed(a,b,c){switch(xd(b)){case 0:var d=Fd.bind(null,b,1);break;case 1:d=Gd.bind(null,b,1);break;default:d=Hd.bind(null,b,1);}c?a.addEventListener(b,d,!0):a.addEventListener(b,d,!1);}function Fd(a,b,c){hb||fb();var d=Hd,e=hb;hb=!0;try{eb(d,a,b,c);}finally{(hb=e)||jb();}}function Gd(a,b,c){Hd(a,b,c);}
	function Id(a,b,c,d){if(Ad.length){var e=Ad.pop();e.topLevelType=a;e.eventSystemFlags=b;e.nativeEvent=c;e.targetInst=d;a=e;}else a={topLevelType:a,eventSystemFlags:b,nativeEvent:c,targetInst:d,ancestors:[]};try{if(b=Bd,c=a,ib)b(c,void 0);else{ib=!0;try{gb(b,c,void 0);}finally{ib=!1,jb();}}}finally{a.topLevelType=null,a.nativeEvent=null,a.targetInst=null,a.ancestors.length=0,Ad.length<zd&&Ad.push(a);}}
	function Hd(a,b,c){if(Dd)if(0<fc.length&&-1<lc.indexOf(a))a=qc(null,a,b,c),fc.push(a);else{var d=vc(a,b,c);null===d?rc(a,c):-1<lc.indexOf(a)?(a=qc(d,a,b,c),fc.push(a)):tc(d,a,b,c)||(rc(a,c),Id(a,b,c,null));}}
	function vc(a,b,c){var d=Fc(c),e=Cd(d);if(null!==e)if(d=Bc(e),null===d)e=null;else{var f=d.tag;if(13===f){a:{if(13===d.tag&&(e=d.memoizedState,null===e&&(d=d.alternate,null!==d&&(e=d.memoizedState)),null!==e)){d=e.dehydrated;break a}d=null;}if(null!==d)return d;e=null;}else if(3===f){if(d.stateNode.hydrate)return 3===d.tag?d.stateNode.containerInfo:null;e=null;}else d!==e&&(e=null);}Id(a,b,c,e);return null}
	function Jd(a){if(!Xa)return !1;a="on"+a;var b=a in document;b||(b=document.createElement("div"),b.setAttribute(a,"return;"),b="function"===typeof b[a]);return b}var Kd=new ("function"===typeof WeakMap?WeakMap:Map);function oc(a){var b=Kd.get(a);void 0===b&&(b=new Set,Kd.set(a,b));return b}
	function pc(a,b,c){if(!c.has(a)){switch(a){case "scroll":Ed(b,"scroll",!0);break;case "focus":case "blur":Ed(b,"focus",!0);Ed(b,"blur",!0);c.add("blur");c.add("focus");break;case "cancel":case "close":Jd(a)&&Ed(b,a,!0);break;case "invalid":case "submit":case "reset":break;default:-1===dc.indexOf(a)&&G(a,b);}c.add(a);}}
	var Ld={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,
	floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Md=["Webkit","ms","Moz","O"];Object.keys(Ld).forEach(function(a){Md.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);Ld[b]=Ld[a];});});function Nd(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||Ld.hasOwnProperty(a)&&Ld[a]?(""+b).trim():b+"px"}
	function Od(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=Nd(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var Pd=objectAssign({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
	function Qd(a,b){if(b){if(Pd[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw t(Error(137),a,"");if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw t(Error(60));if(!("object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML))throw t(Error(61));}if(null!=b.style&&"object"!==typeof b.style)throw t(Error(62),"");}}
	function Rd(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return !1;default:return !0}}function Sd(a,b){a=9===a.nodeType||11===a.nodeType?a:a.ownerDocument;var c=oc(a);b=ja[b];for(var d=0;d<b.length;d++)pc(b[d],a,c);}function Td(){}
	function Ud(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}function Vd(a){for(;a&&a.firstChild;)a=a.firstChild;return a}function Wd(a,b){var c=Vd(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Vd(c);}}
	function Xd(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Xd(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}function Yd(){for(var a=window,b=Ud();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href;}catch(d){c=!1;}if(c)a=b.contentWindow;else break;b=Ud(a.document);}return b}
	function Zd(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}var $d="$",ae="/$",be="$?",ce="$!",de=null,ee=null;function fe(a,b){switch(a){case "button":case "input":case "select":case "textarea":return !!b.autoFocus}return !1}
	function ge(a,b){return "textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}var he="function"===typeof setTimeout?setTimeout:void 0,ie="function"===typeof clearTimeout?clearTimeout:void 0;function je(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break}return a}
	function ke(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if(c===$d||c===ce||c===be){if(0===b)return a;b--;}else c===ae&&b++;}a=a.previousSibling;}return null}var le=Math.random().toString(36).slice(2),me="__reactInternalInstance$"+le,ne="__reactEventHandlers$"+le,oe="__reactContainere$"+le;
	function Cd(a){var b=a[me];if(b)return b;for(var c=a.parentNode;c;){if(b=c[oe]||c[me]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=ke(a);null!==a;){if(c=a[me])return c;a=ke(a);}return b}a=c;c=a.parentNode;}return null}function pe(a){a=a[me]||a[oe];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function qe(a){if(5===a.tag||6===a.tag)return a.stateNode;throw t(Error(33));}function re(a){return a[ne]||null}var se=null,te=null,ue=null;
	function ve(){if(ue)return ue;var a,b=te,c=b.length,d,e="value"in se?se.value:se.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return ue=e.slice(a,1<d?1-d:void 0)}var we=F.extend({data:null}),xe=F.extend({data:null}),ye=[9,13,27,32],ze=Xa&&"CompositionEvent"in window,Ae=null;Xa&&"documentMode"in document&&(Ae=document.documentMode);
	var Be=Xa&&"TextEvent"in window&&!Ae,Ce=Xa&&(!ze||Ae&&8<Ae&&11>=Ae),De=String.fromCharCode(32),Ee={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",
	captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},Fe=!1;
	function Ge(a,b){switch(a){case "keyup":return -1!==ye.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "blur":return !0;default:return !1}}function He(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var Ie=!1;function Je(a,b){switch(a){case "compositionend":return He(b);case "keypress":if(32!==b.which)return null;Fe=!0;return De;case "textInput":return a=b.data,a===De&&Fe?null:a;default:return null}}
	function Ke(a,b){if(Ie)return "compositionend"===a||!ze&&Ge(a,b)?(a=ve(),ue=te=se=null,Ie=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return Ce&&"ko"!==b.locale?null:b.data;default:return null}}
	var Le={eventTypes:Ee,extractEvents:function(a,b,c,d){var e;if(ze)b:{switch(a){case "compositionstart":var f=Ee.compositionStart;break b;case "compositionend":f=Ee.compositionEnd;break b;case "compositionupdate":f=Ee.compositionUpdate;break b}f=void 0;}else Ie?Ge(a,c)&&(f=Ee.compositionEnd):"keydown"===a&&229===c.keyCode&&(f=Ee.compositionStart);f?(Ce&&"ko"!==c.locale&&(Ie||f!==Ee.compositionStart?f===Ee.compositionEnd&&Ie&&(e=ve()):(se=d,te="value"in se?se.value:se.textContent,Ie=!0)),f=we.getPooled(f,
	b,c,d),e?f.data=e:(e=He(c),null!==e&&(f.data=e)),Lc(f),e=f):e=null;(a=Be?Je(a,c):Ke(a,c))?(b=xe.getPooled(Ee.beforeInput,b,c,d),b.data=a,Lc(b)):b=null;return null===e?b:null===b?e:[e,b]}},Me={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ne(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!Me[a.type]:"textarea"===b?!0:!1}
	var Oe={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function Pe(a,b,c){a=F.getPooled(Oe.change,a,b,c);a.type="change";bb(c);Lc(a);return a}var Qe=null,Re=null;function Se(a){Aa(a);}function Te(a){var b=qe(a);if(zb(b))return a}function Ue(a,b){if("change"===a)return b}var Ve=!1;Xa&&(Ve=Jd("input")&&(!document.documentMode||9<document.documentMode));
	function We(){Qe&&(Qe.detachEvent("onpropertychange",Xe),Re=Qe=null);}function Xe(a){if("value"===a.propertyName&&Te(Re))if(a=Pe(Re,a,Fc(a)),hb)Aa(a);else{hb=!0;try{db(Se,a);}finally{hb=!1,jb();}}}function Ye(a,b,c){"focus"===a?(We(),Qe=b,Re=c,Qe.attachEvent("onpropertychange",Xe)):"blur"===a&&We();}function Ze(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return Te(Re)}function $e(a,b){if("click"===a)return Te(b)}function af(a,b){if("input"===a||"change"===a)return Te(b)}
	var bf={eventTypes:Oe,_isInputEventSupported:Ve,extractEvents:function(a,b,c,d){var e=b?qe(b):window,f=e.nodeName&&e.nodeName.toLowerCase();if("select"===f||"input"===f&&"file"===e.type)var g=Ue;else if(Ne(e))if(Ve)g=af;else{g=Ze;var h=Ye;}else(f=e.nodeName)&&"input"===f.toLowerCase()&&("checkbox"===e.type||"radio"===e.type)&&(g=$e);if(g&&(g=g(a,b)))return Pe(g,c,d);h&&h(a,e,b);"blur"===a&&(a=e._wrapperState)&&a.controlled&&"number"===e.type&&Eb(e,"number",e.value);}},cf={mouseEnter:{registrationName:"onMouseEnter",
	dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",dependencies:["pointerout","pointerover"]}},df={eventTypes:cf,extractEvents:function(a,b,c,d,e){var f="mouseover"===a||"pointerover"===a,g="mouseout"===a||"pointerout"===a;if(f&&0===(e&32)&&(c.relatedTarget||c.fromElement)||!g&&!f)return null;
	e=d.window===d?d:(e=d.ownerDocument)?e.defaultView||e.parentWindow:window;if(g){if(g=b,b=(b=c.relatedTarget||c.toElement)?Cd(b):null,null!==b&&(f=Bc(b),b!==f||5!==b.tag&&6!==b.tag))b=null;}else g=null;if(g===b)return null;if("mouseout"===a||"mouseover"===a){var h=gd;var k=cf.mouseLeave;var l=cf.mouseEnter;var m="mouse";}else if("pointerout"===a||"pointerover"===a)h=hd,k=cf.pointerLeave,l=cf.pointerEnter,m="pointer";a=null==g?e:qe(g);e=null==b?e:qe(b);k=h.getPooled(k,g,c,d);k.type=m+"leave";k.target=
	a;k.relatedTarget=e;c=h.getPooled(l,b,c,d);c.type=m+"enter";c.target=e;c.relatedTarget=a;d=g;m=b;if(d&&m)a:{h=d;l=m;a=0;for(g=h;g;g=Gc(g))a++;g=0;for(b=l;b;b=Gc(b))g++;for(;0<a-g;)h=Gc(h),a--;for(;0<g-a;)l=Gc(l),g--;for(;a--;){if(h===l||h===l.alternate)break a;h=Gc(h);l=Gc(l);}h=null;}else h=null;l=h;for(h=[];d&&d!==l;){a=d.alternate;if(null!==a&&a===l)break;h.push(d);d=Gc(d);}for(d=[];m&&m!==l;){a=m.alternate;if(null!==a&&a===l)break;d.push(m);m=Gc(m);}for(m=0;m<h.length;m++)Jc(h[m],"bubbled",k);for(m=
	d.length;0<m--;)Jc(d[m],"captured",c);return [k,c]}};function ef(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var ff="function"===typeof Object.is?Object.is:ef,gf=Object.prototype.hasOwnProperty;function hf(a,b){if(ff(a,b))return !0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return !1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return !1;for(d=0;d<c.length;d++)if(!gf.call(b,c[d])||!ff(a[c[d]],b[c[d]]))return !1;return !0}
	var jf=Xa&&"documentMode"in document&&11>=document.documentMode,kf={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")}},lf=null,mf=null,nf=null,of=!1;
	function pf(a,b){var c=b.window===b?b.document:9===b.nodeType?b:b.ownerDocument;if(of||null==lf||lf!==Ud(c))return null;c=lf;"selectionStart"in c&&Zd(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset});return nf&&hf(nf,c)?null:(nf=c,a=F.getPooled(kf.select,mf,a,b),a.type="select",a.target=lf,Lc(a),a)}
	var qf={eventTypes:kf,extractEvents:function(a,b,c,d){var e=d.window===d?d.document:9===d.nodeType?d:d.ownerDocument,f;if(!(f=!e)){a:{e=oc(e);f=ja.onSelect;for(var g=0;g<f.length;g++)if(!e.has(f[g])){e=!1;break a}e=!0;}f=!e;}if(f)return null;e=b?qe(b):window;switch(a){case "focus":if(Ne(e)||"true"===e.contentEditable)lf=e,mf=b,nf=null;break;case "blur":nf=mf=lf=null;break;case "mousedown":of=!0;break;case "contextmenu":case "mouseup":case "dragend":return of=!1,pf(c,d);case "selectionchange":if(jf)break;
	case "keydown":case "keyup":return pf(c,d)}return null}};Ba.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" "));sa=re;ta=pe;ua=qe;Ba.injectEventPluginsByName({SimpleEventPlugin:wd,EnterLeaveEventPlugin:df,ChangeEventPlugin:bf,SelectEventPlugin:qf,BeforeInputEventPlugin:Le});var rf=[],sf=-1;function H(a){0>sf||(a.current=rf[sf],rf[sf]=null,sf--);}
	function I(a,b){sf++;rf[sf]=a.current;a.current=b;}var tf={},J={current:tf},K={current:!1},uf=tf;function vf(a,b){var c=a.type.contextTypes;if(!c)return tf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function N(a){a=a.childContextTypes;return null!==a&&void 0!==a}
	function wf(a){H(K);H(J);}function xf(a){H(K);H(J);}function zf(a,b,c){if(J.current!==tf)throw t(Error(168));I(J,b);I(K,c);}function Af(a,b,c){var d=a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in a))throw t(Error(108),Va(b)||"Unknown",e);return objectAssign({},c,{},d)}function Bf(a){var b=a.stateNode;b=b&&b.__reactInternalMemoizedMergedChildContext||tf;uf=J.current;I(J,b);I(K,K.current);return !0}
	function Cf(a,b,c){var d=a.stateNode;if(!d)throw t(Error(169));c?(b=Af(a,b,uf),d.__reactInternalMemoizedMergedChildContext=b,H(K),H(J),I(J,b)):H(K);I(K,c);}
	var Df=scheduler.unstable_runWithPriority,Ef=scheduler.unstable_scheduleCallback,Ff=scheduler.unstable_cancelCallback,Gf=scheduler.unstable_shouldYield,Hf=scheduler.unstable_requestPaint,If=scheduler.unstable_now,Jf=scheduler.unstable_getCurrentPriorityLevel,Kf=scheduler.unstable_ImmediatePriority,Lf=scheduler.unstable_UserBlockingPriority,Mf=scheduler.unstable_NormalPriority,Nf=scheduler.unstable_LowPriority,Of=scheduler.unstable_IdlePriority,Pf={},Qf=void 0!==Hf?Hf:function(){},Rf=null,Sf=null,Tf=!1,Uf=If(),Vf=1E4>Uf?If:function(){return If()-Uf};
	function Wf(){switch(Jf()){case Kf:return 99;case Lf:return 98;case Mf:return 97;case Nf:return 96;case Of:return 95;default:throw t(Error(332));}}function Xf(a){switch(a){case 99:return Kf;case 98:return Lf;case 97:return Mf;case 96:return Nf;case 95:return Of;default:throw t(Error(332));}}function Yf(a,b){a=Xf(a);return Df(a,b)}function Zf(a,b,c){a=Xf(a);return Ef(a,b,c)}function $f(a){null===Rf?(Rf=[a],Sf=Ef(Kf,ag)):Rf.push(a);return Pf}function bg(){if(null!==Sf){var a=Sf;Sf=null;Ff(a);}ag();}
	function ag(){if(!Tf&&null!==Rf){Tf=!0;var a=0;try{var b=Rf;Yf(99,function(){for(;a<b.length;a++){var c=b[a];do c=c(!0);while(null!==c)}});Rf=null;}catch(c){throw null!==Rf&&(Rf=Rf.slice(a+1)),Ef(Kf,bg),c;}finally{Tf=!1;}}}function cg(a,b){if(a&&a.defaultProps){b=objectAssign({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);}return b}var dg={current:null},eg=null,fg=null,gg=null;function hg(){gg=fg=eg=null;}function ig(a,b){var c=a.type._context;I(dg,c._currentValue);c._currentValue=b;}
	function jg(a){var b=dg.current;H(dg);a.type._context._currentValue=b;}function kg(a,b){for(;null!==a;){var c=a.alternate;if(a.childExpirationTime<b)a.childExpirationTime=b,null!==c&&c.childExpirationTime<b&&(c.childExpirationTime=b);else if(null!==c&&c.childExpirationTime<b)c.childExpirationTime=b;else break;a=a.return;}}function lg(a,b){eg=a;gg=fg=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(a.expirationTime>=b&&(mg=!0),a.firstContext=null);}
	function ng(a,b){if(gg!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)gg=a,b=1073741823;b={context:a,observedBits:b,next:null};if(null===fg){if(null===eg)throw t(Error(308));fg=b;eg.dependencies={expirationTime:0,firstContext:b,responders:null};}else fg=fg.next=b;}return a._currentValue}var og=!1;
	function pg(a){return {baseState:a,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function qg(a){return {baseState:a.baseState,firstUpdate:a.firstUpdate,lastUpdate:a.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}
	function rg(a,b){return {expirationTime:a,suspenseConfig:b,tag:0,payload:null,callback:null,next:null,nextEffect:null}}function sg(a,b){null===a.lastUpdate?a.firstUpdate=a.lastUpdate=b:(a.lastUpdate.next=b,a.lastUpdate=b);}
	function tg(a,b){var c=a.alternate;if(null===c){var d=a.updateQueue;var e=null;null===d&&(d=a.updateQueue=pg(a.memoizedState));}else d=a.updateQueue,e=c.updateQueue,null===d?null===e?(d=a.updateQueue=pg(a.memoizedState),e=c.updateQueue=pg(c.memoizedState)):d=a.updateQueue=qg(e):null===e&&(e=c.updateQueue=qg(d));null===e||d===e?sg(d,b):null===d.lastUpdate||null===e.lastUpdate?(sg(d,b),sg(e,b)):(sg(d,b),e.lastUpdate=b);}
	function ug(a,b){var c=a.updateQueue;c=null===c?a.updateQueue=pg(a.memoizedState):vg(a,c);null===c.lastCapturedUpdate?c.firstCapturedUpdate=c.lastCapturedUpdate=b:(c.lastCapturedUpdate.next=b,c.lastCapturedUpdate=b);}function vg(a,b){var c=a.alternate;null!==c&&b===c.updateQueue&&(b=a.updateQueue=qg(b));return b}
	function wg(a,b,c,d,e,f){switch(c.tag){case 1:return a=c.payload,"function"===typeof a?a.call(f,d,e):a;case 3:a.effectTag=a.effectTag&-4097|64;case 0:a=c.payload;e="function"===typeof a?a.call(f,d,e):a;if(null===e||void 0===e)break;return objectAssign({},d,e);case 2:og=!0;}return d}
	function xg(a,b,c,d,e){og=!1;b=vg(a,b);for(var f=b.baseState,g=null,h=0,k=b.firstUpdate,l=f;null!==k;){var m=k.expirationTime;m<e?(null===g&&(g=k,f=l),h<m&&(h=m)):(yg(m,k.suspenseConfig),l=wg(a,b,k,l,c,d),null!==k.callback&&(a.effectTag|=32,k.nextEffect=null,null===b.lastEffect?b.firstEffect=b.lastEffect=k:(b.lastEffect.nextEffect=k,b.lastEffect=k)));k=k.next;}m=null;for(k=b.firstCapturedUpdate;null!==k;){var A=k.expirationTime;A<e?(null===m&&(m=k,null===g&&(f=l)),h<A&&(h=A)):(l=wg(a,b,k,l,c,d),null!==
	k.callback&&(a.effectTag|=32,k.nextEffect=null,null===b.lastCapturedEffect?b.firstCapturedEffect=b.lastCapturedEffect=k:(b.lastCapturedEffect.nextEffect=k,b.lastCapturedEffect=k)));k=k.next;}null===g&&(b.lastUpdate=null);null===m?b.lastCapturedUpdate=null:a.effectTag|=32;null===g&&null===m&&(f=l);b.baseState=f;b.firstUpdate=g;b.firstCapturedUpdate=m;zg(h);a.expirationTime=h;a.memoizedState=l;}
	function Ag(a,b,c){null!==b.firstCapturedUpdate&&(null!==b.lastUpdate&&(b.lastUpdate.next=b.firstCapturedUpdate,b.lastUpdate=b.lastCapturedUpdate),b.firstCapturedUpdate=b.lastCapturedUpdate=null);Bg(b.firstEffect,c);b.firstEffect=b.lastEffect=null;Bg(b.firstCapturedEffect,c);b.firstCapturedEffect=b.lastCapturedEffect=null;}function Bg(a,b){for(;null!==a;){var c=a.callback;if(null!==c){a.callback=null;var d=b;if("function"!==typeof c)throw t(Error(191),c);c.call(d);}a=a.nextEffect;}}
	var Cg=Da.ReactCurrentBatchConfig,Dg=(new React__default.Component).refs;function Eg(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:objectAssign({},b,c);a.memoizedState=c;d=a.updateQueue;null!==d&&0===a.expirationTime&&(d.baseState=c);}
	var Ig={isMounted:function(a){return (a=a._reactInternalFiber)?Bc(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternalFiber;var d=Fg(),e=Cg.suspense;d=Gg(d,a,e);e=rg(d,e);e.payload=b;void 0!==c&&null!==c&&(e.callback=c);tg(a,e);Hg(a,d);},enqueueReplaceState:function(a,b,c){a=a._reactInternalFiber;var d=Fg(),e=Cg.suspense;d=Gg(d,a,e);e=rg(d,e);e.tag=1;e.payload=b;void 0!==c&&null!==c&&(e.callback=c);tg(a,e);Hg(a,d);},enqueueForceUpdate:function(a,b){a=a._reactInternalFiber;var c=Fg(),d=Cg.suspense;
	c=Gg(c,a,d);d=rg(c,d);d.tag=2;void 0!==b&&null!==b&&(d.callback=b);tg(a,d);Hg(a,c);}};function Jg(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!hf(c,d)||!hf(e,f):!0}
	function Kg(a,b,c){var d=!1,e=tf;var f=b.contextType;"object"===typeof f&&null!==f?f=ng(f):(e=N(b)?uf:J.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?vf(a,e):tf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Ig;a.stateNode=b;b._reactInternalFiber=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
	function Lg(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Ig.enqueueReplaceState(b,b.state,null);}
	function Mg(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=Dg;var f=b.contextType;"object"===typeof f&&null!==f?e.context=ng(f):(f=N(b)?uf:J.current,e.context=vf(a,f));f=a.updateQueue;null!==f&&(xg(a,f,c,e,d),e.state=a.memoizedState);f=b.getDerivedStateFromProps;"function"===typeof f&&(Eg(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==
	typeof e.componentWillMount||(b=e.state,"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Ig.enqueueReplaceState(e,e.state,null),f=a.updateQueue,null!==f&&(xg(a,f,c,e,d),e.state=a.memoizedState));"function"===typeof e.componentDidMount&&(a.effectTag|=4);}var Ng=Array.isArray;
	function Og(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw t(Error(309));var d=c.stateNode;}if(!d)throw t(Error(147),a);var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===Dg&&(b=d.refs={});null===a?delete b[e]:b[e]=a;};b._stringRef=e;return b}if("string"!==typeof a)throw t(Error(284));if(!c._owner)throw t(Error(290),a);}return a}
	function Pg(a,b){if("textarea"!==a.type)throw t(Error(31),"[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b,"");}
	function Qg(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.effectTag=8;}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b,c){a=Rg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.effectTag=
	E,c):d;b.effectTag=E;return c}function g(b){a&&null===b.alternate&&(b.effectTag=E);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Sg(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.elementType===c.type)return d=e(b,c.props),d.ref=Og(a,b,c),d.return=a,d;d=Tg(c.type,c.key,c.props,null,a.mode,d);d.ref=Og(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==
	c.implementation)return b=Ug(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Vg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function A(a,b,c){if("string"===typeof b||"number"===typeof b)return b=Sg(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case Fa:return c=Tg(b.type,b.key,b.props,null,a.mode,c),c.ref=Og(a,null,b),c.return=a,c;case Ga:return b=Ug(b,a.mode,c),b.return=a,b}if(Ng(b)||
	Ta(b))return b=Vg(b,a.mode,c,null),b.return=a,b;Pg(a,b);}return null}function w(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case Fa:return c.key===e?c.type===Ha?m(a,b,c.props.children,d,e):k(a,b,c,d):null;case Ga:return c.key===e?l(a,b,c,d):null}if(Ng(c)||Ta(c))return null!==e?null:m(a,b,c,d,null);Pg(a,c);}return null}function L(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=
	a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case Fa:return a=a.get(null===d.key?c:d.key)||null,d.type===Ha?m(b,a,d.props.children,e,d.key):k(b,a,d,e);case Ga:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e)}if(Ng(d)||Ta(d))return a=a.get(c)||null,m(b,a,d,e,null);Pg(b,d);}return null}function wb(e,g,h,k){for(var l=null,m=null,q=g,y=g=0,z=null;null!==q&&y<h.length;y++){q.index>y?(z=q,q=null):z=q.sibling;var p=w(e,q,h[y],k);if(null===p){null===q&&(q=z);break}a&&
	q&&null===p.alternate&&b(e,q);g=f(p,g,y);null===m?l=p:m.sibling=p;m=p;q=z;}if(y===h.length)return c(e,q),l;if(null===q){for(;y<h.length;y++)q=A(e,h[y],k),null!==q&&(g=f(q,g,y),null===m?l=q:m.sibling=q,m=q);return l}for(q=d(e,q);y<h.length;y++)z=L(q,e,y,h[y],k),null!==z&&(a&&null!==z.alternate&&q.delete(null===z.key?y:z.key),g=f(z,g,y),null===m?l=z:m.sibling=z,m=z);a&&q.forEach(function(a){return b(e,a)});return l}function M(e,g,h,k){var l=Ta(h);if("function"!==typeof l)throw t(Error(150));h=l.call(h);
	if(null==h)throw t(Error(151));for(var m=l=null,q=g,y=g=0,z=null,p=h.next();null!==q&&!p.done;y++,p=h.next()){q.index>y?(z=q,q=null):z=q.sibling;var M=w(e,q,p.value,k);if(null===M){null===q&&(q=z);break}a&&q&&null===M.alternate&&b(e,q);g=f(M,g,y);null===m?l=M:m.sibling=M;m=M;q=z;}if(p.done)return c(e,q),l;if(null===q){for(;!p.done;y++,p=h.next())p=A(e,p.value,k),null!==p&&(g=f(p,g,y),null===m?l=p:m.sibling=p,m=p);return l}for(q=d(e,q);!p.done;y++,p=h.next())p=L(q,e,y,p.value,k),null!==p&&(a&&null!==
	p.alternate&&q.delete(null===p.key?y:p.key),g=f(p,g,y),null===m?l=p:m.sibling=p,m=p);a&&q.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===Ha&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case Fa:a:{l=f.key;for(k=d;null!==k;){if(k.key===l){if(7===k.tag?f.type===Ha:k.elementType===f.type){c(a,k.sibling);d=e(k,f.type===Ha?f.props.children:f.props);d.ref=Og(a,k,f);d.return=a;a=d;break a}c(a,
	k);break}else b(a,k);k=k.sibling;}f.type===Ha?(d=Vg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Tg(f.type,f.key,f.props,null,a.mode,h),h.ref=Og(a,d,f),h.return=a,a=h);}return g(a);case Ga:a:{for(k=f.key;null!==d;){if(d.key===k){if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}c(a,d);break}else b(a,d);d=d.sibling;}d=Ug(f,a.mode,h);d.return=a;a=d;}return g(a)}if("string"===typeof f||
	"number"===typeof f)return f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):(c(a,d),d=Sg(f,a.mode,h),d.return=a,a=d),g(a);if(Ng(f))return wb(a,d,f,h);if(Ta(f))return M(a,d,f,h);l&&Pg(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 1:case 0:throw a=a.type,t(Error(152),a.displayName||a.name||"Component");}return c(a,d)}}var Wg=Qg(!0),Xg=Qg(!1),Yg={},Zg={current:Yg},$g={current:Yg},ah={current:Yg};function bh(a){if(a===Yg)throw t(Error(174));return a}
	function ch(a,b){I(ah,b);I($g,a);I(Zg,Yg);var c=b.nodeType;switch(c){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:Qb(null,"");break;default:c=8===c?b.parentNode:b,b=c.namespaceURI||null,c=c.tagName,b=Qb(b,c);}H(Zg);I(Zg,b);}function dh(a){H(Zg);H($g);H(ah);}function eh(a){bh(ah.current);var b=bh(Zg.current);var c=Qb(b,a.type);b!==c&&(I($g,a),I(Zg,c));}function fh(a){$g.current===a&&(H(Zg),H($g));}var O={current:0};
	function gh(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||c.data===be||c.data===ce))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if((b.effectTag&64)!==D)return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}function hh(a,b){return {responder:a,props:b}}
	var ih=Da.ReactCurrentDispatcher,jh=0,kh=null,P=null,lh=null,mh=null,Q=null,nh=null,oh=0,ph=null,qh=0,rh=!1,sh=null,th=0;function uh(){throw t(Error(321));}function vh(a,b){if(null===b)return !1;for(var c=0;c<b.length&&c<a.length;c++)if(!ff(a[c],b[c]))return !1;return !0}
	function wh(a,b,c,d,e,f){jh=f;kh=b;lh=null!==a?a.memoizedState:null;ih.current=null===lh?xh:yh;b=c(d,e);if(rh){do rh=!1,th+=1,lh=null!==a?a.memoizedState:null,nh=mh,ph=Q=P=null,ih.current=yh,b=c(d,e);while(rh);sh=null;th=0;}ih.current=zh;a=kh;a.memoizedState=mh;a.expirationTime=oh;a.updateQueue=ph;a.effectTag|=qh;a=null!==P&&null!==P.next;jh=0;nh=Q=mh=lh=P=kh=null;oh=0;ph=null;qh=0;if(a)throw t(Error(300));return b}
	function Ah(){ih.current=zh;jh=0;nh=Q=mh=lh=P=kh=null;oh=0;ph=null;qh=0;rh=!1;sh=null;th=0;}function Eh(){var a={memoizedState:null,baseState:null,queue:null,baseUpdate:null,next:null};null===Q?mh=Q=a:Q=Q.next=a;return Q}function Fh(){if(null!==nh)Q=nh,nh=Q.next,P=lh,lh=null!==P?P.next:null;else{if(null===lh)throw t(Error(310));P=lh;var a={memoizedState:P.memoizedState,baseState:P.baseState,queue:P.queue,baseUpdate:P.baseUpdate,next:null};Q=null===Q?mh=a:Q.next=a;lh=P.next;}return Q}
	function Gh(a,b){return "function"===typeof b?b(a):b}
	function Hh(a){var b=Fh(),c=b.queue;if(null===c)throw t(Error(311));c.lastRenderedReducer=a;if(0<th){var d=c.dispatch;if(null!==sh){var e=sh.get(c);if(void 0!==e){sh.delete(c);var f=b.memoizedState;do f=a(f,e.action),e=e.next;while(null!==e);ff(f,b.memoizedState)||(mg=!0);b.memoizedState=f;b.baseUpdate===c.last&&(b.baseState=f);c.lastRenderedState=f;return [f,d]}}return [b.memoizedState,d]}d=c.last;var g=b.baseUpdate;f=b.baseState;null!==g?(null!==d&&(d.next=null),d=g.next):d=null!==d?d.next:null;if(null!==
	d){var h=e=null,k=d,l=!1;do{var m=k.expirationTime;m<jh?(l||(l=!0,h=g,e=f),m>oh&&(oh=m,zg(oh))):(yg(m,k.suspenseConfig),f=k.eagerReducer===a?k.eagerState:a(f,k.action));g=k;k=k.next;}while(null!==k&&k!==d);l||(h=g,e=f);ff(f,b.memoizedState)||(mg=!0);b.memoizedState=f;b.baseUpdate=h;b.baseState=e;c.lastRenderedState=f;}return [b.memoizedState,c.dispatch]}
	function Ih(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};null===ph?(ph={lastEffect:null},ph.lastEffect=a.next=a):(b=ph.lastEffect,null===b?ph.lastEffect=a.next=a:(c=b.next,b.next=a,a.next=c,ph.lastEffect=a));return a}function Jh(a,b,c,d){var e=Eh();qh|=a;e.memoizedState=Ih(b,c,void 0,void 0===d?null:d);}
	function Kh(a,b,c,d){var e=Fh();d=void 0===d?null:d;var f=void 0;if(null!==P){var g=P.memoizedState;f=g.destroy;if(null!==d&&vh(d,g.deps)){Ih(0,c,f,d);return}}qh|=a;e.memoizedState=Ih(b,c,f,d);}function Lh(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}function Mh(){}
	function Nh(a,b,c){if(!(25>th))throw t(Error(301));var d=a.alternate;if(a===kh||null!==d&&d===kh)if(rh=!0,a={expirationTime:jh,suspenseConfig:null,action:c,eagerReducer:null,eagerState:null,next:null},null===sh&&(sh=new Map),c=sh.get(b),void 0===c)sh.set(b,a);else{for(b=c;null!==b.next;)b=b.next;b.next=a;}else{var e=Fg(),f=Cg.suspense;e=Gg(e,a,f);f={expirationTime:e,suspenseConfig:f,action:c,eagerReducer:null,eagerState:null,next:null};var g=b.last;if(null===g)f.next=f;else{var h=g.next;null!==h&&
	(f.next=h);g.next=f;}b.last=f;if(0===a.expirationTime&&(null===d||0===d.expirationTime)&&(d=b.lastRenderedReducer,null!==d))try{var k=b.lastRenderedState,l=d(k,c);f.eagerReducer=d;f.eagerState=l;if(ff(l,k))return}catch(m){}finally{}Hg(a,e);}}
	var zh={readContext:ng,useCallback:uh,useContext:uh,useEffect:uh,useImperativeHandle:uh,useLayoutEffect:uh,useMemo:uh,useReducer:uh,useRef:uh,useState:uh,useDebugValue:uh,useResponder:uh},xh={readContext:ng,useCallback:function(a,b){Eh().memoizedState=[a,void 0===b?null:b];return a},useContext:ng,useEffect:function(a,b){return Jh(516,192,a,b)},useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Jh(4,36,Lh.bind(null,b,a),c)},useLayoutEffect:function(a,b){return Jh(4,
	36,a,b)},useMemo:function(a,b){var c=Eh();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Eh();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a=d.queue={last:null,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};a=a.dispatch=Nh.bind(null,kh,a);return [d.memoizedState,a]},useRef:function(a){var b=Eh();a={current:a};return b.memoizedState=a},useState:function(a){var b=Eh();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a=b.queue={last:null,
	dispatch:null,lastRenderedReducer:Gh,lastRenderedState:a};a=a.dispatch=Nh.bind(null,kh,a);return [b.memoizedState,a]},useDebugValue:Mh,useResponder:hh},yh={readContext:ng,useCallback:function(a,b){var c=Fh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&vh(b,d[1]))return d[0];c.memoizedState=[a,b];return a},useContext:ng,useEffect:function(a,b){return Kh(516,192,a,b)},useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Kh(4,36,Lh.bind(null,b,a),c)},
	useLayoutEffect:function(a,b){return Kh(4,36,a,b)},useMemo:function(a,b){var c=Fh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&vh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a},useReducer:Hh,useRef:function(){return Fh().memoizedState},useState:function(a){return Hh(Gh)},useDebugValue:Mh,useResponder:hh},Oh=null,Ph=null,Qh=!1;
	function Rh(a,b){var c=Sh(5,null,null,0);c.elementType="DELETED";c.type="DELETED";c.stateNode=b;c.return=a;c.effectTag=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c;}function Th(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;case 13:return !1;default:return !1}}
	function Uh(a){if(Qh){var b=Ph;if(b){var c=b;if(!Th(a,b)){b=je(c.nextSibling);if(!b||!Th(a,b)){a.effectTag=a.effectTag&~Ac|E;Qh=!1;Oh=a;return}Rh(Oh,c);}Oh=a;Ph=je(b.firstChild);}else a.effectTag=a.effectTag&~Ac|E,Qh=!1,Oh=a;}}function Vh(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;Oh=a;}
	function Wh(a){if(a!==Oh)return !1;if(!Qh)return Vh(a),Qh=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!ge(b,a.memoizedProps))for(b=Ph;b;)Rh(a,b),b=je(b.nextSibling);Vh(a);if(13===a.tag)if(a=a.memoizedState,a=null!==a?a.dehydrated:null,null===a)a=Ph;else a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if(c===ae){if(0===b){a=je(a.nextSibling);break a}b--;}else c!==$d&&c!==ce&&c!==be||b++;}a=a.nextSibling;}a=null;}else a=Oh?je(a.stateNode.nextSibling):null;Ph=a;return !0}
	function Xh(){Ph=Oh=null;Qh=!1;}var Yh=Da.ReactCurrentOwner,mg=!1;function R(a,b,c,d){b.child=null===a?Xg(b,null,c,d):Wg(b,a.child,c,d);}function Zh(a,b,c,d,e){c=c.render;var f=b.ref;lg(b,e);d=wh(a,b,c,d,f,e);if(null!==a&&!mg)return b.updateQueue=a.updateQueue,b.effectTag&=-517,a.expirationTime<=e&&(a.expirationTime=0),$h(a,b,e);b.effectTag|=1;R(a,b,d,e);return b.child}
	function ai(a,b,c,d,e,f){if(null===a){var g=c.type;if("function"===typeof g&&!bi(g)&&void 0===g.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=g,ci(a,b,g,d,e,f);a=Tg(c.type,null,d,null,b.mode,f);a.ref=b.ref;a.return=b;return b.child=a}g=a.child;if(e<f&&(e=g.memoizedProps,c=c.compare,c=null!==c?c:hf,c(e,d)&&a.ref===b.ref))return $h(a,b,f);b.effectTag|=1;a=Rg(g,d);a.ref=b.ref;a.return=b;return b.child=a}
	function ci(a,b,c,d,e,f){return null!==a&&hf(a.memoizedProps,d)&&a.ref===b.ref&&(mg=!1,e<f)?$h(a,b,f):di(a,b,c,d,f)}function ei(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.effectTag|=128;}function di(a,b,c,d,e){var f=N(c)?uf:J.current;f=vf(b,f);lg(b,e);c=wh(a,b,c,d,f,e);if(null!==a&&!mg)return b.updateQueue=a.updateQueue,b.effectTag&=-517,a.expirationTime<=e&&(a.expirationTime=0),$h(a,b,e);b.effectTag|=1;R(a,b,c,e);return b.child}
	function fi(a,b,c,d,e){if(N(c)){var f=!0;Bf(b);}else f=!1;lg(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=E),Kg(b,c,d),Mg(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=ng(l):(l=N(c)?uf:J.current,l=vf(b,l));var m=c.getDerivedStateFromProps,A="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;A||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&
	"function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Lg(b,g,d,l);og=!1;var w=b.memoizedState;k=g.state=w;var L=b.updateQueue;null!==L&&(xg(b,L,d,g,e),k=b.memoizedState);h!==d||w!==k||K.current||og?("function"===typeof m&&(Eg(b,c,m,d),k=b.memoizedState),(h=og||Jg(b,c,h,d,w,k,l))?(A||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&
	g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.effectTag|=4)):("function"===typeof g.componentDidMount&&(b.effectTag|=4),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.effectTag|=4),d=!1);}else g=b.stateNode,h=b.memoizedProps,g.props=b.type===b.elementType?h:cg(b.type,h),k=g.context,l=c.contextType,"object"===typeof l&&null!==l?l=ng(l):(l=N(c)?uf:J.current,l=vf(b,l)),m=c.getDerivedStateFromProps,(A=
	"function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Lg(b,g,d,l),og=!1,k=b.memoizedState,w=g.state=k,L=b.updateQueue,null!==L&&(xg(b,L,d,g,e),w=b.memoizedState),h!==d||k!==w||K.current||og?("function"===typeof m&&(Eg(b,c,m,d),w=b.memoizedState),(m=og||Jg(b,c,h,d,k,w,l))?(A||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||
	("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,w,l),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,w,l)),"function"===typeof g.componentDidUpdate&&(b.effectTag|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.effectTag|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&k===a.memoizedState||(b.effectTag|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&k===a.memoizedState||(b.effectTag|=256),b.memoizedProps=
	d,b.memoizedState=w),g.props=d,g.state=w,g.context=l,d=m):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&k===a.memoizedState||(b.effectTag|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&k===a.memoizedState||(b.effectTag|=256),d=!1);return gi(a,b,c,d,f,e)}
	function gi(a,b,c,d,e,f){ei(a,b);var g=(b.effectTag&64)!==D;if(!d&&!g)return e&&Cf(b,c,!1),$h(a,b,f);d=b.stateNode;Yh.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.effectTag|=1;null!==a&&g?(b.child=Wg(b,a.child,null,f),b.child=Wg(b,null,h,f)):R(a,b,h,f);b.memoizedState=d.state;e&&Cf(b,c,!0);return b.child}function hi(a){var b=a.stateNode;b.pendingContext?zf(a,b.pendingContext,b.pendingContext!==b.context):b.context&&zf(a,b.context,!1);ch(a,b.containerInfo);}
	var ii={dehydrated:null,retryTime:1};
	function ji(a,b,c){var d=b.mode,e=b.pendingProps,f=O.current,g=!1,h;(h=(b.effectTag&64)!==D)||(h=0!==(f&2)&&(null===a||null!==a.memoizedState));h?(g=!0,b.effectTag&=-65):null!==a&&null===a.memoizedState||void 0===e.fallback||!0===e.unstable_avoidThisFallback||(f|=1);I(O,f&1);if(null===a){if(g){g=e.fallback;e=Vg(null,d,0,null);e.return=b;if(0===(b.mode&2))for(a=null!==b.memoizedState?b.child.child:b.child,e.child=a;null!==a;)a.return=e,a=a.sibling;c=Vg(g,d,c,null);c.return=b;e.sibling=c;b.memoizedState=
	ii;b.child=e;return c}d=e.children;b.memoizedState=null;return b.child=Xg(b,null,d,c)}if(null!==a.memoizedState){a=a.child;d=a.sibling;if(g){e=e.fallback;c=Rg(a,a.pendingProps);c.return=b;if(0===(b.mode&2)&&(g=null!==b.memoizedState?b.child.child:b.child,g!==a.child))for(c.child=g;null!==g;)g.return=c,g=g.sibling;d=Rg(d,e,d.expirationTime);d.return=b;c.sibling=d;c.childExpirationTime=0;b.memoizedState=ii;b.child=c;return d}c=Wg(b,a.child,e.children,c);b.memoizedState=null;return b.child=c}a=a.child;
	if(g){g=e.fallback;e=Vg(null,d,0,null);e.return=b;e.child=a;null!==a&&(a.return=e);if(0===(b.mode&2))for(a=null!==b.memoizedState?b.child.child:b.child,e.child=a;null!==a;)a.return=e,a=a.sibling;c=Vg(g,d,c,null);c.return=b;e.sibling=c;c.effectTag|=E;e.childExpirationTime=0;b.memoizedState=ii;b.child=e;return c}b.memoizedState=null;return b.child=Wg(b,a,e.children,c)}
	function ki(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,last:d,tail:c,tailExpiration:0,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.last=d,f.tail=c,f.tailExpiration=0,f.tailMode=e);}
	function li(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;R(a,b,d.children,c);d=O.current;if(0!==(d&2))d=d&1|2,b.effectTag|=64;else{if(null!==a&&(a.effectTag&64)!==D)a:for(a=b.child;null!==a;){if(13===a.tag){if(null!==a.memoizedState){a.expirationTime<c&&(a.expirationTime=c);var g=a.alternate;null!==g&&g.expirationTime<c&&(g.expirationTime=c);kg(a.return,c);}}else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;
	a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}I(O,d);if(0===(b.mode&2))b.memoizedState=null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)d=c.alternate,null!==d&&null===gh(d)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);ki(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){d=e.alternate;if(null!==d&&null===gh(d)){b.child=e;break}d=e.sibling;e.sibling=c;c=e;e=d;}ki(b,!0,c,null,f);break;case "together":ki(b,
	!1,null,null,void 0);break;default:b.memoizedState=null;}return b.child}function $h(a,b,c){null!==a&&(b.dependencies=a.dependencies);var d=b.expirationTime;0!==d&&zg(d);if(b.childExpirationTime<c)return null;if(null!==a&&b.child!==a.child)throw t(Error(153));if(null!==b.child){a=b.child;c=Rg(a,a.pendingProps,a.expirationTime);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Rg(a,a.pendingProps,a.expirationTime),c.return=b;c.sibling=null;}return b.child}
	function mi(a){a.effectTag|=4;}var ni,oi,pi,qi;ni=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};oi=function(){};
	pi=function(a,b,c,d,e){var f=a.memoizedProps;if(f!==d){var g=b.stateNode;bh(Zg.current);a=null;switch(c){case "input":f=Ab(g,f);d=Ab(g,d);a=[];break;case "option":f=Ib(g,f);d=Ib(g,d);a=[];break;case "select":f=objectAssign({},f,{value:void 0});d=objectAssign({},d,{value:void 0});a=[];break;case "textarea":f=Kb(g,f);d=Kb(g,d);a=[];break;default:"function"!==typeof f.onClick&&"function"===typeof d.onClick&&(g.onclick=Td);}Qd(c,d);var h,k;c=null;for(h in f)if(!d.hasOwnProperty(h)&&f.hasOwnProperty(h)&&null!=f[h])if("style"===
	h)for(k in g=f[h],g)g.hasOwnProperty(k)&&(c||(c={}),c[k]="");else"dangerouslySetInnerHTML"!==h&&"children"!==h&&"suppressContentEditableWarning"!==h&&"suppressHydrationWarning"!==h&&"autoFocus"!==h&&(ia.hasOwnProperty(h)?a||(a=[]):(a=a||[]).push(h,null));for(h in d){var l=d[h];g=null!=f?f[h]:void 0;if(d.hasOwnProperty(h)&&l!==g&&(null!=l||null!=g))if("style"===h)if(g){for(k in g)!g.hasOwnProperty(k)||l&&l.hasOwnProperty(k)||(c||(c={}),c[k]="");for(k in l)l.hasOwnProperty(k)&&g[k]!==l[k]&&(c||(c={}),
	c[k]=l[k]);}else c||(a||(a=[]),a.push(h,c)),c=l;else"dangerouslySetInnerHTML"===h?(l=l?l.__html:void 0,g=g?g.__html:void 0,null!=l&&g!==l&&(a=a||[]).push(h,""+l)):"children"===h?g===l||"string"!==typeof l&&"number"!==typeof l||(a=a||[]).push(h,""+l):"suppressContentEditableWarning"!==h&&"suppressHydrationWarning"!==h&&(ia.hasOwnProperty(h)?(null!=l&&Sd(e,h),a||g===l||(a=[])):(a=a||[]).push(h,l));}c&&(a=a||[]).push("style",c);e=a;(b.updateQueue=e)&&mi(b);}};qi=function(a,b,c,d){c!==d&&mi(b);};
	function ri(a,b){switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
	function si(a){switch(a.tag){case 1:N(a.type)&&wf();var b=a.effectTag;return b&4096?(a.effectTag=b&-4097|64,a):null;case 3:dh();xf();b=a.effectTag;if((b&64)!==D)throw t(Error(285));a.effectTag=b&-4097|64;return a;case 5:return fh(a),null;case 13:return H(O),b=a.effectTag,b&4096?(a.effectTag=b&-4097|64,a):null;case 19:return H(O),null;case 4:return dh(),null;case 10:return jg(a),null;default:return null}}function ti(a,b){return {value:a,source:b,stack:Wa(b)}}
	var ui="function"===typeof WeakSet?WeakSet:Set;function vi(a,b){var c=b.source,d=b.stack;null===d&&null!==c&&(d=Wa(c));null!==c&&Va(c.type);b=b.value;null!==a&&1===a.tag&&Va(a.type);try{console.error(b);}catch(e){setTimeout(function(){throw e;});}}function wi(a,b){try{b.props=a.memoizedProps,b.state=a.memoizedState,b.componentWillUnmount();}catch(c){xi(a,c);}}function yi(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null);}catch(c){xi(a,c);}else b.current=null;}
	function Di(a,b){switch(b.tag){case 0:case 11:case 15:Ei(2,0,b);break;case 1:if(b.effectTag&256&&null!==a){var c=a.memoizedProps,d=a.memoizedState;a=b.stateNode;b=a.getSnapshotBeforeUpdate(b.elementType===b.type?c:cg(b.type,c),d);a.__reactInternalSnapshotBeforeUpdate=b;}break;case 3:case 5:case 6:case 4:case 17:break;default:throw t(Error(163));}}
	function Ei(a,b,c){c=c.updateQueue;c=null!==c?c.lastEffect:null;if(null!==c){var d=c=c.next;do{if(0!==(d.tag&a)){var e=d.destroy;d.destroy=void 0;void 0!==e&&e();}0!==(d.tag&b)&&(e=d.create,d.destroy=e());d=d.next;}while(d!==c)}}
	function Fi(a,b,c){"function"===typeof Gi&&Gi(b);switch(b.tag){case 0:case 11:case 14:case 15:a=b.updateQueue;if(null!==a&&(a=a.lastEffect,null!==a)){var d=a.next;Yf(97<c?97:c,function(){var a=d;do{var c=a.destroy;if(void 0!==c){var g=b;try{c();}catch(h){xi(g,h);}}a=a.next;}while(a!==d)});}break;case 1:yi(b);c=b.stateNode;"function"===typeof c.componentWillUnmount&&wi(b,c);break;case 5:yi(b);break;case 4:Hi(a,b,c);}}
	function Ii(a){var b=a.alternate;a.return=null;a.child=null;a.memoizedState=null;a.updateQueue=null;a.dependencies=null;a.alternate=null;a.firstEffect=null;a.lastEffect=null;a.pendingProps=null;a.memoizedProps=null;null!==b&&Ii(b);}function Ji(a){return 5===a.tag||3===a.tag||4===a.tag}
	function Ki(a){a:{for(var b=a.return;null!==b;){if(Ji(b)){var c=b;break a}b=b.return;}throw t(Error(160));}b=c.stateNode;switch(c.tag){case 5:var d=!1;break;case 3:b=b.containerInfo;d=!0;break;case 4:b=b.containerInfo;d=!0;break;default:throw t(Error(161));}c.effectTag&16&&(Tb(b,""),c.effectTag&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||Ji(c.return)){c=null;break a}c=c.return;}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag&&18!==c.tag;){if(c.effectTag&E)continue b;
	if(null===c.child||4===c.tag)continue b;else c.child.return=c,c=c.child;}if(!(c.effectTag&E)){c=c.stateNode;break a}}for(var e=a;;){var f=5===e.tag||6===e.tag;if(f){var g=f?e.stateNode:e.stateNode.instance;if(c)if(d){f=b;var h=g;g=c;8===f.nodeType?f.parentNode.insertBefore(h,g):f.insertBefore(h,g);}else b.insertBefore(g,c);else d?(h=b,8===h.nodeType?(f=h.parentNode,f.insertBefore(g,h)):(f=h,f.appendChild(g)),h=h._reactRootContainer,null!==h&&void 0!==h||null!==f.onclick||(f.onclick=Td)):b.appendChild(g);}else if(4!==
	e.tag&&null!==e.child){e.child.return=e;e=e.child;continue}if(e===a)break;for(;null===e.sibling;){if(null===e.return||e.return===a)return;e=e.return;}e.sibling.return=e.return;e=e.sibling;}}
	function Hi(a,b,c){for(var d=b,e=!1,f,g;;){if(!e){e=d.return;a:for(;;){if(null===e)throw t(Error(160));f=e.stateNode;switch(e.tag){case 5:g=!1;break a;case 3:f=f.containerInfo;g=!0;break a;case 4:f=f.containerInfo;g=!0;break a}e=e.return;}e=!0;}if(5===d.tag||6===d.tag){a:for(var h=a,k=d,l=c,m=k;;)if(Fi(h,m,l),null!==m.child&&4!==m.tag)m.child.return=m,m=m.child;else{if(m===k)break;for(;null===m.sibling;){if(null===m.return||m.return===k)break a;m=m.return;}m.sibling.return=m.return;m=m.sibling;}g?(h=
	f,k=d.stateNode,8===h.nodeType?h.parentNode.removeChild(k):h.removeChild(k)):f.removeChild(d.stateNode);}else if(4===d.tag){if(null!==d.child){f=d.stateNode.containerInfo;g=!0;d.child.return=d;d=d.child;continue}}else if(Fi(a,d,c),null!==d.child){d.child.return=d;d=d.child;continue}if(d===b)break;for(;null===d.sibling;){if(null===d.return||d.return===b)return;d=d.return;4===d.tag&&(e=!1);}d.sibling.return=d.return;d=d.sibling;}}
	function Li(a,b){switch(b.tag){case 0:case 11:case 14:case 15:Ei(4,8,b);break;case 1:break;case 5:var c=b.stateNode;if(null!=c){var d=b.memoizedProps,e=null!==a?a.memoizedProps:d;a=b.type;var f=b.updateQueue;b.updateQueue=null;if(null!==f){c[ne]=d;"input"===a&&"radio"===d.type&&null!=d.name&&Cb(c,d);Rd(a,e);b=Rd(a,d);for(e=0;e<f.length;e+=2){var g=f[e],h=f[e+1];"style"===g?Od(c,h):"dangerouslySetInnerHTML"===g?Sb(c,h):"children"===g?Tb(c,h):ub(c,g,h,b);}switch(a){case "input":Db(c,d);break;case "textarea":Mb(c,
	d);break;case "select":b=c._wrapperState.wasMultiple,c._wrapperState.wasMultiple=!!d.multiple,a=d.value,null!=a?Jb(c,!!d.multiple,a,!1):b!==!!d.multiple&&(null!=d.defaultValue?Jb(c,!!d.multiple,d.defaultValue,!0):Jb(c,!!d.multiple,d.multiple?[]:"",!1));}}}break;case 6:if(null===b.stateNode)throw t(Error(162));b.stateNode.nodeValue=b.memoizedProps;break;case 3:b=b.stateNode;b.hydrate&&(b.hydrate=!1,zc(b.containerInfo));break;case 12:break;case 13:c=b;null===b.memoizedState?d=!1:(d=!0,c=b.child,Mi=Vf());
	if(null!==c)a:for(a=c;;){if(5===a.tag)f=a.stateNode,d?(f=f.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(f=a.stateNode,e=a.memoizedProps.style,e=void 0!==e&&null!==e&&e.hasOwnProperty("display")?e.display:null,f.style.display=Nd("display",e));else if(6===a.tag)a.stateNode.nodeValue=d?"":a.memoizedProps;else if(13===a.tag&&null!==a.memoizedState&&null===a.memoizedState.dehydrated){f=a.child.sibling;f.return=a;a=f;continue}else if(null!==a.child){a.child.return=
	a;a=a.child;continue}if(a===c)break a;for(;null===a.sibling;){if(null===a.return||a.return===c)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}Ni(b);break;case 19:Ni(b);break;case 17:break;case 20:break;case 21:break;default:throw t(Error(163));}}function Ni(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new ui);b.forEach(function(b){var d=Oi.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}var Pi="function"===typeof WeakMap?WeakMap:Map;
	function Qi(a,b,c){c=rg(c,null);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Ri||(Ri=!0,Si=d);vi(a,b);};return c}
	function Ti(a,b,c){c=rg(c,null);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){vi(a,b);return d(e)};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){"function"!==typeof d&&(null===Ui?Ui=new Set([this]):Ui.add(this),vi(a,b));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}
	var Vi=Math.ceil,Wi=Da.ReactCurrentDispatcher,Xi=Da.ReactCurrentOwner,S=0,Yi=8,Zi=16,$i=32,aj=0,bj=1,cj=2,dj=3,ej=4,fj=5,gj=6,T=S,U=null,V=null,W=0,X=aj,hj=null,ij=1073741823,jj=1073741823,kj=null,lj=0,mj=!1,Mi=0,nj=500,Y=null,Ri=!1,Si=null,Ui=null,oj=!1,pj=null,qj=90,rj=null,sj=0,tj=null,uj=0;function Fg(){return (T&(Zi|$i))!==S?1073741821-(Vf()/10|0):0!==uj?uj:uj=1073741821-(Vf()/10|0)}
	function Gg(a,b,c){b=b.mode;if(0===(b&2))return 1073741823;var d=Wf();if(0===(b&4))return 99===d?1073741823:1073741822;if((T&Zi)!==S)return W;if(null!==c)a=1073741821-25*(((1073741821-a+(c.timeoutMs|0||5E3)/10)/25|0)+1);else switch(d){case 99:a=1073741823;break;case 98:a=1073741821-10*(((1073741821-a+15)/10|0)+1);break;case 97:case 96:a=1073741821-25*(((1073741821-a+500)/25|0)+1);break;case 95:a=2;break;default:throw t(Error(326));}null!==U&&a===W&&--a;return a}var vj=0;
	function Hg(a,b){if(50<sj)throw sj=0,tj=null,t(Error(185));a=wj(a,b);if(null!==a){var c=Wf();1073741823===b?(T&Yi)!==S&&(T&(Zi|$i))===S?xj(a):(Z(a),T===S&&bg()):Z(a);(T&4)===S||98!==c&&99!==c||(null===rj?rj=new Map([[a,b]]):(c=rj.get(a),(void 0===c||c>b)&&rj.set(a,b)));}}
	function wj(a,b){a.expirationTime<b&&(a.expirationTime=b);var c=a.alternate;null!==c&&c.expirationTime<b&&(c.expirationTime=b);var d=a.return,e=null;if(null===d&&3===a.tag)e=a.stateNode;else for(;null!==d;){c=d.alternate;d.childExpirationTime<b&&(d.childExpirationTime=b);null!==c&&c.childExpirationTime<b&&(c.childExpirationTime=b);if(null===d.return&&3===d.tag){e=d.stateNode;break}d=d.return;}null!==e&&(U===e&&(zg(b),X===ej&&yj(e,W)),zj(e,b));return e}
	function Aj(a){var b=a.lastExpiredTime;if(0!==b)return b;b=a.firstPendingTime;if(!Bj(a,b))return b;b=a.lastPingedTime;a=a.nextKnownPendingLevel;return b>a?b:a}
	function Z(a){if(0!==a.lastExpiredTime)a.callbackExpirationTime=1073741823,a.callbackPriority=99,a.callbackNode=$f(xj.bind(null,a));else{var b=Aj(a),c=a.callbackNode;if(0===b)null!==c&&(a.callbackNode=null,a.callbackExpirationTime=0,a.callbackPriority=90);else{var d=Fg();1073741823===b?d=99:1===b||2===b?d=95:(d=10*(1073741821-b)-10*(1073741821-d),d=0>=d?99:250>=d?98:5250>=d?97:95);if(null!==c){var e=a.callbackPriority;if(a.callbackExpirationTime===b&&e>=d)return;c!==Pf&&Ff(c);}a.callbackExpirationTime=
	b;a.callbackPriority=d;b=1073741823===b?$f(xj.bind(null,a)):Zf(d,Cj.bind(null,a),{timeout:10*(1073741821-b)-Vf()});a.callbackNode=b;}}}
	function Cj(a,b){uj=0;if(b)return b=Fg(),Dj(a,b),Z(a),null;var c=Aj(a);if(0!==c){b=a.callbackNode;if((T&(Zi|$i))!==S)throw t(Error(327));Ej();a===U&&c===W||Fj(a,c);if(null!==V){var d=T;T|=Zi;var e=Gj();do try{Hj();break}catch(h){Ij(a,h);}while(1);hg();T=d;Wi.current=e;if(X===bj)throw b=hj,Fj(a,c),yj(a,c),Z(a),b;if(null===V)switch(e=a.finishedWork=a.current.alternate,a.finishedExpirationTime=c,Jj(a,c),d=X,U=null,d){case aj:case bj:throw t(Error(345));case cj:if(2!==c){Dj(a,2);break}Kj(a);break;case dj:yj(a,
	c);d=a.lastSuspendedTime;c===d&&(a.nextKnownPendingLevel=Lj(e));if(1073741823===ij&&(e=Mi+nj-Vf(),10<e)){if(mj){var f=a.lastPingedTime;if(0===f||f>=c){a.lastPingedTime=c;Fj(a,c);break}}f=Aj(a);if(0!==f&&f!==c)break;if(0!==d&&d!==c){a.lastPingedTime=d;break}a.timeoutHandle=he(Kj.bind(null,a),e);break}Kj(a);break;case ej:yj(a,c);d=a.lastSuspendedTime;c===d&&(a.nextKnownPendingLevel=Lj(e));if(mj&&(e=a.lastPingedTime,0===e||e>=c)){a.lastPingedTime=c;Fj(a,c);break}e=Aj(a);if(0!==e&&e!==c)break;if(0!==
	d&&d!==c){a.lastPingedTime=d;break}1073741823!==jj?d=10*(1073741821-jj)-Vf():1073741823===ij?d=0:(d=10*(1073741821-ij)-5E3,e=Vf(),c=10*(1073741821-c)-e,d=e-d,0>d&&(d=0),d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*Vi(d/1960))-d,c<d&&(d=c));if(10<d){a.timeoutHandle=he(Kj.bind(null,a),d);break}Kj(a);break;case fj:if(1073741823!==ij&&null!==kj){f=ij;var g=kj;d=g.busyMinDurationMs|0;0>=d?d=0:(e=g.busyDelayMs|0,f=Vf()-(10*(1073741821-f)-(g.timeoutMs|0||5E3)),d=f<=e?0:e+d-f);
	if(10<d){yj(a,c);a.timeoutHandle=he(Kj.bind(null,a),d);break}}Kj(a);break;case gj:yj(a,c);break;default:throw t(Error(329));}Z(a);if(a.callbackNode===b)return Cj.bind(null,a)}}return null}
	function xj(a){var b=a.lastExpiredTime;b=0!==b?b:1073741823;if(a.finishedExpirationTime===b)Kj(a);else{if((T&(Zi|$i))!==S)throw t(Error(327));Ej();a===U&&b===W||Fj(a,b);if(null!==V){var c=T;T|=Zi;var d=Gj();do try{Mj();break}catch(e){Ij(a,e);}while(1);hg();T=c;Wi.current=d;if(X===bj)throw c=hj,Fj(a,b),yj(a,b),Z(a),c;if(null!==V)throw t(Error(261));a.finishedWork=a.current.alternate;a.finishedExpirationTime=b;Jj(a,b);X===gj?yj(a,b):(U=null,Kj(a));Z(a);}}return null}
	function Nj(){(T&(1|Zi|$i))===S&&(Oj(),Ej());}function Jj(a,b){var c=a.firstBatch;null!==c&&c._defer&&c._expirationTime>=b&&(Zf(97,function(){c._onComplete();return null}),X=gj);}function Oj(){if(null!==rj){var a=rj;rj=null;a.forEach(function(a,c){Dj(c,a);Z(c);});bg();}}function Pj(a,b){var c=T;T|=1;try{return a(b)}finally{T=c,T===S&&bg();}}function Qj(a,b,c,d){var e=T;T|=4;try{return Yf(98,a.bind(null,b,c,d))}finally{T=e,T===S&&bg();}}
	function Rj(a,b){var c=T;T&=-2;T|=Yi;try{return a(b)}finally{T=c,T===S&&bg();}}
	function Fj(a,b){a.finishedWork=null;a.finishedExpirationTime=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,ie(c));if(null!==V)for(c=V.return;null!==c;){var d=c;switch(d.tag){case 1:var e=d.type.childContextTypes;null!==e&&void 0!==e&&wf();break;case 3:dh();xf();break;case 5:fh(d);break;case 4:dh();break;case 13:H(O);break;case 19:H(O);break;case 10:jg(d);}c=c.return;}U=a;V=Rg(a.current,null);W=b;X=aj;hj=null;jj=ij=1073741823;kj=null;lj=0;mj=!1;}
	function Ij(a,b){do{try{hg();Ah();if(null===V||null===V.return)return X=bj,hj=b,null;a:{var c=a,d=V.return,e=V,f=b;b=W;e.effectTag|=2048;e.firstEffect=e.lastEffect=null;if(null!==f&&"object"===typeof f&&"function"===typeof f.then){var g=f,h=0!==(O.current&1),k=d;do{var l;if(l=13===k.tag){var m=k.memoizedState;if(null!==m)l=null!==m.dehydrated?!0:!1;else{var A=k.memoizedProps;l=void 0===A.fallback?!1:!0!==A.unstable_avoidThisFallback?!0:h?!1:!0;}}if(l){var w=k.updateQueue;if(null===w){var L=new Set;
	L.add(g);k.updateQueue=L;}else w.add(g);if(0===(k.mode&2)){k.effectTag|=64;e.effectTag&=-2981;if(1===e.tag)if(null===e.alternate)e.tag=17;else{var wb=rg(1073741823,null);wb.tag=2;tg(e,wb);}e.expirationTime=1073741823;break a}f=void 0;e=b;var M=c.pingCache;null===M?(M=c.pingCache=new Pi,f=new Set,M.set(g,f)):(f=M.get(g),void 0===f&&(f=new Set,M.set(g,f)));if(!f.has(e)){f.add(e);var q=Sj.bind(null,c,g,e);g.then(q,q);}k.effectTag|=4096;k.expirationTime=b;break a}k=k.return;}while(null!==k);f=Error((Va(e.type)||
	"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display."+Wa(e));}X!==fj&&(X=cj);f=ti(f,e);k=d;do{switch(k.tag){case 3:g=f;k.effectTag|=4096;k.expirationTime=b;var y=Qi(k,g,b);ug(k,y);break a;case 1:g=f;var z=k.type,p=k.stateNode;if((k.effectTag&64)===D&&("function"===typeof z.getDerivedStateFromError||null!==p&&"function"===typeof p.componentDidCatch&&
	(null===Ui||!Ui.has(p)))){k.effectTag|=4096;k.expirationTime=b;var u=Ti(k,g,b);ug(k,u);break a}}k=k.return;}while(null!==k)}V=Tj(V);}catch(v){b=v;continue}break}while(1)}function Gj(){var a=Wi.current;Wi.current=zh;return null===a?zh:a}function yg(a,b){a<ij&&2<a&&(ij=a);null!==b&&a<jj&&2<a&&(jj=a,kj=b);}function zg(a){a>lj&&(lj=a);}function Mj(){for(;null!==V;)V=Uj(V);}function Hj(){for(;null!==V&&!Gf();)V=Uj(V);}
	function Uj(a){var b=Vj(a.alternate,a,W);a.memoizedProps=a.pendingProps;null===b&&(b=Tj(a));Xi.current=null;return b}
	function Tj(a){V=a;do{var b=V.alternate;a=V.return;if((V.effectTag&2048)===D){a:{var c=b;b=V;var d=W,e=b.pendingProps;switch(b.tag){case 2:break;case 16:break;case 15:case 0:break;case 1:N(b.type)&&wf();break;case 3:dh();xf();d=b.stateNode;d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);(null===c||null===c.child)&&Wh(b)&&mi(b);oi(b);break;case 5:fh(b);d=bh(ah.current);var f=b.type;if(null!==c&&null!=b.stateNode)pi(c,b,f,e,d),c.ref!==b.ref&&(b.effectTag|=128);else if(e){var g=
	bh(Zg.current);if(Wh(b)){e=b;f=void 0;c=e.stateNode;var h=e.type,k=e.memoizedProps;c[me]=e;c[ne]=k;switch(h){case "iframe":case "object":case "embed":G("load",c);break;case "video":case "audio":for(var l=0;l<dc.length;l++)G(dc[l],c);break;case "source":G("error",c);break;case "img":case "image":case "link":G("error",c);G("load",c);break;case "form":G("reset",c);G("submit",c);break;case "details":G("toggle",c);break;case "input":Bb(c,k);G("invalid",c);Sd(d,"onChange");break;case "select":c._wrapperState=
	{wasMultiple:!!k.multiple};G("invalid",c);Sd(d,"onChange");break;case "textarea":Lb(c,k),G("invalid",c),Sd(d,"onChange");}Qd(h,k);l=null;for(f in k)k.hasOwnProperty(f)&&(g=k[f],"children"===f?"string"===typeof g?c.textContent!==g&&(l=["children",g]):"number"===typeof g&&c.textContent!==""+g&&(l=["children",""+g]):ia.hasOwnProperty(f)&&null!=g&&Sd(d,f));switch(h){case "input":yb(c);Gb(c,k,!0);break;case "textarea":yb(c);Nb(c);break;case "select":case "option":break;default:"function"===typeof k.onClick&&
	(c.onclick=Td);}d=l;e.updateQueue=d;null!==d&&mi(b);}else{k=f;c=e;h=b;l=9===d.nodeType?d:d.ownerDocument;g===Ob.html&&(g=Pb(k));g===Ob.html?"script"===k?(k=l.createElement("div"),k.innerHTML="<script>\x3c/script>",l=k.removeChild(k.firstChild)):"string"===typeof c.is?l=l.createElement(k,{is:c.is}):(l=l.createElement(k),"select"===k&&(k=l,c.multiple?k.multiple=!0:c.size&&(k.size=c.size))):l=l.createElementNS(g,k);k=l;k[me]=h;k[ne]=c;c=k;ni(c,b,!1,!1);b.stateNode=c;g=d;var m=Rd(f,e);switch(f){case "iframe":case "object":case "embed":G("load",
	c);d=e;break;case "video":case "audio":for(d=0;d<dc.length;d++)G(dc[d],c);d=e;break;case "source":G("error",c);d=e;break;case "img":case "image":case "link":G("error",c);G("load",c);d=e;break;case "form":G("reset",c);G("submit",c);d=e;break;case "details":G("toggle",c);d=e;break;case "input":Bb(c,e);d=Ab(c,e);G("invalid",c);Sd(g,"onChange");break;case "option":d=Ib(c,e);break;case "select":c._wrapperState={wasMultiple:!!e.multiple};d=objectAssign({},e,{value:void 0});G("invalid",c);Sd(g,"onChange");break;case "textarea":Lb(c,
	e);d=Kb(c,e);G("invalid",c);Sd(g,"onChange");break;default:d=e;}Qd(f,d);h=void 0;k=f;l=c;var A=d;for(h in A)if(A.hasOwnProperty(h)){var w=A[h];"style"===h?Od(l,w):"dangerouslySetInnerHTML"===h?(w=w?w.__html:void 0,null!=w&&Sb(l,w)):"children"===h?"string"===typeof w?("textarea"!==k||""!==w)&&Tb(l,w):"number"===typeof w&&Tb(l,""+w):"suppressContentEditableWarning"!==h&&"suppressHydrationWarning"!==h&&"autoFocus"!==h&&(ia.hasOwnProperty(h)?null!=w&&Sd(g,h):null!=w&&ub(l,h,w,m));}switch(f){case "input":yb(c);
	Gb(c,e,!1);break;case "textarea":yb(c);Nb(c);break;case "option":null!=e.value&&c.setAttribute("value",""+tb(e.value));break;case "select":d=c;c=e;d.multiple=!!c.multiple;h=c.value;null!=h?Jb(d,!!c.multiple,h,!1):null!=c.defaultValue&&Jb(d,!!c.multiple,c.defaultValue,!0);break;default:"function"===typeof d.onClick&&(c.onclick=Td);}fe(f,e)&&mi(b);}null!==b.ref&&(b.effectTag|=128);}else if(null===b.stateNode)throw t(Error(166));break;case 6:if(c&&null!=b.stateNode)qi(c,b,c.memoizedProps,e);else{if("string"!==
	typeof e&&null===b.stateNode)throw t(Error(166));f=bh(ah.current);bh(Zg.current);Wh(b)?(d=b.stateNode,e=b.memoizedProps,d[me]=b,d.nodeValue!==e&&mi(b)):(d=b,e=(9===f.nodeType?f:f.ownerDocument).createTextNode(e),e[me]=b,d.stateNode=e);}break;case 11:break;case 13:H(O);e=b.memoizedState;if((b.effectTag&64)!==D){b.expirationTime=d;break a}d=null!==e;e=!1;null===c?Wh(b):(f=c.memoizedState,e=null!==f,d||null===f||(f=c.child.sibling,null!==f&&(h=b.firstEffect,null!==h?(b.firstEffect=f,f.nextEffect=h):
	(b.firstEffect=b.lastEffect=f,f.nextEffect=null),f.effectTag=8)));if(d&&!e&&0!==(b.mode&2))if(null===c&&!0!==b.memoizedProps.unstable_avoidThisFallback||0!==(O.current&1))X===aj&&(X=dj);else{if(X===aj||X===dj)X=ej;0!==lj&&null!==U&&(yj(U,W),zj(U,lj));}if(d||e)b.effectTag|=4;break;case 7:break;case 8:break;case 12:break;case 4:dh();oi(b);break;case 10:jg(b);break;case 9:break;case 14:break;case 17:N(b.type)&&wf();break;case 19:H(O);e=b.memoizedState;if(null===e)break;f=(b.effectTag&64)!==D;h=e.rendering;
	if(null===h)if(f)ri(e,!1);else{if(X!==aj||null!==c&&(c.effectTag&64)!==D)for(c=b.child;null!==c;){h=gh(c);if(null!==h){b.effectTag|=64;ri(e,!1);e=h.updateQueue;null!==e&&(b.updateQueue=e,b.effectTag|=4);b.firstEffect=b.lastEffect=null;for(e=b.child;null!==e;)f=e,c=d,f.effectTag&=E,f.nextEffect=null,f.firstEffect=null,f.lastEffect=null,h=f.alternate,null===h?(f.childExpirationTime=0,f.expirationTime=c,f.child=null,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null):(f.childExpirationTime=
	h.childExpirationTime,f.expirationTime=h.expirationTime,f.child=h.child,f.memoizedProps=h.memoizedProps,f.memoizedState=h.memoizedState,f.updateQueue=h.updateQueue,c=h.dependencies,f.dependencies=null===c?null:{expirationTime:c.expirationTime,firstContext:c.firstContext,responders:c.responders}),e=e.sibling;I(O,O.current&1|2);b=b.child;break a}c=c.sibling;}}else{if(!f)if(c=gh(h),null!==c){if(b.effectTag|=64,f=!0,ri(e,!0),null===e.tail&&"hidden"===e.tailMode){d=c.updateQueue;null!==d&&(b.updateQueue=
	d,b.effectTag|=4);b=b.lastEffect=e.lastEffect;null!==b&&(b.nextEffect=null);break}}else Vf()>e.tailExpiration&&1<d&&(b.effectTag|=64,f=!0,ri(e,!1),b.expirationTime=b.childExpirationTime=d-1);e.isBackwards?(h.sibling=b.child,b.child=h):(d=e.last,null!==d?d.sibling=h:b.child=h,e.last=h);}if(null!==e.tail){0===e.tailExpiration&&(e.tailExpiration=Vf()+500);d=e.tail;e.rendering=d;e.tail=d.sibling;e.lastEffect=b.lastEffect;d.sibling=null;e=O.current;e=f?e&1|2:e&1;I(O,e);b=d;break a}break;case 20:break;
	case 21:break;default:throw t(Error(156),b.tag);}b=null;}d=V;if(1===W||1!==d.childExpirationTime){e=0;for(f=d.child;null!==f;)c=f.expirationTime,h=f.childExpirationTime,c>e&&(e=c),h>e&&(e=h),f=f.sibling;d.childExpirationTime=e;}if(null!==b)return b;null!==a&&(a.effectTag&2048)===D&&(null===a.firstEffect&&(a.firstEffect=V.firstEffect),null!==V.lastEffect&&(null!==a.lastEffect&&(a.lastEffect.nextEffect=V.firstEffect),a.lastEffect=V.lastEffect),1<V.effectTag&&(null!==a.lastEffect?a.lastEffect.nextEffect=
	V:a.firstEffect=V,a.lastEffect=V));}else{b=si(V);if(null!==b)return b.effectTag&=2047,b;null!==a&&(a.firstEffect=a.lastEffect=null,a.effectTag|=2048);}b=V.sibling;if(null!==b)return b;V=a;}while(null!==V);X===aj&&(X=fj);return null}function Lj(a){var b=a.expirationTime;a=a.childExpirationTime;return b>a?b:a}function Kj(a){var b=Wf();Yf(99,Wj.bind(null,a,b));return null}
	function Wj(a,b){Ej();if((T&(Zi|$i))!==S)throw t(Error(327));var c=a.finishedWork,d=a.finishedExpirationTime;if(null===c)return null;a.finishedWork=null;a.finishedExpirationTime=0;if(c===a.current)throw t(Error(177));a.callbackNode=null;a.callbackExpirationTime=0;a.callbackPriority=90;a.nextKnownPendingLevel=0;var e=Lj(c);a.firstPendingTime=e;d<=a.lastSuspendedTime?a.firstSuspendedTime=a.lastSuspendedTime=a.nextKnownPendingLevel=0:d<=a.firstSuspendedTime&&(a.firstSuspendedTime=d-1);d<=a.lastPingedTime&&
	(a.lastPingedTime=0);d<=a.lastExpiredTime&&(a.lastExpiredTime=0);a===U&&(V=U=null,W=0);1<c.effectTag?null!==c.lastEffect?(c.lastEffect.nextEffect=c,e=c.firstEffect):e=c:e=c.firstEffect;if(null!==e){var f=T;T|=$i;Xi.current=null;de=Dd;var g=Yd();if(Zd(g)){if("selectionStart"in g)var h={start:g.selectionStart,end:g.selectionEnd};else a:{h=(h=g.ownerDocument)&&h.defaultView||window;var k=h.getSelection&&h.getSelection();if(k&&0!==k.rangeCount){h=k.anchorNode;var l=k.anchorOffset,m=k.focusNode;k=k.focusOffset;
	try{h.nodeType,m.nodeType;}catch(Fb){h=null;break a}var A=0,w=-1,L=-1,wb=0,M=0,q=g,y=null;b:for(;;){for(var z;;){q!==h||0!==l&&3!==q.nodeType||(w=A+l);q!==m||0!==k&&3!==q.nodeType||(L=A+k);3===q.nodeType&&(A+=q.nodeValue.length);if(null===(z=q.firstChild))break;y=q;q=z;}for(;;){if(q===g)break b;y===h&&++wb===l&&(w=A);y===m&&++M===k&&(L=A);if(null!==(z=q.nextSibling))break;q=y;y=q.parentNode;}q=z;}h=-1===w||-1===L?null:{start:w,end:L};}else h=null;}h=h||{start:0,end:0};}else h=null;ee={focusedElem:g,selectionRange:h};
	Dd=!1;Y=e;do try{Xj();}catch(Fb){if(null===Y)throw t(Error(330));xi(Y,Fb);Y=Y.nextEffect;}while(null!==Y);Y=e;do try{for(g=a,h=b;null!==Y;){var p=Y.effectTag;p&16&&Tb(Y.stateNode,"");if(p&128){var u=Y.alternate;if(null!==u){var v=u.ref;null!==v&&("function"===typeof v?v(null):v.current=null);}}switch(p&(E|12|Ac)){case E:Ki(Y);Y.effectTag&=~E;break;case 6:Ki(Y);Y.effectTag&=~E;Li(Y.alternate,Y);break;case Ac:Y.effectTag&=~Ac;break;case 1028:Y.effectTag&=~Ac;Li(Y.alternate,Y);break;case 4:Li(Y.alternate,
	Y);break;case 8:l=Y,Hi(g,l,h),Ii(l);}Y=Y.nextEffect;}}catch(Fb){if(null===Y)throw t(Error(330));xi(Y,Fb);Y=Y.nextEffect;}while(null!==Y);v=ee;u=Yd();p=v.focusedElem;h=v.selectionRange;if(u!==p&&p&&p.ownerDocument&&Xd(p.ownerDocument.documentElement,p)){null!==h&&Zd(p)&&(u=h.start,v=h.end,void 0===v&&(v=u),"selectionStart"in p?(p.selectionStart=u,p.selectionEnd=Math.min(v,p.value.length)):(v=(u=p.ownerDocument||document)&&u.defaultView||window,v.getSelection&&(v=v.getSelection(),l=p.textContent.length,
	g=Math.min(h.start,l),h=void 0===h.end?g:Math.min(h.end,l),!v.extend&&g>h&&(l=h,h=g,g=l),l=Wd(p,g),m=Wd(p,h),l&&m&&(1!==v.rangeCount||v.anchorNode!==l.node||v.anchorOffset!==l.offset||v.focusNode!==m.node||v.focusOffset!==m.offset)&&(u=u.createRange(),u.setStart(l.node,l.offset),v.removeAllRanges(),g>h?(v.addRange(u),v.extend(m.node,m.offset)):(u.setEnd(m.node,m.offset),v.addRange(u))))));u=[];for(v=p;v=v.parentNode;)1===v.nodeType&&u.push({element:v,left:v.scrollLeft,top:v.scrollTop});"function"===
	typeof p.focus&&p.focus();for(p=0;p<u.length;p++)v=u[p],v.element.scrollLeft=v.left,v.element.scrollTop=v.top;}ee=null;Dd=!!de;de=null;a.current=c;Y=e;do try{for(p=d;null!==Y;){var Bh=Y.effectTag;if(Bh&36){var cc=Y.alternate;u=Y;v=p;switch(u.tag){case 0:case 11:case 15:Ei(16,32,u);break;case 1:var ed=u.stateNode;if(u.effectTag&4)if(null===cc)ed.componentDidMount();else{var Zj=u.elementType===u.type?cc.memoizedProps:cg(u.type,cc.memoizedProps);ed.componentDidUpdate(Zj,cc.memoizedState,ed.__reactInternalSnapshotBeforeUpdate);}var Ch=
	u.updateQueue;null!==Ch&&Ag(u,Ch,ed,v);break;case 3:var Dh=u.updateQueue;if(null!==Dh){g=null;if(null!==u.child)switch(u.child.tag){case 5:g=u.child.stateNode;break;case 1:g=u.child.stateNode;}Ag(u,Dh,g,v);}break;case 5:var pk=u.stateNode;null===cc&&u.effectTag&4&&(v=pk,fe(u.type,u.memoizedProps)&&v.focus());break;case 6:break;case 4:break;case 12:break;case 13:if(null===u.memoizedState){var zi=u.alternate;if(null!==zi){var Ai=zi.memoizedState;if(null!==Ai){var Bi=Ai.dehydrated;null!==Bi&&zc(Bi);}}}break;
	case 19:case 17:case 20:case 21:break;default:throw t(Error(163));}}if(Bh&128){u=Y;var yd=u.ref;if(null!==yd){var Ci=u.stateNode;switch(u.tag){case 5:var yf=Ci;break;default:yf=Ci;}"function"===typeof yd?yd(yf):yd.current=yf;}}Y=Y.nextEffect;}}catch(Fb){if(null===Y)throw t(Error(330));xi(Y,Fb);Y=Y.nextEffect;}while(null!==Y);Y=null;Qf();T=f;}else a.current=c;if(oj)oj=!1,pj=a,qj=b;else for(Y=e;null!==Y;)b=Y.nextEffect,Y.nextEffect=null,Y=b;b=a.firstPendingTime;0===b&&(Ui=null);1073741823===b?a===tj?sj++:
	(sj=0,tj=a):sj=0;"function"===typeof Yj&&Yj(c.stateNode,d);Z(a);if(Ri)throw Ri=!1,a=Si,Si=null,a;if((T&Yi)!==S)return null;bg();return null}function Xj(){for(;null!==Y;){var a=Y.effectTag;(a&256)!==D&&Di(Y.alternate,Y);(a&512)===D||oj||(oj=!0,Zf(97,function(){Ej();return null}));Y=Y.nextEffect;}}function Ej(){if(90!==qj){var a=97<qj?97:qj;qj=90;return Yf(a,ak)}}
	function ak(){if(null===pj)return !1;var a=pj;pj=null;if((T&(Zi|$i))!==S)throw t(Error(331));var b=T;T|=$i;for(a=a.current.firstEffect;null!==a;){try{var c=a;if((c.effectTag&512)!==D)switch(c.tag){case 0:case 11:case 15:Ei(128,0,c),Ei(0,64,c);}}catch(d){if(null===a)throw t(Error(330));xi(a,d);}c=a.nextEffect;a.nextEffect=null;a=c;}T=b;bg();return !0}function bk(a,b,c){b=ti(c,b);b=Qi(a,b,1073741823);tg(a,b);a=wj(a,1073741823);null!==a&&Z(a);}
	function xi(a,b){if(3===a.tag)bk(a,a,b);else for(var c=a.return;null!==c;){if(3===c.tag){bk(c,a,b);break}else if(1===c.tag){var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ui||!Ui.has(d))){a=ti(b,a);a=Ti(c,a,1073741823);tg(c,a);c=wj(c,1073741823);null!==c&&Z(c);break}}c=c.return;}}
	function Sj(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);U===a&&W===c?X===ej||X===dj&&1073741823===ij&&Vf()-Mi<nj?Fj(a,W):mj=!0:Bj(a,c)&&(b=a.lastPingedTime,0!==b&&b<c||(a.lastPingedTime=c,a.finishedExpirationTime===c&&(a.finishedExpirationTime=0,a.finishedWork=null),Z(a)));}function Oi(a,b){var c=a.stateNode;null!==c&&c.delete(b);b=1;1===b&&(b=Fg(),b=Gg(b,a,null));a=wj(a,b);null!==a&&Z(a);}var Vj;
	Vj=function(a,b,c){var d=b.expirationTime;if(null!==a){var e=b.pendingProps;if(a.memoizedProps!==e||K.current)mg=!0;else{if(d<c){mg=!1;switch(b.tag){case 3:hi(b);Xh();break;case 5:eh(b);if(b.mode&4&&1!==c&&e.hidden)return b.expirationTime=b.childExpirationTime=1,null;break;case 1:N(b.type)&&Bf(b);break;case 4:ch(b,b.stateNode.containerInfo);break;case 10:ig(b,b.memoizedProps.value);break;case 13:if(null!==b.memoizedState){d=b.child.childExpirationTime;if(0!==d&&d>=c)return ji(a,b,c);I(O,O.current&
	1);b=$h(a,b,c);return null!==b?b.sibling:null}I(O,O.current&1);break;case 19:d=b.childExpirationTime>=c;if((a.effectTag&64)!==D){if(d)return li(a,b,c);b.effectTag|=64;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null);I(O,O.current);if(!d)return null}return $h(a,b,c)}mg=!1;}}else mg=!1;b.expirationTime=0;switch(b.tag){case 2:d=b.type;null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=E);a=b.pendingProps;e=vf(b,J.current);lg(b,c);e=wh(null,b,d,a,e,c);b.effectTag|=1;if("object"===
	typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof){b.tag=1;Ah();if(N(d)){var f=!0;Bf(b);}else f=!1;b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null;var g=d.getDerivedStateFromProps;"function"===typeof g&&Eg(b,d,g,a);e.updater=Ig;b.stateNode=e;e._reactInternalFiber=b;Mg(b,d,a,c);b=gi(null,b,d,!0,f,c);}else b.tag=0,R(null,b,e,c),b=b.child;return b;case 16:e=b.elementType;null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=E);a=b.pendingProps;Ua(e);if(1!==e._status)throw e._result;
	e=e._result;b.type=e;f=b.tag=ck(e);a=cg(e,a);switch(f){case 0:b=di(null,b,e,a,c);break;case 1:b=fi(null,b,e,a,c);break;case 11:b=Zh(null,b,e,a,c);break;case 14:b=ai(null,b,e,cg(e.type,a),d,c);break;default:throw t(Error(306),e,"");}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:cg(d,e),di(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:cg(d,e),fi(a,b,d,e,c);case 3:hi(b);d=b.updateQueue;if(null===d)throw t(Error(282));e=b.memoizedState;e=null!==e?e.element:
	null;xg(b,d,b.pendingProps,null,c);d=b.memoizedState.element;if(d===e)Xh(),b=$h(a,b,c);else{if(e=b.stateNode.hydrate)Ph=je(b.stateNode.containerInfo.firstChild),Oh=b,e=Qh=!0;if(e)for(c=Xg(b,null,d,c),b.child=c;c;)c.effectTag=c.effectTag&~E|Ac,c=c.sibling;else R(a,b,d,c),Xh();b=b.child;}return b;case 5:return eh(b),null===a&&Uh(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,ge(d,e)?g=null:null!==f&&ge(d,f)&&(b.effectTag|=16),ei(a,b),b.mode&4&&1!==c&&e.hidden?(b.expirationTime=
	b.childExpirationTime=1,b=null):(R(a,b,g,c),b=b.child),b;case 6:return null===a&&Uh(b),null;case 13:return ji(a,b,c);case 4:return ch(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Wg(b,null,d,c):R(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:cg(d,e),Zh(a,b,d,e,c);case 7:return R(a,b,b.pendingProps,c),b.child;case 8:return R(a,b,b.pendingProps.children,c),b.child;case 12:return R(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;
	e=b.pendingProps;g=b.memoizedProps;f=e.value;ig(b,f);if(null!==g){var h=g.value;f=ff(h,f)?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0;if(0===f){if(g.children===e.children&&!K.current){b=$h(a,b,c);break a}}else for(h=b.child,null!==h&&(h.return=b);null!==h;){var k=h.dependencies;if(null!==k){g=h.child;for(var l=k.firstContext;null!==l;){if(l.context===d&&0!==(l.observedBits&f)){1===h.tag&&(l=rg(c,null),l.tag=2,tg(h,l));h.expirationTime<c&&(h.expirationTime=
	c);l=h.alternate;null!==l&&l.expirationTime<c&&(l.expirationTime=c);kg(h.return,c);k.expirationTime<c&&(k.expirationTime=c);break}l=l.next;}}else g=10===h.tag?h.type===b.type?null:h.child:h.child;if(null!==g)g.return=h;else for(g=h;null!==g;){if(g===b){g=null;break}h=g.sibling;if(null!==h){h.return=g.return;g=h;break}g=g.return;}h=g;}}R(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,f=b.pendingProps,d=f.children,lg(b,c),e=ng(e,f.unstable_observedBits),d=d(e),b.effectTag|=1,R(a,b,d,c),b.child;
	case 14:return e=b.type,f=cg(e,b.pendingProps),f=cg(e.type,f),ai(a,b,e,f,d,c);case 15:return ci(a,b,b.type,b.pendingProps,d,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:cg(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=E),b.tag=1,N(d)?(a=!0,Bf(b)):a=!1,lg(b,c),Kg(b,d,e),Mg(b,d,e,c),gi(null,b,d,!0,a,c);case 19:return li(a,b,c)}throw t(Error(156),b.tag);};var Yj=null,Gi=null;
	function dk(a){if("undefined"===typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return !1;var b=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(b.isDisabled||!b.supportsFiber)return !0;try{var c=b.inject(a);Yj=function(a){try{b.onCommitFiberRoot(c,a,void 0,64===(a.current.effectTag&64));}catch(e){}};Gi=function(a){try{b.onCommitFiberUnmount(c,a);}catch(e){}};}catch(d){}return !0}
	function ek(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.effectTag=D;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childExpirationTime=this.expirationTime=0;this.alternate=null;}function Sh(a,b,c,d){return new ek(a,b,c,d)}
	function bi(a){a=a.prototype;return !(!a||!a.isReactComponent)}function ck(a){if("function"===typeof a)return bi(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Na)return 11;if(a===Qa)return 14}return 2}
	function Rg(a,b){var c=a.alternate;null===c?(c=Sh(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.effectTag=D,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.childExpirationTime=a.childExpirationTime;c.expirationTime=a.expirationTime;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{expirationTime:b.expirationTime,
	firstContext:b.firstContext,responders:b.responders};c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
	function Tg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)bi(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case Ha:return Vg(c.children,e,f,b);case Ma:g=8;e|=7;break;case Ia:g=8;e|=1;break;case Ja:return a=Sh(12,c,b,e|8),a.elementType=Ja,a.type=Ja,a.expirationTime=f,a;case Oa:return a=Sh(13,c,b,e),a.type=Oa,a.elementType=Oa,a.expirationTime=f,a;case Pa:return a=Sh(19,c,b,e),a.elementType=Pa,a.expirationTime=f,a;default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ka:g=
	10;break a;case La:g=9;break a;case Na:g=11;break a;case Qa:g=14;break a;case Ra:g=16;d=null;break a}throw t(Error(130),null==a?a:typeof a,"");}b=Sh(g,c,b,e);b.elementType=a;b.type=d;b.expirationTime=f;return b}function Vg(a,b,c,d){a=Sh(7,a,d,b);a.expirationTime=c;return a}function Sg(a,b,c){a=Sh(6,a,null,b);a.expirationTime=c;return a}
	function Ug(a,b,c){b=Sh(4,null!==a.children?a.children:[],a.key,b);b.expirationTime=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
	function fk(a,b,c){this.tag=b;this.current=null;this.containerInfo=a;this.pingCache=this.pendingChildren=null;this.finishedExpirationTime=0;this.finishedWork=null;this.timeoutHandle=-1;this.pendingContext=this.context=null;this.hydrate=c;this.callbackNode=this.firstBatch=null;this.callbackPriority=90;this.lastExpiredTime=this.lastPingedTime=this.nextKnownPendingLevel=this.lastSuspendedTime=this.firstSuspendedTime=this.firstPendingTime=0;}
	function Bj(a,b){var c=a.firstSuspendedTime;a=a.lastSuspendedTime;return 0!==c&&c>=b&&a<=b}function yj(a,b){var c=a.firstSuspendedTime,d=a.lastSuspendedTime;c<b&&(a.firstSuspendedTime=b);if(d>b||0===c)a.lastSuspendedTime=b;b<=a.lastPingedTime&&(a.lastPingedTime=0);b<=a.lastExpiredTime&&(a.lastExpiredTime=0);}
	function zj(a,b){b>a.firstPendingTime&&(a.firstPendingTime=b);var c=a.firstSuspendedTime;0!==c&&(b>=c?a.firstSuspendedTime=a.lastSuspendedTime=a.nextKnownPendingLevel=0:b>=a.lastSuspendedTime&&(a.lastSuspendedTime=b+1),b>a.nextKnownPendingLevel&&(a.nextKnownPendingLevel=b));}function Dj(a,b){var c=a.lastExpiredTime;if(0===c||c>b)a.lastExpiredTime=b;}
	function gk(a,b,c,d,e,f){var g=b.current;a:if(c){c=c._reactInternalFiber;b:{if(Bc(c)!==c||1!==c.tag)throw t(Error(170));var h=c;do{switch(h.tag){case 3:h=h.stateNode.context;break b;case 1:if(N(h.type)){h=h.stateNode.__reactInternalMemoizedMergedChildContext;break b}}h=h.return;}while(null!==h);throw t(Error(171));}if(1===c.tag){var k=c.type;if(N(k)){c=Af(c,k,h);break a}}c=h;}else c=tf;null===b.context?b.context=c:b.pendingContext=c;b=f;e=rg(d,e);e.payload={element:a};b=void 0===b?null:b;null!==b&&
	(e.callback=b);tg(g,e);Hg(g,d);return d}function hk(a,b,c,d){var e=b.current,f=Fg(),g=Cg.suspense;e=Gg(f,e,g);return gk(a,b,c,e,g,d)}function ik(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function jk(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:Ga,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
	Ya=function(a,b,c){switch(b){case "input":Db(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=re(d);if(!e)throw t(Error(90));zb(d);Db(d,e);}}}break;case "textarea":Mb(a,c);break;case "select":b=c.value,null!=b&&Jb(a,!!c.multiple,b,!1);}};
	function kk(a){var b=1073741821-25*(((1073741821-Fg()+500)/25|0)+1);b<=vj&&--b;this._expirationTime=vj=b;this._root=a;this._callbacks=this._next=null;this._hasChildren=this._didComplete=!1;this._children=null;this._defer=!0;}kk.prototype.render=function(a){if(!this._defer)throw t(Error(250));this._hasChildren=!0;this._children=a;var b=this._root._internalRoot,c=this._expirationTime,d=new lk;gk(a,b,null,c,null,d._onCommit);return d};
	kk.prototype.then=function(a){if(this._didComplete)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a);}};
	kk.prototype.commit=function(){var a=this._root._internalRoot,b=a.firstBatch;if(!this._defer||null===b)throw t(Error(251));if(this._hasChildren){var c=this._expirationTime;if(b!==this){this._hasChildren&&(c=this._expirationTime=b._expirationTime,this.render(this._children));for(var d=null,e=b;e!==this;)d=e,e=e._next;if(null===d)throw t(Error(251));d._next=e._next;this._next=b;a.firstBatch=this;}this._defer=!1;b=c;if((T&(Zi|$i))!==S)throw t(Error(253));Dj(a,b);Z(a);bg();b=this._next;this._next=null;
	b=a.firstBatch=b;null!==b&&b._hasChildren&&b.render(b._children);}else this._next=null,this._defer=!1;};kk.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++)(0, a[b])();}};function lk(){this._callbacks=null;this._didCommit=!1;this._onCommit=this._onCommit.bind(this);}lk.prototype.then=function(a){if(this._didCommit)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a);}};
	lk.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++){var c=a[b];if("function"!==typeof c)throw t(Error(191),c);c();}}};function mk(a,b,c){c=null!=c&&!0===c.hydrate;var d=new fk(a,b,c),e=Sh(3,null,null,2===b?7:1===b?3:0);d.current=e;e.stateNode=d;a[oe]=d.current;c&&0!==b&&nc(9===a.nodeType?a:a.ownerDocument);return d}function nk(a,b,c){this._internalRoot=mk(a,b,c);}function ok(a,b){this._internalRoot=mk(a,2,b);}
	ok.prototype.render=nk.prototype.render=function(a,b){var c=this._internalRoot,d=new lk;b=void 0===b?null:b;null!==b&&d.then(b);hk(a,c,null,d._onCommit);return d};ok.prototype.unmount=nk.prototype.unmount=function(a){var b=this._internalRoot,c=new lk;a=void 0===a?null:a;null!==a&&c.then(a);hk(null,b,null,c._onCommit);return c};
	ok.prototype.createBatch=function(){var a=new kk(this),b=a._expirationTime,c=this._internalRoot,d=c.firstBatch;if(null===d)c.firstBatch=a,a._next=null;else{for(c=null;null!==d&&d._expirationTime>=b;)c=d,d=d._next;a._next=d;null!==c&&(c._next=a);}return a};function qk(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}db=Pj;eb=Qj;fb=Nj;gb=function(a,b){var c=T;T|=2;try{return a(b)}finally{T=c,T===S&&bg();}};
	function rk(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new nk(a,0,b?{hydrate:!0}:void 0)}
	function sk(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f._internalRoot;if("function"===typeof e){var h=e;e=function(){var a=ik(g);h.call(a);};}hk(b,g,a,e);}else{f=c._reactRootContainer=rk(c,d);g=f._internalRoot;if("function"===typeof e){var k=e;e=function(){var a=ik(g);k.call(a);};}Rj(function(){hk(b,g,a,e);});}return ik(g)}function tk(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!qk(b))throw t(Error(200));return jk(a,b,null,c)}
	var wk={createPortal:tk,findDOMNode:function(a){if(null==a)a=null;else if(1!==a.nodeType){var b=a._reactInternalFiber;if(void 0===b){if("function"===typeof a.render)throw t(Error(188));throw t(Error(268),Object.keys(a));}a=Ec(b);a=null===a?null:a.stateNode;}return a},hydrate:function(a,b,c){if(!qk(b))throw t(Error(200));return sk(null,a,b,!0,c)},render:function(a,b,c){if(!qk(b))throw t(Error(200));return sk(null,a,b,!1,c)},unstable_renderSubtreeIntoContainer:function(a,b,c,d){if(!qk(c))throw t(Error(200));
	if(null==a||void 0===a._reactInternalFiber)throw t(Error(38));return sk(a,b,c,!1,d)},unmountComponentAtNode:function(a){if(!qk(a))throw t(Error(40));return a._reactRootContainer?(Rj(function(){sk(null,null,a,!1,function(){a._reactRootContainer=null;});}),!0):!1},unstable_createPortal:function(){return tk.apply(void 0,arguments)},unstable_batchedUpdates:Pj,unstable_interactiveUpdates:function(a,b,c,d){Nj();return Qj(a,b,c,d)},unstable_discreteUpdates:Qj,unstable_flushDiscreteUpdates:Nj,flushSync:function(a,
	b){if((T&(Zi|$i))!==S)throw t(Error(187));var c=T;T|=1;try{return Yf(99,a.bind(null,b))}finally{T=c,bg();}},unstable_createRoot:uk,unstable_createSyncRoot:vk,unstable_flushControlled:function(a){var b=T;T|=1;try{Yf(99,a);}finally{T=b,T===S&&bg();}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{Events:[pe,qe,re,Ba.injectEventPluginsByName,fa,Lc,function(a){xa(a,Kc);},bb,cb,Hd,Aa,Ej,{current:!1}]}};function uk(a,b){if(!qk(a))throw t(Error(299),"unstable_createRoot");return new ok(a,b)}
	function vk(a,b){if(!qk(a))throw t(Error(299),"unstable_createRoot");return new nk(a,1,b)}
	(function(a){var b=a.findFiberByHostInstance;return dk(objectAssign({},a,{overrideHookState:null,overrideProps:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Da.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Ec(a);return null===a?null:a.stateNode},findFiberByHostInstance:function(a){return b?b(a):null},findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null}))})({findFiberByHostInstance:Cd,bundleType:0,version:"16.10.2",
	rendererPackageName:"react-dom"});var xk={default:wk},yk=xk&&wk||xk;var reactDom_production_min=yk.default||yk;

	var schedulerTracing_production_min = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports,"__esModule",{value:!0});var b=0;exports.__interactionsRef=null;exports.__subscriberRef=null;exports.unstable_clear=function(a){return a()};exports.unstable_getCurrent=function(){return null};exports.unstable_getThreadID=function(){return ++b};exports.unstable_trace=function(a,d,c){return c()};exports.unstable_wrap=function(a){return a};exports.unstable_subscribe=function(){};exports.unstable_unsubscribe=function(){};
	});

	unwrapExports(schedulerTracing_production_min);
	var schedulerTracing_production_min_1 = schedulerTracing_production_min.__interactionsRef;
	var schedulerTracing_production_min_2 = schedulerTracing_production_min.__subscriberRef;
	var schedulerTracing_production_min_3 = schedulerTracing_production_min.unstable_clear;
	var schedulerTracing_production_min_4 = schedulerTracing_production_min.unstable_getCurrent;
	var schedulerTracing_production_min_5 = schedulerTracing_production_min.unstable_getThreadID;
	var schedulerTracing_production_min_6 = schedulerTracing_production_min.unstable_trace;
	var schedulerTracing_production_min_7 = schedulerTracing_production_min.unstable_wrap;
	var schedulerTracing_production_min_8 = schedulerTracing_production_min.unstable_subscribe;
	var schedulerTracing_production_min_9 = schedulerTracing_production_min.unstable_unsubscribe;

	var schedulerTracing_development = createCommonjsModule(function (module, exports) {
	});

	unwrapExports(schedulerTracing_development);
	var schedulerTracing_development_1 = schedulerTracing_development.__interactionsRef;
	var schedulerTracing_development_2 = schedulerTracing_development.__subscriberRef;
	var schedulerTracing_development_3 = schedulerTracing_development.unstable_clear;
	var schedulerTracing_development_4 = schedulerTracing_development.unstable_getCurrent;
	var schedulerTracing_development_5 = schedulerTracing_development.unstable_getThreadID;
	var schedulerTracing_development_6 = schedulerTracing_development.unstable_trace;
	var schedulerTracing_development_7 = schedulerTracing_development.unstable_wrap;
	var schedulerTracing_development_8 = schedulerTracing_development.unstable_subscribe;
	var schedulerTracing_development_9 = schedulerTracing_development.unstable_unsubscribe;

	var tracing = createCommonjsModule(function (module) {

	{
	  module.exports = schedulerTracing_production_min;
	}
	});

	var reactDom_development = createCommonjsModule(function (module) {
	});

	var reactDom = createCommonjsModule(function (module) {

	function checkDCE() {
	  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
	  if (
	    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
	    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
	  ) {
	    return;
	  }
	  try {
	    // Verify that the code above has been dead code eliminated (DCE'd).
	    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
	  } catch (err) {
	    // DevTools shouldn't crash React, no matter what.
	    // We should still report in case we break this code.
	    console.error(err);
	  }
	}

	{
	  // DCE check should happen before ReactDOM bundle executes so that
	  // DevTools can report bad minification during injection.
	  checkDCE();
	  module.exports = reactDom_production_min;
	}
	});

	var shims = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.findInArray = findInArray;
	exports.isFunction = isFunction;
	exports.isNum = isNum;
	exports.int = int;
	exports.dontSetMe = dontSetMe;

	// @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
	function findInArray(array
	/*: Array<any> | TouchList*/
	, callback
	/*: Function*/
	)
	/*: any*/
	{
	  for (let i = 0, length = array.length; i < length; i++) {
	    if (callback.apply(callback, [array[i], i, array])) return array[i];
	  }
	}

	function isFunction(func
	/*: any*/
	)
	/*: boolean*/
	{
	  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
	}

	function isNum(num
	/*: any*/
	)
	/*: boolean*/
	{
	  return typeof num === 'number' && !isNaN(num);
	}

	function int(a
	/*: string*/
	)
	/*: number*/
	{
	  return parseInt(a, 10);
	}

	function dontSetMe(props
	/*: Object*/
	, propName
	/*: string*/
	, componentName
	/*: string*/
	) {
	  if (props[propName]) {
	    return new Error(`Invalid prop ${propName} passed to ${componentName} - do not set this, set it on the child.`);
	  }
	}
	});

	unwrapExports(shims);
	var shims_1 = shims.findInArray;
	var shims_2 = shims.isFunction;
	var shims_3 = shims.isNum;
	var shims_4 = shims.dontSetMe;

	var getPrefix_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getPrefix = getPrefix;
	exports.browserPrefixToKey = browserPrefixToKey;
	exports.browserPrefixToStyle = browserPrefixToStyle;
	exports.default = void 0;
	const prefixes = ['Moz', 'Webkit', 'O', 'ms'];

	function getPrefix(prop
	/*: string*/
	= 'transform')
	/*: string*/
	{
	  // Checking specifically for 'window.document' is for pseudo-browser server-side
	  // environments that define 'window' as the global context.
	  // E.g. React-rails (see https://github.com/reactjs/react-rails/pull/84)
	  if (typeof window === 'undefined' || typeof window.document === 'undefined') return '';
	  const style = window.document.documentElement.style;
	  if (prop in style) return '';

	  for (let i = 0; i < prefixes.length; i++) {
	    if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
	  }

	  return '';
	}

	function browserPrefixToKey(prop
	/*: string*/
	, prefix
	/*: string*/
	)
	/*: string*/
	{
	  return prefix ? `${prefix}${kebabToTitleCase(prop)}` : prop;
	}

	function browserPrefixToStyle(prop
	/*: string*/
	, prefix
	/*: string*/
	)
	/*: string*/
	{
	  return prefix ? `-${prefix.toLowerCase()}-${prop}` : prop;
	}

	function kebabToTitleCase(str
	/*: string*/
	)
	/*: string*/
	{
	  let out = '';
	  let shouldCapitalize = true;

	  for (let i = 0; i < str.length; i++) {
	    if (shouldCapitalize) {
	      out += str[i].toUpperCase();
	      shouldCapitalize = false;
	    } else if (str[i] === '-') {
	      shouldCapitalize = true;
	    } else {
	      out += str[i];
	    }
	  }

	  return out;
	} // Default export is the prefix itself, like 'Moz', 'Webkit', etc
	// Note that you may have to re-test for certain things; for instance, Chrome 50
	// can handle unprefixed `transform`, but not unprefixed `user-select`


	var _default = getPrefix();

	exports.default = _default;
	});

	unwrapExports(getPrefix_1);
	var getPrefix_2 = getPrefix_1.getPrefix;
	var getPrefix_3 = getPrefix_1.browserPrefixToKey;
	var getPrefix_4 = getPrefix_1.browserPrefixToStyle;

	var domFns = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.matchesSelector = matchesSelector;
	exports.matchesSelectorAndParentsTo = matchesSelectorAndParentsTo;
	exports.addEvent = addEvent;
	exports.removeEvent = removeEvent;
	exports.outerHeight = outerHeight;
	exports.outerWidth = outerWidth;
	exports.innerHeight = innerHeight;
	exports.innerWidth = innerWidth;
	exports.offsetXYFromParent = offsetXYFromParent;
	exports.createCSSTransform = createCSSTransform;
	exports.createSVGTransform = createSVGTransform;
	exports.getTranslation = getTranslation;
	exports.getTouch = getTouch;
	exports.getTouchIdentifier = getTouchIdentifier;
	exports.addUserSelectStyles = addUserSelectStyles;
	exports.removeUserSelectStyles = removeUserSelectStyles;
	exports.styleHacks = styleHacks;
	exports.addClassName = addClassName;
	exports.removeClassName = removeClassName;



	var _getPrefix = _interopRequireWildcard(getPrefix_1);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

	let matchesSelectorFunc = '';

	function matchesSelector(el
	/*: Node*/
	, selector
	/*: string*/
	)
	/*: boolean*/
	{
	  if (!matchesSelectorFunc) {
	    matchesSelectorFunc = (0, shims.findInArray)(['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'], function (method) {
	      // $FlowIgnore: Doesn't think elements are indexable
	      return (0, shims.isFunction)(el[method]);
	    });
	  } // Might not be found entirely (not an Element?) - in that case, bail
	  // $FlowIgnore: Doesn't think elements are indexable


	  if (!(0, shims.isFunction)(el[matchesSelectorFunc])) return false; // $FlowIgnore: Doesn't think elements are indexable

	  return el[matchesSelectorFunc](selector);
	} // Works up the tree to the draggable itself attempting to match selector.


	function matchesSelectorAndParentsTo(el
	/*: Node*/
	, selector
	/*: string*/
	, baseNode
	/*: Node*/
	)
	/*: boolean*/
	{
	  let node = el;

	  do {
	    if (matchesSelector(node, selector)) return true;
	    if (node === baseNode) return false;
	    node = node.parentNode;
	  } while (node);

	  return false;
	}

	function addEvent(el
	/*: ?Node*/
	, event
	/*: string*/
	, handler
	/*: Function*/
	)
	/*: void*/
	{
	  if (!el) {
	    return;
	  }

	  if (el.attachEvent) {
	    el.attachEvent('on' + event, handler);
	  } else if (el.addEventListener) {
	    el.addEventListener(event, handler, true);
	  } else {
	    // $FlowIgnore: Doesn't think elements are indexable
	    el['on' + event] = handler;
	  }
	}

	function removeEvent(el
	/*: ?Node*/
	, event
	/*: string*/
	, handler
	/*: Function*/
	)
	/*: void*/
	{
	  if (!el) {
	    return;
	  }

	  if (el.detachEvent) {
	    el.detachEvent('on' + event, handler);
	  } else if (el.removeEventListener) {
	    el.removeEventListener(event, handler, true);
	  } else {
	    // $FlowIgnore: Doesn't think elements are indexable
	    el['on' + event] = null;
	  }
	}

	function outerHeight(node
	/*: HTMLElement*/
	)
	/*: number*/
	{
	  // This is deliberately excluding margin for our calculations, since we are using
	  // offsetTop which is including margin. See getBoundPosition
	  let height = node.clientHeight;
	  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
	  height += (0, shims.int)(computedStyle.borderTopWidth);
	  height += (0, shims.int)(computedStyle.borderBottomWidth);
	  return height;
	}

	function outerWidth(node
	/*: HTMLElement*/
	)
	/*: number*/
	{
	  // This is deliberately excluding margin for our calculations, since we are using
	  // offsetLeft which is including margin. See getBoundPosition
	  let width = node.clientWidth;
	  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
	  width += (0, shims.int)(computedStyle.borderLeftWidth);
	  width += (0, shims.int)(computedStyle.borderRightWidth);
	  return width;
	}

	function innerHeight(node
	/*: HTMLElement*/
	)
	/*: number*/
	{
	  let height = node.clientHeight;
	  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
	  height -= (0, shims.int)(computedStyle.paddingTop);
	  height -= (0, shims.int)(computedStyle.paddingBottom);
	  return height;
	}

	function innerWidth(node
	/*: HTMLElement*/
	)
	/*: number*/
	{
	  let width = node.clientWidth;
	  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
	  width -= (0, shims.int)(computedStyle.paddingLeft);
	  width -= (0, shims.int)(computedStyle.paddingRight);
	  return width;
	} // Get from offsetParent


	function offsetXYFromParent(evt
	/*: {clientX: number, clientY: number}*/
	, offsetParent
	/*: HTMLElement*/
	)
	/*: ControlPosition*/
	{
	  const isBody = offsetParent === offsetParent.ownerDocument.body;
	  const offsetParentRect = isBody ? {
	    left: 0,
	    top: 0
	  } : offsetParent.getBoundingClientRect();
	  const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
	  const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;
	  return {
	    x,
	    y
	  };
	}

	function createCSSTransform(controlPos
	/*: ControlPosition*/
	, positionOffset
	/*: PositionOffsetControlPosition*/
	)
	/*: Object*/
	{
	  const translation = getTranslation(controlPos, positionOffset, 'px');
	  return {
	    [(0, _getPrefix.browserPrefixToKey)('transform', _getPrefix.default)]: translation
	  };
	}

	function createSVGTransform(controlPos
	/*: ControlPosition*/
	, positionOffset
	/*: PositionOffsetControlPosition*/
	)
	/*: string*/
	{
	  const translation = getTranslation(controlPos, positionOffset, '');
	  return translation;
	}

	function getTranslation({
	  x,
	  y
	}
	/*: ControlPosition*/
	, positionOffset
	/*: PositionOffsetControlPosition*/
	, unitSuffix
	/*: string*/
	)
	/*: string*/
	{
	  let translation = `translate(${x}${unitSuffix},${y}${unitSuffix})`;

	  if (positionOffset) {
	    const defaultX = `${typeof positionOffset.x === 'string' ? positionOffset.x : positionOffset.x + unitSuffix}`;
	    const defaultY = `${typeof positionOffset.y === 'string' ? positionOffset.y : positionOffset.y + unitSuffix}`;
	    translation = `translate(${defaultX}, ${defaultY})` + translation;
	  }

	  return translation;
	}

	function getTouch(e
	/*: MouseTouchEvent*/
	, identifier
	/*: number*/
	)
	/*: ?{clientX: number, clientY: number}*/
	{
	  return e.targetTouches && (0, shims.findInArray)(e.targetTouches, t => identifier === t.identifier) || e.changedTouches && (0, shims.findInArray)(e.changedTouches, t => identifier === t.identifier);
	}

	function getTouchIdentifier(e
	/*: MouseTouchEvent*/
	)
	/*: ?number*/
	{
	  if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
	  if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
	} // User-select Hacks:
	//
	// Useful for preventing blue highlights all over everything when dragging.
	// Note we're passing `document` b/c we could be iframed


	function addUserSelectStyles(doc
	/*: ?Document*/
	) {
	  if (!doc) return;
	  let styleEl = doc.getElementById('react-draggable-style-el');

	  if (!styleEl) {
	    styleEl = doc.createElement('style');
	    styleEl.type = 'text/css';
	    styleEl.id = 'react-draggable-style-el';
	    styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n';
	    styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {all: inherit;}\n';
	    doc.getElementsByTagName('head')[0].appendChild(styleEl);
	  }

	  if (doc.body) addClassName(doc.body, 'react-draggable-transparent-selection');
	}

	function removeUserSelectStyles(doc
	/*: ?Document*/
	) {
	  try {
	    if (doc && doc.body) removeClassName(doc.body, 'react-draggable-transparent-selection'); // $FlowIgnore: IE

	    if (doc.selection) {
	      // $FlowIgnore: IE
	      doc.selection.empty();
	    } else {
	      window.getSelection().removeAllRanges(); // remove selection caused by scroll
	    }
	  } catch (e) {// probably IE
	  }
	}

	function styleHacks(childStyle
	/*: Object*/
	= {})
	/*: Object*/
	{
	  // Workaround IE pointer events; see #51
	  // https://github.com/mzabriskie/react-draggable/issues/51#issuecomment-103488278
	  return {
	    touchAction: 'none',
	    ...childStyle
	  };
	}

	function addClassName(el
	/*: HTMLElement*/
	, className
	/*: string*/
	) {
	  if (el.classList) {
	    el.classList.add(className);
	  } else {
	    if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
	      el.className += ` ${className}`;
	    }
	  }
	}

	function removeClassName(el
	/*: HTMLElement*/
	, className
	/*: string*/
	) {
	  if (el.classList) {
	    el.classList.remove(className);
	  } else {
	    el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
	  }
	}
	});

	unwrapExports(domFns);
	var domFns_1 = domFns.matchesSelector;
	var domFns_2 = domFns.matchesSelectorAndParentsTo;
	var domFns_3 = domFns.addEvent;
	var domFns_4 = domFns.removeEvent;
	var domFns_5 = domFns.outerHeight;
	var domFns_6 = domFns.outerWidth;
	var domFns_7 = domFns.innerHeight;
	var domFns_8 = domFns.innerWidth;
	var domFns_9 = domFns.offsetXYFromParent;
	var domFns_10 = domFns.createCSSTransform;
	var domFns_11 = domFns.createSVGTransform;
	var domFns_12 = domFns.getTranslation;
	var domFns_13 = domFns.getTouch;
	var domFns_14 = domFns.getTouchIdentifier;
	var domFns_15 = domFns.addUserSelectStyles;
	var domFns_16 = domFns.removeUserSelectStyles;
	var domFns_17 = domFns.styleHacks;
	var domFns_18 = domFns.addClassName;
	var domFns_19 = domFns.removeClassName;

	var positionFns = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getBoundPosition = getBoundPosition;
	exports.snapToGrid = snapToGrid;
	exports.canDragX = canDragX;
	exports.canDragY = canDragY;
	exports.getControlPosition = getControlPosition;
	exports.createCoreData = createCoreData;
	exports.createDraggableData = createDraggableData;



	var _reactDom = _interopRequireDefault(reactDom);



	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getBoundPosition(draggable
	/*: Draggable*/
	, x
	/*: number*/
	, y
	/*: number*/
	)
	/*: [number, number]*/
	{
	  // If no bounds, short-circuit and move on
	  if (!draggable.props.bounds) return [x, y]; // Clone new bounds

	  let {
	    bounds
	  } = draggable.props;
	  bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
	  const node = findDOMNode(draggable);

	  if (typeof bounds === 'string') {
	    const {
	      ownerDocument
	    } = node;
	    const ownerWindow = ownerDocument.defaultView;
	    let boundNode;

	    if (bounds === 'parent') {
	      boundNode = node.parentNode;
	    } else {
	      boundNode = ownerDocument.querySelector(bounds);
	    }

	    if (!(boundNode instanceof ownerWindow.HTMLElement)) {
	      throw new Error('Bounds selector "' + bounds + '" could not find an element.');
	    }

	    const nodeStyle = ownerWindow.getComputedStyle(node);
	    const boundNodeStyle = ownerWindow.getComputedStyle(boundNode); // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.

	    bounds = {
	      left: -node.offsetLeft + (0, shims.int)(boundNodeStyle.paddingLeft) + (0, shims.int)(nodeStyle.marginLeft),
	      top: -node.offsetTop + (0, shims.int)(boundNodeStyle.paddingTop) + (0, shims.int)(nodeStyle.marginTop),
	      right: (0, domFns.innerWidth)(boundNode) - (0, domFns.outerWidth)(node) - node.offsetLeft + (0, shims.int)(boundNodeStyle.paddingRight) - (0, shims.int)(nodeStyle.marginRight),
	      bottom: (0, domFns.innerHeight)(boundNode) - (0, domFns.outerHeight)(node) - node.offsetTop + (0, shims.int)(boundNodeStyle.paddingBottom) - (0, shims.int)(nodeStyle.marginBottom)
	    };
	  } // Keep x and y below right and bottom limits...


	  if ((0, shims.isNum)(bounds.right)) x = Math.min(x, bounds.right);
	  if ((0, shims.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom); // But above left and top limits.

	  if ((0, shims.isNum)(bounds.left)) x = Math.max(x, bounds.left);
	  if ((0, shims.isNum)(bounds.top)) y = Math.max(y, bounds.top);
	  return [x, y];
	}

	function snapToGrid(grid
	/*: [number, number]*/
	, pendingX
	/*: number*/
	, pendingY
	/*: number*/
	)
	/*: [number, number]*/
	{
	  const x = Math.round(pendingX / grid[0]) * grid[0];
	  const y = Math.round(pendingY / grid[1]) * grid[1];
	  return [x, y];
	}

	function canDragX(draggable
	/*: Draggable*/
	)
	/*: boolean*/
	{
	  return draggable.props.axis === 'both' || draggable.props.axis === 'x';
	}

	function canDragY(draggable
	/*: Draggable*/
	)
	/*: boolean*/
	{
	  return draggable.props.axis === 'both' || draggable.props.axis === 'y';
	} // Get {x, y} positions from event.


	function getControlPosition(e
	/*: MouseTouchEvent*/
	, touchIdentifier
	/*: ?number*/
	, draggableCore
	/*: DraggableCore*/
	)
	/*: ?ControlPosition*/
	{
	  const touchObj = typeof touchIdentifier === 'number' ? (0, domFns.getTouch)(e, touchIdentifier) : null;
	  if (typeof touchIdentifier === 'number' && !touchObj) return null; // not the right touch

	  const node = findDOMNode(draggableCore); // User can provide an offsetParent if desired.

	  const offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
	  return (0, domFns.offsetXYFromParent)(touchObj || e, offsetParent);
	} // Create an data object exposed by <DraggableCore>'s events


	function createCoreData(draggable
	/*: DraggableCore*/
	, x
	/*: number*/
	, y
	/*: number*/
	)
	/*: DraggableData*/
	{
	  const state = draggable.state;
	  const isStart = !(0, shims.isNum)(state.lastX);
	  const node = findDOMNode(draggable);

	  if (isStart) {
	    // If this is our first move, use the x and y as last coords.
	    return {
	      node,
	      deltaX: 0,
	      deltaY: 0,
	      lastX: x,
	      lastY: y,
	      x,
	      y
	    };
	  } else {
	    // Otherwise calculate proper values.
	    return {
	      node,
	      deltaX: x - state.lastX,
	      deltaY: y - state.lastY,
	      lastX: state.lastX,
	      lastY: state.lastY,
	      x,
	      y
	    };
	  }
	} // Create an data exposed by <Draggable>'s events


	function createDraggableData(draggable
	/*: Draggable*/
	, coreData
	/*: DraggableData*/
	)
	/*: DraggableData*/
	{
	  const scale = draggable.props.scale;
	  return {
	    node: coreData.node,
	    x: draggable.state.x + coreData.deltaX / scale,
	    y: draggable.state.y + coreData.deltaY / scale,
	    deltaX: coreData.deltaX / scale,
	    deltaY: coreData.deltaY / scale,
	    lastX: draggable.state.x,
	    lastY: draggable.state.y
	  };
	} // A lot faster than stringify/parse


	function cloneBounds(bounds
	/*: Bounds*/
	)
	/*: Bounds*/
	{
	  return {
	    left: bounds.left,
	    top: bounds.top,
	    right: bounds.right,
	    bottom: bounds.bottom
	  };
	}

	function findDOMNode(draggable
	/*: Draggable | DraggableCore*/
	)
	/*: HTMLElement*/
	{
	  const node = _reactDom.default.findDOMNode(draggable);

	  if (!node) {
	    throw new Error('<DraggableCore>: Unmounted during event!');
	  } // $FlowIgnore we can't assert on HTMLElement due to tests... FIXME


	  return node;
	}
	});

	unwrapExports(positionFns);
	var positionFns_1 = positionFns.getBoundPosition;
	var positionFns_2 = positionFns.snapToGrid;
	var positionFns_3 = positionFns.canDragX;
	var positionFns_4 = positionFns.canDragY;
	var positionFns_5 = positionFns.getControlPosition;
	var positionFns_6 = positionFns.createCoreData;
	var positionFns_7 = positionFns.createDraggableData;

	var log_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = log;

	/*eslint no-console:0*/
	function log(...args) {
	  if (process.env.DRAGGABLE_DEBUG) console.log(...args);
	}
	});

	unwrapExports(log_1);

	var DraggableCore_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = void 0;

	var _react = _interopRequireDefault(React__default);

	var _propTypes = _interopRequireDefault(propTypes);

	var _reactDom = _interopRequireDefault(reactDom);







	var _log = _interopRequireDefault(log_1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	// Simple abstraction for dragging events names.
	const eventsFor = {
	  touch: {
	    start: 'touchstart',
	    move: 'touchmove',
	    stop: 'touchend'
	  },
	  mouse: {
	    start: 'mousedown',
	    move: 'mousemove',
	    stop: 'mouseup'
	  }
	}; // Default to mouse events.

	let dragEventFor = eventsFor.mouse;
	/*:: type DraggableCoreState = {
	  dragging: boolean,
	  lastX: number,
	  lastY: number,
	  touchIdentifier: ?number
	};*/

	/*:: export type DraggableBounds = {
	  left: number,
	  right: number,
	  top: number,
	  bottom: number,
	};*/

	/*:: export type DraggableData = {
	  node: HTMLElement,
	  x: number, y: number,
	  deltaX: number, deltaY: number,
	  lastX: number, lastY: number,
	};*/

	/*:: export type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void;*/

	/*:: export type ControlPosition = {x: number, y: number};*/

	/*:: export type PositionOffsetControlPosition = {x: number|string, y: number|string};*/

	/*:: export type DraggableCoreProps = {
	  allowAnyClick: boolean,
	  cancel: string,
	  children: ReactElement<any>,
	  disabled: boolean,
	  enableUserSelectHack: boolean,
	  offsetParent: HTMLElement,
	  grid: [number, number],
	  handle: string,
	  onStart: DraggableEventHandler,
	  onDrag: DraggableEventHandler,
	  onStop: DraggableEventHandler,
	  onMouseDown: (e: MouseEvent) => void,
	};*/

	//
	// Define <DraggableCore>.
	//
	// <DraggableCore> is for advanced usage of <Draggable>. It maintains minimal internal state so it can
	// work well with libraries that require more control over the element.
	//
	class DraggableCore extends _react.default.Component {
	  constructor(...args) {
	    super(...args);

	    _defineProperty(this, "state", {
	      dragging: false,
	      // Used while dragging to determine deltas.
	      lastX: NaN,
	      lastY: NaN,
	      touchIdentifier: null
	    });

	    _defineProperty(this, "handleDragStart", e => {
	      // Make it possible to attach event handlers on top of this one.
	      this.props.onMouseDown(e); // Only accept left-clicks.

	      if (!this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false; // Get nodes. Be sure to grab relative document (could be iframed)

	      const thisNode = _reactDom.default.findDOMNode(this);

	      if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
	        throw new Error('<DraggableCore> not mounted on DragStart!');
	      }

	      const {
	        ownerDocument
	      } = thisNode; // Short circuit if handle or cancel prop was provided and selector doesn't match.

	      if (this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || this.props.handle && !(0, domFns.matchesSelectorAndParentsTo)(e.target, this.props.handle, thisNode) || this.props.cancel && (0, domFns.matchesSelectorAndParentsTo)(e.target, this.props.cancel, thisNode)) {
	        return;
	      } // Set touch identifier in component state if this is a touch event. This allows us to
	      // distinguish between individual touches on multitouch screens by identifying which
	      // touchpoint was set to this element.


	      const touchIdentifier = (0, domFns.getTouchIdentifier)(e);
	      this.setState({
	        touchIdentifier
	      }); // Get the current drag point from the event. This is used as the offset.

	      const position = (0, positionFns.getControlPosition)(e, touchIdentifier, this);
	      if (position == null) return; // not possible but satisfies flow

	      const {
	        x,
	        y
	      } = position; // Create an event object with all the data parents need to make a decision here.

	      const coreEvent = (0, positionFns.createCoreData)(this, x, y);
	      (0, _log.default)('DraggableCore: handleDragStart: %j', coreEvent); // Call event handler. If it returns explicit false, cancel.

	      (0, _log.default)('calling', this.props.onStart);
	      const shouldUpdate = this.props.onStart(e, coreEvent);
	      if (shouldUpdate === false) return; // Add a style to the body to disable user-select. This prevents text from
	      // being selected all over the page.

	      if (this.props.enableUserSelectHack) (0, domFns.addUserSelectStyles)(ownerDocument); // Initiate dragging. Set the current x and y as offsets
	      // so we know how much we've moved during the drag. This allows us
	      // to drag elements around even if they have been moved, without issue.

	      this.setState({
	        dragging: true,
	        lastX: x,
	        lastY: y
	      }); // Add events to the document directly so we catch when the user's mouse/touch moves outside of
	      // this element. We use different events depending on whether or not we have detected that this
	      // is a touch-capable device.

	      (0, domFns.addEvent)(ownerDocument, dragEventFor.move, this.handleDrag);
	      (0, domFns.addEvent)(ownerDocument, dragEventFor.stop, this.handleDragStop);
	    });

	    _defineProperty(this, "handleDrag", e => {
	      // Prevent scrolling on mobile devices, like ipad/iphone.
	      if (e.type === 'touchmove') e.preventDefault(); // Get the current drag point from the event. This is used as the offset.

	      const position = (0, positionFns.getControlPosition)(e, this.state.touchIdentifier, this);
	      if (position == null) return;
	      let {
	        x,
	        y
	      } = position; // Snap to grid if prop has been provided

	      if (Array.isArray(this.props.grid)) {
	        let deltaX = x - this.state.lastX,
	            deltaY = y - this.state.lastY;
	        [deltaX, deltaY] = (0, positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
	        if (!deltaX && !deltaY) return; // skip useless drag

	        x = this.state.lastX + deltaX, y = this.state.lastY + deltaY;
	      }

	      const coreEvent = (0, positionFns.createCoreData)(this, x, y);
	      (0, _log.default)('DraggableCore: handleDrag: %j', coreEvent); // Call event handler. If it returns explicit false, trigger end.

	      const shouldUpdate = this.props.onDrag(e, coreEvent);

	      if (shouldUpdate === false) {
	        try {
	          // $FlowIgnore
	          this.handleDragStop(new MouseEvent('mouseup'));
	        } catch (err) {
	          // Old browsers
	          const event = ((document.createEvent('MouseEvents')
	          /*: any*/
	          )
	          /*: MouseTouchEvent*/
	          ); // I see why this insanity was deprecated
	          // $FlowIgnore

	          event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	          this.handleDragStop(event);
	        }

	        return;
	      }

	      this.setState({
	        lastX: x,
	        lastY: y
	      });
	    });

	    _defineProperty(this, "handleDragStop", e => {
	      if (!this.state.dragging) return;
	      const position = (0, positionFns.getControlPosition)(e, this.state.touchIdentifier, this);
	      if (position == null) return;
	      const {
	        x,
	        y
	      } = position;
	      const coreEvent = (0, positionFns.createCoreData)(this, x, y);

	      const thisNode = _reactDom.default.findDOMNode(this);

	      if (thisNode) {
	        // Remove user-select hack
	        if (this.props.enableUserSelectHack) (0, domFns.removeUserSelectStyles)(thisNode.ownerDocument);
	      }

	      (0, _log.default)('DraggableCore: handleDragStop: %j', coreEvent); // Reset the el.

	      this.setState({
	        dragging: false,
	        lastX: NaN,
	        lastY: NaN
	      }); // Call event handler

	      this.props.onStop(e, coreEvent);

	      if (thisNode) {
	        // Remove event handlers
	        (0, _log.default)('DraggableCore: Removing handlers');
	        (0, domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
	        (0, domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
	      }
	    });

	    _defineProperty(this, "onMouseDown", e => {
	      dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

	      return this.handleDragStart(e);
	    });

	    _defineProperty(this, "onMouseUp", e => {
	      dragEventFor = eventsFor.mouse;
	      return this.handleDragStop(e);
	    });

	    _defineProperty(this, "onTouchStart", e => {
	      // We're on a touch device now, so change the event handlers
	      dragEventFor = eventsFor.touch;
	      return this.handleDragStart(e);
	    });

	    _defineProperty(this, "onTouchEnd", e => {
	      // We're on a touch device now, so change the event handlers
	      dragEventFor = eventsFor.touch;
	      return this.handleDragStop(e);
	    });
	  }

	  componentWillUnmount() {
	    // Remove any leftover event handlers. Remove both touch and mouse handlers in case
	    // some browser quirk caused a touch event to fire during a mouse move, or vice versa.
	    const thisNode = _reactDom.default.findDOMNode(this);

	    if (thisNode) {
	      const {
	        ownerDocument
	      } = thisNode;
	      (0, domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
	      (0, domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
	      (0, domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
	      (0, domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
	      if (this.props.enableUserSelectHack) (0, domFns.removeUserSelectStyles)(ownerDocument);
	    }
	  }

	  render() {
	    // Reuse the child provided
	    // This makes it flexible to use whatever element is wanted (div, ul, etc)
	    return _react.default.cloneElement(_react.default.Children.only(this.props.children), {
	      style: (0, domFns.styleHacks)(this.props.children.props.style),
	      // Note: mouseMove handler is attached to document so it will still function
	      // when the user drags quickly and leaves the bounds of the element.
	      onMouseDown: this.onMouseDown,
	      onTouchStart: this.onTouchStart,
	      onMouseUp: this.onMouseUp,
	      onTouchEnd: this.onTouchEnd
	    });
	  }

	}

	exports.default = DraggableCore;

	_defineProperty(DraggableCore, "displayName", 'DraggableCore');

	_defineProperty(DraggableCore, "propTypes", {
	  /**
	   * `allowAnyClick` allows dragging using any mouse button.
	   * By default, we only accept the left button.
	   *
	   * Defaults to `false`.
	   */
	  allowAnyClick: _propTypes.default.bool,

	  /**
	   * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
	   * with the exception of `onMouseDown`, will not fire.
	   */
	  disabled: _propTypes.default.bool,

	  /**
	   * By default, we add 'user-select:none' attributes to the document body
	   * to prevent ugly text selection during drag. If this is causing problems
	   * for your app, set this to `false`.
	   */
	  enableUserSelectHack: _propTypes.default.bool,

	  /**
	   * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
	   * instead of using the parent node.
	   */
	  offsetParent: function (props
	  /*: DraggableCoreProps*/
	  , propName
	  /*: $Keys<DraggableCoreProps>*/
	  ) {
	    if (props[propName] && props[propName].nodeType !== 1) {
	      throw new Error('Draggable\'s offsetParent must be a DOM Node.');
	    }
	  },

	  /**
	   * `grid` specifies the x and y that dragging should snap to.
	   */
	  grid: _propTypes.default.arrayOf(_propTypes.default.number),

	  /**
	   * `handle` specifies a selector to be used as the handle that initiates drag.
	   *
	   * Example:
	   *
	   * ```jsx
	   *   let App = React.createClass({
	   *       render: function () {
	   *         return (
	   *            <Draggable handle=".handle">
	   *              <div>
	   *                  <div className="handle">Click me to drag</div>
	   *                  <div>This is some other content</div>
	   *              </div>
	   *           </Draggable>
	   *         );
	   *       }
	   *   });
	   * ```
	   */
	  handle: _propTypes.default.string,

	  /**
	   * `cancel` specifies a selector to be used to prevent drag initialization.
	   *
	   * Example:
	   *
	   * ```jsx
	   *   let App = React.createClass({
	   *       render: function () {
	   *           return(
	   *               <Draggable cancel=".cancel">
	   *                   <div>
	   *                     <div className="cancel">You can't drag from here</div>
	   *                     <div>Dragging here works fine</div>
	   *                   </div>
	   *               </Draggable>
	   *           );
	   *       }
	   *   });
	   * ```
	   */
	  cancel: _propTypes.default.string,

	  /**
	   * Called when dragging starts.
	   * If this function returns the boolean false, dragging will be canceled.
	   */
	  onStart: _propTypes.default.func,

	  /**
	   * Called while dragging.
	   * If this function returns the boolean false, dragging will be canceled.
	   */
	  onDrag: _propTypes.default.func,

	  /**
	   * Called when dragging stops.
	   * If this function returns the boolean false, the drag will remain active.
	   */
	  onStop: _propTypes.default.func,

	  /**
	   * A workaround option which can be passed if onMouseDown needs to be accessed,
	   * since it'll always be blocked (as there is internal use of onMouseDown)
	   */
	  onMouseDown: _propTypes.default.func,

	  /**
	   * These properties should be defined on the child, not here.
	   */
	  className: shims.dontSetMe,
	  style: shims.dontSetMe,
	  transform: shims.dontSetMe
	});

	_defineProperty(DraggableCore, "defaultProps", {
	  allowAnyClick: false,
	  // by default only accept left click
	  cancel: null,
	  disabled: false,
	  enableUserSelectHack: true,
	  offsetParent: null,
	  handle: null,
	  grid: null,
	  transform: null,
	  onStart: function () {},
	  onDrag: function () {},
	  onStop: function () {},
	  onMouseDown: function () {}
	});
	});

	unwrapExports(DraggableCore_1);

	var Draggable_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = void 0;

	var _react = _interopRequireDefault(React__default);

	var _propTypes = _interopRequireDefault(propTypes);

	var _reactDom = _interopRequireDefault(reactDom);

	var _classnames = _interopRequireDefault(classnames);







	var _DraggableCore = _interopRequireDefault(DraggableCore_1);

	var _log = _interopRequireDefault(log_1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	//
	// Define <Draggable>
	//
	class Draggable extends _react.default.Component {
	  // React 16.3+
	  // Arity (props, state)
	  static getDerivedStateFromProps({
	    position
	  }
	  /*: DraggableProps*/
	  , {
	    prevPropsPosition
	  }
	  /*: DraggableState*/
	  ) {
	    // Set x/y if a new position is provided in props that is different than the previous.
	    if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
	      (0, _log.default)('Draggable: getDerivedStateFromProps %j', {
	        position,
	        prevPropsPosition
	      });
	      return {
	        x: position.x,
	        y: position.y,
	        prevPropsPosition: { ...position
	        }
	      };
	    }

	    return null;
	  }

	  constructor(props
	  /*: DraggableProps*/
	  ) {
	    super(props);

	    _defineProperty(this, "onDragStart", (e, coreData) => {
	      (0, _log.default)('Draggable: onDragStart: %j', coreData); // Short-circuit if user's callback killed it.

	      const shouldStart = this.props.onStart(e, (0, positionFns.createDraggableData)(this, coreData)); // Kills start event on core as well, so move handlers are never bound.

	      if (shouldStart === false) return false;
	      this.setState({
	        dragging: true,
	        dragged: true
	      });
	    });

	    _defineProperty(this, "onDrag", (e, coreData) => {
	      if (!this.state.dragging) return false;
	      (0, _log.default)('Draggable: onDrag: %j', coreData);
	      const uiData = (0, positionFns.createDraggableData)(this, coreData);
	      const newState
	      /*: $Shape<DraggableState>*/
	      = {
	        x: uiData.x,
	        y: uiData.y
	      }; // Keep within bounds.

	      if (this.props.bounds) {
	        // Save original x and y.
	        const {
	          x,
	          y
	        } = newState; // Add slack to the values used to calculate bound position. This will ensure that if
	        // we start removing slack, the element won't react to it right away until it's been
	        // completely removed.

	        newState.x += this.state.slackX;
	        newState.y += this.state.slackY; // Get bound position. This will ceil/floor the x and y within the boundaries.

	        const [newStateX, newStateY] = (0, positionFns.getBoundPosition)(this, newState.x, newState.y);
	        newState.x = newStateX;
	        newState.y = newStateY; // Recalculate slack by noting how much was shaved by the boundPosition handler.

	        newState.slackX = this.state.slackX + (x - newState.x);
	        newState.slackY = this.state.slackY + (y - newState.y); // Update the event we fire to reflect what really happened after bounds took effect.

	        uiData.x = newState.x;
	        uiData.y = newState.y;
	        uiData.deltaX = newState.x - this.state.x;
	        uiData.deltaY = newState.y - this.state.y;
	      } // Short-circuit if user's callback killed it.


	      const shouldUpdate = this.props.onDrag(e, uiData);
	      if (shouldUpdate === false) return false;
	      this.setState(newState);
	    });

	    _defineProperty(this, "onDragStop", (e, coreData) => {
	      if (!this.state.dragging) return false; // Short-circuit if user's callback killed it.

	      const shouldStop = this.props.onStop(e, (0, positionFns.createDraggableData)(this, coreData));
	      if (shouldStop === false) return false;
	      (0, _log.default)('Draggable: onDragStop: %j', coreData);
	      const newState
	      /*: $Shape<DraggableState>*/
	      = {
	        dragging: false,
	        slackX: 0,
	        slackY: 0
	      }; // If this is a controlled component, the result of this operation will be to
	      // revert back to the old position. We expect a handler on `onDragStop`, at the least.

	      const controlled = Boolean(this.props.position);

	      if (controlled) {
	        const {
	          x,
	          y
	        } = this.props.position;
	        newState.x = x;
	        newState.y = y;
	      }

	      this.setState(newState);
	    });

	    this.state = {
	      // Whether or not we are currently dragging.
	      dragging: false,
	      // Whether or not we have been dragged before.
	      dragged: false,
	      // Current transform x and y.
	      x: props.position ? props.position.x : props.defaultPosition.x,
	      y: props.position ? props.position.y : props.defaultPosition.y,
	      prevPropsPosition: { ...props.position
	      },
	      // Used for compensating for out-of-bounds drags
	      slackX: 0,
	      slackY: 0,
	      // Can only determine if SVG after mounting
	      isElementSVG: false
	    };

	    if (props.position && !(props.onDrag || props.onStop)) {
	      // eslint-disable-next-line no-console
	      console.warn('A `position` was applied to this <Draggable>, without drag handlers. This will make this ' + 'component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the ' + '`position` of this element.');
	    }
	  }

	  componentDidMount() {
	    // Check to see if the element passed is an instanceof SVGElement
	    if (typeof window.SVGElement !== 'undefined' && _reactDom.default.findDOMNode(this) instanceof window.SVGElement) {
	      this.setState({
	        isElementSVG: true
	      });
	    }
	  }

	  componentWillUnmount() {
	    this.setState({
	      dragging: false
	    }); // prevents invariant if unmounted while dragging
	  }

	  render()
	  /*: ReactElement<any>*/
	  {
	    const {
	      axis,
	      bounds,
	      children,
	      defaultPosition,
	      defaultClassName,
	      defaultClassNameDragging,
	      defaultClassNameDragged,
	      position,
	      positionOffset,
	      scale,
	      ...draggableCoreProps
	    } = this.props;
	    let style = {};
	    let svgTransform = null; // If this is controlled, we don't want to move it - unless it's dragging.

	    const controlled = Boolean(position);
	    const draggable = !controlled || this.state.dragging;
	    const validPosition = position || defaultPosition;
	    const transformOpts = {
	      // Set left if horizontal drag is enabled
	      x: (0, positionFns.canDragX)(this) && draggable ? this.state.x : validPosition.x,
	      // Set top if vertical drag is enabled
	      y: (0, positionFns.canDragY)(this) && draggable ? this.state.y : validPosition.y
	    }; // If this element was SVG, we use the `transform` attribute.

	    if (this.state.isElementSVG) {
	      svgTransform = (0, domFns.createSVGTransform)(transformOpts, positionOffset);
	    } else {
	      // Add a CSS transform to move the element around. This allows us to move the element around
	      // without worrying about whether or not it is relatively or absolutely positioned.
	      // If the item you are dragging already has a transform set, wrap it in a <span> so <Draggable>
	      // has a clean slate.
	      style = (0, domFns.createCSSTransform)(transformOpts, positionOffset);
	    } // Mark with class while dragging


	    const className = (0, _classnames.default)(children.props.className || '', defaultClassName, {
	      [defaultClassNameDragging]: this.state.dragging,
	      [defaultClassNameDragged]: this.state.dragged
	    }); // Reuse the child provided
	    // This makes it flexible to use whatever element is wanted (div, ul, etc)

	    return _react.default.createElement(_DraggableCore.default, _extends({}, draggableCoreProps, {
	      onStart: this.onDragStart,
	      onDrag: this.onDrag,
	      onStop: this.onDragStop
	    }), _react.default.cloneElement(_react.default.Children.only(children), {
	      className: className,
	      style: { ...children.props.style,
	        ...style
	      },
	      transform: svgTransform
	    }));
	  }

	}

	exports.default = Draggable;

	_defineProperty(Draggable, "displayName", 'Draggable');

	_defineProperty(Draggable, "propTypes", { // Accepts all props <DraggableCore> accepts.
	  ..._DraggableCore.default.propTypes,

	  /**
	   * `axis` determines which axis the draggable can move.
	   *
	   *  Note that all callbacks will still return data as normal. This only
	   *  controls flushing to the DOM.
	   *
	   * 'both' allows movement horizontally and vertically.
	   * 'x' limits movement to horizontal axis.
	   * 'y' limits movement to vertical axis.
	   * 'none' limits all movement.
	   *
	   * Defaults to 'both'.
	   */
	  axis: _propTypes.default.oneOf(['both', 'x', 'y', 'none']),

	  /**
	   * `bounds` determines the range of movement available to the element.
	   * Available values are:
	   *
	   * 'parent' restricts movement within the Draggable's parent node.
	   *
	   * Alternatively, pass an object with the following properties, all of which are optional:
	   *
	   * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
	   *
	   * All values are in px.
	   *
	   * Example:
	   *
	   * ```jsx
	   *   let App = React.createClass({
	   *       render: function () {
	   *         return (
	   *            <Draggable bounds={{right: 300, bottom: 300}}>
	   *              <div>Content</div>
	   *           </Draggable>
	   *         );
	   *       }
	   *   });
	   * ```
	   */
	  bounds: _propTypes.default.oneOfType([_propTypes.default.shape({
	    left: _propTypes.default.number,
	    right: _propTypes.default.number,
	    top: _propTypes.default.number,
	    bottom: _propTypes.default.number
	  }), _propTypes.default.string, _propTypes.default.oneOf([false])]),
	  defaultClassName: _propTypes.default.string,
	  defaultClassNameDragging: _propTypes.default.string,
	  defaultClassNameDragged: _propTypes.default.string,

	  /**
	   * `defaultPosition` specifies the x and y that the dragged item should start at
	   *
	   * Example:
	   *
	   * ```jsx
	   *      let App = React.createClass({
	   *          render: function () {
	   *              return (
	   *                  <Draggable defaultPosition={{x: 25, y: 25}}>
	   *                      <div>I start with transformX: 25px and transformY: 25px;</div>
	   *                  </Draggable>
	   *              );
	   *          }
	   *      });
	   * ```
	   */
	  defaultPosition: _propTypes.default.shape({
	    x: _propTypes.default.number,
	    y: _propTypes.default.number
	  }),
	  positionOffset: _propTypes.default.shape({
	    x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
	    y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
	  }),

	  /**
	   * `position`, if present, defines the current position of the element.
	   *
	   *  This is similar to how form elements in React work - if no `position` is supplied, the component
	   *  is uncontrolled.
	   *
	   * Example:
	   *
	   * ```jsx
	   *      let App = React.createClass({
	   *          render: function () {
	   *              return (
	   *                  <Draggable position={{x: 25, y: 25}}>
	   *                      <div>I start with transformX: 25px and transformY: 25px;</div>
	   *                  </Draggable>
	   *              );
	   *          }
	   *      });
	   * ```
	   */
	  position: _propTypes.default.shape({
	    x: _propTypes.default.number,
	    y: _propTypes.default.number
	  }),

	  /**
	   * These properties should be defined on the child, not here.
	   */
	  className: shims.dontSetMe,
	  style: shims.dontSetMe,
	  transform: shims.dontSetMe
	});

	_defineProperty(Draggable, "defaultProps", { ..._DraggableCore.default.defaultProps,
	  axis: 'both',
	  bounds: false,
	  defaultClassName: 'react-draggable',
	  defaultClassNameDragging: 'react-draggable-dragging',
	  defaultClassNameDragged: 'react-draggable-dragged',
	  defaultPosition: {
	    x: 0,
	    y: 0
	  },
	  position: null,
	  scale: 1
	});
	});

	unwrapExports(Draggable_1);

	var Draggable = Draggable_1.default;

	// Previous versions of this lib exported <Draggable> as the root export. As to not break
	// them, or TypeScript, we export *both* as the root and as 'default'.
	// See https://github.com/mzabriskie/react-draggable/pull/254
	// and https://github.com/mzabriskie/react-draggable/issues/266
	var reactDraggable = Draggable;
	var default_1 = Draggable;
	var DraggableCore = DraggableCore_1.default;
	reactDraggable.default = default_1;
	reactDraggable.DraggableCore = DraggableCore;

	function getStartPositions(elements) {
	  return elements.filter(isNode).reduce(function (res, node) {
	    var startPosition = {
	      x: node.__rg.position.x || node.position.x,
	      y: node.__rg.position.y || node.position.x
	    };
	    res[node.id] = startPosition;
	    return res;
	  }, {});
	}

	var NodesSelection = React.memo(function () {
	  var _useState = React.useState({
	    x: 0,
	    y: 0
	  }),
	      _useState2 = _slicedToArray(_useState, 2),
	      offset = _useState2[0],
	      setOffset = _useState2[1];

	  var _useState3 = React.useState({}),
	      _useState4 = _slicedToArray(_useState3, 2),
	      startPositions = _useState4[0],
	      setStartPositions = _useState4[1];

	  var state = useStoreState(function (s) {
	    return {
	      transform: s.transform,
	      selectedNodesBbox: s.selectedNodesBbox,
	      selectedElements: s.selectedElements
	    };
	  });
	  var updateNodePos = useStoreActions(function (a) {
	    return a.updateNodePos;
	  });

	  var _state$transform = _slicedToArray(state.transform, 3),
	      x = _state$transform[0],
	      y = _state$transform[1],
	      k = _state$transform[2];

	  var position = state.selectedNodesBbox;

	  var onStart = function onStart(evt) {
	    var scaledClient = {
	      x: evt.clientX * (1 / k),
	      y: evt.clientY * (1 / k)
	    };
	    var offsetX = scaledClient.x - position.x - x;
	    var offsetY = scaledClient.y - position.y - y;
	    var startPositions = getStartPositions(state.selectedElements);
	    setOffset({
	      x: offsetX,
	      y: offsetY
	    });
	    setStartPositions(startPositions);
	  };

	  var onDrag = function onDrag(evt) {
	    var scaledClient = {
	      x: evt.clientX * (1 / k),
	      y: evt.clientY * (1 / k)
	    };
	    state.selectedElements.filter(isNode).forEach(function (node) {
	      updateNodePos({
	        id: node.id,
	        pos: {
	          x: startPositions[node.id].x + scaledClient.x - position.x - offset.x - x,
	          y: startPositions[node.id].y + scaledClient.y - position.y - offset.y - y
	        }
	      });
	    });
	  };

	  return React__default.createElement("div", {
	    className: "react-flow__nodesselection",
	    style: {
	      transform: "translate(".concat(x, "px,").concat(y, "px) scale(").concat(k, ")")
	    }
	  }, React__default.createElement(reactDraggable, {
	    scale: k,
	    onStart: onStart,
	    onDrag: onDrag
	  }, React__default.createElement("div", {
	    className: "react-flow__nodesselection-rect",
	    style: {
	      width: state.selectedNodesBbox.width,
	      height: state.selectedNodesBbox.height,
	      top: state.selectedNodesBbox.y,
	      left: state.selectedNodesBbox.x
	    }
	  })));
	});

	function useKeyPress(keyCode) {
	  var _useState = React.useState(false),
	      _useState2 = _slicedToArray(_useState, 2),
	      keyPressed = _useState2[0],
	      setKeyPressed = _useState2[1];

	  function downHandler(evt) {
	    if (evt.keyCode === keyCode && !inInputDOMNode(evt.target)) {
	      setKeyPressed(true);
	    }
	  }

	  var upHandler = function upHandler(evt) {
	    if (evt.keyCode === keyCode && !inInputDOMNode(evt.target)) {
	      setKeyPressed(false);
	    }
	  };

	  React.useEffect(function () {
	    window.addEventListener('keydown', downHandler);
	    window.addEventListener('keyup', upHandler);
	    return function () {
	      window.removeEventListener('keydown', downHandler);
	      window.removeEventListener('keyup', upHandler);
	    };
	  }, []);
	  return keyPressed;
	}

	var d3ZoomInstance = zoom().scaleExtent([0.5, 2]).filter(function () {
	  return !event.button;
	});
	function useD3Zoom(zoomPane, onMove, shiftPressed) {
	  var state = useStoreState(function (s) {
	    return {
	      transform: s.transform,
	      d3Selection: s.d3Selection,
	      d3Zoom: s.d3Zoom,
	      edges: s.edged,
	      d3Initialised: s.d3Initialised,
	      nodesSelectionActive: s.nodesSelectionActive
	    };
	  });
	  var initD3 = useStoreActions(function (actions) {
	    return actions.initD3;
	  });
	  var updateTransform = useStoreActions(function (actions) {
	    return actions.updateTransform;
	  });
	  React.useEffect(function () {
	    var selection = select(zoomPane.current).call(d3ZoomInstance);
	    initD3({
	      zoom: d3ZoomInstance,
	      selection: selection
	    });
	  }, []);
	  React.useEffect(function () {
	    if (shiftPressed) {
	      d3ZoomInstance.on('zoom', null);
	    } else {
	      d3ZoomInstance.on('zoom', function () {
	        if (event.sourceEvent && event.sourceEvent.target !== zoomPane.current) {
	          return false;
	        }

	        updateTransform(event.transform);
	        onMove();
	      });

	      if (state.d3Selection) {
	        // we need to restore the graph transform otherwise d3 zoom transform and graph transform are not synced
	        var graphTransform = identity$1.translate(state.transform[0], state.transform[1]).scale(state.transform[2]);
	        state.d3Selection.call(state.d3Zoom.transform, graphTransform);
	      }
	    }

	    return function () {
	      d3ZoomInstance.on('zoom', null);
	    };
	  }, [shiftPressed]);
	}

	var useGlobalKeyHandler = (function (_ref) {
	  var deleteKeyCode = _ref.deleteKeyCode,
	      onElementsRemove = _ref.onElementsRemove;
	  var state = useStoreState(function (s) {
	    return {
	      selectedElements: s.selectedElements,
	      edges: s.edges
	    };
	  });
	  var setNodesSelection = useStoreActions(function (a) {
	    return a.setNodesSelection;
	  });
	  var deleteKeyPressed = useKeyPress(deleteKeyCode);
	  React.useEffect(function () {
	    if (deleteKeyPressed && state.selectedElements.length) {
	      var elementsToRemove = state.selectedElements; // we also want to remove the edges if only one node is selected

	      if (state.selectedElements.length === 1 && !isEdge(state.selectedElements[0])) {
	        var connectedEdges = getConnectedEdges(state.selectedElements, state.edges);
	        elementsToRemove = [].concat(_toConsumableArray(state.selectedElements), _toConsumableArray(connectedEdges));
	      }

	      onElementsRemove(elementsToRemove);
	      setNodesSelection({
	        isActive: false
	      });
	    }
	  }, [deleteKeyPressed]);
	  return null;
	});

	var useElementUpdater = function useElementUpdater(_ref) {
	  var elements = _ref.elements;
	  var state = useStoreState(function (s) {
	    return {
	      nodes: s.nodes,
	      edges: s.edges,
	      transform: s.transform
	    };
	  });
	  var setNodes = useStoreActions(function (a) {
	    return a.setNodes;
	  });
	  var setEdges = useStoreActions(function (a) {
	    return a.setEdges;
	  });
	  React.useEffect(function () {
	    var nodes = elements.filter(isNode);
	    var edges = elements.filter(isEdge).map(parseElement);
	    var nextNodes = nodes.map(function (propNode) {
	      var existingNode = state.nodes.find(function (n) {
	        return n.id === propNode.id;
	      });

	      if (existingNode) {
	        var data = !fastDeepEqual(existingNode.data, propNode.data) ? _objectSpread2$1({}, existingNode.data, {}, propNode.data) : existingNode.data;
	        return _objectSpread2$1({}, existingNode, {
	          data: data
	        });
	      }

	      return parseElement(propNode, state.transform);
	    });
	    var nodesChanged = !fastDeepEqual(state.nodes, nextNodes);
	    var edgesChanged = !fastDeepEqual(state.edges, edges);

	    if (nodesChanged) {
	      setNodes(nextNodes);
	    }

	    if (edgesChanged) {
	      setEdges(edges);
	    }
	  });
	  return null;
	};

	var GraphView = React.memo(function (_ref) {
	  var nodeTypes = _ref.nodeTypes,
	      edgeTypes = _ref.edgeTypes,
	      onMove = _ref.onMove,
	      onLoad = _ref.onLoad,
	      onElementClick = _ref.onElementClick,
	      onNodeDragStop = _ref.onNodeDragStop,
	      connectionLineType = _ref.connectionLineType,
	      connectionLineStyle = _ref.connectionLineStyle,
	      selectionKeyCode = _ref.selectionKeyCode,
	      onElementsRemove = _ref.onElementsRemove,
	      deleteKeyCode = _ref.deleteKeyCode,
	      elements = _ref.elements,
	      showBackground = _ref.showBackground,
	      backgroundGap = _ref.backgroundGap,
	      backgroundColor = _ref.backgroundColor,
	      backgroundType = _ref.backgroundType,
	      onConnect = _ref.onConnect;
	  var zoomPane = React.useRef();
	  var rendererNode = React.useRef();
	  var state = useStoreState(function (s) {
	    return {
	      width: s.width,
	      height: s.height,
	      nodes: s.nodes,
	      edges: s.edges,
	      d3Initialised: s.d3Initialised,
	      nodesSelectionActive: s.nodesSelectionActive
	    };
	  });
	  var updateSize = useStoreActions(function (actions) {
	    return actions.updateSize;
	  });
	  var setNodesSelection = useStoreActions(function (actions) {
	    return actions.setNodesSelection;
	  });
	  var setOnConnect = useStoreActions(function (a) {
	    return a.setOnConnect;
	  });
	  var selectionKeyPressed = useKeyPress(selectionKeyCode);

	  var onZoomPaneClick = function onZoomPaneClick() {
	    return setNodesSelection({
	      isActive: false
	    });
	  };

	  var updateDimensions = function updateDimensions() {
	    var size = getDimensions(rendererNode.current);
	    updateSize(size);
	  };

	  React.useEffect(function () {
	    updateDimensions();
	    setOnConnect(onConnect);
	    window.onresize = updateDimensions;
	    return function () {
	      window.onresize = null;
	    };
	  }, []);
	  useD3Zoom(zoomPane, onMove, selectionKeyPressed);
	  React.useEffect(function () {
	    if (state.d3Initialised) {
	      onLoad({
	        fitView: fitView,
	        zoomIn: zoomIn,
	        zoomOut: zoomOut
	      });
	    }
	  }, [state.d3Initialised]);
	  useGlobalKeyHandler({
	    onElementsRemove: onElementsRemove,
	    deleteKeyCode: deleteKeyCode
	  });
	  useElementUpdater({
	    elements: elements
	  });
	  return React__default.createElement("div", {
	    className: "react-flow__renderer",
	    ref: rendererNode
	  }, showBackground && React__default.createElement(BackgroundRenderer, {
	    gap: backgroundGap,
	    strokeColor: backgroundColor,
	    backgroundType: backgroundType
	  }), React__default.createElement(NodeRenderer, {
	    nodeTypes: nodeTypes,
	    onElementClick: onElementClick,
	    onNodeDragStop: onNodeDragStop
	  }), React__default.createElement(EdgeRenderer, {
	    width: state.width,
	    height: state.height,
	    edgeTypes: edgeTypes,
	    onElementClick: onElementClick,
	    connectionLineType: connectionLineType,
	    connectionLineStyle: connectionLineStyle
	  }), selectionKeyPressed && React__default.createElement(UserSelection, null), state.nodesSelectionActive && React__default.createElement(NodesSelection, null), React__default.createElement("div", {
	    className: "react-flow__zoompane",
	    onClick: onZoomPaneClick,
	    ref: zoomPane
	  }));
	});
	GraphView.displayName = 'GraphView';

	function _onMouseDown(evt, _ref) {
	  var nodeId = _ref.nodeId,
	      setSourceId = _ref.setSourceId,
	      setPosition = _ref.setPosition,
	      onConnect = _ref.onConnect,
	      isTarget = _ref.isTarget,
	      isValidConnection = _ref.isValidConnection;
	  var containerBounds = document.querySelector('.react-flow').getBoundingClientRect();
	  var recentHoveredHandle = null;
	  setPosition({
	    x: evt.clientX - containerBounds.x,
	    y: evt.clientY - containerBounds.y
	  });
	  setSourceId(nodeId);

	  function resetRecentHandle() {
	    if (recentHoveredHandle) {
	      recentHoveredHandle.classList.remove('valid');
	      recentHoveredHandle.classList.remove('connecting');
	    }
	  } // checks if element below mouse is a handle and returns connection in form of an object { source: 123, target: 312 }


	  function checkElementBelowIsValid(evt) {
	    var elementBelow = document.elementFromPoint(evt.clientX, evt.clientY);
	    var result = {
	      elementBelow: elementBelow,
	      isValid: false,
	      connection: null,
	      isHoveringHandle: false
	    };

	    if (elementBelow && (elementBelow.classList.contains('target') || elementBelow.classList.contains('source'))) {
	      var connection = null;

	      if (isTarget) {
	        var sourceId = elementBelow.getAttribute('data-nodeid');
	        connection = {
	          source: sourceId,
	          target: nodeId
	        };
	      } else {
	        var targetId = elementBelow.getAttribute('data-nodeid');
	        connection = {
	          source: nodeId,
	          target: targetId
	        };
	      }

	      var isValid = isValidConnection(connection);
	      result.connection = connection;
	      result.isValid = isValid;
	      result.isHoveringHandle = true;
	    }

	    return result;
	  }

	  function onMouseMove(evt) {
	    setPosition({
	      x: evt.clientX - containerBounds.x,
	      y: evt.clientY - containerBounds.y
	    });

	    var _checkElementBelowIsV = checkElementBelowIsValid(evt),
	        connection = _checkElementBelowIsV.connection,
	        elementBelow = _checkElementBelowIsV.elementBelow,
	        isValid = _checkElementBelowIsV.isValid,
	        isHoveringHandle = _checkElementBelowIsV.isHoveringHandle;

	    if (!isHoveringHandle) {
	      return resetRecentHandle();
	    }

	    var isOwnHandle = connection.source === connection.target;

	    if (!isOwnHandle) {
	      recentHoveredHandle = elementBelow;
	      elementBelow.classList.add('connecting');
	      elementBelow.classList.toggle('valid', isValid);
	    }
	  }

	  function onMouseUp(evt) {
	    var _checkElementBelowIsV2 = checkElementBelowIsValid(evt),
	        connection = _checkElementBelowIsV2.connection,
	        isValid = _checkElementBelowIsV2.isValid;

	    if (isValid) {
	      onConnect(connection);
	    }

	    resetRecentHandle();
	    setSourceId(null);
	    document.removeEventListener('mousemove', onMouseMove);
	    document.removeEventListener('mouseup', onMouseUp);
	  }

	  document.addEventListener('mousemove', onMouseMove);
	  document.addEventListener('mouseup', onMouseUp);
	}

	var BaseHandle = React.memo(function (_ref2) {
	  var type = _ref2.type,
	      nodeId = _ref2.nodeId,
	      onConnect = _ref2.onConnect,
	      position = _ref2.position,
	      setSourceId = _ref2.setSourceId,
	      setPosition = _ref2.setPosition,
	      className = _ref2.className,
	      _ref2$id = _ref2.id,
	      id = _ref2$id === void 0 ? false : _ref2$id,
	      isValidConnection = _ref2.isValidConnection,
	      rest = _objectWithoutProperties(_ref2, ["type", "nodeId", "onConnect", "position", "setSourceId", "setPosition", "className", "id", "isValidConnection"]);

	  var isTarget = type === 'target';
	  var handleClasses = classnames('react-flow__handle', className, position, {
	    source: !isTarget,
	    target: isTarget
	  });
	  var nodeIdWithHandleId = id ? "".concat(nodeId, "__").concat(id) : nodeId;
	  return React__default.createElement("div", _extends$1({
	    "data-nodeid": nodeIdWithHandleId,
	    "data-handlepos": position,
	    className: handleClasses,
	    onMouseDown: function onMouseDown(evt) {
	      return _onMouseDown(evt, {
	        nodeId: nodeIdWithHandleId,
	        setSourceId: setSourceId,
	        setPosition: setPosition,
	        onConnect: onConnect,
	        isTarget: isTarget,
	        isValidConnection: isValidConnection
	      });
	    }
	  }, rest));
	});
	BaseHandle.displayName = 'BaseHandle';
	BaseHandle.whyDidYouRender = false;

	var NodeIdContext = React.createContext(null);
	var Provider = NodeIdContext.Provider;
	var Consumer = NodeIdContext.Consumer;
	Provider.displayName = 'NodeIdProvider';

	var Handle = React.memo(function (_ref) {
	  var onConnect = _ref.onConnect,
	      rest = _objectWithoutProperties(_ref, ["onConnect"]);

	  var nodeId = React.useContext(NodeIdContext);

	  var _useStoreActions = useStoreActions(function (a) {
	    return {
	      setPosition: a.setConnectionPosition,
	      setSourceId: a.setConnectionSourceId
	    };
	  }),
	      setPosition = _useStoreActions.setPosition,
	      setSourceId = _useStoreActions.setSourceId;

	  var onConnectAction = useStoreState(function (s) {
	    return s.onConnect;
	  });

	  var onConnectExtended = function onConnectExtended(params) {
	    onConnectAction(params);
	    onConnect(params);
	  };

	  return React__default.createElement(BaseHandle, _extends$1({
	    nodeId: nodeId,
	    setPosition: setPosition,
	    setSourceId: setSourceId,
	    onConnect: onConnectExtended
	  }, rest));
	});
	Handle.displayName = 'Handle';
	Handle.propTypes = {
	  type: propTypes.oneOf(['source', 'target']),
	  position: propTypes.oneOf(['top', 'right', 'bottom', 'left']),
	  onConnect: propTypes.func,
	  isValidConnection: propTypes.func
	};
	Handle.defaultProps = {
	  type: 'source',
	  position: 'top',
	  onConnect: function onConnect() {},
	  isValidConnection: function isValidConnection() {
	    return true;
	  }
	};

	var nodeStyles = {
	  background: '#ff6060',
	  padding: 10,
	  borderRadius: 5,
	  width: 150
	};
	var DefaultNode = (function (_ref) {
	  var data = _ref.data,
	      style = _ref.style;
	  return React__default.createElement("div", {
	    style: _objectSpread2$1({}, nodeStyles, {}, style)
	  }, React__default.createElement(Handle, {
	    type: "target",
	    position: "top"
	  }), data.label, React__default.createElement(Handle, {
	    type: "source",
	    position: "bottom"
	  }));
	});

	var nodeStyles$1 = {
	  background: '#9999ff',
	  padding: 10,
	  borderRadius: 5,
	  width: 150
	};
	var InputNode = (function (_ref) {
	  var data = _ref.data,
	      style = _ref.style;
	  return React__default.createElement("div", {
	    style: _objectSpread2$1({}, nodeStyles$1, {}, style)
	  }, data.label, React__default.createElement(Handle, {
	    type: "source",
	    position: "bottom"
	  }));
	});

	var nodeStyles$2 = {
	  background: '#55dd99',
	  padding: 10,
	  borderRadius: 5,
	  width: 150
	};
	var OutputNode = (function (_ref) {
	  var data = _ref.data,
	      style = _ref.style;
	  return React__default.createElement("div", {
	    style: _objectSpread2$1({}, nodeStyles$2, {}, style)
	  }, React__default.createElement(Handle, {
	    type: "target",
	    position: "top"
	  }), data.label);
	});

	var isHandle = function isHandle(e) {
	  return e.target.className && e.target.className.includes && (e.target.className.includes('source') || e.target.className.includes('target'));
	};

	var hasResizeObserver = !!window.ResizeObserver;

	var getHandleBounds = function getHandleBounds(sel, nodeElement, parentBounds, k) {
	  var handles = nodeElement.querySelectorAll(sel);

	  if (!handles || !handles.length) {
	    return null;
	  }

	  return [].map.call(handles, function (handle) {
	    var bounds = handle.getBoundingClientRect();
	    var dimensions = getDimensions(handle);
	    var nodeIdAttr = handle.getAttribute('data-nodeid');
	    var handlePosition = handle.getAttribute('data-handlepos');
	    var nodeIdSplitted = nodeIdAttr.split('__');
	    var handleId = null;

	    if (nodeIdSplitted) {
	      handleId = nodeIdSplitted.length ? nodeIdSplitted[1] : nodeIdSplitted;
	    }

	    return _objectSpread2$1({
	      id: handleId,
	      position: handlePosition,
	      x: (bounds.x - parentBounds.x) * (1 / k),
	      y: (bounds.y - parentBounds.y) * (1 / k)
	    }, dimensions);
	  });
	};

	var _onStart = function onStart(evt, _ref) {
	  var setOffset = _ref.setOffset,
	      onClick = _ref.onClick,
	      id = _ref.id,
	      type = _ref.type,
	      data = _ref.data,
	      position = _ref.position,
	      transform = _ref.transform;

	  if (inInputDOMNode(evt) || isHandle(evt)) {
	    return false;
	  }

	  var scaledClient = {
	    x: evt.clientX * (1 / [transform[2]]),
	    y: evt.clientY * (1 / [transform[2]])
	  };
	  var offsetX = scaledClient.x - position.x - transform[0];
	  var offsetY = scaledClient.y - position.y - transform[1];
	  var node = {
	    id: id,
	    type: type,
	    position: position,
	    data: data
	  };
	  store.dispatch.setSelectedElements({
	    id: id,
	    type: type
	  });
	  setOffset({
	    x: offsetX,
	    y: offsetY
	  });
	  onClick(node);
	};

	var _onDrag = function onDrag(evt, _ref2) {
	  var setDragging = _ref2.setDragging,
	      id = _ref2.id,
	      offset = _ref2.offset,
	      transform = _ref2.transform;
	  var scaledClient = {
	    x: evt.clientX * (1 / transform[2]),
	    y: evt.clientY * (1 / transform[2])
	  };
	  setDragging(true);
	  store.dispatch.updateNodePos({
	    id: id,
	    pos: {
	      x: scaledClient.x - transform[0] - offset.x,
	      y: scaledClient.y - transform[1] - offset.y
	    }
	  });
	};

	var _onStop = function onStop(_ref3) {
	  var onNodeDragStop = _ref3.onNodeDragStop,
	      setDragging = _ref3.setDragging,
	      isDragging = _ref3.isDragging,
	      id = _ref3.id,
	      type = _ref3.type,
	      position = _ref3.position,
	      data = _ref3.data;

	  if (!isDragging) {
	    return false;
	  }

	  setDragging(false);
	  onNodeDragStop({
	    id: id,
	    type: type,
	    position: position,
	    data: data
	  });
	};

	var wrapNode = (function (NodeComponent) {
	  var NodeWrapper = React.memo(function (props) {
	    var nodeElement = React.useRef(null);

	    var _useState = React.useState({
	      x: 0,
	      y: 0
	    }),
	        _useState2 = _slicedToArray(_useState, 2),
	        offset = _useState2[0],
	        setOffset = _useState2[1];

	    var _useState3 = React.useState(false),
	        _useState4 = _slicedToArray(_useState3, 2),
	        isDragging = _useState4[0],
	        setDragging = _useState4[1];

	    var id = props.id,
	        type = props.type,
	        data = props.data,
	        transform = props.transform,
	        xPos = props.xPos,
	        yPos = props.yPos,
	        selected = props.selected,
	        onClick = props.onClick,
	        onNodeDragStop = props.onNodeDragStop,
	        style = props.style;
	    var position = {
	      x: xPos,
	      y: yPos
	    };
	    var nodeClasses = classnames('react-flow__node', {
	      selected: selected
	    });
	    var nodeStyle = {
	      zIndex: selected ? 10 : 3,
	      transform: "translate(".concat(xPos, "px,").concat(yPos, "px)")
	    };

	    var updateNode = function updateNode() {
	      var storeState = store.getState();
	      var bounds = nodeElement.current.getBoundingClientRect();
	      var dimensions = getDimensions(nodeElement.current);
	      var handleBounds = {
	        source: getHandleBounds('.source', nodeElement.current, bounds, storeState.transform[2]),
	        target: getHandleBounds('.target', nodeElement.current, bounds, storeState.transform[2])
	      };
	      store.dispatch.updateNodeData(_objectSpread2$1({
	        id: id
	      }, dimensions, {
	        handleBounds: handleBounds
	      }));
	    };

	    React.useEffect(function () {
	      updateNode();
	      var resizeObserver = null;

	      if (hasResizeObserver) {
	        resizeObserver = new ResizeObserver(function (entries) {
	          var _iteratorNormalCompletion = true;
	          var _didIteratorError = false;
	          var _iteratorError = undefined;

	          try {
	            for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	              var entry = _step.value;
	              updateNode();
	            }
	          } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
	                _iterator["return"]();
	              }
	            } finally {
	              if (_didIteratorError) {
	                throw _iteratorError;
	              }
	            }
	          }
	        });
	        resizeObserver.observe(nodeElement.current);
	      }

	      return function () {
	        if (hasResizeObserver && resizeObserver) {
	          resizeObserver.unobserve(nodeElement.current);
	        }
	      };
	    }, []);
	    return React__default.createElement(reactDraggable.DraggableCore, {
	      onStart: function onStart(evt) {
	        return _onStart(evt, {
	          onClick: onClick,
	          id: id,
	          type: type,
	          data: data,
	          setOffset: setOffset,
	          transform: transform,
	          position: position
	        });
	      },
	      onDrag: function onDrag(evt) {
	        return _onDrag(evt, {
	          setDragging: setDragging,
	          id: id,
	          offset: offset,
	          transform: transform
	        });
	      },
	      onStop: function onStop() {
	        return _onStop({
	          onNodeDragStop: onNodeDragStop,
	          isDragging: isDragging,
	          setDragging: setDragging,
	          id: id,
	          type: type,
	          position: position,
	          data: data
	        });
	      },
	      scale: transform[2]
	    }, React__default.createElement("div", {
	      className: nodeClasses,
	      ref: nodeElement,
	      style: nodeStyle
	    }, React__default.createElement(Provider, {
	      value: id
	    }, React__default.createElement(NodeComponent, {
	      id: id,
	      data: data,
	      type: type,
	      style: style,
	      selected: selected
	    }))));
	  });
	  NodeWrapper.displayName = 'NodeWrapper';
	  NodeWrapper.whyDidYouRender = false;
	  return NodeWrapper;
	});

	function createNodeTypes(nodeTypes) {
	  var standardTypes = {
	    input: wrapNode(nodeTypes.input || InputNode),
	    "default": wrapNode(nodeTypes["default"] || DefaultNode),
	    output: wrapNode(nodeTypes.output || OutputNode)
	  };
	  var specialTypes = Object.keys(nodeTypes).filter(function (k) {
	    return !['input', 'default', 'output'].includes(k);
	  }).reduce(function (res, key) {
	    res[key] = wrapNode(nodeTypes[key] || DefaultNode);
	    return res;
	  }, {});
	  return _objectSpread2$1({}, standardTypes, {}, specialTypes);
	}

	var BezierEdge = React.memo(function (_ref) {
	  var sourceX = _ref.sourceX,
	      sourceY = _ref.sourceY,
	      targetX = _ref.targetX,
	      targetY = _ref.targetY,
	      sourcePosition = _ref.sourcePosition,
	      targetPosition = _ref.targetPosition,
	      _ref$style = _ref.style,
	      style = _ref$style === void 0 ? {} : _ref$style;
	  var yOffset = Math.abs(targetY - sourceY) / 2;
	  var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
	  var dAttr = "M".concat(sourceX, ",").concat(sourceY, " C").concat(sourceX, ",").concat(centerY, " ").concat(targetX, ",").concat(centerY, " ").concat(targetX, ",").concat(targetY);

	  if (['left', 'right'].includes(sourcePosition) && ['left', 'right'].includes(targetPosition)) {
	    var xOffset = Math.abs(targetX - sourceX) / 2;
	    var centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
	    dAttr = "M".concat(sourceX, ",").concat(sourceY, " C").concat(centerX, ",").concat(sourceY, " ").concat(centerX, ",").concat(targetY, " ").concat(targetX, ",").concat(targetY);
	  } else if (['left', 'right'].includes(sourcePosition) || ['left', 'right'].includes(targetPosition)) {
	    dAttr = "M".concat(sourceX, ",").concat(sourceY, " C").concat(sourceX, ",").concat(targetY, " ").concat(sourceX, ",").concat(targetY, " ").concat(targetX, ",").concat(targetY);
	  }

	  return React__default.createElement("path", _extends$1({}, style, {
	    d: dAttr
	  }));
	});

	var StraightEdge = React.memo(function (props) {
	  var sourceX = props.sourceX,
	      sourceY = props.sourceY,
	      targetX = props.targetX,
	      targetY = props.targetY,
	      _props$style = props.style,
	      style = _props$style === void 0 ? {} : _props$style;
	  return React__default.createElement("path", _extends$1({}, style, {
	    d: "M ".concat(sourceX, ",").concat(sourceY, "L ").concat(targetX, ",").concat(targetY)
	  }));
	});

	var StepEdge = React.memo(function (props) {
	  var sourceX = props.sourceX,
	      sourceY = props.sourceY,
	      targetX = props.targetX,
	      targetY = props.targetY,
	      _props$style = props.style,
	      style = _props$style === void 0 ? {} : _props$style;
	  var yOffset = Math.abs(targetY - sourceY) / 2;
	  var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
	  return React__default.createElement("path", _extends$1({}, style, {
	    d: "M ".concat(sourceX, ",").concat(sourceY, "L ").concat(sourceX, ",").concat(centerY, "L ").concat(targetX, ",").concat(centerY, "L ").concat(targetX, ",").concat(targetY)
	  }));
	});

	var wrapEdge = (function (EdgeComponent) {
	  var EdgeWrapper = React.memo(function (props) {
	    var id = props.id,
	        source = props.source,
	        target = props.target,
	        type = props.type,
	        animated = props.animated,
	        selected = props.selected,
	        onClick = props.onClick;
	    var edgeClasses = classnames('react-flow__edge', {
	      selected: selected,
	      animated: animated
	    });

	    var onEdgeClick = function onEdgeClick(evt) {
	      if (inInputDOMNode(evt)) {
	        return false;
	      }

	      store.dispatch.setSelectedElements({
	        id: id,
	        source: source,
	        target: target
	      });
	      onClick({
	        id: id,
	        source: source,
	        target: target,
	        type: type
	      });
	    };

	    return React__default.createElement("g", {
	      className: edgeClasses,
	      onClick: onEdgeClick
	    }, React__default.createElement(EdgeComponent, props));
	  });
	  EdgeWrapper.displayName = 'EdgeWrapper';
	  EdgeWrapper.whyDidYouRender = false;
	  return EdgeWrapper;
	});

	function createEdgeTypes(edgeTypes) {
	  var standardTypes = {
	    "default": wrapEdge(edgeTypes["default"] || BezierEdge),
	    straight: wrapEdge(edgeTypes.bezier || StraightEdge)
	  };
	  var specialTypes = Object.keys(edgeTypes).filter(function (k) {
	    return !['default', 'bezier'].includes(k);
	  }).reduce(function (res, key) {
	    res[key] = wrapEdge(edgeTypes[key] || BezierEdge);
	    return res;
	  }, {});
	  return _objectSpread2$1({}, standardTypes, {}, specialTypes);
	}

	function styleInject(css, ref) {
	  if ( ref === void 0 ) ref = {};
	  var insertAt = ref.insertAt;

	  if (!css || typeof document === 'undefined') { return; }

	  var head = document.head || document.getElementsByTagName('head')[0];
	  var style = document.createElement('style');
	  style.type = 'text/css';

	  if (insertAt === 'top') {
	    if (head.firstChild) {
	      head.insertBefore(style, head.firstChild);
	    } else {
	      head.appendChild(style);
	    }
	  } else {
	    head.appendChild(style);
	  }

	  if (style.styleSheet) {
	    style.styleSheet.cssText = css;
	  } else {
	    style.appendChild(document.createTextNode(css));
	  }
	}

	var css = ".react-flow {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  overflow: hidden;\n}\n\n.react-flow__renderer {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n}\n\n.react-flow__zoompane {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1;\n}\n\n.react-flow__selectionpane {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n\n.react-flow__selection {\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: rgba(0, 89, 220, 0.08);\n  border: 1px dotted rgba(0, 89, 220, 0.8);\n}\n\n.react-flow__edges {\n  position: absolute;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n  z-index: 2;\n}\n\n.react-flow__edge {\n  fill: none;\n  stroke: #bbb;\n  stroke-width: 2;\n  pointer-events: all;\n}\n\n.react-flow__edge.selected {\n    stroke: #555;\n  }\n\n.react-flow__edge.animated {\n    stroke-dasharray: 5;\n    -webkit-animation: dashdraw 0.5s linear infinite;\n            animation: dashdraw 0.5s linear infinite;\n  }\n\n.react-flow__edge.connection {\n    stroke: '#ddd';\n    pointer-events: none;\n  }\n\n@-webkit-keyframes dashdraw {\n  from {stroke-dashoffset: 10}\n}\n\n@keyframes dashdraw {\n  from {stroke-dashoffset: 10}\n}\n\n.react-flow__nodes {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  z-index: 3;\n  pointer-events: none;\n  transform-origin: 0 0;\n}\n\n.react-flow__node {\n  position: absolute;\n  color: #222;\n  font-family: sans-serif;\n  font-size: 12px;\n  text-align: center;\n  cursor: -webkit-grab;\n  cursor: grab;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  pointer-events: all;\n  transform-origin: 0 0;\n}\n\n.react-flow__node:hover > * {\n    box-shadow: 0 1px 5px 2px rgba(0, 0, 0, 0.08);\n  }\n\n.react-flow__node.selected > * {\n    box-shadow: 0 0 0 2px #555;\n  }\n\n.react-flow__handle {\n  position: absolute;\n  width: 10px;\n  height: 8px;\n  background: rgba(255, 255, 255, 0.4);\n  cursor: crosshair;\n}\n\n.react-flow__handle.bottom {\n    top: auto;\n    left: 50%;\n    bottom: 0;\n    transform: translate(-50%, 0);\n  }\n\n.react-flow__handle.top {\n    left: 50%;\n    top: 0;\n    transform: translate(-50%, 0);\n  }\n\n.react-flow__handle.left {\n    top: 50%;\n    left: 0;\n    transform: translate(0, -50%);\n\n  }\n\n.react-flow__handle.right {\n    right: 0;\n    top: 50%;\n    transform: translate(0, -50%);\n  }\n\n.react-flow__nodesselection {\n  z-index: 3;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  transform-origin: left top;\n  pointer-events: none;\n}\n\n.react-flow__nodesselection-rect {\n    position: absolute;\n    background: rgba(0, 89, 220, 0.08);\n    border: 1px dotted rgba(0, 89, 220, 0.8);\n    pointer-events: all;\n  }\n\n.react-flow__controls {\n  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);\n}\n\n.react-flow__controls-button {\n    background: #fefefe;\n    border-bottom: 1px solid #eee;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: 16px;\n    height: 16px;\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    padding: 5px;\n  }\n\n.react-flow__controls-button img {\n      width: 100%;\n    }\n\n.react-flow__controls-button:hover {\n      background: #f4f4f4;\n    }\n";
	styleInject(css);

	var ReactFlow = function ReactFlow(_ref) {
	  var style = _ref.style,
	      onElementClick = _ref.onElementClick,
	      elements = _ref.elements,
	      children = _ref.children,
	      nodeTypes = _ref.nodeTypes,
	      edgeTypes = _ref.edgeTypes,
	      onLoad = _ref.onLoad,
	      onMove = _ref.onMove,
	      onElementsRemove = _ref.onElementsRemove,
	      onConnect = _ref.onConnect,
	      onNodeDragStop = _ref.onNodeDragStop,
	      connectionLineType = _ref.connectionLineType,
	      connectionLineStyle = _ref.connectionLineStyle,
	      deleteKeyCode = _ref.deleteKeyCode,
	      selectionKeyCode = _ref.selectionKeyCode,
	      showBackground = _ref.showBackground,
	      backgroundGap = _ref.backgroundGap,
	      backgroundType = _ref.backgroundType,
	      backgroundColor = _ref.backgroundColor;
	  var nodeTypesParsed = React.useMemo(function () {
	    return createNodeTypes(nodeTypes);
	  }, []);
	  var edgeTypesParsed = React.useMemo(function () {
	    return createEdgeTypes(edgeTypes);
	  }, []);
	  return React__default.createElement("div", {
	    style: style,
	    className: "react-flow"
	  }, React__default.createElement(StoreProvider, {
	    store: store
	  }, React__default.createElement(GraphView, {
	    onLoad: onLoad,
	    onMove: onMove,
	    onElementClick: onElementClick,
	    onNodeDragStop: onNodeDragStop,
	    nodeTypes: nodeTypesParsed,
	    edgeTypes: edgeTypesParsed,
	    connectionLineType: connectionLineType,
	    connectionLineStyle: connectionLineStyle,
	    selectionKeyCode: selectionKeyCode,
	    onElementsRemove: onElementsRemove,
	    deleteKeyCode: deleteKeyCode,
	    elements: elements,
	    onConnect: onConnect,
	    backgroundColor: backgroundColor,
	    backgroundGap: backgroundGap,
	    showBackground: showBackground,
	    backgroundType: backgroundType
	  }), children));
	};

	ReactFlow.displayName = 'ReactFlow';
	ReactFlow.propTypes = {
	  onElementClick: propTypes.func,
	  onElementsRemove: propTypes.func,
	  onNodeDragStop: propTypes.func,
	  onConnect: propTypes.func,
	  onLoad: propTypes.func,
	  onMove: propTypes.func,
	  nodeTypes: propTypes.object,
	  edgeTypes: propTypes.object,
	  connectionLineType: propTypes.string,
	  connectionLineStyle: propTypes.object,
	  deleteKeyCode: propTypes.number,
	  selectionKeyCode: propTypes.number,
	  gridColor: propTypes.string,
	  gridGap: propTypes.number,
	  showBackground: propTypes.bool,
	  backgroundType: propTypes.oneOf(['grid'])
	};
	ReactFlow.defaultProps = {
	  onElementClick: function onElementClick() {},
	  onElementsRemove: function onElementsRemove() {},
	  onNodeDragStop: function onNodeDragStop() {},
	  onConnect: function onConnect() {},
	  onLoad: function onLoad() {},
	  onMove: function onMove() {},
	  nodeTypes: {
	    input: InputNode,
	    "default": DefaultNode,
	    output: OutputNode
	  },
	  edgeTypes: {
	    "default": BezierEdge,
	    straight: StraightEdge,
	    step: StepEdge
	  },
	  connectionLineType: 'bezier',
	  connectionLineStyle: {},
	  deleteKeyCode: 8,
	  selectionKeyCode: 16,
	  backgroundColor: '#999',
	  backgroundGap: 24,
	  showBackground: true,
	  backgroundType: 'grid'
	};

	var baseStyle = {
	  position: 'absolute',
	  zIndex: 5,
	  bottom: 10,
	  right: 10,
	  width: 200
	};
	var index = (function (_ref) {
	  var _ref$style = _ref.style,
	      style = _ref$style === void 0 ? {} : _ref$style,
	      className = _ref.className,
	      _ref$bgColor = _ref.bgColor,
	      bgColor = _ref$bgColor === void 0 ? '#f8f8f8' : _ref$bgColor,
	      _ref$nodeColor = _ref.nodeColor,
	      nodeColor = _ref$nodeColor === void 0 ? '#ddd' : _ref$nodeColor;
	  var canvasNode = React.useRef(null);
	  var state = useStoreState(function (s) {
	    return {
	      width: s.width,
	      height: s.height,
	      nodes: s.nodes,
	      transform: s.transform
	    };
	  });
	  var mapClasses = classnames('react-flow__minimap', className);
	  var nodePositions = state.nodes.map(function (n) {
	    return n.__rg.position;
	  });
	  var width = style.width || baseStyle.width;
	  var height = state.height / (state.width || 1) * width;
	  var bbox = {
	    x: 0,
	    y: 0,
	    width: state.width,
	    height: state.height
	  };
	  var scaleFactor = width / state.width;
	  var nodeColorFunc = isFunction(nodeColor) ? nodeColor : function () {
	    return nodeColor;
	  };
	  React.useEffect(function () {
	    if (canvasNode) {
	      var ctx = canvasNode.current.getContext('2d');
	      var nodesInside = getNodesInside(state.nodes, bbox, state.transform, true);
	      ctx.fillStyle = bgColor;
	      ctx.fillRect(0, 0, width, height);
	      nodesInside.forEach(function (n) {
	        var pos = n.__rg.position;
	        var transformX = state.transform[0];
	        var transformY = state.transform[1];
	        var x = pos.x * state.transform[2] + transformX;
	        var y = pos.y * state.transform[2] + transformY;
	        ctx.fillStyle = nodeColorFunc(n);
	        ctx.fillRect(x * scaleFactor, y * scaleFactor, n.__rg.width * scaleFactor * state.transform[2], n.__rg.height * scaleFactor * state.transform[2]);
	      });
	    }
	  }, [nodePositions, state.transform, height]);
	  return React__default.createElement("canvas", {
	    style: _objectSpread2$1({}, baseStyle, {}, style, {
	      height: height
	    }),
	    width: width,
	    height: height,
	    className: mapClasses,
	    ref: canvasNode
	  });
	});

	var plusIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z\"/></svg>";

	var minusIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M96 235h320v42H96z\"/></svg>";

	var fitviewIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M96 124.2c0-6.9 5.2-12.2 12.2-12.2H176V64h-66.8C75.7 64 48 90.7 48 124.2V192h48v-67.8zM403.6 64H336v48h67.2c6.9 0 12.8 5.2 12.8 12.2V192h48v-67.8c0-33.5-27-60.2-60.4-60.2zM416 386.8c0 6.9-5.2 12.2-12.2 12.2H336v49h67.8c33.5 0 60.2-27.7 60.2-61.2V320h-48v66.8zM108.2 399c-6.9 0-12.2-5.2-12.2-12.2V320H48v66.8c0 33.5 27.7 61.2 61.2 61.2H176v-49h-67.8z\"/></svg>";

	var baseStyle$1 = {
	  position: 'absolute',
	  zIndex: 5,
	  bottom: 10,
	  left: 10
	};
	var index$1 = (function (_ref) {
	  var style = _ref.style,
	      className = _ref.className;
	  var mapClasses = classnames('react-flow__controls', className);
	  return React__default.createElement("div", {
	    className: mapClasses,
	    style: _objectSpread2$1({}, baseStyle$1, {}, style)
	  }, React__default.createElement("div", {
	    className: "react-flow__controls-button react-flow__controls-zoomin",
	    onClick: zoomIn
	  }, React__default.createElement("img", {
	    src: plusIcon
	  })), React__default.createElement("div", {
	    className: "react-flow__controls-button  react-flow__controls-zoomout",
	    onClick: zoomOut
	  }, React__default.createElement("img", {
	    src: minusIcon
	  })), React__default.createElement("div", {
	    className: "react-flow__controls-button  react-flow__controls-fitview",
	    onClick: fitView
	  }, React__default.createElement("img", {
	    src: fitviewIcon
	  })));
	});

	exports.Controls = index$1;
	exports.Handle = Handle;
	exports.MiniMap = index;
	exports.addEdge = addEdge;
	exports.default = ReactFlow;
	exports.getOutgoers = getOutgoers;
	exports.isEdge = isEdge;
	exports.isNode = isNode;
	exports.removeElements = removeElements;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ReactFlow.js.map
