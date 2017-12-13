var def = (function() {
  var injectable = {}
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
  var ARROW_ARG = /^([^(]+?)=>/
  var FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m
  var FN_ARG_SPLIT = /,/
  var FN_ARG = /^\s*(\S+?)\s*$/

  function ext_args(fn) {
    var str = Function.prototype.toString.call(fn).replace(STRIP_COMMENTS, ''),
      args = str.match(ARROW_ARG) || str.match(FN_ARGS)
    return args
  }

  return function def(name, fn) {
    var inject = [],
      args = ext_args(fn || name)[1]

    args.split(FN_ARG_SPLIT).forEach(function(arg) {
      arg.replace(FN_ARG, function(all, name) {
        console.log({ all, name })
        inject.push(injectable[name])
      })
    })

    if (!fn) {
      name.apply(null, inject)
    } else {
      injectable[name] = fn.apply(null, inject)
    }
  }

})()

def("first", function() {
  return {
    name: "First Module"
  }
})

def("second", function(first) {
  return {
    name: "Second Module",
    first
  }
})

def("third", function(first, second) {
  return {
    name: "Third Module",
    first,
    second
  }
})

def(function(second, third, first, test) {
  console.log({ second, third, first, test })
})