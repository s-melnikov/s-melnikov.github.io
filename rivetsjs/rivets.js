
(function (global) {

  const Rivets = {
    options: [
      'prefix',
      'templateDelimiters',
      'rootInterface',
      'preloadData',
      'handler',
      'executeFunctions'
    ],
    extensions: [
      'binders',
      'formatters',
      'components',
      'adapters'
    ],
    // The public interface (this is the exported module object).
    public: {
      // Global binders.
      binders: {},
      // Global components.
      components: {},
      // Global formatters.
      formatters: {},
      // Global sightglass adapters.
      adapters: {},
      // Default attribute prefix.
      prefix: 'rv',
      // Default template delimiters.
      templateDelimiters: ['{', '}'],
      // Default sightglass root interface.
      rootInterface: '.',
      // Preload data by default.
      preloadData: true,
      // Execute functions in bindings. Defaultis false since rivets 0.9. Set to true to be backward compatible with rivets 0.8.
      executeFunctions: false,
      // Alias for index in rv-each binder
      iterationAlias: function (modelName) {
        return '%' + modelName + '%';
      },
      // Default event handler.
      handler: function (context, ev, binding) {
        return this.call(context, ev, binding.view.models);
      },
      // Merges an object literal into the corresponding global options.
      configure: function (options = {}) {
        var descriptor, key, option, value;
        for (option in options) {
          value = options[option];
          if (option === 'binders' || option === 'components' || option === 'formatters' || option === 'adapters') {
            for (key in value) {
              descriptor = value[key];
              Rivets[option][key] = descriptor;
            }
          } else {
            Rivets.public[option] = value;
          }
        }
      },
      // Binds some data to a template / element. Returns a Rivets.View instance.
      bind: function (el, models = {}, options = {}) {
        var view;
        view = new Rivets.View(el, models, options);
        view.bind();
        return view;
      },
      // Initializes a new instance of a component on the specified element and
      // returns a Rivets.View instance.
      init: function (component, el, data = {}) {
        var scope, template, view;
        if (el == null) {
          el = document.createElement('div');
        }
        component = Rivets.public.components[component];
        template = component.template.call(this, el);
        if (template instanceof HTMLElement) {
          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }
          el.appendChild(template);
        } else {
          el.innerHTML = template;
        }
        scope = component.initialize.call(this, el, data);
        view = new Rivets.View(el, scope);
        view.bind();
        return view;
      }
    }
  }

  var bindMethod, jQuery, unbindMethod;

  if (window['jQuery'] || window['$']) {
    jQuery = window['jQuery'] || window['$'];
    [bindMethod, unbindMethod] = 'on' in jQuery.prototype ? ['on', 'off'] : ['bind', 'unbind'];
    Rivets.Util = {
      bindEvent: function (el, event, handler) {
        return jQuery(el)[bindMethod](event, handler);
      },
      unbindEvent: function (el, event, handler) {
        return jQuery(el)[unbindMethod](event, handler);
      },
      getInputValue: function (el) {
        var $el;
        $el = jQuery(el);
        if ($el.attr('type') === 'checkbox') {
          return $el.is(':checked');
        } else {
          return $el.val();
        }
      }
    };
  } else {
    Rivets.Util = {
      bindEvent: (function () {
        if ('addEventListener' in window) {
          return function (el, event, handler) {
            return el.addEventListener(event, handler, false);
          };
        }
        return function (el, event, handler) {
          return el.attachEvent('on' + event, handler);
        };
      })(),
      unbindEvent: (function () {
        if ('removeEventListener' in window) {
          return function (el, event, handler) {
            return el.removeEventListener(event, handler, false);
          };
        }
        return function (el, event, handler) {
          return el.detachEvent('on' + event, handler);
        };
      })(),
      getInputValue: function (el) {
        var i, len, o, results;
        if (el.type === 'checkbox') {
          return el.checked;
        } else if (el.type === 'select-multiple') {
          results = [];
          for (i = 0, len = el.length; i < len; i++) {
            o = el[i];
            if (o.selected) {
              results.push(o.value);
            }
          }
          return results;
        } else {
          return el.value;
        }
      }
    };
  }

  global.rivets = Rivets;

}).call(this);
