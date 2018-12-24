var express = require('express');
var router = express.Router();
var { Meterial } = require('../model');

//获取材料
router.get('/list', function(req, res, next) {
    Meterial.findAll().then(meterial => {
        res.json({ 'result': meterial, code: 200 });
    }).catch(err => {
        next();
    });
});

//添加材料
router.post('/add', (req, res, next) => {
    Meterial.build(req.body).save().then((obj) => {
        res.json({ 'result': obj, code: 200 });
    }).catch(err => {
        next();
    })
})

//删除材料
router.delete('/:id', (req, res, next) => {
    Meterial.find({ id: Number(req.params.id) }).then(meterial => {
        console.log(meterial);
        meterial.destroy().then(() => {
            res.json({ 'result': meterial.dataValues, code: 200, msg: 'success' });
        }).catch(err => {
            next();
        })
    }).catch(err => {
        next();
    })
});

module.exports = router;