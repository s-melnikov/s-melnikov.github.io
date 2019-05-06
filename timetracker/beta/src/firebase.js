def('firebase', [], () => {
  firebase.initializeApp({
    apiKey: "AIzaSyChh0P2PuJA25vmvVtBoDQhOzgJrxgURss",
    authDomain: "timetracker-47f14.firebaseapp.com",
    projectId: "timetracker-47f14",
  });
  const auth = firebase.auth();
  const signIn = (email) => {
    auth
      .sendSignInLinkToEmail(email, {
        url: location.href,
        handleCodeInApp: true,
      })
      .then(() => localStorage.setItem('emailForSignIn', email))
      .catch(error => console.warn('sendSignInLinkToEmail()', error));
  }

  if (auth.isSignInWithEmailLink(location.href)) {
    let email = localStorage.getItem('emailForSignIn');
    if (!email) email = window.prompt('Please provide your email for confirmation');
    auth
      .signInWithEmailLink(email, location.href)
      .then(() => {
        localStorage.removeItem('emailForSignIn');
        location.replace(location.href.split('?')[0]);
      })
      .catch(error => {
        console.warn('signInWithEmailLink()', error);
        location.replace(location.href.split('?')[0]);
      });
  }

  return {
    signIn,
    onAuthStateChanged: auth.onAuthStateChanged.bind(auth),
    db: firebase.firestore(),
  };
});
