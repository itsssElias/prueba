import React, { useEffect, useMemo, useState } from 'react';
import DigitDurationInput from './DigitDurationInput';
import {
  TIPOS_ACTIVIDAD,
  hhmmssToSeconds,
  metForCycling,
  metForRunning,
  metForWalkingIntensity,
  metForSwimmingIntensity
} from '../utils/calculos';

export default function TrainingForm({ onAdd }) {
  const [tipo, setTipo] = useState('Ciclismo');
  const [duracion, setDuracion] = useState('00:30:00');
  const [fecha, setFecha] = useState(() => {
  const today = new Date();
  // ajustamos a la zona local
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
});

  const [distancia, setDistancia] = useState('0');
  const [intensidad, setIntensidad] = useState('Moderada');
  const [velocidad, setVelocidad] = useState('18');
  const [factor, setFactor] = useState(0);
  const [manual, setManual] = useState(false); // checkbox para activar edición
  const [error, setError] = useState('');

  // cálculo automático según tipo
  const factorAuto = useMemo(() => {
    if (tipo === 'Ciclismo') return metForCycling(velocidad);
    if (tipo === 'Correr') return metForRunning(velocidad);
    if (tipo === 'Caminata') return metForWalkingIntensity(intensidad);
    if (tipo === 'Natación') return metForSwimmingIntensity(intensidad);
    return 0;
  }, [tipo, intensidad, velocidad]);

  useEffect(() => { if (!manual) setFactor(factorAuto); }, [factorAuto, manual]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    const secs = hhmmssToSeconds(duracion);
    if (isNaN(secs) || secs <= 0) { setError('Duración inválida'); return; }
    const f = manual ? Number(factor) : factorAuto;
    if (!f || f <= 0) { setError('Factor inválido'); return; }

    const training = {
      id: crypto.randomUUID(),
      tipo,
      duracion,
      fecha,
      distancia: Number(distancia),
      factor: f,
      segundos: secs,
      intensidad: (tipo === 'Caminata' || tipo === 'Natación') ? intensidad : undefined,
      velocidad: (tipo === 'Ciclismo' || tipo === 'Correr') ? Number(velocidad) : undefined,
      factorManual: manual
    };

    onAdd?.(training);
    setDuracion('00:30:00'); setDistancia('0');
  };

  const applyPreset = (h, m, s = 0) => {
    const HH = String(h).padStart(2, '0');
    const MM = String(m).padStart(2, '0');
    const SS = String(s).padStart(2, '0');
    setDuracion(`${HH}:${MM}:${SS}`);
  };

  const renderCamposTipo = () => {
    if (tipo === 'Ciclismo' || tipo === 'Correr') {
      return (
        <div className="col-md-3">
          <label className="form-label">Velocidad (km/h)</label>
          <input type="number" className="form-control" value={velocidad} onChange={e => setVelocidad(e.target.value)} />
        </div>
      );
    }
    if (tipo === 'Caminata' || tipo === 'Natación') {
      return (
        <div className="col-md-3">
          <label className="form-label">Intensidad</label>
          <select className="form-select" value={intensidad} onChange={e => setIntensidad(e.target.value)}>
            <option>Suave</option><option>Moderada</option><option>Vigorosa</option>
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">Nuevo entrenamiento</h5>
        {error && <div className="alert alert-danger">{error}</div>}

        <form className="row g-3" onSubmit={onSubmit}>
          <div className="col-md-3">
            <label className="form-label">Tipo</label>
            <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
              {TIPOS_ACTIVIDAD.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {renderCamposTipo()}

          <div className="col-md-3">
            <DigitDurationInput label="Duración" value={duracion} onChange={setDuracion} />
            <div className="d-flex gap-2 mt-1">
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => applyPreset(0, 15)}>15m</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => applyPreset(0, 30)}>30m</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => applyPreset(1, 0)}>1h</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => applyPreset(1, 30)}>1h30</button>
            </div>

          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha</label>
            <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>

          <div className="col-md-3">
            <label className="form-label">Distancia (km)</label>
            <input type="number" className="form-control" value={distancia} onChange={e => setDistancia(e.target.value)} />
          </div>

          <div className="col-md-3">
            <label className="form-label">Factor (MET)</label>
            <input
              type="number"
              className="form-control"
              value={factor}
              onChange={e => setFactor(e.target.value)}
              readOnly={!manual}
              style={{ backgroundColor: manual ? 'white' : '#f0f0f0' }}
            />
            <div className="form-check mt-1">
              <input
                type="checkbox"
                className="form-check-input"
                checked={manual}
                onChange={e => setManual(e.target.checked)}
                id="manualCheck"
              />
              <label htmlFor="manualCheck" className="form-check-label">Editar manualmente</label>
            </div>
          </div>

          <div className="col-12">
            <button className="btn btn-primary">Agregar entrenamiento</button>
          </div>
        </form>
      </div>
    </div>
  );
}
