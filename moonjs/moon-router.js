/**
 * Moon Router v0.2.0
 */
(function(root, factory) {
  (typeof module === "undefined") ? (root.MoonRouter = factory()) : (module.exports = factory())
}(this, function() {
    let wildcardAlias = "*";
    let queryAlias = "?";
    let namedParameterAlias = ":";
    let componentAlias = "@";

    let setup = function (instance, mode) {
      let getPath;
      let navigate;
      let custom = false;
      if(mode === undefined || mode === "hash") {
        // Setup Path Getter
        getPath = function() {
          return window.location.hash.substring(1);
        }

        // Create navigation function
        navigate = function(route) {
          window.location.hash = '#' + route;
          run(instance, route);
        }

        // Add hash change listener
        window.addEventListener("hashchange", function() {
          run(instance, instance.getPath());
        });
      } else if(mode === "history") {
        // Setup Path Getter
        getPath = function() {
          return window.location.pathname;
        }

        // Create navigation function
        navigate = function(route) {
          history.pushState(null, null, route);
          run(instance, route);
        }

        // Create listener
        custom = true;
        window.addEventListener("popstate", function() {
          run(instance, instance.getPath());
        });
      }

      instance.getPath = getPath;
      instance.navigate = navigate;
      instance.custom = custom;
    }

    let registerComponents = function (instance, Moon) {
      // Router View component
      Moon.extend("router-view", {
        data: function() {
          return {
            component: undefined
          }
        },
        render: function(m) {
          let currentComponent = this.get("component");
          let children;

          if(currentComponent === undefined) {
            children = [];
          } else {
            children = [m(currentComponent, {attrs: {route: instance.route}}, {}, [])];
          }

          return m("span", {}, {}, children);
        },
        hooks: {
          init: function init() {
            instance.components.push(this);
          }
        }
      });

      // Router Link component
      Moon.extend("router-link", {
        props: ["to"],
        render: function(m) {
          let to = this.get("to");
          let attrs = {};
          let meta = {};

          let same = instance.current === to;

          if(instance.custom === true) {
            attrs.href = to;
            meta.events = {
              "click": [function(event) {
                event.preventDefault();
                if(same === false) {
                  instance.navigate(to);
                }
              }]
            };
          } else {
            attrs.href = '#' + to;
          }

          if(same === true) {
            attrs["class"] = instance.activeClass;
          }

          return m('a', {attrs: attrs}, meta, this.insert);
        },
        hooks: {
          init: function init$1() {
            instance.components.push(this);
          }
        }
      });
    }

    let map = function (routes) {
      let routesMap = {};

      for(let route in routes) {
        let currentMapState = routesMap;

        // Split up by parts
        let parts = route.substring(1).split("/");
        for(let i = 0; i < parts.length; i++) {
          let part = parts[i];

          // Found named parameter
          if(part[0] === namedParameterAlias) {
            let param = currentMapState[namedParameterAlias];
            if(param === undefined) {
              currentMapState[namedParameterAlias] = {
                name: part.substring(1)
              };
            } else {
              param.name = part.substring(1);
            }

            currentMapState = currentMapState[namedParameterAlias];
          } else {
            // Add part to map
            if(currentMapState[part] === undefined) {
                currentMapState[part] = {};
            }

            currentMapState = currentMapState[part];
          }
        }

        // Add component
        currentMapState["@"] = routes[route];
      }

      return routesMap;
    }

    let run = function (instance, path) {
      // Change current component and build
      let parts = path.slice(1).split("/");
      let currentMapState = instance.map;
      let context = {
        query: {},
        params: {}
      }

      for(let i = 0; i < parts.length; i++) {
        let part = parts[i];

        // Query Parameters
        if(part.indexOf(queryAlias) !== -1) {
          let splitQuery = part.split(queryAlias);
          part = splitQuery.shift();

          for(let j = 0; j < splitQuery.length; j++) {
            let keyVal = splitQuery[j].split('=');
            context.query[keyVal[0]] = keyVal[1];
          }
        }

        if(currentMapState[part] === undefined) {
          let namedParameter = currentMapState[namedParameterAlias];

          if(namedParameter !== undefined) {
            // Named Parameter
            context.params[namedParameter.name] = part;
            part = namedParameterAlias;
          } else if(currentMapState[wildcardAlias] !== undefined) {
            // Wildcard
            part = wildcardAlias;
          }
        }

        // Move through state
        currentMapState = currentMapState[part];

        // Path not in map
        if(currentMapState === undefined) {
          run(instance, instance.default);
          return false;
        }
      }

      // Handler not in map
      if(currentMapState[componentAlias] === undefined) {
        run(instance, instance.default);
        return false;
      }

      // Setup current information
      instance.current = path;

      // Setup Route Context
      instance.route = context;

      // Build Instance
      instance.instance.build();

      // Build components
      let component = currentMapState[componentAlias];
      let components = instance.components;
      for(let i$1 = 0; i$1 < components.length; i$1++) {
        components[i$1].set("component", component);
      }

      return true;
    }


    function MoonRouter(options) {
      // Instance
      this.instance = undefined;

      // Default route
      let defaultRoute = options["default"];
      if(defaultRoute === undefined) {
        this["default"] = "/";
      } else {
        this["default"] = defaultRoute;
      }

      // Route to component map
      let providedMap = options.map;
      if(providedMap === undefined) {
        this.map = {};
      } else {
        this.map = map(providedMap);
      }

      // Route context
      this.route = {};

      // Components
      this.components = [];

      // Active class
      let activeClass = options.activeClass;
      if(activeClass === undefined) {
        this.activeClass = "router-link-active";
      } else {
        this.activeClass = activeClass;
      }

      // Register components
      registerComponents(this, Moon);

      // Initialize route
      setup(this, options.mode);
    }

    // Install router to instance
    MoonRouter.prototype.init = function(instance) {
      this.instance = instance;
      this.navigate(this.getPath());
    }

    // Plugin init
    MoonRouter.init = function (_Moon) {
      Moon = _Moon;
    }

    return MoonRouter;
}));