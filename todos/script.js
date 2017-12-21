const { h, app } = hyperapp
const APP_NAME = 'hypertodos'

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
const state = {
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
}
const actions = {
  toggleState: todo => (state, actions) => {
    state.todos.map(item => {
      if (item === todo) item.completed = !item.completed
      return item
    })
    actions.sync()
    return { todos: state.todos }
  },
  toggleForm: () => state => ({ formShowed: !state.formShowed }),
  setInput: input => ({ input }),
  addTodo: () => (state, actions) => {
    state.todos.push({
      text: state.input,
      time: ~~(Date.now() / 1000)
    })
    actions.sync()
    return { todos: state.todos, input: '', formShowed: false }
  },
  addTodos: todos => ({ todos }),
  toggleEdit: todo => (state, actions) => {
    var todos = state.todos.map(item => {
      if (item === todo) item.edited = !item.edited
      return item
    })
    actions.sync()
    return { todos }
  },
  edit: ({ todo, text }) => state => ({
    todos: state.todos.map(item => {
      if (item === todo) {
        item.text = text
        item.updated = ~~(Date.now() / 1000)
      }
      return item
    })
  }),
  sync: () => state => {
    localStorage[APP_NAME] = JSON.stringify(state.todos)
  },
  setType: type => ({ type }),
  remove: todo => state => {
    state.todos.splice(state.todos.indexOf(todo), 1)
    return { todos: state.todos }
  }
}

const Layout = (state, actions) => {
  return h('div', { class: 'container' },
    [Aside, Todos, AddTodo].map(view => view(state, actions))
  )
}

const Todos = (state, actions) =>
  h('div', { class: 'todos' },
    state.todos.filter(todo => {
      if (!state.type) return true
      if (state.type === 'actived') return !todo.completed
      return todo.completed
    })
    .map((todo, i) => h(Todo, { todo, i, actions }))
  )

const Todo = ({ todo, i, actions }) =>
  todo.edited ?
    h('form', {
        class: 'todo',
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
        class: 'todo' + (todo.completed ? ' completed' : '')
      },
      h('div', {
        class: 'checkbox',
        onclick: () => actions.toggleState(todo)
      }),
      h('span', {
        class: 'text',
        onclick: e => actions.toggleEdit(todo)
      }, todo.text),
      h('div', {
          class: 'time',
          tooltip: 'created: ' + date(todo.time) +
            (todo.updated ? '; updated: ' + date(todo.updated) : '')
        },
        date(todo.updated || todo.time)
      ),
      todo.completed ?
        h('span', {
          class: 'remove',
          innerHTML: '&times;',
          onclick: e => actions.remove(todo)
        }) : null
    )

let AddTodo = (state, actions) =>
  h('div', { class: 'add-todo' },
    state.formShowed ?
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
          value: state.input,
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

let Aside = (state, actions) => h('div', { class: 'aside' },
    h('a', {
      href: '#',
      class: state.type ? '' : 'active',
      onclick: e => actions.setType(null)
    }, 'All'),
    h('a', {
      href: '#',
      class: state.type === 'actived' ? 'active' : '',
      onclick: e => actions.setType('actived')
    }, 'Active'),
    h('a', {
      href: '#',
      class: state.type === 'completed' ? 'active' : '',
      onclick: e => actions.setType('completed')
    }, 'Completed')
  )

let main = app(state, actions, Layout, document.body)

if (localStorage[APP_NAME]) {
  main.addTodos(JSON.parse(localStorage[APP_NAME]))
}
