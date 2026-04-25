const API_BASE_URL = "http://localhost:3000/api";

const parseJSON = async (res) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  return { error: text || "Unknown error" };
};

export const api = {
  // Auth
  register: async (email, password, name) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },

  // Tasks
  getTasks: async (token) => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error(data.error || "Failed to fetch tasks");
    return data;
  },

  createTask: async (token, title, description = "") => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error(data.error || "Failed to create task");
    return data;
  },

  deleteTask: async (token, taskId) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await parseJSON(res);
      throw new Error(data.error || "Failed to delete task");
    }
  },

  // Users
  deleteUser: async (token, userId) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await parseJSON(res);
      throw new Error(data.error || "Failed to delete user");
    }
  },
};
