import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NavbarBrand from './components/NavbarBrand';
import UserForm from './components/UserForm';
import TrainingForm from './components/TrainingForm';
import TrainingList from './components/TrainingList';
import UserStats from './components/UserStats';
import AuthCard from './components/AuthCard';
import { api } from './api';

const DEFAULT_USER = { nombre: '', edad: '', peso: '', estatura: '' };

export default function App() {
  // { id, email, nombre } | null
  const [session, setSession] = useState(null);

  const [user, setUser] = useState(DEFAULT_USER);
  const [trainings, setTrainings] = useState([]);
  const [vista, setVista] = useState('panel'); // 'panel' | 'mis-entrenamientos'
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Evita guardar al backend durante la carga inicial
  const readyToSaveRef = useRef(false);

  // Carga inicial: verifica sesión y luego trae perfil + entrenamientos
  useEffect(() => {
    (async () => {
      try {
        const me = await api.me(); // ← verifica sesión (cookie)
        setSession(me);

        setLoading(true);
        const [u, t] = await Promise.all([
          api.getUser(),
          api.getTrainings(),
        ]);

        setUser(u || DEFAULT_USER);
        setTrainings(Array.isArray(t) ? t : []);
        readyToSaveRef.current = true; // a partir de aquí, permitir guardados
      } catch (e) {
        // 401 → no autenticado
        setSession(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Guardado diferido del perfil cuando ya cargó y hay sesión
  useEffect(() => {
    if (!readyToSaveRef.current || !session) return;
    const timer = setTimeout(() => {
      api.saveUser(user).catch(() => setErr('No se pudo guardar el usuario'));
    }, 350);
    return () => clearTimeout(timer);
  }, [user, session]);

  // Handlers
  const handleUserChange = useCallback((u) => setUser(u), []);

  const addTraining = useCallback(async (t) => {
    try {
      const saved = await api.addTraining(t);
      setTrainings(prev => [saved, ...prev]);
    } catch (e) {
      setErr('No se pudo agregar el entrenamiento');
    }
  }, []);

  const deleteTraining = useCallback(async (id) => {
    try {
      await api.deleteTraining(id);
      setTrainings(prev => prev.filter(x => x.id !== id));
    } catch (e) {
      setErr('No se pudo borrar el entrenamiento');
    }
  }, []);

  // Pequeño resumen para la barra superior
  const resumen = useMemo(() => {
    const nombre = user?.nombre || session?.email || '—';
    return `${nombre} · ${trainings.length} entrenamientos`;
  }, [user, trainings, session]);

  // Si no hay sesión, mostramos la tarjeta de auth
  if (!session) {
    return <AuthCard onAuth={(me) => { setSession(me); window.location.reload(); }} />;
  }

  return (
    <>
      <NavbarBrand />

      <div className="container py-4">
        {err && <div className="alert alert-warning">{err}</div>}

        {/* Top bar: tabs + acciones */}
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
          <div className="text-muted">{resumen}</div>

          <div className="d-flex align-items-center gap-2">
            <ul className="nav nav-pills me-2">
              <li className="nav-item">
                <button
                  className={`nav-link ${vista === 'panel' ? 'active' : ''}`}
                  onClick={() => setVista('panel')}
                >
                  Panel
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${vista === 'mis-entrenamientos' ? 'active' : ''}`}
                  onClick={() => setVista('mis-entrenamientos')}
                >
                  Mis entrenamientos
                </button>
              </li>
            </ul>

            <button className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-clockwise me-1" /> Recargar
            </button>

            <button
              className="btn btn-outline-danger"
              onClick={() => api.logout().then(() => window.location.reload())}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="alert alert-info">Cargando…</div>
        ) : (
          <>
            {/* Mantener montadas ambas vistas para evitar flicker y pérdida de estado */}
            <div style={{ display: vista === 'panel' ? 'block' : 'none' }}>
              <UserForm value={user} onChange={handleUserChange} />
              <TrainingForm onAdd={addTraining} />
              <UserStats user={user || {}} trainings={trainings} />
            </div>

            <div style={{ display: vista === 'mis-entrenamientos' ? 'block' : 'none' }}>
              <TrainingList items={trainings} onDelete={deleteTraining} userWeight={user?.peso} />
            </div>
          </>
        )}
      </div>
    </>
  );
}