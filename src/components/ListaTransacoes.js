import React from 'react';
import './ListaTransacoes.css';

const ListaTransacoes = ({ receitas, despesas, onRemoverReceita, onRemoverDespesa, onEditarDespesa }) => {
  const formatMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="lista-transacoes">
      <div className="lista-section">
        <h2>📊 Receitas do Mês</h2>
        {receitas.length === 0 ? (
          <p className="vazio">Nenhuma receita cadastrada</p>
        ) : (
          <ul>
            {receitas.map((receita) => (
              <li key={receita.id} className="item-receita">
                <div className="info">
                  <span className="descricao">{receita.descricao}</span>
                  <span className="valor">{formatMoeda(receita.valor)}</span>
                </div>
                <button onClick={() => onRemoverReceita(receita.id)} className="btn-remover">
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lista-section">
        <h2>📊 Despesas do Mês</h2>
        {despesas.length === 0 ? (
          <p className="vazio">Nenhuma despesa cadastrada</p>
        ) : (
          <ul>
            {despesas.map((despesa) => (
              <li key={despesa.id} className="item-despesa">
                <div className="info">
                  <span className="descricao">
                    {despesa.descricao}
                    {despesa.categoria && <span className="categoria"> [{despesa.categoria}]</span>}
                    {despesa.parcela && <span className="parcela"> ({despesa.parcela})</span>}
                    {despesa.recorrente && <span className="recorrente"> 🔄</span>}
                    {despesa.copiada && <span className="copiada"> [Editar valor]</span>}
                  </span>
                  {despesa.copiada ? (
                    <input
                      type="number"
                      step="0.01"
                      className="input-editar"
                      value={despesa.valor}
                      onChange={(e) => onEditarDespesa(despesa.id, parseFloat(e.target.value))}
                    />
                  ) : (
                    <span className="valor">{formatMoeda(despesa.valor)}</span>
                  )}
                </div>
                <button onClick={() => onRemoverDespesa(despesa.id)} className="btn-remover">
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListaTransacoes;
