handleStorageChange();


// class DB {
//   constructor(name) {
//     this.name = name;    
//   }
// }


function handleCreateNewBDClick() {
  fetch("Users.json").then((r) => r.json()).then((response) => {
    localStorage[Date.now().toString(36)] = JSON.stringify(
      shuffle(response).slice(0, 50)
    );
    handleStorageChange();
  });  
}
function handleOpenDbClick(name) {
  const table = document.querySelector("#dbTable");
  const data = JSON.parse(localStorage[name]);
  const keys = Object.keys(data[0]);

  table.innerHTML = `
    <table>
      <thead>
        <tr>
          ${keys.map((key) => `<th>${key}</th>`).join("")}
        </tr> 
      </thead>
      <tbody>
        ${data.map((row) => `
          <tr>
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
    database.map((name) => `<span onClick="handleOpenDbClick('${name}')">${name}</span>`).join("");
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