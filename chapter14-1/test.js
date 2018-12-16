var User = require('./model');
var find = require('./find');
find('bill@microsoft.com');
find('fred@fedex.com');

var testUsers = {
    'mark@faccebook.com': { name: 'Mark Zuckerberg' },
    'bill@microsoft.com': { name: 'Bill Gate' },
    'jeff@amazon.com': { name: 'Jeff Bezos' },
    'fred@fedex.com': { name: 'Fred Smith' }
};


function create(users, fn) {
    var total = Object.keys(users).length;
    for (let i in users) {
        (function(email, data) {
            let user = new User(email, data);
            user.save(function(err) {
                if (err) throw err;

                --total || fn()
            });
        })(i, users[i])
    }
}

function hydrate(users, fn) {
    let total = Object.keys(users).length;

    for (let i in users) {

        (function(email) {

            User.find(email, function(err, user) {
                if (err) throw err;
                users[email] = user;
                --total || fn();
            });
        })(i);
    }
}

create(testUsers, function() {
    // console.log('all users created');
    hydrate(testUsers, function() {
        testUsers['bill@microsoft.com.com'].follow('jeff@amazon.com', err => {
            if (err) throw err;
            console.log('+ bill follow jeff');

            testUsers['jeff@amazon.com'].getFollowers((err, users) => {
                if (err) throw err;
                console.log("jeff's followers", users);

                testUsers['jeff@amazon.com'].follow('bill@microsoft.com', err => {
                    if (err) throw err;
                    console.log('+ jeffed follow bill');

                    testUsers['jeff@amazon.com'].getFriends((err, users) => {
                        if (err) throw err;
                        console.log("jeff's friends", users);
                        process.exit(0);
                    })
                });
            })
        })
    });
    process.exit();
});