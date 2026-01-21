// Seletores
const form = document.getElementById('transaction-form'); // Receitas
const expenseForm = document.getElementById('expense-form'); // Despesas

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

const expenseDescription = document.getElementById('expense-description');
const expenseAmount = document.getElementById('expense-amount');

const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionsList = document.getElementById('transactions');
const clearBtn = document.getElementById('clear');

const transferForm = document.getElementById('transfer-form'); 
const transferDescription = document.getElementById('transfer-description');
const transferAmount = document.getElementById('transfer-amount');

/* ---------------------------
   ADICIONAR TRANSFERÊNCIA
---------------------------- */
transferForm.addEventListener('submit', e => {
  e.preventDefault();

  const description = transferDescription.value.trim();
  let amount = parseFloat(transferAmount.value.replace(',', '.'));

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Digite um valor válido para transferência (deve ser POSITIVO).");
    return;
  }

  // Como é uma saída → deixa o valor negativo
  amount = -Math.abs(amount);

  transactions.unshift({
    description: "Transferência: " + description,
    amount: amount,
    date: new Date().toISOString().slice(0, 10),
    category: "Transferência"
  });

  transferForm.reset();
  updateUI();
});

// --- USUÁRIO LOGADO ---
const currentUser = localStorage.getItem("loggedUser");
const storageKey = `fina_transactions_${currentUser}`;

// Recupera transações do usuário logado
let transactions = JSON.parse(localStorage.getItem(storageKey)) || [];

// Atualiza a interface
function updateUI() {
  transactionsList.innerHTML = '';

  if (transactions.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.textContent = '📭 Nenhum histórico a ser exibido.';
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.color = '#ccc';
    emptyMsg.style.fontStyle = 'italic';
    emptyMsg.style.padding = '10px 0';
    transactionsList.appendChild(emptyMsg);

    balanceEl.textContent = 'R$ 0,00';
    incomeEl.textContent = 'R$ 0,00';
    expensesEl.textContent = 'R$ 0,00';

    localStorage.setItem(storageKey, JSON.stringify([]));
    return;
  }

  let balance = 0;
  let income = 0;
  let expenses = 0;

  transactions.forEach((t, index) => {
    const li = document.createElement('li');
    li.className = t.amount > 0 ? 'income' : 'expense';
    li.innerHTML = `
      <span>${t.description}</span>
      <span>${t.amount > 0 ? '+' : ''}R$ ${t.amount.toFixed(2)}</span>
      <button class="delete-btn" data-index="${index}">✖</button>
    `;

    transactionsList.appendChild(li);

    if (t.amount > 0) income += t.amount;
    else expenses += t.amount;

    balance += t.amount;
  });

  balanceEl.textContent = `R$ ${balance.toFixed(2)}`;
  incomeEl.textContent = `R$ ${income.toFixed(2)}`;
  expensesEl.textContent = `R$ ${Math.abs(expenses).toFixed(2)}`;

  // Salva corretamente:
  localStorage.setItem(storageKey, JSON.stringify(transactions));

  // Cor dinâmica
  balanceEl.style.color = balance >= 0 ? "#0ebbc7" : "#ff3b3b";
}

/* ---------------------------
   ADICIONAR RECEITA (positivo)
---------------------------- */
form.addEventListener('submit', e => {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.replace(',', '.'));

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Para receita use valor POSITIVO. Ex: 50 ou 80,99");
    return;
  }

  transactions.unshift({
    description,
    amount,
    date: new Date().toISOString().slice(0, 10),
    category: "Renda"
  });

  form.reset();
  updateUI();
});

/* ---------------------------
  ADICIONAR DESPESA
---------------------------- */
expenseForm.addEventListener('submit', e => {
  e.preventDefault();

  const description = expenseDescription.value.trim();
  let amount = parseFloat(expenseAmount.value.replace(',', '.'));

  if (!description || isNaN(amount)) {
    alert("Digite uma descrição e um valor válido.");
    return;
  }

  // transforma em negativo
  if (amount > 0) amount = -amount;

  transactions.unshift({
    description,
    amount,
    date: new Date().toISOString().slice(0, 10),
    category: "Despesa"
  });

  expenseForm.reset();
  updateUI();
});

/* ---------------------------
   Excluir transação individual
---------------------------- */
transactionsList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.dataset.index;

    if (confirm("Deseja realmente excluir esta transação?")) {
      transactions.splice(index, 1);
      updateUI();
    }
  }
});

/* ---------------------------
   Limpar histórico
---------------------------- */
clearBtn.addEventListener('click', () => {
  if (transactions.length === 0) {
    alert("Não há nenhum histórico a ser excluído.");
    return;
  }

  if (confirm("Deseja realmente limpar todo o histórico?")) {
    transactions = [];
    updateUI();
  }
});

/* ---------------------------
 Inicializar interface
---------------------------- */
updateUI();
