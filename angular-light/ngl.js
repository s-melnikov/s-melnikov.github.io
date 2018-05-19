;(global => {
const Utils = {
  equals: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  clone: a => {
    try {
      return JSON.parse(JSON.stringify(a));
    } catch (e) {
      return undefined;
    }
  }
};
class Scope {
  constructor(parent, id) {
    this.$$watchers = [];
    this.$$children = [];
    this.$parent = parent;
    this.$id = id || 0;
  }
  $watch(exp, fn) {
    this.$$watchers.push({ exp, fn, last: Utils.clone(this.$eval(exp)) });
  }
  $eval(exp) {
    let val;
    if (typeof exp === "function") {
      val = exp.call(this);
    } else {
      try {
        val = (new Function("self", "return self." + exp))(this);
      } catch (e) {
        val = undefined;
      }
    }
    return val;
  }
  $new() {
    Scope.counter++;
    let obj = new Scope(this, Scope.counter);
    Object.setPrototypeOf(obj, this);
    this.$$children.push(obj);
    return obj;
  }
  $destroy() {
    let pc = this.$parent.$$children;
    pc.splice(pc.indexOf(this), 1);
  }
  $digest() {
    let dirty, watcher, current, i;
    do {
      dirty = false;
      for (i = 0; i < this.$$watchers.length; i += 1) {
        watcher = this.$$watchers[i];
        current = this.$eval(watcher.exp);
        if (!Utils.equals(watcher.last, current)) {
          watcher.last = Utils.clone(current);
          dirty = true;
          watcher.fn(current);
        }
      }
    } while (dirty);
    for (i = 0; i < this.$$children.length; i += 1) {
      this.$$children[i].$digest();
    }
  }
}
Scope.counter = 0;
class Provider {
  constructor() {
    this.cache = {
      $rootScope: new Scope()
    }
    this.providers = {}
  }
  get(name, locals) {
    if (this.cache[name]) {
      return this.cache[name];
    }
    let provider = this.providers[name];
    if (!provider || typeof provider !== "function") {
      return null;
    }
    return (this.cache[name] = this.invoke(provider, locals));
  }
  directive(name, fn) {
    this.register(name + Provider.DIRECTIVES_SUFFIX, fn);
  }
  controller(name, fn) {
    this.register(name + Provider.CONTROLLERS_SUFFIX, () => fn);
  }
  service(name, fn) {
    this.register(name, fn);
  }
  annotate(fn) {
    let res = fn.toString()
        .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, "")
        .match(/\((.*?)\)/);
    if (res && res[1]) {
      return res[1].split(",").map(d => d.trim());
    }
    return [];
  }
  invoke(fn, locals) {
    locals = locals || {};
    let deps = this.annotate(fn).map(s => locals[s] || this.get(s, locals), this);
    return fn.apply(null, deps);
  }
  register(name, service) {
    this.providers[name] = service;
  }
};
Provider.DIRECTIVES_SUFFIX = "Directive";
Provider.CONTROLLERS_SUFFIX = "Controller";
const provider = new Provider();

class DOMCompiler {
  bootstrap() {
    let root = document.querySelector("[ngl-app]");
    if (root) {
      this.compile(root, provider.get("$rootScope"));
    }
  }
  compile(el, scope) {
    let dirs = this.getElDirectives(el);
    let dir;
    let scopeCreated;
    console.log(el, dirs)
    dirs.forEach(d => {
      dir = provider.get(d.name + Provider.DIRECTIVES_SUFFIX);
      if (dir.scope && !scopeCreated) {
        scope = scope.$new();
        scopeCreated = true;
      }
      dir.link(el, scope, d.value);
    });
    let children = Array.prototype.slice.call(el.children).map(c => c);
    children.forEach(c => this.compile(c, scope), this);
  }
  getElDirectives(el) {
    let attrs = el.attributes;
    let result = [];
    for (var i = 0; i < attrs.length; i += 1) {
      if (provider.get(attrs[i].name + Provider.DIRECTIVES_SUFFIX)) {
        result.push({
          name: attrs[i].name,
          value: attrs[i].value
        });
      }
    }
    return result;
  }
};
const domcompiler = new DOMCompiler();
provider.directive("ngl-bind", () => ({
    scope: false,
    link(el, scope, exp) {
      el.innerHTML = scope.$eval(exp);
      scope.$watch(exp, val => el.innerHTML = val);
    }
  })
);
provider.directive("ngl-click", () => ({
    scope: false,
    link(el, scope, exp) {
      el.onclick = event => {
        scope.$eval(exp);
        scope.$digest();
      };
    }
  })
);
provider.directive("ngl-model", () => ({
    link(el, scope, exp) {
      el.value = scope[exp];
      el.onkeyup = () => {
        scope[exp] = el.value;
        scope.$digest();
      };
      scope.$watch(exp, val => el.value = val);
    }
  })
);
provider.directive("ngl-controller", () => ({
    scope: true,
    link(el, scope, exp) {
      let ctrl = provider.get(exp + Provider.CONTROLLERS_SUFFIX);
      provider.invoke(ctrl, { $scope: scope });
    }
  })
);
provider.directive("ngl-repeat", () => ({
    scope: false,
    link(el, scope, exp) {
      let scopes = [];
      let parts = exp.split("in");
      let collectionName = parts[1].trim();
      let itemName = parts[0].trim();
      let parentNode = el.parentNode;
      let render = val => {
        let els = val;
        let currentNode;
        let s;
        while (parentNode.firstChild) {
          parentNode.removeChild(parentNode.firstChild);
        }
        scopes.forEach(s => s.$destroy());
        scopes = [];
        els.forEach(val => {
          currentNode = el.cloneNode(true);
          currentNode.removeAttribute("ngl-repeat");
          currentNode.removeAttribute("ngl-scope");
          s = scope.$new();
          scopes.push(s);
          s[itemName] = val;
          domcompiler.compile(currentNode, s);
          parentNode.appendChild(currentNode);
        });
      }
      scope.$watch(collectionName, render);
      render(scope.$eval(collectionName));
    }
  })
);
global.ngl = {
  controller: provider.controller.bind(provider),
  bootstrap: domcompiler.bootstrap.bind(domcompiler)
};
})(window)