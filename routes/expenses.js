var express = require('express');
var router = express.Router();
const expenseRepository = require('../src/repository');

/* GET all movie listing */
router.get('/', async (req, res, next) => {
  const incomeExpenseData = await expenseRepository.findAll();
  res.render('view-all-expenses',{ data: incomeExpenseData});
});

/* GET Create Income Expense Page */
router.get('/create-income-expense', (req, res, next) => {
  res.render('add-edit-incomeexpense',{title: 'Create a New Income or Expense', buttonText: 'Add Income or Expense', actionURL: 'create-income-expense'});
});

/* GET individual income or expense by id */
router.get('/:id', async (req, res, next) => {
  const incomeExpenseById = await expenseRepository.findById(req.params.id);
  console.log(incomeExpenseById);
  if(incomeExpenseById){
  res.render('view-incomeexpense', { incomeExpense: incomeExpenseById});
  } else {
    res.redirect('/expenses');
  }
});

/* POST Income / Expenses from Create Page */
router.post('/create-income-expense', (req, res, next) => {
  const { type, category, description, amount } = req.body;
  const incomeExpenseData = { type: type, category: category, description: description, amount: amount};
  console.log(incomeExpenseData);
  expenseRepository.createIncomeExpense(incomeExpenseData);
  res.redirect('/expenses');
});

module.exports = router;
