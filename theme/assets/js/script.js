$(function() {

  var cache = {},
    router = new Router(),
    converter = new Showdown.converter(),
    $content = $('#content'),
    $loader = $('#loader');

  router
    .add('(.*)', function(page) {
      page = page || 'index';
      $('html, body').animate({ scrollTop: 0 }, 400);
      $loader.fadeIn(200, function() {
        $.get('pages/' + page + '.html', function(html) {
          $content.html(html);
          initPlugins();
          $loader.fadeOut(200); 
        });
      });
    })
    .run();

});

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
    hash = (hash && !hash.type) ? hash : window.location.hash.slice(2);
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

function initPlugins() {

  $("chart").each(function() {
    var self = $(this),
      canvas = $('<canvas/>'),
      value = +self.attr('value'),
      color = self.attr('color');
    canvas[0].width = canvas[0].height = self.attr('width');
    self.append(canvas);      
    new Chart(canvas[0].getContext("2d")).Doughnut([
      {
        value: value, 
        color: color
      },
      {
        value: 100 - value,
        color: '#f5f5f5'
      }
    ], {
      segmentStrokeColor: '#ffffff',
      percentageInnerCutout : 86
    });
  });  
}