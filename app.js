require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var User = require('./models/User')
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@expensetrackercluster.dcfwbin.mongodb.net/user?retryWrites=true&w=majority&appName=expensetrackercluster`)
.then(() => {
  console.log('User Database connection successfull');
})
.catch((err) => {
  console.log('Database Connection error', err);
});

var indexRouter = require('./routes/index');
var expensesRouter = require('./routes/expenses');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'my session',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

/* for route protection */
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/expenses', isAuthenticated, expensesRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
