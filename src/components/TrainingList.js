import React from 'react';
import { calcCalories, secondsToHours, fmt } from '../utils/calculos';

export default function TrainingList({ items, onDelete, userWeight }) {
  if (!items?.length) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Entrenamientos</h5>
          <div className="alert alert-light">No hay entrenamientos aún.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">Entrenamientos</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Tipo</th><th>Intensidad/Velocidad</th><th>Duración</th><th>Fecha</th>
                <th className="text-end">Distancia (km)</th>
                <th className="text-end">Factor</th>
                <th className="text-end">Calorías</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(t=>{
                const horas = secondsToHours(t.segundos||0)||0;
                const kcal = calcCalories(t.factor||0, Number(userWeight)||0, horas);
                const iv = t.velocidad ? `${t.velocidad} km/h` : (t.intensidad||'—');
                return (
                  <tr key={t.id}>
                    <td>{t.tipo}</td>
                    <td>{iv}</td>
                    <td>{t.duracion}</td>
                    <td>{t.fecha}</td>
                    <td className="text-end">{fmt(t.distancia||0,2)}</td>
                    <td className="text-end"><span className="badge badge-met">{fmt(t.factor||0,1)} MET</span></td>
                    <td className="text-end">{fmt(kcal||0,0)}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>onDelete?.(t.id)}>Borrar</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
