const log = console.log.bind(console)

const getFormData = f => {
  let r = {}, fd = new FormData(f)
  for (let e of fd.entries()) r[e[0]] = e[1]
  return r
}

const slugify = text => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '_')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

const translit = (() => {
  const a = "а:a,б:b,в:v,ґ:g,г:g,д:d,е:e,ё:e,є:ye,ж:zh,з:z,и:i,і:i,ї:yi,й:i,к:k,л:l,м:m,н:n,о:o,п:p,р:r,с:s,т:t,у:u,ф:f,x:h,ц:c,ч:ch,ш:sh,щ:sh',ъ:,ы:i,ь:,э:e,ю:yu,я:ya".split(",").reduce((a, b) => {
    return b = b.split(":"), a[b[0]] = b[1], a
  }, {})
  return str => (str || "").toLowerCase().split("").map(l =>  a[l] != null ? a[l] : l ).join("")
})()

const date = d => (new Date(d || Date.now())).toDateString()

const PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz"
const uid = () => {
  let now = Date.now(), chars = [], i = 8, id
  while (i--) {
    chars[i] = PUSH_CHARS.charAt(now % 64)
    now = Math.floor(now / 64)
  }
  id = chars.join("")
  i = 12
  while (i--) {
    id += PUSH_CHARS.charAt(Math.floor(Math.random() * 64))
  }
  return id
}

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
      get: id => id ? req("collection/" + id) : req("collections"),
      push: data => req("collections", data || {})
    }),
    auth: () => ({
      status: () => req("auth"),
      signin: data => req("auth", data),
      signout: () => req("auth", {})
    })
  }
})()