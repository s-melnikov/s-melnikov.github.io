function inherit(p) {
  if (p == null) throw TypeError();
  if (Object.create) return Object.create(p);
  var t = typeof p;
  if (t !== "object" && t !== "function") throw TypeError();
  function f() {};
  f.prototype = p;
  return new f();
}

/**
 * Get random numbers
 */
var random = {
  get octet() {
    return Math.floor(Math.random() * 256);
  },
  get uint16() {
    return Math.floor(Math.random() * 65536);
  },
  get int16() {
    return Math.floor(Math.random() * 65536) - 32768;
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Define Object Property
 */
Object.defineProperty(Object.prototype,
  "extend",
  {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (o) {        
      var names = Object.getOwnPropertyNames(o);
      for (var i = 0; i < names.lengs; i++) {
        if (names[i] in this) continue;
        var desc = Object.getOwnPropertyDescriptor(o, names[i]);
        Object.defineProperty(this, names[i], desc);
      }
    }
  }
);

function classof(o) {
  return Object.prototype.toString.call(o).slice(8, -1);
}

/**
 * Реализация методов доступа к частному свойству с использованием замыканий
 */
function addPrivateProperty(o, name, predicate) {
  var value;

  // метод чтения просто возвращает значение
  o["get" + name] = function () {
    return value;
  }

  // метод записисохраняет значение или возбуждает исключениеб
  // если ф-ция проверки отвергает это значение
  o["set" + name] = function (v) {
    if (predicate && !predicate(v))
      throw Error("set" + name + ": недопустимое значение " + v);
    else
      value = v;
  }
}

/**
 * Проверка ф-ции на переданное и ожидаемое кол-во аргументов
 */
function checkFuncArgs(args) {
  var actual = args.length,
    expected = args.callee.length;
  if (actual !== expected)
    throw new Error("ожидается: " + expected + "; получено: " + actual);
}

Object.defineProperty(Array.prototype,
  "summary",
  {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function (o) {
      return this.reduce(function (x, y) {
        return x + y
      });
    }
  }
);

/**
 * Complex.js - комплексные числа
 */
function Complex(real, imaginary) {
  if (isNaN(real) || isNaN(imaginary))
    throw  new TypeError();
  this.r = real;
  this.i = imaginary;
}

Complex.prototype.add = function(that){
  return new Complex(this.r + that.r,  this.i + that.i);
};

Complex.prototype.mul = function(that){
  return new Complex(this.r * that.r - this.i * that.i, this.r * that.i - this.i * that.r);
};

Complex.prototype.mag = function(){
  return Math.sqrt(this.r * this.r + this.i * this.i);
};

Complex.prototype.neg = function(){
  return new Complex(-this.r, -this.i);
};

Complex.prototype.toString = function(){
  return "{" + this.r + "," + this.i + "}";
};

Complex.prototype.equals = function(that){
  return that != null && that.constructor === Complex && this.r === that.r && this.i === that.i;
};

Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);

Complex.parse = function(s){
  try {
    var m = Complex._format.exec(s);
    return new Complex(parseFloat(m[1]), parseFloat(m[2]));
  } catch (x) {
    throw new TypeError("Строка '" + s + "' не может быть преобразована в комплексное число.");
  }
};

Complex._format = /^\{([^,]+),([^}]+)\}$/;

Complex.prototype.conj = function(){
  return new Complex(this.r, -this.i);
};


/**
 *
 */
Number.prototype.times = function(f, context){
  var n = Number(this);
  for (var i = 0; i < n; i++) f.call(context, i);
};

String.prototype.trim = String.prototype.trim || function(){
  if (!this) return this;
  return this.replace(/^\s+|\s+$/,"");
};

Function.prototype.getName = function(){
  return this.name || this.toString().match(/function\s*([^(]*)\(/)[1];
};


/**
 *  Set.js: произвольное множество значений
 */
function Set(){
  this.values = {};
  this.n = 0;
  this.add.apply(this, arguments);
}

Set.prototype.add = function(){
  for (var i = 0; i < arguments.length; i++) {
    var val = arguments[i];
    var str = Set._v2s(val);
    if (!this.values.hasOwnProperty(str)){
      this.values[str] = val;
      this.n++;
    }
  }
  return this;
};

Set.prototype.remove = function(){
  for (var i = 0; i < arguments.length; i++) {
    var str = Set._v2s(arguments[i]);
    if (this.values.hasOwnProperty(str)) {
      delete this.values[str];
      this.n--;
    }
  }
  return this;
};

Set.prototype.contains = function(value) {
  return this.values.hasOwnProperty(Set._v2s(value));
};

Set.prototype.size = function(){ return this.n; };

Set.prototype.foreach = function(f, context){
  for (var s in this.values)
    if (this.values.hasOwnProperty(s))
      f.call(context, this.values[s]);
};

Set._v2s = function(val){
  switch (val) {
    case undefined: return 'u';
    case null: return 'n';
    case true: return 't';
    case false: return 'f';
    default: switch (typeof val) {
      case 'number': return '#' + val;
      case 'string': return '"' + val;
      default: return '@' + objectId(val);
    }
  }

  function objectId(o){
    var prop = "|**objectid**|";
    if (!o.hasOwnProperty(prop))
      o[prop] = Set._v2s.next++;
    return o[prop];
  }
};

Set._v2s.next = 100;

/**
 * Создает новый тип-перечисление
 */

function enumeration(namesToValues){

  var enumeration = function(){
    throw "Нельзя создать экземпляр класса Enumeration";
  };

  var proto = enumeration.prototype = {
    constructor: enumeration,
    toString: function(){ return this.name; },
    valueOf: function(){ return this.value; },
    toJSON: function(){ return this.name; }
  };

  enumeration.values = [];

  for (var name in namesToValues) {
    var e = inherit(proto);
    e.name = name;
    e.value = namesToValues[name];
    enumeration[name] = e;
    enumeration.values.push(e);
  };

  enumeration.foreach = function(f, c) {
    for (var i = 0; i < this.values.length; i++) f.call(c, this.values[i]);
  }

  return enumeration;
}

/**
 * Определение класса для представления игральной карты
 */

function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;
}

Card.Suit = enumeration({Clubs: 1, Diamonds: 2, Hearts: 3, Spades: 4});
Card.Rank = enumeration({Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, Nine: 9, Ten: 10, Jack: 11, Queen: 12, King: 13, Ace: 14});

Card.prototype.toString = function() {
  return this.rank.toString() + " " + this.suit.toString();
};

Card.prototype.compareTo = function(that) {
  if (this.rank < that.rank) return -1;
  if (this.rank < that.rank) return 1;
  return 0;
};

Card.orderByRank = function(a, b) { return a.compareTo(b); };

Card.orderBySuit = function(a, b) {
  if (a.suit < b.suit) return -1;
  if (a.suit > b.suit) return 1;
  if (a.rank < b.rank) return -1;
  if (a.rank > b.rank) return 1;
  return 0;
};

function Deck() {
  var cards = this.cards = [];
  Card.Suit.foreach(function(s){
    Card.Rank.foreach(function(r){
      cards.push(new Card(s, r));
    });
  });
}

Deck.prototype.shuffle = function(){
  var deck = this.cards, len = deck.length;
  for (var i = len-1; i > 0; i--) {
    var r = Math.floor(Math.random()*(i+1)), temp;
    temp = deck[i], deck[i] = deck[r], deck[r] = temp;
  }
  return this;
};

Deck.prototype.deal = function(n){
  if (this.cards.length < n) throw "Карт для выдачи не хватает";
  return this.cards.splice(this.cards.length - n, n);
};

// пример
// создаем новую колоду карт, тасуем ее и раздаем как в игре бридж
/*
var deck = (new Deck()).shuffle();
var hand = deck.deal(13).sort(Card.orderBySuit);
*/

extend(Set.prototype, {
  toString: function() {
    var s = "{", i = 0;
    this.foreach(function(v){ s += ((i++ > 0) ? ", ": "") + v; });
    return s + "}";
  },
  toLocaleString: function(){
    var s = "{", i = 0;
    this.foreach(function(v){ 
      if (i++ > 0) s += "}";
      if (v == null) s += v;
      else s += v.toLocaleString();
    });
    return s + "}";
  },
  toArray: function(){
    var a = [];
    this.foreach(function(v){ a.push(v) });
    return a;
  }
});