const BASE = process.env.REACT_APP_API_BASE || '';

const toJson = async (res) => {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const TaskService = {
  getMyTasks: async (userId) => {
    const res = await fetch(`${BASE}/api/task/my-tasks?userId=${userId}`);
    return toJson(res);
  },

  createTask: async (model) => {
    const res = await fetch(`${BASE}/api/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model)
    });
    return toJson(res);
  },

  updateTask: async (model) => {
    const res = await fetch(`${BASE}/api/task`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model)
    });
    return toJson(res);
  },

  deleteTask: async (id) => {
    const res = await fetch(`${BASE}/api/task/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(await res.text());
    return res.ok;
  },

  getTaskById: async (id) => {
    const res = await fetch(`${BASE}/api/task/${id}`);
    return toJson(res);
  },

  getAllTasks: async (pageNumber = 1, pageSize = 10) => {
    const res = await fetch(`${BASE}/api/task?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return toJson(res);
  }
};

export default TaskService;
