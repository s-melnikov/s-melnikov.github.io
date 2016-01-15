!function() {

  var 
    spliter = /^([\S\s]+?):([\S\s]+)/,
    pages = {}

  function $(query) {
    return document.querySelector(query)
  }

  function $$(query) {
    return document.querySelectorAll(query)
  }

  function each(list, cb) {    
    for (var i = 0, ln = list.length; i < ln; i++) cb(list[i], i)
  }
 
  function request(url, callback) {
    var xhttp = new XMLHttpRequest()
    xhttp.open('GET', url, true)
    if (callback) {
      xhttp.onload = function() { 
        if (xhttp.status >= 200 && xhttp.status < 400) {
          callback(xhttp.responseText) 
        }
      }
    }
    xhttp.send()
  }

  var template = (function() {  
    function get(obj, keys) {
      if (!Array.isArray(keys)) keys = keys.split('.');
      return obj[keys[0]] == null ? '' : (!keys[1] ? obj[keys[0]] : get(obj[keys[0]], keys.slice(1)));
    }
    return function(str, obj) {
      return str.replace(/{{(?:\s*)([\s\S]+?)(?:\s*)}}/g, function(match, keys) {
        return get(obj, keys);
      });  
    }
  })();

  function Router() {

    var routes = [], current;

    this.add = function(re, handler) {
      if (!handler) handler = re, re = ''
      re = re.replace(/^\/|\/$/g, '')
      routes.push({re: re, handler: handler})
      return this
    }

    this.run = function(hash) {
      var match
      hash = (hash && !hash.type) ? hash : window.location.hash.slice(1)
      hash = hash.replace(/^\/|\/$/g, '')
      if (current == hash) return this
      for (var i = 0; i < routes.length; i++) {
        match = hash.match(routes[i].re)
        if (match) {
          current = hash;
          match.shift()
          routes[i].handler.apply({}, match)
          return this
        }           
      }
      return this
    }

    window.addEventListener('hashchange', this.run.bind(this))
  }

  function parsePostList(text) {
    return text
      .split('---').map(function(el) {
        var obj = {}
        el = el.trim()
        if (el) {
          el.split('\r\n').forEach(function(el) {
            el = spliter.exec(el.trim())
            obj[el[1].trim()] = el[2].trim()
          })
          return obj
        }
      })
      .filter(function(el) { return !!el })
  }

  var router = new Router()

  router
    .add('/', function() {
      if (pages.list) {
        renderPageIndex()
      } else {        
        request('posts/_list.txt', function(response) {
          pages.list = parsePostList(response)
          renderPageIndex()
        })
      }
    })
    .add('/blog/(.*)', function(page) {
      console.log(page)
    })
    .run() 

  function renderPageIndex() {
    each($$('.page'), function(el) { el.classList.remove('active') })
    $('#page-index').classList.add('active')
    
  }
}()