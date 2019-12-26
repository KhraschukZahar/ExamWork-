let main = document.querySelector(".main");
let form = document.querySelector(".main_form");
let person = document.querySelector(".person");
let btnSearch = document.querySelector(".btnSearch");
let data_terminal = [];
let data = [{}];
btnSearch.addEventListener("click", Request);
window.addEventListener("load", Init);
function Init() {
  let table = document.createElement("table");
  row = document.createElement("tr");
  row.innerHTML =
    "<th>ID</th><th>Name</th><th>Height</th><th>Mass</th><th>Gender</th>";
  table.appendChild(row);
  form.appendChild(table);
}
function Request() {
  data_starwars = [];
  const URL = `https://swapi.co/api/people/person/=${person.value}`;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", URL, true);
  console.log("Request");
  xhr.onreadystatechange = function(aEvt) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        data = JSON.parse(xhr.responseText);
        for (let i = 0; i < data.devices.length; i++) {
          const information = {
            ID: i + 1,
            latitude: data.devices[i].latitude,
            longitude: data.devices[i].longitude,
            tw: data.devices[i].tw
          };
          data_starwars.push(information);
        }
        CreateTable();
      } else {
        console.log("Error loading page\n");
      }
    }
  };
  xhr.send();
}
function CreateTable() {
  let chkTable = document.getElementsByTagName("table");
  if (chkTable.length > 0) {
    form.removeChild(form.lastChild);
  }
  let table = document.createElement("table");
  row = document.createElement("tr");
  row.innerHTML = `<th>ID</th><th>Name</th><th>Height</th><th>Mass</th><th>Gender</th>`;
  table.appendChild(row);
  for (let i = 0; i < data_starwars.length; i++) {
    row = document.createElement("tr");
    table.appendChild(row);
  }
  form.appendChild(table);
}
