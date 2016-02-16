function init() {
  var outlet = document.querySelector('#outlet'),
    converter = new Showdown.converter({ extensions: ['prettify'] })
  get('readme.md', function(md) {
    outlet.innerHTML = converter.makeHtml(md)
    prettyPrint()
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

init();