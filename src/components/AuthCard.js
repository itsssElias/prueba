import React, { useState } from 'react';
import { api } from '../api';

export default function AuthCard({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (mode === 'login') {
        const u = await api.login(email, password);
        onAuth?.(u);
      } else {
        const u = await api.register({ email, password, nombre });
        onAuth?.(u);
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="container py-5" style={{maxWidth: 480}}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h5>
          {err && <div className="alert alert-danger">{String(err)}</div>}
          <form onSubmit={submit} className="row g-3">
            {mode === 'register' && (
              <div className="col-12">
                <label className="form-label">Nombre (opcional)</label>
                <input className="form-control" value={nombre} onChange={e=>setNombre(e.target.value)} />
              </div>
            )}
            <div className="col-12">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div className="col-12">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                {mode === 'login' ? 'Entrar' : 'Registrarme'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={()=>setMode(mode==='login'?'register':'login')}>
                {mode === 'login' ? 'Crear cuenta' : 'Ya tengo cuenta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
