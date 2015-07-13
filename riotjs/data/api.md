
title: Riot API
date: Fri Feb 13 2015 14:41:52 GMT+0200

====

# Общее

### `riot.version`

Текущая версия Riot строкой: "<% version %>"


### `riot.settings.brackets`

Глобальная настройка Riot определяющая начальный и конечный символ выражений. Для примера:

```lang-javascript
riot.settings.brackets = '{{ }}'
```

дает возможность писать выражения следующим образом `<p>{{ like_this }}</p>`. Начинающие и завершающие символы должны быть разделены пробелом.

# Пользовательские теги

### `riot.mount(customTagSelector, [opts])`

Где

* `customTagSelector` выбирает элемент на странице и монтирует их при помощи пользовательского тега. Имя выбираемых элементов должны совпадать с именами пользовательских тегов.
* `opts` дополнительный объект который передается в теги по необходимости. Это может быть что угодно, от простого объекта и до полного API приложения. Или это может быть Flux- хранилище. На самом деле все зависит от структуры вашего клиентского приложения. Более подробно читайте в разделе [модульное приложение Riot](#guide/modulnost). 

```lang-javascript
// selects and mounts all <pricing> tags on the page
var tags = riot.mount('pricing')

// mount all custom tags with a class name .customer
var tags = riot.mount('.customer')

// mount <account> tag and pass an API object as options
var tags = riot.mount('account', api)
```

@возвращает: массив монтированых [экземпляров тегов](#api/ekzemplyar_tega)

### `riot.mount('*', [opts])`

Специальный селектор в Riot который используется для монтирования все пользовательских тегов на странице:

```lang-javascript
riot.mount('*')
```

### `riot.mount(selector, tagName, [opts])`

Где

* `selector` выбирает любой DOM узел на странице для монтирования тега
* `tagName` имя пользовательского тега для монтирования
* `opts` опциональный объект который передается в теги

```lang-javascript
// монтирует пользовательский тег "my-tag"
// к элементу #main с передачей api как опция
var tags = riot.mount('#main', 'my-tag', api)
```

@возвращает: массив монтированых [экземпляров тегов](#api/ekzemplyar_tega)

### `riot.mount(domNode, tagName, [opts])`

Монтирует пользовательский тег с именем tagName к переданному DOM узлу domNode. Передача опций opt - по желанию. Пример:

```lang-javascript
// монтировать "my-tag" к переданному DOM узлу
riot.mount(document.getElementById('slide'), 'users', api)
```

@возвращает: [экземпляро тега](#api/ekzemplyar_tega) который был монтирован на страницу

### `riot.mountTo(domNode, tagName, [opts])`

Устаревший метод начиная с версии v2.0.11. Это то же самое что и `riot.mount(domNode, tagName, [opts])`.

## Экземпляр тега

Следущие свойства устанавливаются для каждого экземпляра тега:

- `opts` - объект опций
- `parent` - родительский тег, если есть
- `root` - корневой узел DOM
- `tags` - вложенные пользовательские теги

Вы можете использовать эти свойства как в JavaScript, так и в HTML. Для примера:

```lang-markup
<my-tag>
  <h3>{ opts.title }</h3>

  var title = opts.title
</my-tag>
```

Вы можете свободно задавать любые данные для экземпляра (контекста) и они будут доступны в HTML. Пример:

```lang-markup
<my-tag>
  <h3>{ title }</h3>

  this.title = opts.title
</my-tag>
```

### Вложенные теги

Доступ к экземплярам вложенных тегов можно получить через переменную `tags`:
You have access to nested tag instances via `tags` variable:

``` html
<my-tag>

  <child></child>

  // доступ к дочернему тегу
  var child = this.tags.child

</my-tag>
```

Вы также можете использовать атрибут `name` для установки другого имени тегу.

``` html
<my-tag>

  <child name="my_nested_tag"></child>

  // доступ к дочернему тегу
  var child = this.tags.my_nested_tag

</my-tag>
```

Дочерние теги инициализируются после родительского тега, так что работу с методами и свойствами дочерних тегов можно начинать при событии "mount".

``` html
<my-tag>

  <child name="my_nested_tag"></child>

  // доступ к методам дочернего тега
  this.on('mount', function() {
    this.tags.my_nested_tag.someMethod()
  })

</my-tag>
```

### `this.update()`

Обновить все выражения для текущего тега, а также во всех дочерних тегах. Этот метод автоматически вызывается всякий раз, когда срабатывает обработчик события при взаимодействии пользователя с приложением.

Кроме этого, Riot не обновляет UI автоматически, поэтому вам надо вызвать этот метод вручную. Обычно такая ситуация происходит, когда отрабатывают события не связанные с UI: срабатывние `setTimeout`, вызов AJAX или какое либо серверное событие. Пример:

```lang-markup
<my-tag>

  <input name="username" onblur={ validate }>
  <span class="tooltip" show={ error }>{ error }</my-tag>

  var self = this

  validate() {
    $.get('/validate/username/' + this.username.value)
      .fail(function(error_message) {
        self.error = error_message
        self.update()
      })
  }
</my-tag>
```

В примере выше сообщение об ошибке будет показано в UI только после вызова метода `update()`. Мы сохраняем в `self` ссылку на переменную `this`, так как внутри функции обратного вызова AJAX переменная `this` ссылается на объект ответа сервера, а не экземпляр тега.

### `this.update(data)`

Установить значения для текущего экземпляра и обновить его выражения. Тоже самое, что и `this.update()`, но в тоже время еще дает возможность утановить данные контекста. Таким образом, вместо:

```lang-javascript
self.error = error_message
self.update()
```

вы можете сделать так:

```lang-javascript
self.update({ error: error_message })
```

как видите, короче и проще.

### `this.unmount()`

Отмонтировать (убрать) тег и его потомков со страницы. Вызывается событие "unmount".

#### События

Все экземпляры тегов имеют систему [наблюдения](#api/nablyudenie), это дает вам возможность использовать методы `on` и `one` для прослушивания событий которые вызываются в экземпляре тега. Список встроеных событий экземпляра:

- "update" – вызывается перед тем как тег обновится. Дает возможность пересчитать данные контекста перед тем как UI выражения обновятся.
- "mount" – вызывается после добавления тега на страницу.
- "unmount" – вызывается после удаления тега со страницы.

Пример:

```lang-javascript
// очистка ресурсов после того как тег удален из DOM
this.on('unmount', function() {
  clearTimeout(timer)
})
```

#### Зарезервированые слова

Все вышеперечисленные методы и свойства являются зарезервироваными словами для Riot тегов. Не используйте следующие имена для переменных и методов ваших тегов: `opts`, `parent`, `root`, `update`, `unmount`, `on`, `off`, `one` и `trigger`. Локальные переменные могут иметь любые названия. Пример:

```lang-markup
<my-tag>

  // допустимо
  function update() { } 

  // не допустимо
  this.update = function() { }

  // не допустимо
  update() {

  }

</my-tag>
```

### `riot.tag(tagName, html, [css], [constructor])`

Создание нового пользовательского тега "вручную" без компилятора.

* `tagName` имя тега
* `html` верстка с [выражениями](#guide/vyrazheniya)
* `css` стили для тега (опционально)
* `constructor` функция инициализатор которая вызывается перед тем как будут подсчитаны выражения в теге и до того как тег будет монтирован на страницу.

Пример:

```lang-javascript
riot.tag('timer',
  '<p>Seconds Elapsed: { time }</p>',
  'timer { display: block; border: 2px }',
  function (opts) {
    var self = this
    this.time = opts.start || 0

    this.tick = function () {
      self.update({ time: ++this.time })
    }

    var timer = setInterval(this.tick, 1000)

    this.on('unmount', function () {
      clearInterval(timer)
    })

  })
```

Смотрите [пример таймер](http://jsfiddle.net/gnumanth/h9kuozp5/) и [riot.tag](#api/riottagtagname_html_constructor) API документацию для более подробного описания.

<span class="label red">Предупреждение</span> используя `riot.tag` вы лишаетесь такого инструмента как компилер и поддержки следующих вещей:

1. Самозакрывающиеся теги
2. Выражения без кавычек. Надо писать `value="{ val }"` вместо `value={ val }`
3. Булевые атрибуты. Надо писать `__checked="{ flag }"` вместо `checked={ flag }`
4. Короткая запись методов в стиле ES6
5. `<img src={ src }>` должно писаться как `<img riot-src={ src }>` для избежания некоректного запроса к серверу
5. `style="color: { color }"` надо писать как `riot-style="color: { color }"` для того чтобы выражения работали в IE.

Вы можете встраивать шаблоны при помощи тега `<template>` или `<script>` следующим образом:

```lang-jsx
<script type="tmpl" id="my_tmpl">
  <h3>{ opts.hello }</h3>
  <p>And a paragraph</p>
</script>

<script>
riot.tag('tag-name', my_tmpl.innerHTML, function(opts) {

})
</script>
```

Этот метод в дальнейшем будет исключен.

### `riot.update()`

Обновить все теги которые были монтированы на страницу а также их выражения.

@возвращает:: массив [экземпляров тегов](#api/ekzemplyar_tega) которые монтированы на страницу.

# Компилятор

## В браузере

Следующие методы применимы только в браузере. Перейдите к [серверной реализации](#compiler/predvaritelnaya_sborka) если вы хотите компилировать теги в на сервере под node.js или io.js.

### `riot.compile(callback)`

Скомпилировать все теги определенные при помощи `<script type="riot/tag">` в JavaScript. Это может быть как инлайновое определение тегов, так и внешний ресурс который будет загружен если указан стрибут `src`. После того как все теги будут скомпилированы, вызовется функция `callback`. Пример:

```lang-javascript
riot.compile(function() {
  var tags = riot.mount('*')
})
```

Вы также можете вызвать метод `riot.mount` вне функции обратного вызова компилятора:

```lang-javascript
var tags = riot.mount('*')
```

но в таком случае вполне вероятно внешние ресурсы еще не загрузятся и не скомпилируются и масив возвращенный функцией `riot.mount` будет пустой если все ваши теги подгружаются извне. Если все ваши скрипты определены на странице, `riot.compile` шаг можно пропустить.

Для большей информации читайте [общее введение](#compiler).

### `riot.compile(url, callback)`

Загрузить теги по указанному URL и компилирует их после чего вызывает `callback`. Пример:

```lang-javascript
riot.compile('my/tags.js', function() {
  // загруженые теги готовы к использованию
})
```

### riot.compile(tag)

Скомпилировать и создать указанный `tag`. Пример:

```lang-markup
<template id="my_tag">
  <my-tag>
    <p>Hello, World!</p>
  </my-tag>
</template>

<script>
riot.compile(my_tag.innerHTML)
</script>
```

После вызова этого метода вы можете использовать `my-tag` как обычно.

Предпологается что первый непустой символ будет `<`, иначе аргумент интерпретируется как URL.

@возвращает: скомпилированый JavaScript как строку.

### `riot.compile(tag, true)`

Компилирует тег и возвращает его как строку. Происходит только компиляция тега в JavaScript, этот тег не выполнен в браузере и поэтому он не может быть монтирован как обычно. Этот метод можно использовать, к примеру, для тестирования скорости работы компилятора.

```lang-javascript
var js = riot.compile(my_tag.innerHTML, true)
```

## На сервере

После того как вы утановили Riot при помощи команды `npm install riot` вы должны сделать следующее:

```lang-javascript
var riot = require('riot')

var js = riot.compile(tag)
```

Функция компилятор принимает строку с определением тега (строка) и возвращает JavaScript (строка).

# Наблюдение

### `riot.observable(el)`

Добавляет поддержку [Наблюдатения](//ru.wikipedia.org/wiki/Наблюдатель_(шаблон проектирования))) переданному элементу `el` или, если аргумент пустой, создается и возвращается новый экземпляр объекта с поддержкой наблюдения. После этого возможно следение за событиями и вызов событий в данном объекте. Пример:

```lang-javascript
function Car() {

  // добавить возможность наблюдения в Car экземпляр
  riot.observable(this)

  // добавить слушатель события 'start'
  this.on('start', function() {
    // двигатель запущен
  })

}

// создать новый экземпляр класса Car
var car = new Car()

// вызвать событие 'start'
car.trigger('start')
```

@возвращает: переданный объект `el` или новый экземпляр объекта с поддержкой наблюдения.


### `el.on(events, callback)`

Слушать список событий `events` разделенные пробелом и выполнять функцию `callback` каждый раз когда вызывается событие из списка.

```lang-javascript
// слушать одно событие
el.on('start', function() {

})

// слушать сразу несколько событий,
// тип события будет передан в первом аргументе
el.on('start stop', function(type) {

  // type равен 'start' или 'stop'

})
```

@возвращает: `el`

### `el.one(event, callback)`

Тоже самое, что и `el.on(event, callback)`, только функция `callback` отработает один раз, при первом вызове события:

```lang-javascript
// вызвать функцию один раз,
// даже если событие 'start' вызовется несколько раз
el.one('start', function() {

})
```

@возвращает: `el`

### `el.off(events)`

Удалить слущатели событий из переданного списка (через пробел):

```lang-javascript
el.off('start stop')
```

@возвращает: `el`

### `el.off(event, fn)`

Удалить переданный функцию `fn` из списка слушателей события `event`.

```lang-javascript
function doStart() {
  console.log('система стартовала')
}

el.on('start', doStart)

// удалить определенный слушатель
el.off('start', doStart)
```

@возвращает: `el`

### `el.off('*')`

Удалить все слушатили всех типов.

@возвращает: `el`

### `el.trigger(event)`

Вызвать все функции, которые слушают событие `event`:

```lang-javascript
el.trigger('start')
```

@возвращает: `el`

### `el.trigger(event, arg1 ... argN)`

Вызвать все функции, которые слушают событие `event`. Все последущие аргументы после первого будут переданы в слушатель.

```lang-javascript
// слушать событие 'start'
// ожидая дополнительные параметры
el.on('start', function(engine_details, is_rainy_day) {

})

// вызвать событие 'start' передав дополнительные параметры
el.trigger('start', { fuel: 89 }, true)

```

@возвращает: `el`

# Маршрутизатор

Маршрутизатор Riot являестя одной из самых минималистичных реализаций маршрутизатора которую вы можете найти и которая работает во всех браузерах включая IE8. Он следит только за изменением URL хэша (все что после знака #). Большинство одностраничных приложений взаимодействуют только с хэшом, но если вы хотите работать со всем URL полностью вам следует использовать иную реализацию. 

Маршрутизатор Riot хорошо подходит в том случае, если вы задумали в своем приложении создать иерархию путей разделяя хэш на составные символом "/". В этом случае Riot дает вам доступ к этим частям хеша.

### `riot.route(callback)`

Выполнить функцию `callback` если URL хэш изменится. Пример:

```lang-javascript
riot.route(function(collection, id, action) {

})
```

Если, к примеру, хэш изменится на `#customers/987987/edit` то в предыдущем примере аргументы будут равны:

```lang-javascript
collection = 'customers'
id = '987987'
action = 'edit'
```

Хэш меняется в следующих случаях:

1. Новый хэш введен в адресную строку
2. Когда нажимаются кнопки "вперед"/"назад"
3. Когда вызывается `riot.route(to)`

### `riot.route(to)`

Изменить URL и оповестить все слушатели добавленые при помощи `riot.route(callback)`. Пример:

```lang-javascript
riot.route('customers/267393/edit')
```

### `riot.route.exec(callback)`

Изучить текущий хэш передав его функции `callback` не дожидаясь события изменения хэша. Пример:

```lang-javascript
riot.route.exec(function(collection, id, action) {

})
```

### `riot.route.parser(parser)`

Изменить парсер по умолчанию. 
Changes the default parser to a custom one. Пример парсера, который анализирует пути, подобные этому:

`!/user/activation?token=xyz`

```lang-javascript
riot.route.parser(function(path) {
  var raw = path.slice(2).split('?'),
      uri = raw[0].split('/'),
      qs = raw[1],
      params = {}

  if (qs) {
    qs.split('&').forEach(function(v) {
      var c = v.split('=')
      params[c[0]] = c[1]
    })
  }

  uri.push(params)
  return uri
})
```

И так вы будете получать параметру при смене URL:

```lang-javascript
riot.route(function(target, action, params) {

  /*
    target = 'user'
    action = 'activation'
    params = { token: 'xyz' }
  */

})
```