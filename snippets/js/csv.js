function parseCSV(csv) {
  var result = [], cols = [], i = 0, l = 0, obj
  csv = csv.split("\r\n")
  cols = csv.shift().split(",")
  for (; i < csv.length; i++) {
    obj = {}
    csv[i] = csv[i].split(",")
    for (; l < cols.length; l++) {
      obj[cols[l]] = csv[i][l]
    }
    result.push(obj)
  }
  return result
}