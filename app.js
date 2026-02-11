const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

let currentUser = "";
let db = { emi: [], expense: [], month: [] };
let expenseChart, debtChart;

/* LOGIN */

function login() {
    const user = document.getElementById("username").value.trim();
    if(!user) return alert("Enter username");

    currentUser = user;

    const saved = localStorage.getItem("user_" + user);
    if(saved) db = JSON.parse(saved);

    document.getElementById("loginSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";

    renderAll();
}

/* EMI */

function addEMI() {
    db.emi.push({ name: "Loan", emi: 0, tenure: 12, paid: 0 });
    renderAll();
}

function renderEMI() {
    const tbody = document.querySelector("#emiTable tbody");
    tbody.innerHTML = "";

    db.emi.forEach((e, i) => {
        tbody.innerHTML += `
        <tr>
            <td><input value="${e.name}" onchange="updateEMI(${i}, 'name', this.value)"></td>
            <td><input type="number" value="${e.emi}" onchange="updateEMI(${i}, 'emi', this.value)"></td>
            <td><input type="number" value="${e.tenure}" onchange="updateEMI(${i}, 'tenure', this.value)"></td>
            <td><input type="number" value="${e.paid}" onchange="updateEMI(${i}, 'paid', this.value)"></td>
        </tr>`;
    });
}

function updateEMI(i, key, value) {
    db.emi[i][key] = key === "name" ? value : Number(value);
    renderAll();
}

/* PERSONAL EXPENSE */

function addExpense() {
    db.expense.push({ name: "Expense", amount: 0 });
    renderAll();
}

function renderExpense() {
    const tbody = document.querySelector("#expenseTable tbody");
    tbody.innerHTML = "";

    db.expense.forEach((e, i) => {
        tbody.innerHTML += `
        <tr>
            <td><input value="${e.name}" onchange="updateExpense(${i}, 'name', this.value)"></td>
            <td><input type="number" value="${e.amount}" onchange="updateExpense(${i}, 'amount', this.value)"></td>
        </tr>`;
    });
}

function updateExpense(i, key, value) {
    db.expense[i][key] = key === "name" ? value : Number(value);
    renderAll();
}

/* MONTH */

function renderMonth() {
    const tbody = document.querySelector("#monthTable tbody");
    tbody.innerHTML = "";

    const totalEmi = db.emi.reduce((s, e) => s + e.emi, 0);
    const totalExpense = db.expense.reduce((s, e) => s + e.amount, 0);

    for(let i = 0; i < 12; i++) {
        if(!db.month[i]) db.month[i] = { income: 100000 };

        const net = db.month[i].income - totalEmi - totalExpense;

        tbody.innerHTML += `
        <tr>
            <td>${months[i]}</td>
            <td><input type="number" value="${db.month[i].income}" onchange="updateMonth(${i}, this.value)"></td>
            <td>${net}</td>
        </tr>`;
    }
}

function updateMonth(i, value) {
    db.month[i].income = Number(value);
    renderAll();
}

/* DASHBOARD */

function renderCharts() {
    const expenses = db.month.map(m => m ? m.income : 0);
    const debts = db.emi.map(e => e.emi * Math.max(e.tenure - e.paid, 0));

    if(expenseChart) expenseChart.destroy();
    if(debtChart) debtChart.destroy();

    expenseChart = new Chart(document.getElementById("expenseChart"), {
        type: "bar",
        data: {
            labels: months,
            datasets: [{ label: "Income", data: expenses }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    debtChart = new Chart(document.getElementById("debtChart"), {
        type: "doughnut",
        data: {
            labels: db.emi.map(e => e.name),
            datasets: [{ data: debts }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

/* SAVE */

function save() {
    localStorage.setItem("user_" + currentUser, JSON.stringify(db));
}

function renderAll() {
    renderEMI();
    renderExpense();
    renderMonth();
    renderCharts();
    save();
}
