var mysql = require('mysql');
var config = require('./config');

delete config.database;
var db = mysql.createConnection(config);

db.query('CREATE DATABASE `todo-example`');

db.end(function() {
    process.exit();
});