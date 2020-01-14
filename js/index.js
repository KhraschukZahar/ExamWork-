let people = document.querySelector(".People");

let main_content = document.querySelector(".main-content");
let curentPage = 1;
people.value = 1;

people.addEventListener("click", GetPeople);

//#region Person
function GetPeople() {
  curentPage = this.value;
  let data = JSON.parse(localStorage.getItem(`people/?page=${this.value}`));
  if (data === null) Request(`people/?page=${this.value}`, CreatePeoplesTable);
  else {
    CreatePeoplesTable(data);
  }
}
async function ShowPerson(data) {
  let text = [
    { text: `Height: ${data.height}` },
    { text: `Mass: ${data.mass}` },
    { text: `Gender: ${data.gender}` },
    { text: `Hair Color: ${data.hair_color}` }
  ];
  let urls = [
    {
      text: `Homeworld: `,
      url: data.homeworld
    },
    { text: `Species: `, url: data.species[0] }
  ];
  RemoveChildren();

  let idRegex = /\/([0-9]*)\/$/;
  let id = data.url.match(idRegex)[1];

  localStorage.setItem(`people/${id}/`, JSON.stringify(data));
  let information_block = document.createElement("div");
  information_block.setAttribute("class", "information_block");
  let src = `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
  information_block.innerHTML = `<img class="image" src=${src}></img>`;
  let block = document.createElement("div");
  block.setAttribute("class", "additionally_information");
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "name");
  h2.innerHTML = data.name;
  let additionally_div = document.createElement("div");
  additionally_div.setAttribute("class", "additionally_information");
  text.map(el => {
    additionally_div.appendChild(CreateAdditionallyInformationText(el.text));
  });

  let item = await CreateAdditionallyInformationURL(
    urls[0].text,
    urls[0].url,
    GetPlanet
  );
  additionally_div.appendChild(item);
  item = await CreateAdditionallyInformationURL(
    urls[1].text,
    urls[1].url,
    GetSpecie
  );
  additionally_div.appendChild(item);
  block.appendChild(h2);
  block.appendChild(additionally_div);
  information_block.appendChild(block);
  let information_block_additional = [];
  RemoveChildren();

  if (data.vehicles.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.vehicles, "vehicles", GetVehicle)
    );
  }
  if (data.films.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.films, "films", GetFilm)
    );
  }
  if (data.starships.length >= 1) {
    information_block_additional.push(
      await CreateInformation(data.starships, "starships", GetStarship)
    );
  }
  RemoveChildren();

  await main_content.appendChild(information_block);

  information_block_additional.map(el => {
    main_content.appendChild(el);
  });
}

function GetPerson() {
  let id = this.value;
  let data = JSON.parse(localStorage.getItem(`people/${id}/`));
  if (data === null) Request(`people/${id}/`, ShowPerson);
  else {
    ShowPerson(data);
  }
}
async function CreatePeoplesTable(data) {
  await RemoveChildren();

  localStorage.setItem(`people/?page=${curentPage}`, JSON.stringify(data));
  let table = document.createElement("table");
  row = document.createElement("tr");
  row.innerHTML = `<th>Name</th><th>Height</th><th>Mass</th><th>Gender</th>`;
  table.appendChild(row);
  let idRegex = /\/([0-9]*)\/$/;
  for (let i = 0; i < data.results.length; i++) {
    row = document.createElement("tr");
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "#";
    a.addEventListener("click", GetPerson);
    a.innerHTML = data.results[i].name;
    let id = data.results[i].url.match(idRegex)[1];
    a.value = id;
    td.appendChild(a);
    td.setAttribute("width", "20%");
    row.appendChild(td);
    row.appendChild(CreateTD(data.results[i].height, 350));
    row.appendChild(CreateTD(data.results[i].mass, 350));
    row.appendChild(CreateTD(data.results[i].gender, 350));
    table.appendChild(row);
  }
  await RemoveChildren();
  Pagination(data.count, GetPeople);
  main_content.appendChild(table);
}

function CreateTD(text, width) {
  let td = document.createElement("td");
  td.innerHTML = text;
  td.setAttribute("width", `${width}px`);
  return td;
}

function CreateAdditionallyInformationText(text) {
  let p = document.createElement("p");
  p.setAttribute("class", "additionally_information_text");
  p.innerHTML = text;
  return p;
}
async function CreateAdditionallyInformationURL(text, url, callback) {
  let p = document.createElement("p");
  let idRegex = /\/([0-9]*)\/$/;
  let id = url.match(idRegex)[1];
  let data = JSON.parse(localStorage.getItem(url));
  if (data === null) {
    data = await Request1(url);
    localStorage.setItem(url, JSON.stringify(data));
  }

  p.innerHTML = `<a href="#">${text + data.name}</a>`;
  p.setAttribute("class", "additionally_information_text");
  p.addEventListener("click", callback);
  p.value = id;
  return p;
}
function RemoveChildren() {
  for (let i = 1; i < main_content.children.length; i++) {
    main_content.removeChild(main_content.children[i]);
  }
  if (main_content.children.length === 1) return;
  else RemoveChildren();
}
function Pagination(count, callback) {
  let totalPages = Math.ceil(count / 10);
  let ul = document.createElement("ul");
  ul.setAttribute("class", "pagination");
  if (totalPages > 1)
    for (let i = 0; i < totalPages; i++) {
      let li = document.createElement("li");
      if (curentPage === i + 1) li.setAttribute("class", "current");
      let a = document.createElement("a");
      a.innerHTML = i + 1;
      a.value = i + 1;
      a.addEventListener("click", callback);
      li.appendChild(a);
      ul.appendChild(li);
    }
  main_content.appendChild(ul);
}
async function Request1(path) {
  RemoveChildren();
  console.log(path);
  Preloader();

  let d;
  await fetch(path, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      d = data;
    })
    .catch(err => {
      console.log("Catch => ", err);
    });
  return d;
}
function Request(path, callback) {
  const URL = `https://swapi.co/api/${path}`;
  console.log(URL);

  RemoveChildren();
  fetch(URL, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      callback(data);
    })
    .catch(err => {
      console.log("Catch => ", err);
    });
}
