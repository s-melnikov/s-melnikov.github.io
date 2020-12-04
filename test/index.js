const { h, render, useState } = preact;

const Todo = ({ todo: { id, text } }) => {
  return h("li", null, text);
}

const TODOS = [
  { id: 0, text: "First" },
  { id: 1, text: "Second" },
  { id: 2, text: "Third" },
];
const Todos = () => {
  const [todos, setTodos] = useState(TODOS);
  const [text, setText] = useState("");
  const handleButtonClick = () => {
    setTodos([...todos, { id: Date.now(), text }]);    
    setText("");
    console.log(1);
  };

  return h(
    "div", 
    null,
    "Todos",
    h(
      "ul",
      null,
      todos.map((todo) => h(Todo, { key: todo.id, todo })),
    ), 
    h("input", { value: text, oninput: ({ target: { value } }) => setText(value) }),
    h("button", { onclick: handleButtonClick }, "Add"),  
  );
}

const App = () => {
  const [counter, setCounter] = useState(0);
  const handleButtonClick = () => setCounter(counter + 1);
  return h(
    "div", 
    null, 
    h("div", null, counter),
    h("button", { onclick: handleButtonClick }, "increase"),
    h("div", null, new Date().toLocaleTimeString()),
    h(Todos),
  );
};


render(h(App), document.getElementById("root"));
