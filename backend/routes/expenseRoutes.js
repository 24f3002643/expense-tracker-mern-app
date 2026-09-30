const express = require("express");
const {
	createExpense,
	listExpenses,
	updateExpense,
	deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", createExpense);
router.get("/", listExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;