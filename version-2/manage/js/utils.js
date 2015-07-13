var _ = (function(_) {

	var
		arrayProto = Array.prototype,
		arraySlice = arrayProto.slice,
		nativeForEach = arrayProto.forEach,
		hasOwnProperty = Object.prototype.hasOwnProperty,
		nativeKeys = Object.keys,
		logStart = new Date();

  _.DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
  _.MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

	_.log = function() {
	  if (location.search.indexOf('debug') == -1) return
	  var args = arraySlice.call(arguments)
	  args.unshift('%c[%s] %c%s', 'color:red', new Date() - logStart, 'color:blue')
	  console.log.apply(console, args)
	}

	_.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase()
  }

  _.toQueryString = function(obj) {
    var str = "";
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (str) str += "&"
        str += p + "=" + obj[p];
      }      
    }
    return str;
  }	

	_.has = function(obj, key) {
    return hasOwnProperty.call(obj, key)
  };

	_.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj)
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key)
    return keys;
  };

	var each = _.each = function(obj, iterator, context) {
    if (obj == null) return obj
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context)
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        iterator.call(context, obj[i], i, obj)
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        iterator.call(context, obj[keys[i]], keys[i], obj)
      }
    }
    return obj
  }

  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj
  }

  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  _.extend = function(obj) {
	  for (var i = 1, ln = arguments.length; i < ln; i++) {	  	
	    for (var prop in arguments[i]) {
	    	obj[prop] = arguments[i][prop]
	    }
	  }
	  return obj
	}

  _.$ = function(expr, container) {
    return typeof expr === "string"? (container || document).querySelector(expr) : expr || null
  }

  _.$$ = function(expr, container) {
    return arraySlice.call((container || document).querySelectorAll(expr))
  }

  _.ajax = function(params) {
    var req = new XMLHttpRequest(),
      type = (params.type || 'GET').toUpperCase(),
      url = params.url || ''
    req.open(type, url + (type == 'GET' ? '?' + _.toQueryString(params.data) : ''), true)
    req.responseType = params.dataType || ''
    req.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        params.success && params.success(this.response)
      }
    };
    req.send(type == 'POST' ? JSON.stringify(params.data) : '') 
  }

  _.date = function(date, format) {
    if (arguments.length == 1) { format = date, date = new Date() } 
    else date = _.isDate(date) ? date : new Date(date)
    var y = date.getFullYear().toString(),
      m = (date.getMonth() + 1).toString(),
      d = date.getDate().toString(),
      h = date.getHours().toString(),
      i = date.getMinutes().toString(),
      s = date.getSeconds().toString(),
      data = {
        Y: y,
        y: y.substr(2, 2),
        m: m[1] ? m : '0' + m,
        M: _.MONTHS ? _.MONTHS[m] : date.toDateString().substr(4, 3),
        d: d[1] ? d : '0' + d,
        D: _.DAYS ? _.DAYS[date.getDay()] : date.toDateString().substr(0, 3),
        h: h[1] ? h : '0' + h,
        i: i[1] ? i : '0' + i,
        s: s[1] ? s : '0' + s
      }
    return format.replace(/\w/g, function(a) { return data[a] })
  }

  var scopeStorage = {}

  _.modal = (function() {    
    var wrapper, btnCancel, btnSubmit, btnClose, modalBody, submitCb, cancelCb
    _(function() {
      wrapper = _.$('#awesomeModal')
      btnCancel = _.$('.btn-cancel', wrapper)
      btnSubmit = _.$('.btn-submit', wrapper)
      btnClose = _.$('.close', wrapper)
      modalBody = _.$('.modal-body', wrapper)
      _.each([btnClose, btnCancel, btnSubmit], function(el) {
        el.addEventListener('click', function() {
          wrapper.classList.remove('in')
        })
      })
    })    
    return function(html, submit, cancel) {
      modalBody.innerHTML = html      
      if (submitCb) {
        btnSubmit.removeEventListener('click', submitCb)
        submitCb = null
      }
      if (cancelCb) {
        btnCancel.removeEventListener('click', cancelCb)
        cancelCb = null
      }
      if (submit) {
        btnSubmit.addEventListener('click', submitCb = submit)
      }
      btnClose.style.display = !cancel ? "inline-block" : "none"
      btnCancel.style.display = cancel ? "inline-block" : "none"      
      if (_.isFunction(cancel)) {
        btnCancel.addEventListener('click', cancelCb = cancel)
      }
      wrapper.classList.add('in')
    }
  })()

  _.loader = function(isHide) {
    _.$('#loader').classList[isHide ? 'remove' : 'add']('in')
  }

	return _

})(function(cb) { document.addEventListener("DOMContentLoaded", cb) })

function notify(html, type, notHide) {
  var wrapper = document.querySelector('#noty-container'),
    message = document.createElement('div')
  message.className = 'alert alert-' + type
  message.innerHTML = html || ''
  if (!wrapper) {
    wrapper = document.createElement('div')
    wrapper.id = 'noty-container'
    document.querySelector('body').appendChild(wrapper)
  }
  wrapper.appendChild(message)
  function destroy() { message.remove() }
  message.addEventListener('click', destroy)
  !notHide && setTimeout(destroy, 5000)  
}