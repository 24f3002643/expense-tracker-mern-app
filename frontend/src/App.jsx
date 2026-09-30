import { useEffect, useState } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import TotalSpending from './components/TotalSpending'
import { deleteExpense, getExpenses } from './services/expenseApi'
import './App.css'

function Home() {
  const [expenses, setExpenses] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [editingExpense, setEditingExpense] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    getExpenses({ signal: controller.signal })
      .then((loadedExpenses) => {
        setExpenses(loadedExpenses)
        setLoadState('success')
        setError('')
      })
      .catch((loadError) => {
        if (loadError.name === 'AbortError') return

        setLoadState('error')
        setError(loadError.message)
      })

    return () => controller.abort()
  }, [loadAttempt])

  function retryLoading() {
    setError('')
    setLoadState('loading')
    setLoadAttempt((attempt) => attempt + 1)
  }

  async function handleDelete(expense) {
    await deleteExpense(expense._id)
    setExpenses((currentExpenses) => currentExpenses.filter((currentExpense) => (
      currentExpense._id !== expense._id
    )))
    setEditingExpense((currentExpense) => (
      currentExpense?._id === expense._id ? null : currentExpense
    ))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="wordmark" href="/" aria-label="Expense Tracker home">
          <span className="wordmark-mark" aria-hidden="true">E</span>
          <span>Expense Tracker</span>
        </a>
        <span className={`connection-status connection-status-${loadState}`}>
          <span className="status-dot" aria-hidden="true" />
          {loadState === 'loading' && 'Connecting'}
          {loadState === 'success' && 'Connected'}
          {loadState === 'error' && 'Unavailable'}
        </span>
      </header>

      <main className="main-content">
        <section className="page-heading" aria-labelledby="page-title">
          <p className="eyebrow">PERSONAL FINANCES</p>
          <h1 id="page-title">Expense Tracker</h1>
          <p className="page-description">Your recorded expenses, in one place.</p>
        </section>

        <TotalSpending expenses={expenses} loadState={loadState} />

        <ExpenseForm
          key={editingExpense?._id || 'new-expense'}
          expenseToEdit={editingExpense}
          onExpenseCreated={(createdExpense) => {
            setExpenses((currentExpenses) => [createdExpense, ...currentExpenses])
          }}
          onExpenseUpdated={(updatedExpense) => {
            setExpenses((currentExpenses) => currentExpenses.map((expense) => (
              expense._id === updatedExpense._id ? updatedExpense : expense
            )))
            setEditingExpense(null)
          }}
          onCancelEdit={() => setEditingExpense(null)}
          disabled={loadState !== 'success'}
        />

        <section className="expense-panel" aria-labelledby="expenses-heading">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">RECORDS</p>
              <h2 id="expenses-heading">All expenses</h2>
            </div>
            {loadState === 'success' && (
              <span className="record-count">
                {expenses.length} {expenses.length === 1 ? 'record' : 'records'}
              </span>
            )}
          </div>

          <div
            className={`panel-content${loadState === 'success' && expenses.length > 0 ? ' panel-content-list' : ''}`}
            aria-live="polite"
            aria-busy={loadState === 'loading'}
          >
            {loadState === 'loading' && (
              <p className="status-message">Loading expenses…</p>
            )}
            {loadState === 'error' && (
              <div className="error-message" role="alert">
                <p>{error}</p>
                <button className="retry-button" onClick={retryLoading} type="button">
                  Retry connection
                </button>
              </div>
            )}
            {loadState === 'success' && expenses.length === 0 && (
              <p className="status-message">No expenses recorded yet.</p>
            )}
            {loadState === 'success' && expenses.length > 0 && (
              <ExpenseList
                expenses={expenses}
                onEdit={setEditingExpense}
                onDelete={handleDelete}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function App() {
  return <Home />
}

export default App