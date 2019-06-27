def('view/AuthWithEmail', [], () => {
  const { h } = hyperapp;
  return () => ({ email }, { signIn }) => (email || localStorage.emailForSignIn) ?
    h('div', { class: 'auth-link-sended' },
      'Please check your email to continue authentication',
    ) : h('form', {
      class: 'auth-form',
      onsubmit: e => {
        e.preventDefault();
        signIn(e.target[0].value);
      },
    },
      h('p', {}, 'Enter your email address for authentication'),
      h('input', { type: 'email', placeholder: 'Email', required: true, }),
      h('div', { class: 'text-right' },
        h('button', {
          class: 'btn btn-primary',
        }, 'Send authenticated link'),
      ),
    );
});
