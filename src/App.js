import React, { useState, useEffect } from 'react';
import './App.css';
import FormReceita from './components/FormReceita';
import FormDespesa from './components/FormDespesa';
import ListaTransacoes from './components/ListaTransacoes';
import Dashboard from './components/Dashboard';
import Metas from './components/Metas';
import Graficos from './components/Graficos';

function App() {
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [mesAtual, setMesAtual] = useState(new Date().toISOString().slice(0, 7));
  const [abaAtiva, setAbaAtiva] = useState('resultados');
  const [modoEscuro, setModoEscuro] = useState(false);
  const [metas, setMetas] = useState({});

  useEffect(() => {
    const receitasSalvas = localStorage.getItem('receitas');
    const despesasSalvas = localStorage.getItem('despesas');
    const metasSalvas = localStorage.getItem('metas');
    const modoEscuroSalvo = localStorage.getItem('modoEscuro');
    
    if (receitasSalvas) setReceitas(JSON.parse(receitasSalvas));
    if (despesasSalvas) setDespesas(JSON.parse(despesasSalvas));
    if (metasSalvas) setMetas(JSON.parse(metasSalvas));
    if (modoEscuroSalvo) setModoEscuro(JSON.parse(modoEscuroSalvo));
  }, []);

  useEffect(() => {
    localStorage.setItem('receitas', JSON.stringify(receitas));
  }, [receitas]);

  useEffect(() => {
    localStorage.setItem('despesas', JSON.stringify(despesas));
  }, [despesas]);

  useEffect(() => {
    localStorage.setItem('metas', JSON.stringify(metas));
  }, [metas]);

  useEffect(() => {
    localStorage.setItem('modoEscuro', JSON.stringify(modoEscuro));
    document.body.className = modoEscuro ? 'modo-escuro' : '';
  }, [modoEscuro]);

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

  const salvarMeta = (novasMetas) => {
    setMetas({ ...metas, [mesAtual]: novasMetas });
  };

  const exportarDados = () => {
    const dados = { receitas, despesas, metas };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes-clt-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const importarDados = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dados = JSON.parse(event.target.result);
        if (dados.receitas) setReceitas(dados.receitas);
        if (dados.despesas) setDespesas(dados.despesas);
        if (dados.metas) setMetas(dados.metas);
        alert('Dados importados com sucesso!');
      } catch (error) {
        alert('Erro ao importar dados!');
      }
    };
    reader.readAsText(file);
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
          if (despesa.parcela) {
            const [atual, total] = despesa.parcela.split('/').map(Number);
            if (atual >= total) return;
            
            const novaDespesa = {
              ...despesa,
              id: Date.now() + Math.random(),
              mes: mesAtual,
              parcela: `${atual + 1}/${total}`,
              copiada: true
            };
            setDespesas(prev => [...prev, novaDespesa]);
          } else {
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
  }, [despesas]);

  const receitasMes = receitas.filter(r => r.mes === mesAtual);
  const despesasMes = despesas.filter(d => d.mes === mesAtual);

  const mesAnteriorDate = new Date(mesAtual + '-01');
  mesAnteriorDate.setMonth(mesAnteriorDate.getMonth() - 1);
  const mesAnterior = mesAnteriorDate.toISOString().slice(0, 7);
  
  const receitasMesAnterior = receitas.filter(r => r.mes === mesAnterior);
  const despesasMesAnterior = despesas.filter(d => d.mes === mesAnterior);

  return (
    <div className="app">
      <header>
        <h1>💰 Mês CLT - Controle Financeiro</h1>
        <div className="header-controls">
          <div className="mes-selector">
            <label>Mês:</label>
            <input 
              type="month" 
              value={mesAtual} 
              onChange={(e) => setMesAtual(e.target.value)}
            />
          </div>
          <button 
            className="btn-modo" 
            onClick={() => setModoEscuro(!modoEscuro)}
            title="Alternar modo escuro/claro"
          >
            {modoEscuro ? '☀️' : '🌙'}
          </button>
          <button className="btn-exportar" onClick={exportarDados} title="Exportar dados">
            💾
          </button>
          <label className="btn-importar" title="Importar dados">
            📂
            <input type="file" accept=".json" onChange={importarDados} style={{display: 'none'}} />
          </label>
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
          <Metas 
            receitas={receitasMes} 
            despesas={despesasMes} 
            metas={metas[mesAtual]}
            onSalvarMeta={salvarMeta}
          />
          <Graficos 
            receitas={receitasMes} 
            despesas={despesasMes}
            receitasMesAnterior={receitasMesAnterior}
            despesasMesAnterior={despesasMesAnterior}
          />
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
