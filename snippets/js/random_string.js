var randomString = function(length) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for(var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

console.log(randomString(32))

function generate(str) {
  return str.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0
    return (c == 'x' ? r : (r & 0x3 | 0x8 )).toString(16)
  })
}

console.log(generate('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'))

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('')
  var color = '#'
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

console.log(getRandomColor())

function genKey(length) {
  var key = ''
  while (length--) key += Math.ceil(Math.random() * 15).toString(16)
  return key
}

console.log(genKey(16))
