Q("a").map(function(el) {
  if (el.href == location.href) {
    el.classList.add("active")
  }
})

function Q(selector, context) {
  return [].slice.call((context || document).querySelectorAll(selector))
}

function makeNode(html) {
  var div = document.createElement("div")
  div.innerHTML = html.trim()
  return div.childNodes[0]
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

var translit = (function() {
  var assoc = {
    "а":"a","б":"b","в":"v","ґ":"g","г":"g","д":"d","е":"e","ё":"e","є":"ye","ж":"zh",
    "з":"z","и":"i","і":"i","ї":"yi","й":"i","к":"k","л":"l","м":"m","н":"n","о":"o",
    "п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","x":"h","ц":"c","ч":"ch","ш":"sh",
    "щ":"sh'","ъ":"","ы":"i","ь":"","э":"e","ю":"yu","я":"ya"
  }
  return function(str) {
    return (str || "").toLowerCase().split("").map(function(l) {
      return assoc[l] != null ? assoc[l] : l
    }).join("")
  }
})()