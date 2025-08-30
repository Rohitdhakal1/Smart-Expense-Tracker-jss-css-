
const balanceEl = document.querySelector("#balance");      
const incomeEl = document.querySelector("#income-amount");
const expenseEl = document.querySelector("#expense-amount");
const listEl = document.querySelector("#transaction-list");
const formEl = document.querySelector("#transaction-form");
const descEl = document.querySelector("#description");
const amountEl = document.querySelector("#amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


formEl.addEventListener("submit", function(e) {
  e.preventDefault();
  const desc = descEl.value.trim();
  const amount = parseFloat(amountEl.value);
  if (!desc || !amount) return;

  const newTransaction = { id: Date.now(), description: desc, amount };
  transactions.push(newTransaction);


  saveAndUpdate();
  formEl.reset();
});

function saveAndUpdate() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateSummary();
}


function renderTransactions() {
  listEl.innerHTML = "";
 
  transactions.slice().reverse().forEach(tran => {
    const li = document.createElement("li");
    li.className = `transaction ${tran.amount > 0 ? "income" : "expense"}`;
    li.innerHTML = `
      <span>${tran.description}</span>
      <span>
        ${formatRupee(tran.amount)}
        <button onclick="deleteTransaction(${tran.id})" class="delete-btn">x</button>
      </span>
    `;
    listEl.appendChild(li);
  });
}


function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveAndUpdate();
}


function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  const balance = amounts.reduce((a,b)=>a+b,0);
  const income = amounts.filter(a=>a>0).reduce((a,b)=>a+b,0);
  const expense = amounts.filter(a=>a<0).reduce((a,b)=>a+b,0);

  balanceEl.textContent = formatRupee(balance);
  incomeEl.textContent = formatRupee(income);
  expenseEl.textContent = formatRupee(expense);
}


function formatRupee(num) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(num);
}

renderTransactions();
updateSummary();
