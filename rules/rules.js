const CACHE = {};

const init = async() => {
	const burgerButton = document.querySelector('#header button');
	
	burgerButton.addEventListener('click', () => {
		menu.classList.toggle('opened');
	});

	document.body.addEventListener('click', (event) => {		
		const image = document.querySelector('#image');
		if (event.target === image) {
			document.body.classList.remove('lock');
			image.classList.remove('showed');
			return;
		}
		if (event.target.tagName !== 'IMG') {
			return;
		}
		if (image.className.includes('showed')) {
			document.body.classList.remove('lock');
			image.classList.remove('showed');
			return;
		}
		document.body.classList.add('lock');
		image.querySelector('img').src = event.target.src;
		image.classList.add('showed');		
	});

	const { text, meta, content } = await getRules();

	render({ meta, content });	

	/*if (location.hostname === '127.0.0.1') {
		CACHE.text = text;

		let intervalId = runDev();

		document.addEventListener('visibilitychange', function (event) {
			if (document.hidden) {
				clearInterval(intervalId)
			} else {
				intervalId = runDev();
			}
		});
	}*/
};

function runDev() {
	return setInterval(async() => {
		const rules = await getRules();
		if (rules.text !== CACHE.text) {
			CACHE.text = rules.text;
			render(rules);
		}
	}, 1000);
}

async function getRules() {
	const [,, folder] = location.pathname.split('/');
	const text = document.querySelector('script[type="text/markdown"]').textContent;
	const [, metaText, content] = text.split('---').map((t) => t.trim());
	const meta = Object.fromEntries(metaText.split('\n').map((t) => t.split(':').map((t) => t.trim())));
	return { text, meta, content };
};

function render({ meta, content }) {	
	console.log('render()');
	document.title = meta.Title || 'Правила гри';
	const html = marked.parse(content);

	const outlet = document.querySelector('#outlet');
	const menu = document.querySelector('#menu');

	outlet.innerHTML = html;

	document.querySelectorAll('h1, h2').forEach((el) => {
		el.id = t11e(el.textContent);
		const link = document.createElement('a');
		link.href = '#' + el.id;
		link.textContent = el.textContent;
		link.className = el.tagName;
		// link.addEventListener('click', )
		menu.appendChild(link);
	});
}

function t11e(text) {
  var rus = [
  	'ї', 'і', 'є',
    'щ', 'ш', 'ч', 'ц', 'ю', 'я', 'ж',
    'э', 'а', 'б', 'в', 'г', 'д', 'е', 'з', 'и', 'й',
    'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у',
    'ф', 'х', ' ', '[^\\w\\d]'
  ];
  var eng = [
  	'i', 'i', 'e',
    'shh', 'sh', 'ch', 'cz', 'yu', 'ya', 'zh',
    'e', 'a', 'b', 'v', 'g', 'd', 'e', 'z', 'y', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u',
    'f', 'h', '_', '_'
  ];
  text = text.toLowerCase();
  for (var x = 0; x < rus.length; x++) {
    text = text.replace(new RegExp(rus[x], 'g'), eng[x]);
  }
  return text;
}


init();
