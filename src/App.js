import React, { useState, useEffect } from 'react';
import './App.css';
import FormReceita from './components/FormReceita';
import FormDespesa from './components/FormDespesa';
import ListaTransacoes from './components/ListaTransacoes';
import Dashboard from './components/Dashboard';

function App() {
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [mesAtual, setMesAtual] = useState(new Date().toISOString().slice(0, 7));
  const [abaAtiva, setAbaAtiva] = useState('resultados');

  useEffect(() => {
    const receitasSalvas = localStorage.getItem('receitas');
    const despesasSalvas = localStorage.getItem('despesas');
    if (receitasSalvas) setReceitas(JSON.parse(receitasSalvas));
    if (despesasSalvas) setDespesas(JSON.parse(despesasSalvas));
  }, []);

  useEffect(() => {
    localStorage.setItem('receitas', JSON.stringify(receitas));
  }, [receitas]);

  useEffect(() => {
    localStorage.setItem('despesas', JSON.stringify(despesas));
  }, [despesas]);

  const adicionarReceita = (receita) => {
    setReceitas([...receitas, { ...receita, id: Date.now() }]);
  };

  const adicionarDespesa = (despesa) => {
    setDespesas([...despesas, { ...despesa, id: Date.now() }]);
  };

  const removerReceita = (id) => {
    setReceitas(receitas.filter(r => r.id !== id));
  };

  const removerDespesa = (id) => {
    setDespesas(despesas.filter(d => d.id !== id));
  };

  const editarDespesa = (id, novoValor) => {
    setDespesas(despesas.map(d => d.id === id ? { ...d, valor: novoValor, copiada: false } : d));
  };

  useEffect(() => {
    const despesasRecorrentes = despesas.filter(d => d.recorrente);
    
    despesasRecorrentes.forEach(despesa => {
      const mesAtualDate = new Date(mesAtual + '-01');
      const mesDespesaDate = new Date(despesa.mes + '-01');
      
      if (mesAtualDate > mesDespesaDate) {
        const jaExiste = despesas.some(d => 
          d.descricao === despesa.descricao && 
          d.mes === mesAtual && 
          d.id !== despesa.id
        );
        
        if (!jaExiste) {
          // Verifica se é parcelada
          if (despesa.parcela) {
            const [atual, total] = despesa.parcela.split('/').map(Number);
            
            // Se já finalizou as parcelas, não copia
            if (atual >= total) return;
            
            // Incrementa a parcela
            const novaDespesa = {
              ...despesa,
              id: Date.now() + Math.random(),
              mes: mesAtual,
              parcela: `${atual + 1}/${total}`,
              copiada: true
            };
            setDespesas(prev => [...prev, novaDespesa]);
          } else {
            // Despesa fixa sem parcela
            const novaDespesa = {
              ...despesa,
              id: Date.now() + Math.random(),
              mes: mesAtual,
              copiada: true
            };
            setDespesas(prev => [...prev, novaDespesa]);
          }
        }
      }
    });
  }, [mesAtual]);

  const receitasMes = receitas.filter(r => r.mes === mesAtual);
  const despesasMes = despesas.filter(d => d.mes === mesAtual);

  return (
    <div className="app">
      <header>
        <h1>💰 Mês CLT - Controle Financeiro</h1>
        <div className="mes-selector">
          <label>Mês:</label>
          <input 
            type="month" 
            value={mesAtual} 
            onChange={(e) => setMesAtual(e.target.value)}
          />
        </div>
      </header>

      <div className="abas">
        <button 
          className={abaAtiva === 'resultados' ? 'aba-ativa' : ''}
          onClick={() => setAbaAtiva('resultados')}
        >
          📊 Resultados
        </button>
        <button 
          className={abaAtiva === 'cadastro' ? 'aba-ativa' : ''}
          onClick={() => setAbaAtiva('cadastro')}
        >
          ➕ Cadastrar
        </button>
      </div>

      {abaAtiva === 'resultados' && (
        <div className="conteudo-aba">
          <Dashboard receitas={receitasMes} despesas={despesasMes} />
        </div>
      )}

      {abaAtiva === 'cadastro' && (
        <div className="conteudo-aba">
          <div className="forms-container">
            <FormReceita onAdd={adicionarReceita} mesAtual={mesAtual} />
            <FormDespesa onAdd={adicionarDespesa} mesAtual={mesAtual} />
          </div>

          <ListaTransacoes 
            receitas={receitasMes} 
            despesas={despesasMes}
            onRemoverReceita={removerReceita}
            onRemoverDespesa={removerDespesa}
            onEditarDespesa={editarDespesa}
          />
        </div>
      )}
    </div>
  );
}

export default App;
