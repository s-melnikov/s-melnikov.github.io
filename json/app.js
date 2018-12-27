const {app, h} = hyperapp

const div = (prop, ...children) => h("div", prop, ...children)

const Main = () => div(null, "Hello world!")

app({
  json: null
}, {
  setJSON: data => ({json: data})
}, Main, document.querySelector("#root"))