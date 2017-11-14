var stock_prices_yesterday = [], profit

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function get_max_profit(stock_prices) {
  var min_price, max_profit, potential_profit

  if (stock_prices.length < 2)
    throw Error('Получение прибыли требует как минимум двух цен в массиве');

  min_price = stock_prices[0]
  max_profit = stock_prices[1] - stock_prices[0]

  for (var i = 0, ln = stock_prices.length; i < ln; i++) {
    if (!i) continue

    potential_profit = stock_prices[i] - min_price

    max_profit = Math.max(max_profit, potential_profit)

    min_price  = Math.min(min_price, stock_prices[i])
  }

  return max_profit
}

for (var i = 0, ln = 8 * 60; i < ln; i++) {
  stock_prices_yesterday[i] = random(50, 110)
}

profit = get_max_profit(stock_prices_yesterday)

console.log(profit)
