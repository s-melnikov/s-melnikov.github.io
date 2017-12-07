Vue.component('c-sidebar', {
  props: ["items"],
  template: "#c-sidebar"
})

Vue.component('c-signin', {
  template: "#c-signin",
  data: function() {
    return {
      email: "",
      password: "",
      processing: false
    }
  },
  methods: {
    signIn: function() {
      var self = this
      self.processing = true
      $http
        .post("auth", { email: self.email, password: self.password })
        .then(function(response) {
          self.processing = false
          console.log(response)
        })
    }
  }
})