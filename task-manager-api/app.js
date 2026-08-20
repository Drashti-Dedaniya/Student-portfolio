const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const taskList = document.getElementById('task-list');
const refreshBtn = document.getElementById('refresh-btn');

const apiBase = '/tasks';

const renderEmptyState = () => {
  taskList.innerHTML = `
    <div class="empty-state">
      <p>No tasks yet.</p>
      <p>Add your first task to get started.</p>
    </div>
  `;
};

const renderTasks = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    renderEmptyState();
    return;
  }

  taskList.innerHTML = tasks
    .slice()
    .reverse()
    .map((task) => {
      const taskId = task._id || task.id;
      const titleClass = task.completed ? 'task-status done' : 'task-status pending';
      const statusText = task.completed ? 'Completed' : 'Pending';
      const priorityLabel = (task.priority || 'medium').toUpperCase();

      return `
        <article class="task-item" data-id="${taskId}">
          <input
            class="task-check"
            type="checkbox"
            aria-label="Mark task complete"
            ${task.completed ? 'checked' : ''}
            data-action="toggle"
            data-id="${taskId}"
          />

          <div class="task-main">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description || 'No description provided.'}</div>

            <div class="task-meta">
              <div class="task-meta-group">
                <span class="${titleClass}">${statusText}</span>
                <span class="task-priority">${priorityLabel}</span>
              </div>
              <div class="task-actions">
                <button class="task-action" type="button" data-action="toggle" data-id="${taskId}">
                  ${task.completed ? 'Reopen' : 'Complete'}
                </button>
                <button class="task-action delete" type="button" data-action="delete" data-id="${taskId}">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
};

const fetchTasks = async () => {
  try {
    const response = await fetch(apiBase);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Unable to fetch tasks');
    }

    renderTasks(result.data || []);
  } catch (error) {
    taskList.innerHTML = `
      <div class="empty-state">
        <p>Unable to load tasks.</p>
        <p>${error.message}</p>
      </div>
    `;
  }
};

const addTask = async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const priority = priorityInput.value;

  if (!title) {
    titleInput.focus();
    return;
  }

  try {
    const response = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        completed: false,
        priority,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.details ? Object.values(result.details).join(' ') : result.error || 'Task could not be created');
    }

    taskForm.reset();
    priorityInput.value = 'medium';
    titleInput.focus();
    await fetchTasks();
  } catch (error) {
    alert(error.message);
  }
};

const toggleTask = async (id) => {
  try {
    const response = await fetch(`${apiBase}/${id}`);
    if (!response.ok) {
      throw new Error('Task not found');
    }

    const result = await response.json();
    const currentTask = result.data;

    const updateResponse = await fetch(`${apiBase}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: currentTask.title,
        description: currentTask.description,
        completed: !currentTask.completed,
        priority: currentTask.priority,
      }),
    });

    const updatedResult = await updateResponse.json();

    if (!updateResponse.ok) {
      throw new Error(updatedResult.details ? Object.values(updatedResult.details).join(' ') : updatedResult.error || 'Task update failed');
    }

    await fetchTasks();
  } catch (error) {
    alert(error.message);
  }
};

const deleteTask = async (id) => {
  try {
    const response = await fetch(`${apiBase}/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Task deletion failed');
    }

    await fetchTasks();
  } catch (error) {
    alert(error.message);
  }
};

taskForm.addEventListener('submit', addTask);
refreshBtn.addEventListener('click', fetchTasks);

taskList.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const { action, id } = target.dataset;
  if (action === 'toggle') {
    await toggleTask(id);
  }

  if (action === 'delete') {
    await deleteTask(id);
  }
});

taskList.addEventListener('change', async (event) => {
  const checkbox = event.target.closest('.task-check');
  if (!checkbox) return;

  await toggleTask(checkbox.dataset.id);
});

fetchTasks();
