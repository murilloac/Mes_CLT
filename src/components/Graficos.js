import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Graficos.css';

const Graficos = ({ receitas, despesas, receitasMesAnterior, despesasMesAnterior }) => {
  const categorias = {
    'Moradia': ['aluguel', 'condomínio', 'iptu', 'moradia'],
    'Alimentação': ['mercado', 'alimentação', 'comida', 'restaurante', 'ifood'],
    'Transporte': ['combustível', 'gasolina', 'uber', 'transporte', 'ônibus'],
    'Contas': ['água', 'energia', 'luz', 'internet', 'telefone', 'celular', 'tv'],
    'Saúde': ['farmácia', 'médico', 'plano', 'saúde', 'academia'],
    'Lazer': ['lazer', 'cinema', 'streaming', 'netflix', 'spotify'],
    'Outros': []
  };

  const categorizarDespesa = (descricao, categoriaExistente) => {
    // Se já tem categoria salva, usa ela
    if (categoriaExistente) return categoriaExistente;
    
    // Senão, tenta categorizar pela descrição
    const desc = descricao.toLowerCase();
    for (const [categoria, palavras] of Object.entries(categorias)) {
      if (palavras.some(p => desc.includes(p))) return categoria;
    }
    return 'Outros';
  };

  const despesasPorCategoria = despesas.reduce((acc, d) => {
    const cat = categorizarDespesa(d.descricao, d.categoria);
    acc[cat] = (acc[cat] || 0) + parseFloat(d.valor);
    return acc;
  }, {});

  const dadosPizza = Object.entries(despesasPorCategoria).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }));

  const CORES = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#feca57', '#ff6b6b'];

  const totalAtual = receitas.reduce((acc, r) => acc + parseFloat(r.valor), 0);
  const despesasAtual = despesas.reduce((acc, d) => acc + parseFloat(d.valor), 0);
  const totalAnterior = receitasMesAnterior.reduce((acc, r) => acc + parseFloat(r.valor), 0);
  const despesasAnterior = despesasMesAnterior.reduce((acc, d) => acc + parseFloat(d.valor), 0);

  const dadosComparacao = [
    {
      mes: 'Mês Anterior',
      Receitas: totalAnterior,
      Despesas: despesasAnterior,
      Saldo: totalAnterior - despesasAnterior
    },
    {
      mes: 'Mês Atual',
      Receitas: totalAtual,
      Despesas: despesasAtual,
      Saldo: totalAtual - despesasAtual
    }
  ];

  return (
    <div className="graficos-container">
      <div className="grafico-card">
        <h3>📊 Despesas por Categoria</h3>
        {dadosPizza.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosPizza}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosPizza.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="sem-dados">Nenhuma despesa cadastrada</p>
        )}
      </div>

      <div className="grafico-card">
        <h3>📈 Comparação com Mês Anterior</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosComparacao}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="Receitas" fill="#38ef7d" />
            <Bar dataKey="Despesas" fill="#f45c43" />
            <Bar dataKey="Saldo" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graficos;
