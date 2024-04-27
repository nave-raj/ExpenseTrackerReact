var express = require('express');
var router = express.Router();

/* GET all movie listing */
router.get('/', async (req, res, next) => {
  res.render('view-all-expenses',{});
});

module.exports = router;
