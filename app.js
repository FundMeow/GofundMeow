'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var path = require('path');
var app = require('express')();
var mongoose = require('mongoose');

var jsonErrorFormatter = require('./api/helpers/jsonErrorFormatter');
module.exports = app; // for testing
var config = {
    appRoot: __dirname // required config
};

var braintree = require('braintree');
var bodyParser = require('body-parser');
var parseUrlEnconded = bodyParser.urlencoded({
    extended: false
});
var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   '86smvm5pk58rw9wf',
    publicKey:    'fmz87pkcpg9xhyv4',
    privateKey:   'd8b03cee1ba2e26a25ccc97d8a95a28c'
});


app.get('/payment', function (request, response) {

    gateway.clientToken.generate({}, function (err, res) {
        response.render('payment', {
            clientToken: res.clientToken
        });
    });

});

app.post('/process', parseUrlEnconded, function (request, response) {

    var transaction = request.body;

    gateway.transaction.sale({
        amount: transaction.amount,
        paymentMethodNonce: transaction.payment_method_nonce
    }, function (err, result) {

        if (err) throw err;

        if (result.success) {

            console.log(result);

            response.sendFile('success.html', {
                root: './views'
            });
        } else {
            response.sendFile('error.html', {
                root: './views'
            });
        }
    });

});

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }
    // install middleware
    swaggerExpress.register(app);
    var port = process.env.PORT || 8080;


    var options = { server: { socketOptions: { keepAlive: 1000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 1000, connectTimeoutMS : 30000 } } };

    var mongodbUri = 'mongodb://fundmeow:hi10fund@ds151070.mlab.com:51070/fundmeowdb';

    mongoose.connect(mongodbUri, options);
    var conn = mongoose.connection;

    //Rendering paths for views.
    app.use(express.static(path.join(__dirname, 'views')));
    app.get('*', function(req, res) {
        res.sendFile('views/index.html' , { root : __dirname});
    });
    // app.get('*', function(req, res) {
    //     res.sendFile('views/pets.html' , { root : __dirname});
    // });
    // app.get('*', function(req, res){
    //     res.sendFile('views/users.html', {root: __dirname});
    // });

    app.use(express.static('views'));

    //app.set('views/index.html', __dirname + '/views');
    app.set('view engine', 'ejs');

    // Wait for the database connection to establish, then start the app.
    conn.on('error', console.error.bind(console, 'connection error:'));
    conn.once('open', function() {
        app.listen(port, function() {
            console.log('DB and App running on port 8080')
        });
    });

});