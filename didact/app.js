const { h, render, Component } = didact;

class App extends Component {
  constructor() {
    super();
    this.state.counter = 0;
    this.state.name = "John Doe"
  }
  componentWillMount() {
    console.log("App:componentWillMount()");
  }
  componentDidMount() {
    console.log("App:componentDidMount()");
  }
  render() {
    return h("div", {
        class: "main-component"
      },
      "Hello " + this.state.name + "!",
      h("input", { type: "text", value: this.state.name, oninput: ({ target }) => { console.log(target.value) } })
    );
  }
}

render(h(App, { name: "John Doe" }), document.querySelector("#root"));