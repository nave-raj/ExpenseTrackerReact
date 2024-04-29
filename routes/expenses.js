var express = require('express');
var router = express.Router();
const expenseRepository = require('../src/repository');

/* GET all movie listing */
router.get('/', async (req, res, next) => {
  const incomeExpenseData = await expenseRepository.findAll();
  res.render('view-all-expenses',{ data: incomeExpenseData});
});

/* GET Create Income Expense Page */
router.get('/create-expense', (req, res, next) => {
  res.render('add-income-or-expense',{title: 'Create a New Income / Expense', buttonText: 'Add Income/Expense', actionURL: ''});
});

module.exports = router;
