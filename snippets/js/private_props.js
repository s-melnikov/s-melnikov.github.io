/**
 * Реализация методов доступа к частному свойству с использованием замыканий
 */
function addPrivateProperty(o, name, predicate) {
  var value;

  // метод чтения просто возвращает значение
  o["get" + name] = function () {
    return value;
  }

  // метод записисохраняет значение или возбуждает исключениеб
  // если ф-ция проверки отвергает это значение
  o["set" + name] = function (v) {
    if (predicate && !predicate(v))
      throw Error("set" + name + ": недопустимое значение " + v);
    else
      value = v;
  }
}
