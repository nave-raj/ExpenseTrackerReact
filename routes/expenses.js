var express = require('express');
var router = express.Router();
const expenseRepository = require('../src/repository');

/* GET all movie listing */
router.get('/', async (req, res, next) => {
  const incomeExpenseData = await expenseRepository.findAll();
  res.render('view-all-expenses',{ data: incomeExpenseData});
});

module.exports = router;
