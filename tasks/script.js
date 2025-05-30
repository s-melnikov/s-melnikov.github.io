import { app, h } from "/hyperapp.js";

const STORAGE = "tasks";

class Store {
  constructor(name) {
    this.name = name;
    this.data = JSON.parse(localStorage[this.name] || "{}");
  }
  get() {
    return this.data;
  }
  set(patch) {
    this.data = { ...this.data, ...patch };
    localStorage[this.name] = JSON.stringify(this.data);
  }
}

const store = new Store(STORAGE);

const Main = () => () => {
  return div({}, [
    div({}, "Active:"),
    List(),
    div({}, "＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿"),
    div({}, "Archive:"),
    List({ archived: true }),
  ]);
}

const List = ({ archived } = {}) => {
  return ({ tasks }) => {
    const list = tasks.filter((task) => task.archived === archived);
    return div({ class: "list" },
      !list.length && !archived ? Task() : list.map((task) => Task({ task }))
    );
  }
}

const Task = ({ task = {} } = {}) => {
  const { id, completed, text } = task;

  let textarea;

  return (state, actions) => {
    return div({
      class: "task" + (completed ? " completed" : ""),
      onclick: (e) => textarea.focus()
    },
      div({ class: "checkbox", onclick: () => {} }, completed ? "[✔]" : "[ ]"),
      div({ class: "wrapper" },
        div({ class: "text" }, text),
        h("input", {
          value: text,
          oncreate: (element) => textarea = element,
          oninput: (e) => actions.editTask({ id, text: e.target.value }),
          onkeydown: (e) => {
            log(e.keyCode)
            switch (e.keyCode) {
              case 13:
                if (e.metaKey || e.ctrlKey) {
                  e.preventDefault();
                  console.log({ id });
                  actions.addTask({ afterId: id });
                }
                break;
              case 68:
                if (e.metaKey || e.ctrlKey) {
                  e.preventDefault();
                  actions.editTask({ id, completed: !completed });
                }
                break;
            }
          }
        }),
      ),
      completed ? div({ class: "done" }, `@done(2025-05-01 15:57)`) : null
    );
  }
}

function init() {
  app(getInitialState(), getActions(), Main(), document.getElementById("root"));
}

function getInitialState() {
  const { tasks = [] } = store.get();
  return { tasks };
}

function getActions() {
  const editTask = (data) => ({ tasks }) => {
    const newTasks = data.id
      ? tasks.map((task) => task.id === data.id ? { ...task, ...data } : task)
      : [createNewTask(data), ...tasks];

    store.set({ tasks: newTasks });

    return { tasks: newTasks };
  };
  const addTask = ({ afterId, ...data }) => ({ tasks }) => {
    const newTasks = [...tasks];

    const afterIndex = afterId ? tasks.findIndex((task) => task.id === afterId) : tasks.length;

    newTasks.splice(afterIndex + 1, 0, createNewTask(data));

    store.set({ tasks: newTasks });
    return { tasks: newTasks }
  };
  return {
    addTask,
    editTask,
  };
}

function createNewTask({ text }) {
  return {
    text,
    completed: false,
    id: `a${Date.now().toString(36)}`,
    createdAt: Date.now(),
  };
}

function div(...args) {
  return h("div", ...args);
}

function log(...args) { console.log(...args) }

init();
