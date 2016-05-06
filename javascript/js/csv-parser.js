function get(u, c) {
  var x = new XMLHttpRequest()
  x.open('GET', u, true)
  x.onload = function() {
    if (x.status >= 200 && x.status < 400) c(x.responseText)
  }
  x.send()
}

function parseCSV(csv) {
  var result = [];
  var cols = [];
  csv = csv.split("\r\n")
  cols = csv.shift().split(",")
  for (var i = 0; i < csv.length; i++) {
    var obj = {};
    csv[i] = csv[i].split(",")
    for (var l = 0; l < cols.length; l++) {
      obj[cols[l]] = csv[i][l]
    }
    result.push(obj)
  }
  return result;
}

get('MOCK_DATA.csv', function(resp) {
  var arr = parseCSV(resp)
  console.log(arr)
})