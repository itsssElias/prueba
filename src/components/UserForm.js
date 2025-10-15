/**
 * UserForm (controlado)
 * - No guarda estado local; recibe `value` y emite `onChange`.
 * - Evita "rebotes" al teclear porque no hay doble estado.
 */
import React from 'react';
import { calcIMC, fmt } from '../utils/calculos';

export default function UserForm({ value = {}, onChange }) {
  const user = {
    nombre: value.nombre ?? '',
    edad: value.edad ?? '',
    peso: value.peso ?? '',
    estatura: value.estatura ?? '', // cm
  };

  const handle = (e) => {
    const { name, value } = e.target;
    onChange?.({ ...user, [name]: value });
  };

  const estaturaM = (Number(user.estatura) || 0) / 100;
  const imc = calcIMC(Number(user.peso), estaturaM);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">Datos del usuario</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input
              name="nombre"
              value={user.nombre}
              onChange={handle}
              className="form-control"
              placeholder="Ejemplo: Juan Pérez"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Edad</label>
            <input
              name="edad"
              value={user.edad}
              onChange={handle}
              type="number"
              className="form-control"
              placeholder="Ejemplo: 25"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Peso (kg)</label>
            <input
              name="peso"
              value={user.peso}
              onChange={handle}
              type="number"
              step="0.1"
              className="form-control"
              placeholder="Ejemplo: 70.5"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Estatura (cm)</label>
            <input
              name="estatura"
              value={user.estatura}
              onChange={handle}
              type="number"
              step="1"
              className="form-control"
              placeholder="Ejemplo: 175"
            />
          </div>
          <div className="col-md-9 d-flex align-items-end">
            <div className="text-muted small">
              <strong>IMC:</strong> {fmt(imc)} (con {user.estatura || 0} cm → {fmt(estaturaM, 2)} m)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
