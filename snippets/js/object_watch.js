function observerWatch(obj, prop, fn) {
  var lastValue = this[prop]
  Object.defineProperty(obj, prop, {
    set: function(value) {
      fn(lastValue, value)
      lastValue = value
    },
    get: function() {
      return lastValue
    }
  })
}

Object.prototype.watch = function(name, fn) {
  return observerWatch(this, name, fn)
}

user = { name: "user1" }
user.pass = {
  pass: "password",
  salt: "secret"
}

user.watch('pass', (ldVal, newVal) => { console.log('Set', oldVal, newVal) })