var Sequelize = require('sequelize');
var config = require('../config/db');

var sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql'
});

var Meterial = sequelize.define('Meterial', {
    name: Sequelize.STRING,
    price: Sequelize.INTEGER,
    unit: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
});

var Product = sequelize.define('Product', {
    name: Sequelize.STRING,
    price: Sequelize.INTEGER,
    unit: Sequelize.STRING,
    created: Sequelize.DATE
});

var Supplier = sequelize.define('Supplier', {
    name: Sequelize.STRING,
    tel: Sequelize.STRING,
    address: Sequelize.TEXT,
    tel: Sequelize.STRING,
    wx_id: Sequelize.STRING
});

sequelize.sync();

Meterial.belongsTo(Supplier);
Supplier.hasMany(Meterial);

module.exports = {
    Product,
    Meterial,
    Supplier
}