// imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// midlewares
var loginRouter = require('./routes/login');
var startRouter = require('./routes/start');
var registerRouter = require('./routes/register');
var guestRouter = require('./routes/guest')
var forgotRouter = require('./routes/forgot')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// redirect to middleware
app.use('/', startRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/guest', guestRouter);
app.use('/forgot', forgotRouter);

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

io.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

http.listen(3000, function(){
  console.log('listening on *:' + 3000);
});

module.exports = http;