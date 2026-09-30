const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function TotalSpending({ expenses, loadState }) {
  if (loadState !== 'success') {
    return (
      <section className="total-spending" aria-labelledby="total-spending-title">
        <h2 id="total-spending-title">Total spending</h2>
        <p className="total-amount" aria-live="polite">
          {loadState === 'loading' ? 'Loading…' : 'Unavailable'}
        </p>
      </section>
    )
  }

  const total = expenses.reduce((sum, expense) => {
    const amount = expense?.amount
    return typeof amount === 'number' && Number.isFinite(amount) && amount > 0
      ? sum + amount
      : sum
  }, 0)

  return (
    <section className="total-spending" aria-labelledby="total-spending-title">
      <h2 id="total-spending-title">Total spending</h2>
      <p className="total-amount" aria-live="polite">
        {Number.isFinite(total) ? currencyFormatter.format(total) : 'Total unavailable'}
      </p>
    </section>
  )
}

export default TotalSpending