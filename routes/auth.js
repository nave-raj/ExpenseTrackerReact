var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

async function localAuthUser(email, password, done){
  try{
    const userData = await User.findOne({ email: email });
    if(!userData){
      return done(null, false);
    }
    const isMatch = await userData.matchPassword(password);
    if(!isMatch){
      return done(null,false);
    }
    return done(null, userData);
  } catch(error){
    return done(error,false);
  }
};

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, localAuthUser));

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/', function(req, res, next) {
    res.render('login');
});


/* GET register page. */
router.get('/signup', function(req, res, next) {
    res.render('signup');
});


/* POST local login */
router.post('/login/password', passport.authenticate('local',{
  successRedirect: '/home',
  failureRedirect: '/login',
}));

/* POST Register page */
router.post('/register', async function(req, res, next) {
  try {
    if (req.body.password !== req.body.confirmpassword) {
      return res.render('signup', { error: "Passwords do not match!" });
    }    
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    let result = await newUser.save();
    req.login(result, function(error) {
      if (error) {
        return next(error);
      }
      return res.redirect('/login');
    });
  } catch (error) {
    return res.render('signup', { error: "Please enter valid Email" });
  }
});

/* POST logout Page */
router.post('/logout', function(req, res, next){
  req.logout(function( error ){
    if(error){
        return next(error);
    }
    res.redirect('/login');
  })
});

module.exports = router;