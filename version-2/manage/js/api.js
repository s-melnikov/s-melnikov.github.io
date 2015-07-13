function Api(name) {

  var self = this,
    rootRef = new Firebase("https://" + name + ".firebaseio.com/"),
    authData = null

  this.isAuth = function() {
    return !!authData
  }

  this.auth = function(data, onsuccess, onerror) {
    rootRef.authWithPassword(data, function(error, data) {
      if (error) {
        onerror && onerror(error)
      } else {
        authData = data
        onsuccess && onsuccess(data)
      }
    });
  }

  this.getUser = function() {
    if (!authData) return null
    return { 
      uid: authData.uid, 
      email: authData.password.email,
      img: authData.password.profileImageURL
    }
  }

  this.logout = function(success, error) {
    self.user = null
  }

  this.addWork = function(data, onsuccess, onerror) {
    var ref = rootRef.child('portfolio')
    var id = ref.push(data, function(error) {
      if (error) onerror && onerror(error)
      else onsuccess && onsuccess(id)
    }).key()
  }

  this.getWork = function(id, onsuccess, onerror) {
    var ref = rootRef.child('portfolio/' + id)
    ref.once("value", function(snapshot) {
      onsuccess && onsuccess(snapshot.val())
    }, onerror)
  }

  this.getWorks = function(onsuccess) {
    var ref = rootRef.child('portfolio')
    ref.once("value", function(snapshot) {
      onsuccess && onsuccess(snapshot.val())
    }, onerror)
  }
}