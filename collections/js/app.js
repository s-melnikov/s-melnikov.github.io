Moon.use(MoonRouter)

Moon.component("Root", {
  template: tpl("root")
})

// let storage = createStorage("my_app")

let router = new MoonRouter({
  default: "/",
  map: {
    "/": "Root"
  }
})

let app = new Moon({
  el: "#app",
  router: router,
  data: {}
})