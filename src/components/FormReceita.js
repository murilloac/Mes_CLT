import React, { useState } from 'react';
import './Form.css';

const FormReceita = ({ onAdd, mesAtual }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipoSalario, setTipoSalario] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const descricaoFinal = tipoSalario || descricao;
    if (!descricaoFinal || !valor) return;
    
    onAdd({
      descricao: descricaoFinal,
      valor: parseFloat(valor),
      mes: mesAtual,
      tipo: 'receita'
    });

    setDescricao('');
    setValor('');
    setTipoSalario('');
  };

  return (
    <div className="form-card receita-form">
      <h2>➕ Adicionar Receita</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={tipoSalario}
          onChange={(e) => {
            setTipoSalario(e.target.value);
            setDescricao('');
          }}
        >
          <option value="">Selecione ou digite abaixo</option>
          <option value="Salário Murillo">Salário Murillo</option>
          <option value="Salário Lorrainne">Salário Lorrainne</option>
        </select>
        <input
          type="text"
          placeholder="Ou digite outra descrição"
          value={descricao}
          onChange={(e) => {
            setDescricao(e.target.value);
            setTipoSalario('');
          }}
          disabled={!!tipoSalario}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor (R$)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />
        <button type="submit" className="btn-receita">Adicionar Receita</button>
      </form>
    </div>
  );
};

export default FormReceita;
