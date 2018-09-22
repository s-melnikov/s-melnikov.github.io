function translit(text) {
  var rus = [
    "щ", "ш", "ч", "ц", "ю", "я", "ё", "ж", "ъ", "ы",
    "э", "а", "б", "в", "г", "д", "е", "з", "и", "й",
    "к", "л", "м", "н", "о", "п", "р", "с", "т", "у",
    "ф", "х", "ь", " ", "[^\\w\\d]"
  ];
  var eng = [
    "shh", "sh", "ch", "cz", "yu", "ya", "yo", "zh", "", "y",
    "e", "a", "b", "v", "g", "d", "e", "z", "i", "j",
    "k", "l", "m", "n", "o", "p", "r", "s", "t", "u",
    "f", "x", "", "_", "_"
  ];
  text = text.toLowerCase();
  for (var x = 0; x < rus.length; x++) {
    text = text.replace(new RegExp(rus[x], "g"), eng[x]);
  }
  return text;
}
