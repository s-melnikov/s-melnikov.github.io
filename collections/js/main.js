riot.tag("app", template("app"), function(opts) {
  let self = this
  let storage = new Storage("my_app")

  self.authorised = true
  self.tables = null

  self.on("mount", () => {
    storage.table("tables").find().then(collection => {
      self.tables = collection.toArray()
      self.update()
    })
  })
})

riot.tag("router-link", '<a class="{opts.class}" href="#!{opts.to}">{opts.text}</a>', function(opts) {

})