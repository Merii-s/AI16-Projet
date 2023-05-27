var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var candidatureRouter = require('./routes/candidature');
var demandeRouter = require('./routes/demandes');
var ficheposteRouter = require('./routes/ficheposte');
var offreRouter = require('./routes/offres');
var orgaRouter = require('./routes/organisations');
var pieceRouter = require('./routes/pieces');
var inscriptionRouter = require('./routes/inscription');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/candidatures', candidatureRouter);
app.use('/demandes', demandeRouter);
app.use('/fichesposte', ficheposteRouter);
app.use('/offres', offreRouter);
app.use('/organisations', orgaRouter);
app.use('/pieces', pieceRouter);
app.use('/inscription', inscriptionRouter);

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
