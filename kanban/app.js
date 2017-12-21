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

let boardId = null, hash
if (hash = location.hash.slice(1)) {
  boardId = hash
  localStorage.hash = boardId
} else if (localStorage.hash) {
  boardId = localStorage.hash
  location.hash = boardId
} else {
  boardId = uniqid()
  localStorage.hash = boardId
  location.hash = boardId
}

firebase.initializeApp({
  databaseURL: "https://kanban-1c4b8.firebaseio.com"
})

let { h, app } = hyperapp,
  database = firebase.database(),
  ref = database.ref(boardId),
  boards = ref.child("boards"),
  tasks = ref.child("tasks"),
  types = ref.child("types"),
  lastTaskId = 0

let state = {
  boards: [],
  tasks: [],
  types: [],
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
    newState.colors = newState.types.reduce((a, b) => {
      a[b.id] = b.color
      return a
    }, {})
    return newState
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
    h("div", { class: "label bg-" + state.colors[task.type] }),
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
        onclick: () => actions.editTask({ board_id: board.id })
      }, "new task")
    )
  )
}

function Modal(params) {
  return h("div",
    { class: "modal" + (params.class || "") },
    h("div", { class: "content" },
      h("div", { class: "header" }, params.header || null),
      h("div", { class: "body" }, params.body || null),
      h("div", { class: "footer" }, params.footer || null)
    )
  )
}

function TaskEditModal(state, actions) {
  return h("form",  {
      onsubmit: event => {
        event.preventDefault()
        let title = event.target.elements.title.value.trim()
        let text = event.target.elements.text.value.trim()
        if (text && title) {
          if (state.taskToEdit.uid) {
            tasks.child(state.taskToEdit.uid).set({
              text,
              title,
              type: parseInt(event.target.elements.type.value),
              board: state.taskToEdit.board,
              id: state.taskToEdit.id
            })
          } else {
            tasks.push({
              id: ++lastTaskId,
              text,
              title,
              board: state.taskToEdit.board_id,
              type: parseInt(event.target.elements.type.value),
              time: Date.now()
            })
          }
          event.target.reset()
          actions.editTask(null)
        }
      },
      onreset: event => actions.editTask(null)
    },
    Modal({
      class: " modal-edit",
      header: state.taskToEdit.id ?
        "Edit task #ID" + state.taskToEdit.id : "Create new task",
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
      ],
      footer: [
        h("button", {
          class: "btn",
          type: "reset"
        }, "Close"),
        h("button", { class: "btn" }, "Submit")
      ]
    })
  )
}

function TaskShowModal(state, actions) {
  return Modal({
    class: " modal-show",
    header: h("div", null,
    h("button", { class: "btn red" }, "delete"),
    h("button", { class: "btn" }, "edit"),
      "Task #ID " + state.taskToShow.id
    ),
    body: [
      h("div", { class: "title" }, state.taskToShow.title),
      h("div", { class: "text" }, state.taskToShow.text)
    ],
    footer: [
      h("button", {
        class: "btn",
        onclick: () => actions.showTask(null)
      }, "Close")
    ]
  })
}

function TaskMoveModal(task, state, actions) {
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
                  tasks.child(state.taskToMove.uid).set({
                    text: state.taskToMove.text,
                    type: state.taskToMove.type,
                    board: board.id,
                    id: state.taskToMove.id
                  })
                  actions.taskToMove(null)
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

function TaskDeleteModal(task, state, actions) {
  return h("div", { class: "modal" },
    h("div", { class: "content" },
      h("div", { class: "header" }, "Delete task #ID" + state.taskToDelete.id),
      h("div", { class: "body" },
        "Are you sure to delete task #ID" + state.taskToDelete.id + "?"),
      h("div", { class: "footer" },
        h("button", {
          class: "btn",
          onclick: () => actions.deleteTask(null)
        }, "No"),
        h("button", {
          class: "btn",
          onclick: () => {
            tasks.child(state.taskToDelete.uid).remove()
            actions.deleteTask(null)
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
    state.taskToEdit && TaskEditModal(state, actions),
    state.taskToShow && TaskShowModal(state, actions),
    state.taskToMove && TaskMoveModal(state, actions),
    state.taskToDelete && TaskDeleteModal(state, actions)
  )
}

let main = app(state, actions, Layout, document.body)

ref.on("value", snapshot => {
  let data = snapshot.val()
  if (data == null) {
    boards.push({ id: 1, title: "To Do", color: "peter-river" })
    boards.push({ id: 2, title: "Doing", color: "carrot" })
    boards.push({ id: 3, title: "Done", color: "emerald" })
    types.push({ id: 1, title: "User Story", color: "green-sea" })
    types.push({ id: 2, title: "Defect", color: "orange" })
    types.push({ id: 3, title: "Task", color: "belize-hole" })
    types.push({ id: 4, title: "Feature", color: "pomegranate" })
  } else {
    main.setData(data)
  }
})
