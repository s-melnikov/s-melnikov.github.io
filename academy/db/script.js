const env = parseQueryString(window.location.search);

handleStorageChange();

if (env.db && localStorage[env.db]) {
  openDb(env.db);
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

  if (env.sortBy) {
    let k = env.sortBy;
    data = data.sort((a, b) => {
      if (a[k] < b[k]) return (env.order === "desc") ? 1 : -1;
      if (a[k] > b[k]) return (env.order === "desc") ? -1 : 1;
      return 0;
    });
  }

  keys.forEach((key) => {
    if (env[key]) {
      data = data.filter((item) => {
        return item[key] === env[key];
      });
    }
  });

  if (env.offset) {
    data = data.slice(Number(env.offset));
  }

  if (env.limit) {
    data = data.slice(0, Number(env.limit));
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
}

function handleStorageChange() {
  const database = Object.keys(localStorage);
  document.querySelector("#dbList").innerHTML = 
    database.map((name) => `<a ${(name === env.db) ? "" : `href="?db=${name}"`}>${name}</a>`).join("");
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
};