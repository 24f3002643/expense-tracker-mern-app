# Expense Tracker — Project Specification

## 1. Project Overview

Build a simple and small expense tracker web application using the MERN stack.

The application should contain **only** the features and functionality specified in this document. Do not add extra features.

The application is intended to be a beginner-friendly full-stack project.

---

## 2. Key Features

### 2.1 Add Expense

The user should be able to add an expense with:

- Amount
- Category
- Description
- Date

### 2.2 View Expenses

The user should be able to view all recorded expenses.

Each expense should display:

- Amount
- Category
- Description
- Date

### 2.3 Edit Expense

The user should be able to modify an existing expense.

### 2.4 Delete Expense

The user should be able to remove an existing expense.

### 2.5 Expense Categories

Each expense should belong to one category.

Use the following fixed categories:

- Food
- Transport
- Bills
- Shopping
- Other

No separate category management functionality is required.

### 2.6 Total Spending

Display the total amount spent across all recorded expenses.

The total should be calculated from the stored expenses and does not need to be stored separately in the database.

---

# 3. Problem Breakdown

The application has one main resource: **Expense**.

## Feature 1 — Add Expense

The frontend collects:

- Amount
- Category
- Description
- Date

The frontend sends the data to the backend.

The backend validates the data and stores the expense in MongoDB.

## Feature 2 — View Expenses

Retrieve all recorded expenses from the backend and display them in the frontend.

## Feature 3 — Edit Expense

The user selects an existing expense, modifies its details, and submits the updated data.

The backend updates the corresponding MongoDB document.

## Feature 4 — Delete Expense

The user selects an existing expense for deletion.

The backend removes the corresponding MongoDB document.

## Feature 5 — Expense Categories

Each expense must have one category from the predefined list:

- Food
- Transport
- Bills
- Shopping
- Other

## Feature 6 — Total Spending

Calculate and display the sum of all expense amounts.

Do not store the total separately in MongoDB because it is derived data.

---

# 4. Full-Stack Architecture

Use a simple MERN architecture:

```text
                    Expense Tracker
                          |
              +-----------+-----------+
              |                       |
          Frontend                 Backend
           React                  Node.js
                                  Express
              |                       |
              +---------- API --------+
                          |
                       MongoDB
```

---

## 4.1 Frontend

Use React.

Suggested structure:

```text
frontend/
└── src/
    ├── components/
    │   ├── ExpenseForm
    │   ├── ExpenseList
    │   ├── ExpenseItem
    │   └── TotalSpending
    │
    ├── pages/
    │   └── Home
    │
    ├── services/
    │   └── expenseApi
    │
    ├── App.jsx
    └── main.jsx
```

React Router is not required because the application only needs one main screen.

The home page can contain:

```text
Home
├── Total Spending
├── Add Expense Form
└── Expense List
    └── Expense Item
        ├── Edit
        └── Delete
```

---

## 4.2 Backend

Use Node.js and Express.

Suggested structure:

```text
backend/
├── models/
│   └── Expense.js
├── routes/
│   └── expenseRoutes.js
├── controllers/
│   └── expenseController.js
├── server.js
└── .env
```

Keep the REST API minimal.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/expenses` | Add expense |
| `GET` | `/api/expenses` | Get all expenses |
| `PUT` | `/api/expenses/:id` | Edit expense |
| `DELETE` | `/api/expenses/:id` | Delete expense |

No other API endpoints are required.

---

## 4.3 Database

Use MongoDB.

Only one collection is required:

```text
expenses
```

Do not create separate collections for:

- Users
- Categories
- Budgets
- Statistics
- Total spending

---

# 4.4 Frontend Design

Keep the frontend design minimal, clean, and functional.

The application should have a simple single-page layout containing:

```text
Expense Tracker
│
├── Total Spending
│
├── Add Expense Form
│   ├── Amount
│   ├── Category
│   ├── Description
│   ├── Date
│   └── Add Expense button
│
└── Expense List
    └── Each Expense
        ├── Amount
        ├── Category
        ├── Description
        ├── Date
        ├── Edit button
        └── Delete button
```

Design requirements:

- Keep the UI simple and uncluttered.
- Use a clear and readable layout.
- Make the expense form easy to use.
- Display the total spending prominently.
- Display expenses in a simple list or table.
- Provide clear Edit and Delete actions for each expense.
- Provide basic visual feedback for validation errors and API errors.
- Handle the empty-expense-list state clearly.
- Make the layout reasonably responsive for desktop and mobile screens.
- Do not add dashboards, charts, animations, advanced styling, or other unnecessary UI features.

The visual design should prioritize functionality and simplicity over aesthetics.

# 5. MongoDB Schema / Data Structure

An expense document should have the following structure:

```json
{
  "_id": "ObjectId",
  "amount": 250,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-09-30",
  "createdAt": "2026-09-30T10:30:00Z"
}
```

## Expense Schema

```text
Expense
├── _id
├── amount
├── category
├── description
├── date
└── createdAt
```

### Field Constraints

| Field | Type | Required | Constraint |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB generated |
| `amount` | Number | Yes | Must be greater than 0 |
| `category` | String | Yes | Must be one of the allowed categories |
| `description` | String | Yes | Cannot be empty |
| `date` | Date | Yes | Must be a valid date |
| `createdAt` | Date | Auto | Creation timestamp |

The allowed category values are:

```text
Food
Transport
Bills
Shopping
Other
```

---

# 6. Potential Edge Cases

## 6.1 Add Expense

Handle:

- Amount is empty
- Amount is `0`
- Amount is negative
- Amount contains invalid characters
- Amount is extremely large
- Category is not selected
- Category contains an invalid value
- Description is empty
- Description contains only whitespace
- Date is missing
- Invalid date is submitted

## 6.2 Edit Expense

Handle:

- Expense ID does not exist
- Invalid MongoDB ID is supplied
- Updated expense contains invalid data
- Expense was deleted before the update request completed

## 6.3 Delete Expense

Handle:

- Expense ID does not exist
- Invalid MongoDB ID is supplied
- Database/server error occurs during deletion

## 6.4 View Expenses

Handle:

- No expenses exist
- Database request fails
- Malformed or incomplete expense data exists
- Large number of expenses causes slow rendering

## 6.5 Total Spending

Handle:

- No expenses → total should be `₹0`
- Expenses contain decimal amounts
- Very large total amount
- Invalid/corrupt amount in the database

For this MVP, focus on important validation and API/database errors. Do not over-engineer theoretical edge cases.

---

# 7. MVP Boundary

The complete application should be limited to:

```text
Frontend
    │
    ├── Add Expense
    ├── Display Expenses
    ├── Edit Expense
    ├── Delete Expense
    └── Display Total Spending
    │
    ▼
Express REST API
    │
    ├── POST   /api/expenses
    ├── GET    /api/expenses
    ├── PUT    /api/expenses/:id
    └── DELETE /api/expenses/:id
    │
    ▼
MongoDB
    │
    └── expenses collection
```

## Explicit Scope Restriction

Do **not** add any functionality beyond the requirements in this document.

In particular, do not add:

- Authentication
- User accounts
- Multiple users
- Expense filtering
- Expense searching
- Budgets
- Income tracking
- Recurring expenses
- Notifications
- Charts or analytics beyond total spending
- File uploads
- External APIs
- AI features
- Payment integrations
- Separate category management
- Any other unrequested functionality

The goal is to build a small, complete MERN CRUD application.
