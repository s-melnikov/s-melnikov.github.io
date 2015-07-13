var util = {

  el: function(q) {
    return document.querySelectorAll(q)
  },

  xr: function(method, url, data, json) {
    var req = new XMLHttpRequest(),
      promise = new riot.Promise()
    req.open(method, url, true)
    if (method == 'POST') {
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      req.send(data)
    }
    req.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
          promise.done(json ? JSON.parse(this.responseText) : this.responseText)
        } else promise.fail('Server error: ' + this.status)
      }
    }
    req.onerror = function() { promise.fail('Ajax error') }
    req.send()
    setTimeout(function() { promise.always(req.readyState + ' ' + req.status) }, 20000)
    return promise
  },

  get: function(url, json) {
    return util.xr('GET', url, null, json)
  },

  post: function(url, data, json) {
    return util.xr('POST', url, data, json)
  },

  json: function(url) {
    return util.get(url, true)
  },

  date: function(format, date) {    
    var _d = date && new Date(date) || new Date(),
    y = '' + _d.getFullYear(),
    m = '' + (_d.getMonth() + 1),
    d = '' + _d.getDate(),
    h = '' + _d.getHours(),
    i = '' + _d.getMinutes(),
    s = '' + _d.getSeconds()

    return format
      .replace('Y', y)
      .replace('y', '' + y[2] + y[3])
      .replace('M', util.monthes[m])
      .replace('m', m[1] ? m : '0' + m[0])
      .replace('d', d[1] ? d : '0' + d[0])
      .replace('h', h[1] ? h : '0' + h[0])
      .replace('i', i[1] ? i : '0' + i[0])
      .replace('s', s[1] ? s : '0' + s[0])
  },

  monthes: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],

  formateDate: function(str) {
    var date = new Date(str),
      d = date.getDate().toString()
    return date && (d[1] ? d : "0" + d) + " " + util.monthes[date.getMonth() + 1] + " " + date.getFullYear()
  }
}

riot.Promise = function Promise() {
  var self = riot.observable(this);
  ['done', 'fail', 'always'].map(function(name) {
    self[name] = function(arg) {
      return self[typeof arg == 'function' ? 'on' : 'trigger'](name, arg)
    }
  })
}

util.converter = new Showdown.converter().makeHtml
