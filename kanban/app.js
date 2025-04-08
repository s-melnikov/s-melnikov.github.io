const uniqid = (length => {
  const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    CHARS_LENGTH = CHARS.length
  return () => {
    let chars = []
    while (length--) {
      chars.push(CHARS[Math.floor(Math.random() * CHARS_LENGTH)])
    }
    return chars.join("")
  }
})(16)

let dashBoardId = null, hash
if (hash = location.hash.slice(1)) {
  dashBoardId = hash
  localStorage.hash = dashBoardId
} else if (localStorage.hash) {
  dashBoardId = localStorage.hash
  location.hash = dashBoardId
} else {
  dashBoardId = uniqid()
  localStorage.hash = dashBoardId
  location.hash = dashBoardId
}

firebase.initializeApp({
    apiKey: "AIzaSyAxcFvCH2cMuk0-bHIf6CUE_snseUUPRAM",
    databaseURL: "https://kanban-1c4b8.firebaseio.com"
})

firebase.auth().signInAnonymously();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {} else {}
})

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: true
});

let { h, app } = hyperapp,
  database = firebase.database(),
  ref = database.ref("dashboards/" + dashBoardId),
  boardsRef = ref.child("boards"),
  tasksRef = ref.child("tasks"),
  typesRef = ref.child("types"),
  lastBoardId = 0,
  lastTypeId = 0,
  lastTaskId = 0

let state = {
  boards: [],
  tasks: [],
  types: [],
  typesMap: {},
  taskToEdit: null,
  taskToShow: null,
  taskToMove: null,
  taskToDelete: null
}

let actions = {
  setData: data => {
    let newState = {
      boards: data.boards ? Object.keys(data.boards).map(uid => {
        data.boards[uid].uid = uid
        return data.boards[uid]
      }) : [],
      tasks: data.tasks ?  Object.keys(data.tasks).map(uid => {
        data.tasks[uid].uid = uid
        return data.tasks[uid]
      }) : [],
      types: data.types ? Object.keys(data.types).map(uid => {
        data.types[uid].uid = uid
        return data.types[uid]
      }) : []
    }
    newState.typesMap = newState.types.reduce((result, value) => {
      result[value.id] = value
      return result
    }, {})
    return newState
  },
  saveTask: task => ({ tasks, taskToShow }) => {
    if (task.uid) {
      tasksRef.child(task.uid).set(task)
      tasks = tasks.map(item => {
        if (item.uid === task.uid) {
          return task
        }
        return item
      })
      if (taskToShow) {
        return { taskToShow: task, tasks }
      }
    } else {
      task.id = ++lastTaskId
      task.time = Date.now()
      delete task.uid
      task.uid = tasksRef.push(task).key
      tasks.push(task)
    }
    return { tasks }
  },
  editTask: taskToEdit => ({ taskToEdit }),
  showTask: taskToShow => ({ taskToShow }),
  moveTask: taskToMove => ({ taskToMove }),
  deleteTask: taskToDelete => ({ taskToDelete })
}

function Task(task, state, actions) {
  return h("div", {
      class: "task",
      onclick: () => actions.showTask(task)
    },
    h("div", { class: "text" }, task.title),
    h("div", { class: "label bg-" + state.typesMap[task.type].color },
      state.typesMap[task.type].title),
    h("div", { class: "footer" },
      h("span", { class: "time" }, new Date(task.time).toDateString())
    )
  )
}

function Board(board, state, actions) {
  return h("div", { class: "board" },
    h("div", { class: "header bg-" + board.color },
      h("span", null, board.title)
    ),
    h("div", { class: "body" },
      state.tasks
        .filter(task => task.board == board.id)
        .map(task => Task(task, state, actions))
    ),
    h("div", { class: "footer" },
      h("span", {
        class: "btn btn-link",
        onclick: () => actions.editTask({ board: board.id })
      }, "new task")
    )
  )
}

function Modal(params) {
  return h("div",
    { class: "modal" + (params.class || "") },
    h("div", { class: "content" },
      params.header && h("div", { class: "header" }, params.header),
      h("div", { class: "body" }, params.body),
      params.footer && h("div", { class: "footer" }, params.footer)
    )
  )
}

function TaskShowModal(state, actions) {
  return Modal({
    class: " modal-show",
    header: h("div", null,
      h("div", { class: "label bg-" + state.typesMap[state.taskToShow.type].color },
        state.typesMap[state.taskToShow.type].title
      ),
      h("button", {
        class: "btn btn-link",
        onclick: () => actions.showTask(null)
      }, "Close"),
      h("button", {
        class: "btn btn-link red",
        onclick: () => actions.deleteTask(state.taskToShow)
      }, "Delete"),
      h("button", {
        class: "btn btn-link",
        onclick: () => actions.moveTask(state.taskToShow)
      }, "Move"),
      h("button", {
          class: "btn btn-link",
          onclick: () => actions.editTask(state.taskToShow)
        }, "Edit"),
        "Task #ID " + state.taskToShow.id
      ),
    body: [
      h("h2", { class: "title" }, state.taskToShow.title),
      h("div", { class: "text", innerHTML: marked(state.taskToShow.text) })
    ]
  })
}

function TaskEditModal(state, actions) {
  return h("form",  {
      onsubmit: event => {
        event.preventDefault()
        let task = {}
        let elements = event.target.elements
        let title = elements.title.value.trim()
        let text = elements.text.value.trim()
        if (text && title) {
          task.title = title
          task.text = text
          task.type = parseInt(elements.type.value)
          task.board = state.taskToEdit.board
          task.uid = state.taskToEdit.uid
          task.time = state.taskToEdit.time
          task.id = state.taskToEdit.id
          actions.saveTask(task)
          event.target.reset()
          actions.editTask(null)
        }
      },
      onreset: event => actions.editTask(null)
    },
    Modal({
      class: " modal-edit",
      header: [
        h("button", { class: "btn btn-link" }, "Submit"),
        h("button", {
          class: "btn btn-link red",
          type: "reset"
        }, "Close"),
        state.taskToEdit.id ?
          "Edit task #ID" + state.taskToEdit.id : "Create new task"
      ],
      body: [
        h("input", { name: "title", placeholder: "Title...", value: state.taskToEdit.title || "" }),
        h("textarea", { name: "text", placeholder: "Content..." }, state.taskToEdit.text || ""),
        h("div", { class: "types" },
          state.types.map((type, i) => {
            return h("label", { class: "type" },
              h("input", {
                type: "radio",
                name: "type",
                value: type.id,
                checked: state.taskToEdit.type ?
                  state.taskToEdit.type == type.id : !i
              }),
              h("span", { class: "label bg-" + type.color }),
              h("span", { class: "title" }, type.title)
            )
          })
        )
      ]
    })
  )
}

function TaskMoveModal(state, actions) {
  return h("div", { class: "modal" },
    h("div", { class: "content" },
      h("div", { class: "header" }, "Move task #ID" + state.taskToMove.id),
      h("div", { class: "body" },
        h("div", { class: "boards-list" },
          state.boards.map(board => {
            if (state.taskToMove.board == board.id) return null
            return h("label", { class: "board" },
              h("span", {
                class: "title bg-" + board.color,
                onclick: () => {
                  state.taskToMove.board = board.id
                  tasksRef.child(state.taskToMove.uid).set(state.taskToMove)
                  actions.moveTask(null)
                },
              }, board.title)
            )
          })
        )
      ),
      h("div", { class: "footer" },
        h("button", {
          class: "btn",
          onclick: () => actions.taskToMove(null)
        }, "Close")
      )
    )
  )
}

function TaskDeleteModal(state, actions) {
  return h("div", { class: "modal" },
    h("div", { class: "content" },
      h("div", { class: "header" }, "Delete task"),
      h("div", { class: "body" },
        "Are you sure to delete task?"),
      h("div", { class: "footer" },
        h("button", {
          class: "btn",
          onclick: () => actions.deleteTask(null)
        }, "No"),
        h("button", {
          class: "btn",
          onclick: () => {
            tasksRef.child(state.taskToDelete.uid).remove()
            actions.deleteTask(null)
            actions.showTask(null)
          }
        }, "Yes")
      )
    )
  )
}

function Layout(state, actions) {
  return h("div", { class: "container" },
    h("div", { class: "boards" },
      state.boards.map(board => Board(board, state, actions))
    ),
    state.taskToShow && TaskShowModal(state, actions),
    state.taskToEdit && TaskEditModal(state, actions),
    state.taskToMove && TaskMoveModal(state, actions),
    state.taskToDelete && TaskDeleteModal(state, actions)
  )
}

let main = app(state, actions, Layout, document.body)

ref.on("value", snapshot => {
  let data = snapshot.val()
  if (data == null) {
    fetch("/kanban/mock.json").then(resp => resp.json()).then(({ boards, types, tasks }) => {
      boards.map(board => boardsRef.push(board))
      types.map(type => typesRef.push(type))
      tasks.map(task => {
        task.time = Date.now()
        tasksRef.push(task)
      })
      lastBoardId = boards[boards.length - 1]
      lastTypeId = types[types.length - 1]
      lastTaskId = tasks[tasks.length - 1]
    })
  } else {
    main.setData(data)
  }
})
