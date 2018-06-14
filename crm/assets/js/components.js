const Loader = () => h("div", { class: "loader" });

// define("components", [
//   "utils",
//   "components/router",
//   "components/link"
//   ], (Utils, Router, Link) => {
//   const { h, Component } = preact;
//   const { db } = Utils;

//   const DescriptionList = props => {
//     return h("div", {
//         class: "description-list" + (props.class ? (" " + props.class) : "")
//       },
//       props.list.map(item => item && h("dl", null,
//         h("dt", null, item[0]),
//         h("dd", null, item[1])
//       ))
//     );
//   }

//   const ItemsList = ({ items, iterator }) => {
//     if (!items) return h(Loader);
//     if (!items.length) return h("span", null, "no items");
//     return h("div", { class: "items-list" }, items.map(iterator));
//   }

//   class Redirect extends Component {
//     componentDidMount() {
//       setTimeout(() => location.hash = "!" + this.props.to);
//     }
//   }

//   class EmployeesShortList extends Component {
//     componentWillMount() {
//       let { where } = this.props;
//       db.collection("employees").find(where).then(employees => {
//         this.setState({ employees });
//       });
//     }
//     render() {
//       let { employees } = this.state;
//       return employees ?
//         h(ItemsList, {
//           items: employees,
//           iterator: employee => h("div", null,
//             h(Link, { to: "/employees/" + employee.uid },
//               employee.first_name + " " + employee.last_name)
//           )
//         }) :
//         h(Loader);
//     }
//   }

//   return {
//     Loader,
//     DescriptionList,
//     ItemsList,
//     Router,
//     Link,
//     Redirect,
//     EmployeesShortList
//   };
// });