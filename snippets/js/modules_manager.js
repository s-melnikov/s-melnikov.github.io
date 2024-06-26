// (w=>{let f={},m=(d,n)=>n(...d.map(d=>(d=>f[d]&&(f[d].m||(f[d].m=m(f[d].d,f[d].f))))(d)));w.def=((d,n,c)=>c?f[d]={d:n,f:c}:m(d,n))})(this);

(root => {
  const modules = {};
  const get_mod = name => modules[name] && (modules[name].mod || (modules[name].mod = create(modules[name].deps, modules[name].func)));
  const create = (deps, func) => func(...(deps.map(d => get_mod(d))));
  root.define = (name, deps, func) => (func ? (modules[name] = {deps, func}) : create(name, deps));
})(window);

def('first', ['second', 'third'], function(second, third) {
  console.log('module - first, deps', {second, third});
  return {name: 'first'}
})

def('second', ['third'], function(third) {
  console.log('module - second, deps', {third});
  return {name: 'second'}
})

def('third', [], function() {
  console.log('module - third');
  return {name: 'third'}
})

def(['first'], function(first) {
  console.log('module - main, deps', {first});
})

// p={f:{},m:{},r:function(a,b){p.f[a]=b},g:function(a){if(!p.m[a]){if(p.m[a]<1|!p.f[a])throw"p:"+a;p.m[a]=0;p.m[a]=p.f[a](p)}return p.m[a]}};

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

/* * ** *** ** * ** *** ** * ** *** ** * ** *** ** * ** *** ** * ** *** ** * */

(() => {
  const injectable = {};
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const ARROW_ARG = /^([^(]+?)=>/;
  const FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
  const FN_ARG_SPLIT = /,/;
  const FN_ARG = /^\s*(\S+?)\s*$/;

  const ext_args = (fn) => {
    let str = Function.prototype.toString.call(fn).replace(STRIP_COMMENTS, '');
    let args = str.match(ARROW_ARG) || str.match(FN_ARGS);
    return args;
  }

  window.def = (name, fn) => {
    let inject = [];
    let args = ext_args(fn || name)[1];
    args.split(FN_ARG_SPLIT).forEach(arg => arg.replace(FN_ARG, (all, name) => inject.push(injectable[name])));

    if (!fn) {
      name.apply(null, inject);
    } else {
      injectable[name] = fn.apply(null, inject);
    }
  }
})();

def("first", () => {
  return {
    name: "First Module"
  }
})

def("second", (first) => {
  return {
    name: "Second Module",
    first
  }
})

def("third", (first, second) => {
  return {
    name: "Third Module",
    first,
    second
  }
})

def((second, third, first, test) => {
  console.log({ second, third, first, test })
})


/* * ** *** ** * ** *** ** * ** *** ** * ** *** ** * ** *** ** * ** *** ** * */
