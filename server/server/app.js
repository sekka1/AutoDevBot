
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var monitor = require('./routes/monitor');
var http = require('http');
var path = require('path');
var hash = require('./pass').hash;

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);




/////////////////////////
/////////////////////////

// Auth
// https://github.com/visionmedia/express/blob/master/examples/auth/app.js

// Test auth with dummy users

// dummy database
var users = {
    tj: { name: 'tj' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)
hash('foobar', function(err, salt, hash){
    if (err) throw err;
    // store the salt & hash in the "db"
    users.tj.salt = salt;
    users.tj.hash = hash;
});


// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {

    //if (!module.parent) console.log('authenticating %s:%s', name, pass);
    var user = users[name];

    // query the db for the given username
    if (!user) return fn(new Error('{"status":"failed", "message":"Authentication failed, please check your username and password"}'));

    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash(pass, user.salt, function(err, hash){

        if (err) return fn(err);
        if (hash == user.hash) return fn(null, user);
        fn(new Error('{"status":"failed", "message":"Authentication failed, please check your username and password"}'));
    })

}

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = '{"status":"access_denied", "message":"access denied"}';
        res.send('{"status":"access_denied", "message":"access denied"}');
    }
}


app.get('/restricted', restrict, function(req, res){
    res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.post('/login', function(req, res){
    authenticate(req.body.username, req.body.password, function(err, user){
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function(){
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                req.session.success = '{"status":"success"}';
                //res.redirect('back');
                res.send('{"status":"success", "message":"logged in"}');
            });
        } else {
            req.session.error = '{"status":"failed", "message":"Authentication failed, please check your username and password"}';
            res.send('{"status":"failed", "message":"Authentication failed, please check your username and password"}');
        }
    });
});

app.get('/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
        res.send('{"status":"success", "message":"logged out"}');
    });
});


/////////////////////////
/////////////////////////




// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/users', restrict, user.list);

app.post('/monitor', monitor.add);
app.get('/monitor', monitor.list);
app.delete('/monitor/:id', monitor.delete);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

