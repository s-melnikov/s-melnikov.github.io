/* module-manager.min */
//p={f:{},m:{},r:function(a,b){p.f[a]=b},g:function(a){if(!p.m[a]){if(p.m[a]<1|!p.f[a])throw"p:"+a;p.m[a]=0;p.m[a]=p.f[a](p)}return p.m[a]}};

/* module-manager */
var p = {
  _fn: {},   // the functions
  _m: {},  // the modules’ exported values
  _lock: {}, // the locks

  // register module
  r: function(name, callback) {
    // add the function in the object
    p._fn[name] = callback;
  },

  // get module
  g: function(name) {
    // if we have a value for this module let’s return it.
    // Note that we should use `.hasOwnProperty` here
    // because this’ll fail if the module returns a falsy
    // value. This is not really important for this problem.
    if (p._m[name]) {
      return p._m[name];
    }

    // if it’s locked that’s because we’re already getting
    // it; so there’s a recursive requirement
    if (p._lock[name]) {
      throw "Recursive requirement: '" + name + "'";
    }

    // if we don’t have any function for this we can’t
    // execute it and get its value. See also the
    // remark about `.hasOwnProperty` above.
    if (!p._fn[name]) {
      throw "Unknown module '" + name + "'";
    }

    // we lock the module so we can detect circular
    // requirements.
    p._lock[name] = true;

    try {
      // execute the module's function and pass
      // ourselves to it so it can require other
      // modules with p.get.
      p._m[name] = p._fn[name](p);
    } finally {
      // ensure we *always* remove the lock.
      delete p._lock[name];
    }

    // return the result
    return p._m[name];
  },
};

// register a "main" module. A module consists of a name and a
// function that takes an object used to require other modules.
p.r("main", function(r) {
  // get the "num" module and store it in a `num` variable
  var num = r.g("num");

  // use it to print something
  console.log(num.add(20, 22));
});

// register a "num" module
p.r("num", function(r) {
  // a module can export bindings by returning an object
  return {
    add: function(a, b) { return a + b; },
  };
});

// call the "main" module
p.g("main");
