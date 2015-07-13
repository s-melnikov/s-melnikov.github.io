var api = { cache: {} };

function ajax(url, cb) {
  var r = new XMLHttpRequest()
  r.open('GET', url, true)
  r.onload = function() {
    if (r.status >= 200 && r.status < 400)
      cb && cb(JSON.parse(r.responseText))
  }
  r.send()
}

api.portfolio = function(cb) {  
  if (api.cache.portfolio) cb && cb(api.cache.portfolio)
  else {
    ajax('storage/portfolio.json', function(r) {
      api.cache.portfolio = r.rows
      cb && cb(api.cache.portfolio)
    })
  }
}