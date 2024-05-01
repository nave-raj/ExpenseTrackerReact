var express = require('express');
var router = express.Router();
const expenseRepository = require('../src/repository');
const calculateIncomeExpense = require('../src/calculateIncomeExpense');
const { body, validationResult } = require('express-validator');

/* GET all Income Expense listing */
router.get('/', async (req, res, next) => {
  if (req.isAuthenticated()) {
    const incomeExpenseData = await expenseRepository.findAll();
    const userName = req.user.name;
    const calcObj = await calculateIncomeExpense.calculate();
    const totalIncome = calcObj['totalIncome'];
    const totalExpense = calcObj['totalExpense'];
    res.render('view-all-expenses',{ data: incomeExpenseData, income: totalIncome, expense: totalExpense, user: userName});
  } else {
    res.redirect('/login');
  }
});

/* GET Create Income Expense Page */
router.get('/create-income-expense', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('add-edit-incomeexpense',{title: 'Create a New Income or Expense', buttonText: 'Add Income or Expense', actionURL: 'create-income-expense'});
  } else {
    res.redirect('/login');
  }
});

/* GET individual income or expense by id */
router.get('/:id', async (req, res, next) => {
  if (req.isAuthenticated()) {
    const incomeExpenseById = await expenseRepository.findById(req.params.id);
    console.log(incomeExpenseById);
    if(incomeExpenseById){
      res.render('view-incomeexpense', { incomeExpense: incomeExpenseById});
    } else {
      res.redirect('/expenses');
    }
  } else {
    res.redirect('/login');
  }
});

/* GET Edit Income/Expense Page */
router.get('/:id/edit', async (req, res, next) => {
  if (req.isAuthenticated()) {
    const data = await expenseRepository.findById(req.params.id);
    res.render('add-edit-incomeexpense',{title: 'Edit Income or Expense', buttonText: 'Edit Income or Expense', exp: data, actionURL: 'edit'});
  } else {
    res.redirect('/login');
  }
});

/* GET Income/Expense Confirm Delete Page */
router.get('/:id/delete', async (req, res, next) => {
  if (req.isAuthenticated()) {
    const data = await expenseRepository.findById(req.params.id);
    res.render('delete-income-expense', { exp: data });
  } else {
    res.redirect('/login');
  }
});


/* POST Income / Expenses from Create Page */
router.post('/create-income-expense', body('type').trim().escape().notEmpty().withMessage('Type Cannot Be Empty!'), 
            body('category').trim().escape().notEmpty().withMessage('Category Cannot be Empty!'),
            body('amount').trim().escape().notEmpty().withMessage('Amount cannot be Empty!').isNumeric().withMessage('Enter a valid Amount'),
            async (req, res, next) => {
  const result = validationResult(req);
  if(!result.isEmpty()){
    res.render('add-edit-incomeexpense',{title: 'Create Income or Expense', buttonText: 'Create Income or Expense', actionURL: 'create-income-expense', msg: result.array()});
  } else {
    const { type, category, description, amount } = req.body;
    const incomeExpenseData = { type: type, category: category, description: description, amount: amount};
    console.log(incomeExpenseData);
    expenseRepository.createIncomeExpense(incomeExpenseData);
    res.redirect('/expenses');
  }
});

/* POST Income / Expenses from Edit Page */
router.post('/:id/edit', body('type').trim().escape().notEmpty().withMessage('Type Cannot Be Empty!'), 
           body('category').trim().escape().notEmpty().withMessage('Category Cannot be Empty!'),
           body('amount').trim().escape().notEmpty().withMessage('Amount cannot be Empty!').isNumeric().withMessage('Enter a valid Amount'),
           async (req, res, next) => {
    const result = validationResult(req);
    if(!result.isEmpty()){
      res.render('add-edit-incomeexpense',{title: 'Edit Income or Expense', buttonText: 'Edit Income or Expense', actionURL: 'edit', msg: result.array()});
    } else {
      const {type, category, amount, description} = req.body;
      const editedData= { id: req.params.id, type: type, category: category, description: description, amount: parseFloat(amount)};
      console.log(editedData);
      expenseRepository.updateExistingIncomeExpense(editedData);
      res.redirect('/expenses');
    }
});

/* POST Income Expense Delete */
router.post('/:id/delete', async (req, res, next) => {
  const result = await expenseRepository.deleteById(req.params.id);
  res.redirect('/expenses');
});

module.exports = router;
