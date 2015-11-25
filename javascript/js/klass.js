Object.defineProperty(Object.prototype,
  "extend",
  {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function (props) {
      var Child, F, i;
      Child = function () {
        if (Child.uber && Child.uber.hasOwnProperty("initialize")) {
          Child.uber.initialize.apply(this, arguments);
        }
        if (Child.prototype.hasOwnProperty("initialize")) {
          Child.prototype.initialize.apply(this, arguments);
        }
      };
      F = function () {};
      F.prototype = this.prototype;
      Child.prototype = new F();
      Child.uber = this.prototype;
      Child.prototype.constructor = Child;
      for (i in props) {
        if (props.hasOwnProperty(i)) {
          Child.prototype[i] = props[i];
        }
      }
      return Child;
    }
  }  
);

var Man = Object.extend({

  initialize: function (what) {
    console.log(1, "Man’s constructor");
    this.name = what;
  },

  getName: function () {
    return this.name;
  }
});

var first = new Man("Adam");
first.getName();

var SuperMan = Man.extend({
  initialize: function (what) {
    console.log(2, "SuperMan’s constructor");
  },
  getName: function () {
    var name = SuperMan.uber.getName.call(this);
    return "I am " + name;
  }
});

var clark = new SuperMan("Clark Kent");
clark.getName();

console.log(3, clark instanceof Man);
console.log(4, clark instanceof SuperMan);