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
