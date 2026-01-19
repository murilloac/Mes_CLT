import React, { useState } from 'react';
import './Form.css';

const FormDespesa = ({ onAdd, mesAtual }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [parcelaAtual, setParcelaAtual] = useState('');
  const [parcelaTotal, setParcelaTotal] = useState('');
  const [recorrente, setRecorrente] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descricao || !valor) return;
    
    const despesa = {
      descricao,
      valor: parseFloat(valor),
      mes: mesAtual,
      tipo: 'despesa'
    };

    if (parcelaAtual && parcelaTotal) {
      despesa.parcela = `${parcelaAtual}/${parcelaTotal}`;
      despesa.recorrente = true; // Parcelas são sempre recorrentes
    }

    if (recorrente && !despesa.parcela) {
      despesa.recorrente = true;
    }

    onAdd(despesa);

    setDescricao('');
    setValor('');
    setParcelaAtual('');
    setParcelaTotal('');
    setRecorrente(false);
  };

  return (
    <div className="form-card despesa-form">
      <h2>➖ Adicionar Despesa</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descrição (ex: Água, Energia)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor (R$)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />
        <div className="parcela-group">
          <input
            type="number"
            placeholder="Parcela atual"
            value={parcelaAtual}
            onChange={(e) => setParcelaAtual(e.target.value)}
          />
          <span>/</span>
          <input
            type="number"
            placeholder="Total"
            value={parcelaTotal}
            onChange={(e) => setParcelaTotal(e.target.value)}
          />
        </div>
        <label className="checkbox-recorrente">
          <input
            type="checkbox"
            checked={recorrente}
            onChange={(e) => setRecorrente(e.target.checked)}
          />
          🔄 Despesa fixa mensal (repetir nos próximos meses)
        </label>
        <button type="submit" className="btn-despesa">Adicionar Despesa</button>
      </form>
    </div>
  );
};

export default FormDespesa;
