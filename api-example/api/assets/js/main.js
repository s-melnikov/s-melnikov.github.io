$(function () {

  $("a").each(function(i, el) {
    if (location.href.indexOf(el.href) > -1) {
      el.classList.add("active")
    }
  })

})

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '_')
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