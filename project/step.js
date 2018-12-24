var mysql = require('mysql');
var config = require('./config/db');

delete config.database;

console.log(config);

//链接数据库
var db = mysql.createConnection(config);

//创建数据库
db.query('CREATE DATABASE csj');

db.query('use `csj`');

db.query('drop table if exists meterial');

db.query('create table meterial (' +
    'id int(11) auto_increment,' +
    'name varchar(255),' +
    'price int(11),' +
    'unit varchar(11),' +
    'quantity int(11),' +
    'created datetime,' +
    'updated datetime,' +
    'supplier_id int(11),' +
    'primary key(id))'
);

db.query('drop table if exists product');

db.query('create table product (' +
    'id int(11) auto_increment,' +
    'name varchar(255),' +
    'price int(11),' +
    'unit varchar(11),' +
    'created datetime,' +
    'primary key(id))'
);

db.query('drop table if exists supplier');

db.query('create table supplier (' +
    'id int(11) auto_increment,' +
    'name varchar(255),' +
    'tel varchar(11),' +
    'address text,' +
    'wx_id varchar(25),' +
    'primary key(id))'
);

db.end(function() {
    process.exit();
});