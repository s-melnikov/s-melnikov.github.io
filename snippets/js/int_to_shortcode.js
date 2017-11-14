function intToCode(id) {
  var chars = '123456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ',
    code = '';
  id = parseInt(id);

  if (isNaN(id)) throw Error('The "id" is not a valid integer');

  while (id > chars.length - 1) {
    code = chars[id % chars.length] + code;
    id = Math.floor(id / chars.length);
  }

  return chars[id] + code;
}
