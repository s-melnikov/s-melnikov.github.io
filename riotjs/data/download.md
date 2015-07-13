
title: Получить Riot
date: Wed Feb 25 2015 11:20:07

====

##### [<span class="label">v<% version %></span> изменения](https://muut.com/riotjs/release-notes.html)

### Прямое скачивание

[riot.min.js](https://raw.githubusercontent.com/muut/riotjs/master/riot.min.js)

[riot.js](https://raw.githubusercontent.com/muut/riotjs/master/riot.js)

[compiler.min.js](https://raw.githubusercontent.com/muut/riotjs/master/compiler.min.js)

[compiler.js](https://raw.githubusercontent.com/muut/riotjs/master/compiler.js)

[riot+compiler.min.js](https://raw.githubusercontent.com/muut/riotjs/master/riot+compiler.min.js)

[riot+compiler.js](https://raw.githubusercontent.com/muut/riotjs/master/riot+compiler.js)

### CDN

#### [JSDELIVR](http://www.jsdelivr.com/#!riot)

`https://cdn.jsdelivr.net/g/riot@2.0(riot.min.js+compiler.min.js)` <small>(latest 2.0.X)</small>

`https://cdn.jsdelivr.net/riot/2.0/riot.min.js` <small>(latest 2.0.X)</small>

`https://cdn.jsdelivr.net/g/riot@<% version %>(riot.min.js+compiler.min.js)`

`https://cdn.jsdelivr.net/riot/<% version %>/riot.min.js`

#### [CDNJS](https://cdnjs.com/libraries/riot)

<span class="label red">NOTE</span> v2.0.11 была выпущена **23 февраля** и CDNJS требуется около 30 часов на обновление.

`https://cdnjs.cloudflare.com/ajax/libs/riot/<% version %>/riot+compiler.min.js`

`https://cdnjs.cloudflare.com/ajax/libs/riot/<% version %>/riot.min.js`

### Менеджер пакетов

#### [BOWER](http://bower.io/search/?q=riot.js)

```lang-bash
bower install riot
```

#### [COMPONENT](http://component.github.io/?q=riot)

```lang-bash
component install muut/riotjs
```

#### [NPM](https://www.npmjs.com/package/riot)

```lang-bash
npm install riot
```

### GitHub

#### [MUUT/RIOTJS](https://github.com/muut/riotjs)

```lang-bash
git clone git@github.com:muut/riotjs.git
```

## Поддержка IE8

Для поддержки IE8 вам следует воспользоваться [es5-shim](https://github.com/es-shims/es5-shim) и [html5-shiv](https://github.com/aFarkas/html5shiv), и указать ему чтобы он использовал последнюю версию движка:

```lang-markup
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if lt IE 9]>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.0.5/es5-shim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script>html5.addElements('test')</script>
  <![endif]-->
</head>
```

Также, надо дать знать IE о всех ваших тегах, перед тем как их использовать на странице:

```lang-markup
<script>html5.addElements('my-tag my-another-tag')</script>
```

Список тегов передается через пробел.

## Известные проблемы

* Вывод в цикле табличных строк или ячеек через `each` атрибут не работает в IE8 and IE9.

## Медиа

![](assets/img/logo/riot60x.png)

![](assets/img/logo/riot120x.png)

![](assets/img/logo/riot240x.png)

![](assets/img/logo/riot480x.png)

![](assets/img/logo/riot960x.png)

 