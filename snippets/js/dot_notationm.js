function dot(obj, key) {
  if (key.split) key = key.split('.');
  for (var i=0; i<key.length && obj; i++) obj = obj[key[i]];
  return obj;
}
