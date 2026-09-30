const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  .replace(/\/$/, '')

export async function getExpenses({ signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/expenses`, { signal })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Could not load expenses.')
  }

  if (!Array.isArray(payload)) {
    throw new Error('The server returned an invalid expenses response.')
  }

  return payload
}

export async function createExpense(expense) {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Could not save the expense.')
  }

  return payload
}

export async function updateExpense(id, expense) {
  const response = await fetch(`${API_BASE_URL}/expenses/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Could not update the expense.')
  }

  return payload
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_BASE_URL}/expenses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Could not delete the expense.')
  }

  return payload
}