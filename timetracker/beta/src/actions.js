def('actions', ['router', 'firebase'], ({ location: { actions } }, { signInWithEmail }) => {
  const signIn = email => (state, { changeEmail }) => {
    signInWithEmail(email).then(() => console.log(2));
    console.log(1);
  };

  return {
    location: actions,
    signIn
  };
});
