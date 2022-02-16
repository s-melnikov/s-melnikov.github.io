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

// ссылка на кнопку для сохранения результата
const saveButton = document.querySelector("#saveResult");

// узнаем, какие бызы данных существуют в локальном хранилище
findDatabases();

// проверяем, есть ли имя БД в запросе исуществкет ли БД с таким именем
if (ENV.db && localStorage[ENV.db]) {
  openDb(ENV.db);
}

// слушатель нажатия кнопки "Создать базу данных"
function handleCreateNewBDClick() {
  fetch("Users.json").then((r) => r.json()).then((response) => {
    localStorage[Date.now().toString(36)] = JSON.stringify(
      shuffle(response).map((item, index) => ({ ...item, id: index }))
    );
    findDatabases();
  });  
}

// ф-ция открытия базы данных (отображении ее на странице)
function openDb(name) {
  const table = document.querySelector("#dbTable");
  let data = JSON.parse(localStorage[name]);
  const keys = Object.keys(data[0]);

  // сортировка данных
  if (ENV.sortBy) {
    let k = ENV.sortBy;
    data = data.sort((a, b) => {
      if (a[k] < b[k]) return (ENV.order === "desc") ? 1 : -1;
      if (a[k] > b[k]) return (ENV.order === "desc") ? -1 : 1;
      return 0;
    });
  }

  // фильтрация
  keys.forEach((key) => {
    if (ENV[key]) {
      data = data.filter((item) => {
        return item[key] === ENV[key];
      });
    }
  });

  // сдвиг
  if (ENV.offset) {
    data = data.slice(Number(ENV.offset));
  }

  // лимит
  if (ENV.limit) {
    data = data.slice(0, Number(ENV.limit));
  }

  // строим таблицу и выводим ее
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

  // показываем кнопку "Сохранить результат"
  saveButton.style.display = "block";

  // добавляем слушатель события нажатия на кнопку
  saveButton.addEventListener("click", () => {    
    // при нажатии скачиваем файл с результатом, который на экране
    downloadFile({
      blob: new Blob([JSON.stringify(data)], {
        type: "application/json;charset=utf-8"
      }),
      filename: `${name}_${new Date().toISOString()}.json`,
    });
  });
}

// поиск существующих таблиц
function findDatabases() {
  const database = Object.keys(localStorage);
  document.querySelector("#dbList").innerHTML = 
    database.map((name) => `<a ${(name === ENV.db) ? "" : `href="?db=${name}"`}>${name}</a>`).join("");
}

// ф-ция случайного перемешивания массива
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

// экранирование специальных символов в строке
function encode(str) {
  return window.encodeURIComponent(str);
}

// разбор строки запроса и добавление всех переменных в объект
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

// скачивание файла
function downloadFile({ blob, filename }) {
  const urlBlob = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlBlob;
  a.download = filename;
  a.click();
}