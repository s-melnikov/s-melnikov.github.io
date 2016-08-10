var log = !!~location.search.indexOf('debug') ?
  console.log.bind(console) : function log() {}

var settings = {
  proxy: 'http://query.yahooapis.com/v1/public/yql?q=',
  maxArticlesCounts: 1000,
  articlesPerPage: 50
}

var utils = {}

utils.ls = {
  name: 'rss',
  get: function() {
    return JSON.parse(localStorage[utils.ls.name] || '{}')
  },
  set: function(key, val) {
    var data = utils.ls.get()
    data[key] = val
    localStorage[utils.ls.name] = JSON.stringify(data)
  }
}

utils.promise = function(ex) {
  var cb = {
    resolve: function() {},
    reject: function(e) { console.error('promise reject:', e) }
  }, r = {}
  r.then = function (resolve, reject) {
    if (resolve) cb.resolve = resolve
    if (reject) cb.reject = reject
  }
  try {
    ex(function() { cb.resolve.apply(this, arguments) },
      function() { cb.reject.apply(this, arguments) })
  } catch (e) { cb.reject(e) }
  return r
}

utils.ajax = function(url, opts) {
  opts = opts || {}
  return utils.promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open(opts.method || 'GET', url, true)
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 400) {
        resolve({
          text: function() { return xhr.responseText },
          json: function() {
            try { return JSON.parse(xhr.responseText) } catch(e) { return null }
          },
          xml: function() { return xhr.responseXML }
        })
      } else reject({status: xhr.status})
    };
    xhr.onerror = reject
    xhr.send(opts.data || null)
  })
}

utils.dot = function(o, k) {
  if (k.split) k = k.split('.')
  for (var i = 0; i < k.length && o; i++) o = o[k[i]]
  return o
}

utils.date = function(date, format, shift) {
  var y, m, d, h, i, s
  date = new Date(date)
  if (shift) date.setTime(date.getTime() + shift)
  y = date.getFullYear().toString()
  m = (date.getMonth() + 1).toString()
  d = date.getDate().toString()
  h = date.getHours().toString()
  i = date.getMinutes().toString()
  s = date.getSeconds().toString()
  return format
    .replace("Y", y)
    .replace("y", "" + y[2] + y[3])
    .replace("m", m[1] ? m : "0" + m[0])
    .replace("d", d[1] ? d : "0" + d[0])
    .replace("h", h[1] ? h : "0" + h[0])
    .replace("i", i[1] ? i : "0" + i[0])
    .replace("s", s[1] ? s : "0" + s[0])
}

utils.getChannelsContent = function(callback, index) {
  index = index || 0
  utils.getChannelArticles(callback, index)
}

utils.getChannelArticles = function(callback, index) {
  log('Get channel:', index)
  var channels = utils.ls.get().channels || []
  var channel = channels[index]
  if (!channel) return callback()
  log('Get channel:', channel.src)
  log('Channel last update:', channel.lastUpdate)
  var query = encodeURIComponent('select * from xml where url="' + channel.src + '"'),
    mSecPassed = new Date().getTime() - new Date(channel.lastUpdate).getTime(),
    hoursPassed = mSecPassed / 1000 / 60 / 60
  log('Hours passed', hoursPassed)
  if (hoursPassed && hoursPassed < 1) {
    utils.getChannelsContent(callback, index + 1)
    return false
  }
  log('Channel nedd update')
  utils.ajax(settings.proxy + query + '&format=json').then(function(response) {
    var data = utils.dot(response.json(), 'query.results.rss.channel')
    if (data) {
      log('Last build date:', channel.lastBuildDate, ';', data.lastBuildDate)
      if (channel.lastBuildDate !== data.lastBuildDate) {
        channel.title = data.title
        channel.description = data.description
        channel.language = data.language
        channel.lastBuildDate = data.lastBuildDate
        channel.lastUpdate = new Date()
        channel.link = data.link && data.link[1] && (data.link[1].href || data.link[1])
        log('channel.title', channel.title)
        log('channel.description', channel.description)
        log('channel.language', channel.language)
        log('channel.lastBuildDate', channel.lastBuildDate)
        log('channel.lastUpdate', channel.lastUpdate)
        log('channel.updateFrequency', channel.updateFrequency)
        log('channel.updatePeriod', channel.updatePeriod)
        log('channel.link', channel.link)
        utils.ls.set('channels', channels)
        var articles = utils.ls.get().articles || []
        log('data.item', data.item)
        if (data.item) {
          data.item.forEach(function(item) {
            if (!articles.filter(function(article) {
                return article.link == item.link
              }).length) {
              log('Added new article: ', item.title)
              articles.push({
                uid: utils.uid(),
                channel: channel.link,
                link: item.link,
                pubDate: item.pubDate,
                creator: item.creator,
                description: item.description,
                title: item.title
              })
            }
          })
        }
        articles = utils.sortArticles(articles)
        if (articles.length > settings.maxArticlesCounts) {
          articles = articles.splice(articles.length - settings.maxArticlesCounts)
        }
        utils.ls.set('articles', articles)
      }
    } else {
      log('Channel has no data')
    }
    utils.getChannelsContent(callback, index + 1)
  }, function(e) {
    log('Error:', channel.src, e)
  })
}

utils.uid = function(prefix) {
  return (prefix || '') + Date.now().toString(16) + utils.genKey(12)
}

utils.genKey = function(length) {
  var key = ''
  while (length--) key += Math.ceil(Math.random() * 15).toString(16)
  return key
}

utils.sortArticles = function(articles) {
  return articles.sort(function(a, b) {
    if (a.seen && !b.seen) return 1
    if (!a.seen && b.seen) return -1
    var _a = new Date(a.pubDate),
      _b = new Date(b.pubDate)
    if (_a < _b) return 1
    if (_a > _b) return -1
    return 0
  })
}