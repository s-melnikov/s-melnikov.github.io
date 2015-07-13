<application>
  
  <header index={ index }></header>

  <div class="pure-g container">
    <sidebar class="pure-u-1-4"></sidebar>
    <content class="pure-u-3-4"></content>
  </div>

  var convertor = new Showdown.converter()
  var self = this
  self.title = opts.title
  self.version = opts.version

  initialize() {
    request('data/menu.md', function(resp) {
      self.trigger('sidebar:menu', convertor.makeHtml(resp))
    })
    riot.route(router)
    riot.route.exec(router)
  }

  function request(path, suc, err) {
    var req = new XMLHttpRequest()
    req.open('GET', path, true)
    req.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) suc && suc(this.responseText)
        else err && err()
      }
    }
    req.send()
  } 

  function router(page, section) {
    var hash = '#' + page + (section ? '/' + section : '')
    page = page || 'index'
    if (page == self.page) return scrollToSection(section)
    request('data/' + page + '.md', function(text) {
      self.page = page
      self.section = section
      self.trigger('content:page', parsePageData(text))
      self.index = page == 'index'      
      self.update()
      scrollToSection(section);
      [].forEach.call(document.querySelectorAll('nav a'), function(a) {
        if (a.hash == hash) a.classList.add('active')
        else a.classList.remove('active')
      })
    }, function() {
      riot.route('404')
    })
  }

  function parsePageData(text) {
    var data = {}
    text = text.split('====')
    text[0].trim().split('\n').forEach(function(el) {
      el = el.split(':')
      data[el[0]] = el[1]
    })
    text[1] = text[1].replace(/<%\s?(.+?)\s?%>/g, function(a, b) {
      return self[b] == null ? '' : self[b]
    })
    data.html = convertor.makeHtml(text[1] || '')
    self.trigger('content', data)
  }

  function scrollToSection(id) {
    var el = document.getElementById(id)
    if (!el) scrollTo(0, 0)
    else el.scrollIntoView()
  }

  this.initialize()

</application>


<header>

  <div class="container" if={ opts.index }>
    <img src="assets/img/logo/riot240x.png" alt="riotjs" ><br>
    <h1>React подобная UI библиотека в 3.5KB</h1>
    <h2>Пользовательские теги &bull; Краткий синтаксис &bull; Виртуальный DOM &bull; Полный цикл &bull; IE8</h2>
    <h3>
      <a href="#download" class="label blue">v{ parent.version }</a> - 
      <a href="#release-notes">Поддрежка контекстного CSS...</a>
    </h3>
  </div>  
  <div class="navbar" hide={ opts.index }>
    <div class="container">
      <a href="#" class="logo"><img src="assets/img/logo/riot60x.png"></a>
    </div>
  </div>
  <div id="sticky" class="navbar sticky">
    <div class="container">
      <a href="#" class="logo"><img src="assets/img/logo/riot60x.png"></a>
      <a href="#" class="ontop" onclick={ scrollToTop }>наверх</a>
    </div>
  </div>

  var self = this, scrollTop;

  window.addEventListener('scroll', function() {
    if (pageYOffset < scrollTop && 
      pageYOffset > (self.root.offsetHeight + self.sticky.offsetHeight)) {
      self.sticky.classList.add('show')
    } else {
      self.sticky.classList.remove('show')
    }
    scrollTop = pageYOffset
  })

  scrollToTop() {
    scrollTo(0, 0)
  }

</header>


<sidebar>

  <a href="#" id="show_menu" class={ active: active } onclick={ toggle }><span></span></a>
  <nav class={ active: active } onclick={ close }></nav>

  var self = this
  self.active = false

  this.parent.on('sidebar:menu', function(d) {
    self.root.querySelector('nav').innerHTML = d
  })

  toggle() {
    this.active = !this.active
    this.parent.root.classList.toggle('active')
  }

  close() {
    this.active = false
    return true
  }

</sidebar>

<content>

  <div class="header">          
    <h1>{ title }</h2>
    <h2>{ subtitle }</h3>        
  </div>
  <main></main>

  var self = this

  this.parent.on('content', function(data) {
    var container = self.root.querySelector('main')
    self.title = data.title
    self.subtitle = data.subtitle
    container.innerHTML = data.html
    createAnchors(container)
    document.title = self.parent.title + ' | ' + data.title  
    Prism.highlightAll() 
  })

  function createAnchors(el) {
    [].forEach.call(el.querySelectorAll('h1, h2, h3, h4, h5'), function(h) {
      var a = document.createElement('a')
      a.className = 'anchor'
      a.innerHTML = h.innerHTML;
      a.href = '#' + self.parent.page + '/' + h.id
      h.innerText = ''
      h.appendChild(a)
    })
  }

</content>