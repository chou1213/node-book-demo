var redis = require('redis');
var client = redis.createClient();

function find(id) {
    client.hgetall(`user:${id}:data`, function(err, obj) {
        console.dir(obj);
    });
}
module.exports = find