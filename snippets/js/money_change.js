var result = {1: 0, 5: 0, 10: 0, 25: 0, 50: 0}

for (var i = 0; i < 100; i++) {
  var change = getChange(i)
  for (var coin in change) {
    result[coin] = Math.max(result[coin], change[coin])
  }
}

function getChange(money) {
  var coins = [1, 5, 10, 25, 50],
    result = {},
    coin = coins.pop()
  while (coin) {
    if (Math.floor(money / coin)) {
      result[coin] ? result[coin]++ : (result[coin] = 1)
      money -= coin
    } else {
      coin = coins.pop()
    }
  }
  return result
}