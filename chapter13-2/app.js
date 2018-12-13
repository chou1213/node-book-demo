var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

var sequelize = new Sequelize('todo-example', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
});

var Project = sequelize.define('Project', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    created: Sequelize.DATE
});

var Task = sequelize.define('Task', {
    title: Sequelize.STRING
});


sequelize.sync();


Task.belongsTo(Project);
Project.hasMany(Task);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

//首页
app.get('/', (req, res, next) => {
    Project.findAll()
        .then((projects) => {
            res.render('index', { projects });
        }).catch(err => {
            next();
        });
})

//删除项目
app.del('/project/:id', (req, res, next) => {
    Project.find({ id: Number(req.params.id) }).then(proj => {
        proj.destroy().then(() => {
            res.send(200);
        }).catch(err => {
            next();
        })
    }).catch(err => {
        next();
    })
})

//创建项目
app.post('/projects', (req, res, next) => {
    Project.build(req.body).save().then((obj) => {
        res.send(obj);
    }).catch(err => {
        next();
    })
});


//展示执行项目任务
app.get('/project/:id/tasks', (req, res, next) => {
    console.log(req.params.id)
    Project.findOne({ where: { id: Number(req.params.id) } }).then(project => {
        console.log(project);
        project.getTasks().then(tasks => {
            console.log(tasks);
            res.render('tasks', { project: project, tasks: tasks });
        })
    }).catch(err => {
        next();
    })
})

//创建指定项目任务
app.post('/project/:id/tasks', (req, res, next) => {
    req.body.ProjectId = req.params.id;
    console.log(req.body)
    Task.build(req.body).save()
        .then(obj => {
            res.send(obj);
        }).then(next);
})

//删除任务
app.del('/task/:id', (req, res, next) => {
    Task.findOne({ where: { id: Number(req.params.id) } }).then(task => {
        task.destroy().then(() => {
            res.send(200);
        })
    }).catch(err => {
        next();
    })
})



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