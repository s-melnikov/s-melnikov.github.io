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

   class MoonRouter {
     constructor(options) {
       this.instance = null
       this.default = "default" in options ? options.default : "/";
       this.map = options.map ? map(options.map) : {};
       console.log(this.map);
       this.route = {};
       this.components = [];
       this.activeClass = options.activeClass || "router-link-active";
       registerComponents(this, Moon);
       setup(this, options.mode);
     }
     init(instance) {
       this.instance = instance;
       this.navigate(this.getPath());
     }
   }

   function registerComponents(instance, Moon) {
     Moon.extend("RouterView", () => ({
       view: "Router View",
     }));
     Moon.extend("RouterLink", () => ({
       view: "Router Link"
     }));
     Moon.extend("__router-view", {
       data: function() {
         return {
           component: undefined,
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
     Moon.extend("__router-link", {
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

   function map(routes) {
     let routesMap = {};
     for (let route in routes) {
       let currentMapState = routesMap;
       let parts = route.substring(1).split("/");
       for (let i = 0; i < parts.length; i++) {
         let part = parts[i];
         if (part[0] === namedParameterAlias) {
           let param = currentMapState[namedParameterAlias];
           if (param === undefined) {
             currentMapState[namedParameterAlias] = {
               name: part.substring(1)
             };
           } else {
             param.name = part.substring(1);
           }
           currentMapState = currentMapState[namedParameterAlias];
         } else {
           if(currentMapState[part] === undefined) {
               currentMapState[part] = {};
           }
           currentMapState = currentMapState[part];
         }
       }
       currentMapState["@"] = routes[route];
     }
     return routesMap;
   }

   function setup(instance, mode) {
     let getPath;
     let navigate;
     let custom = false;
     if (mode === undefined || mode === "hash") {
       getPath = function() {
         return window.location.hash.substring(1);
       }
       navigate = function(route) {
         window.location.hash = '#' + route;
         run(instance, route);
       }
       window.addEventListener("hashchange", function() {
         run(instance, instance.getPath());
       });
     } else if (mode === "history") {
       getPath = function() {
         return window.location.pathname;
       }
       navigate = function(route) {
         history.pushState(null, null, route);
         run(instance, route);
       }
       custom = true;
       window.addEventListener("popstate", function() {
         run(instance, instance.getPath());
       });
     }
     instance.getPath = getPath;
     instance.navigate = navigate;
     instance.custom = custom;
   }

   function run(instance, path) {
     let parts = path.slice(1).split("/");
     let currentMapState = instance.map;
     let context = {
       query: {},
       params: {}
     }
     for (let i = 0; i < parts.length; i++) {
       let part = parts[i];
       if (part.indexOf(queryAlias) !== -1) {
         let splitQuery = part.split(queryAlias);
         part = splitQuery.shift();
         for (let j = 0; j < splitQuery.length; j++) {
           let keyVal = splitQuery[j].split('=');
           context.query[keyVal[0]] = keyVal[1];
         }
       }
       if (currentMapState[part] === undefined) {
         let namedParameter = currentMapState[namedParameterAlias];
         if (namedParameter !== undefined) {
           context.params[namedParameter.name] = part;
           part = namedParameterAlias;
         } else if (currentMapState[wildcardAlias] !== undefined) {
           part = wildcardAlias;
         }
       }
       currentMapState = currentMapState[part];
       if(currentMapState === undefined) {
         run(instance, instance.default);
         return false;
       }
     }

     if (currentMapState[componentAlias] === undefined) {
       run(instance, instance.default);
       return false;
     }
     instance.current = path;
     instance.route = context;
     return true;
     instance.instance.build();
     let component = currentMapState[componentAlias];
     let components = instance.components;
     for(let i$1 = 0; i$1 < components.length; i$1++) {
       components[i$1].component = component;
     }
     return true;
   }

   return MoonRouter;
 }));
