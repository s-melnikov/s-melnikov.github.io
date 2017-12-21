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

if (location.hash.length < 16) {
  location.hash = uniqid()
  location.reload()
}

firebase.initializeApp({
  databaseURL: "https://kanban-1c4b8.firebaseio.com"
})

let { h, app } = hyperapp,
  database = firebase.database(),
  uid = location.hash.slice(1),
  ref = database.ref(uid),
  boards = ref.child("boards"),
  items = ref.child("items"),
  types = ref.child("types"),
  lastItemId = 0

let state = {
  boards: [],
  items: [],
  types: [],
  itemEditModal: null,
  itemMoveModal: null,
  itemDeleteModal: null
}

let actions = {
  setData: data => (state, actions) => {
    let newState = {
      boards: data.boards ? Object.keys(data.boards).map(uid => {
        data.boards[uid].uid = uid
        return data.boards[uid]
      }) : [],
      items: data.items ?  Object.keys(data.items).map(uid => {
        data.items[uid].uid = uid
        return data.items[uid]
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
  itemEditModal: data => {
    return { itemEditModal: data }
  },
  itemMoveModal: data => {
    return { itemMoveModal: data }
  },
  itemDeleteModal: data => {
    return { itemDeleteModal: data }
  }
}

let view = (state, actions) => {
  return h("div", { class: "container" },
    h("div", { class: "boards" },
      state.boards.map(board => {
        return h("div", { class: "board" },
          h("div", { class: "header bg-" + board.color },
            h("span", null, board.title)
          ),
          h("div", { class: "body" },
            state.items
              .filter(item => item.board == board.id)
              .map(item => {
                return h("div", { class: "item" },
                  h("div", { class: "text" }, item.title),
                  h("div", { class: "label bg-" + state.colors[item.type] }),
                  h("div", { class: "footer" },
                    h("span", { class: "time" }, new Date(item.time).toDateString()),
                    h("span", {
                      onclick: () => actions.itemEditModal(item)
                    }, "edit"),
                    h("span", {
                      onclick: () => actions.itemMoveModal(item)
                    }, "move"),
                    h("span", {
                      onclick: () => actions.itemDeleteModal(item)
                    }, "delete")
                  )
                )
              })
          ),
          h("div", { class: "footer" },
            h("span", {
              class: "btn btn-link",
              onclick: () => actions.itemEditModal({
                board_id: board.id
              })
            }, "new task")
          )
        )
      })
    ),

    state.itemEditModal && h("div", { class: "modal modal-edit" },
      h("form", {
        class: "content",
        onsubmit: event => {
          event.preventDefault()
          let title = event.target.elements.title.value.trim()
          let text = event.target.elements.text.value.trim()
          if (text && title) {
            if (state.itemEditModal.uid) {
              items.child(state.itemEditModal.uid).set({
                text,
                title,
                type: parseInt(event.target.elements.type.value),
                board: state.itemEditModal.board,
                id: state.itemEditModal.id
              })
            } else {
              items.push({
                id: ++lastItemId,
                text,
                title,
                board: state.itemEditModal.board_id,
                type: parseInt(event.target.elements.type.value),
                time: Date.now()
              })
            }
            event.target.reset()
            actions.itemEditModal(null)
          }
        },
        onreset: event => actions.itemEditModal(null)
      },
        h("div", { class: "header" }, state.itemEditModal.id ?
            "Edit item #ID" + state.itemEditModal.id : "Create new item"
        ),
        h("div", { class: "body" },
          h("input", { name: "title", placeholder: "Title..." }, state.itemEditModal.title || ""),
          h("textarea", { name: "text", placeholder: "Content..." }, state.itemEditModal.text || ""),
          h("div", { class: "types" },
            state.types.map((type, i) => {
              return h("label", { class: "type" },
                h("input", {
                  type: "radio",
                  name: "type",
                  value: type.id,
                  checked: state.itemEditModal.type ?
                    state.itemEditModal.type == type.id : !i
                }),
                h("span", { class: "label bg-" + type.color }),
                h("span", { class: "title" }, type.title)
              )
            })
          )
        ),
        h("div", { class: "footer" },
          h("button", {
            class: "btn",
            type: "reset"
          }, "Close"),
          h("button", { class: "btn" }, "Submit"),
        )
      )
    ),

    state.itemMoveModal && h("div", { class: "modal" },
      h("div", { class: "content" },
        h("div", { class: "header" }, "Move item #ID" + state.itemMoveModal.id),
        h("div", { class: "body" },
          h("div", { class: "boards-list" },
            state.boards.map(board => {
              if (state.itemMoveModal.board == board.id) return null
              return h("label", { class: "board" },
                h("span", {
                  class: "title bg-" + board.color,
                  onclick: () => {
                    items.child(state.itemMoveModal.uid).set({
                      text: state.itemMoveModal.text,
                      type: state.itemMoveModal.type,
                      board: board.id,
                      id: state.itemMoveModal.id
                    })
                    actions.itemMoveModal(null)
                  },
                }, board.title)
              )
            })
          )
        ),
        h("div", { class: "footer" },
          h("button", {
            class: "btn",
            onclick: () => actions.itemMoveModal(null)
          }, "Close")
        )
      )
    ),

    state.itemDeleteModal && h("div", { class: "modal" },
      h("div", { class: "content" },
        h("div", { class: "header" }, "Delete item #ID" + state.itemDeleteModal.id),
        h("div", { class: "body" },
          "Are you sure to delete item #ID" + state.itemDeleteModal.id + "?"),
        h("div", { class: "footer" },
          h("button", {
            class: "btn",
            onclick: () => actions.itemDeleteModal(null)
          }, "No"),
          h("button", {
            class: "btn",
            onclick: () => {
              items.child(state.itemDeleteModal.uid).remove()
              actions.itemDeleteModal(null)
            }
          }, "Yes")
        )
      )
    )

  )
}

let main = app(state, actions, view, document.body)

ref.on("value", snapshot => {
    let data = snapshot.val()
    if (data == null) {
      boards.push({ id: 1, title: "To Do", color: "peter-river" })
      boards.push({ id: 2, title: "Doing", color: "carrot" })
      boards.push({ id: 3, title: "Done", color: "emerald" })
      boards.push({ id: 4, title: "Deffered", color: "asbestos" })
      types.push({ id: 1, title: "User Story", color: "green-sea" })
      types.push({ id: 2, title: "Defect", color: "orange" })
      types.push({ id: 3, title: "Task", color: "belize-hole" })
      types.push({ id: 4, title: "Feature", color: "pomegranate" })
    } else {
      console.log(data)
      main.setData(data)
    }
  })
