if (location.href.slice === "") {
  
}
/*(function(global) {

  var emiter = mitt(),
    panel = dom('#panel')[0],
    user = {
      skill: null,
      endurance: null,
      money: null,
      fortune: null,
      items: [
        "Меч",
        "Фляга"
      ],
      spells: [],
      info: []
    },
    currentPage = dom('.page')[0]

  function dom(query, context) {
    return [].slice.call((context || document).querySelectorAll(query))
  }

  function parse(str) {
    return (new Function('return ' + str))()
  }

  dom('a[href^="#"]').map(function(link) {
    link.addEventListener('click', function(e) { e.preventDefault() })
  })

  dom('a[href^="#page_"]').map(function(link) {
    link.addEventListener('click', anchorClickHandler)
  })

  dom('a[emit]').map(function(link) {
    link.addEventListener('click', function() {
      var str = link.getAttribute('emit')
      emiter.emit(str)
    })
  })

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function d6() { return rand(1, 6) }

  function anchorClickHandler() {
    var href = this.getAttribute('href')
    currentPage.classList.remove('active')
    currentPage = dom(href)[0]
    currentPage.classList.add('active')
    emiter.emit(href)
    scrollTo(0, 0)
  }

  function mitt(handlers) {
    handlers = handlers || {}
    function list(type) {
      type = type.toLowerCase()
      return handlers[type] || (handlers[type] = [])
    }
    return {
      on: function(type, handler) {
        list(type).push(handler)
      },
      off: function(type, handler) {
        if (!handler) {
          type == '*' ? (handlers = {}) : (handlers[type] = [])
        } else {
          let e = list(type),
            i = e.indexOf(handler)
          if (~i) e.splice(i, 1)
        }
      },
      emit: function(type, event) {
        list('*').concat(list(type)).forEach(function(handler) { handler(event) })
      }
    }
  }

  function updatePanel() {
    for (var prop in user) {
      dom('.' + prop, panel)[0].innerHTML = user[prop] == null ? '' :
        (Array.isArray(user[prop]) ?
          user[prop].map(function(t) { return '<li>' + t + '</li>' }).join('') :
        user[prop])
    }
  }

  emiter.on('determine', function() {
    user.skill = d6() + 6
    user.endurance = d6() + d6() + 12
    user.fortune = d6() + 6
    updatePanel()
    dom('[emit="user.determine"]').map(el => el.classList.add('hidden'))
    dom('a[href*="#page_"]').map(el => el.classList.remove('hidden'))
  })

  emiter.on('#page_001', function() {
    panel.classList.add('show')
    updatePanel()
  })

})(window)*/