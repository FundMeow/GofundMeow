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

    //Paths
    app.use(express.static(path.join(__dirname, 'views')));
    app.get('*', function(req, res) {
        res.sendFile('views/index.html' , { root : __dirname});
    });
    app.get('*', function(req, res) {
        res.sendFile('views/pets.html' , { root : __dirname});
    });


    conn.on('error', console.error.bind(console, 'connection error:'));
    conn.once('open', function() {
        app.listen(port, function() {
            console.log('DB and App running on port 8080')
        });
        // Wait for the database connection to establish, then start the app.
    });

});