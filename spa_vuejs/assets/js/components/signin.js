Vue.component('c-page-signin', {
  template: "#c-page-signin",
  data: function() {
    return {
      email: "",
      password: "",
      processing: false
    }
  },
  methods: {
    signIn: function() {
      this.processing = true
      $http
        .post("auth", { email: this.email, password: this.password })
        .then(function(response) {
          this.processing = false
          console.log(response)
        }.bind(this))
    }
  }
})