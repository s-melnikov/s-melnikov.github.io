def(
  'view', [
    'router',
    'view/AuthWithEmail',
    'view/NavBar',
  ], (
    { Route, Switch },
    AuthWithEmail,
    NavBar,
  ) => {
    const { h } = hyperapp;
    return () => ({ user }) => user ? h('div', { id: 'container' },
      h(NavBar),
      h(Switch, null,
        h(Route, { path: '/', render: () => 'TasksListByDays' }),
        h(Route, { path: '/activity', render: () => 'TasksListByActivity' }),
        h(Route, { path: '/date', render: () => 'TasksListByDate' }),
        h(Route, { path: '/correct', render: () => 'TasksListCorrect' }),
      ),
    ) : h(AuthWithEmail)
  });
