let API = "http://localhost:8000/products";

let btn = document.querySelector(".btn");
let inputs = document.querySelectorAll(".task-input");
let list = document.querySelector(".task-list");

btn.addEventListener("click", () => {
  let dataObj = {};

  inputs.forEach((input) => {
    if (input.value.trim()) {
      dataObj[input.getAttribute("placeholder")] = input.value.trim();
    }
  });
  if (Object.keys(dataObj).length === 0) {
    alert("Заполните хотя бы одно поле!");
    return;
  }
  createTask(dataObj);

  inputs.forEach((input) => {
    input.value = "";
  });
});

function createTask(data) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  }).then(() => readTask());
}

function readTask() {
  fetch(API)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      list.innerHTML = "";
      data.forEach((elem) => {
        console.log(data);
        list.innerHTML += `
        
          <div id = "form">
            <p>Фамилия; ${elem.Фамилия}</p>
            <p>Имя: ${elem.Имя}</p>
            <p>Контакт: ${elem.Контакт} </p>
            <img src="${elem.Фотография}" alt="Фото" id = "img" />
            <button id="${elem.id}" class="btnDelete">delete</button>
            <button id="${elem.id}" class="btnEdit">edit</button>
          </div>
          
        `;
      });
    });
}
readTask();

document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    const del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readTask());
  }
});

let inpEditName = document.querySelector(".inpEditName");
let inpEditLastName = document.querySelector(".inpEditLastName");
let inpEditPhone = document.querySelector(".inpEditPhone");
let inpEditImg = document.querySelector(".inpEditImg");
let btnEditSave = document.querySelector(".saveEdit");
let editModal = document.querySelector(".editModal");

document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  if (edit_class.includes("btnEdit")) {
    editModal.style.display = "block";
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        inpEditLastName.value = data.Фамилия;
        inpEditName.value = data.Имя;
        inpEditPhone.value = data.Контакт;
        inpEditImg.value = data.Фотография;
        btnEditSave.setAttribute("data-id", data.id);
      });
  }
});

btnEditSave.addEventListener("click", () => {
  let editedData = {
    Имя: inpEditName.value,
    Фамилия: inpEditLastName.value,
    Контакт: inpEditPhone.value,
    Фотография: inpEditImg.value,
  };
  editedTask(editedData, btnEditSave.getAttribute("data-id"));
});

function editedTask(editedData, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedData),
  }).then(() => readTask());
}
