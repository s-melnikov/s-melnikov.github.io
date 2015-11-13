/*
 * Возвращает вновь созданный объект, наследующий свойства
 * объекта-прототипа p. Использует функцию Object.create() из ECMAScript 5,
 * если она определена, иначе используется более старый прием
 */
function inherit(p) {
  if (p == null) throw TypeError();
  if (Object.create) return Object.create(p);
  var t = typeof p;
  if (t !== "object" && t !== "function") throw TypeError();
  function f() {};
  f.prototype = p;
  return new f();
}

/*
 * Копирует перечислимые свойства из объекта p в объект o и возвращает o.
 * Если o и p имеют свойства с одинаковыми именами, значение свойства
 * в объекте o затирается значением свойства из объекта p.
 * Эта функция не учитывает наличие методов доступа и не копирует атрибуты.
 */
function extend(o, p) {
  for (var prop in p)
    o[prop] = p[prop];
  return o;
}

/*
 * Копирует перечислимые свойства из объекта p в объект o и возвращает o.
 * Если o и p имеют свойства с одинаковыми именами, значение свойства
 * в объекте o остается неизменным.
 * Эта функция не учитывает наличие методов доступа и не копирует атрибуты.
 */
function merge(o, p) {
  for (var prop in p) {
    if (o.hasOwnProperty(prop)) continue;
    o[prop] = p[prop];
  }
  return o;
}

/*
 * Удаляет из объекта o свойства, отсутствующие в объекте p.
 * Возвращает o.
 */
function restrict(o, p) {
  for (var prop in o)
    if (!(prop in p)) delete o[prop];
  return o;
}

/*
 * Удаляет из объекта o свойства, присутствующие в объектеp. Возвращает o.
 */
function subtract(o, p) {
  for (var prop in p)
    delete o[prop];
  return o;
}

/*
 * Возвращает новый объект, содержащий свойства, присутствующие хотя бы в одном
 * из юбъектов, o или p. Если оба объекта, o или p, имеют свойства с одним
 * и тем же именем, используется значение свойства из объекта p. 
 */
function union(o, p) {
  return extend(extend({}, o), p);
}

/*
 * Возвращает новый объект, содержащий свойства, присутствующие сразу в обоих
 * объектах, o или p. Результат чем-то напоминает пересечение o и p,
 * но значение свойств объекта p отбрасываются.
 */
function intersection(o, p) {
  return restrict(extend({}, o), p);
}

/*
 * Возвращает массив имен собственных перечислимых свойств объекта o.
 */
function keys(o) {
  if (typeof o !== "object") throw TypeError();
  var result = [];
  for (var prop in o) {
    if (o.hasOwnProperty(prop))
      result.push(prop);
  }
  return result;
}

/*
_.extend = function(obj) {
  
  each(slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};
*/