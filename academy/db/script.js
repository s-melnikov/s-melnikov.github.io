// переменные запроса (имя базыб фильтраб сортировка)
// пример:
// ?db=kxa7ol8j&sortBy=userName&order=desc&country=France&offset=10&imit=5
// где:
// имя базы данных (db) - kxa7ol8j
// сортировать по (sortBy) - userName
// порядок сортировки (order) - обратный (desc)
// фильтр - страна (country) Франция (France)
// сдвиг (offset) - 10 записей
// лимит (limit) - 5 записей
const ENV = parseQueryString(window.location.search);

const saveButton = document.querySelector("#saveResult");

// узнаем, какие бызы данных существуют в локальном хранилище
handleStorageChange();

if (ENV.db && localStorage[ENV.db]) {
  openDb(ENV.db);
}

function handleCreateNewBDClick() {
  fetch("Users.json").then((r) => r.json()).then((response) => {
    localStorage[Date.now().toString(36)] = JSON.stringify(
      shuffle(response).map((item, index) => ({ ...item, id: index }))
    );
    handleStorageChange();
  });  
}

function openDb(name) {
  const table = document.querySelector("#dbTable");
  let data = JSON.parse(localStorage[name]);
  const keys = Object.keys(data[0]);

  if (ENV.sortBy) {
    let k = ENV.sortBy;
    data = data.sort((a, b) => {
      if (a[k] < b[k]) return (ENV.order === "desc") ? 1 : -1;
      if (a[k] > b[k]) return (ENV.order === "desc") ? -1 : 1;
      return 0;
    });
  }

  keys.forEach((key) => {
    if (ENV[key]) {
      data = data.filter((item) => {
        return item[key] === ENV[key];
      });
    }
  });

  if (ENV.offset) {
    data = data.slice(Number(ENV.offset));
  }

  if (ENV.limit) {
    data = data.slice(0, Number(ENV.limit));
  }

  table.innerHTML = ` 
    <table>
      <thead>
        <tr>
          <th>#</th>
          ${keys.map((key) => `<th>${key}</th>`).join("")}
        </tr> 
      </thead>
      <tbody>
        ${data.map((row, index) => `
          <tr>
            <td>${index + 1}.</td>
            ${keys.map((key) => `<td>${row[key]}</td>`).join("")}
          </tr>
        `).join("")}         
      </tbody>
    </table>
  `;

  saveButton.style.display = "block";
  saveButton.addEventListener("click", () => {    
    downloadFile({
      blob: new Blob([JSON.stringify(data)], {
        type: "application/json;charset=utf-8"
      }),
      filename: `${name}_${new Date().toISOString()}.json`,
    });
  });
}

function handleStorageChange() {
  const database = Object.keys(localStorage);
  document.querySelector("#dbList").innerHTML = 
    database.map((name) => `<a ${(name === ENV.db) ? "" : `href="?db=${name}"`}>${name}</a>`).join("");
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function encode(str) {
  return window.encodeURIComponent(str);
}

function objectToQueryString(params) {
  return Object.entries(params)
    .filter(([prop, val]) => prop && val)
    .map(([prop, val]) => `${encode(prop)}=${encode(val)}`)
    .join("&");
}  

function parseQueryString(query) {
  const vars = {};
  if (query) {
    query
      .replace(/^\?/, "")
      .split("&")
      .forEach((keyValuePair) => {
        const [key, value] = keyValuePair.split("=");
        vars[key] = value ? window.decodeURIComponent(value) : true;
      });
  }
  return vars;
}

function downloadFile({ blob, filename }) {
  const urlBlob = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlBlob;
  a.download = filename;
  a.click();
}