const { useState, useEffect, useRef, useMemo } = React;

// ── Constants ──────────────────────────────────────────────
const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Salary', 'Other'];
const CAT_COLORS = {
  Food: '#f59e0b', Transport: '#3b82f6', Shopping: '#ec4899',
  Health: '#22c55e', Entertainment: '#a855f7', Bills: '#ef4444',
  Salary: '#6366f1', Other: '#94a3b8'
};

const SAMPLE_DATA = [
  { id: 1, description: 'Monthly Salary', amount: 3500, category: 'Salary', date: '2026-04-01' },
  { id: 2, description: 'Grocery Store',  amount: -120, category: 'Food',    date: '2026-04-03' },
  { id: 3, description: 'Netflix',        amount: -15,  category: 'Entertainment', date: '2026-04-05' },
  { id: 4, description: 'Electricity Bill', amount: -80, category: 'Bills',  date: '2026-04-07' },
  { id: 5, description: 'Freelance Work', amount: 800,  category: 'Salary',  date: '2026-04-10' },
  { id: 6, description: 'Gym Membership', amount: -45,  category: 'Health',  date: '2026-04-12' },
  { id: 7, description: 'Bus Pass',       amount: -30,  category: 'Transport', date: '2026-04-14' },
  { id: 8, description: 'Amazon Order',   amount: -95,  category: 'Shopping', date: '2026-04-16' },
];

function fmt(n) {
  return (n < 0 ? '-$' : '$') + Math.abs(n).toFixed(2);
}

// ── Donut Chart ──────
function DonutChart({ income, expenses }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{ data: [income, expenses], backgroundColor: ['#22c55e', '#ef4444'], borderWidth: 0, hoverOffset: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: { legend: { labels: { color: '#94a3b8', font: { size: 12 } } } }
      }
    });
    return () => chartRef.current && chartRef.current.destroy();
  }, [income, expenses]);

  return React.createElement('canvas', { ref });
}

// ── Bar Chart (monthly) ─────
function BarChart({ transactions }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  const { labels, incomeData, expenseData } = useMemo(() => {
    const months = {};
    transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      if (t.amount > 0) months[m].income += t.amount;
      else months[m].expense += Math.abs(t.amount);
    });
    const sorted = Object.keys(months).sort();
    return {
      labels: sorted.map(m => { const [y, mo] = m.split('-'); return new Date(y, mo - 1).toLocaleString('default', { month: 'short', year: '2-digit' }); }),
      incomeData: sorted.map(m => months[m].income),
      expenseData: sorted.map(m => months[m].expense),
    };
  }, [transactions]);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Income',   data: incomeData,  backgroundColor: 'rgba(34,197,94,0.7)',  borderRadius: 6 },
          { label: 'Expenses', data: expenseData, backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 6 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { size: 12 } } } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
          y: { ticks: { color: '#94a3b8', callback: v => '$' + v }, grid: { color: '#334155' } }
        }
      }
    });
    return () => chartRef.current && chartRef.current.destroy();
  }, [labels, incomeData, expenseData]);

  return React.createElement('canvas', { ref });
}

// ── Category Pie ───────
function CategoryChart({ transactions }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  const { labels, data, colors } = useMemo(() => {
    const cats = {};
    transactions.filter(t => t.amount < 0).forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount);
    });
    const keys = Object.keys(cats);
    return { labels: keys, data: keys.map(k => cats[k]), colors: keys.map(k => CAT_COLORS[k] || '#94a3b8') };
  }, [transactions]);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    if (!data.length) return;
    chartRef.current = new Chart(ref.current, {
      type: 'pie',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12 } } }
      }
    });
    return () => chartRef.current && chartRef.current.destroy();
  }, [labels, data, colors]);

  return React.createElement('canvas', { ref });
}

// ── Stat Card ────
function StatCard({ icon, iconClass, label, value, valueClass }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}><i className={icon}></i></div>
      <div className="stat-info">
        <label>{label}</label>
        <div className={`value ${valueClass}`}>{value}</div>
      </div>
    </div>
  );
}

// ── Add Transaction Form ───
function AddForm({ onAdd }) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!desc.trim() || !amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please fill in all fields with valid values.');
      return;
    }
    setError('');
    const finalAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));
    onAdd({ id: Date.now(), description: desc.trim(), amount: finalAmount, category, date });
    setDesc(''); setAmount('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Description</label>
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Coffee, Salary..." />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Amount ($)</label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>
      {error && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginBottom: '8px' }}>{error}</p>}
      <button type="submit" className="btn-add">
        <i className="fas fa-plus" style={{ marginRight: 8 }}></i>Add Transaction
      </button>
    </form>
  );
}

// ── Transaction List ───
function TxList({ transactions, onDelete }) {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'income')  return transactions.filter(t => t.amount > 0);
    if (filter === 'expense') return transactions.filter(t => t.amount < 0);
    return transactions;
  }, [transactions, filter]);

  return (
    <div>
      <div className="filter-bar">
        {['all', 'income', 'expense'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="tx-list">
        {filtered.length === 0
          ? <div className="empty"><i className="fas fa-inbox"></i>No transactions yet</div>
          : [...filtered].sort((a, b) => b.date.localeCompare(a.date)).map(t => (
            <div key={t.id} className="tx-item">
              <div className={`tx-dot ${t.amount > 0 ? 'income' : 'expense'}`}></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tx-desc" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description}</div>
                <span className="cat-badge" style={{ background: CAT_COLORS[t.category] + '22', color: CAT_COLORS[t.category] }}>{t.category}</span>
              </div>
              <div className={`tx-amount ${t.amount > 0 ? 'pos' : 'neg'}`}>{fmt(t.amount)}</div>
              <div className="tx-date">{t.date.slice(5)}</div>
              <button className="btn-del" onClick={() => onDelete(t.id)} title="Delete"><i className="fas fa-trash-alt"></i></button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── Dashboard Page ────
function Dashboard({ transactions }) {
  const income   = useMemo(() => transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0), [transactions]);
  const expenses = useMemo(() => transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0), [transactions]);
  const balance  = income - expenses;

  return (
    <div>
      <div className="page-title">Dashboard <span>Overview</span></div>

      <div className="stats-grid">
        <StatCard icon="fas fa-wallet"        iconClass="balance" label="Net Balance"    value={fmt(balance)}  valueClass={balance >= 0 ? 'pos' : 'neg'} />
        <StatCard icon="fas fa-arrow-up"      iconClass="income"  label="Total Income"   value={fmt(income)}   valueClass="pos" />
        <StatCard icon="fas fa-arrow-down"    iconClass="expense" label="Total Expenses" value={fmt(expenses)} valueClass="neg" />
        <StatCard icon="fas fa-receipt"       iconClass="count"   label="Transactions"   value={transactions.length} valueClass="neutral" />
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-title"><i className="fas fa-chart-bar" style={{ marginRight: 6 }}></i>Monthly Overview</div>
          <div className="chart-wrap"><BarChart transactions={transactions} /></div>
        </div>
        <div className="card">
          <div className="card-title"><i className="fas fa-chart-pie" style={{ marginRight: 6 }}></i>Income vs Expenses</div>
          <div className="chart-wrap"><DonutChart income={income} expenses={expenses} /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><i className="fas fa-tags" style={{ marginRight: 6 }}></i>Spending by Category</div>
        <div className="chart-wrap" style={{ height: 260 }}><CategoryChart transactions={transactions} /></div>
      </div>
    </div>
  );
}

// ── Transactions Page ──
function Transactions({ transactions, onAdd, onDelete }) {
  return (
    <div>
      <div className="page-title">Transactions <span>Manager</span></div>
      <div className="bottom-row">
        <div className="card">
          <div className="card-title"><i className="fas fa-plus-circle" style={{ marginRight: 6 }}></i>Add Transaction</div>
          <AddForm onAdd={onAdd} />
        </div>
        <div className="card">
          <div className="card-title"><i className="fas fa-list" style={{ marginRight: 6 }}></i>History</div>
          <TxList transactions={transactions} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

// ── Analytics Page ───
function Analytics({ transactions }) {
  const catTotals = useMemo(() => {
    const map = {};
    transactions.filter(t => t.amount < 0).forEach(t => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const totalExp = catTotals.reduce((s, [, v]) => s + v, 0);

  return (
    <div>
      <div className="page-title">Analytics <span>Breakdown</span></div>
      <div className="charts-row">
        <div className="card">
          <div className="card-title"><i className="fas fa-chart-pie" style={{ marginRight: 6 }}></i>Category Distribution</div>
          <div className="chart-wrap" style={{ height: 260 }}><CategoryChart transactions={transactions} /></div>
        </div>
        <div className="card">
          <div className="card-title"><i className="fas fa-chart-line" style={{ marginRight: 6 }}></i>Monthly Trend</div>
          <div className="chart-wrap" style={{ height: 260 }}><BarChart transactions={transactions} /></div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title"><i className="fas fa-table" style={{ marginRight: 6 }}></i>Category Breakdown</div>
        {catTotals.length === 0
          ? <div className="empty"><i className="fas fa-inbox"></i>No expense data</div>
          : catTotals.map(([cat, total]) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.85rem' }}>
                <span style={{ color: CAT_COLORS[cat] }}><i className="fas fa-circle" style={{ fontSize: '0.6rem', marginRight: 6 }}></i>{cat}</span>
                <span>{fmt(-total)} &nbsp;<span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>({((total / totalExp) * 100).toFixed(1)}%)</span></span>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 6 }}>
                <div style={{ width: `${(total / totalExp) * 100}%`, background: CAT_COLORS[cat], height: '100%', borderRadius: 4, transition: 'width 0.4s' }}></div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── Root App ─────
function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('et_transactions');
      return saved ? JSON.parse(saved) : SAMPLE_DATA;
    } catch { return SAMPLE_DATA; }
  });

  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('et_transactions', JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(tx) {
    setTransactions(prev => [...prev, tx]);
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  const navItems = [
    { id: 'dashboard',    icon: 'fas fa-th-large',  label: 'Dashboard' },
    { id: 'transactions', icon: 'fas fa-exchange-alt', label: 'Transactions' },
    { id: 'analytics',   icon: 'fas fa-chart-bar',  label: 'Analytics' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <i className="fas fa-coins"></i>
          <span>ExpenseTrack</span>
        </div>
        {navItems.map(n => (
          <div key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
            <i className={n.icon}></i>
            <span>{n.label}</span>
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '0 20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            {transactions.length} transactions stored
          </div>
        </div>
      </aside>

      <main className="main">
        {page === 'dashboard'    && <Dashboard    transactions={transactions} />}
        {page === 'transactions' && <Transactions transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} />}
        {page === 'analytics'   && <Analytics    transactions={transactions} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

