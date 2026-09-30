const Expense = require("../models/Expense");

function isValidAmount(amount) {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0;
}

function invalidAmountResponse(res) {
  return res.status(400).json({
    message: "Expense data is invalid",
    errors: { amount: "Amount must be a finite number greater than 0" },
  });
}

async function createExpense(req, res) {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ message: "Request body must be a JSON object" });
  }

  if (!isValidAmount(body.amount)) {
    return invalidAmountResponse(res);
  }

  try {
    const expense = await Expense.create({
      amount: body.amount,
      category: body.category,
      description: body.description,
      date: body.date,
    });

    return res.status(201).json(expense);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      const errors = Object.fromEntries(
        Object.entries(error.errors || {}).map(([field, fieldError]) => [
          field,
          fieldError.message,
        ]),
      );

      return res.status(400).json({
        message: "Expense data is invalid",
        errors,
      });
    }

    console.error("Failed to create expense:", error.message);
    return res.status(500).json({ message: "Failed to create expense" });
  }
}

async function listExpenses(req, res) {
  try {
    const expenses = await Expense.find().lean();
    return res.status(200).json(expenses);
  } catch (error) {
    console.error("Failed to retrieve expenses:", error.message);
    return res.status(500).json({ message: "Failed to retrieve expenses" });
  }
}

async function updateExpense(req, res) {
  const { id } = req.params;
  const body = req.body;

  if (!Expense.base.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Expense ID is invalid" });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ message: "Request body must be a JSON object" });
  }

  if (!isValidAmount(body.amount)) {
    return invalidAmountResponse(res);
  }

  const updates = {
    amount: body.amount,
    category: body.category,
    description: body.description,
    date: body.date,
  };

  try {
    await new Expense(updates).validate();

    const expense = await Expense.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json(expense);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      const errors = Object.fromEntries(
        Object.entries(error.errors || {}).map(([field, fieldError]) => [
          field,
          fieldError.message,
        ]),
      );

      return res.status(400).json({
        message: "Expense data is invalid",
        errors,
      });
    }

    console.error("Failed to update expense:", error.message);
    return res.status(500).json({ message: "Failed to update expense" });
  }
}

async function deleteExpense(req, res) {
  const { id } = req.params;

  if (!Expense.base.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Expense ID is invalid" });
  }

  try {
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Failed to delete expense:", error.message);
    return res.status(500).json({ message: "Failed to delete expense" });
  }
}

module.exports = { createExpense, listExpenses, updateExpense, deleteExpense };