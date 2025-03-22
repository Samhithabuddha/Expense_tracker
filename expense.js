// Get DOM elements
const balanceEl = document.getElementById('balance');
const transactionList = document.getElementById('transaction-list');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addBtn = document.getElementById('add-btn');

// Transaction data (in-memory storage)
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Update balance, income, and expenses
function updateSummary() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, amount) => acc + amount, 0).toFixed(2);
  balanceEl.innerText = `$${total}`;
}

// Add transaction to the list
function addTransactionToDOM(transaction) {
  const li = document.createElement('li');
  li.className = `transaction ${transaction.amount < 0 ? 'expense' : 'income'}`;
  li.innerHTML = `
    ${transaction.description} 
    <span>${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount)}</span>
    <span class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</span>
  `;
  transactionList.appendChild(li);
}

// Add new transaction
function addTransaction(e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (description === '' || isNaN(amount)) {
    alert('Please provide valid description and amount');
    return;
  }

  const transaction = {
    id: Date.now(),
    description,
    amount,
  };

  transactions.push(transaction);
  updateLocalStorage();
  descriptionInput.value = '';
  amountInput.value = '';
  init();
}

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Save transactions to localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app
function init() {
  transactionList.innerHTML = '';
  transactions.forEach(addTransactionToDOM);
  updateSummary();
}

// Add event listener
addBtn.addEventListener('click', addTransaction);

// Initialize on load
init();
