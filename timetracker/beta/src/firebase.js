def('firebase', [], () => {
  firebase.initializeApp({
    apiKey: "AIzaSyChh0P2PuJA25vmvVtBoDQhOzgJrxgURss",
    authDomain: "timetracker-47f14.firebaseapp.com",
    projectId: "timetracker-47f14",
  });
  const auth = firebase.auth();
  const getLocation = () => {
    const { protocol, host, pathname } = location;
    return `${protocol}//${host}${pathname}`;
  }
  const signInWithEmail = (email) => {
    return auth
      .sendSignInLinkToEmail(email, {
        url: `${getLocation()}signin_with_email`,
        handleCodeInApp: true,
      })
      .then(() => localStorage.setItem('emailForSignIn', email))
      .catch(error => console.warn('sendSignInLinkToEmail()', error));
  }

  if (auth.isSignInWithEmailLink(location.href)) {
    let email = localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Please provide your email for confirmation');
    }
    auth
      .signInWithEmailLink(email, location.href)
      .then(() => {
        localStorage.removeItem('emailForSignIn');
        location.replace(getLocation());
      })
      .catch(error => {
        console.warn('signInWithEmailLink()', error);
        location.replace(getLocation());
      });
  }

  return {
    signInWithEmail,
    onAuthStateChanged: auth.onAuthStateChanged.bind(auth),
    db: firebase.firestore(),
  };
});
