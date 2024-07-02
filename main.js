let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (textInput.value === "") {
    console.log("failure");
    msg.innerHTML = "Task cannot be blank";
  } else {
    console.log("success");
    msg.innerHTML = "";
    acceptData();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();

    // Close modal after adding task
    (() => {
      const modal = bootstrap.Modal.getInstance(form);
      modal.hide();
    })();
  }
};

let data = [];

let acceptData = () => {
  data.push({
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value,
    completed: false 
  });

  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
  createTasks();
};

let createTasks = () => {
  tasks.innerHTML = "";
  data.map((x, y) => {
    tasks.innerHTML += `
      <div id="${y}" class="${x.completed ? 'completed' : ''}">
        <span class="fw-bold">${x.text}</span>
        <span class="small text-secondary">${x.date}</span>
        <p>${x.description}</p>

        <span class="options">
          <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
          <i onClick="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i>
          <input type="checkbox" onClick="completeTask(this)" ${x.completed ? 'checked' : ''} />
        </span>
      </div>
    `;
  });

  resetForm();
};

let deleteTask = (e) => {
  e.parentElement.parentElement.remove();
  data.splice(e.parentElement.parentElement.id, 1);
  localStorage.setItem("data", JSON.stringify(data));
  console.log(data);
};

let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;

  textInput.value = selectedTask.children[0].innerHTML;
  dateInput.value = selectedTask.children[1].innerHTML;
  textarea.value = selectedTask.children[2].innerHTML;

  deleteTask(e);
};

let completeTask = (e) => {
  let selectedTask = e.parentElement.parentElement;
  selectedTask.classList.toggle("completed");

  if (selectedTask.classList.contains("completed")) {
    data[selectedTask.id].completed = true;
  } else {
    data[selectedTask.id].completed = false;
  }

  localStorage.setItem("data", JSON.stringify(data));
};

let resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  textarea.value = "";
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || [];
  console.log(data);
  createTasks();
})();
