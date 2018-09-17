var selected = [
  { price: 20 },
  { price: 45 },
  { price: 67 },
  { price: 1305 }
];

var reducers = {
  rubles: function(state, item) {
    return state.rubles += item.price;
  },
  dollars: function(state, item) {
    return state.dollars += item.price / 71.6024;
  },
  euros: function(state, item) {
    return state.euros += item.price / 79.0133;
  },
  yens: function(state, item) {
    return state.yens += item.price / 0.6341;
  },
  pounds: function(state, item) {
    return state.pounds += item.price / 101.7829;
  }
};

var combineReducers = function(reducers) {
  return function(state, item) {
    return Object.keys(reducers).reduce(function(nextState, key) {
      reducers[key](state, item);
      return state;
    }, {});
  }
};

var priceReducer = combineReducers(reducers);

var totalPrice = selected.reduce(priceReducer, {
  rubles: 0,
  pounds: 0,
  dollars: 0,
  euros: 0,
  yens: 0
});

console.log(totalPrice);
