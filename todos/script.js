const { h, app } = hyperapp
const APP_NAME = 'hypertodos'

const LayoutView = (model, actions) =>
  h('div', { 'class': 'container' },
    [
      AsideView,
      TodosView,
      AddTodoView
    ].map(v => v(model, actions))
  )

const TodosView = (model, actions) =>
  h('div', { 'class': 'todos' },
    model.todos
    .filter(todo => {
      if (!model.type) return true
      if (model.type === 'actived') return !todo.completed
      return todo.completed
    })
    .map((todo, i) => TodoView(todo, i, actions))
  )

const TodoView = (todo, i, actions) =>
  todo.edited ?
    h('form', {
        'class': 'todo',
        onsubmit: ev => {
          ev.preventDefault()
          actions.toggleEdit(todo)
        }
      },
      h('input', {
        required: true,
        type: 'text',
        placeholder: 'Type something...',
        value: todo.text,
        onCreate: el => el.focus(),
        oninput: ev => actions.edit({ todo, text: ev.target.value })
      }),
      h('button', null, 'Save')
    ) :
    h('div', {
        'class': 'todo' + (todo.completed ? ' completed' : '')
      },
      h('div', {
        'class': 'checkbox',
        onclick: () => actions.toggleState(todo)
      }),
      h('span', {
        'class': 'text',
        onclick: e => actions.toggleEdit(todo)
      }, todo.text),
      h('div', {
          'class': 'time',
          tooltip: 'created: ' + date(todo.time) +
            (todo.updated ? '; updated: ' + date(todo.updated) : '')
        },
        date(todo.updated || todo.time)
      ),
      todo.completed ?
        h('span', {
          'class': 'remove',
          innerHTML: '&times;',
          onclick: e => actions.remove(todo)
        }) : null
    )

let AddTodoView = (model, actions) =>
  h('div', { 'class': 'add-todo' },
    model.formShowed ?
      h('form', {
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

let AsideView = (model, actions) =>
  h('div', {
      'class': 'aside'
    },
    h('a', {
      href: '#',
      'class': model.type ? '' : 'active',
      onclick: e => actions.setType(null)
    }, 'All'),
    h('a', {
      href: '#',
      'class': model.type === 'actived' ? 'active' : '',
      onclick: e => actions.setType('actived')
    }, 'Active'),
    h('a', {
      href: '#',
      'class': model.type === 'completed' ? 'active' : '',
      onclick: e => actions.setType('completed')
    }, 'Completed')
  )

var fromNow = (time) => {
  var between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return ~~(between / 60) + ' m.'
  } else if (between < 86400) {
    return ~~(between / 3600) + ' h.'
  } else {
    return ~~(between / 86400) + ' d.'
  }
}

let monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec']

let date = time => {
  var d = new Date(time * 1000)
  return d.getDate() + ' ' + monthes[d.getMonth()] + ', ' +
    d.toTimeString().substr(0, 5)
}

app({
  model: {
    todos: [
      { text: 'Lorem ipsum dolor sit amet', time: 1490608041 },
      { text: 'Consectetur adipisicing elit', time: 1490608051 },
      { text: 'Voluptas consequuntur omnis', time: 1490608061 },
      { text: 'Quisquam magnam adipisci', time: 1490608071, completed: true },
      { text:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio sunt,'+
        ' error eius temporibus, voluptate illo consectetur dicta mollitia per'+
        'ferendis dolores repellendus numquam? Rem dolor autem earum vitae num'+
        'quam natus similique.', time: 1490608080 }
    ],
    formShowed: false,
    input: "",
    type: 'actived'
  },
  actions: {
    toggleState: (model, todo, actions) => {
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
    toggleEdit: (model, todo, actions) => {
      var todos = model.todos.map(_todo => {
        if (_todo === todo) _todo.edited = !_todo.edited
        return _todo
      })
      actions.sync()
      return { todos }
    },
    edit: (model, { todo, text }) => ({
      todos: model.todos.map(_todo => {
        if (_todo === todo) {
          _todo.text = text
          _todo.updated = ~~(Date.now() / 1000)
        }
        return _todo
      })
    }),
    sync: model => {
      localStorage[APP_NAME] = JSON.stringify(model.todos)
    },
    setType: (_, type) => ({ type }),
    remove: (model, todo) => {
      model.todos.splice(model.todos.indexOf(todo), 1)
      return { todos: model.todos }
    }
  },
  subscriptions: [
    (_, actions) => {
      if (localStorage[APP_NAME])
        actions.addTodos(JSON.parse(localStorage[APP_NAME]))
    }
  ],
  view: LayoutView
})