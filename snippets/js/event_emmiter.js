function mitt(handlers) {
  handlers = handlers || {}

  function list(type) {
    type = type.toLowerCase()
    return handlers[type] || (handlers[type] = [])
  }

  return {

    on(type, handler) {
      list(type).push(handler)
    },

    off(type, handler) {
      if (!handler) {
        type == '*' ? (handlers = {}) : (handlers[type] = [])
      } else {
        let e = list(type),
          i = e.indexOf(handler)
        if (~i) e.splice(i, 1)
      }
    },

    emit(type, event) {
      list('*').concat(list(type)).forEach(handler => { handler(event) })
    }
  }
}

(this.NanoEvents = function NanoEvents () {
  this.events = {}
}).prototype = {
  on: function(event, cb) {
    event = this.events[event] = this.events[event] || []
    event.push(cb)
    return function () {
      event.splice(event.indexOf(cb) >>> 0, 1)
    }
  },
  emit: function(event) {
    var list = this.events[event]
    if (!list || !list[0]) return
    var args = list.slice.call(arguments, 1)
    list.slice().map(function (i) {
      i.apply(this, args)
    })
  }
}