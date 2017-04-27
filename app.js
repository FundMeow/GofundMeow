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

//npm install braintree
var braintree = require('braintree');

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   '86smvm5pk58rw9wf',
    publicKey:    'fmz87pkcpg9xhyv4',
    privateKey:   'd8b03cee1ba2e26a25ccc97d8a95a28c'
});


app.get("/client_token", function (req, res) {
    gateway.clientToken.generate({}, function (err, response) {
        res.send(response.clientToken);
    });
});

app.post("/checkout", function (req, res) {
    var nonceFromTheClient = req.body.payment_method_nonce;
    // Use payment method nonce here
});

gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: 'nonce-from-the-client',
    options: {
        submitForSettlement: true
    }
}, function (err, result) {
    if (err) {
        console.error(err);
        return;
    }

    if (result.success) {
        console.log('Transaction ID: ' + result.transaction.id);
    } else {
        console.error(result.message);
    }
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
    app.get('*', function(req, res) {
        res.sendFile('views/pets.html' , { root : __dirname});
    });

    // Wait for the database connection to establish, then start the app.
    conn.on('error', console.error.bind(console, 'connection error:'));
    conn.once('open', function() {
        app.listen(port, function() {
            console.log('DB and App running on port 8080')
        });
    });

});