var settings = {
  proxy: 'http://query.yahooapis.com/v1/public/yql?q=',
  max_entries: 2000,
  per_page: 25
}
var scrollPositions = {}
document.body.addEventListener('click', function() {
  scrollPositions[location.hash] = document.body.scrollTop
})
window.addEventListener('hashchange', function() {
  setTimeout(function() {
    scrollTo(0, scrollPositions[location.hash] || 0)
  }, 50)
})
var api = {
  get: function(url, cb) {
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
    var channels = ls.get('channels') || [],
      index = 0
    function loop() {
      var channel = channels[index],
        query = encodeURIComponent('select * from xml where url="' + channel.src + '"'),
        passed = new Date() - new Date(channel.lastUpdate || 0)
      if (passed > 60 * 60 * 1000) {
        channel.lastUpdate = new Date()
        api.get(settings.proxy + query + '&format=json', function(response) {
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
                  var articles = ls.get('articles') || []
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
          else cb()
        })
      } else {
        index++
        ls.set('channels', channels)
        if (channels[index]) loop()
        else cb()
      }
    }
    if (channels[index]) loop()
    else cb()
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
riot.compile(function() {
  riot.mount('#app', 'app')
})