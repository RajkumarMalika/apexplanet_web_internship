document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) {
    alert('All fields are required!');
    return;
  }
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address!');
    return;
  }
  alert('Form submitted successfully!');
  this.reset();
});

function addTask() {
  const todoInput = document.getElementById('todoInput');
  const todoList = document.getElementById('todoList');
  const taskText = todoInput.value.trim();

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  const li = document.createElement('li');
  li.textContent = taskText;
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = function() {
    todoList.removeChild(li);
  };
  li.appendChild(deleteBtn);
  todoList.appendChild(li);
  todoInput.value = '';
}