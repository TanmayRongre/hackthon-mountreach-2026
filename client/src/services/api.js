const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper function for fetch calls with automatic token attachment
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const startTime = performance.now();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const latency = Math.round(performance.now() - startTime);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      const error = new Error(data.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      error.latency = latency;
      throw error;
    }

    return { ...data, _latency: latency, _status: response.status };
  } catch (error) {
    if (!error.status) {
      error.message = 'Unable to connect to the backend server. Make sure it is running on port 5000.';
    }
    throw error;
  }
}

export const api = {
  // Base config info
  getBaseUrl: () => API_BASE_URL,

  // Health
  getHealth: () => request('/health', { method: 'GET' }),

  // Auth
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request('/auth/me', { method: 'GET' }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  // Items / Products CRUD
  getItems: () => request('/items', { method: 'GET' }),

  getItemById: (id) => request(`/items/${id}`, { method: 'GET' }),

  createItem: (itemData) =>
    request('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),

  updateItem: (id, itemData) =>
    request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    }),

  deleteItem: (id) =>
    request(`/items/${id}`, {
      method: 'DELETE',
    }),

  // Custom Raw Request Tester
  rawRequest: (endpoint, method = 'GET', body = null) => {
    const options = { method };
    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    return request(endpoint, options);
  },
};

export default api;
