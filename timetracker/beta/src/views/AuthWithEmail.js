def('view/AuthWithEmail', [], () => {
  const { h } = hyperapp;
  return (state, actions) => h('form', {
    class: 'auth-form',
    onsubmit: () => {},
  },
    h('input', { placeholder: 'Email' }),
  );
});
