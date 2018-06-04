require(["main"], Main => {
  const { h, render } = preact;
  render(h(Main), document.body.querySelector("#root"));
});