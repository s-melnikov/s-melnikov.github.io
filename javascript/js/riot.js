var RiotControl = {
  _stores: [],
  addStore: function(store) {
    this._stores.push(store);
  }
};

['on','one','off','trigger'].forEach(function(api){
  RiotControl[api] = function() {
    var args = [].slice.call(arguments);
    this._stores.forEach(function(el){
      el[api].apply(el, args);
    });
  };
});

function CartStore() {
  if (!(this instanceof CartStore)) return new CartStore()

  riot.observable(this)

  var self = this

  self.productsInCart = {}

  self.on('ve_add_to_cart', function(product) {
    var id = product.id
    if (id in self.productsInCart) {
      self.productsInCart[id].quantity += 1
    } else {
      self.productsInCart[id] = {"quantity": 1, "title": product.title, "price": product.price,
        "image": product.image, "id": id}
    }
    self.trigger('se_cart_changed', self.productsInCart)
  })

  self.on('ve_checkout', function() {
    // call backend service to checkout, if success, then
    console.log('you have purchased:', self.productsInCart)
    self.productsInCart = {}
    self.trigger('se_cart_changed', self.productsInCart)
  })
}

function ProductStore() {
  if (!(this instanceof ProductStore)) return new ProductStore()

  riot.observable(this)

  var self = this

  // Could pull this from a server API.
  self.products = [
    {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2, "image": "img/ipad-mini.png"},
    {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10, "image": "img/t-shirt.png"},
    {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5, "image": "img/sucker.png"}
  ]

  self.on('ve_add_to_cart', function(product) {
    self.products.some(function(p) {
      if (p.id === product.id) {
        p.inventory = p.inventory > 0 ? p.inventory - 1 : 0
        return true
      }
    })
    self.trigger('se_products_changed', self.products)
  })

  self.on('ve_product_list_init', function() {
    // here it can query server in real scenario
    self.trigger('se_products_changed', self.products)
  })
}