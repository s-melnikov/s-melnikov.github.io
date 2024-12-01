class BBCode {
  constructor(codes) {
    this.codes = [];

    this.setCodes(codes);
  }
  parse(text) {
    return this.codes.reduce((text, code) => text.replace(code.regexp, code.replacement), text);
  }
  add(regex, replacement) {
    this.codes.push({
      regexp:    new RegExp(regex, 'igms'),
      replacement: replacement
    });

    return this;
  }
  setCodes(codes) {
    this.codes = Object.keys(codes).map(function (regex) {
      const replacement = codes[regex];

      return {
        regexp:    new RegExp(regex, 'igms'),
        replacement: replacement
      };
    }, this);

    return this;
  }
}

const parser = new BBCode({
  '\\[bo\\](.+?)\\[/bo\\]': '<b>$1</b>',
  '\\[it\\](.+?)\\[/it\\]': '<i>$1</i>',
  '\\[la\\](.+?)\\[/la\\]': '<div class="large">$1</div>',
  '\\[li\\](.+?)\\[/li\\]': '<div class="list">$1</div>',
  '\\[s\\]': '<img class="icon" src="images/s.png" />',
  '\\[d\\]': '<img class="icon" src="images/d.png" />',
  '\\[c\\]': '<img class="icon" src="images/c.png" />',
  '\\[h\\]': '<img class="icon" src="images/h.png" />',
  '\\[i\\]': '<img class="icon" src="images/i.png" />',
  '\\[t\\]': '<img class="icon" src="images/t.png" />',
  '\\[m\\]': '<img class="icon" src="images/m.png" />',
  '\\[r\\]': '<img class="icon" src="images/r.png" />',
  '\\[a\\]': '<img class="icon" src="images/a.png" />',
  '\\[b\\]': '<img class="icon" src="images/b.png" />',
  '\\[e\\]': '<img class="icon" src="images/e.png" />',
  '\\[~\\]': '<img class="icon" src="images/~.png" />',
  '\\[n\\]': '<img class="icon" src="images/n.png" />',
  '\\[\\*\\]': '<img class="icon" src="images/asteriks.png" />',
  '\\[\\+\\]': '<img class="icon" src="images/+.png" />',
  '\\[\\$\\]': '<img class="icon" src="images/$.png" />',
  '\\[#\\](.+?)\\[/#\\]': (str, match) => {
    return '<ul>'
      +match.split(". ").map((i) => '<li>'+i.trim()+'.</li>').join("")
    +'</ul>'
  },
  '\\[/#\\]': '',
  // '\\[color=(.+?)\\](.+?)\\[/color\\]':  '<span style="color:$1">$2</span>',
  // '\\[size=([0-9]+)\\](.+?)\\[/size\\]': '<span style="font-size:$1px">$2</span>',
  // '\\[img\\](.+?)\\[/img\\]': '<img src="$1">',
  // '\\[img=(.+?)\\]': '<img src="$1">',
  // '\\[email\\](.+?)\\[/email\\]':       '<a href="mailto:$1">$1</a>',
  // '\\[email=(.+?)\\](.+?)\\[/email\\]': '<a href="mailto:$1">$2</a>',
  // '\\[url\\](.+?)\\[/url\\]':                      '<a href="$1">$1</a>',
  // '\\[url=(.+?)\\|onclick\\](.+?)\\[/url\\]':      '<a onclick="$1">$2</a>',
  // '\\[url=(.+?)\\starget=(.+?)\\](.+?)\\[/url\\]': '<a href="$1" target="$2">$3</a>',
  // '\\[url=(.+?)\\](.+?)\\[/url\\]':                '<a href="$1">$2</a>',
  // '\\[a=(.+?)\\](.+?)\\[/a\\]': '<a href="$1" name="$1">$2</a>',
  // '\\[list\\](.+?)\\[/list\\]': '<ul>$1</ul>',
  // '\\[\\*\\](.+?)\\[/\\*\\]':   '<li>$1</li>'
});


const h = (a, b, ...c) => {
  const _c = c.flat(9).filter((d) => d !== null && d !== false); 
  if (typeof a === "string") {
  const e = document.createElement(a);
  if (b) for (let p in b) e[p] = b[p];
  if (_c.length) _c.forEach((d) => e.append(d)); 
  return e;
  }
  return a({ ...b, children: _c });
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const getData = (key) => {
  const n = (i) => {
  const e = {};
  window["webpackJsonpforgotten-waters"][0][1][i](e);
  return e.exports;
  };
  let Oe = {
    "ua/beyond": n(83),
    "ua/splendor": n(84),
    "ua/generic": n(82),
    "ua/dead": n(85),
    "ua/spoils": n(87),
    "ua/witch": n(86),
  };
  return Oe[key];
};

const DATA = {
  code: "ua",
  name: "\u0443\u043a\u0440\u0430\u0457\u0301\u043d\u0441\u044c\u043a\u0430",
  scenarioInfo: [{
  code: "beyond",
  title: "\xab\u0417\u0410 \u041a\u0420\u0410\u0404\u041c \u041e\u041a\u0415\u0410\u041d\u0423\xbb",
  images: [{ file: "cover-ua.fc1e8b12.jpg" }],
  entry_files: ["ua/beyond"]
  }, {
  code: "witch",
  title: "\xab\u0421\u0415\u0420\u0426\u0415 \u0412\u0406\u0414\u042c\u041c\u0418\xbb",
  images: [{ file: "cover-ua.07b677e4.jpg" }],
  entry_files: ["ua/witch"]
  }, {
  code: "splendor",
  title: "\xab\u0411\u0410\u0413\u0410\u0422\u0421\u0422\u0412\u0410 \u041f\u0420\u0418\u0420\u041e\u0414\u0418\xbb",
  images: [{ file: "cover-ua.8fb0f306.jpg" }],
  entry_files: ["ua/splendor"]
  }, {
  code: "dead",
  title: "\xab\u0416\u0418\u0412\u041e\u042e \u0410\u0411\u041e \u041c\u0415\u0420\u0422\u0412\u041e\u042e\xbb",
  images: [{ file: "cover-ua.5b65eebd.jpg" }],
  entry_files: ["ua/dead"]
  }, {
  code: "spoils",
  title: "\xab\u0422\u0420\u041e\u0424\u0415\u0407 \u041f\u0420\u041e\u041a\u041b\u042f\u0422\u0418\u0425\xbb",
  images: [{ file: "cover-ua.2bcca2fa.jpg" }],
  entry_files: ["ua/spoils"]
  }]
};

const getUsedIndexes = (data, indexes = []) => {
  data.forEach(({ content, subentries }) => {
    content.forEach(({ type, value }) => {
      if (type === "option" && !indexes.includes(value)) indexes.push(value);
    });
    getUsedIndexes(subentries, indexes);
  });

  return indexes;
};

const genericData = getData("ua/generic");

const translate = (key) => {
  return ({
    "backstory": "Передісторія",
    "backstory2": "Передісторія 2",
    "intro": "Вступ",
    "recap": "Наостанок",
  })[key] || key;
};

const GoTo = ({ index, letter, data }) => {
  const [firstIndex, ...rest] = index.split("-"); 
  const isGeneric = firstIndex === "gen";

  if (firstIndex === "setup") {
    return h("div", { className: "goTo" }, `(Перейдіть до "Приготування: ${translate(rest.join("."))}")`);
  }

  return h("div", { className: "goTo" }, `(Перейдіть до ${
    isGeneric ? `G-${rest.join(".")}` : `${index}`
  })`);
}

const Entry = ({ index, entry, letter, data, parent }) => {
  const { index: entryIndex, content, subentries } = entry;
  if (entryIndex === "setup" && index) return null;
  let optionIndex = 0;     
  const redirects = content.filter(({ type }) => type === "option" || type === "redirect");
  const [firstIndex, ...rest] = entryIndex.split("-"); 
  return [
  h("div", { className: "entry" }, 
    firstIndex === "setup" 
      ? h("h2", {}, `Приготування: ${rest.length ? `${translate(rest.join("."))}` : ""}`)
      : h(parent ? "h3" : "h2", { className: "entry_index" }, `${entryIndex.replace("gen", "G")}`),
    content.map(({ title, type, value }) => {
    if (type === "text") {
      return [
      !!title && h("div", { className: "title" }, title),
      h("p", { innerHTML: parser.parse(value) })
      ];
    }
    if (type === "option") {
      return h("div", { className: "option" }, 
      h("div", { className: "titile" }, 
        `${LETTERS[optionIndex++]}. ${title}`),
      h(GoTo, { index: value, letter, data })      
      )
    }
    if (type === "image") {
      return h("div", { className: "image" }, 
        !!title && h("div", { className: "title" }, title),
        h("img", { src: value })
      );
    }
    if (type === "redirect") {
      return h(GoTo, { index: value, letter, data });
    }
    return null;
    }),
    !redirects.length && !!content.length && h("div", { className: "return" }, "(Повертайтеся до локації)")
  ),
  ... (subentries 
    ? subentries.map((entry, index) => h(Entry, { index, entry, letter, data, parent: true })) 
    : []),
  ];
};

const render = () => {
  document.querySelector("#outlet").append(
  h("div", { id: "main" },
    [{}].map(({ images, entry_files }, i) => {
    const letter = LETTERS[i]; 
    const data = getData("ua/generic");
    // const usedIndexes = getUsedIndexes(data);

    console.log(letter, data);

    return h("div", { className: "section" }, 
      !!images && h("img", { className: "banner", src: `images/${images[0].file}`}),
      h("div", { className: "entries" }, 
        data.map((entry, index) => {
          // if (!usedIndexes.find((i) => i.split("-")[0] === entry.index)) return null;
          return h(Entry, { index, entry, letter, data });
        })
      )
    );    
    }),
  )
  ); 
};

render();