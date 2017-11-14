// Создает новый тип-перечисление
function enumeration(namesToValues) {
  var enumeration = function() {
    throw 'Нельзя создать экземпляр класса Enumeration'
  };
  var proto = enumeration.prototype = {
    constructor: enumeration,
    toString: function() { return this.name },
    valueOf: function() { return this.value },
    toJSON: function() { return this.name }
  };
  enumeration.values = []
  for (var name in namesToValues) {
    var e = Object.create(proto)
    e.name = name
    e.value = namesToValues[name]
    enumeration[name] = e
    enumeration.values.push(e)
  };
  enumeration.foreach = function(f, c) {
    for (var i = 0; i < this.values.length; i++) f.call(c, this.values[i])
  }
  return enumeration
}

// Определение класса для представления игральной карты
function Card(suit, rank) {
  this.suit = suit
  this.rank = rank
}

// Задаем масти карт
Card.Suit = enumeration({
  Clubs: 1,
  Diamonds: 2,
  Hearts: 3,
  Spades: 4
})

// Задаем их ранг
Card.Rank = enumeration({
  Ace: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Jack: 11,
  Queen: 12,
  King: 13
})

// Строчное представление карты
Card.prototype.toString = function() {
  return this.rank.toString() + ' ' + this.suit.toString()
}

// Сравнение карт
Card.prototype.compareTo = function(that) {
  if (this.rank < that.rank) return -1
  if (this.rank > that.rank) return 1
  return 0
}

// Сортировка по рангу
Card.orderByRank = function(a, b) {
  return a.compareTo(b)
}

// Сортировка по масти
Card.orderBySuit = function(a, b) {
  if (a.suit < b.suit) return -1
  if (a.suit > b.suit) return 1
  if (a.rank < b.rank) return -1
  if (a.rank > b.rank) return 1
  return 0
}

// Создание колоды
function Deck() {
  var cards = this.cards = []
  Card.Suit.foreach(function(s) {
    Card.Rank.foreach(function(r) {
      cards.push(new Card(s, r))
    })
  })
}

// Перетасовка колоды
Deck.prototype.shuffle = function() {
  var deck = this.cards, len = deck.length
  for (var i = len-1; i > 0; i--) {
    var r = Math.floor(Math.random()*(i+1)), temp;
    temp = deck[i], deck[i] = deck[r], deck[r] = temp
  }
  return this
}

// Сдать n карт
Deck.prototype.deal = function(n) {
  if (this.cards.length < n) throw 'Карт для выдачи не хватает'
  return this.cards.splice(this.cards.length - n, n).sort(Card.orderBySuit).sort(Card.orderByRank)
}

// Вернуть карты в колоду
Deck.prototype.fold = function(cards) {
  for (var i = 0; i < cards.length; i++) {
    this.cards.push(cards[i])
  }
}

// Красивый вывод карт
var suitSymbols = ['♣', '♦', '♥', '♠']

function pretty(cards, info, won) {
  var str = ''
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].rank != 10) str += '&nbsp;'
    if (cards[i].suit.value == 2 || cards[i].suit.value == 3) {
      str += '&nbsp;&nbsp;<span style="color:#f00">'
    } else {
      str += '&nbsp;&nbsp;<span style="color:#000">'
    }
    if (cards[i].rank > 10 || cards[i].rank == 1) {
      str += cards[i].rank.name.substr(0, 1)
    } else {
      str += cards[i].rank.value
    }
    str += suitSymbols[cards[i].suit - 1] + '</span>'
  }
  print(str + ' ' + (info ? info : '') + ' ' + (won ? '$' + won : ''))
}

function print(str) {
  document.body.innerHTML += str + '<br>'
}

function play(money, bet, count) {
  var deck = new Deck()

  function raund() {
    var suits = [0, 0, 0, 0],
      matched = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      pairs = 0,
      threes = 0,
      fours = 0,
      flush = false,
      straight = false,
      won, info, hand

    deck.shuffle()

    hand = deck.deal(5)

    hand.forEach(function(card) {
      suits[card.suit.value - 1]++
      matched[card.rank.value - 1]++
    })

    for (var i = 0; i < 13; i++) {
      if (matched[i] == 2) {
        pairs++
      } else if (matched[i] == 3) {
        threes++
      } else if (matched[i] == 4) {
        fours++
      }
    }

    for (var i = 0; i < 4; i++) {
      if (suits[i] == 5) {
        flush = true
      }
    }

    if (flush && hand[4].rank - hand[1].rank == 3 && hand[4].rank - hand[0].rank == 12 ) {
      info = 'Royal flush!'
      won = bet * 2500
    } else if (flush && hand[4].rank - hand[0].rank == 4) {
      info = 'Straight flush!'
      won = bet * 250
    }

    if (!won) {
      if (fours) {
        info = 'Four of a kind!'
        won = bet * 100
      } else if (threes && pairs) {
        info = 'Full house!'
        won = bet * 50
      } else if (flush) {
        info = 'A flush!'
        won = bet * 20
      } else if (threes) {
        info = 'Three of a kind!'
        won = bet * 4
      } else if (pairs == 2) {
        info = 'Two pair!'
        won = bet * 3
      } else if (!pairs && hand[4].rank - hand[0].rank == 4) {
        info = 'A straight!'
        won = bet * 15
      } else if (matched[0] == 2 || matched[10] == 2 || matched[11] == 2 || matched[12] == 2) {
        info = 'Jacks or better!'
        won = bet * 2
      }
    }

    pretty(hand, info, won)
    money -= bet

    if (won) { money += won }
    deck.fold(hand)
  }

  print('Started money: $' + money)
  print('Bet: $' + bet)

  for (var i = 0; i < count; i++) {
    raund()
  }

  print('Ended money: $' + money)
}

play(100, 1, 100)
