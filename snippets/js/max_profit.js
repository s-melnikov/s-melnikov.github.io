const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Stock {
  constructor() {
    this.prices = [];
    this.profit = null;
  }
  addPrice(price) {
    this.prices.push(price);
  }
  getMaxProfit() {
    let min_price, max_profit, potential_profit;

    if (this.prices.length < 2) {
      throw Error('Получение прибыли требует как минимум двух цен в массиве');
    }
    min_price = this.prices[0]
    max_profit = this.prices[1] - this.prices[0]
    for (var i = 0, ln = this.prices.length; i < ln; i++) {
      if (!i) continue;
      potential_profit = this.prices[i] - min_price;
      max_profit = Math.max(max_profit, potential_profit);
      min_price = Math.min(min_price, this.prices[i]);
    }
    return max_profit;
  }
}

let stock = new Stock();

for (var i = 0, ln = 8 * 60; i < ln; i++) {
  stock.addPrice(random(50, 110));
}

console.log(stock.getMaxProfit());