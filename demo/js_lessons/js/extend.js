function Class() {}

// Helper function to correctly set up the prototype chain for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
Class.extend = function(protoProps, staticProps) {
  var parent = this, child, prop;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent constructor.
  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function() { return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.  
  for (prop in parent) child[prop] = parent[prop];
  for (prop in staticProps) child[prop] = staticProps[prop];

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent` constructor function.
  var Surrogate = function() { this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  for (prop in protoProps) child.prototype[prop] = protoProps[prop];

  // Save parent prototype
  child.prototype.__super__ = parent.prototype;

  return child;
};

var Model = Class.extend({
  constructor: function() {
    console.log("Model:constructor()");
  }
});

var User = Model.extend({
  constructor: function() {
    this.__super__.constructor();
    console.log("User:constructor()");
  }
});

var SuperUser = User.extend({
  constructor: function() {
    this.__super__.constructor();
    console.log("SuperUser:constructor()");
  }
});

var supeUser = new SuperUser();