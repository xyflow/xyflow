'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactDom = _interopDefault(require('react-dom'));

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
    if (has(value, key)) {
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
function has(thing, prop) {
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
      if (base[key] === undefined && !has(base, key)) {
        assigned[key] = true;
        markChanged(state);
      } else if (!assigned[key]) {
        // Only untouched properties trigger recursion.
        markChangesRecursively(draft[key]);
      }
    }); // Look for removed keys.

    Object.keys(base).forEach(function (key) {
      // The `undefined` check is a fast path for pre-existing keys.
      if (draft[key] === undefined && !has(draft, key)) {
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

    if (baseValue === undefined && !has(base, key)) {
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

  if (!state.modified && has(drafts, prop)) {
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
          if (!has(copy, prop)) { this$1.onDelete(state, prop); }
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
function createStoreDispatchHook(Context) {
  return function useStoreDispatch() {
    var store = React.useContext(Context);
    return store.dispatch;
  };
}
var useStoreDispatch = createStoreDispatchHook(StoreContext);
function useStore() {
  return React.useContext(StoreContext);
}
function createTypedHooks() {
  return {
    useStoreActions: useStoreActions,
    useStoreDispatch: useStoreDispatch,
    useStoreState: useStoreState,
    useStore: useStore
  };
}

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

var typedHooks = createTypedHooks();
var useStoreActions$1 = typedHooks.useStoreActions;
var useStoreState$1 = typedHooks.useStoreState;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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

var storeModel = {
    width: 0,
    height: 0,
    transform: [0, 0, 1],
    nodes: [],
    edges: [],
    selectedElements: [],
    selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },
    d3Zoom: null,
    d3Selection: null,
    d3Initialised: false,
    nodesSelectionActive: false,
    selectionActive: false,
    selection: null,
    connectionSourceId: null,
    connectionPosition: { x: 0, y: 0 },
    snapGrid: [16, 16],
    snapToGrid: true,
    onConnect: function () { },
    setOnConnect: action(function (state, onConnect) {
        state.onConnect = onConnect;
    }),
    setNodes: action(function (state, nodes) {
        state.nodes = nodes;
    }),
    setEdges: action(function (state, edges) {
        state.edges = edges;
    }),
    updateNodeData: action(function (state, _a) {
        var id = _a.id, data = __rest(_a, ["id"]);
        state.nodes.forEach(function (n) {
            if (n.id === id) {
                n.__rg = __assign(__assign({}, n.__rg), data);
            }
        });
    }),
    updateNodePos: action(function (state, _a) {
        var id = _a.id, pos = _a.pos;
        var position = pos;
        if (state.snapToGrid) {
            var transformedGridSizeX = state.snapGrid[0] * state.transform[2];
            var transformedGridSizeY = state.snapGrid[1] * state.transform[2];
            position = {
                x: transformedGridSizeX * Math.round(pos.x / transformedGridSizeX),
                y: transformedGridSizeY * Math.round(pos.y / transformedGridSizeY),
            };
        }
        state.nodes.forEach(function (n) {
            if (n.id === id) {
                n.__rg = __assign(__assign({}, n.__rg), { position: position });
            }
        });
    }),
    setSelection: action(function (state, isActive) {
        state.selectionActive = isActive;
    }),
    setNodesSelection: action(function (state, _a) {
        var isActive = _a.isActive, selection = _a.selection;
        if (!isActive || typeof selection === 'undefined') {
            state.nodesSelectionActive = false;
            state.selectedElements = [];
            return;
        }
        var selectedNodes = getNodesInside(state.nodes, selection, state.transform);
        if (!selectedNodes.length) {
            state.nodesSelectionActive = false;
            state.selectedElements = [];
            return;
        }
        var selectedNodesBbox = getRectOfNodes(selectedNodes);
        state.selection = selection;
        state.nodesSelectionActive = true;
        state.selectedNodesBbox = selectedNodesBbox;
        state.nodesSelectionActive = true;
    }),
    setSelectedElements: action(function (state, elements) {
        var selectedElementsArr = Array.isArray(elements) ? elements : [elements];
        var selectedElementsUpdated = !fastDeepEqual(selectedElementsArr, state.selectedElements);
        var selectedElements = selectedElementsUpdated
            ? selectedElementsArr
            : state.selectedElements;
        state.selectedElements = selectedElements;
    }),
    updateSelection: action(function (state, selection) {
        var selectedNodes = getNodesInside(state.nodes, selection, state.transform);
        var selectedEdges = getConnectedEdges(selectedNodes, state.edges);
        var nextSelectedElements = __spreadArrays(selectedNodes, selectedEdges);
        var selectedElementsUpdated = !fastDeepEqual(nextSelectedElements, state.selectedElements);
        state.selection = selection;
        state.selectedElements = selectedElementsUpdated
            ? nextSelectedElements
            : state.selectedElements;
    }),
    updateTransform: action(function (state, transform) {
        state.transform = [transform.x, transform.y, transform.k];
    }),
    updateSize: action(function (state, size) {
        state.width = size.width;
        state.height = size.height;
    }),
    initD3: action(function (state, _a) {
        var zoom = _a.zoom, selection = _a.selection;
        state.d3Zoom = zoom;
        state.d3Selection = selection;
        state.d3Initialised = true;
    }),
    setConnectionPosition: action(function (state, position) {
        state.connectionPosition = position;
    }),
    setConnectionSourceId: action(function (state, sourceId) {
        state.connectionSourceId = sourceId;
    }),
    setSnapGrid: action(function (state, _a) {
        var snapToGrid = _a.snapToGrid, snapGrid = _a.snapGrid;
        state.snapToGrid = snapToGrid;
        state.snapGrid = snapGrid;
    }),
};
var store = createStore$1(storeModel);

var isEdge = function (element) {
    return element.hasOwnProperty('source') && element.hasOwnProperty('target');
};
var isNode = function (element) {
    return !element.hasOwnProperty('source') && !element.hasOwnProperty('target');
};
var getOutgoers = function (node, elements) {
    if (!isNode(node)) {
        return [];
    }
    var outgoerIds = elements.filter(function (e) { return e.source === node.id; }).map(function (e) { return e.target; });
    return elements.filter(function (e) { return outgoerIds.includes(e.id); });
};
var removeElements = function (elementsToRemove, elements) {
    var nodeIdsToRemove = elementsToRemove.map(function (n) { return n.id; });
    return elements.filter(function (element) {
        var edgeElement = element;
        return !(nodeIdsToRemove.includes(element.id) ||
            nodeIdsToRemove.includes(edgeElement.target) ||
            nodeIdsToRemove.includes(edgeElement.source));
    });
};
var getEdgeId = function (_a) {
    var source = _a.source, target = _a.target;
    return "reactflow__edge-" + source + "-" + target;
};
var addEdge = function (edgeParams, elements) {
    if (!edgeParams.source || !edgeParams.target) {
        throw new Error('Can not create edge. An edge needs a source and a target');
    }
    return elements.concat(__assign(__assign({}, edgeParams), { id: typeof edgeParams.id !== 'undefined' ? edgeParams.id : getEdgeId(edgeParams) }));
};
var pointToRendererPoint = function (_a, _b, snapToGrid, _c) {
    var x = _a.x, y = _a.y;
    var tx = _b[0], ty = _b[1], tScale = _b[2];
    var snapX = _c[0], snapY = _c[1];
    var position = {
        x: (x - tx) / tScale,
        y: (y - ty) / tScale,
    };
    if (snapToGrid) {
        var transformedGridSizeX = snapX * tScale;
        var transformedGridSizeY = snapY * tScale;
        return {
            x: transformedGridSizeX * Math.round(position.x / transformedGridSizeX),
            y: transformedGridSizeY * Math.round(position.y / transformedGridSizeY),
        };
    }
    return position;
};
var parseElement = function (element, transform, snapToGrid, snapGrid) {
    if (!element.id) {
        throw new Error('All elements (nodes and edges) need to have an id.');
    }
    if (isEdge(element)) {
        return __assign(__assign({}, element), { id: element.id.toString(), type: element.type || 'default' });
    }
    var nodeElement = element;
    return __assign(__assign({}, nodeElement), { id: nodeElement.id.toString(), type: nodeElement.type || 'default', __rg: {
            position: pointToRendererPoint(nodeElement.position, transform, snapToGrid, snapGrid),
            width: null,
            height: null,
            handleBounds: {},
        } });
};
var getBoundsOfBoxes = function (box1, box2) { return ({
    x: Math.min(box1.x, box2.x),
    y: Math.min(box1.y, box2.y),
    x2: Math.max(box1.x2, box2.x2),
    y2: Math.max(box1.y2, box2.y2),
}); };
var rectToBox = function (_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    return ({
        x: x,
        y: y,
        x2: x + width,
        y2: y + height,
    });
};
var boxToRect = function (_a) {
    var x = _a.x, y = _a.y, x2 = _a.x2, y2 = _a.y2;
    return ({
        x: x,
        y: y,
        width: x2 - x,
        height: y2 - y,
    });
};
var getBoundsofRects = function (rect1, rect2) {
    return boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
};
var getRectOfNodes = function (nodes) {
    var box = nodes.reduce(function (currBox, _a) {
        var _b = _a.__rg, position = _b.position, width = _b.width, height = _b.height;
        return getBoundsOfBoxes(currBox, rectToBox(__assign(__assign({}, position), { width: width, height: height })));
    }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
    return boxToRect(box);
};
var getNodesInside = function (nodes, rect, _a, partially) {
    var _b = _a === void 0 ? [0, 0, 1] : _a, tx = _b[0], ty = _b[1], tScale = _b[2];
    if (partially === void 0) { partially = false; }
    var rBox = rectToBox({
        x: (rect.x - tx) / tScale,
        y: (rect.y - ty) / tScale,
        width: rect.width / tScale,
        height: rect.height / tScale,
    });
    return nodes.filter(function (_a) {
        var _b = _a.__rg, position = _b.position, width = _b.width, height = _b.height;
        var nBox = rectToBox(__assign(__assign({}, position), { width: width, height: height }));
        var xOverlap = Math.max(0, Math.min(rBox.x2, nBox.x2) - Math.max(rBox.x, nBox.x));
        var yOverlap = Math.max(0, Math.min(rBox.y2, nBox.y2) - Math.max(rBox.y, nBox.y));
        var overlappingArea = xOverlap * yOverlap;
        if (partially) {
            return overlappingArea >= 0;
        }
        var area = width * height;
        return overlappingArea >= area;
    });
};
var getConnectedEdges = function (nodes, edges) {
    var nodeIds = nodes.map(function (n) { return n.id; });
    return edges.filter(function (e) {
        var sourceId = e.source.split('__')[0];
        var targetId = e.target.split('__')[0];
        return nodeIds.includes(sourceId) || nodeIds.includes(targetId);
    });
};
var fitView = function (_a) {
    var padding = (_a === void 0 ? { padding: 0 } : _a).padding;
    var _b = store.getState(), nodes = _b.nodes, width = _b.width, height = _b.height, d3Selection = _b.d3Selection, d3Zoom = _b.d3Zoom;
    if (!d3Selection || !d3Zoom) {
        return;
    }
    var bounds = getRectOfNodes(nodes);
    var maxBoundsSize = Math.max(bounds.width, bounds.height);
    var k = Math.min(width, height) / (maxBoundsSize + maxBoundsSize * padding);
    var boundsCenterX = bounds.x + bounds.width / 2;
    var boundsCenterY = bounds.y + bounds.height / 2;
    var transform = [width / 2 - boundsCenterX * k, height / 2 - boundsCenterY * k];
    var fittedTransform = identity$1.translate(transform[0], transform[1]).scale(k);
    d3Selection.call(d3Zoom.transform, fittedTransform);
};
var zoom$1 = function (amount) {
    var _a = store.getState(), d3Zoom = _a.d3Zoom, d3Selection = _a.d3Selection, transform = _a.transform;
    if (d3Zoom && d3Selection) {
        d3Zoom.scaleTo(d3Selection, transform[2] + amount);
    }
};
var zoomIn = function () { return zoom$1(0.2); };
var zoomOut = function () { return zoom$1(-0.2); };

function renderNode(node, props, transform, selectedElements) {
    var nodeType = node.type || 'default';
    var NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default);
    if (!props.nodeTypes[nodeType]) {
        console.warn("No node type found for type \"" + nodeType + "\". Using fallback type \"default\".");
    }
    var isSelected = selectedElements.some(function (_a) {
        var id = _a.id;
        return id === node.id;
    });
    return (React__default.createElement(NodeComponent, { key: node.id, id: node.id, type: nodeType, data: node.data, xPos: node.__rg.position.x, yPos: node.__rg.position.y, onClick: props.onElementClick, onNodeDragStop: props.onNodeDragStop, transform: transform, selected: isSelected, style: node.style }));
}
var NodeRenderer = React.memo(function (_a) {
    var _b = _a.onlyRenderVisibleNodes, onlyRenderVisibleNodes = _b === void 0 ? true : _b, props = __rest(_a, ["onlyRenderVisibleNodes"]);
    var _c = useStoreState$1(function (s) { return s; }), nodes = _c.nodes, transform = _c.transform, selectedElements = _c.selectedElements, width = _c.width, height = _c.height;
    var tx = transform[0], ty = transform[1], tScale = transform[2];
    var transformStyle = {
        transform: "translate(" + tx + "px," + ty + "px) scale(" + tScale + ")",
    };
    var renderNodes = onlyRenderVisibleNodes ? getNodesInside(nodes, { x: 0, y: 0, width: width, height: height }, transform, true) : nodes;
    return (React__default.createElement("div", { className: "react-flow__nodes", style: transformStyle }, renderNodes.map(function (node) { return renderNode(node, props, transform, selectedElements); })));
});
NodeRenderer.displayName = 'NodeRenderer';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

var ConnectionLine = (function (_a) {
    var connectionSourceId = _a.connectionSourceId, _b = _a.connectionLineStyle, connectionLineStyle = _b === void 0 ? {} : _b, connectionPositionX = _a.connectionPositionX, connectionPositionY = _a.connectionPositionY, connectionLineType = _a.connectionLineType, _c = _a.nodes, nodes = _c === void 0 ? [] : _c, className = _a.className, transform = _a.transform;
    var _d = React.useState(null), sourceNode = _d[0], setSourceNode = _d[1];
    var hasHandleId = connectionSourceId.includes('__');
    var sourceIdSplitted = connectionSourceId.split('__');
    var nodeId = sourceIdSplitted[0];
    var handleId = hasHandleId ? sourceIdSplitted[1] : null;
    React.useEffect(function () {
        var nextSourceNode = nodes.find(function (n) { return n.id === nodeId; }) || null;
        setSourceNode(nextSourceNode);
    }, []);
    if (!sourceNode) {
        return null;
    }
    var edgeClasses = classnames('react-flow__edge', 'connection', className);
    var sourceHandle = handleId
        ? sourceNode.__rg.handleBounds.source.find(function (d) { return d.id === handleId; })
        : sourceNode.__rg.handleBounds.source[0];
    var sourceHandleX = sourceHandle
        ? sourceHandle.x + sourceHandle.width / 2
        : sourceNode.__rg.width / 2;
    var sourceHandleY = sourceHandle
        ? sourceHandle.y + sourceHandle.height / 2
        : sourceNode.__rg.height;
    var sourceX = sourceNode.__rg.position.x + sourceHandleX;
    var sourceY = sourceNode.__rg.position.y + sourceHandleY;
    var targetX = (connectionPositionX - transform[0]) * (1 / transform[2]);
    var targetY = (connectionPositionY - transform[1]) * (1 / transform[2]);
    var dAttr = '';
    if (connectionLineType === 'bezier') {
        var yOffset = Math.abs(targetY - sourceY) / 2;
        var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
        dAttr = "M" + sourceX + "," + sourceY + " C" + sourceX + "," + centerY + " " + targetX + "," + centerY + " " + targetX + "," + targetY;
    }
    else {
        dAttr = "M" + sourceX + "," + sourceY + " " + targetX + "," + targetY;
    }
    return (React__default.createElement("g", { className: edgeClasses },
        React__default.createElement("path", __assign({ d: dAttr }, connectionLineStyle))));
});

var Position;
(function (Position) {
    Position["Left"] = "left";
    Position["Top"] = "top";
    Position["Right"] = "right";
    Position["Bottom"] = "bottom";
})(Position || (Position = {}));
var GridType;
(function (GridType) {
    GridType["Lines"] = "lines";
    GridType["Dots"] = "dots";
})(GridType || (GridType = {}));

function getHandlePosition(position, node, handle) {
    if (handle === void 0) { handle = null; }
    if (!handle) {
        switch (position) {
            case Position.Top:
                return {
                    x: node.__rg.width / 2,
                    y: 0,
                };
            case Position.Right:
                return {
                    x: node.__rg.width,
                    y: node.__rg.height / 2,
                };
            case Position.Bottom:
                return {
                    x: node.__rg.width / 2,
                    y: node.__rg.height,
                };
            case Position.Left:
                return {
                    x: 0,
                    y: node.__rg.height / 2,
                };
        }
    }
    switch (position) {
        case Position.Top:
            return {
                x: handle.x + handle.width / 2,
                y: handle.y,
            };
        case Position.Right:
            return {
                x: handle.x + handle.width,
                y: handle.y + handle.height / 2,
            };
        case Position.Bottom:
            return {
                x: handle.x + handle.width / 2,
                y: handle.y + handle.height,
            };
        case Position.Left:
            return {
                x: handle.x,
                y: handle.y + handle.height / 2,
            };
    }
}
function getHandle(bounds, handleId) {
    var handle = null;
    if (!bounds) {
        return null;
    }
    // there is no handleId when there are no multiple handles/ handles with ids
    // so we just pick the first one
    if (bounds.length === 1 || !handleId) {
        handle = bounds[0];
    }
    else if (handleId) {
        handle = bounds.find(function (d) { return d.id === handleId; });
    }
    return handle;
}
function getEdgePositions(sourceNode, sourceHandle, sourcePosition, targetNode, targetHandle, targetPosition) {
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
        targetY: targetY,
    };
}
function renderEdge(edge, props, nodes, selectedElements) {
    var _a = edge.source.split('__'), sourceId = _a[0], sourceHandleId = _a[1];
    var _b = edge.target.split('__'), targetId = _b[0], targetHandleId = _b[1];
    var sourceNode = nodes.find(function (n) { return n.id === sourceId; });
    var targetNode = nodes.find(function (n) { return n.id === targetId; });
    if (!sourceNode) {
        throw new Error("couldn't create edge for source id: " + sourceId);
    }
    if (!targetNode) {
        throw new Error("couldn't create edge for target id: " + targetId);
    }
    var edgeType = edge.type || 'default';
    var EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
    var sourceHandle = getHandle(sourceNode.__rg.handleBounds.source, sourceHandleId);
    var targetHandle = getHandle(targetNode.__rg.handleBounds.target, targetHandleId);
    var sourcePosition = sourceHandle ? sourceHandle.position : Position.Bottom;
    var targetPosition = targetHandle ? targetHandle.position : Position.Top;
    var _c = getEdgePositions(sourceNode, sourceHandle, sourcePosition, targetNode, targetHandle, targetPosition), sourceX = _c.sourceX, sourceY = _c.sourceY, targetX = _c.targetX, targetY = _c.targetY;
    var isSelected = selectedElements.some(function (elm) { return isEdge(elm) && elm.source === sourceId && elm.target === targetId; });
    return (React__default.createElement(EdgeComponent, { key: edge.id, id: edge.id, type: edge.type, onClick: props.onElementClick, selected: isSelected, animated: edge.animated, style: edge.style, source: sourceId, target: targetId, sourceHandleId: sourceHandleId, targetHandleId: targetHandleId, sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY, sourcePosition: sourcePosition, targetPosition: targetPosition }));
}
var EdgeRenderer = React.memo(function (props) {
    var _a = useStoreState$1(function (s) { return s; }), transform = _a.transform, edges = _a.edges, nodes = _a.nodes, connectionSourceId = _a.connectionSourceId, _b = _a.connectionPosition, x = _b.x, y = _b.y, selectedElements = _a.selectedElements;
    var width = props.width, height = props.height, connectionLineStyle = props.connectionLineStyle, connectionLineType = props.connectionLineType;
    if (!width) {
        return null;
    }
    var tx = transform[0], ty = transform[1], tScale = transform[2];
    var transformStyle = "translate(" + tx + "," + ty + ") scale(" + tScale + ")";
    return (React__default.createElement("svg", { width: width, height: height, className: "react-flow__edges" },
        React__default.createElement("g", { transform: transformStyle },
            edges.map(function (e) { return renderEdge(e, props, nodes, selectedElements); }),
            connectionSourceId && (React__default.createElement(ConnectionLine, { nodes: nodes, connectionSourceId: connectionSourceId, connectionPositionX: x, connectionPositionY: y, transform: transform, connectionLineStyle: connectionLineStyle, connectionLineType: connectionLineType })))));
});
EdgeRenderer.displayName = 'EdgeRenderer';

var initialRect = {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    draw: false,
};
function getMousePosition(evt) {
    var reactFlowNode = document.querySelector('.react-flow');
    if (!reactFlowNode) {
        return false;
    }
    var containerBounds = reactFlowNode.getBoundingClientRect();
    return {
        x: evt.clientX - containerBounds.left,
        y: evt.clientY - containerBounds.top,
    };
}
var UserSelection = React.memo(function () {
    var selectionPane = React.useRef(null);
    var _a = React.useState(initialRect), rect = _a[0], setRect = _a[1];
    var setSelection = useStoreActions$1(function (a) { return a.setSelection; });
    var updateSelection = useStoreActions$1(function (a) { return a.updateSelection; });
    var setNodesSelection = useStoreActions$1(function (a) { return a.setNodesSelection; });
    React.useEffect(function () {
        function onMouseDown(evt) {
            var mousePos = getMousePosition(evt);
            if (!mousePos) {
                return;
            }
            setRect(function (currentRect) { return (__assign(__assign({}, currentRect), { startX: mousePos.x, startY: mousePos.y, x: mousePos.x, y: mousePos.y, draw: true })); });
            setSelection(true);
        }
        function onMouseMove(evt) {
            setRect(function (currentRect) {
                if (!currentRect.draw) {
                    return currentRect;
                }
                var mousePos = getMousePosition(evt);
                if (!mousePos) {
                    return currentRect;
                }
                var negativeX = mousePos.x < currentRect.startX;
                var negativeY = mousePos.y < currentRect.startY;
                var nextRect = __assign(__assign({}, currentRect), { x: negativeX ? mousePos.x : currentRect.x, y: negativeY ? mousePos.y : currentRect.y, width: negativeX
                        ? currentRect.startX - mousePos.x
                        : mousePos.x - currentRect.startX, height: negativeY
                        ? currentRect.startY - mousePos.y
                        : mousePos.y - currentRect.startY });
                updateSelection(nextRect);
                return nextRect;
            });
        }
        function onMouseUp() {
            setRect(function (currentRect) {
                setNodesSelection({ isActive: true, selection: currentRect });
                setSelection(false);
                return __assign(__assign({}, currentRect), { draw: false });
            });
        }
        if (selectionPane.current) {
            selectionPane.current.addEventListener('mousedown', onMouseDown);
            selectionPane.current.addEventListener('mousemove', onMouseMove);
            selectionPane.current.addEventListener('mouseup', onMouseUp);
            return function () {
                if (!selectionPane.current) {
                    return;
                }
                selectionPane.current.removeEventListener('mousedown', onMouseDown);
                selectionPane.current.removeEventListener('mousemove', onMouseMove);
                selectionPane.current.removeEventListener('mouseup', onMouseUp);
            };
        }
        return;
    }, [selectionPane.current]);
    return (React__default.createElement("div", { className: "react-flow__selectionpane", ref: selectionPane }, rect.draw && (React__default.createElement("div", { className: "react-flow__selection", style: {
            width: rect.width,
            height: rect.height,
            transform: "translate(" + rect.x + "px, " + rect.y + "px)",
        } }))));
});

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

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
    var startPositions = {};
    return elements.filter(isNode).reduce(function (res, node) {
        var startPosition = {
            x: node.__rg.position.x || node.position.x,
            y: node.__rg.position.y || node.position.x,
        };
        res[node.id] = startPosition;
        return res;
    }, startPositions);
}
var NodesSelection = React.memo(function () {
    var _a = React.useState({ x: 0, y: 0 }), offset = _a[0], setOffset = _a[1];
    var _b = React.useState({}), startPositions = _b[0], setStartPositions = _b[1];
    var state = useStoreState$1(function (s) { return ({
        transform: s.transform,
        selectedNodesBbox: s.selectedNodesBbox,
        selectedElements: s.selectedElements,
        snapToGrid: s.snapToGrid,
        snapGrid: s.snapGrid
    }); });
    var updateNodePos = useStoreActions$1(function (a) { return a.updateNodePos; });
    var _c = state.transform, x = _c[0], y = _c[1], k = _c[2];
    var position = state.selectedNodesBbox;
    var grid = (state.snapToGrid ? state.snapGrid : [1, 1]);
    var onStart = function (evt) {
        var scaledClient = {
            x: evt.clientX * (1 / k),
            y: evt.clientY * (1 / k),
        };
        var offsetX = scaledClient.x - position.x - x;
        var offsetY = scaledClient.y - position.y - y;
        var nextStartPositions = getStartPositions(state.selectedElements);
        if (nextStartPositions) {
            setOffset({ x: offsetX, y: offsetY });
            setStartPositions(nextStartPositions);
        }
    };
    var onDrag = function (evt) {
        var scaledClient = {
            x: evt.clientX * (1 / k),
            y: evt.clientY * (1 / k),
        };
        state.selectedElements.filter(isNode).forEach(function (node) {
            var pos = {
                x: startPositions[node.id].x +
                    scaledClient.x -
                    position.x -
                    offset.x -
                    x,
                y: startPositions[node.id].y +
                    scaledClient.y -
                    position.y -
                    offset.y -
                    y,
            };
            updateNodePos({ id: node.id, pos: pos });
        });
    };
    return (React__default.createElement("div", { className: "react-flow__nodesselection", style: {
            transform: "translate(" + x + "px," + y + "px) scale(" + k + ")",
        } },
        React__default.createElement(reactDraggable, { scale: k, grid: grid, onStart: function (evt) { return onStart(evt); }, onDrag: function (evt) { return onDrag(evt); } },
            React__default.createElement("div", { className: "react-flow__nodesselection-rect", style: {
                    width: state.selectedNodesBbox.width,
                    height: state.selectedNodesBbox.height,
                    top: state.selectedNodesBbox.y,
                    left: state.selectedNodesBbox.x,
                } }))));
});

var baseStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
};
var createGridLines = function (width, height, xOffset, yOffset, gap) {
    var lineCountX = Math.ceil(width / gap) + 1;
    var lineCountY = Math.ceil(height / gap) + 1;
    var xValues = Array.from({ length: lineCountX }, function (_, i) { return "M" + (i * gap + xOffset) + " 0 V" + height; });
    var yValues = Array.from({ length: lineCountY }, function (_, i) { return "M0 " + (i * gap + yOffset) + " H" + width; });
    return __spreadArrays(xValues, yValues).join(' ');
};
var createGridDots = function (width, height, xOffset, yOffset, gap, size) {
    var lineCountX = Math.ceil(width / gap) + 1;
    var lineCountY = Math.ceil(height / gap) + 1;
    var values = Array.from({ length: lineCountX }, function (_, col) {
        var x = col * gap + xOffset;
        return Array.from({ length: lineCountY }, function (_, row) {
            var y = row * gap + yOffset;
            return "M" + x + " " + (y -
                size) + " l" + size + " " + size + " l" + -size + " " + size + " l" + -size + " " + -size + "z";
        }).join(' ');
    });
    return values.join(' ');
};
var Grid = React.memo(function (_a) {
    var _b = _a.gap, gap = _b === void 0 ? 24 : _b, _c = _a.color, color = _c === void 0 ? '#aaa' : _c, _d = _a.size, size = _d === void 0 ? 0.5 : _d, _e = _a.style, style = _e === void 0 ? {} : _e, _f = _a.className, className = _f === void 0 ? '' : _f, _g = _a.backgroundType, backgroundType = _g === void 0 ? GridType.Dots : _g;
    var _h = useStoreState$1(function (s) { return s; }), width = _h.width, height = _h.height, _j = _h.transform, x = _j[0], y = _j[1], scale = _j[2];
    var gridClasses = classnames('react-flow__grid', className);
    var scaledGap = gap * scale;
    var xOffset = x % scaledGap;
    var yOffset = y % scaledGap;
    var isLines = backgroundType === 'lines';
    var path = isLines
        ? createGridLines(width, height, xOffset, yOffset, scaledGap)
        : createGridDots(width, height, xOffset, yOffset, scaledGap, size);
    var fill = isLines ? 'none' : color;
    var stroke = isLines ? color : 'none';
    return (React__default.createElement("svg", { width: width, height: height, style: __assign(__assign({}, baseStyles), style), className: gridClasses },
        React__default.createElement("path", { fill: fill, stroke: stroke, strokeWidth: size, d: path })));
});
Grid.displayName = 'Grid';

var isInputDOMNode = function (e) {
    var target = e.target;
    return (e && target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.nodeName));
};
var getDimensions = function (node) { return ({
    width: node.offsetWidth,
    height: node.offsetHeight,
}); };

var useKeyPress = (function (keyCode) {
    var _a = React.useState(false), keyPressed = _a[0], setKeyPressed = _a[1];
    function downHandler(evt) {
        if (evt.keyCode === keyCode && !isInputDOMNode(evt)) {
            setKeyPressed(true);
        }
    }
    var upHandler = function (evt) {
        if (evt.keyCode === keyCode && !isInputDOMNode(evt)) {
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
});

var d3ZoomInstance = zoom()
    .scaleExtent([0.5, 2])
    .filter(function () { return !event.button; });
var useD3Zoom = (function (zoomPane, onMove, shiftPressed) {
    var state = useStoreState$1(function (s) { return ({
        transform: s.transform,
        d3Selection: s.d3Selection,
        d3Zoom: s.d3Zoom,
    }); });
    var initD3 = useStoreActions$1(function (actions) { return actions.initD3; });
    var updateTransform = useStoreActions$1(function (actions) { return actions.updateTransform; });
    React.useEffect(function () {
        if (zoomPane.current) {
            var selection = select(zoomPane.current).call(d3ZoomInstance);
            initD3({ zoom: d3ZoomInstance, selection: selection });
        }
    }, []);
    React.useEffect(function () {
        if (shiftPressed) {
            d3ZoomInstance.on('zoom', null);
        }
        else {
            d3ZoomInstance.on('zoom', function () {
                if (event.sourceEvent &&
                    event.sourceEvent.target !== zoomPane.current) {
                    return;
                }
                updateTransform(event.transform);
                onMove();
            });
            if (state.d3Selection && state.d3Zoom) {
                // we need to restore the graph transform otherwise d3 zoom transform and graph transform are not synced
                var graphTransform = identity$1
                    .translate(state.transform[0], state.transform[1])
                    .scale(state.transform[2]);
                state.d3Selection.call(state.d3Zoom.transform, graphTransform);
            }
        }
        return function () {
            d3ZoomInstance.on('zoom', null);
        };
    }, [shiftPressed]);
});

var useGlobalKeyHandler = (function (_a) {
    var deleteKeyCode = _a.deleteKeyCode, onElementsRemove = _a.onElementsRemove;
    var state = useStoreState$1(function (s) { return ({
        selectedElements: s.selectedElements,
        edges: s.edges,
    }); });
    var setNodesSelection = useStoreActions$1(function (a) { return a.setNodesSelection; });
    var deleteKeyPressed = useKeyPress(deleteKeyCode);
    React.useEffect(function () {
        if (deleteKeyPressed && state.selectedElements.length) {
            var elementsToRemove = state.selectedElements;
            // we also want to remove the edges if only one node is selected
            if (state.selectedElements.length === 1 &&
                !isEdge(state.selectedElements[0])) {
                var node = state.selectedElements[0];
                var connectedEdges = getConnectedEdges([node], state.edges);
                elementsToRemove = __spreadArrays(state.selectedElements, connectedEdges);
            }
            onElementsRemove(elementsToRemove);
            setNodesSelection({ isActive: false });
        }
    }, [deleteKeyPressed]);
});

var useElementUpdater = function (elements) {
    var state = useStoreState$1(function (s) { return ({
        nodes: s.nodes,
        edges: s.edges,
        transform: s.transform,
        snapToGrid: s.snapToGrid,
        snapGrid: s.snapGrid,
    }); });
    var setNodes = useStoreActions$1(function (a) { return a.setNodes; });
    var setEdges = useStoreActions$1(function (a) { return a.setEdges; });
    React.useEffect(function () {
        var nodes = elements.filter(isNode);
        var edges = elements
            .filter(isEdge)
            .map(function (e) {
            return parseElement(e, state.transform, state.snapToGrid, state.snapGrid);
        });
        var nextNodes = nodes.map(function (propNode) {
            var existingNode = state.nodes.find(function (n) { return n.id === propNode.id; });
            if (existingNode) {
                var data = !fastDeepEqual(existingNode.data, propNode.data)
                    ? __assign(__assign({}, existingNode.data), propNode.data) : existingNode.data;
                return __assign(__assign({}, existingNode), { data: data });
            }
            return parseElement(propNode, state.transform, state.snapToGrid, state.snapGrid);
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
};

var GraphView = React.memo(function (_a) {
    var nodeTypes = _a.nodeTypes, edgeTypes = _a.edgeTypes, onMove = _a.onMove, onLoad = _a.onLoad, onElementClick = _a.onElementClick, onNodeDragStop = _a.onNodeDragStop, connectionLineType = _a.connectionLineType, connectionLineStyle = _a.connectionLineStyle, selectionKeyCode = _a.selectionKeyCode, onElementsRemove = _a.onElementsRemove, deleteKeyCode = _a.deleteKeyCode, elements = _a.elements, showBackground = _a.showBackground, backgroundGap = _a.backgroundGap, backgroundColor = _a.backgroundColor, backgroundType = _a.backgroundType, onConnect = _a.onConnect, snapToGrid = _a.snapToGrid, snapGrid = _a.snapGrid, onlyRenderVisibleNodes = _a.onlyRenderVisibleNodes;
    var zoomPane = React.useRef(null);
    var rendererNode = React.useRef(null);
    var state = useStoreState$1(function (s) { return ({
        width: s.width,
        height: s.height,
        nodes: s.nodes,
        edges: s.edges,
        d3Initialised: s.d3Initialised,
        nodesSelectionActive: s.nodesSelectionActive,
    }); });
    var updateSize = useStoreActions$1(function (actions) { return actions.updateSize; });
    var setNodesSelection = useStoreActions$1(function (actions) { return actions.setNodesSelection; });
    var setOnConnect = useStoreActions$1(function (a) { return a.setOnConnect; });
    var setSnapGrid = useStoreActions$1(function (actions) { return actions.setSnapGrid; });
    var selectionKeyPressed = useKeyPress(selectionKeyCode);
    var onZoomPaneClick = function () { return setNodesSelection({ isActive: false }); };
    var updateDimensions = function () {
        if (!rendererNode.current) {
            return;
        }
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
                zoomOut: zoomOut,
            });
        }
    }, [state.d3Initialised]);
    React.useEffect(function () {
        setSnapGrid({ snapToGrid: snapToGrid, snapGrid: snapGrid });
    }, [snapToGrid]);
    useGlobalKeyHandler({ onElementsRemove: onElementsRemove, deleteKeyCode: deleteKeyCode });
    useElementUpdater(elements);
    return (React__default.createElement("div", { className: "react-flow__renderer", ref: rendererNode },
        showBackground && (React__default.createElement(Grid, { gap: backgroundGap, color: backgroundColor, backgroundType: backgroundType })),
        React__default.createElement(NodeRenderer, { nodeTypes: nodeTypes, onElementClick: onElementClick, onNodeDragStop: onNodeDragStop, onlyRenderVisibleNodes: onlyRenderVisibleNodes }),
        React__default.createElement(EdgeRenderer, { width: state.width, height: state.height, edgeTypes: edgeTypes, onElementClick: onElementClick, connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle }),
        selectionKeyPressed && React__default.createElement(UserSelection, null),
        state.nodesSelectionActive && React__default.createElement(NodesSelection, null),
        React__default.createElement("div", { className: "react-flow__zoompane", onClick: onZoomPaneClick, ref: zoomPane })));
});
GraphView.displayName = 'GraphView';

function onMouseDown(evt, nodeId, setSourceId, setPosition, onConnect, isTarget, isValidConnection) {
    var reactFlowNode = document.querySelector('.react-flow');
    if (!reactFlowNode) {
        return;
    }
    var containerBounds = reactFlowNode.getBoundingClientRect();
    var recentHoveredHandle;
    setPosition({
        x: evt.clientX - containerBounds.left,
        y: evt.clientY - containerBounds.top,
    });
    setSourceId(nodeId);
    function resetRecentHandle() {
        if (!recentHoveredHandle) {
            return;
        }
        recentHoveredHandle.classList.remove('valid');
        recentHoveredHandle.classList.remove('connecting');
    }
    // checks if element below mouse is a handle and returns connection in form of an object { source: 123, target: 312 }
    function checkElementBelowIsValid(evt) {
        var elementBelow = document.elementFromPoint(evt.clientX, evt.clientY);
        var result = {
            elementBelow: elementBelow,
            isValid: false,
            connection: { source: null, target: null },
            isHoveringHandle: false,
        };
        if (elementBelow &&
            (elementBelow.classList.contains('target') ||
                elementBelow.classList.contains('source'))) {
            var connection = { source: null, target: null };
            if (isTarget) {
                var sourceId = elementBelow.getAttribute('data-nodeid');
                connection = { source: sourceId, target: nodeId };
            }
            else {
                var targetId = elementBelow.getAttribute('data-nodeid');
                connection = { source: nodeId, target: targetId };
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
            x: evt.clientX - containerBounds.left,
            y: evt.clientY - containerBounds.top,
        });
        var _a = checkElementBelowIsValid(evt), connection = _a.connection, elementBelow = _a.elementBelow, isValid = _a.isValid, isHoveringHandle = _a.isHoveringHandle;
        if (!isHoveringHandle) {
            return resetRecentHandle();
        }
        var isOwnHandle = connection.source === connection.target;
        if (!isOwnHandle && elementBelow) {
            recentHoveredHandle = elementBelow;
            elementBelow.classList.add('connecting');
            elementBelow.classList.toggle('valid', isValid);
        }
    }
    function onMouseUp(evt) {
        var _a = checkElementBelowIsValid(evt), connection = _a.connection, isValid = _a.isValid;
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
var BaseHandle = React.memo(function (_a) {
    var type = _a.type, nodeId = _a.nodeId, onConnect = _a.onConnect, position = _a.position, setSourceId = _a.setSourceId, setPosition = _a.setPosition, className = _a.className, _b = _a.id, id = _b === void 0 ? false : _b, isValidConnection = _a.isValidConnection, rest = __rest(_a, ["type", "nodeId", "onConnect", "position", "setSourceId", "setPosition", "className", "id", "isValidConnection"]);
    var isTarget = type === 'target';
    var handleClasses = classnames('react-flow__handle', className, position, {
        source: !isTarget,
        target: isTarget,
    });
    var nodeIdWithHandleId = id ? nodeId + "__" + id : nodeId;
    return (React__default.createElement("div", __assign({ "data-nodeid": nodeIdWithHandleId, "data-handlepos": position, className: handleClasses, onMouseDown: function (evt) {
            return onMouseDown(evt, nodeIdWithHandleId, setSourceId, setPosition, onConnect, isTarget, isValidConnection);
        } }, rest)));
});
BaseHandle.displayName = 'BaseHandle';

var NodeIdContext = React.createContext(null);
var Provider = NodeIdContext.Provider;
var Consumer = NodeIdContext.Consumer;

var Handle = React.memo(function (_a) {
    var _b = _a.onConnect, onConnect = _b === void 0 ? function (_) { } : _b, _c = _a.type, type = _c === void 0 ? 'source' : _c, _d = _a.position, position = _d === void 0 ? Position.Top : _d, _e = _a.isValidConnection, isValidConnection = _e === void 0 ? function () { return true; } : _e, rest = __rest(_a, ["onConnect", "type", "position", "isValidConnection"]);
    var nodeId = React.useContext(NodeIdContext);
    var _f = useStoreActions$1(function (a) { return ({
        setPosition: a.setConnectionPosition,
        setSourceId: a.setConnectionSourceId,
    }); }), setPosition = _f.setPosition, setSourceId = _f.setSourceId;
    var onConnectAction = useStoreState$1(function (s) { return s.onConnect; });
    var onConnectExtended = function (params) {
        onConnectAction(params);
        onConnect(params);
    };
    return (React__default.createElement(BaseHandle, __assign({ nodeId: nodeId, setPosition: setPosition, setSourceId: setSourceId, onConnect: onConnectExtended, type: type, position: position, isValidConnection: isValidConnection }, rest)));
});
Handle.displayName = 'Handle';

var nodeStyles = {
    background: '#ff6060',
    padding: 10,
    borderRadius: 5,
    width: 150,
};
var DefaultNode = (function (_a) {
    var data = _a.data, style = _a.style;
    return (React__default.createElement("div", { style: __assign(__assign({}, nodeStyles), style) },
        React__default.createElement(Handle, { type: "target", position: Position.Top }),
        data.label,
        React__default.createElement(Handle, { type: "source", position: Position.Bottom })));
});

var nodeStyles$1 = {
    background: '#9999ff',
    padding: 10,
    borderRadius: 5,
    width: 150,
};
var InputNode = (function (_a) {
    var data = _a.data, style = _a.style;
    return (React__default.createElement("div", { style: __assign(__assign({}, nodeStyles$1), style) },
        data.label,
        React__default.createElement(Handle, { type: "source", position: Position.Bottom })));
});

var nodeStyles$2 = {
    background: '#55dd99',
    padding: 10,
    borderRadius: 5,
    width: 150,
};
var OutputNode = (function (_a) {
    var data = _a.data, style = _a.style;
    return (React__default.createElement("div", { style: __assign(__assign({}, nodeStyles$2), style) },
        React__default.createElement(Handle, { type: "target", position: Position.Top }),
        data.label));
});

var ContentRect_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
var ContentRect = function (target) {
    if ('getBBox' in target) {
        var box = target.getBBox();
        return Object.freeze({
            height: box.height,
            left: 0,
            top: 0,
            width: box.width,
        });
    }
    else { // if (target instanceof HTMLElement) { // also includes all other non-SVGGraphicsElements
        var styles = window.getComputedStyle(target);
        return Object.freeze({
            height: parseFloat(styles.height || '0'),
            left: parseFloat(styles.paddingLeft || '0'),
            top: parseFloat(styles.paddingTop || '0'),
            width: parseFloat(styles.width || '0'),
        });
    }
};
exports.ContentRect = ContentRect;

});

unwrapExports(ContentRect_1);
var ContentRect_2 = ContentRect_1.ContentRect;

var ResizeObservation_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var ResizeObservation = /** @class */ (function () {
    function ResizeObservation(target) {
        this.target = target;
        this.$$broadcastWidth = this.$$broadcastHeight = 0;
    }
    Object.defineProperty(ResizeObservation.prototype, "broadcastWidth", {
        get: function () {
            return this.$$broadcastWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizeObservation.prototype, "broadcastHeight", {
        get: function () {
            return this.$$broadcastHeight;
        },
        enumerable: true,
        configurable: true
    });
    ResizeObservation.prototype.isActive = function () {
        var cr = ContentRect_1.ContentRect(this.target);
        return !!cr
            && (cr.width !== this.broadcastWidth
                || cr.height !== this.broadcastHeight);
    };
    return ResizeObservation;
}());
exports.ResizeObservation = ResizeObservation;

});

unwrapExports(ResizeObservation_1);
var ResizeObservation_2 = ResizeObservation_1.ResizeObservation;

var ResizeObserverEntry_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var ResizeObserverEntry = /** @class */ (function () {
    function ResizeObserverEntry(target) {
        this.target = target;
        this.contentRect = ContentRect_1.ContentRect(target);
    }
    return ResizeObserverEntry;
}());
exports.ResizeObserverEntry = ResizeObserverEntry;

});

unwrapExports(ResizeObserverEntry_1);
var ResizeObserverEntry_2 = ResizeObserverEntry_1.ResizeObserverEntry;

var ResizeObserver_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


var resizeObservers = [];
var ResizeObserver = /** @class */ (function () {
    function ResizeObserver(callback) {
        /** @internal */
        this.$$observationTargets = [];
        /** @internal */
        this.$$activeTargets = [];
        /** @internal */
        this.$$skippedTargets = [];
        var message = callbackGuard(callback);
        if (message) {
            throw TypeError(message);
        }
        this.$$callback = callback;
        resizeObservers.push(this);
    }
    ResizeObserver.prototype.observe = function (target) {
        var message = targetGuard('observe', target);
        if (message) {
            throw TypeError(message);
        }
        var index = findTargetIndex(this.$$observationTargets, target);
        if (index > 0) {
            return;
        }
        this.$$observationTargets.push(new ResizeObservation_1.ResizeObservation(target));
        startLoop();
    };
    ResizeObserver.prototype.unobserve = function (target) {
        var message = targetGuard('unobserve', target);
        if (message) {
            throw TypeError(message);
        }
        var index = findTargetIndex(this.$$observationTargets, target);
        if (index < 0) {
            return;
        }
        this.$$observationTargets.splice(index, 1);
        checkStopLoop();
    };
    ResizeObserver.prototype.disconnect = function () {
        this.$$observationTargets = [];
        this.$$activeTargets = [];
    };
    return ResizeObserver;
}());
exports.ResizeObserver = ResizeObserver;
function callbackGuard(callback) {
    if (typeof (callback) === 'undefined') {
        return "Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.";
    }
    if (typeof (callback) !== 'function') {
        return "Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.";
    }
}
function targetGuard(functionName, target) {
    if (typeof (target) === 'undefined') {
        return "Failed to execute '" + functionName + "' on 'ResizeObserver': 1 argument required, but only 0 present.";
    }
    if (!(target instanceof window.Element)) {
        return "Failed to execute '" + functionName + "' on 'ResizeObserver': parameter 1 is not of type 'Element'.";
    }
}
function findTargetIndex(collection, target) {
    for (var index = 0; index < collection.length; index += 1) {
        if (collection[index].target === target) {
            return index;
        }
    }
    return -1;
}
var gatherActiveObservationsAtDepth = function (depth) {
    resizeObservers.forEach(function (ro) {
        ro.$$activeTargets = [];
        ro.$$skippedTargets = [];
        ro.$$observationTargets.forEach(function (ot) {
            if (ot.isActive()) {
                var targetDepth = calculateDepthForNode(ot.target);
                if (targetDepth > depth) {
                    ro.$$activeTargets.push(ot);
                }
                else {
                    ro.$$skippedTargets.push(ot);
                }
            }
        });
    });
};
var hasActiveObservations = function () {
    return resizeObservers.some(function (ro) { return !!ro.$$activeTargets.length; });
};
var hasSkippedObservations = function () {
    return resizeObservers.some(function (ro) { return !!ro.$$skippedTargets.length; });
};
var broadcastActiveObservations = function () {
    var shallowestTargetDepth = Infinity;
    resizeObservers.forEach(function (ro) {
        if (!ro.$$activeTargets.length) {
            return;
        }
        var entries = [];
        ro.$$activeTargets.forEach(function (obs) {
            var entry = new ResizeObserverEntry_1.ResizeObserverEntry(obs.target);
            entries.push(entry);
            obs.$$broadcastWidth = entry.contentRect.width;
            obs.$$broadcastHeight = entry.contentRect.height;
            var targetDepth = calculateDepthForNode(obs.target);
            if (targetDepth < shallowestTargetDepth) {
                shallowestTargetDepth = targetDepth;
            }
        });
        ro.$$callback(entries, ro);
        ro.$$activeTargets = [];
    });
    return shallowestTargetDepth;
};
var deliverResizeLoopErrorNotification = function () {
    var errorEvent = new window.ErrorEvent('ResizeLoopError', {
        message: 'ResizeObserver loop completed with undelivered notifications.',
    });
    window.dispatchEvent(errorEvent);
};
var calculateDepthForNode = function (target) {
    var depth = 0;
    while (target.parentNode) {
        target = target.parentNode;
        depth += 1;
    }
    return depth;
};
var notificationIteration = function () {
    var depth = 0;
    gatherActiveObservationsAtDepth(depth);
    while (hasActiveObservations()) {
        depth = broadcastActiveObservations();
        gatherActiveObservationsAtDepth(depth);
    }
    if (hasSkippedObservations()) {
        deliverResizeLoopErrorNotification();
    }
};
var animationFrameCancelToken;
var startLoop = function () {
    if (animationFrameCancelToken)
        return;
    runLoop();
};
var runLoop = function () {
    animationFrameCancelToken = window.requestAnimationFrame(function () {
        notificationIteration();
        runLoop();
    });
};
var checkStopLoop = function () {
    if (animationFrameCancelToken && !resizeObservers.some(function (ro) { return !!ro.$$observationTargets.length; })) {
        window.cancelAnimationFrame(animationFrameCancelToken);
        animationFrameCancelToken = undefined;
    }
};
var install = function () {
    return window.ResizeObserver = ResizeObserver;
};
exports.install = install;

});

unwrapExports(ResizeObserver_1);
var ResizeObserver_2 = ResizeObserver_1.ResizeObserver;
var ResizeObserver_3 = ResizeObserver_1.install;

var isHandle = function (evt) {
    var target = evt.target;
    return (target.className &&
        target.className.includes &&
        (target.className.includes('source') || target.className.includes('target')));
};
var getHandleBounds = function (selector, nodeElement, parentBounds, k) {
    var handles = nodeElement.querySelectorAll(selector);
    if (!handles || !handles.length) {
        return null;
    }
    var handlesArray = Array.from(handles);
    return handlesArray.map(function (handle) {
        var bounds = handle.getBoundingClientRect();
        var dimensions = getDimensions(handle);
        var nodeIdAttr = handle.getAttribute('data-nodeid');
        var handlePosition = handle.getAttribute('data-handlepos');
        var nodeIdSplitted = nodeIdAttr ? nodeIdAttr.split('__') : null;
        var handleId = null;
        if (nodeIdSplitted) {
            handleId = (nodeIdSplitted.length
                ? nodeIdSplitted[1]
                : nodeIdSplitted);
        }
        return __assign({ id: handleId, position: handlePosition, x: (bounds.left - parentBounds.left) * (1 / k), y: (bounds.top - parentBounds.top) * (1 / k) }, dimensions);
    });
};
var onStart = function (evt, onClick, id, type, data, setOffset, transform, position) {
    if (isInputDOMNode(evt) || isHandle(evt)) {
        return false;
    }
    var scaledClient = {
        x: evt.clientX * (1 / transform[2]),
        y: evt.clientY * (1 / transform[2]),
    };
    var offsetX = scaledClient.x - position.x - transform[0];
    var offsetY = scaledClient.y - position.y - transform[1];
    var node = { id: id, type: type, position: position, data: data };
    store.dispatch.setSelectedElements({ id: id, type: type });
    setOffset({ x: offsetX, y: offsetY });
    onClick(node);
};
var onDrag = function (evt, setDragging, id, offset, transform) {
    var scaledClient = {
        x: evt.clientX * (1 / transform[2]),
        y: evt.clientY * (1 / transform[2]),
    };
    setDragging(true);
    store.dispatch.updateNodePos({
        id: id,
        pos: {
            x: scaledClient.x - transform[0] - offset.x,
            y: scaledClient.y - transform[1] - offset.y,
        },
    });
};
var onStop = function (onNodeDragStop, isDragging, setDragging, id, type, position, data) {
    if (isDragging) {
        setDragging(false);
        onNodeDragStop({
            id: id,
            type: type,
            position: position,
            data: data,
        });
    }
};
var wrapNode = (function (NodeComponent) {
    var NodeWrapper = React.memo(function (_a) {
        var id = _a.id, type = _a.type, data = _a.data, transform = _a.transform, xPos = _a.xPos, yPos = _a.yPos, selected = _a.selected, onClick = _a.onClick, onNodeDragStop = _a.onNodeDragStop, style = _a.style;
        var nodeElement = React.useRef(null);
        var _b = React.useState({ x: 0, y: 0 }), offset = _b[0], setOffset = _b[1];
        var _c = React.useState(false), isDragging = _c[0], setDragging = _c[1];
        var position = { x: xPos, y: yPos };
        var nodeClasses = classnames('react-flow__node', { selected: selected });
        var nodeStyle = {
            zIndex: selected ? 10 : 3,
            transform: "translate(" + xPos + "px," + yPos + "px)",
        };
        var updateNode = function () {
            if (!nodeElement.current) {
                return;
            }
            var storeState = store.getState();
            var bounds = nodeElement.current.getBoundingClientRect();
            var dimensions = getDimensions(nodeElement.current);
            var handleBounds = {
                source: getHandleBounds('.source', nodeElement.current, bounds, storeState.transform[2]),
                target: getHandleBounds('.target', nodeElement.current, bounds, storeState.transform[2]),
            };
            store.dispatch.updateNodeData(__assign(__assign({ id: id }, dimensions), { handleBounds: handleBounds }));
        };
        React.useEffect(function () {
            if (nodeElement.current) {
                updateNode();
                var resizeObserver_1 = new ResizeObserver_2(function (entries) {
                    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        var _ = entries_1[_i];
                        updateNode();
                    }
                });
                resizeObserver_1.observe(nodeElement.current);
                return function () {
                    if (resizeObserver_1 && nodeElement.current) {
                        resizeObserver_1.unobserve(nodeElement.current);
                    }
                };
            }
            return;
        }, [nodeElement.current]);
        return (React__default.createElement(DraggableCore, { onStart: function (evt) {
                return onStart(evt, onClick, id, type, data, setOffset, transform, position);
            }, onDrag: function (evt) {
                return onDrag(evt, setDragging, id, offset, transform);
            }, onStop: function () {
                return onStop(onNodeDragStop, isDragging, setDragging, id, type, position, data);
            }, scale: transform[2] },
            React__default.createElement("div", { className: nodeClasses, ref: nodeElement, style: nodeStyle },
                React__default.createElement(Provider, { value: id },
                    React__default.createElement(NodeComponent, { id: id, data: data, type: type, style: style, selected: selected })))));
    });
    NodeWrapper.displayName = 'NodeWrapper';
    return NodeWrapper;
});

function createNodeTypes(nodeTypes) {
    var standardTypes = {
        input: wrapNode((nodeTypes.input || InputNode)),
        default: wrapNode((nodeTypes.default || DefaultNode)),
        output: wrapNode((nodeTypes.output || OutputNode)),
    };
    var wrappedTypes = {};
    var specialTypes = Object.keys(nodeTypes)
        .filter(function (k) { return !['input', 'default', 'output'].includes(k); })
        .reduce(function (res, key) {
        res[key] = wrapNode((nodeTypes[key] || DefaultNode));
        return res;
    }, wrappedTypes);
    return __assign(__assign({}, standardTypes), specialTypes);
}

var BezierEdge = React.memo(function (_a) {
    var sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, _b = _a.sourcePosition, sourcePosition = _b === void 0 ? Position.Bottom : _b, _c = _a.targetPosition, targetPosition = _c === void 0 ? Position.Top : _c, _d = _a.style, style = _d === void 0 ? {} : _d;
    var yOffset = Math.abs(targetY - sourceY) / 2;
    var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
    var dAttr = "M" + sourceX + "," + sourceY + " C" + sourceX + "," + centerY + " " + targetX + "," + centerY + " " + targetX + "," + targetY;
    var leftAndRight = [Position.Left, Position.Right];
    if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
        var xOffset = Math.abs(targetX - sourceX) / 2;
        var centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
        dAttr = "M" + sourceX + "," + sourceY + " C" + centerX + "," + sourceY + " " + centerX + "," + targetY + " " + targetX + "," + targetY;
    }
    else if (leftAndRight.includes(sourcePosition) || leftAndRight.includes(targetPosition)) {
        dAttr = "M" + sourceX + "," + sourceY + " C" + sourceX + "," + targetY + " " + sourceX + "," + targetY + " " + targetX + "," + targetY;
    }
    return React__default.createElement("path", __assign({}, style, { d: dAttr }));
});

var StraightEdge = React.memo(function (_a) {
    var sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, _b = _a.style, style = _b === void 0 ? {} : _b;
    return (React__default.createElement("path", __assign({}, style, { d: "M " + sourceX + "," + sourceY + "L " + targetX + "," + targetY })));
});

var StepEdge = React.memo(function (_a) {
    var sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, _b = _a.style, style = _b === void 0 ? {} : _b;
    var yOffset = Math.abs(targetY - sourceY) / 2;
    var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
    return (React__default.createElement("path", __assign({}, style, { d: "M " + sourceX + "," + sourceY + "L " + sourceX + "," + centerY + "L " + targetX + "," + centerY + "L " + targetX + "," + targetY })));
});

var wrapEdge = (function (EdgeComponent) {
    var EdgeWrapper = React.memo(function (_a) {
        var id = _a.id, source = _a.source, target = _a.target, type = _a.type, animated = _a.animated, selected = _a.selected, onClick = _a.onClick, rest = __rest(_a, ["id", "source", "target", "type", "animated", "selected", "onClick"]);
        var edgeClasses = classnames('react-flow__edge', { selected: selected, animated: animated });
        var onEdgeClick = function (evt) {
            if (isInputDOMNode(evt)) {
                return;
            }
            store.dispatch.setSelectedElements({ id: id, source: source, target: target });
            onClick({ id: id, source: source, target: target, type: type });
        };
        return (React__default.createElement("g", { className: edgeClasses, onClick: onEdgeClick },
            React__default.createElement(EdgeComponent, __assign({ id: id, source: source, target: target, type: type, animated: animated, selected: selected, onClick: onClick }, rest))));
    });
    EdgeWrapper.displayName = 'EdgeWrapper';
    return EdgeWrapper;
});

function createEdgeTypes(edgeTypes) {
    var standardTypes = {
        default: wrapEdge((edgeTypes.default || BezierEdge)),
        straight: wrapEdge((edgeTypes.bezier || StraightEdge)),
    };
    var wrappedTypes = {};
    var specialTypes = Object.keys(edgeTypes)
        .filter(function (k) { return !['default', 'bezier'].includes(k); })
        .reduce(function (res, key) {
        res[key] = wrapEdge((edgeTypes[key] || BezierEdge));
        return res;
    }, wrappedTypes);
    return __assign(__assign({}, standardTypes), specialTypes);
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

var css = ".react-flow {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  overflow: hidden;\n}\n\n.react-flow__renderer {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n}\n\n.react-flow__zoompane {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1;\n}\n\n.react-flow__selectionpane {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n\n.react-flow__selection {\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: rgba(0, 89, 220, 0.08);\n  border: 1px dotted rgba(0, 89, 220, 0.8);\n}\n\n.react-flow__edges {\n  position: absolute;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n  z-index: 2;\n}\n\n.react-flow__edge {\n  fill: none;\n  stroke: #bbb;\n  stroke-width: 2;\n  pointer-events: all;\n}\n\n.react-flow__edge.selected {\n    stroke: #555;\n  }\n\n.react-flow__edge.animated {\n    stroke-dasharray: 5;\n    -webkit-animation: dashdraw 0.5s linear infinite;\n            animation: dashdraw 0.5s linear infinite;\n  }\n\n.react-flow__edge.connection {\n    stroke: '#ddd';\n    pointer-events: none;\n  }\n\n@-webkit-keyframes dashdraw {\n  from {stroke-dashoffset: 10}\n}\n\n@keyframes dashdraw {\n  from {stroke-dashoffset: 10}\n}\n\n.react-flow__nodes {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  z-index: 3;\n  pointer-events: none;\n  transform-origin: 0 0;\n}\n\n.react-flow__node {\n  position: absolute;\n  color: #222;\n  font-family: sans-serif;\n  font-size: 12px;\n  text-align: center;\n  cursor: -webkit-grab;\n  cursor: grab;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  pointer-events: all;\n  transform-origin: 0 0;\n}\n\n.react-flow__node:hover > * {\n    box-shadow: 0 1px 5px 2px rgba(0, 0, 0, 0.08);\n  }\n\n.react-flow__node.selected > * {\n    box-shadow: 0 0 0 2px #555;\n  }\n\n.react-flow__handle {\n  position: absolute;\n  width: 10px;\n  height: 8px;\n  background: rgba(255, 255, 255, 0.4);\n  cursor: crosshair;\n}\n\n.react-flow__handle.bottom {\n    top: auto;\n    left: 50%;\n    bottom: 0;\n    transform: translate(-50%, 0);\n  }\n\n.react-flow__handle.top {\n    left: 50%;\n    top: 0;\n    transform: translate(-50%, 0);\n  }\n\n.react-flow__handle.left {\n    top: 50%;\n    left: 0;\n    transform: translate(0, -50%);\n\n  }\n\n.react-flow__handle.right {\n    right: 0;\n    top: 50%;\n    transform: translate(0, -50%);\n  }\n\n.react-flow__nodesselection {\n  z-index: 3;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  transform-origin: left top;\n  pointer-events: none;\n}\n\n.react-flow__nodesselection-rect {\n    position: absolute;\n    background: rgba(0, 89, 220, 0.08);\n    border: 1px dotted rgba(0, 89, 220, 0.8);\n    pointer-events: all;\n  }\n\n.react-flow__controls {\n  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);\n}\n\n.react-flow__controls-button {\n    background: #fefefe;\n    border-bottom: 1px solid #eee;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: 16px;\n    height: 16px;\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    padding: 5px;\n  }\n\n.react-flow__controls-button svg {\n      width: 100%;\n    }\n\n.react-flow__controls-button:hover {\n      background: #f4f4f4;\n    }\n";
styleInject(css);

var ReactFlow = function (_a) {
    var style = _a.style, onElementClick = _a.onElementClick, elements = _a.elements, children = _a.children, nodeTypes = _a.nodeTypes, edgeTypes = _a.edgeTypes, onLoad = _a.onLoad, onMove = _a.onMove, onElementsRemove = _a.onElementsRemove, onConnect = _a.onConnect, onNodeDragStop = _a.onNodeDragStop, connectionLineType = _a.connectionLineType, connectionLineStyle = _a.connectionLineStyle, deleteKeyCode = _a.deleteKeyCode, selectionKeyCode = _a.selectionKeyCode, showBackground = _a.showBackground, backgroundGap = _a.backgroundGap, backgroundType = _a.backgroundType, backgroundColor = _a.backgroundColor, snapToGrid = _a.snapToGrid, snapGrid = _a.snapGrid, onlyRenderVisibleNodes = _a.onlyRenderVisibleNodes;
    var nodeTypesParsed = React.useMemo(function () { return createNodeTypes(nodeTypes); }, []);
    var edgeTypesParsed = React.useMemo(function () { return createEdgeTypes(edgeTypes); }, []);
    return (React__default.createElement("div", { style: style, className: "react-flow" },
        React__default.createElement(StoreProvider, { store: store },
            React__default.createElement(GraphView, { onLoad: onLoad, onMove: onMove, onElementClick: onElementClick, onNodeDragStop: onNodeDragStop, nodeTypes: nodeTypesParsed, edgeTypes: edgeTypesParsed, connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle, selectionKeyCode: selectionKeyCode, onElementsRemove: onElementsRemove, deleteKeyCode: deleteKeyCode, elements: elements, onConnect: onConnect, backgroundColor: backgroundColor, backgroundGap: backgroundGap, showBackground: showBackground, backgroundType: backgroundType, snapToGrid: snapToGrid, snapGrid: snapGrid, onlyRenderVisibleNodes: onlyRenderVisibleNodes }),
            children)));
};
ReactFlow.displayName = 'ReactFlow';
ReactFlow.defaultProps = {
    onElementClick: function () { },
    onElementsRemove: function () { },
    onNodeDragStop: function () { },
    onConnect: function () { },
    onLoad: function () { },
    onMove: function () { },
    nodeTypes: {
        input: InputNode,
        default: DefaultNode,
        output: OutputNode,
    },
    edgeTypes: {
        default: BezierEdge,
        straight: StraightEdge,
        step: StepEdge,
    },
    connectionLineType: 'bezier',
    connectionLineStyle: {},
    deleteKeyCode: 8,
    selectionKeyCode: 16,
    backgroundColor: '#eee',
    backgroundGap: 24,
    showBackground: true,
    backgroundType: GridType.Dots,
    snapToGrid: false,
    snapGrid: [16, 16],
    onlyRenderVisibleNodes: true
};

var baseStyle = {
    position: 'absolute',
    zIndex: 5,
    bottom: 10,
    right: 10,
    width: 200,
    height: 150,
};
var MiniMapNode = function (_a) {
    var node = _a.node, color = _a.color, borderRadius = _a.borderRadius;
    var _b = node.__rg, _c = _b.position, x = _c.x, y = _c.y, width = _b.width, height = _b.height;
    var _d = node.style || {}, background = _d.background, backgroundColor = _d.backgroundColor;
    var fill = (background || backgroundColor || color);
    return (React__default.createElement("rect", { className: "react-flow__minimap-node", x: x, y: y, rx: borderRadius, ry: borderRadius, width: width, height: height, fill: fill }));
};
var index = (function (_a) {
    var _b = _a.style, style = _b === void 0 ? { backgroundColor: '#f8f8f8' } : _b, className = _a.className, _c = _a.nodeColor, nodeColor = _c === void 0 ? '#ddd' : _c, _d = _a.nodeBorderRadius, nodeBorderRadius = _d === void 0 ? 5 : _d, _e = _a.maskColor, maskColor = _e === void 0 ? 'rgba(10, 10, 10, .25)' : _e;
    var state = useStoreState$1(function (_a) {
        var width = _a.width, height = _a.height, nodes = _a.nodes, _b = _a.transform, tX = _b[0], tY = _b[1], tScale = _b[2];
        return ({
            width: width,
            height: height,
            nodes: nodes,
            tX: tX,
            tY: tY,
            tScale: tScale,
        });
    });
    var mapClasses = classnames('react-flow__minimap', className);
    var elementWidth = (style.width || baseStyle.width);
    var elementHeight = (style.height || baseStyle.height);
    var nodeColorFunc = (nodeColor instanceof Function ? nodeColor : function () { return nodeColor; });
    var hasNodes = state.nodes && state.nodes.length;
    var bb = getRectOfNodes(state.nodes);
    var viewBB = {
        x: -state.tX / state.tScale,
        y: -state.tY / state.tScale,
        width: state.width / state.tScale,
        height: state.height / state.tScale,
    };
    var boundingRect = hasNodes ? getBoundsofRects(bb, viewBB) : viewBB;
    var scaledWidth = boundingRect.width / elementWidth;
    var scaledHeight = boundingRect.height / elementHeight;
    var viewScale = Math.max(scaledWidth, scaledHeight);
    var viewWidth = viewScale * elementWidth;
    var viewHeight = viewScale * elementHeight;
    var offset = 5 * viewScale;
    var x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
    var y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
    var width = viewWidth + offset * 2;
    var height = viewHeight + offset * 2;
    return (React__default.createElement("svg", { width: elementWidth, height: elementHeight, viewBox: x + " " + y + " " + width + " " + height, style: __assign(__assign({}, baseStyle), style), className: mapClasses },
        state.nodes.map(function (node) { return (React__default.createElement(MiniMapNode, { key: node.id, node: node, color: nodeColorFunc(node), borderRadius: nodeBorderRadius })); }),
        React__default.createElement("path", { className: "react-flow__minimap-mask", d: "M" + (x - offset) + "," + (y - offset) + "h" + (width + offset * 2) + "v" + (height + offset * 2) + "h" + (-width - offset * 2) + "z\n        M" + viewBB.x + "," + viewBB.y + "h" + viewBB.width + "v" + viewBB.height + "h" + -viewBB.width + "z", fill: maskColor, fillRule: "evenodd" })));
});

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

var _ref =
/*#__PURE__*/
React__default.createElement("path", {
  d: "M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z"
});

var SvgPlus = function SvgPlus(props) {
  return React__default.createElement("svg", _extends$1({
    viewBox: "0 0 512 512"
  }, props), _ref);
};

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

var _ref$1 =
/*#__PURE__*/
React__default.createElement("path", {
  d: "M96 235h320v42H96z"
});

var SvgMinus = function SvgMinus(props) {
  return React__default.createElement("svg", _extends$2({
    viewBox: "0 0 512 512"
  }, props), _ref$1);
};

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

var _ref$2 =
/*#__PURE__*/
React__default.createElement("path", {
  d: "M96 124.2c0-6.9 5.2-12.2 12.2-12.2H176V64h-66.8C75.7 64 48 90.7 48 124.2V192h48v-67.8zM403.6 64H336v48h67.2c6.9 0 12.8 5.2 12.8 12.2V192h48v-67.8c0-33.5-27-60.2-60.4-60.2zM416 386.8c0 6.9-5.2 12.2-12.2 12.2H336v49h67.8c33.5 0 60.2-27.7 60.2-61.2V320h-48v66.8zM108.2 399c-6.9 0-12.2-5.2-12.2-12.2V320H48v66.8c0 33.5 27.7 61.2 61.2 61.2H176v-49h-67.8z"
});

var SvgFitview = function SvgFitview(props) {
  return React__default.createElement("svg", _extends$3({
    viewBox: "0 0 512 512"
  }, props), _ref$2);
};

var baseStyle$1 = {
    position: 'absolute',
    zIndex: 5,
    bottom: 10,
    left: 10,
};
var index$1 = (function (_a) {
    var style = _a.style, className = _a.className;
    var mapClasses = classnames('react-flow__controls', className);
    return (React__default.createElement("div", { className: mapClasses, style: __assign(__assign({}, baseStyle$1), style) },
        React__default.createElement("div", { className: "react-flow__controls-button react-flow__controls-zoomin", onClick: zoomIn },
            React__default.createElement(SvgPlus, null)),
        React__default.createElement("div", { className: "react-flow__controls-button  react-flow__controls-zoomout", onClick: zoomOut },
            React__default.createElement(SvgMinus, null)),
        React__default.createElement("div", { className: "react-flow__controls-button  react-flow__controls-fitview", onClick: function () { return fitView(); } },
            React__default.createElement(SvgFitview, null))));
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
//# sourceMappingURL=ReactFlow.js.map
