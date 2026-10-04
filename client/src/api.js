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
  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    throw new Error(res.ok ? text : `Backend error (${res.status}). Please ensure backend is running with latest routes.`);
  }
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
  // Dashboard stats
  stats:    () => apiFetch('/admin/stats'),

  // User management
  getUsers:    () => apiFetch('/admin/users'),
  createUser:  (body)        => apiFetch('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
  blockUser:   (id, status)  => apiFetch(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteUser:  (id)          => apiFetch(`/admin/users/${id}`, { method: 'DELETE' }),

  // Transactions (admin view all)
  getTransactions: () => apiFetch('/admin/transactions'),
  deleteTransaction: (id) => apiFetch(`/admin/transactions/${id}`, { method: 'DELETE' }),

  // Savings goals (admin view all)
  getGoals: () => apiFetch('/admin/goals'),

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
  updateTicket:  (id, body) => apiFetch(`/admin/support/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTicket:  (id)       => apiFetch(`/admin/support/${id}`, { method: 'DELETE' }),

  // Admin password
  changePassword: (body) => apiFetch('/admin/change-password', { method: 'PUT', body: JSON.stringify(body) }),

  // Data export (returns download URL)
  exportData: (type) => {
    const token = getToken();
    const url = `${BASE_URL}/admin/export/${type}`;
    // Trigger download via hidden anchor
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', '');
    // We need auth header, so use fetch + blob
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (!res.ok) throw new Error('Export failed');
      return res.blob();
    }).then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      a.href = blobUrl;
      a.download = `shefinance_${type}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    });
  },
};

