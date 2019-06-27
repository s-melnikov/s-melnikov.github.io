def('view/NavBar', ['router'], ({ Link }) => {
  const { h } = hyperapp;
  return () => (state, { startNewTask }) => h('div', { class: 'navbar' },
    h(Link, { to: '/' }, 'By Days'),
    h(Link, { to: '/activity' }, 'By Activity'),
    h(Link, { to: '/date' }, 'By Date'),
    h(Link, { to: '/correct' }, 'Correcting'),
    h('hr'),
    h('button', {
      class: 'btn btn-primary',
      onclick: startNewTask,
    }, 'New task'),
  );
});
