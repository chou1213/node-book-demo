var mysql = require('mysql');
var config = require('./config');

delete config.database;
var db = mysql.createConnection(config);

console.log('CREATE DATABASE `cart-example`');

db.query('CREATE DATABASE `cart-example`');

db.query('use `cart-example`');

db.query('drop table if exists item');

db.query('create table item (' +
    'id int(11) auto_increment,' +
    'title varchar(255),' +
    'description text,' +
    'created datetime,' +
    'primary key(id))');

db.query('drop table if exists review');

db.query('create table review (' +
    'id int(11) auto_increment,' +
    'item_id int(11),' +
    'text text,' +
    'stars int(1),' +
    'created datetime,' +
    'primary key(id))');

db.end(function() {
    process.exit();
});