var template;

template = (function(_) {

  _.templateSettings = {
    evaluate: /{%([\s\S]+?)%}/g,
    interpolate: /{%=([\s\S]+?)%}/g,
    escape: /{%-([\s\S]+?)%}/g
  };

  var noMatch = /(.)^/;

  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };

  _.escape = function(string) {
    if (string == null) return '';
    return ('' + string).replace(/[&<>"']/g, function(match) {
      return entityMap[match];
    });
  }

  return function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.templateSettings;

    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      return match;
    });
    source += "';\n";

    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };
})({});

var compiled = template('\
  <div>\
    {%= test %}\
  </div>\
  <strong> {%- html %} </strong>\
  <ul>\
  {% for (var p in fruits) { %}\
    <li> {%= fruits[p] %} </li>\
  {% } %}\
  </ul>\
');

document.querySelector("#output").innerHTML = compiled({
  test: 1000,
  fruits: ['banana', 'apple', 'orange', 'lime', 'melon'],
  html: '<a href="http://google.com" target="_blank">google.com</a>'
});
