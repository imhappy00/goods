var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  let path = req.path; // 获取地址
  let whiteList = [
    '/apis/goods',
    '/apis/users/login',
    '/apis/users/logOut'
  ];

  if (req.cookies.loginUser) {
    next();
  } else {
    let flag = false;
    whiteList.forEach((item) => {
      if (item === path) {
        flag = true;
      }
    });

    if (flag) {
      next();
    } else {
      res.json({
        status: 2,
        msg: '用户未登录',
        result: ''
      });
    }
  }
});

app.use('/apis/goods', goods);
app.use('/apis/users', users);
app.use('/index', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
