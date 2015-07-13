
title: Компилятор
subtitle: Из <custom-tag> в JavaScript
date: Wed Feb 25 2015 09:14:25

====

## Сборка в браузере

Пользовательские теги должны быть приобразованы в JavaScript перед тем как запускать ваш код в браузере. Вы можете это сделать установив `type="riot/tag"` атрибут вашим тегам. Пример:

```lang-jsx
<!-- mount point -->
<my-tag></my-tag>

<!-- inlined tag definition -->
<script type="riot/tag">
  <my-tag>
    <h3>Tag layout</h3>
    <inner-tag />
  </my-tag>
</script>

<!-- <inner-tag/> is specified on external file -->
<script src="path/to/javascript/with-tags.js" type="riot/tag"></script>

<!-- include riot.js and the compiler -->
<script src="//cdn.jsdelivr.net/g/riot@2.0(riot.min.js+compiler.min.js)"></script>

<!-- mount normally -->
<script>
riot.mount('*')
</script>
```

Скрипт с описанием тега и внешние файлы тегов могут содержать несколько их определений в сочетании с обычным JavaScript.

Riot автоматически подхватывает инлайновое описание тегов и во внешних файлах и собирает их перед тем как теги будут отрисованы вызовом метода `riot.mount()`.

### Доступ к экземпляру тега

Если вы закгружаете теги при помощи `script src` и хотите получить доступ к монтированым тегам вы должны сделать обертку для `riot.mount` при помощи `riot.compile`:

```
<script>
riot.compile(function() {
  // здесь теги уже скомпилированы и
  // riot.mount работает синхронно
  var tags = riot.mount('*')
})
</script>
```

### Compiler performance

Фаза сборки обычно проходит быстро и практически не отнимает времени. Сборка [timer tag](https://github.com/muut/riotjs/blob/master/test/tag/timer.tag) 30 раз занимает 2мс на обычном лаптопе. Если даже у вас нереально огромная страница с 1000 разными тегами, сборка займет около 35мс.

Сборщик весит всего 3.2KB (1.7K gzip), так что вы можете спокойно собирать свои теги на клиенте в продакшене без потерь производительности.

Так же, Riot сборщик прекрасно работает в IE8.

Для более подробного описания читайте [API компилятора](#api/kompilyator)

### Демонстрация

* [Компиляция в браузере](http://muut.github.io/riotjs/demo/)
* [Предварительная компиляция](http://muut.github.io/riotjs/demo/)
* [Исходный код](https://github.com/muut/riotjs/tree/gh-pages/demo)
* [Скачать пример](https://github.com/muut/riotjs/archive/gh-pages.zip)

## Предварительная сборка

Предварительная компиляция на сервере дает вам следующие преимущества:

* Возможность сборки тегов с использованием [любимых препроцессоров](#compiler/preproczessory).
* Небольшое преимущество в производительности. Нет надобности загружать и запускать сборщик в браузере.
* "Изоморфные приложения" и возможность предварительной сборки тегов на сервере (вскоре будет).

Предварительную сборку можно осуществить предварительно установив пакет `riot`. Устанавливается она из NPM следующим образом:

```lang-bash
npm install riot -g
```

Введите в консоли `riot --help` и убедитесь, что пакет работает. Для этого, конечно же, требуется установленный на компьютере [node.js](http://nodejs.org/).

С предварительной сборкой ваш код будет приблизительно таким:

```lang-markup
<!-- mount point -->
<my-tag></my-tag>

<!-- include riot.js only -->
<script src="//cdn.jsdelivr.net/riot/2.0/riot.min.js"></script>

<!-- include pre-compiled tags (normal javascript) -->
<script src="path/to/javascript/with-tags.js"></script>

<!-- mount the same way -->
<script>riot.mount('*')</script>
```

Если вы загрузили теги при помощи `script src` и хитите получить доступ к монтированым тегам вы можете сделать это следующим способом:

```lang-javascript
<script>
riot.compile(function() {
  // эти теги уже скомпилены и 
  // riot.mount сработает синхронно  
  var tags = riot.mount('*')
})
</script>
```

### Использование

Вот как работают команды `riot`:

```lang-bash
# собрать файл в текущую папку
riot some.tag

# собрать файл в указанную папку
riot some.tag some_folder

# собрать файл по указанному пути
riot some.tag some_folder/some.js

# собрать все файлы из первой папки во вторую папку
riot some/folder path/to/dist

# собрать и сконкатенировать все файлы из указанной папки в один указанный файл
riot some/folder all-my-tags.js
```

Файлы для сборки должны содержать в себе один или более пользовательских тегов и также может содержать обычный JavaScript вместе с пользовательскими тегами. Сборщик преобразует только пользовательские теги и не коснется других частей файла.

Что бы получить больше информации, введите: `riot --help`

### Режим наблюдения

Вы можете включить режим наблюдения за папкой и автоматически преобразовывать файлы, если они изменились.

```lang-bash
# наблюдать за
riot -w src dist
```

### Custom extension

Вы можете использовать любые расширения файлов тегов (вместо используемого по умолчанию `.tag`):

```lang-bash
riot --ext html
```

### Node модуль

```lang-bash
var riot = require('riot')

var js = riot.compile(source_string)
```

Функция сборщика принимает строку и возвращает строку.

### Внедрение в ваш рабочий процесс

* [Gulp](https://github.com/e-jigsaw/gulp-riot)
* [Grunt](https://github.com/ariesjia/grunt-riot)
* [Browserify](https://github.com/jhthorsen/riotify)

## Препроцессоры

Это главное преимущество предварительной сборки. Вы можете использовать ваш любимый препроцессор для создания пользовательских тегов. И HTML, и JavaScript препроцессоры могут буть настроены.

Тип языка исходного кода указывается при помощи аргумента `--type` или `-t` в командной строке или при помощи атрибута тега `script`:

```lang-markup
<my-tag>
  <h3>My layout</h3>

  <script type="coffeescript">
    @hello = 'world'
  </script>
</my-tag>
```

### CoffeeScript

Язык исходного кода указывается при помощи `--type` или `-t` аргумента:

```lang-bash
# используем coffeescript
riot --type coffeescript --expr source.tag
```

Аргумент `--expr` указывает на то, что все выражения выражения также должны быть обработаны.
Можно также использовать "cs" как алиас аргумента "coffeescript". Это пример описания тега на CoffeeScript:

```lang-jsx
<kids>

  <h3 each={ kids[1 .. 2] }>{ name }</h3>

  # Here are the kids
  this.kids = [
    { name: "Max" }
    { name: "Ida" }
    { name: "Joe" }
  ]

</kids>
```
Заметим, что `each` атрибут тоже часть CoffeeScript. CoffeeScript должен быть установлен на вашем компьютере:

```lang-bash
npm install coffee-script -g
```

### EcmaScript 6

Для ECMAScript 6 используйте тип "es6":

```lang-bash
# используем ES6 препроцессор
riot --type es6 source.tag
```

Образец тега написанного на ES6:

```lang-jsx
<test>

  <h3>{ test }</h3>

  var type = 'JavaScript'
  this.test = `This is ${type}`

</test>
```

Все ECMAScript 6 [особенности](https://github.com/lukehoban/es6features) могут быть использованы. Для преобразования используется [6to5](https://6to5.org/):

```lang-bash
npm install 6to5
```

[Пример](https://github.com/txchen/feplay/tree/gh-pages/riot_babel) использования Babel с Riot.

### TypeScript

TypeScript добавляет типы в JavaScript. Введите `--type typescript` для его использования:

```lang-bash
# использовать TypeScript препроцессор
riot --type typescript source.tag
```

Образец тега написанного на TypeScript:

```lang-jsx
<test>

  <h3>{ test }</h3>

  var test: string = 'JavaScript';
  this.test = test;

</test>
```

Для преобразования используется [typescript-simple](https://github.com/teppeis/typescript-simple):

```lang-bash
npm install typescript-simple
```

### LiveScript

Смотрите [LiveScript](http://livescript.net/) чтобы узнать особенности языка и документацию.

Тип используемого языка в исходнике задается аргументами --type или -t:

```lang-bash
# use livescript pre-processor
riot --type livescript --expr source.tag
```
Аргумент `--expr` указывает на то, что также надо обработать выражения. Также можно использовать слово "ls" вместо "livescript". Пример простого тега написаного на LiveScript:

```lang-javascript
<kids>

<h3 each={ kids[1 .. 2] }>{ name }</h3>

# Here are the kids
this.kids =
* name: Max
* name: Ida
* name: Joe

</kids>
```

Не забывайте, что слово `each` также используется в LiveScript. Для работы с этим языком требуется наличие LiveScript компилятора:

```lang-bash
npm install LiveScript -g
```

### Jade

HTML часть кода может быть обработанна с опцией `template`. Пример с использованием Jade - "простой, чуствительный к пробелам, синтаксис для описания html":

```lang-bash
# использовать Jade HTML препроцессор
riot --template jade source.tag
```

Образец Jade:

```lang-markup
sample
  p test { value }
  script(type='text/coffeescript').
    @value = 'sample'
```

Как вы заметили, вы можете указать тип скрипта в шаблоне. В примере выше мы использовали coffeescript. Для преобразования используется [jade](https://github.com/jadejs/jade):

```lang-bash
npm install jade
```

### Любые языки

Вы можете сконфигурировать ваш любимый язык для создания своей фйнкции парсера. Для примера:

```lang-javascript
function myParser(js, options) {
  return doYourThing(js, options)
}
```

Этот парсер будет передан в компилятор в опции `parser`:

```lang-javascript
var riot = require('riot')

var js = riot.compile(source_string, { parser: myParser, expr: true })
```

Установите `expr: true` если вы хотите также распарсить выражения.

### Без трансформации

По умолчанию Riot использует встроенный транспилер (transpiler) который позволяет использовать описание методов в стиле ES6. Вы можете отключить все преобразования используя `--type none`:

```lang-bash
# без pre-processor
riot --type none --expr source.tag
```

Если у вас есть интересные идеи, пожалуйста [отпишите нам](https://github.com/muut/riotjs/issues/58) !