Vue.component('c-sidebar', {
  props: ["items"],
  template: "#c-sidebar"
})

Vue.component('c-signin', {
  template: "#c-signin",
  data: function() {
    return {
      email: "fsimmins0@google.ru",
      password: "Flory",
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
          if (response.error) {
            self.processing = false
            self.error = response.error
          } else {
            console.log(response)
          }
        })
    }
  }
})