document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskTableBody = document.getElementById('task-table-body');
    const filterSelect = document.getElementById('filter-select');
    const exportBtn = document.getElementById('export-btn');
    const exportOptions = document.getElementById('export-options');

    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // --- Core Functions ---

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskTableBody.innerHTML = '';
        const filter = filterSelect.value;
        
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        });

        if (filteredTasks.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4" style="text-align: center; color: #888; padding: 20px;">Your task list is empty!</td>`;
            taskTableBody.appendChild(tr);
            return;
        }

        filteredTasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.className = task.completed ? 'completed' : '';
            tr.dataset.id = task.id;
            
            const taskDate = new Date(task.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            tr.innerHTML = `
                <td class="col-status" data-label="Status">
                    <input type="checkbox" class="custom-checkbox" ${task.completed ? 'checked' : ''}>
                </td>
                <td class="col-task" data-label="Task">
                    <span class="task-text">${task.text}</span>
                </td>
                <td class="col-date" data-label="Date Added">${taskDate}</td>
                <td class="col-actions" data-label="Actions">
                    <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            taskTableBody.appendChild(tr);
        });
    };

    const addTask = (text) => {
        if (!text) return;
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        // Add new tasks to the top of the list
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    const toggleComplete = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    };
    
    // --- Export Functions ---
    const downloadFile = (content, fileName, contentType) => {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    };
    const exportToTXT = () => {
        let content = "My To-Do List\n===================\n\n";
        tasks.forEach(task => {
            const status = task.completed ? '[x]' : '[ ]';
            const date = new Date(task.createdAt).toLocaleDateString();
            content += `${status} ${task.text} (Added: ${date})\n`;
        });
        downloadFile(content, 'tasks.txt', 'text/plain');
    };
    const exportToCSV = () => {
        let content = '"ID","Task","Status","Date Added"\n';
        tasks.forEach(task => {
            const status = task.completed ? 'Completed' : 'Active';
            const date = new Date(task.createdAt).toISOString();
            content += `"${task.id}","${task.text.replace(/"/g, '""')}","${status}","${date}"\n`;
        });
        downloadFile(content, 'tasks.csv', 'text/csv');
    };
    const exportToJSON = () => {
        const content = JSON.stringify(tasks, null, 2);
        downloadFile(content, 'tasks_backup.json', 'application/json');
    };

    // --- Event Listeners ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value.trim());
        taskInput.value = '';
    });

    taskTableBody.addEventListener('click', (e) => {
        const tr = e.target.closest('tr');
        if (!tr) return;
        const id = parseInt(tr.dataset.id);
        
        if (e.target.matches('input[type="checkbox"]')) {
            toggleComplete(id);
        }
        if (e.target.closest('.delete-btn')) {
            // Confirmation before deleting
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(id);
            }
        }
    });

    filterSelect.addEventListener('change', renderTasks);
    
    exportBtn.addEventListener('click', () => {
        exportOptions.style.display = exportOptions.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
        if (!exportBtn.contains(e.target) && !exportOptions.contains(e.target)) {
            exportOptions.style.display = 'none';
        }
    });
    document.getElementById('export-txt').addEventListener('click', exportToTXT);
    document.getElementById('export-csv').addEventListener('click', exportToCSV);
    document.getElementById('export-json').addEventListener('click', exportToJSON);

    // Initial Render
    renderTasks();
});
