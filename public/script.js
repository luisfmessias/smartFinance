document.addEventListener('DOMContentLoaded', () => {
  loadSaldo();
  loadReceitas();
  loadDespesas();

  document.getElementById('receitaForm').addEventListener('submit', addReceita);
  document.getElementById('despesaForm').addEventListener('submit', addDespesa);
});

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

async function loadSaldo() {
  try {
    const response = await fetch('/api/dashboard/saldo');
    const data = await response.json();
    document.getElementById('saldo').innerHTML = `
      <p>Total Receitas: R$ ${data.totalReceitas.toFixed(2)}</p>
      <p>Total Despesas: R$ ${data.totalDespesas.toFixed(2)}</p>
      <p>Saldo: R$ ${data.saldo.toFixed(2)}</p>
    `;
  } catch (error) {
    console.error('Erro ao carregar saldo:', error);
  }
}

async function loadReceitas() {
  try {
    const response = await fetch('/api/receitas');
    const receitas = await response.json();
    const list = document.getElementById('receitasList');
    list.innerHTML = '';
    receitas.forEach(receita => {
      const li = document.createElement('li');
      li.textContent = `${receita.descricao} - R$ ${receita.valor} (${receita.data})`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao carregar receitas:', error);
  }
}

async function loadDespesas() {
  try {
    const response = await fetch('/api/despesas');
    const despesas = await response.json();
    const list = document.getElementById('despesasList');
    list.innerHTML = '';
    despesas.forEach(despesa => {
      const li = document.createElement('li');
      li.textContent = `${despesa.descricao} - R$ ${despesa.valor} (${despesa.data})`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao carregar despesas:', error);
  }
}

async function addReceita(event) {
  event.preventDefault();
  const descricao = document.getElementById('receitaDescricao').value;
  const valor = parseFloat(document.getElementById('receitaValor').value);
  const data = document.getElementById('receitaData').value;
  const categoria = document.getElementById('receitaCategoria').value;

  try {
    await fetch('/api/receitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao, valor, data, categoria })
    });
    document.getElementById('receitaForm').reset();
    loadReceitas();
    loadSaldo();
  } catch (error) {
    console.error('Erro ao adicionar receita:', error);
  }
}

async function addDespesa(event) {
  event.preventDefault();
  const descricao = document.getElementById('despesaDescricao').value;
  const valor = parseFloat(document.getElementById('despesaValor').value);
  const data = document.getElementById('despesaData').value;
  const categoria = document.getElementById('despesaCategoria').value;

  try {
    await fetch('/api/despesas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao, valor, data, categoria })
    });
    document.getElementById('despesaForm').reset();
    loadDespesas();
    loadSaldo();
  } catch (error) {
    console.error('Erro ao adicionar despesa:', error);
  }
}