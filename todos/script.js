const { h, app } = hyperapp

const LayoutView = (model, actions) =>
  h('div', {
      'class': 'container'
    },
    TodosView(model, actions),
    AddTodoView(model, actions)
  )


const TodosView = (model, actions) =>
  h('div', {
      'class': 'todos'
    },
    model.todos.map((todo, i) => TodoView(todo, i, actions))
  )

const TodoView = (todo, i, actions) =>
  h('div', {
      'class': 'todo' + (todo.completed ? ' completed' : '')
    },
    h('div', {
      'class': 'checkbox',
      onclick: () => actions.toggle(todo)
    }),
    h('div', { 'class': 'text' }, todo.text)
  )

let AddTodoView = (model, actions) =>
  h('div', {
      'class': 'add-todo'
    },
    h('a', { href: '#' }, '+ Add')
  )

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