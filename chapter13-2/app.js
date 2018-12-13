var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Sequelize = require('sequelize');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

var sequelize = new Sequelize('todo-example', 'root');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

//首页
app.get('/', (req, res, next) => {
    res.render('index');
})

//删除项目
app.del('/project/:id', (req, res, next) => {

})

//创建项目
app.post('/projects', (req, res, next) => {});


//展示执行项目任务
app.get('/project/:id/tasks', (req, res, next) => {})

//创建指定项目任务
app.post('/project/:id/tasks'， (req, res, next) => {})

//删除任务
app.del('/tasks/:id', (req, res, next) => {})



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