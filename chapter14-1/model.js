var redis = require('redis');
var find = require('./find');
var client = redis.createClient();

// find('bill@microsoft.com');

//模型
function User(id, data) {
    this.id = id;
    this.data = data;
}

User.find = function(id, fn) {
    client.hgetall(`user:${id}:data`, function(err, obj) {
        if (err) return fn(err);
        fn(null, new User(id, obj))
    });
}

User.prototype.follow = function(user_id, fn) {
    client.multi().sadd(`user:${user_id}:follows${this.id}`)
        .sadd(`user:${this.id}:follws${user_id}`)
        .exec(fn);
}

User.prototype.unfollow = function(user_id, fn) {
    client.multi()
        .srem(`user:${user_id}:followers${this.id}`)
        .scre(`user:${this.id}:follows${user_id}`)
        .exec(fn);
}

User.prototype.getFollowers = function(fn) {
    client.smembers(`user:${this.id}:followers${fn}`);
}

User.prototype.getFollows = function(fn) {
    client.smembers(`user${this.id}:follows${fn}`);
}

User.prototype.getFriends = function(fn) {
    client.sinter(`user:${this.id}:follows`, `user:${this.id}:follower`);
}

User.prototype.save = function(fn) {
    if (!this.id) {
        this.id = String(Math.random()).substr(3);
    }
    client.hmset(`user:${this.id}:data`, this.data, fn);
}

client.on('error', err => {
    console.log(err);
});

module.exports = User;