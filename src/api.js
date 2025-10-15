const BASE = 'http://localhost/salud-portal-api/api';

async function http(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',              // 👈 importante para enviar cookie de sesión
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export const api = {
  // AUTH
  me() { return http(`${BASE}/auth_me.php`); },
  login(email, password) {
    return http(`${BASE}/auth_login.php`, { method: 'POST', body: JSON.stringify({ email, password })});
  },
  register({ email, password, nombre }) {
    return http(`${BASE}/auth_register.php`, { method: 'POST', body: JSON.stringify({ email, password, nombre })});
  },
  logout() { return http(`${BASE}/auth_logout.php`); },

  // USER
  getUser() { return http(`${BASE}/user.php`); },
  saveUser(user) { return http(`${BASE}/user.php`, { method: 'PUT', body: JSON.stringify(user) }); },

  // TRAININGS
  getTrainings() { return http(`${BASE}/trainings.php`); },
  addTraining(training) { return http(`${BASE}/trainings.php`, { method: 'POST', body: JSON.stringify(training) }); },
  deleteTraining(id) { return http(`${BASE}/training.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }
};
