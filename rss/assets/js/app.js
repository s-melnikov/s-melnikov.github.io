var app = {

  settings: {
    proxy: 'http://query.yahooapis.com/v1/public/yql?q=',
    descLength: 120,
    onPage: 100
  },

  init: function() {
    console.log('app.init()')
    _.observable(this)

    this.articles = JSON.parse(localStorage.articles || '[]')
    this.sortArticles()
    this.channels = JSON.parse(localStorage.channels || '[]')

    _.route(app.studyRoute)

    this.getChannels()

    setInterval(this.getChannels, 60 * 1000)
  },

  studyRoute: function(hash) {
    var params = hash.slice(1).split('/')

    if (params[0] == 'article') {
      var article = app.articles.filter(function(item) {
        return btoa(item.link) == params[1]
      })[0]
      if (article) {
        return app.renderArticle(article)
      }
    }

    if (params[0] == 'channels') {
      return app.renderChannels(app.channels)
    }

    app.renderArticles(app.articles, params[1])
  },

  renderArticles: function(articles) {
    var container = _.$('.news-view ul')[0],
      tplStr = _.$('#articles-list-item-template')[0].innerHTML,
      html = ''

    container.innerHTML = ''
    articles.forEach(function(article, index) {
      container.innerHTML += _.render(tplStr, {
        link: btoa(article.link),
        article: article,
        index: index + 1,
        date: _.date(article.pubDate, 'd-m-Y'),
        description: article.description.replace(/<[\s\S]+?>/g, '')
          .slice(0, app.settings.descLength) + '...',
        comments: article.comments[0]
      })
    })
    if (true) {
      _.$('#hnview .nav')[0].style.display = ''
    } else {
      _.$('#hnview .nav')[0].style.display = 'none'
    }
    scrollTo(0, 0)
  },

  renderArticle: function(article) {
    var container = _.$('.news-view ul')[0],
      tplStr = _.$('#article-template')[0].innerHTML,
      html = ''
    container.innerHTML = _.render(tplStr, {
      article: article,
      date: _.date(article.pubDate, 'd-m-Y'),
      comments: article.comments[0]
    })
    app.fixElementsWidth()
    _.$('#hnview .nav')[0].style.display = 'none'
    article.seen = true
    localStorage.articles = JSON.stringify(app.articles)
    scrollTo(0, 0)
  },

  renderChannels: function(channels) {
    var container = _.$('.news-view ul')[0],
      tplStr = _.$('#channels-list-item-template')[0].innerHTML,
      html = ''

    container.innerHTML = ''
    channels.forEach(function(channel, index) {
      container.innerHTML += _.render(tplStr, {
        link: btoa(channel.link),
        channel: channel,
        index: index + 1
      })
    })
    _.$('#hnview .nav')[0].style.display = 'none'
  },

  sortArticles: function() {
    app.articles.sort(function(a, b) {
      if (!!a.seen > !!b.seen) return 1
      if (!!a.seen < !!b.seen) return -1
      var _a = new Date(a.pubDate),
        _b = new Date(b.pubDate)
      if (_a < _b) return 1
      if (_a > _b) return -1
      return 0
    })
  },

  fixElementsWidth: function() {

  }
}

app.init()