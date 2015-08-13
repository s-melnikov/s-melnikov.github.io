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
function params(str) {
  var res = {};
  (str || location.search).replace(/^\?/, "").split("&").forEach(function(str) {
    str = str.split("=");
    res[str[0].toLowerCase()] = str[1] || true;
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

/*
function wait(obj, prop, func, time, self) {
  var start
  if (obj[prop])
    func.apply(self)
  else {
    start = new Date()
    if (count < 1000) setTimeout(function() {
      waitFor(obj, prop, func, time, self)
    }, 0);
  }
}
*/


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