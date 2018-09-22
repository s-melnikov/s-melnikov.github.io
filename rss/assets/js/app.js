var log = ~location.search.indexOf('debug') ? console.log.bind(console, '[RSS]') : function() {}
var settings = {
  proxy: 'http://query.yahooapis.com/v1/public/yql?q=',
  max_entries: 2000,
  per_page: 25
}
var scrollPositions = {}
var progressLine = document.querySelector('#progress-line');

document.body.addEventListener('click', function() {
  scrollPositions[location.hash] = document.body.scrollTop
})

window.addEventListener('hashchange', function() {
  setTimeout(function() {
    scrollTo(0, scrollPositions[location.hash] || 0)
  }, 50)
})

function progress(i) {
  progressLine.style.width = i * 100 + '%'
}

var api = {
  get: function(url, cb) {
    log('api:get(', url, ')')
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 400) {
        cb && cb(xhr.responseText)
      }
    }
    xhr.send()
  },
  checkUpdates: function(cb) {
    log('api:checkUpdates()')
    var channels = ls.get('channels') || [],
      index = 0,
      articles = ls.get('articles') || [],
      articlesLength = articles.length
    function loop() {
      var channel = channels[index],
        query = encodeURIComponent('select * from xml where url="' + channel.src + '"'),
        passed = new Date() - new Date(channel.lastUpdate || 0)
      log('api:checkUpdates() channel:', channel.src, 'passed:', Math.floor(passed / 1000 / 60), 'm')
      if (passed > 60 * 60 * 1000) {
        channel.lastUpdate = new Date()
        api.get(settings.proxy + query + '&format=json', function(response) {
          progress(index / (channels.length - 1))
          var data = null
          try {
            data = JSON.parse(response)
            data = data && data.query && data.query.results &&
              data.query.results.rss && data.query.results.rss.channel
            if (data) {
              if (channel.lastBuildDate !== data.lastBuildDate) {
                channel.title = data.title
                channel.description = data.description
                channel.lastBuildDate = data.lastBuildDate
                channel.link = data.link && data.link[1] && (data.link[1].href || data.link[1])
                if (data.item) {
                  var length = articles.length
                  data.item.forEach(function(item) {
                    if (!articles.filter(function(article) {
                        return article.link == item.link
                      }).length) {
                      articles.push({
                        uid: api.uid(),
                        channel: channel.link,
                        link: item.link,
                        pubDate: item.pubDate,
                        creator: item.creator,
                        description: item.description,
                        title: item.title
                      })
                    }
                  })
                  if (length !== articles.length) {
                    articles = api.sortArticles(articles)
                    if (articles.length > settings.max_entries) {
                      articles = articles.splice(articles.length - settings.max_entries)
                    }
                  }
                }
                ls.set('articles', articles)
              }
            }
          } catch(e) {
            console.error(e)
          }
          index++
          ls.set('channels', channels)
          if (channels[index]) loop()
          else {
            cb(articles.length - articlesLength)
            setTimeout(function() { progress(0) }, 1000)
          }
        })
      } else {
        index++
        ls.set('channels', channels)
        if (channels[index]) loop()
        else {
          cb(articles.length - articlesLength)
          setTimeout(function() { progress(0) }, 1000)
        }
      }
    }
    if (channels[index]) loop()
    else {
      cb(articles.length - articlesLength)
      setTimeout(function() { progress(0) }, 1000)
    }
  },
  sortArticles: function(articles) {
    return articles.sort(function(a, b) {
      if (a.seen && !b.seen) return 1
      if (!a.seen && b.seen) return -1
      var _a = new Date(a.pubDate),
        _b = new Date(b.pubDate)
      if (_a < _b) return 1
      if (_a > _b) return -1
      return 0
    })
  },
  uid: function() {
    var str = Date.now().toString(16), i = 12
    while (i--) str += Math.ceil(Math.random() * 15).toString(16)
    return str
  }
}
var ls = {
  get: function(key) {
    var data = JSON.parse(localStorage.rss || '{}')
    return key ? data[key] : data
  },
  set: function(key, val) {
    var data = ls.get()
    data[key] = val
    localStorage.rss = JSON.stringify(data)
  }
}

riot.dispatcher = riot.observable({})

riot.compile(function() {
  api.checkUpdates(function(newArticlesCount) {
    if (newArticlesCount) {
      riot.dispatcher.trigger('articles_update')
    }
  })
  riot.mount('#app', 'app')
})