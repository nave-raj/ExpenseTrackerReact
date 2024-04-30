var express = require('express');
var router = express.Router();
const expenseRepository = require('../src/repository');
const calculateIncomeExpense = require('../src/calculateIncomeExpense');

/* GET all movie listing */
router.get('/', async (req, res, next) => {
  const incomeExpenseData = await expenseRepository.findAll();
  const calcObj = await calculateIncomeExpense.calculate();
  const totalIncome = calcObj['totalIncome'];
  const totalExpense = calcObj['totalExpense'];
  console.log('calccccc'+ calcObj);
  res.render('view-all-expenses',{ data: incomeExpenseData, income: totalIncome, expense: totalExpense});
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

/* GET Edit Income/Expense Page */
router.get('/:id/edit', async (req, res, next) => {
  const data = await expenseRepository.findById(req.params.id);
  res.render('add-edit-incomeexpense',{title: 'Edit Income or Expense', buttonText: 'Edit Income or Expense', exp: data, actionURL: 'edit'});
});

/* GET Income/Expense Confirm Delete Page */
router.get('/:id/delete', async (req, res, next) => {
  const data = await expenseRepository.findById(req.params.id);
  res.render('delete-income-expense', { exp: data });
});


/* POST Income / Expenses from Create Page */
router.post('/create-income-expense', (req, res, next) => {
  const { type, category, description, amount } = req.body;
  const incomeExpenseData = { type: type, category: category, description: description, amount: amount};
  console.log(incomeExpenseData);
  expenseRepository.createIncomeExpense(incomeExpenseData);
  res.redirect('/expenses');
});

/* POST Income / Expenses from Edit Page */
router.post('/:id/edit',(req, res, next) => {
    const {type, category, description, amount} = req.body;
    const editedData= { id: req.params.id, type: type, category: category, description: description, amount: parseFloat(amount)};
    console.log(editedData);
    expenseRepository.updateExistingIncomeExpense(editedData);
    res.redirect('/expenses');
});

/* POST Movie Delete */
router.post('/:id/delete', async (req, res, next) => {
  const result = await expenseRepository.deleteById(req.params.id);
  res.redirect('/expenses');
});

module.exports = router;
