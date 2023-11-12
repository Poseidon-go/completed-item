function creatTodoElement(todo) {
  if (!todo) return null;
  // find template
  const todoTemplate = document.getElementById("todoTemplate");
  if (!todoTemplate) return null;
  // clone li element
  const todoElement = todoTemplate.content.firstElementChild.cloneNode(true);
  todoElement.dataset.id = todo.id;
  todoElement.dataset.status = todo.status;

  // render current todo status
  const divElement = todoElement.querySelector("div.todo");
  if (!divElement) return null;
  const alertClass = todo.status === "pending" ? "alert-secondary" : "alert-success";
  divElement.classList.remove("alert-secondary");
  divElement.classList.add(alertClass);

  // update content where needed
  const titleElement = todoElement.querySelector(".todo__title");
  if (!titleElement) return null;
  titleElement.textContent = todo.title;

  // TODO: attack even for button
  // add click event for mark-as-done button
  const markAsDoneButton = todoElement.querySelector(".mark-as-done");
  if (!markAsDoneButton) return null;

  // render current text and color button
  const currentColorButton = todo.status === "pending" ? "btn-dark" : "btn-success";
  markAsDoneButton.classList.remove("btn-dark", "btn-success");
  markAsDoneButton.classList.add(currentColorButton);

  const currentTextButton = todo.status === "pending" ? "Finish" : "Reset";
  markAsDoneButton.textContent = currentTextButton;

  markAsDoneButton.addEventListener("click", () => {
    console.log("mark:");
    const currentStatus = todoElement.dataset.status;
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    const todoList = getTodoList();
    const index = todoList.findIndex((x) => x.id === todo.id);
    todoList[index].status = newStatus;
    localStorage.setItem("todo_list", JSON.stringify(todoList));

    // update data-status on li element
    todoElement.dataset.status = newStatus;

    // update current UI on DOM
    const newAlertClass = currentStatus === "pending" ? "alert-success" : "alert-secondary";
    divElement.classList.remove("alert-success", "alert-secondary");
    divElement.classList.add(newAlertClass);

    const newColorStatus = currentStatus === "pending" ? "btn-success" : "btn-dark";
    markAsDoneButton.classList.remove("btn-success", "btn-dark");
    markAsDoneButton.classList.add(newColorStatus);

    const newTextStatus = currentStatus === "pending" ? "Reset" : "Finish";
    markAsDoneButton.textContent = newTextStatus;
  });

  // add click event for remove button
  const removeButton = todoElement.querySelector(".remove");
  if (!removeButton) return null;
  removeButton.addEventListener("click", () => {
    console.log("remove");
    // where to get todolist
    // where is the remove todo id

    // todolist current
    const todoList = getTodoList();
    const newTodoList = todoList.filter((x) => x.id !== todo.id);

    localStorage.setItem("todo_list", JSON.stringify(newTodoList));
    todoElement.remove();
  });

  // add click event for edit button
  const editButton = todoElement.querySelector(".edit");
  if (editButton) {
    editButton.addEventListener("click", () => {
      //TODO :  latest todo data- get form local storage
      // need to get todo form local storage
      // as todo data can be updated
      const todoList = getTodoList();
      const latestTodo = todoList.find((x) => x.id === todo.id);
      if (!latestTodo) return;

      // populate data to todo form
      populateTodoForm(latestTodo);
    });
  }

  return todoElement;
}

function populateTodoForm(todo) {
  // query todo form
  // dataset.id = todo.id
  const todoForm = document.getElementById("todoFormId");
  if (!todoForm) return null;
  todoForm.dataset.id = todo.id;

  // set values for form controls
  // set todoText input
  const todoInput = document.getElementById("todoText");
  if (!todoInput) return;
  todoInput.value = todo.title;
}

function renderTodoList(todoList, ulElementId) {
  if (!Array.isArray(todoList) || todoList.length === 0) return null;

  const ulElemnt = document.getElementById(ulElementId);
  if (!ulElemnt) return;

  for (const todo of todoList) {
    const liElement = creatTodoElement(todo);
    ulElemnt.appendChild(liElement);
  }
}

function sendTodoListLocal() {
  const todoList = [
    { id: 1, title: "Learn Js", status: "pending" },
    { id: 2, title: "Learn React Js", status: "completed" },
    { id: 3, title: "Learn  Next Js", status: "pending" },
  ];
  localStorage.setItem("todo_list", JSON.stringify(todoList));
}

function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem("todo_list")) || [];
  } catch {
    return [];
  }
}

function handleTodoFormSubmit(even) {
  "use strict";
  even.preventDefault();

  // validate form values : don't do it
  const todoForm = document.getElementById("todoFormId");
  if (!todoForm) return;

  const todoInput = document.getElementById("todoText");
  if (!todoInput) {
    alert("Todo Input not found");
    return;
  }

  // determine add or edit mode
  const isEdit = Boolean(todoForm.dataset.id);

  if (isEdit) {
    // find current todo
    const todoList = getTodoList();
    const index = todoList.findIndex((x) => x.id.toString() === todoForm.dataset.id);
    if (index < 0) return;
    // update content
    todoList[index].title = todoInput.value;
    // save
    localStorage.setItem("todo_list", JSON.stringify(todoList));
    // apply DOM changes
    // find li element having id = todoForm.data.id
    const liElement = document.querySelector(`ul#todoList > li[data-id="${todoForm.dataset.id}"]`);
    console.log(liElement);
    if (liElement) {
      const titleElement = liElement.querySelector(".todo__title");
      if (titleElement) titleElement.textContent = todoInput.value;
    }
  } else {
    // add mode
    // get form values
    const todoText = todoInput.value;
    const newTodo = { id: Date.now(), title: todoText, status: "pending" };

    // save localStorage
    const todoList = getTodoList();
    todoList.push(newTodo);
    localStorage.setItem("todo_list", JSON.stringify(todoList));
    // apply DOM changes
    const newLiElement = creatTodoElement(newTodo);
    const ulElemnt = document.getElementById("todoList");
    if (!ulElemnt) return;
    ulElemnt.appendChild(newLiElement);
  }

  // reset Form
  delete todoForm.dataset.id;
  todoForm.reset();
}

(() => {
  // sendTodoListLocal();
  const todoList = getTodoList();
  renderTodoList(todoList, "todoList");

  // register submit even for todo form
  const todoForm = document.getElementById("todoFormId");
  if (!todoForm) return null;

  todoForm.addEventListener("submit", handleTodoFormSubmit);
})();
