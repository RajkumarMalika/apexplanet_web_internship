         // Task data stored in memory
        let tasks = [];
        let taskIdCounter = 0;

        // DOM elements
        const taskInput = document.getElementById('taskInput');
        const addBtn = document.getElementById('addBtn');
        const taskList = document.getElementById('taskList');
        const clearCompletedBtn = document.getElementById('clearCompletedBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const totalTasksEl = document.getElementById('totalTasks');
        const completedTasksEl = document.getElementById('completedTasks');
        const pendingTasksEl = document.getElementById('pendingTasks');

        // Add task function
        function addTask() {
            const taskText = taskInput.value.trim();
            if (taskText === '') {
                taskInput.style.borderColor = '#ff6b6b';
                setTimeout(() => {
                    taskInput.style.borderColor = '#e0e0e0';
                }, 2000);
                return;
            }

            const task = {
                id: taskIdCounter++,
                text: taskText,
                completed: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            tasks.push(task);
            taskInput.value = '';
            renderTasks();
            updateStats();
        }

        // Render tasks
        function renderTasks() {
            if (tasks.length === 0) {
                taskList.innerHTML = '<li class="empty-state">No tasks yet. Add your first task above!</li>';
                return;
            }

            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <div class="task-content">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                               onchange="toggleTask(${task.id})">
                        <span class="task-text">${task.text}</span>
                        <span class="task-time">${task.time}</span>
                    </div>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                `;
                taskList.appendChild(li);
            });
        }

        // Toggle task completion
        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                renderTasks();
                updateStats();
            }
        }

        // Delete task
        function deleteTask(id) {
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
            updateStats();
        }

        // Clear completed tasks
        function clearCompleted() {
            tasks = tasks.filter(t => !t.completed);
            renderTasks();
            updateStats();
        }

        // Clear all tasks
        function clearAll() {
            if (tasks.length > 0 && confirm('Are you sure you want to delete all tasks?')) {
                tasks = [];
                renderTasks();
                updateStats();
            }
        }

        // Update statistics
        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const pending = total - completed;

            totalTasksEl.textContent = total;
            completedTasksEl.textContent = completed;
            pendingTasksEl.textContent = pending;
        }

        // Download tasks as text file
        function downloadTasks() {
            if (tasks.length === 0) {
                alert('No tasks to download!');
                return;
            }

            let content = 'TODO LIST\n';
            content += '=' .repeat(50) + '\n';
            content += `Generated: ${new Date().toLocaleString()}\n`;
            content += '=' .repeat(50) + '\n\n';

            const completedTasks = tasks.filter(t => t.completed);
            const pendingTasks = tasks.filter(t => !t.completed);

            if (pendingTasks.length > 0) {
                content += 'PENDING TASKS:\n';
                content += '-'.repeat(30) + '\n';
                pendingTasks.forEach((task, index) => {
                    content += `${index + 1}. ${task.text} (Added: ${task.time})\n`;
                });
                content += '\n';
            }

            if (completedTasks.length > 0) {
                content += 'COMPLETED TASKS:\n';
                content += '-'.repeat(30) + '\n';
                completedTasks.forEach((task, index) => {
                    content += `${index + 1}. ✓ ${task.text} (Added: ${task.time})\n`;
                });
                content += '\n';
            }

            content += '=' .repeat(50) + '\n';
            content += `Summary: ${tasks.length} total tasks (${pendingTasks.length} pending, ${completedTasks.length} completed)`;

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `todo-list-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Event listeners
        addBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });
        clearCompletedBtn.addEventListener('click', clearCompleted);
        clearAllBtn.addEventListener('click', clearAll);
        downloadBtn.addEventListener('click', downloadTasks);

        // Initialize
        updateStats();
   