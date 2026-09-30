import ExpenseItem from './ExpenseItem'

function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <ul className="expense-list" aria-label="Recorded expenses">
      {expenses.map((expense, index) => (
        <ExpenseItem
          key={expense?._id || `expense-${index}`}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default ExpenseList