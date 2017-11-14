function parseUrl(url) {
  var result = {},
    anchor = document.createElement('a')
    anchor.href = url;
  ['protocol','hostname','port','pathname','search','hash','host'].map(function(el) {
    result[el] = anchor[el]
  })
  return result;
}