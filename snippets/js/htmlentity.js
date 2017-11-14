function decodeHtmlEntity(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec)
  })
}

function encodeHtmlEntity(str) {
  var buf = []
  for (var i = str.length - 1; i >= 0; i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
  }
  return buf.join('')
}

var entity = '&#39640;&#32423;&#31243;&#24207;&#35774;&#35745;';
var str = '高级程序设计';
console.log(decodeHtmlEntity(entity) === str);
console.log(encodeHtmlEntity(str) === entity);
