let DATA;

try {
  DATA = JSON.parse(localStorage['dummy-data']);
} catch (exception) {}

if (!DATA) {
  DATA = {
    company: "Umbrella Corp.;United States;Rockford;2748 Bowman Road",
    amount: [-10000, 10000],
    date: ['2025-01-01', '2025-05-01'],
    rows: 10,
    contacts: `Kemmer-Pfeffer;Poland;Zielona Góra;66 Golden Leaf Street
  Von Inc;France;Troyes;917 Badeau Lane
  Tromp-Padberg;Poland;Brzączowice;9753 Homewood Drive
  Crooks, Connelly and Rodriguez;Poland;Jedlnia-Letnisko;448 Springview Circle
  Prohaska-Gislason;United States;Memphis;13 Waywood Crossing
  Walter Group;Poland;Nowy Staw;15621 Anniversary Hill
  O'Keefe-Lynch;Germany;Berlin;1815 2nd Junction
  Heaney and Sons;Poland;Szczurowa;594 Truax Parkway
  Bergnaum-Rutherford;Poland;Babice;69473 Heath Road
  Lockman, Klein and Rempel;Poland;Siemiatycze;825 Crescent Oaks Circle
  Hamill, Purdy and Rogahn;Poland;Łęki Szlacheckie;805 Debra Crossing
  Prohaska, King and Bins;France;Arras;72 Birchwood Trail
  Hilll-Dibbert;France;Quimper;01931 Golf View Avenue
  Reilly, Dooley and Barton;France;Caen;392 Dryden Place
  Towne, Stroman and Wintheiser;France;Mulhouse;3706 Oakridge Crossing
  O'Kon-Hilll;France;Arles;4 Fuller Junction
  Feest-Dicki;France;Colombes;880 Londonderry Pass
  Lang, Veum and Kemmer;Poland;Sławoborze;90266 Rowland Parkway
  Ullrich Group;United States;Greensboro;30 Maple Wood Avenue
  Jacobi-Tillman;United States;Alexandria;437 Mayfield Alley
  Kassulke Inc;United States;Glendale;7 Farwell Center
  Doyle-Predovic;Poland;Trawniki;466 Dryden Trail
  Feeney-Hegmann;United States;Santa Rosa;59662 7th Street
  Block-Russel;Poland;Przewóz;29500 Hanson Trail
  Zieme Group;United States;Round Rock;776 Forest Crossing
  Krajcik, Bartell and Douglas;France;Paris 01;118 Westport Plaza
  Sawayn Group;Poland;Wojciechów;3 Mendota Trail
  Gutkowski Inc;France;Fresnes;4632 Dakota Circle
  Pagac, Macejkovic and Kulas;Poland;Łapsze Niżne;55389 Victoria Court
  Waelchi Inc;Germany;Berlin;5 Golf Avenue
  Botsford Group;Poland;Łodygowice;3380 Charing Cross Pass
  Senger and Sons;France;Cesson;67 Aberg Court
  Lebsack LLC;France;Saint-Dizier;0120 Tomscot Alley
  Weissnat, Feeney and Botsford;United States;Punta Gorda;1 Talmadge Trail
  Stiedemann, Medhurst and Lesch;France;Orléans;204 Golden Leaf Way
  Lowe Inc;Poland;Rokietnica;2 Hazelcrest Pass
  Dickinson-Windler;France;Le Mans;0795 Carey Junction
  Bashirian and Sons;Poland;Rudziczka;392 Fieldstone Alley
  Emmerich Inc;Poland;Malanów;1 Grayhawk Street
  Monahan, Volkman and Swaniawski;Poland;Kazimierz Dolny;3 Mcguire Parkway
  Sauer Group;United States;Springfield;298 Stang Parkway
  Kreiger LLC;United States;Pasadena;936 Beilfuss Avenue
  VonRueden Inc;Poland;Belsk Duży;54 Westerfield Court
  Russel, Spencer and Bartell;Poland;Stare Kurowo;23 Carey Street
  Thompson-Kuhic;Poland;Bełżec;42 Grim Parkway
  Tromp Group;Poland;Tuchomie;074 Dakota Parkway
  Kshlerin-Lehner;Poland;Milanówek;521 John Wall Center
  Bednar-Christiansen;United Kingdom;London;4601 Coleman Plaza
  Anderson-Hickle;France;Romans-sur-Isère;3 Kropf Road
  Gerhold Inc;France;Strasbourg;255 Garrison Parkway
  Towne LLC;Poland;Kostrzyn nad Odrą;5 Delaware Circle
  Abernathy and Sons;United States;Detroit;518 Eagle Crest Point
  Heathcote-Turner;Poland;Bogatynia;3 Sutherland Avenue
  Schmeler LLC;United States;Erie;0094 Tomscot Avenue
  Kovacek-Kuvalis;France;Orsay;4 Warrior Center
  Volkman, Barton and Abshire;Poland;Kup;5 Nevada Park
  Zboncak-McGlynn;United States;North Little Rock;45 Fisk Point
  Bartoletti-Daugherty;Germany;Münster;0 Morning Parkway
  Collier, Schneider and Nader;United States;Naples;876 Green Ridge Circle
  Terry-Turner;France;Paris 18;16461 Springs Trail
  Breitenberg-Gerhold;Poland;Sietesz;182 Harbort Park
  Barton and Sons;United States;Durham;87 Montana Point
  Goodwin, Bartell and Steuber;Poland;Przybyszówka;6523 Myrtle Parkway
  McClure-Bergnaum;France;Le Havre;8 Declaration Court
  Wisoky, Senger and Dickens;France;Goussainville;29560 Summit Terrace
  Herman, Klocko and Blick;Poland;Białobrzegi;5 Pond Way
  Gottlieb, Zemlak and Krajcik;France;Avranches;268 Maryland Avenue
  Hermiston and Sons;France;Toulon;36536 Eastwood Terrace
  Gleason, Nienow and Corwin;United States;Beaufort;4679 Eggendart Way
  Rodriguez-Prohaska;United States;Arlington;93 John Wall Alley
  Romaguera-Wintheiser;France;Fresnes;5 Rowland Park
  Johnston-Frami;France;Paris 15;632 Melby Parkway
  Schmitt, Braun and Reynolds;United Kingdom;Marston;155 Fordem Way
  Baumbach-Hessel;France;Créteil;3001 Lakeland Way
  Walsh Inc;United States;Denton;47159 Memorial Street
  Toy-Carroll;United Kingdom;Walton;783 Maple Wood Alley
  Sawayn, Lehner and Mayer;Poland;Budzów;08726 Cottonwood Drive
  Dach-Stark;Poland;Plewiska;332 Monterey Plaza
  Miller LLC;France;Flers;29519 Hoepker Circle
  Wiegand Group;Poland;Chwałowice;3 Northview Junction
  Ernser-Labadie;Poland;Góra Kalwaria;3 Shasta Road
  Strosin, Mueller and Tremblay;France;Orléans;2 Wayridge Road
  Kiehn LLC;United Kingdom;London;7 Holy Cross Point
  Bartoletti and Sons;Poland;Gnieżdżewo;11 Morning Point
  Turcotte, Walsh and Krajcik;Poland;Przyborów;3215 Jenna Park
  Welch and Sons;Poland;Domaniewice;60 Merrick Avenue
  Renner Inc;France;Saint-Avold;562 Armistice Parkway
  Runolfsson-Nolan;Poland;Książki;44458 Hauk Place
  Bergstrom-Gleichner;Poland;Tyrawa Wołoska;382 Shopko Park
  Shields, Bernhard and Fay;France;Dijon;39147 8th Parkway
  Lind, Kirlin and Morar;Poland;Piasek;602 Graedel Court
  Ondricka-Murray;Poland;Łęczyce;6324 Mariners Cove Trail
  VonRueden, Rohan and D'Amore;United States;Portland;5 Redwing Parkway
  Daugherty-Harvey;France;Argenteuil;130 Florence Point
  Legros and Sons;Germany;Mülheim an der Ruhr;312 Carey Avenue
  Donnelly Inc;Poland;Łubowo;5715 Fuller Avenue
  Veum, Medhurst and Ledner;France;Martigues;88 Russell Terrace
  Larkin, Von and Lemke;United States;Valdosta;2 Little Fleur Place
  Kreiger, Ullrich and Klocko;Poland;Świecie nad Osą;82 Cordelia Junction
  Vandervort Group;United States;Chicago;1 Maryland Plaza`,
    descriptions: `Coffee shop morning purchase;Online book store payment;Monthly gym membership fee;Uber ride downtown trip;Late night pizza delivery;Streaming service subscription charge;Grocery store weekly shopping;Lunch at local bistro;Gas station fuel refill;Mobile phone bill payment;Public transport metro card;Bakery fresh bread purchase;Pharmacy medicine and supplies;Movie theater ticket purchase;Fast food drive-thru lunch;Hotel room booking deposit;Music app monthly subscription;Electronics store headphones buy;Convenience store midnight snacks;Donation to animal shelter;New shoes online order;Hardware store DIY tools;Flower shop birthday bouquet;Gift shop souvenir items;Airport taxi fare payment;Monthly savings account transfer;Credit card interest charge;Office supplies bulk purchase;Streaming rental movie charge;Pet store dog food;Airline ticket booking confirmation;Monthly insurance auto premium;Library overdue fine charge;Electric bill online payment;Coffee beans online order;Monthly fitness app charge;Water utility bill payment;Online course registration fee;Music concert ticket booking;Gaming platform new purchase;Charity monthly donor subscription;Magazine digital issue charge;Clothing store jeans purchase;Craft store art supplies;Rental car security deposit;Gadget store phone case;Breakfast diner weekend meal;Furniture shop lamp order;New tablet pre-order payment;Beauty salon haircut payment;Sushi restaurant dinner bill;Tech repair service charge;Winter jacket online purchase;Dog grooming appointment payment;Yoga studio class pass;Craft beer brewery tasting;Office coworking space rent;Stationery store notebook pack;Vegan cafe salad order;Photography gear online buy;Dentist appointment co-payment;Courier delivery service fee;Outdoor gear camping tent;Marketplace seller payout transfer;Tax refund bank deposit;Holiday resort booking fee;Birthday party supply purchase;Taxi app evening fare;VPN service yearly payment;Digital drawing app subscription;Weekend brunch food bill;Luggage store travel bag;Flight seat selection fee;Organic food market purchase;Sports ticket stadium entry;Bus pass top-up recharge;Foreign exchange currency transaction;Laptop accessories bundle order;Back-to-school supplies charge;Kids toy store payment;Spa massage therapy appointment;Internet provider monthly bill;Museum admission ticket purchase;Smartwatch online checkout payment;Gift card store redemption;Shoe repair shop payment;Streaming service late charge;Bookstore educational materials buy;Meal delivery service tip;Board game online purchase;Business software license renewal;Gourmet chocolate gift box;Online charity donation made;Park entrance day pass;Theme park ride tickets;Clothing boutique sale item;Finance app premium plan;Used book marketplace order;Tailor custom suit deposit;Solar panel installation charge;Vintage vinyl store buy;Therapist session invoice charge;Car wash quick service;Craft fair handmade jewelry;Digital camera online deal.`
  };
}

const companyInput = q('.company');
const amountFromInput = q('.amount-from');
const amountToInput = q('.amount-to');
const dateFromInput = q('.date-from');
const dateToInput = q('.date-to');
const qboButton = q('.qbo');
const xeroButton = q('.xero');
const templateScript = q('.template');
// const contactsInput = q('.contacts');

companyInput.value = DATA.company;
amountFromInput.value = DATA.amount[0];
amountToInput.value = DATA.amount[1];
dateFromInput.value = DATA.date[0];
dateToInput.value = DATA.date[1];
// contactsInput.value = DATA.contacts;

const contacts = DATA.contacts.split('\n').map((s) => s.split(';'));
const descriptions = DATA.descriptions.split(";");
const invoiceTemplate = template(templateScript.textContent);
const clients = [];
const vendors = [];

let TSX = getRandomTransactions();

contacts.forEach((c) => {
  if (Math.random() > 0.5) {
    clients.push(c);
  } else {
    vendors.push(c);
  }
});

qboButton.addEventListener('click', () => loadCsv('qbo', TSX));
xeroButton.addEventListener('click', () => loadCsv('xero', TSX));

document.querySelectorAll('input').forEach((el) => {
  el.addEventListener('input', handleInputChange);
});

renderTable(TSX);

function handleInputChange({ target }) {
  switch (target.getAttribute('class')) {
    case 'company':
      DATA.company = target.value.trim();
      break;
    case 'amount-from': {
      const n = Number(target.value);
      if (!isNaN(n)) DATA.amount[0] = n;
      break;
    }
    case 'amount-to': {
      const n = Number(target.value);
      if (!isNaN(n)) DATA.amount[1] = n;
      break;
    }
    case 'date-from': {
      const n = new Date(target.value);
      if (!isNaN(n)) DATA.date[0] = n;
      break;
    }
    case 'amount-to': {
      const n = new Date(target.value);
      if (!isNaN(n)) DATA.date[1] = n;
      break;
    }
    break;
  }

  clearTimeout(handleInputChange.timeout);

  handleInputChange.timeout = setTimeout(() => {
    console.log(1);
    localStorage['dummy-data'] = JSON.stringify(DATA);
    TSX = getRandomTransactions();

    renderTable(TSX);
  }, 1000);
}

function renderTable(tsx) {
  const tableBody = q('table tbody');
  tableBody.innerHTML = '';

  tsx.forEach((t, index) => {
    tableBody.appendChild(
      h('tr', null,
        h('td', null, t[0]),
        h('td', null, t[1]),
        h('td', null, t[2]),
        h('td', null, h('button', { onclick: () => handleDownloadDocClick(index) }, 'Document')),
      )
    );
  });
}

function getRandomTransactions() {
  const result = [];

  for (let i = 0; i < DATA.rows; i++) {
    result.push([
      getRandDate(DATA.date[0], DATA.date[1]),
      getRandomArrayItem(descriptions),
      getRandomInt(DATA.amount[0] * 100, DATA.amount[1] * 100) / 100
    ]);
  }

  return result;
}

function loadCsv(platform, tsx) {
  const csv = [
    `${platform === 'xero' ? '*Date,*Amount,Description' : 'Date,Description,Amount'}`,
    ...tsx.map(([date, desc, amount]) => {
      return [date, `"${desc}"`, amount].join(",")
    })
  ].join('\n');

  downloadFile(csv, `${platform}-${(new Date()).toISOString()}.csv`);
}

async function handleDownloadDocClick(index) {
  const [date, description, amount] = TSX[index];
  const element = q('.invoice-wrapper');
  const company = DATA.company.split(";");
  const typeInvoice = amount > 0;
  const contact = getRandomArrayItem(typeInvoice ? clients : vendors);
  const today = new Date();
  const dueDate = formatDate(new Date(+parseDate(date) + 14 * 24 * 60 * 60 * 1000));
  const companyData = {
    name: company[0],
    country: company[1],
    city: company[2],
    address: company[3],
  };
  const contactData = {
    name: contact[0],
    country: contact[1],
    city: contact[2],
    address: contact[3],
  };

  element.innerHTML = invoiceTemplate({
    num: `INV-${(today.getMonth() + 1).toString().padStart(2, 0)}-${today.getDate()}-${getRandomInt(0, 1000000).toString(36).toUpperCase()}`,
    from: typeInvoice ? companyData : contactData,
    to: typeInvoice ? contactData : companyData,
    date,
    dueDate,
    description,
    amount,
    quantity: getRandomArrayItem([1,2,10])
  });
  element.style.display = "block";
  html2pdf().from(element).save(`${(new Date()).toISOString()}.pdf`);
}

function getRandDate(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const randomDate = new Date(toDate - getRandomInt(0, toDate - fromDate));

  return formatDate(randomDate);
}

function formatDate(date) {
  return [
    (date.getMonth() + 1).toString().padStart(2, 0),
    date.getDate().toString().padStart(2, 0),
    date.getFullYear()
  ].join("/");
}

function parseDate(string) {
  const [m, d, y] = string.split("/");
  return new Date(+y, m - 1, +d);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayItem(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function h(name, attrs, ...children) {
  const el = document.createElement(name);
  if (attrs) {
    for (let p in attrs) {
      el[p] = attrs[p];
    }
  }
  if (children.length) {
    children.forEach((c) => {
      el.appendChild((typeof c === "string" || typeof c === "number") ? document.createTextNode(c) : c)
    });
  }

  return el;
}

function q(a) {
  return document.querySelector(a)
}

function downloadFile(text, name) {
  try {
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
  } catch (exception) {}
}

function template(text) {
  const _ = {};
  const settings = {
    evaluate: /{%([\s\S]+?)%}/g,
    interpolate: /{%=([\s\S]+?)%}/g,
    escape: /{%-([\s\S]+?)%}/g
  };
  var noMatch = /(.)^/;
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };
  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  _.escape = function(string) {
    if (string == null) return '';
    return ('' + string).replace(/[&<>"']/g, function(match) {
      return entityMap[match];
    });
  }

  var matcher = RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join('|') + '|$', 'g');

  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escaper, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }

    return match;
  });
  source += "';\n";

  if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

  source = "var __t,__p='',__j=Array.prototype.join," +
    "print=function(){__p+=__j.call(arguments,'');};\n" +
    source + 'return __p;\n';

  try {
    var render = new Function(settings.variable || 'obj', '_', source);
  } catch (e) {
    e.source = source;
    throw e;
  }

  var template = function(data) {
    return render.call(this, data, _);
  };

  var argument = settings.variable || 'obj';
  template.source = 'function(' + argument + '){\n' + source + '}';

  return template;
}
