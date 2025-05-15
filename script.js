const todoList = document.getElementById('todo-list');
const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';

document.getElementById('go-to-add').addEventListener('click', () => {
  window.location.href = 'add.html';
});


async function loadInitialTasks() {
  let tasks = JSON.parse(localStorage.getItem('localTasks'));

  if (!tasks || tasks.length === 0) {
    const res = await fetch(API_URL);
    const apiTasks = await res.json();

    const tasksWithUniqueId = apiTasks.map(task => ({
      id: Date.now() + Math.floor(Math.random() * 10000),
      title: task.title,
      completed: task.completed
    }));

    localStorage.setItem('localTasks', JSON.stringify(tasksWithUniqueId));
  }
}


function refreshTodoList() {
  todoList.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem('localTasks')) || [];
  tasks.forEach(task => addTodoToDOM(task));
}


function addTodoToDOM(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  li.innerHTML = `
    <span>${task.title}</span>
    <div class="actions">
      <button onclick="editTask(${task.id})">Edit</button>
      <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
    </div>
  `;
  todoList.appendChild(li);
}


function editTask(id) {
  localStorage.setItem('editTaskId', id);
  window.location.href = 'edit.html';
}


function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem('localTasks')) || [];
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('localTasks', JSON.stringify(tasks));
  document.querySelector(`li[data-id="${id}"]`)?.remove();
}


async function init() {
  await loadInitialTasks();
  refreshTodoList();
  setInterval(refreshTodoList, 5000); 
}

init();