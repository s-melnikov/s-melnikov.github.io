require(['firebase'], (Firebase) => {

  auth.onAuthStateChanged(user => {
    if (user) {
      console.log(user)
    }
  });

  if (firebase.auth().isSignInWithEmailLink(location.href)) {
    email = localStorage.getItem('emailForSignIn');
    if (email) {
      firebase.auth().signInWithEmailLink(email, location.href)
      .then(result=> {
        console.log('signInWithEmailLink() success; email:', email)
        localStorage.removeItem('emailForSignIn');
      })
      .catch(function(error) {
        console.log('signInWithEmailLink() error:', error.code)
        alert(error.message)
        location.replace(location.href.replace(location.search, ''))
      });
    } else {
      console.log('error: email for confirmation is empty');
    }
  }

  const { h, app } = hyperapp;
})