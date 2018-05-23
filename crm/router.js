;(function(global) {

const { Component, cloneElement, h } = preact;

let EMPTY1 = {};

function exec(url, route, opts) {
  var reg = /(?:\?([^#]*))?(#.*)?$/,
    c = url.match(reg),
    matches = {},
    ret;
  if (c && c[1]) {
    var p = c[1].split('&');
    for (var i=0; i<p.length; i++) {
      var r = p[i].split('=');
      matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='));
    }
  }
  url = segmentize(url.replace(reg, ''));
  route = segmentize(route || '');
  var max = Math.max(url.length, route.length);
  for (var i$1=0; i$1<max; i$1++) {
    if (route[i$1] && route[i$1].charAt(0)===':') {
      var param = route[i$1].replace(/(^\:|[+*?]+$)/g, ''),
        flags = (route[i$1].match(/[+*?]+$/) || EMPTY1)[0] || '',
        plus = ~flags.indexOf('+'),
        star = ~flags.indexOf('*'),
        val = url[i$1] || '';
      if (!val && !star && (flags.indexOf('?')<0 || plus)) {
        ret = false;
        break;
      }
      matches[param] = decodeURIComponent(val);
      if (plus || star) {
        matches[param] = url.slice(i$1).map(decodeURIComponent).join('/');
        break;
      }
    }
    else if (route[i$1]!==url[i$1]) {
      ret = false;
      break;
    }
  }
  if (opts.default!==true && ret===false) { return false; }
  return matches;
}

function pathRankSort(a, b) {
  return (
    (a.rank < b.rank) ? 1 :
    (a.rank > b.rank) ? -1 :
    (a.index - b.index)
  );
}

// filter out VNodes without attributes (which are unrankeable), and add `index`/`rank` properties to be used in sorting.
function prepareVNodeForRanking(vnode, index) {
  vnode.index = index;
  vnode.rank = rankChild(vnode);
  return vnode.attributes;
}

function segmentize(url) {
  return url.replace(/(^\/+|\/+$)/g, '').split('/');
}

function rankSegment(segment) {
  return segment.charAt(0)==':' ? (1 + '*+?'.indexOf(segment.charAt(segment.length-1))) || 4 : 5;
}

function rank(path) {
  return segmentize(path).map(rankSegment).join('');
}

function rankChild(vnode) {
  return vnode.attributes.default ? 0 : rank(vnode.attributes.path);
}

var ROUTERS = [];

var subscribers = [];

var EMPTY = {};

function isPreactElement(node) {
  return node.__preactattr_!=null || typeof Symbol!=='undefined' && node[Symbol.for('preactattr')]!=null;
}

function getCurrentUrl() {
  return location.hash.slice(2) || "/";
}

const canRoute = url => {
  for (let i = ROUTERS.length; i--;) {
    if (ROUTERS[i].canRoute(url)) {
      return true;
    }
  }
  return false;
}

const routeTo = url => {
  let didRoute = false;
  let i = 0;
  for (; i < ROUTERS.length; i++) {
    if (ROUTERS[i].routeTo(url) === true) {
      didRoute = true;
    }
  }
  for (i = subscribers.length; i--;) {
    subscribers[i](url);
  }
  return didRoute;
}

var eventListenersInitialized = false;

function initEventListeners() {
  if (eventListenersInitialized) return;
  addEventListener("hashchange", event => routeTo(getCurrentUrl()));
  routeTo(getCurrentUrl());
  eventListenersInitialized = true;
}

var Router = (function (Component$$1) {
  function Router(props) {
    Component$$1.call(this, props);

    this.state = {
      url: props.url || getCurrentUrl()
    };

    initEventListeners();
  }

  if ( Component$$1 ) Router.__proto__ = Component$$1;
  Router.prototype = Object.create( Component$$1 && Component$$1.prototype );
  Router.prototype.constructor = Router;

  Router.prototype.shouldComponentUpdate = function shouldComponentUpdate (props) {
    if (props.static!==true) { return true; }
    return props.url!==this.props.url || props.onChange!==this.props.onChange;
  };

  /** Check if the given URL can be matched against any children */
  Router.prototype.canRoute = function canRoute (url) {
    return this.getMatchingChildren(this.props.children, url, false).length > 0;
  };

  /** Re-render children with a new URL to match against. */
  Router.prototype.routeTo = function routeTo (url) {
    this._didRoute = false;
    this.setState({ url: url });

    // if we're in the middle of an update, don't synchronously re-route.
    if (this.updating) { return this.canRoute(url); }

    this.forceUpdate();
    return this._didRoute;
  };

  Router.prototype.componentWillMount = function componentWillMount () {
    ROUTERS.push(this);
    this.updating = true;
  };

  Router.prototype.componentDidMount = function componentDidMount () {
    var this$1 = this;
    this.updating = false;
  };

  Router.prototype.componentWillUnmount = function componentWillUnmount () {
    if (typeof this.unlisten==='function') { this.unlisten(); }
    ROUTERS.splice(ROUTERS.indexOf(this), 1);
  };

  Router.prototype.componentWillUpdate = function componentWillUpdate () {
    this.updating = true;
  };

  Router.prototype.componentDidUpdate = function componentDidUpdate () {
    this.updating = false;
  };

  Router.prototype.getMatchingChildren = function getMatchingChildren (children, url, invoke) {
    return children
      .filter(prepareVNodeForRanking)
      .sort(pathRankSort)
      .map( function (vnode) {
        var matches = exec(url, vnode.attributes.path, vnode.attributes);
        if (matches) {
          if (invoke !== false) {
            let newProps = { url, matches };
            Object.assign(newProps, matches);
            delete newProps.ref;
            delete newProps.key;
            return cloneElement(vnode, newProps);
          }
          return vnode;
        }
      }).filter(Boolean);
  };

  Router.prototype.render = function render (ref, ref$1) {
    var children = ref.children;
    var onChange = ref.onChange;
    var url = ref$1.url;

    var active = this.getMatchingChildren(children, url, true);

    var current = active[0] || null;
    this._didRoute = !!current;

    var previous = this.previousUrl;
    if (url!==previous) {
      this.previousUrl = url;
      if (typeof onChange==='function') {
        onChange({
          router: this,
          url: url,
          previous: previous,
          active: active,
          current: current
        });
      }
    }

    return current;
  };

  return Router;
}(Component));

var Link = function(props) {
  props.href = "#!" + props.to
  return h("a", props)
};

var Route = function (props) { return h(props.component, props); };

global.router = { subscribers, getCurrentUrl, routeTo, Router, Route, Link };

})(this);