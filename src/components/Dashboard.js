import React from 'react';
import './Dashboard.css';

const Dashboard = ({ receitas, despesas }) => {
  const totalReceitas = receitas.reduce((acc, r) => acc + parseFloat(r.valor), 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + parseFloat(d.valor), 0);
  const saldo = totalReceitas - totalDespesas;
  const percentualDespesas = totalReceitas > 0 ? (totalDespesas / totalReceitas * 100).toFixed(1) : 0;

  // Receitas individuais
  const receitaMurillo = receitas
    .filter(r => r.descricao.toLowerCase().includes('murillo'))
    .reduce((acc, r) => acc + parseFloat(r.valor), 0);
  
  const receitaLorrainne = receitas
    .filter(r => r.descricao.toLowerCase().includes('lorrainne'))
    .reduce((acc, r) => acc + parseFloat(r.valor), 0);

  // Proporção de cada um
  const proporcaoMurillo = totalReceitas > 0 ? receitaMurillo / totalReceitas : 0;
  const proporcaoLorrainne = totalReceitas > 0 ? receitaLorrainne / totalReceitas : 0;

  // Divisão do saldo em 3 frentes (33.33% cada)
  const lazer = saldo > 0 ? saldo / 3 : 0;
  const melhorias = saldo > 0 ? saldo / 3 : 0;
  const quitacao = saldo > 0 ? saldo / 3 : 0;

  const percentualLazer = totalReceitas > 0 ? (lazer / totalReceitas * 100).toFixed(1) : 0;
  const percentualMelhorias = totalReceitas > 0 ? (melhorias / totalReceitas * 100).toFixed(1) : 0;
  const percentualQuitacao = totalReceitas > 0 ? (quitacao / totalReceitas * 100).toFixed(1) : 0;

  // Contribuição nas despesas
  const contribuicaoMurilloDespesas = totalDespesas * proporcaoMurillo;
  const contribuicaoLorrainneDespesas = totalDespesas * proporcaoLorrainne;
  const percentualContribuicaoMurillo = receitaMurillo > 0 ? (contribuicaoMurilloDespesas / receitaMurillo * 100).toFixed(1) : 0;
  const percentualContribuicaoLorrainne = receitaLorrainne > 0 ? (contribuicaoLorrainneDespesas / receitaLorrainne * 100).toFixed(1) : 0;

  // Divisão por pessoa em cada frente
  const murilloLazer = lazer * proporcaoMurillo;
  const murilloMelhorias = melhorias * proporcaoMurillo;
  const murilloQuitacao = quitacao * proporcaoMurillo;

  const lorrainneLazer = lazer * proporcaoLorrainne;
  const lorrainneMelhorias = melhorias * proporcaoLorrainne;
  const lorrainneQuitacao = quitacao * proporcaoLorrainne;

  const formatMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <>
      <div className="dashboard">
        <div className="card receita">
          <h3>📈 Receitas</h3>
          <p className="valor">{formatMoeda(totalReceitas)}</p>
        </div>
        <div className="card despesa">
          <h3>📉 Despesas</h3>
          <p className="valor">{formatMoeda(totalDespesas)}</p>
          <p className="percentual">{percentualDespesas}% da receita</p>
        </div>
        <div className={`card saldo ${saldo >= 0 ? 'positivo' : 'negativo'}`}>
          <h3>💵 Saldo</h3>
          <p className="valor">{formatMoeda(saldo)}</p>
        </div>
      </div>

      {saldo > 0 && (
        <div className="divisao-saldo">
          <h2>🎯 Divisão do Saldo</h2>
          <div className="cards-divisao">
            <div className="card-divisao lazer">
              <h3>🎉 Lazer</h3>
              <p className="valor">{formatMoeda(lazer)}</p>
              <p className="percentual">{percentualLazer}% da receita</p>
              {(receitaMurillo > 0 || receitaLorrainne > 0) && (
                <div className="divisao-pessoa">
                  {receitaMurillo > 0 && <p>👤 Murillo: {formatMoeda(murilloLazer)}</p>}
                  {receitaLorrainne > 0 && <p>👤 Lorrainne: {formatMoeda(lorrainneLazer)}</p>}
                </div>
              )}
            </div>
            <div className="card-divisao melhorias">
              <h3>🚀 Melhorias</h3>
              <p className="valor">{formatMoeda(melhorias)}</p>
              <p className="percentual">{percentualMelhorias}% da receita</p>
              {(receitaMurillo > 0 || receitaLorrainne > 0) && (
                <div className="divisao-pessoa">
                  {receitaMurillo > 0 && <p>👤 Murillo: {formatMoeda(murilloMelhorias)}</p>}
                  {receitaLorrainne > 0 && <p>👤 Lorrainne: {formatMoeda(lorrainneMelhorias)}</p>}
                </div>
              )}
            </div>
            <div className="card-divisao quitacao">
              <h3>💰 Quitação</h3>
              <p className="valor">{formatMoeda(quitacao)}</p>
              <p className="percentual">{percentualQuitacao}% da receita</p>
              {(receitaMurillo > 0 || receitaLorrainne > 0) && (
                <div className="divisao-pessoa">
                  {receitaMurillo > 0 && <p>👤 Murillo: {formatMoeda(murilloQuitacao)}</p>}
                  {receitaLorrainne > 0 && <p>👤 Lorrainne: {formatMoeda(lorrainneQuitacao)}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {(receitaMurillo > 0 || receitaLorrainne > 0) && (
        <div className="contribuicao-despesas">
          <h2>💳 Contribuição nas Despesas</h2>
          <div className="cards-contribuicao">
            {receitaMurillo > 0 && (
              <div className="card-contribuicao">
                <h3>👤 Murillo</h3>
                <p className="receita-individual">Receita: {formatMoeda(receitaMurillo)}</p>
                <p className="valor-contribuicao">{formatMoeda(contribuicaoMurilloDespesas)}</p>
                <p className="percentual">{percentualContribuicaoMurillo}% do seu salário</p>
              </div>
            )}
            {receitaLorrainne > 0 && (
              <div className="card-contribuicao">
                <h3>👤 Lorrainne</h3>
                <p className="receita-individual">Receita: {formatMoeda(receitaLorrainne)}</p>
                <p className="valor-contribuicao">{formatMoeda(contribuicaoLorrainneDespesas)}</p>
                <p className="percentual">{percentualContribuicaoLorrainne}% do seu salário</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
