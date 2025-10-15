import React, { useMemo } from 'react';
import { calcCalories, calcIMC, fmt, secondsToHours } from '../utils/calculos';

export default function UserStats({ user, trainings }) {
  const peso = Number(user?.peso)||0;
  const estaturaCm = Number(user?.estatura)||0;
  const estaturaM = estaturaCm/100;

  const { totalHoras, totalDistancia, totalCalorias } = useMemo(()=>{
    const totalSegundos = trainings.reduce((a,t)=>a+(t.segundos||0),0);
    const totalHoras = secondsToHours(totalSegundos)||0;
    const totalDistancia = trainings.reduce((a,t)=>a+(t.distancia||0),0);
    const totalCalorias = trainings.reduce((a,t)=>{
      const horas = secondsToHours(t.segundos||0)||0;
      return a+calcCalories(t.factor||0,peso,horas);
    },0);
    return { totalHoras, totalDistancia, totalCalorias };
  },[trainings,peso]);

  const imc = calcIMC(peso, estaturaM);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">Estadísticas</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="stat-card">
              <div className="label">IMC</div>
              <div className="value">{fmt(imc)}</div>
              <div className="text-muted small">{fmt(estaturaM,2)} m ({estaturaCm} cm)</div>
            </div>
          </div>
          <div className="col-md-3"><div className="stat-card"><div className="label">Horas</div><div className="value">{fmt(totalHoras,2)}</div></div></div>
          <div className="col-md-3"><div className="stat-card"><div className="label">Distancia km</div><div className="value">{fmt(totalDistancia,2)}</div></div></div>
          <div className="col-md-3"><div className="stat-card"><div className="label">Calorías</div><div className="value">{fmt(totalCalorias,0)}</div></div></div>
        </div>
      </div>
    </div>
  );
}
