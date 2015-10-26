// Шаблон изолированного пространства имен
/*
new Sandbox(function (box) {
  // здесь находится ваш программный код...
});

Sandbox([‘ajax’, ‘event’], function (box) {
  // console.log(box);
});

Sandbox(‘ajax’, ‘dom’, function (box) {
  // console.log(box);
});

Sandbox(‘*’, function (box) {
  // console.log(box);
});

Sandbox(function (box) {
  // console.log(box);
});

Sandbox(‘dom’, ‘event’, function (box) {
  
  // использует модули dom и event
  Sandbox(‘ajax’, function (box) {
    // другой объект “box” изолированного пространства имен
    // этот объект “box” отличается от объекта
    // “box”, находящегося за пределами этой функции
    //...
    // конец пространства имен, использующего модуль Аjax
  });

  // здесь модуль Аjax недоступен
});

*/

function Sandbox() {
  
  var
    // преобразовать аргументы в массив
    args = Array.prototype.slice.call(arguments),
    // последний аргумент - функция обратного вызова
    callback = args.pop(),
    // имена модулей могут передаваться в форме массива
    // или в виде отдельных параметров
    modules = (args[0] && typeof args[0] == 'string') ? args : args[0],
    i;

  // проверить, была ли функция вызвана
  // как конструктор
  if (!(this instanceof Sandbox)) {
    return new Sandbox(modules, callback);
  }

  // добавить свойства к объекту `this`, если это необходимо:
  this.a = 1;
  this.b = 2;

  // добавить модули в базовый объект 'this'
  // отсутствие аргументов с именами модулей или аргумент со значением '*'
  // предполагает необходимость включения 'всех модулей'
  if (!modules || modules === '*') {
    modules = [];
    for (i in Sandbox.modules) {
      if (Sandbox.modules.hasOwProperty(i)) {
        modules.push(i);
      }
    }
  }

  // инициализировать необходимые модули
  for (i = 0; i < modules.length; i += 1) {
    Sandbox.modules[modules[i]](this);
  }

  // вызвать функцию обратного вызова
  callback(this);
}

Sandbox.modules = {};

Sandbox.modules.dom = function (box) {
  box.getElement = function () {};
  box.getStyle = function () {};
  box.foo = "bar";
};

Sandbox.modules.event = function (box) {
  // при необходимости к прототипу Sandbox можно обратиться так:
  // box.constructor.prototype.test = 'Test';
  box.attachEvent = function () {};
  box.detachEvent = function () {};
};
Sandbox.modules.ajax = function (box) {
  box.makeRequest = function () {};
  box.getResponse = function () {};
};

// добавить свойства к прототипу, если это необходимо
Sandbox.prototype.name = "My Application";
Sandbox.prototype.version = "0.1";
Sandbox.prototype.getName = function() { return this.name; }