const { h, app } = hyperapp;
const ONPAGE = 25;
const State = {
  items: [],
  count: ONPAGE,
  path: []
};
const Actions = {
  init: () => (state, actions) => {
    actions.setHash();
    fetch("data.json").then(resp => resp.json())
      .then(items => actions.setItems(items.map(item => {
        item.tags = item.tags.map(tag => tag.toLowerCase())
        return item;
      })));
  },
  setHash: () => ({ path: location.hash.slice(2).split("/"), count: ONPAGE }),
  setItems: items => ({ items }),
  more: () => state => ({ count: state.count + ONPAGE })
};
const View = (state, actions) => h("div", { id: "app" },
  h("input", { class: "search", type: "search", placeholder: "Search...",
    value: state.path[0] == "search" ? state.path[1] : "",
    oninput: event => {
      location.hash = "/search/" + event.target.value
    }}, state.search),
  itemsView(state, actions)
);
const itemsView = (state, actions) => {
  let items = state.items;
  let input = (state.path[1] || "").toLowerCase();
  switch (state.path[0]) {
    case "search":
      items = state.items.filter(item => item.name.toLowerCase().indexOf(input) > -1)
        .concat(state.items.filter(item => item.description.toLowerCase().indexOf(input) > -1));
      break;
    case "tag":
      items = state.items.filter(item => input ? item.tags.indexOf(input) > -1 : true);
      break;
  }
  return h("div", { class: "items" },
    state.path[0] == "search" && input ? h("div", { class: "result" },
      "Search results: \"" + input + "\" ",
      h("a", { class: "remove", href: "#", innerHTML: "&times;" })
    ) : null,
    state.path[0] == "tag" && input ? h("div", { class: "result" },
      "Search results by tag: \"" + input + "\" ",
      h("a", { class: "remove", href: "#", innerHTML: "&times;" })
    ) : null,
    items.slice(0, state.count).map(item => h("div", { class: "item" },
        h("div", { class: "title" },
          h("a", { class: "name", href: item.url, target: "_blank" }, item.name),
          h("small", { class: "size" }, item.size)
        ),
        h("div", { class: "description" }, item.description),
        h("div", { class: "tags" },
          item.tags.map(tag => {
            tag = tag.toLowerCase();
            return [h("a", { href: "#/tag/" + tag }, "#" + tag), " "];
          })
        ),
      )
    ),
    items.length > state.count ?
      h("span", { class: "more", onclick: actions.more }, "More...") : null
  );
}
const { init, setHash } = app(State, Actions, View, document.querySelector("#main"));
window.addEventListener("hashchange", setHash)
init();