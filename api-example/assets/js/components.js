let Components = {}

Components.Toast = (toast, remove) => h("div", {
    class: "mt-5 toast toast-" + toast.type
  },
  remove ?
    h("button", {
      class: "btn btn-clear float-right",
      onclick: () => remove(toast)
    }) : null,
  toast.text
)