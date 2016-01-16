!function() {

  var 
    months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
    converter = new Showdown.converter({ extensions: ['prettify'] }),
    posts = null

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

  function markdown(text) {
    return converter.makeHtml(text)
  }

  function router(path, cb) {    
    if (cb) {
      function pop() {
        var match = location.hash.slice(1).match(new RegExp('^'+path+'$'))
        match && cb.apply(null, match.slice(1))
      }
      window.addEventListener('hashchange', pop, false)      
      document.addEventListener('DOMContentLoaded', pop, false)
    } else {
      location.hash = path
    }
  }

  function page(name) {
    each($$('.page'), function(el) { el.classList.remove('active') })
    $('#page-' + name).classList.add('active')
  }

  function getPost(id) {
    request('posts/'+id+'.md', function(response) {
      if (posts[id].type == 'public') {
        renderPost(response, posts[id])        
      }
    })
  }

  function renderPost(post, meta) {
    $('#page-post .outlet').innerHTML = '<div class="post">'+
      '<h2>'+meta.title+'</h2>'+
      '<div class="meta">'+
        '<div class="date">'+date(meta.date, 'M d Y')+'</div>'+
      '</div>'+
      '<div>'+markdown(post)+'</div>'+
    '</div>'
    page('post')
    prettyPrint()
  } 

  request('posts/posts.json', function(response) {
    posts = {}
    $('#page-index .outlet').innerHTML = JSON.parse(response).posts.map(function(post) {
      posts[post.id] = post
      if (post.type != 'public') return
      return '<div class="post">'+
        '<h3>'+
          '<a href="#/'+post.id+'">'+post.title+'</a>'+
        '</h3>'+
        '<div class="meta">'+
          '<div class="date">'+date(post.date, 'M d Y')+'</div>'+
        '</div>'+
      '</div>'
    }).join(' ') 
  })

  router('', function() {
    page('index')
  })

  router('/(.+)', function(id) {
    if (!posts) {
      request('posts/posts.json', function(response) {
        posts = {}
        each(JSON.parse(response).posts, function(el) {
          posts[el.id] = el
        })
        getPost(id)
      })
    } else {
      getPost(id)
    }    
  })
  
}()