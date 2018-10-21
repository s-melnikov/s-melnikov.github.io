define('firebase-auth', [], () => {

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

  return {
    signIn,
    signOut,
  }
})