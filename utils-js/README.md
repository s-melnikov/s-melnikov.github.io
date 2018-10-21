## Collections

### compare

```js
function compare(value1, value2) {
  if (value1 === value2) {
    return true;
  }
  if (typeof value1 != typeof value2) {
    return false;
  }
  if (value1 !== Object(value1)) {
    // non equal primitives
    return false;
  }
  if (!value1) {
    return false;
  }
  if (Array.isArray(value1)) {
    return compareArrays(value1, value2);
  }
  if (({}).toString.call(value1) == '[object Object]') {
    return compareObjects(value1, value2);
  } else {
    return compareNativeSubtypes(value1, value2);
  }
}

function compareNativeSubtypes(value1, value2) {
  // e.g. Function, RegExp, Date
  return value1.toString() === value2.toString();
}

function compareArrays(value1, value2) {
  let len = value1.length;
  if (len != value2.length) {
    return false;
  }
  let alike = true;
  for (let i = 0; i < len; i++) {
    if (!compare(value1[i], value2[i])) {
      alike = false;
      break;
    }
  }
  return alike;
}

function compareObjects(value1, value2) {
  let keys1 = Object.keys(value1).sort();
  let keys2 = Object.keys(value2).sort();
  let len = keys1.length;
  if (len != keys2.length) {
    return false;
  }
  for (let i = 0; i < len; i++) {
    let key1 = keys1[i];
    let key2 = keys2[i];
    if (!((key1 == key2) && (compare(value1[key1], value2[key2])))) {
      return false;
    }
  }
  return true;
}
```
Usage:
```js
// primitives: value1 === value2
// functions: value1.toString == value2.toString
// arrays: if length, sequence and values of properties are identical
// objects: if length, names and values of properties are identical
compare([[1, [2, 3]], [[1, [2, 3]]); // true
compare([[1, [2, 3], 4], [[1, [2, 3]]); // false
compare({a: 2, b: 3}, {a: 2, b: 3}); // true
compare({a: 2, b: 3}, {b: 3, a: 2}); // true
compare({a: 2, b: 3, c: 4}, {a: 2, b: 3}); // false
compare({a: 2, b: 3}, {a: 2, b: 3, c: 4}); // false
compare([[1, [2, {a: 4}], 4], [[1, [2, {a: 4}]]); // true
```


### pluck-it

```js
function pluck(collection, propertyName) {
  if (!collection || typeof collection != 'object') {
    return new Error('expected first argument to be an object or array');
  }

  let result, len, i, keys, key;
  if (Array.isArray(collection)) {
    result = [];
    len = collection.length;
    for (i = 0; i < len; i++) {
      result.push(collection[i][propertyName]);
    }
  } else {
    result = {};
    keys = Object.keys(collection);
    len = keys.length;
    for (i = 0; i < len; i++) {
      key = keys[i];
      result[key] = collection[key][propertyName];
    }
  }
  return result;
}
```
Usage:
```js
pluck([{a:1, b:2}, {a:4, b:3}, {a:2, b:5}], 'a'); // [1, 4, 2]
pluck({x: {a:1, b:2}, y: {a:4, b:3}, z: {a:2, b:5}}, 'a'); // {x: 1, y: 4, z: 2}
```

### flush

```js
function flush(collection) {
  let result, len, i;
  if (!collection) {
    return undefined;
  }
  if (Array.isArray(collection)) {
    result = [];
    len = collection.length;
    for (i = 0; i < len; i++) {
      let elem = collection[i];
      if (elem != null) {
        result.push(elem);
      }
    }
    return result;
  };
  if (typeof collection == 'object') {
    result = {};
    let keys = Object.keys(collection);
    len = keys.length;
    for (i = 0; i < len; i++) {
      let key = keys[i];
      let value = collection[key];
      if (value != null) {
        result[key] = value;
      }
    }
    return result;
  };
  return undefined;
}
```
Usage:
```js
flush([1, undefined, 2, null, 3, NaN, 0]); // [1, 2, 3, NaN, 0]
flush([true, null, false, true, [null], undefined]); // [true, false, [null], true]
flush({a: 2, b: null, c: 4, d: undefined}); // {a: 2, c: 4}
flush('something'); // undefined
flush(); // undefined
```

## Objects

### extend

```js
function extend(obj1, obj2 /*, [objn]*/) {
  let args = [].slice.call(arguments);
  let deep = false;
  if (typeof args[0] === 'boolean') {
    deep = args.shift();
  }
  let result = args[0];
  let extenders = args.slice(1);
  let len = extenders.length;
  for (let i = 0; i < len; i++) {
    let extender = extenders[i];
    for (let key in extender) {
      // include prototype properties
      let value = extender[key];
      if (deep && value && (typeof value == 'object')) {
        let base = Array.isArray(value) ? [] : {};
        result[key] = extend(true, result[key] || base, value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}
```
Usage:
```js
let obj = {a: 3, b: 5};
extend(obj, {a: 4, c: 8}); // {a: 4, b: 5, c: 8}
obj; // {a: 4, b: 5, c: 8}

let obj = {a: 3, b: 5};
extend({}, obj, {a: 4, c: 8}); // {a: 4, b: 5, c: 8}
obj; // {a: 3, b: 5}

let arr = [1, 2, 3];
let obj = {a: 3, b: 5};
extend(obj, {c: arr}); // {a: 3, b: 5, c: [1, 2, 3]}
arr.push[4];
obj; // {a: 3, b: 5, c: [1, 2, 3, 4]}

let arr = [1, 2, 3];
let obj = {a: 3, b: 5};
extend(true, obj, {c: arr}); // {a: 3, b: 5, c: [1, 2, 3]}
arr.push[4];
obj; // {a: 3, b: 5, c: [1, 2, 3]}
```

### values

```js
function values(obj) {
  let result = [];
  if (Array.isArray(obj)) {
    return obj.slice(0);
  }
  if (typeof obj == 'object' || typeof obj == 'function') {
    let keys = Object.keys(obj);
    let len = keys.length;
    for (let i = 0; i < len; i++) {
      result.push(obj[keys[i]]);
    }
    return result;
  }
  throw new Error('argument to `values` must be an object');
}
```
Usage:
```js
values({a: 4, c: 8}); // [4, 8]
values({a: {aa: 2}, b: {bb: 4}}); // [{aa: 2}, {bb: 4}]
values({}); // []
values([1, 2, 3]); // [1, 2, 3]
values(function(a, b) {return a + b;}); // []
values(String('hello')); // []
values(1); // throw exception
values(true); // throw exception
values(undefined); // throw exception
values(null); // throw exception
```

### pick

```js
function pick(obj, select) {
  let result = {};
  if (typeof select === 'string') {
    select = [].slice.call(arguments, 1);
  }
  let len = select.length;
  for (let i = 0; i < len; i++) {
    let key = select[i];
    result[key] = obj[key];
  }
  return result;
}
```
Usage:
```js
let obj = {a: 3, b: 5, c: 9};
pick(obj, ['a', 'c']); // {a: 3, c: 9}
pick(obj, 'a', 'c'); // {a: 3, c: 9}
pick(obj, ['a', 'b', 'd']); // {a: 3, b: 5, d: undefined}
pick(obj, ['a', 'a']); // {a: 3}
```

### omit

```js
function omit(obj, remove) {
  let result = {};
  if (typeof remove === 'string') {
    remove = [].slice.call(arguments, 1);
  }
  for (let prop in obj) {
    if (!obj.hasOwnProperty || obj.hasOwnProperty(prop)) {
      if (remove.indexOf(prop) === -1) {
        result[prop] = obj[prop];
      }
    }
  }
  return result;
}
```
Usage:
```js
let obj = {a: 3, b: 5, c: 9};
omit(obj, ['a', 'c']); // {b: 5}
omit(obj, 'a', 'c'); // {b: 5}
omit(obj, ['a', 'b', 'd']); // {c: 9}
omit(obj, ['a', 'a']); // {b: 5, c: 9}
```

### filter-object

```js
function filter(obj, predicate) {
  let result = {};
  let keys = Object.keys(obj);
  let len = keys.length;
  for (let i = 0; i < len; i++) {
    let key = keys[i];
    if (predicate(key, obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
}
```
Usage:
```js
// returns a new object containing those original properties for which the predicate returns truthy
filter({a: 3, b: 5, c: 9}, (key, value) => value < 6); // {a: 3, b: 5}
filter({a1: 3, b1: 5, a2: 9}, (key, value) => key[0] == 'a'); // {a1: 3, a2: 9}
filter({a: 3, b: 5, c: null}, (key, value) => value); // {a: 3, b: 5}
```

### map-object

```js
function map(obj, predicate) {
  let result = {};
  let keys = Object.keys(obj);
  let len = keys.length;
  for (let i = 0; i < len; i++) {
    let key = keys[i];
    result[key] = predicate(key, obj[key]);
  }
  return result;
}
```
Usage:
```js
// returns a new object with the predicate applied to each value
map({a: 3, b: 5, c: 9}, (key, value) => value + 1); // {a: 4, b: 6, c: 10}
map({a: 3, b: 5, c: 9}, (key, value) => key); // {a: 'a', b: 'b', c: 'c'}
map({a: 3, b: 5, c: 9}, (key, value) => key + value); // {a: 'a3', b: 'b5', c: 'c9'}
```

### reduce-object

```js
function reduce(obj, predicate/*, initialValue*/) {
  let args = [callback];
  // `initialValue` is optional
  let hasInitialValue = 2 in arguments;
  hasInitialValue && args.push(arguments[2]);

  function callback(previousValue, currentKey, currentIndex, array) {
    // when `initialValue` is not provided then
    // `previousValue` is the value associated to the first key
    if (!hasInitialValue) {
      previousValue = obj[array[0]];
      hasInitialValue = true;
    }
    return predicate(previousValue, currentKey, obj[currentKey], currentIndex, array);
  }

  return Array.prototype.reduce.apply(Object.keys(obj), args);
}
```
Usage:
```js
// applies a function against an accumulator and each key-value pairs of the object
// to reduce it to a single value
reduce({a: 3, b: 5, c: 9}, (acc, key, value, index, keys) => {
  acc[value] = key;
  return acc;
}, {}); // {3: 'a', 5: 'b', 9: 'c'}

reduce({a: 3, b: 5, c: 9}, (acc, key, value, index, keys) => {
  acc += value;
  return acc;
}); // 17
```

### is-empty

```js
function isEmpty(obj) {
  if (obj == null) {
    return true;
  }

  if (Array.isArray(obj)) {
    return !obj.length;
  }

  if (typeof obj == 'object') {
    return !Object.keys(obj).length;
  }
}
```
Usage:
```js
isEmpty({a: 3, b: 5}) // false
isEmpty(['a','b']) // false
isEmpty({}) // true
isEmpty([]) // true
isEmpty(null) // true
isEmpty(undefined) // true
```

### safe-get

```js
function get(obj, props) {
  if (typeof props == 'string') {
    props = props.split('.');
  }
  let prop;
  while (prop = props.shift()) {
    obj = obj[prop];
    if (!obj) {
      return obj;
    }
  }
  return obj;
}
```
Usage:
```js
const obj = {a: {aa: {aaa: 2}}, b: 4};

get(obj, 'a.aa.aaa'); // 2
get(obj, ['a', 'aa', 'aaa']); // 2

get(obj, 'b.bb.bbb'); // undefined
get(obj, ['b', 'bb', 'bbb']); // undefined

get(obj.a, 'aa.aaa'); // 2
get(obj.a, ['aa', 'aaa']); // 2

get(obj.b, 'bb.bbb'); // undefined
get(obj.b, ['bb', 'bbb']); // undefined
```

### safe-set

```js
function set(obj, props, value) {
  if (typeof props == 'string') {
    props = props.split('.');
  }
  let lastProp = props.pop();
  if (!lastProp) {
    return false;
  }
  let thisProp;
  while (thisProp = props.shift()) {
    if (!obj[thisProp]) {
      obj[thisProp] = {};
    }
    obj = obj[thisProp];
  }
  obj[lastProp] = value;
  return true;
}
```
Usage:
```js
const obj1 = {};
set(obj1, 'a.aa.aaa', 4}); // true
obj1; // {a: {aa: {aaa: 4}}}

const obj2 = {};
set(obj2, [a, aa, aaa], 4}); // true
obj2; // {a: {aa: {aaa: 4}}}

const obj3 = {a: {aa: {aaa: 2}}};
set(obj3, 'a.aa.aaa', 3); // true
obj3; // {a: {aa: {aaa: 3}}}

const obj4 = {a: {aa: {aaa: 2}}};
set(obj4, 'a.aa', {bbb: 7}); // true
obj4; // {a: {aa: {bbb: 7}}}
```

### typeof

```js
function typeOf(obj) {
  if (obj === null) {
    return 'null';
  }
  if (obj !== Object(obj)) {
    return typeof obj;
  }
  return ({}).toString.call(obj).slice(8, -1).toLowerCase();
}
```
Usage:
```js
typeOf({}); // 'object'
typeOf([]); // 'array'
typeOf(function() {}); // 'function'
typeOf(/a/); // 'regexp'
typeOf(new Date()); // 'date'
typeOf(null); // 'null'
typeOf(undefined); // 'undefined'
typeOf('a'); // 'string'
typeOf(1); // 'number'
typeOf(true); // 'boolean'
```

### flip-object

```js
function typeOf(obj) {
  if (obj === null) {
    return 'null';
  }
  if (obj !== Object(obj)) {
    return typeof obj;
  }
  return ({}).toString.call(obj).slice(8, -1).toLowerCase();
}
```
Usage:
```js
// flip the key and value
flip({a: 'x', b: 'y', c: 'z'}); // {x: 'a', y: 'b', z: 'c'}
flip({a: 1, b: 2, c: 3}); // {'1': 'a', '2': 'b', '3': 'c'}
flip({a: false, b: true}); // {false: 'a', true: 'b'}
```

## Arrays

### unique

```js
function unique(arr, sorted, strings) {
  if (!sorted && strings && (arr[0] !== Object(arr[0]))) {
    return stringUnique(arr);
  }
  let result = [], duplicate, lastAdded;
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    let elem = arr[i];
    duplicate = lastAdded && (lastAdded === elem);
    if (!duplicate && !sorted) {
      duplicate = result.indexOf(elem) > -1;
    }
    if (!duplicate) {
      result.push(elem);
      lastAdded = elem;
    }
  }
  return result;
}

function stringUnique(arr) {
  let lookup = {};
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    lookup[arr[i]] = true;
  }
  return Object.keys(lookup);
}
```
Usage:
```js
unique([1, 2, 3, 2, 3, 4, 3, 2, 1, 3]); // [1, 2, 3, 4]

let a = {a: 3};
let b = {b: 4};
let c = {c: 5};
unique([a, a, b, c, b]); // [a, b, c]

unique([1, '1', 2, '2', 3, 2]); // [1, '1', 2, '2', 3]

// declaring sorted array for performance
unique([1, 1, '1', 2, 2, 5, '5', '5'], true); // [1, '1', 2, 5, '6']

// declaring strings array for performance
unique(['a', 'c', 'b', 'c', 'a'], false, true); // ['a', 'b', 'c']
```

### flatten-it

```js
function flatten(arr) {
  let result = [];
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    let elem = arr[i];
    if (Array.isArray(elem)) {
      result.push.apply(result, flatten(elem));
    } else {
      result.push(elem);
    }
  }
  return result;
}
```
Usage:
```js
flatten([[1, [2, 3]], [[4, 5], 6, 7, [8, 9]]]);
// [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### insert

```js
function insert(arr1, arr2, index) {
  if (!Array.isArray(arr2)) {
    arr2 = [arr2];
  }
  if (!index) {
    return arr2.concat(arr1);
  }
  let front = arr1.slice(0, index);
  let back = arr1.slice(index);
  return front.concat(arr2, back);
}
```
Usage:
```js
insert([1, 2, 5, 6], ['a', 'c', 'e'], 2); // [1, 2, 'a', 'c', 'e', 5, 6]
insert([1, 2, 5, 6], 'a', 2); // [1, 2, 'a', 5, 6]
insert([1, 2, 5, 6], ['a', 'c', 'e'], 0); // ['a', 'c', 'e', 1, 2, 5, 6]
insert([1, 2, 5, 6], ['a', 'c', 'e']); // ['a', 'c', 'e', 1, 2, 5, 6]
```

### intersect

```js
function intersect(arr1, arr2) {
  let result = [];
  let len = arr1.length;
  for (let i = 0; i < len; i++) {
    let elem = arr1[i];
    if (arr2.indexOf(elem) > -1) {
      result.push(elem);
    }
  }
  return result;
}
```
Usage:
```js
intersect([1, 2, 5, 6], [2, 3, 5, 6]); // [2, 5, 6]
```

### compact

```js
function compact(arr) {
  if (!Array.isArray(arr)) {
    return undefined;
  }
  let result = [];
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    let elem = arr[i];
    if (elem) {
      result.push(elem);
    }
  }
  return result;
}
```
Usage:
```js
compact([1, null, 2, undefined, null, NaN, 3, 4, false, 5]); // [1, 2, 3, 4, 5]
compact([1, 2, [], 4, {}]); // [1, 2, [], 4, {}]
compact([]); // []
compact({}); // undefined
```

### last

```js
function last(arr) {
  return arr != null ? arr[arr.length - 1] : undefined;
}
```
Usage:
```js
last([1, 2, 3, 4, 5]); // 5
last([{a: 1}, {b: 1}, {c: 1}]); // {c: 1}
last([true, false, [true, false]]); // [true, false]
last(); // undefined
last([]); // undefined
last(null); // undefined
last(undefined); // undefined
```

### tail

```js
function tail(arr) {
  return arr != null ? arr.slice(1) : undefined;
}
```
Usage:
```js
tail([1, 2, 3, 4, 5]); // [2, 3, 4, 5]
tail([{a: 1}, {b: 1}, {c: 1}]); // [{b: 1}, {c: 1}]
tail([true, false, [true, false]]); // [false, [true, false]]
tail([]); // []
tail(); // undefined
tail(null); // undefined
tail(undefined); // undefined
```

### random

```js
function random(arr) {
  return arr != null ? arr[Math.floor(Math.random() * arr.length)] : undefined;
}
```
Usage:
```js
random([1, 2, 3]); // one of [1, 2, 3], at random
```

### shuffle

```js
function shuffle(arr) {
  if (!arr || !('length' in arr)) {
    return undefined;
  }
  let len = arr.length;
  let result = Array(len);
  for (let i = 0, rand; i < len; i++) {
    rand = Math.floor(Math.random() * i);
    if (rand != i) {
      result[i] = result[rand];
    }
    result[rand] = arr[i];
  }
  return result;
}
```
Usage:
```js
shuffle([1, 2, 3]); // array with original elements randomly sorted
shuffle([1]); // [1]
shuffle(); // undefined
shuffle(undefined); // undefined
shuffle(null); // undefined
shuffle({}); // undefined
```

### range

```js
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (step == null) {
    step = stop > start ? 1 : -1;
  }
  let toReturn = [];
  let increasing = start < stop; //← here’s the change
  for (; increasing ? start < stop : start > stop; start += step) {
    toReturn.push(start);
  }
  return toReturn;
}
```
Usage:
```js
range(1, 5); // [1, 2, 3, 4]
range(5); // [0, 1, 2, 3, 4]
range(-5); // [0, -1, -2, -3, -4]
range(0, 20, 5) // [0, 5, 10, 15]
```

### remove

```js
function remove(arr1, arr2) {
  let result = [];
  let len = arr1.length;
  for (let i = 0; i < len; i++) {
    let elem = arr1[i];
    if (arr2.indexOf(elem) == -1) {
      result.push(elem);
    }
  }
  return result;
}
```
Usage:
```js
remove([1, 2, 3, 4, 5, 6], [1, 3, 6]); // [2, 4, 5]
```

### union

```js
function union(arr1, arr2) {
  let result = arr1.concat([]);
  let len = arr2.length;
  for (let i = 0; i < len; i++) {
    let elem = arr2[i];
    if (arr1.indexOf(elem) == -1) {
      result.push(elem);
    }
  }
  return result;
}
```
Usage:
```js
union([1, 2, 5, 6], [2, 3, 4, 6]); // [1, 2, 3, 4, 5, 6]
```

## Strings

### template

```js
function template(string, data) {
  let proxyRegEx = /\{\{([^\}]+)?\}\}/g;
  return string.replace(proxyRegEx, function (_, key) {
    let keyParts = key.split('.');
    let value = data;
    for (let i = 0; i < keyParts.length; i++) {
      value = value[keyParts[i]];
    }
    return value || '';
  });
}
```
Usage:
```js
const data = {
  a: {
    aa: {
      aaa: 'apple',
      bbb: 'pear'
    },
    bb: 'orange'
  },
  b: 'plum'
};
template('2 ${a.aa.aaa}s, a ${a.aa.bbb}, 3 ${a.bb}s and a ${b}. Yes 1 ${a.aa.bbb}.', data);
// '2 apples, a pear, 3 oranges and a plum. Yes 1 pear.'
```

### truncate

```js
function truncate(str, length, end) {
  if ((length == null) || (length >= str.length)) {
    return str;
  }
  if (end == null) {
    end = '...';
  }
  return str.slice(0, Math.max(0, length - end.length)) + end;
}
```
Usage:
```js
truncate('when shall we three meet again', 9); // 'when s...'
truncate('when shall we three meet again', 12, ' (etc)'); // 'when s (etc)'
truncate('when shall we', 15,); // 'when shall we'
truncate('when shall we', 15, '(more)'); // 'when shall we'
truncate('when shall we', 10, ' (etc etc etc)'); // ' (etc etc etc)'
```

### prune

```js
function prune(str, length, end) {
  if ((length == null) || (length >= str.length)) {
    return str;
  }
  if (end == null) {
    end = '...';
  }
  let remnantPlusOne = str.slice(0, Math.max(0, length - end.length) + 1);
  let lastSpace = Math.max(0, remnantPlusOne.lastIndexOf(' '));
  return remnantPlusOne.slice(0, lastSpace) + end;
}
```
Usage:
```js
prune('when shall we three meet again', 7); // 'when...'
prune('when shall we three meet again', 7, ' (more)'; // 'when (more)'
prune('when shall we', 15,); // 'when shall we'
prune('when shall we', 15, ' (etc)'); // 'when shall we'
prune('when shall we', 7, ' (more)'); // ' (more)'
```

### squash

```js
let escapeSequencesRegex = /\s/g;
let spacesRegex = / /g;

function squash(str, squashEscapeSequences) {
  if (squashEscapeSequences) {
    return str.replace(escapeSequencesRegex, '');
  } else {
    return str.replace(spacesRegex, '');
  }
}
```
Usage:
```js
squash('the cat sat on the mat'); // 'thecatsatonthemat'
squash(' the cat sat on the mat '); // 'thecatsatonthemat'
squash('\tthe cat\n sat \fon \vthe \rmat '); // '\tthecat\nsat\fon\vthe\rmat'
squash('\tthe cat\n sat \fon \vthe \rmat ', true); // 'thecatsatonthemat'
squash(`the cat
sat on the mat`, true); // thecatsatonthemat
```

### left-pad

```js
function leftPad(str, length, char) {
  str = String(str);

  if (!length || length <= str.length) {
    return str;
  }

  let arr = [];
  if (char == null) {
    char = ' ';
  }

  let count = length;
  while(count--) {
    arr.push(char);
  }

  arr.push(str);
  return arr.join('').slice(-length);
}
```
Usage:
```js
leftPad('hello', 9); // '    hello'
leftPad('hello', 3); 'hello'
leftPad('hello', 9, '.'); '....hello'
leftPad(['hello'], 7, '_'); '__hello'
leftPad(null, 7); '   null'
```

### right-pad

```js
function rightPad(str, length, char) {
  str = String(str);

  if (!length || length <= str.length) {
    return str;
  }

  let arr = [];
  if (char == null) {
    char = ' ';
  }

  arr.push(str);

  let count = length;
  while(count--) {
    arr.push(char);
  }

  return arr.join('').slice(0, length);
}
```
Usage:
```js
rightPad('hello', 9); // 'hello    '
rightPad('hello', 3); 'hello'
rightPad('hello', 9, '.'); 'hello....'
rightPad(['hello'], 7, '_'); 'hello__'
rightPad(null, 7); 'null '
```

### camel-case

```js
// any combination of spaces and punctuation characters
// thanks to http://stackoverflow.com/a/25575009
let wordSeparators = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/;

function camelCase(str) {
  let words = str.split(wordSeparators);
  let len = words.length;
  let mappedWords = new Array(len);
  for (let i = 0; i < len; i++) {
    let word = words[i];
    if (word === '') {
      continue;
    }
    let firstLetter = word[0];
    if (i > 0) {
      firstLetter = firstLetter.toUpperCase();
    }
    mappedWords[i] = firstLetter + word.slice(1);
  }
  return mappedWords.join('');
}
```
Usage:
```js
camelCase('the quick brown fox'); // 'theQuickBrownFox'
camelCase('the_quick_brown_fox'); // 'theQuickBrownFox'
camelCase('the-quick-brown-fox'); // 'theQuickBrownFox'
camelCase('theQuickBrownFox'); // 'theQuickBrownFox'
camelCase('thequickbrownfox'); // 'thequickbrownfox'
camelCase('the - quick * brown# fox'); // 'theQuickBrownFox'
camelCase('theQUICKBrownFox'); // 'theQUICKBrownFox'
```

### kebab-case

```js
// any combination of spaces and punctuation characters
// thanks to http://stackoverflow.com/a/25575009
let wordSeparators = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/;
let capitals = /[A-Z\u00C0-\u00D6\u00D9-\u00DD]/g;

function kebabCase(str) {
  //replace capitals with space + lower case equivalent for later parsing
  str = str.replace(capitals, function (match) {
    return ' ' + (match.toLowerCase() || match);
  });
  return str.trim().split(wordSeparators).join('-');
}
```
Usage:
```js
kebabCase('the quick brown fox'); // 'the-quick-brown-fox'
kebabCase('the-quick-brown-fox'); // 'the-quick-brown-fox'
kebabCase('the_quick_brown_fox'); // 'the-quick-brown-fox'
kebabCase('theQuickBrownFox'); // 'the-quick-brown-fox'
kebabCase('theQuickBrown Fox'); // 'the-quick-brown-fox'
kebabCase('thequickbrownfox'); // 'thequickbrownfox'
kebabCase('the - quick * brown# fox'); // 'the-quick-brown-fox'
kebabCase('theQUICKBrownFox'); // 'the-q-u-i-c-k-brown-fox'
```

### snake-case

```js
// any combination of spaces and punctuation characters
// thanks to http://stackoverflow.com/a/25575009
let wordSeparators = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/;
let capitals = /[A-Z\u00C0-\u00D6\u00D9-\u00DD]/g;

function snakeCase(str) {
  //replace capitals with space + lower case equivalent for later parsing
  str = str.replace(capitals, function (match) {
    return ' ' + (match.toLowerCase() || match);
  });
  return str.trim().split(wordSeparators).join('_');
}
```
Usage:
```js
snakeCase('the quick brown fox'); // 'the_quick_brown_fox'
snakeCase('the-quick-brown-fox'); // 'the_quick_brown_fox'
snakeCase('the_quick_brown_fox'); // 'the_quick_brown_fox'
snakeCase('theQuickBrownFox'); // 'the_quick_brown_fox'
snakeCase('theQuickBrown Fox'); // 'the_quick_brown_Fox'
snakeCase('thequickbrownfox'); // 'thequickbrownfox'
snakeCase('the - quick * brown# fox'); // 'the_quick_brown_fox'
snakeCase('theQUICKBrownFox'); // 'the_q_u_i_c_k_brown_fox'
```

## Numbers

### clamp

```js
function clamp(lower, n, higher) {
  if (!Number(n)) {
    n = 0;
  }
  if (n < lower) {
    return lower;
  }
  if (n > higher) {
    return higher;
  }
  return n;
}
```
Usage:
```js
let n = 5;
clamp(1, n, 12); // 5
clamp(1, n, 3); // 3
clamp(8, n, 9); // 8
clamp(0, n, 0); // 0
n = undefined;
clamp(3, n, 8); // 3
n = null;
clamp(3, n, 8); // 3
n = NaN;
clamp(3, n, 8); // 3
```

### Functions

### compose

```js
function compose(fn1, fn2/*, fn3, etc */) {
  if (!arguments.length) {
    throw new Error('expected at least one (and probably more) function arguments');
  }
  let fns = arguments;

  return function () {
    let result = fns[0].apply(this, arguments);
    let len = fns.length;
    for (let i = 1; i < len; i++) {
      result = fns[i].call(this, result);
    }
    return result;
  };
};
```
Usage:
```js
const sqRootBiggest = compose(Math.max, Math.sqrt, Math.trunc);
sqRootBiggest(10, 5); // 3
sqRootBiggest(7, 0, 16); // 4
```

### curry-it

```js
function curry(fn /*, arg1, arg2 etc */) {
  let curriedArgs = [].slice.call(arguments, 1);
  if (!curriedArgs.length) {
    return fn;
  }
  return function () {
    return fn.apply(this, curriedArgs.concat([].slice.call(arguments)));
  };
}
```
Usage:
```js
function converter(ratio, input) {
  return (input*ratio).toFixed(1);
}
const milesToKm = curry(converter, 1.62);
milesToKm(35); // 56.7
milesToKm(10); // 16.2
```

### partial-it

```js
function partial(fn /*, arg1, arg2 etc */) {
  let partialArgs = [].slice.call(arguments, 1);
  if (!partialArgs.length) {
    return fn;
  }
  return function () {
    let argIndex = 0, derivedArgs = [];
    for (let i = 0; i < partialArgs.length; i++) {
      let thisPartialArg = partialArgs[i];
      derivedArgs[i] = thisPartialArg === undefined ? arguments[argIndex++] : thisPartialArg;
    }
    return fn.apply(this, derivedArgs);
  };
}
```
Usage:
```js
const cubedRoot = partial(Math.pow, undefined, 1/3);
cubedRoot(10).toFixed(1); // 56.7
cubedRoot(35).toFixed(1); // 16.2
```
<!--
## Testing


<iframe src="tests/index.html" frameborder="0" style="width:100%;height:480px;"></iframe>
-->