m(['storage'], (storage) => {
  firebase.initializeApp({
    apiKey: 'AIzaSyAYoWsXOGnwLjlzbqR2uokozrDqXQCuuJU',
    databaseURL: 'https://timetracker-2dbde.firebaseio.com'
  });
  let auth = firebase.auth();

  const signIn = email => {
    let { origin, pathname } = location;
    auth
      .sendSignInLinkToEmail(email, {
        url: url,
        handleCodeInApp: true
      })
      .then(() => {
        console.log('signIn() success; link:', origin + pathname);
        localStorage.setItem('emailForSignIn', email);
      })
      .catch(error => console.log('signIn() error:', error.code));
  }

  const signOut = () => {
    firebase.auth().signOut()
      .then(() => console.log('signOut() success'))
      .catch(error => console.log('signOut() error:', error.code));
  }

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
});