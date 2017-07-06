# [hyperapp](https://hyperapp.glitch.me)
[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp/master.svg)](https://travis-ci.org/hyperapp/hyperapp)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp/master.svg)](https://codecov.io/gh/hyperapp/hyperapp)
[![npm](https://img.shields.io/npm/v/hyperapp.svg?colorB=09e5f9)](https://www.npmjs.org/package/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

HyperApp - это JavaScript библиотека для построения браузерных приложений.

[Elm Архитектуре]: https://guide.elm-lang.org/architecture/
[Hyperx]: https://github.com/substack/hyperx
[JSX]: https://facebook.github.io/react/docs/introducing-jsx.html
[CDN]: https://unpkg.com/hyperapp

* **Декларативность**: дизайн HyperApp базируется на [Elm Архитектуре]. Создание масштабируемых приложений на основе браузера с использованием функциональной парадигмы.
* **Настраиваемые теги**: создание сложных пользовательских интерфейсов из пользовательских тегов. Пользовательские теги являются независимыми, не зависящими от платформы и простыми для отладки.
* **Batteries-included**: из коробки HyperApp имея Elm-подобное управление состоянием и механизм виртуального DOM, весит всего `1kb` и не имеет зависимостей.

[Начните с HyperApp]()

Пример.

[Демо](https://codepen.io/hyperapp/pen/zNxZLP?editors=0010)

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.add}>+</button>
      <button onclick={actions.sub}>-</button>
    </main>
  ),
  actions: {
    add: state => state + 1,
    sub: state => state - 1
  }
})
```

## Вопросы

Нет програмного обеспечения без ошибок. Если вы нашли что либо, что по вашемо мнению является багом - [оставьте сообщение об ошибке](https://github.com/hyperapp/hyperapp/issues). Также приветствуются вопросы, отзывы и предложения.

## Сообщество

* [Slack](https://hyperappjs.herokuapp.com)
* [/r/hyperapp](https://www.reddit.com/r/hyperapp)
* [Twitter](https://twitter.com/hyperappjs)

## Лицензия

HyperApp распростроняется под лицензией MIT. Подробнее [LICENSE](LICENSE.md).

# Документация

Мы предполагаем что у вас уже есть некие познания в HTML и JavaScript. Если же вы только собираетесь изучать фронтенд, мы предлагаем вернуться к изучению этой библиотеки после того как вы изучите основы. Опыт работы с другими фреймворками будет плюсом, но он не обязателен.

# Начало

## Hello World

Начнем с простейших программ. Вставьте следующий код в новый файл HTML и откройте его в браузере. Или [попробуйте онлайн](https://codepen.io/hyperapp/pen/PmjRov?editors=1010).

```html
<body>
<script src="https://unpkg.com/hyperapp"></script>
<script>

const { h, app } = hyperapp

app({
  state: "Hi.",
  view: state => h("h1", null, state)
})

</script>
</body>
```

Состояние (state) представляет данные приложения.

```js
state: "Hi."
```

В представлении (view) описывается пользовательский интерфейс.

```js
state => h("h1", null, state) // <h1>Hi.</h1>
```

[Hyperx]: /docs/hyperx.md
[JSX]: /docs/jsx.md

Для создания пользовательского интерфейса используется служебная функция [h(tag, data, children)](/docs/api.md#h), возвращающая дерево [виртуальных узлов](/docs/core.md#virtual-nodes)

```js
{
  tag: "h1",
  data: null,
  children: ["Hi"]
}
```

Можно также описать представления в [JSX] или [Hyperx] разметке, используя [сборщик](#build-pipeline).

```jsx
state => <h1>{state}</h1>
```

Функция [app(props)](/docs/api.md#app) объединяет все вместе и отображает представление на странице.

## Установка

Вы можете скачать минифицированую версию библиотеки с [CDN](https://unpkg.com/hyperapp).

```html
<script src="https://unpkg.com/hyperapp"></script>
```

[npm]: https://www.npmjs.com
[Yarn]: https://yarnpkg.com

Или использовать [npm]/[Yarn].

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

## Usage

HyperApp доступен в глобальной области при использовании тега `<script>`

```js
const { h, app } = hyperapp
```

Или можно использовать ES6/ES5, установив [сборщик]().

```jsx
import { h, app } from "hyperapp"
```

## Сборка

Сборщик может быть разной сложности, но обычно состоит из диспетчера пакетов, компилятора и пакета.

Используя сборщик, можно преобразовать Hyperx/JSX разметку в вызов функции [h(tag, data, children)]() перед выполнением. Это намного быстрее, чем анализ и компиляция отображения в браузере.

Hyperx/JSX:

```jsx
<main id="app">Hi.</main>
```

Чистый js:

```jsx
h("main", { id: "app" }, "Hi.")
```

Инструкции по установке сборщика содержатся в [Hyperx] или [JSX].

# Hyperx

## About Hyperx

[Hyperx](https://github.com/substack/hyperx) представляет собой стандартную фабрику, совместимую с ES6 [тегированными шаблонными строками](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals). Это чистая альтернатива [JSX]

В Hyperx это используется так:

```js
const hyperx = require("hyperx")
const html = hyperx(h)

const main = html`
  <div>
    <h1>Hello.</h1>
    <button onclick=${() => alert("Hi")}>Click</button>
  </div>`
```

## Установка

We'll use [Hyperxify](https://github.com/substack/hyperxify) to transform Hyperx into [h()](/docs/h.md#h) function calls and a bundler to create a single file we can deliver to the browser.

The ES6 import syntax is incompatible with Hyperxify, so we'll use the Node.js require function.

In a new directory, create an <samp>index.html</samp> file:

```html
<!doctype html>
<html>

<body>
  <script src="bundle.js"></script>
</body>

</html>
```

And and <samp>index.js</samp> file:

```js
const { h, app } = require("hyperapp")
const hyperx = require("hyperx")
const html = hyperx(h)

app({
  state: "Hi.",
  view: state => html`<h1>${state}</h1>`
})
```

Install dependencies:
<pre>
npm i -S <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

### [Browserify](https://gist.github.com/jbucaran/48c1edb4fb0ea1aa5415b6686cc7fb45 "Get this gist")

Install development dependencies:
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/browserify">browserify</a> \
  <a href="https://www.npmjs.com/package/hyperx">hyperx</a> \
  <a href="https://www.npmjs.com/package/hyperxify">hyperxify</a> \
  <a href="https://www.npmjs.com/package/babelify">babelify</a> \
  <a href="https://www.npmjs.com/package/uglifyify">uglifyify</a> \
  <a href="https://www.npmjs.com/package/bundle-collapser">bundle-collapser</a> \
  <a href="https://www.npmjs.com/package/uglify-js">uglify-js</a>
</pre>

Create a <samp>.babelrc</samp> file:

```
{
  "presets": ["es2015"]
}
```

Bundle the application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/browserify \
  -t hyperxify \
  -t babelify \
  -g uglifyify \
  -p bundle-collapser/plugin index.js | uglifyjs > bundle.js
</pre>

### [Webpack](https://gist.github.com/jbucaran/c6a6bdb5383a985cec6b0ae4ebe5a4b1 "Get this gist")

Install development dependencies:
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/hyperx">hyperx</a> \
  <a href="https://www.npmjs.com/package/hyperxify">hyperxify</a> \
  <a href="https://www.npmjs.com/package/webpack">webpack</a> \
  <a href="https://www.npmjs.com/package/transform-loader">transform-loader</a> \
  <a href="https://www.npmjs.com/package/babel-core">babel-core</a> \
  <a href="https://www.npmjs.com/package/babel-loader">babel-loader</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a>
</pre>

Create a <samp>.babelrc</samp> file:
```js
{
  "presets": ["es2015"]
}
```

Create a <samp>webpack.config.js</samp> file:

```jsx
module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader!transform-loader?hyperxify"
      }
    ]
  }
}
```

Bundle the application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/webpack -p
</pre>

### [Rollup](https://gist.github.com/jbucaran/fac2c3de24e5171596fb189f9c1feb8e "Get this gist")

Install development dependencies:

<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/babel-preset-es2015-rollup">babel-preset-es2015-rollup</a> \
  <a href="https://www.npmjs.com/package/hyperx">hyperx</a> \
  <a href="https://www.npmjs.com/package/hyperxify">hyperxify</a> \
  <a href="https://www.npmjs.com/package/rollup">rollup</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-browserify-transform">rollup-plugin-browserify-transform</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-buble">rollup-plugin-buble</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-commonjs">rollup-plugin-commonjs</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-node-resolve">rollup-plugin-node-resolve</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-uglify">rollup-plugin-uglify</a>
</pre>


Create a <samp>rollup.config.js</samp> file:

```jsx
import buble from "rollup-plugin-buble"
import resolve from "rollup-plugin-node-resolve"
import uglify from "rollup-plugin-uglify"
import browserify from "rollup-plugin-browserify-transform"
import hyperxify from "hyperxify"
import cjs from "rollup-plugin-commonjs"

export default {
  moduleName: "window",
  plugins: [
    browserify(hyperxify),
    buble(),
    cjs(),
    resolve({
      module: false
    }),
    uglify()
  ]
}
```

Bundle the application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/rollup -cf iife -i index.js -o bundle.js
</pre>

# JSX

## About JSX

[JSX](https://facebook.github.io/jsx/) is an XML-like syntax extension to ECMAScript. It allows you to mix HTML and JavaScript.

JSX is not part of the ECMAScript standard, but using the appropriate tooling we can compile our JavaScript/JSX code into JavaScript browsers understand.

JSX looks like this:

```jsx
<div>
  <h1>Hello.</h1>
  <button onclick={() => alert("Hi")}>Click</button>
</div>
```

For an in-depth introduction to JSX, see the official [documentation](https://facebook.github.io/react/docs/introducing-jsx.html).

## Setup

We'll use a compiler to transform JSX into [h(tag, data, children)](/docs/api.md#h) function calls and a bundler to create a single file we can deliver to the browser.

In a new directory, create an <samp>index.html</samp> file:

```html
<!doctype html>
<html>

<body>
<script src="bundle.js"></script>
</body>

</html>
```

And an <samp>index.js</samp> file:

```jsx
import { h, app } from "hyperapp"

app({
  state: "Hi.",
  view: state => <h1>{state}</h1>
})
```

Install dependencies:
<pre>
npm i -S <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>

### [Browserify](https://gist.github.com/jbucaran/21bbf0bbb0fe97345505664883100706 "Get this gist")

Install development dependencies:
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a> \
  <a href="https://www.npmjs.com/package/babelify">babelify</a> \
  <a href="https://www.npmjs.com/package/browserify">browserify</a> \
  <a href="https://www.npmjs.com/package/bundle-collapser">bundle-collapser</a> \
  <a href="https://www.npmjs.com/package/uglifyify">uglifyify</a> \
  <a href="https://www.npmjs.com/package/uglifyjs">uglifyjs</a>
</pre>

Create a <samp>.babelrc</samp> file:

```js
{
  "presets": ["es2015"],
    "plugins": [
      [
        "transform-react-jsx",
        {
          "pragma": "h"
        }
      ]
    ]
}
```

Bundle the application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/browserify \
  -t babelify \
  -g uglifyify \
  -p bundle-collapser/plugin index.js | uglifyjs > bundle.js
</pre>

### [Webpack](https://gist.github.com/jbucaran/6010a83891043a6e0c37a3cec684c08e "Get this gist")

Install development dependencies:
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/webpack">webpack</a> \
  <a href="https://www.npmjs.com/package/babel-core">babel-core</a> \
  <a href="https://www.npmjs.com/package/babel-loader">babel-loader</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a> \
  <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a>
</pre>

Create a <samp>.babelrc</samp> file:
```js
{
  "presets": ["es2015"],
    "plugins": [
      [
        "transform-react-jsx",
        {
          "pragma": "h"
        }
      ]
    ]
}
```

Create a <samp>webpack.config.js</samp> file:

```js
module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  }
}
```

Bundle the application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/webpack -p
</pre>

### [Rollup](https://gist.github.com/jbucaran/0c0da8f1256a0a66090151cfda777c2c "Get this gist")

Install development dependencies:
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/rollup">rollup</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-babel">rollup-plugin-babel</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-node-resolve">rollup-plugin-node-resolve</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-uglify">rollup-plugin-uglify</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015-rollup">babel-preset-es2015-rollup</a> \
  <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a>
</pre>


Create a <samp>rollup.config.js</samp> file:

```jsx
import babel from "rollup-plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import uglify from "rollup-plugin-uglify"

export default {
  plugins: [
    babel({
      babelrc: false,
      presets: ["es2015-rollup"],
      plugins: [
        ["transform-react-jsx", { pragma: "h" }]
      ]
    }),
    resolve({
      jsnext: true
    }),
    uglify()
  ]
}
```

Bundle the application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/rollup -cf iife -i index.js -o bundle.js
</pre>

# Core Concepts

## Virtual Nodes

A virtual node is an object that describes an HTML/DOM tree.

It consists of a tag, e.g. <samp>div</samp>, <samp>svg</samp>, etc., data attributes and an array of child nodes.

```js
{
  tag: "div",
  data: {
    id: "app"
  },
  children: [{
    tag: "h1",
    data: null,
    children: ["Hi."]
  }]
}
```

The virtual DOM engine consumes a virtual node and produces an HTML tree.

```html
<div id="app">
  <h1>Hi.</h1>
</div>
```

You can use the [h(tag, data, children)](/docs/api.md#h) utility function to create virtual nodes.

```js
h("div", { id: "app" }, [
  h("h1", null, "Hi.")
])
```

Or setup a build pipeline and use [Hyperx](/docs/hyperx.md) or [JSX](/docs/jsx.md) instead.

### Data Attributes

Any valid HTML [attributes/properties](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [events](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers), [styles](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference), etc.

```js
data: {
  id: "myButton",
  class: "PrimaryButton",
  onclick: () => alert("Hi."),
  disabled: false,
  style: {
    fontSize: "3em"
  }
}
```

Attributes also include [lifecycle events](/docs/lifecycle-events.md) and meta data such as [keys](/docs/keys.md).

## Applications

Use the [app(props)](/docs/api.md#app) function to create an application.

```jsx
app({
  view: () => <h1>Hi.</h1>
})
```

The app function renders the given view and appends it to [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body).

To mount the application on a different element, use the [root](/docs/api.md#root) property.

```jsx
app({
  view: () => <h1>Hi.</h1>,
  root: document.getElementById("app")
})
```

### View and State

The [view](/docs/api.md#view) is a function of the state. It is called every time the state is modified to rebuild the application's [virtual node](/docs/core.md#virtual-nodes) tree, which is used to update the DOM.

```jsx
app({
  state: "Hi.",
  view: state => <h1>{state}</h1>
})
```

Use the [state](/docs/api.md#state) to describe your application's data model.

```jsx
app({
  state: ["Hi", "Hola", "Bonjour"],
  view: state => (
    <ul>
      {state.map(hello => <li>{hello}</li>)}
    </ul>
  )
})
```

### Actions

Use [actions](/docs/api.md#actions) to update the state.

```jsx
app({
  state: "Hi.",
  view: (state, actions) => (
    <h1 onclick={actions.ucase}>{state}</h1>
  ),
  actions: {
    ucase: state => state.toUpperCase()
  }
})
```

To update the state, an action must return a new state or a part of it.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOne}>+1</button>
    </main>
  ),
  actions: {
    addOne: state => state + 1
  }
})
```

You can pass data to actions as well.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button
        onclick={() => actions.addSome(1))}>More
      </button>
    </main>
  ),
  actions: {
    addSome: (state, actions, data = 0) => state + data
  }
})
```

Actions are not required to have a return value. You can use them to call other actions, for example after an asynchronous operation has completed.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOneDelayed}></button>
    </main>
  ),
  actions: {
    addOne: state => state + 1,
    addOneDelayed: (state, actions) => {
      setTimeout(actions.addOne, 1000)
    }
  }
})
```

An action may return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This enables you to use [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

```jsx
const delay = seconds =>
  new Promise(done => setTimeout(done, seconds * 1000))

app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOneDelayed}>+1</button>
    </main>
  ),
  actions: {
    addOne: state => state + 1,
    addOneDelayed: async (state, actions) => {
      await delay(1)
      actions.addOne()
    }
  }
})
```

#### Namespaces

Namespaces let you organize actions into categories and help reduce name collisions as your application grows larger.

```jsx
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <button onclick={actions.counter.add}>+</button>
      <h1>{state}</h1>
      <button onclick={actions.counter.sub}>-</button>
    </main>
  ),
  actions: {
    counter: {
      add: state => state + 1,
      sub: state => state - 1
    }
  }
})
```

### Events

Use [events](/docs/api.md#events) to get notified when your application is completely loaded, an action is called, before a view is rendered etc.

```jsx
app({
  state: { x: 0, y: 0 },
  view: state => (
    <h1>{state.x + ", " + state.y}</h1>
  ),
  actions: {
    move: (state, { x, y }) => ({ x, y })
  },
  events: {
    loaded: (state, actions) =>
      addEventListener("mousemove", e =>
        actions.move({
          x: e.clientX,
          y: e.clientY
        })
      )
  }
})
```

Events can be used to hook into the update and render pipeline.

```jsx
app({
  view: state => <h1>Hi.</h1>,
  events: {
    render: (state, actions, data) => {
      if (location.pathname === "/warp") {
        return state => <h1>Welcome to warp zone!</h1>
      }
    }
  }
})
```

For a practical example see the implementation of the [Router](https://github.com/hyperapp/hyperapp/blob/master/src/router.js).

#### Custom Events

To create custom events, use the [emit(event, data)](/docs/api.md#emit) function. This function is passed as the last argument to actions/events.

```jsx
app({
  view: (state, actions) =>
    <button onclick={actions.fail}>Fail</button>,
  actions: {
    fail: (state, actions, data, emit) =>
      emit("error", "Fail")
  },
  events: {
    error: (state, actions, error) => {
      throw error
    }
  }
})
```

### Mixins

Use [mixins](/docs/api.md#mixins) to extend your application state, actions and events in a modular fashion.

```jsx
const Logger = () => ({
  events: {
    action: (state, actions, data) => console.log(data)
  }
})

app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOne}>+1</button>
    </main>,
  actions: {
    addOne: state => state + 1
  },
  mixins: [Logger]
})
```

# Keys

Every time your application is rendered, a virtual node tree is created from scratch.

Keys help identify which nodes were added, changed or removed from the new/old tree.

Use keys to tell the render algorithm to re-order the children instead of mutating them.

```jsx
<ul>
  {urls.map((url, id) => (
    <li key={id}>
      <img src={url} />
    </li>
  ))}
</ul>
```

Use keys also to force an element to be created only once.

```jsx
<ul>
  <li key="hyper">Hyper</li>
  <li>Super</li>
  <li>Ultra</li>
</ul>
```

If new elements are added to the list, the position of the keyed element will change.

Using a key in this way, we make sure <samp>hyper</samp> is always inserted at the right position instead of mutating its siblings for the same result.

# Custom Tags

A custom tag is a function that returns a custom [virtual node](/docs/core.md#virtual-nodes). Custom tags are similar to stateless components in other frameworks.

```js
function Link(props, children) {
  return h("a", { href: props.href }, children)
}

h("main", { id: "app" }, [
  Link({ href: "#" }, "Hi.")
])
```

Here is the generated virtual node.

```js
{
  tag: "main",
  data: {
    id: "app"
  },
  children: [{
    tag: "a",
    data: {
      href: "#"
    },
    children: ["Hi."]
  }]
}
```

## JSX

Custom tags and [JSX](/docs/jsx.md) integrate well together.

```jsx
<main id="app">
  <Link href="#">Hi.</Link>
</main>
```

If you don't know all the properties that you want to place on a custom element ahead of time, you can use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).

```jsx
const Link = (props, children) =>
  <a {...props}>{children}</a>
```

# Lifecycle Events

Lifecycle events are custom event handlers invoked at various points in the life of a [virtual node](/docs/core.md#virtual-nodes).

They are useful for starting animations, wrapping third party libraries that require a reference to a DOM element, etc.

## oncreate

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

Fired after an element is created and added to the DOM.

## onupdate

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

Fired when the element's data is updated.

## onremove

Type: ([element](https://developer.mozilla.org/en-US/docs/Web/API/Element))

Fired before the element is removed from the DOM.

Note that when using this event you are responsible for removing the element yourself.

```js
if (element.parentNode) {
  element.parentNode.removeChild(element);
}
```

## Example

This example shows how to create a [custom tag](/docs/custom-tags.md) to wrap the [CodeMirror](https://codemirror.net/) editor.

[Try it online](https://hyperapp-code-mirror.glitch.me)

```jsx
const node = document.createElement("div")
const editor = CodeMirror(node)

const Editor = props => {
  const setOptions = props =>
    Object.keys(props).forEach(key =>
      editor.setOption(key, props[key]))

  return (
    <div
      oncreate={element => {
        setOptions(props)
        element.appendChild(node)
      }}
      onupdate={() => setOptions(props)}
    />
  )
}
```

# Routing

## Usage

To add routing to your application, use the Router mixin.

```jsx
import { Router } from "hyperapp"
```

The router treats the view as an array of route/view pairs.

```jsx
app({
  view: [
    ["/", state => <h1>Hi.</h1>]
    ["*", state => <h1>404</h1>],
  ],
  mixins: [Router]
})
```

When the page loads or the browser fires a [popstate](https://developer.mozilla.org/en-US/docs/Web/Events/popstate) event, the first route that matches [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location) will be rendered.

Routes are matched in the order in which they are declared. To use the wildcard <samp>*</samp> correctly, it must be declared last.

|route                    | location.pathname    |
|-------------------------|-----------------------------------|
| <samp>/</samp>          | <samp>/</samp>
| <samp>/:foo</samp>      | Match <samp>[A-Za-z0-9]+</samp>. See [params](#params).
| <samp>*</samp>          | Match anything.

To navigate to a different route use [actions.router.go](#go).

## API

### state
#### params

Type: { <i>foo</i>: string, ... }

The matched route params.

|route                 |location.pathname    |state.router.params  |
|----------------------|---------------------|---------------------|
|<samp>/:foo</samp>    |/hyper               | { foo: "hyper" }    |

#### match

Type: string

The matched route.

### actions
#### go

Type: ([path](#router_go_path))
* path: string

Update [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location).

### events
#### route

Type: ([state](/docs/api.md#state), [actions](/docs/api.md#actions), [data](#events-data), [emit](/docs/api.md#emit)) | Array\<[route](#route)\>

* <a name="events-data"></a>data
  * [params](#params)
  * [match](#match)

Fired when a route is matched.

# Tutorials

In this page you can browse our catalog of tutorials. Tutorials provide narrative, step-by-step instruction of a variety of topics and scenarios that teach you how to use HyperApp without getting bogged down in details.

Some of the examples make use of new language features in JavaScript such as: [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator), [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) and [enhanced object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_Types#Enhanced_Object_literals). If you are unfamiliar with any of these concepts, click on the links to find out more.

- [Counter](/docs/counter.md)
- [Countdown Timer](/docs/countdown-timer.md)
- [Gif Search](/docs/gif-search.md)

# API

## h

[vnode]: /docs/core.md#virtual-nodes

Type: ([tag](#h-tag), [data](#h-data), [children](#h-children)): [vnode]

* <a name="h-tag"></a>tag: string | ([props](#h-data), [children](#h-children)): [vnode]
* <a name="h-data"></a>data: {}
* <a name="h-children"></a>children: string | Array\<[vnode]\>

## app

Type: ([props](#app-props))

* <a name="app-props"></a> props
  * [state](#state)
  * [view](#view)
  * [actions](#actions)
  * [events](#events)
  * [mixins](#mixins)
  * [root](#root)

### state

Type: any

### view

Type: ([state](#state), [actions](#actions)): [vnode]

### actions
#### <a name="actions-foo"></a>[namespace.]_foo_

Type: ([state](#state), [actions](#actions), [data](#actions-data), [emit](#emit))

* <a name="actions-data"></a> data: any

### events
#### loaded

Type: ([state](#state), [actions](#actions), _, [emit](#emit)) | Array\<[events](#loaded)\>

Fired after the view is mounted on the DOM.

#### action

Type: ([state](#state), [actions](#actions), [data](#action-data), [emit](#emit)): [data](#action-data) | Array\<[action](#action)\>

* <a name="action-data"></a>data
  * name: string
  * data: any

Fired before an action is triggered.

#### update

Type: ([state](#state), [actions](#actions), [data](#update-data), [emit](#emit)): [data](#update-data) | Array\<[update](#update)\>

* <a name="update-data"></a>data: the updated fragment of the state.

Fired before the state is updated.

#### render

Type: ([state](#state), [actions](#actions), [view](#view), [emit](#emit)): [view](#view) | Array\<[render](#render)\>

Fired before the view is rendered.

### mixins

Type: Array\<[Mixin](#mixins-mixin)\>

#### <a name="mixins-mixin"></a>Mixin

Type: ([props](#app-props)): [props](#mixin-props)

* <a name="mixin-props"></a>props
  * [mixins](#mixins)
  * [state](#state)
  * [actions](#actions)
  * [events](#events)

### root

Type: [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) = [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

## emit

Type: ([event](#emit-event), [data](#emit-data)): [data](#emit-data)

* <a name="emit-event"></a>event: string
* <a name="emit-data"></a>data: any