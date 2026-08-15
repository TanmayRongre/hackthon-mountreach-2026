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

  // Users & Staff Management
  getUsers: (query = '') => request(`/users${query ? `?${query}` : ''}`, { method: 'GET' }),
  getUserById: (id) => request(`/users/${id}`, { method: 'GET' }),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Student Profile & Admission
  getMyStudentProfile: () => request('/students/me', { method: 'GET' }),

  admitStudent: (admissionData) =>
    request('/students/admit', {
      method: 'POST',
      body: JSON.stringify(admissionData),
    }),

  getStudents: (query = '') => request(`/students${query ? `?${query}` : ''}`, { method: 'GET' }),

  // Hostels & Rooms
  getHostels: () => request('/hostels', { method: 'GET' }),
  createHostel: (data) => request('/hostels', { method: 'POST', body: JSON.stringify(data) }),
  updateHostel: (id, data) => request(`/hostels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHostel: (id) => request(`/hostels/${id}`, { method: 'DELETE' }),

  getRooms: (hostelId = '') => request(`/rooms${hostelId ? `?hostel=${hostelId}` : ''}`, { method: 'GET' }),
  createRoom: (data) => request('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateRoom: (id, data) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),

  // Complaints / Grievance Portal
  getComplaints: (query = '') => request(`/complaints${query ? `?${query}` : ''}`, { method: 'GET' }),
  createComplaint: (complaintData) =>
    request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    }),
  updateComplaint: (id, data) =>
    request(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteComplaint: (id) => request(`/complaints/${id}`, { method: 'DELETE' }),

  // Leaves & Digital Outpass
  getLeaves: (query = '') => request(`/leaves${query ? `?${query}` : ''}`, { method: 'GET' }),
  createLeave: (leaveData) =>
    request('/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    }),
  updateLeave: (id, data) =>
    request(`/leaves/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Fees & Payment Portal
  getFees: (query = '') => request(`/fees${query ? `?${query}` : ''}`, { method: 'GET' }),
  createFee: (feeData) =>
    request('/fees', {
      method: 'POST',
      body: JSON.stringify(feeData),
    }),
  updateFee: (id, feeData) =>
    request(`/fees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feeData),
    }),
  payFee: (feeId, paymentData = {}) =>
    request(`/fees/${feeId}/pay`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  // Attendance & QR Scanner
  getAttendance: (query = '') => request(`/attendance${query ? `?${query}` : ''}`, { method: 'GET' }),
  generateAttendanceQR: (data = {}) =>
    request('/attendance/generate-qr', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getActiveAttendanceSession: () => request('/attendance/active-session', { method: 'GET' }),
  scanAttendance: (data = {}) =>
    request('/attendance/scan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Visitors Pass
  getVisitors: (query = '') => request(`/visitors${query ? `?${query}` : ''}`, { method: 'GET' }),
  createVisitor: (visitorData) =>
    request('/visitors', {
      method: 'POST',
      body: JSON.stringify(visitorData),
    }),
  updateVisitor: (id, data) =>
    request(`/visitors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Mess & Daily Food Schedule
  getMess: () => request('/mess', { method: 'GET' }),

  // Notice Board
  getNotices: () => request('/notices', { method: 'GET' }),
  createNotice: (noticeData) =>
    request('/notices', {
      method: 'POST',
      body: JSON.stringify(noticeData),
    }),
  updateNotice: (id, noticeData) =>
    request(`/notices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noticeData),
    }),
  deleteNotice: (id) => request(`/notices/${id}`, { method: 'DELETE' }),

  // Admin Control Center Endpoints
  getAdminOverview: () => request('/admin/overview', { method: 'GET' }),
  getAuditLogs: (query = '') => request(`/admin/audit-logs${query ? `?${query}` : ''}`, { method: 'GET' }),
  getSystemHealth: () => request('/admin/system-health', { method: 'GET' }),
  updateUserRole: (id, role) =>
    request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),
  getAdminReports: (reportType = '') =>
    request(`/admin/reports${reportType ? `?reportType=${reportType}` : ''}`, { method: 'GET' }),

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

  // Contact & Helpdesk
  submitContact: (data) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getContactMessages: (params = '') => request(`/contact${params}`, { method: 'GET' }),
  updateContactMessage: (id, data) =>
    request(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
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
