const { h, app } = hyperapp
const APP_NAME = 'hypertodos'

const LayoutView = (model, actions) =>
  h('div', { 'class': 'container' },
    TodosView(model, actions),
    AddTodoView(model, actions)
  )

const TodosView = (model, actions) =>
  h('div', { 'class': 'todos' },
    model.todos.map((todo, i) => TodoView(todo, i, actions))
  )

const TodoView = (todo, i, actions) =>
  h('div', {
      'class': 'todo' + (todo.completed ? ' completed' : '')
    },
    h('div', {
      'class': 'checkbox',
      onclick: () => actions.toggleTodoState(todo)
    }),
    h('div', { 'class': 'text' }, todo.text),
    h('div', { 'class': 'time' }, fromNow(todo.time))
  )

let AddTodoView = (model, actions) =>
  h('div', { 'class': 'add-todo' },
    model.formShowed ?
      h('form',
        {
          onsubmit: e => {
            e.preventDefault()
            actions.addTodo()
          }
        },
        h('input', {
          required: true,
          type: 'text',
          placeholder: 'Type something...',
          value: model.input,
          onCreate: el => el.focus(),
          oninput: ev => actions.setInput(ev.target.value)
        }),
        h('button', null, 'Save')
      ) :
      h('a', {
        href: '#',
        onclick: actions.toggleForm
      }, '+ Add')
  )

var fromNow = (time, between) => {
  between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return ~~(between / 60) + ' m.'
  } else if (between < 86400) {
    return ~~(between / 3600) + ' h.'
  } else {
    return ~~(between / 86400) + ' d.'
  }
}

app({
  model: {
    todos: [
      { text: "Lorem ipsum dolor sit amet", time: 1490608041 },
      { text: "Consectetur adipisicing elit", time: 1490608051 },
      { text: "Voluptas consequuntur omnis", time: 1490608061 },
      { text: "Quisquam magnam adipisci", time: 1490608071, completed: true },
      { text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio sunt, error eius temporibus, voluptate illo consectetur dicta mollitia perferendis dolores repellendus numquam? Rem dolor autem earum vitae numquam natus similique.", time: 1490608080 }
    ],
    formShowed: false,
    input: ""
  },
  actions: {
    toggleTodoState: (model, todo, actions) => {
      model.todos.map(_todo => {
        if (_todo === todo) _todo.completed = !_todo.completed
        return _todo
      })
      actions.sync()
      return { todos: model.todos }
    },
    toggleForm: model => ({ formShowed: !model.formShowed }),
    setInput: (_, input) => ({ input }),
    addTodo: (model, _, actions) => {
      model.todos.push({
        text: model.input,
        time: ~~(Date.now() / 1000)
      })
      actions.sync()
      return { todos: model.todos, input: '', formShowed: false }
    },
    addTodos: (_, todos) => ({ todos }),
    sync: model => { localStorage[APP_NAME] = JSON.stringify(model.todos) }
  },
  subscriptions: [
    (_, actions) => actions.addTodos(JSON.parse(localStorage[APP_NAME] || "[]"))
  ],
  view: LayoutView
})