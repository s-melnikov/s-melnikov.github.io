function Router() {

  var routes = [], current;

  this.add = function(re, handler) {
    if (!handler) {
      handler = re, re = '';
    }
    re = re.replace(/^\/|\/$/g, '')
    routes.push({re: re, handler: handler});
    return this;
  }

  this.run = function(hash) {
    var match;
    hash = (hash && !hash.type) ? hash : window.location.hash.slice(1);
    hash = hash.replace(/^\/|\/$/g, '');
    if (current == hash) return this;
    for (var i = 0; i < routes.length; i++) {
      match = hash.match(routes[i].re);
      if (match) {
        current = hash;
        match.shift();
        routes[i].handler.apply({}, match);
        return this;
      }           
    }
    return this;
  }

  window.addEventListener('hashchange', this.run.bind(this));
}

var router = new Router();

router
  .add('/blog', function() {
    console.log('blog main');
  })
  .add('(.*)', function(page) {

  })
  .run();