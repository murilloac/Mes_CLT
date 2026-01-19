import React, { useState } from 'react';
import './Metas.css';

const Metas = ({ receitas, despesas, metas, onSalvarMeta }) => {
  const [metaGastos, setMetaGastos] = useState(metas?.gastos || '');
  const [metaEconomia, setMetaEconomia] = useState(metas?.economia || '');
  const [editando, setEditando] = useState(false);

  const totalReceitas = receitas.reduce((acc, r) => acc + parseFloat(r.valor), 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + parseFloat(d.valor), 0);
  const saldo = totalReceitas - totalDespesas;

  const handleSalvar = () => {
    onSalvarMeta({
      gastos: parseFloat(metaGastos) || 0,
      economia: parseFloat(metaEconomia) || 0
    });
    setEditando(false);
  };

  const progressoGastos = metas?.gastos > 0 ? (totalDespesas / metas.gastos * 100) : 0;
  const progressoEconomia = metas?.economia > 0 ? (saldo / metas.economia * 100) : 0;

  const formatMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="metas-container">
      <div className="metas-header">
        <h2>🎯 Metas do Mês</h2>
        <button onClick={() => setEditando(!editando)} className="btn-editar-meta">
          {editando ? '❌ Cancelar' : '✏️ Editar'}
        </button>
      </div>

      {editando ? (
        <div className="metas-form">
          <div className="meta-input">
            <label>Meta de Gastos Máximos:</label>
            <input
              type="number"
              step="0.01"
              value={metaGastos}
              onChange={(e) => setMetaGastos(e.target.value)}
              placeholder="R$ 0,00"
            />
          </div>
          <div className="meta-input">
            <label>Meta de Economia:</label>
            <input
              type="number"
              step="0.01"
              value={metaEconomia}
              onChange={(e) => setMetaEconomia(e.target.value)}
              placeholder="R$ 0,00"
            />
          </div>
          <button onClick={handleSalvar} className="btn-salvar-meta">💾 Salvar Metas</button>
        </div>
      ) : (
        <div className="metas-display">
          {metas?.gastos > 0 && (
            <div className="meta-card">
              <h3>💳 Meta de Gastos</h3>
              <p className="meta-valor">Limite: {formatMoeda(metas.gastos)}</p>
              <p className="meta-atual">Gasto: {formatMoeda(totalDespesas)}</p>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${progressoGastos > 100 ? 'alerta' : ''}`}
                  style={{ width: `${Math.min(progressoGastos, 100)}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {progressoGastos.toFixed(1)}% {progressoGastos > 100 && '⚠️ Meta ultrapassada!'}
              </p>
            </div>
          )}

          {metas?.economia > 0 && (
            <div className="meta-card">
              <h3>💰 Meta de Economia</h3>
              <p className="meta-valor">Objetivo: {formatMoeda(metas.economia)}</p>
              <p className="meta-atual">Economizado: {formatMoeda(saldo)}</p>
              <div className="progress-bar">
                <div 
                  className={`progress-fill economia ${progressoEconomia >= 100 ? 'completo' : ''}`}
                  style={{ width: `${Math.min(progressoEconomia, 100)}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {progressoEconomia.toFixed(1)}% {progressoEconomia >= 100 && '🎉 Meta atingida!'}
              </p>
            </div>
          )}

          {(!metas?.gastos && !metas?.economia) && (
            <p className="sem-metas">Clique em "Editar" para definir suas metas</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Metas;
