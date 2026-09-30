import { useState } from 'react'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Other']

function getDisplayDate(value) {
  if (typeof value !== 'string' && !(value instanceof Date)) {
    return { label: 'Date unavailable', dateTime: undefined }
  }

  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) {
    return { label: 'Date unavailable', dateTime: undefined }
  }

  return { label: dateFormatter.format(date), dateTime: date.toISOString() }
}

function ExpenseItem({ expense, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const amount = typeof expense?.amount === 'number' && Number.isFinite(expense.amount) && expense.amount > 0
    ? currencyFormatter.format(expense.amount)
    : 'Amount unavailable'
  const category = categories.includes(expense?.category)
    ? expense.category
    : 'Category unavailable'
  const description = typeof expense?.description === 'string' && expense.description.trim()
    ? expense.description.trim()
    : 'Description unavailable'
  const date = getDisplayDate(expense?.date)

  async function handleDelete() {
    if (isDeleting) return

    setIsDeleting(true)
    setDeleteError('')
    try {
      await onDelete(expense)
    } catch (error) {
      setDeleteError(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <li className="expense-row">
      <div className="expense-primary">
        <strong className="expense-amount">{amount}</strong>
        <span className="category-label">{category}</span>
      </div>
      <p className="expense-description">{description}</p>
      <time className="expense-date" dateTime={date.dateTime}>
        {date.label}
      </time>
      <div className="expense-actions" aria-label="Expense actions">
        <button
          type="button"
          onClick={() => onEdit(expense)}
          disabled={isDeleting}
          aria-label={`Edit ${description}`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`${isDeleting ? 'Deleting' : 'Delete'} ${description}`}
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
      {deleteError && <p className="delete-error" role="alert">{deleteError}</p>}
    </li>
  )
}

export default ExpenseItem