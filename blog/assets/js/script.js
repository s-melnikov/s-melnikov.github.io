!function() {

  var
    months = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'],
    converter = new Showdown.converter({ extensions: ['prettify'] }),
    templates = {},
    postMeta = []

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

  function date(date, format) {
    if (!date.getDate) date = new Date(date)
    var y = date.getFullYear().toString(),
      m = (date.getMonth() + 1).toString(),
      d = date.getDate().toString(),
      h = date.getHours().toString(),
      i = date.getMinutes().toString(),
      s = date.getSeconds().toString()
    return format
      .replace("Y", y)
      .replace("y", "" + y[2] + y[3])
      .replace("m", m[1] ? m : "0" + m[0])
      .replace("M", months[m])
      .replace("d", d[1] ? d : "0" + d[0])
      .replace("h", h[1] ? h : "0" + h[0])
      .replace("i", i[1] ? i : "0" + i[0])
      .replace("s", s[1] ? s : "0" + s[0])
  }

  function tpl(str, obj) {
    return str.replace(/{\s*([\s\S]+?)\s*}/g, function(match, key) {
      return obj[key] == null ? '' : obj[key]
    })
  }

  function markdown(text) {
    return converter.makeHtml(text)
  }

  function Router() {

    var routes = [], current;

    this.add = function(re, handler) {
      if (!handler) {
        handler = re, re = '';
      }
      re = re.replace(/^\/|\/$/g, '')
      routes.push({re: new RegExp('^'+re+'$'), handler: handler});
      return this;
    }

    this.run = function(hash) {
      var match;
      hash = (hash && !hash.type) ? hash : window.location.hash.slice(1);
      hash = hash.replace(/^\/|\/$/g, '');
      if (current == hash) return this;
      for (var i = 0; i < routes.length; i++) {
        match = hash.match(routes[i].re);
        if (match) {
          current = hash;
          match.shift();
          routes[i].handler.apply({}, match);
          return this;
        }
      }
      return this;
    }

    window.addEventListener('hashchange', this.run.bind(this));
  }

  function page(name) {
    each($$('.page'), function(el) { el.classList.remove('active') })
    $('#page-' + name).classList.add('active')
  }

  var router = new Router();

  each($$("script[type='text/template']"), function(el) {
    templates[el.getAttribute('name')] = el.innerHTML
  })

  request('posts/posts.json', function(response) {
    postMeta._postById = {}
    $('#page-index').innerHTML = JSON.parse(response).posts.map(function(post) {
      postMeta.push(post)
      postMeta._postById[post.id] = post
      if (post.type != 'public') return
      return tpl(templates['post-list-item'], {
        id: post.id,
        title: post.title,
        date: date(post.date, 'd M Y'),
        exerpt: post.exerpt
      })
    }).join(' ')

    setRoutes()
  })

  function setRoutes() {

    router
      .add('/', function() {
        page('index')
      })
      .add('/(.+)', function(id) {
        console.log(id)
        request('posts/'+id+'.md', function(response) {
          var meta = postMeta._postById[id]
          if (meta.type == 'public') {
            $('#page-post').innerHTML = tpl(templates['single-post'], {
              title: meta.title,
              date: date(meta.date, 'M d Y'),
              content: markdown(response)
            })
            page('post')
            prettyPrint()
          }
        })
      })
      .run();
  }
}()