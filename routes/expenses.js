var express = require('express');
var router = express.Router();
const expenseRepository = require('../src/repository');

/* GET all movie listing */
router.get('/', async (req, res, next) => {
  const incomeExpenseData = await expenseRepository.findAll();
  console.log(incomeExpenseData);
  res.render('view-all-expenses',{ data: incomeExpenseData});
});

/* GET Create Income Expense Page */
router.get('/create-expense', (req, res, next) => {
  res.render('add-edit-incomeexpense',{title: 'Create a New Income / Expense', buttonText: 'Add Income/Expense', actionURL: '/create'});
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

module.exports = router;
