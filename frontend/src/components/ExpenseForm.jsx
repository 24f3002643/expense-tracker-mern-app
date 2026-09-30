import { useState } from 'react'
import { createExpense, updateExpense } from '../services/expenseApi'

const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Other']
const initialValues = {
  amount: '',
  category: '',
  description: '',
  date: '',
}

function validateExpense(values) {
  const errors = {}
  const amount = Number(values.amount)

  if (!values.amount.trim()) {
    errors.amount = 'Enter an amount.'
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Amount must be a number greater than zero.'
  }

  if (!categories.includes(values.category)) {
    errors.category = 'Choose a category.'
  }

  if (!values.description.trim()) {
    errors.description = 'Enter a description.'
  }

  if (!values.date) {
    errors.date = 'Choose a date.'
  } else {
    const date = new Date(`${values.date}T00:00:00Z`)
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== values.date) {
      errors.date = 'Enter a valid date.'
    }
  }

  return errors
}

function getInitialValues(expense) {
  if (!expense) return initialValues

  return {
    amount: String(expense.amount ?? ''),
    category: expense.category ?? '',
    description: expense.description ?? '',
    date: typeof expense.date === 'string'
      ? expense.date.slice(0, 10)
      : '',
  }
}

function ExpenseForm({
  expenseToEdit = null,
  onExpenseCreated,
  onExpenseUpdated,
  onCancelEdit,
  disabled = false,
}) {
  const [values, setValues] = useState(() => getInitialValues(expenseToEdit))
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setApiError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateExpense(values)
    setErrors(validationErrors)
    setApiError('')

    if (Object.keys(validationErrors).length > 0 || isSubmitting || disabled) return

    setIsSubmitting(true)
    try {
      const expenseData = {
        amount: Number(values.amount),
        category: values.category,
        description: values.description.trim(),
        date: values.date,
      }

      if (expenseToEdit) {
        const updatedExpense = await updateExpense(expenseToEdit._id, expenseData)
        onExpenseUpdated(updatedExpense)
      } else {
        const createdExpense = await createExpense(expenseData)
        onExpenseCreated(createdExpense)
        setValues(initialValues)
      }

      setErrors({})
    } catch (error) {
      setApiError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEditing = Boolean(expenseToEdit)

  return (
    <section className="form-panel" aria-labelledby="add-expense-title">
      <div className="form-heading">
        <p className="eyebrow">{isEditing ? 'UPDATE RECORD' : 'NEW RECORD'}</p>
        <h2 id="add-expense-title">{isEditing ? 'Edit expense' : 'Add expense'}</h2>
      </div>

      <form className="expense-form" onSubmit={handleSubmit} noValidate>
        <div className="form-fields">
          <label className="form-field" htmlFor="expense-amount">
            <span>Amount</span>
            <div className="amount-input-wrap">
              <span aria-hidden="true">₹</span>
              <input
                id="expense-amount"
                name="amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                value={values.amount}
                onChange={updateField}
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={errors.amount ? 'expense-amount-error' : undefined}
                disabled={disabled || isSubmitting}
              />
            </div>
            {errors.amount && <small id="expense-amount-error">{errors.amount}</small>}
          </label>

          <label className="form-field" htmlFor="expense-category">
            <span>Category</span>
            <select
              id="expense-category"
              name="category"
              value={values.category}
              onChange={updateField}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'expense-category-error' : undefined}
              disabled={disabled || isSubmitting}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <small id="expense-category-error">{errors.category}</small>}
          </label>

          <label className="form-field form-field-description" htmlFor="expense-description">
            <span>Description</span>
            <input
              id="expense-description"
              name="description"
              type="text"
              maxLength={160}
              placeholder="What was this expense for?"
              value={values.description}
              onChange={updateField}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'expense-description-error' : undefined}
              disabled={disabled || isSubmitting}
            />
            {errors.description && <small id="expense-description-error">{errors.description}</small>}
          </label>

          <label className="form-field" htmlFor="expense-date">
            <span>Date</span>
            <input
              id="expense-date"
              name="date"
              type="date"
              value={values.date}
              onChange={updateField}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? 'expense-date-error' : undefined}
              disabled={disabled || isSubmitting}
            />
            {errors.date && <small id="expense-date-error">{errors.date}</small>}
          </label>
        </div>

        {apiError && <p className="form-api-error" role="alert">{apiError}</p>}

        <div className="form-footer">
          <p className="form-feedback" aria-live="polite">
            {isSubmitting ? 'Saving expense…' : ''}
          </p>
          <div className="form-actions">
            {isEditing && (
              <button
                className="secondary-button"
                type="button"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button className="primary-button" type="submit" disabled={disabled || isSubmitting}>
              {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add expense'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default ExpenseForm