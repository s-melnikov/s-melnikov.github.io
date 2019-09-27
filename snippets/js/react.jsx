export const REQUEST_METHOD_POST = 'POST';
export const REQUEST_METHOD_PUT = 'PUT';

export function createSimpleRESTMutation({ path = '', name = '', method = REQUEST_METHOD_POST }) {
  const mutation = data => request({ path, data, method });
  const SimpleRESTMutation = ({ children, render }) => (render || children)(mutation);
  SimpleRESTMutation.displayName = `SimpleRESTMutation${name}`;
  return SimpleRESTMutation;
}

export function createSimpleRESTQuery({ path = '', name = '', mapPropsToVars, mapDataToProps = identity }) {
  const CACHE = {};

  class SimpleRESTQuery extends Component {
    state = {
      loading: true,
      error: false,
      data: null,
    }

    componentDidMount() {
      this.shouldFetch();
    }

    componentDidUpdate() {
      this.shouldFetch();
    }

    compareVariables({ variables, ...props }) {
      const query = toQueryString(mapPropsToVars ? mapPropsToVars(props) : variables);
      if (query === this.query) {
        return false;
      }
      this.query = query;
      return true;
    }

    shouldFetch() {
      if (!this.compareVariables(this.props)) return;
      const cache = CACHE[this.query];
      if (cache) {
        return this.setState({ data: cache, loading: false });
      }
      this.fetch();
    }

    async fetch() {
      console.warn(`SimpleRESTQuery${name}:fetch()`);
      this.setState({ loading: true, error: false });
      try {
        const { error, data } = await request({ path: `${path}${this.query}` });
        if (error) {
          throw Error(error);
        } else {
          CACHE[this.query] = mapDataToProps({ data });
          this.setState({ data: CACHE[this.query] });
        }
      } catch (error) {
        this.setState({ error: true });
      }
      this.setState({ loading: false });
    }

    render() {
      const { render, children } = this.props;
      const { loading, error, data } = this.state;
      return (render || children)({ loading, error, ...data });
    }
  }
  SimpleRESTQuery.displayName = `SimpleRESTQuery${name}`;
  return SimpleRESTQuery;
}