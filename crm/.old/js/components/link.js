define("components/link", ["utils"], (Utils) => {
  const { h, Component } = preact;
  const { getCurrentPath } = Utils;

  class Link extends Component {
    constructor(props) {
      super(props);
      this.hashChangeHandlerBinded = this.hashChangeHandler.bind(this);
    }
    componentWillMount() {
      addEventListener("hashchange", this.hashChangeHandlerBinded);
    }
    componentWillUnmount() {
      removeEventListener("hashchange", this.hashChangeHandlerBinded);
    }
    hashChangeHandler() {
      this.forceUpdate();
    }
    render() {
      let { children, to, activeClass, onclick } = this.props;
      let href = "#!" + to;
      let _active = to == getCurrentPath() ? (activeClass || "active ") : "";
      return h("a", { href, onclick, class: _active + this.props.class }, children);
    }
  }

  return Link;
});