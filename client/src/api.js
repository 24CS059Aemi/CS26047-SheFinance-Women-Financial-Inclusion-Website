// ─── SheFinance API Utility ───────────────────────────────────────────────────
// All frontend API calls go through this file.
// Token is read from localStorage and sent as Bearer header automatically.

const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('token') || '';
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => apiFetch('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  googleLogin: (body) => apiFetch('/auth/google-login', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileAPI = {
  get:            ()     => apiFetch('/profile'),
  update:         (body) => apiFetch('/profile',          { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => apiFetch('/profile/password', { method: 'PUT', body: JSON.stringify(body) }),
};

// ─── Transactions (Tracker) ───────────────────────────────────────────────────
export const transactionAPI = {
  getAll:  (month) => apiFetch(`/transactions${month ? `?month=${month}` : ''}`),
  summary: ()      => apiFetch('/transactions/summary'),
  create:  (body)  => apiFetch('/transactions', { method: 'POST', body: JSON.stringify(body) }),
  delete:  (id)    => apiFetch(`/transactions/${id}`, { method: 'DELETE' }),
};

// ─── Budget ───────────────────────────────────────────────────────────────────
export const budgetAPI = {
  get:    (month) => apiFetch(`/budget?month=${month}`),
  save:   (body)  => apiFetch('/budget', { method: 'POST', body: JSON.stringify(body) }),
  updateSpent: (id, body) => apiFetch(`/budget/${id}/category-spent`, { method: 'PUT', body: JSON.stringify(body) }),
};

// ─── Savings Goals ────────────────────────────────────────────────────────────
export const savingsAPI = {
  getAll: ()       => apiFetch('/savings'),
  create: (body)   => apiFetch('/savings', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/savings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id)     => apiFetch(`/savings/${id}`, { method: 'DELETE' }),
};

// ─── Support Tickets ──────────────────────────────────────────────────────────
export const supportAPI = {
  submit:   (body) => apiFetch('/support', { method: 'POST', body: JSON.stringify(body) }),
  myTickets: ()    => apiFetch('/support/my'),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  stats:    () => apiFetch('/admin/stats'),
  getUsers: () => apiFetch('/admin/users'),
  blockUser:  (id, status) => apiFetch(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteUser: (id)         => apiFetch(`/admin/users/${id}`, { method: 'DELETE' }),

  // Schemes CMS
  getSchemes:    ()        => apiFetch('/admin/schemes'),
  createScheme:  (body)    => apiFetch('/admin/schemes', { method: 'POST', body: JSON.stringify(body) }),
  updateScheme:  (id, body)=> apiFetch(`/admin/schemes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteScheme:  (id)      => apiFetch(`/admin/schemes/${id}`, { method: 'DELETE' }),

  // Literacy CMS
  getLiteracy:    ()        => apiFetch('/admin/literacy'),
  createLiteracy: (body)    => apiFetch('/admin/literacy', { method: 'POST', body: JSON.stringify(body) }),
  updateLiteracy: (id, body)=> apiFetch(`/admin/literacy/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteLiteracy: (id)      => apiFetch(`/admin/literacy/${id}`, { method: 'DELETE' }),

  // Support Tickets (admin view)
  getTickets:    (status) => apiFetch(`/admin/support${status ? `?status=${status}` : ''}`),
  updateTicket:  (id, body) => apiFetch(`/support/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTicket:  (id)       => apiFetch(`/support/${id}`, { method: 'DELETE' }),
};
