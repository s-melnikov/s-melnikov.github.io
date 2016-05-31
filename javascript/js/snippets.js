/*
 * Cookie
 */
function cookie(key, value, hours, domain, path) {
  var expires = new Date(),
    pattern = "(?:; )?" + key + "=([^;]*);?",
    regexp = new RegExp(pattern);
  if (value) {
    key += '=' + encodeURIComponent(value);
    if (hours) {
      expires.setTime(expires.getTime() + (hours * 3600000));
      key += '; expires=' + expires.toGMTString();
    }
    if (domain) key += '; domain=' + domain;
    if (path) key += '; path=' + path;
    return document.cookie = key;
  } else if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"]);
  return false;
}

/*
 * Query parameters
 */
function query(str) {
  var res = {};
  (str || location.search).replace(/^\?/, "").split("&").forEach(function(str) {
    str = str.split("=");
    res[str[0].toLowerCase()] = str[1] && decodeURIComponent(str[1]) || true;
  });
  return res;
}

/*
 *
 */
function query(obj) {
  var str = "";
  for (var prop in obj) {
    str && (str += "&") || (str = "?");
    if (obj.hasOwnProperty(prop)) str += prop + "=" + obj[prop];
  }
  return str;
}

/*
 * Random
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (window.Notification && Notification.permission !== "denied") {
  Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
    var n = new Notification('Title', { body: 'I am the body text!', icon: 'http://lorempixel.com/48/48', tag: 'noty' });
    //setTimeout(function() { n.close(); }, 1000);
  });
}

var randomString = function(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function encodeHtmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\\/g, '&bsol;')
    .replace(/\//g, '&sol;');
};

function decodeHtmlEntities(str) {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
    .replace(/&bsol;/g, '\\')
    .replace(/&sol;/g, '/');
};

function bindModelInput(obj, property, domElem) {
  Object.defineProperty(obj, property, {
    get: function() { return domElem.value; },
    set: function(newValue) { domElem.value = newValue; },
    configurable: true
  });
}

// <input id="foo">
// user = {}
// bindModelInput(user,'name', document.getElementById('foo'));

function generate(str) {
  return str.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    return (c == 'x' ? r : (r & 0x3 | 0x8 )).toString(16);
  });
}

generate('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx');

var template = (function() {
  function get(obj, keys) {
    if (!Array.isArray(keys)) keys = keys.split('.');
    return obj[keys[0]] == null ? '' : (!keys[1] ? obj[keys[0]] : get(obj[keys[0]], keys.slice(1)));
  }
  return function(str, obj) {
    return str.replace(/{{(?:\s*)([\s\S]+?)(?:\s*)}}/g, function(match, keys) {
      return get(obj, keys);
    });
  }
})();

function dot(o, p, v) {
  p = p.split('.');
  if (p.length > 1) return dot(o[p[0]], p.slice(1).join('.'), v);
  if (v) return o[p[0]] = v;
  return o[p[0]];
}

/**
 * Encode Form Data
 */
function encodeFormData(data) {
  if (!data) return "";
  var pairs = [];
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue;
    if (typeof data[name] === "function") continue;
    var value = data[name].toString();
    name = encodeURIComponent(name.replace("%20", "+"));
    value = encodeURIComponent(value.replace("%20", "+"));
    pairs.push(name + "=" + value);
  }
  return pairs.join("&");
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function genKey() {
  var key = '';
  for (i = 0; i < 5; i++) key += Math.ceil(Math.random()*15).toString(16);
  return key;
}

function waitFor(obj, prop, func, self, count) {
  if (obj[prop]) {
    func.apply(self);
  } else {
    count = count || 0;
    if (count < 1000) setTimeout(function() {
      waitFor(obj, prop, func, self, count + 1)
    }, 0);
  }
}


/* bling.js */

window.$ = document.querySelectorAll.bind(document)

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn)
}

NodeList.prototype.__proto__ = Array.prototype

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function (elem, i) {
    elem.on(name, fn)
  })
}

function convertIntToShortCode(id) {
  var chars = '123456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ',
    code = '';
  id = parseInt(id);

  if (isNaN(id)) throw Error('The "id" is not a valid integer');

  while (id > chars.length - 1) {
    code = chars[id % chars.length] + code;
    id = Math.floor(id / chars.length);
  }

  return chars[id] + code;
}

function factorial(n) {
  return (n != 1) ? n * factorial(n - 1) : 1;
}


function noSleep() {
  var v = document.createElement('video'),
    s = document.createElement('source')
  v.setAttribute('loop', '')
  s.src = 'data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='
  s.type = 'video/webm'
  v.appendChild(s)
  v.play()
}

function getDataUri(url, callback) {
  var image = new Image();
  image.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
    canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
    canvas.getContext('2d').drawImage(this, 0, 0);
    callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
  };
  image.src = url;
}

// Usage
/*
getDataUri('/logo.png', function(dataUri) {
    // Do whatever you'd like with the Data URI!
});
*/

var _get = function get(_x, _x2, _x3) {
  var _again = true;
  _function: while (_again) {
    var object = _x,
      property = _x2,
      receiver = _x3;
    desc = parent = getter = undefined;
    _again = false;
    if (object === null)
        object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        continue _function;
      }
    } else if ('value' in desc) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  }
};

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps)
      defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(subClass, superClass)
    } else {
      subClass.__proto__ = superClass;
    }
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

function copyTextToClipboard(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function randBase64(length) {
  var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  var str = "";
  for (var i=0; i < length; ++i) {
    var rand = Math.floor(Math.random() * ALPHABET.length);
    str += ALPHABET.substring(rand, rand+1);
  }
  return str;
}

var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();

function whichTransitionEvent(){
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }
  for(t in transitions) {
    if( el.style[t] !== undefined ) {
      return transitions[t];
    }
  }
}

/* Listen for a transition! */
var transitionEvent = whichTransitionEvent();

function observable(el) {
  var cb = {}, slice = [].slice;
  el.on = function(events, fn) {
    if (typeof fn === "function") {
      events.replace(/[^\s]+/g, function(name, pos) {
        (cb[name] = cb[name] || []).push(fn)
        fn.typed = pos > 0
      })
    }
    return el
  }
  el.off = function(events, fn) {
    if (events === "*") cb = {}
    else if (fn) {
      var arr = cb[events]
      for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
        if (cb === fn) { arr.splice(i, 1); i--; }
      }
    } else {
      events.replace(/[^\s]+/g, function(name) {
        cb[name] = []
      });
    }
    return el
  }
  el.one = function(name, fn) {
    if (fn) fn.one = true
    return el.on(name, fn)
  }
  el.trigger = function(name) {
    var args = slice.call(arguments, 1),
      fns = cb[name] || []
    for (var i = 0, fn; (fn = fns[i]); ++i) {
      if (!fn.busy) {
        fn.busy = true
        fn.apply(el, fn.typed ? [name].concat(args) : args)
        if (fn.one) { fns.splice(i, 1);i--; }
        fn.busy = false
      }
    }
    return el
  }
  return el
}

function parseUrl(url) {
  var result = {},
    anchor = document.createElement('a')
    anchor.href = url;
  ['protocol','hostname','port','pathname','search','hash','host'].map(function(el) {
    result[el] = anchor[el]
  })
  return result;
}

function leftpad (str, len, ch) {
  str = String(str);

  var i = -1;

  if (!ch && ch !== 0) ch = ' ';

  len = len - str.length;

  while (++i < len) {
    str = ch + str;
  }

  return str;
}