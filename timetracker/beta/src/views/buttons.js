def('view/buttons', [], () => {
  const { h } = hyperapp;

  const Button = (props, children) => h('button', { class: 'btn', ...props}, children);

  const ButtonPrimary = (props, children) => h(Button, { class: 'btn btn-primary', ...props }, children);

  return {
    Button,
    ButtonPrimary
  }
});
