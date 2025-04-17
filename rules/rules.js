const init = async() => {
	const [,, folder] = location.pathname.split('/');
	const resp = await fetch(`./${folder}/rules.md`);
	const text = await resp.text();
	const [, metaText, contentText] = text.split('---').map((t) => t.trim());
	const meta = Object.fromEntries(metaText.split('\n').map((t) => t.split(':').map((t) => t.trim())));
	document.title = meta.Title || 'Правила гри';
	const content = marked.parse(contentText);

	const outlet = document.querySelector('#outlet');
	const burgerButton = document.querySelector('#header button');
	const menu = document.querySelector('#menu');

	outlet.innerHTML = content;
	burgerButton.addEventListener('click', () => {
		menu.classList.toggle('opened');
	});
	document.querySelectorAll('h1, h2').forEach((el) => {
		el.id = t11e(el.textContent);
		const link = document.createElement('a');
		link.href = '#' + el.id;
		link.textContent = el.textContent;
		link.className = el.tagName;
		menu.appendChild(link);
	});
};

function t11e(text) {
  var rus = [
  	"ї", "і", "є",
    "щ", "ш", "ч", "ц", "ю", "я", "ж",
    "э", "а", "б", "в", "г", "д", "е", "з", "и", "й",
    "к", "л", "м", "н", "о", "п", "р", "с", "т", "у",
    "ф", "х", " ", "[^\\w\\d]"
  ];
  var eng = [
  	"i", "i", "e",
    "shh", "sh", "ch", "cz", "yu", "ya", "zh",
    "e", "a", "b", "v", "g", "d", "e", "z", "y", "j",
    "k", "l", "m", "n", "o", "p", "r", "s", "t", "u",
    "f", "h", "_", "_"
  ];
  text = text.toLowerCase();
  for (var x = 0; x < rus.length; x++) {
    text = text.replace(new RegExp(rus[x], "g"), eng[x]);
  }
  return text;
}


init();
