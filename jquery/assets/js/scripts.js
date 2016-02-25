function init() {
  var outlet = document.querySelector('#outlet'),
    converter = new Showdown.converter({ extensions: ['prettify', 'headings'] })
  get('readme.md', function(md) {
    outlet.innerHTML = converter.makeHtml(md)
    prettyPrint();
    setTimeout(createMenu, 0)
  })
}

function get(u, cb) {
  var x = new XMLHttpRequest()
  x.open('GET', u, true)
  x.onload = function() {
    if (x.status >= 200 && x.status < 400) cb && cb(x.responseText)
  }
  x.send()
}

function createMenu() {
  var sidebar = document.querySelector('#sidebar'),
    list = Showdown.extensions.headings._list,
    h3, ul, li, a

  list.forEach(function(el, i) {
    if (el.level == '1') {
      if (ul) sidebar.appendChild(ul)
      ul = document.createElement('ul')
      a = document.createElement('a')
      h3 = document.createElement('h3')
      a.href = '#' + el.id
      a.textContent = el.text
      h3.appendChild(a)
      sidebar.appendChild(h3)
    } else {
      li = document.createElement('li')
      a = document.createElement('a')
      a.textContent = el.text
      a.href = '#' + el.id
      li.appendChild(a)
      ul.appendChild(li)
    }
  })
  sidebar.appendChild(ul)

  setTimeout(function() {
    document.querySelector('#preloader').classList.add('hide')
    if (location.hash) {
      var el = document.getElementById(location.hash.slice(1))
      if (el) {
        el.scrollIntoView();
        console.log("!")
      }
    }
  }, 0)
}

init();