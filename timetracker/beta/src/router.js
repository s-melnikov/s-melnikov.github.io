def('router', [], () => {
  const { h } = hyperapp;

  const {
    decodeURIComponent,
    addEventListener,
    removeEventListener,
  } = window;

  const createMatch = (isExact, path, url, params) => ({ isExact, path, url, params });

  const trimTrailingSlash = (url) => {
    for (var len = url.length; '/' === url[--len];);
    return url.slice(0, len + 1);
  }

  const decodeParam = (val) => {
    try {
      return decodeURIComponent(val);
    } catch (e) {
      return val;
    }
  };

  const parseRoute = (path, url, options) => {
    url = url.slice(1);
    if (path === url || !path) {
      return createMatch(path === url, path, url);
    }
    let exact = options && options.exact;
    let paths = trimTrailingSlash(path).split('/');
    let urls = trimTrailingSlash(url).split('/');
    let i, params, len;
    if (paths.length > urls.length || (exact && paths.length < urls.length)) {
      return false;
    }
    for (i = 0, params = {}, len = paths.length, url = ''; i < len; i++) {
      if (':' === paths[i][0]) {
        params[paths[i].slice(1)] = urls[i] = decodeParam(urls[i]);
      } else if (paths[i] !== urls[i]) {
        return false;
      }
      url += urls[i] + '/';
    }
    return createMatch(false, path, url.slice(0, -1), params);
  };

  const Link = (props, children) => (state) => {
    let to = props.to;
    let location = state.location;
    let onclick = props.onclick;
    let classes = props.class ? props.class.split(' ') : [];
    if (location.hash.slice(2) === props.to.slice(1)) {
      classes.push('active');
    }
    props.class = classes.join(' ');
    delete props.to;
    delete props.location;
    props.href = `#${to}`;
    return h('a', props, children);
  };

  const Route = (props) => (state, actions) => {
    let location = state.location;
    let match = parseRoute(props.path, location.hash, {
      exact: !props.parent,
    });
    return (
      match && props.render({ match, location })
    );
  };

  const Switch = (props, children) => (state, actions) => {
    let child, i = 0;
    while (
      !(child = children[i] && children[i](state, actions)) &&
      i < children.length
    ) { i++ }
    return child;
  };

  const Redirect = (props) => () => {
    window.location.hash = props.to;
  };

  const location = {
    state: {
      hash: window.location.hash,
      previous: window.location.hash,
    },
    actions: {
      go(hash) {
        location.hash = hash;
      },
      set(data) {
        return data;
      }
    },
    subscribe(actions) {
      const handleLocationChange = (e) => {
        console.log({ hash: window.location.hash });
        actions.set({
          hash: window.location.hash,
          previous: e.detail
            ? (window.location.previous = e.detail)
            : window.location.previous,
        });
      };
      addEventListener('hashchange', handleLocationChange);
      return () => removeEventListener('hashchange', handleLocationChange);
    }
  };

  return {
    Route,
    Switch,
    Redirect,
    Link,
    location,
  };
});
