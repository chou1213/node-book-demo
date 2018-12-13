var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var config = require('./config');
var db = mysql.createConnection(config);
var bodyParser = require('body-parser');

db.connect();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

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
    db.query('select id ,title,description from item', (err, results) => {
        if (err) return next(err);
        console.log(results);
        res.render('index', {
            items: results
        });
    });
});

//创建商品
app.post('/create', (req, res, next) => {
    db.query('insert into item set title = ?,description = ?', [req.body.title, req.body.description], (err, info) => {
        if (err) return next(err);
        console.log(info);
        console.log('- item created with id %s', info.insertId);
        res.redirect('/');
    });
});


//查看商品
app.get('/item/:id', (req, res, next) => {
    function getItem(fn) {
        db.query('select id, title, description from item where id = ? limit 1', [req.params.id], (err, results) => {
            if (err) return next(err);
            if (!results[0]) return res.send(404);
            fn(results[0]);
        });
    }

    function getReviews(item_id, fn) {
        db.query('select text, stars from review where item_id = ?', [item_id], (err, results) => {
            if (err) return next(err);
            fn(results);
        });
    }

    getItem(function(item) {
        getReviews(item.id, function(reviews) {
            res.render('item', { item: item, reviews: reviews });
        });
    })
});

//创建评论
app.post('/item/:id/review', (req, res, next) => {
    db.query('insert into review set item_id = ? , stars = ?, text = ?', [req.params.id, req.body.stars, req.body.text], (err, info) => {
        if (err) return next(err);
        console.log('- review created with id $s', info.insertId);
        res.redirect('/item/' + req.params.id);
    });
});



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