var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('index', { title: 'Expense Tracker Application' });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
