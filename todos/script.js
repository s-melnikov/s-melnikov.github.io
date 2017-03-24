const { h, app } = hyperapp

function LayoutView(model, actions) {
  return h('div', { 'class': 'container' },
    TodosView(model, actions),
    AddTodoView(model, actions)
  )
}

function TodosView(model, actions) {
  return h('div', { 'class': 'todos' },
    model.todos
      .map((todo, i) => TodoView(todo, i, actions))
  )
}

function TodoView(todo, i, actions) {
  return h('div',
    { 'class': 'todo' + (todo.completed ? ' completed' : '') },
    h('div', {
      'class': 'checkbox',
      onclick: () => actions.toggle(todo)
    }),
    h('div', { 'class': 'text' }, todo.text)
  )
}

app({
  model: {
    todos: [
      { text: "Lorem ipsum dolor sit amet" },
      { text: "Consectetur adipisicing elit" },
      { text: "Voluptas consequuntur omnis" },
      { text: "Quisquam magnam adipisci", completed: true },
      { text: "Voluptates nostrum optio eos eveniet" }
    ]
  },
  actions: {
    toggle: (model, todo) => ({
      todos: model.todos.map(_todo => {
        if (_todo === todo) _todo.completed = !_todo.completed
        return _todo
      })
    })
  },
  view: LayoutView
})