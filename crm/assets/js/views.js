const { h } = hyperapp;
const ITEMS_PER_PAGE = 30;

const Loader = () => h("div", { class: "loader" });

const Link = (props, children) => {
  props.href = "#!" + props.to;
  delete props.to;
  if (location.hash.indexOf(props.href) === 0) {
    props.class = (props.class ? (props.class + " ") : "") + "active";
  }
  return h("a", props, children);
}

const BackLink = (props, children) => {
  props.onclick = event => {
    event.preventDefault();
    history.back();
  }
  return h("a", props, children);
}

const Pagination = ({ path, current, length, per_page }) => {
  current = parseInt(current) || 1;
  let max_pages = Math.ceil(length / per_page);
  let buttons = [];
  let is_current = current == 1;
  buttons.push(h("a", {
    class: "btn btn-link" + (is_current ? " current" : ""),
    href: is_current ? null : ("#!" + path + (current - 1))
  }, "Prev"));
  for (let i = 1; i <= max_pages; i++) {
    is_current = current == i;
    buttons.push(h("a", {
      class: "btn btn-link" + (is_current ? " current" : ""),
      href: is_current ? null : ("#!" + path + i)
    }, i));
  }
  is_current = current == max_pages;
  buttons.push(h("a", {
    class: "btn btn-link" + (is_current ? " current" : ""),
    href: is_current ? null : ("#!" + path + (current + 1))
  }, "Next"));
  return h("div", { class: "pagination" }, buttons);
}


const PageDelete = () => h("div", null, "PageDelete");
const PageNotFound = () => h("div", null, "PageNotFound");