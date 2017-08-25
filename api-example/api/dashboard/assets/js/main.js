/*$(function () {

  $("a").each(function(i, el) {
    if (location.href.indexOf(el.href) > -1) {
      el.classList.add("active")
    }
  })

})*/

function getFormData(form) {
  let res = {}, fd = new FormData(form)
  for (let e of fd.entries()) res[e[0]] = e[1]
    return res
}

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

var date = (() => {
  return (date) => {
    return (new Date(date || Date.now())).toDateString()
  }
})()

var api = (() => {

  var base_url = "../"

  function req(path, data) {
    path = path || ""
    let headers = new Headers()
    let init = {
      credentials: "same-origin"
    }
    if (data) {
      headers.append("Content-Type", "application/json")
      init.method = "POST",
      init.body = JSON.stringify(data)
      init.headers = headers
    }
    return fetch(base_url + path + "/", init).then(resp => resp.json())
  }

  return {
    collections: () => ({
      get: () => req("collections"),
      push: data => req("collections", data || {})
    }),
    auth: () => ({
      status: () => req("auth"),
      signin: data => req("auth", data || {}),
    })
  }
})()