// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const tasksList = document.getElementById('tasksList');
const warningElement = document.getElementById('warning');

// Initialize tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingId = null;

// Save tasks to localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// warning message
function showWarning(message) {
    warningElement.textContent = message;
    setTimeout(() => {
        warningElement.textContent = '';
    }, 3000);
}

// Create task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    // Add event listeners
    const checkbox = li.querySelector('.task-checkbox');
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => toggleTask(task.id));
    editBtn.addEventListener('click', () => editTask(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    return li;
}

// Render all tasks
function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        tasksList.appendChild(createTaskElement(task));
    });
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    
    if (!text) {
        showWarning('Please enter a task!');
        return;
    }

    if (editingId !== null) {
        // Update existing task
        const taskIndex = tasks.findIndex(task => task.id === editingId);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = text;
            editingId = null;
            addTaskBtn.textContent = 'Add';
        }
    } else {
        // Add new task
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(newTask);
    }

    taskInput.value = '';
    saveToLocalStorage();
    renderTasks();
}

// Edit task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        editingId = taskId;
        taskInput.value = task.text;
        taskInput.focus();
        addTaskBtn.textContent = 'Save';
    }
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveToLocalStorage();
    renderTasks();
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveToLocalStorage();
        renderTasks();
    }
}

// Initialize event listeners
function initializeEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    renderTasks();
});