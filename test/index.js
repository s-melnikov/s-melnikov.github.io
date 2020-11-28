import { render, h } from "./r.js";

((async () => {
  const { default: App } = await import("./App.js");
  render(h(App), document.getElementById("root"));
})());
