'use strict';

var SwaggerExpress = require('swagger-express-mw');
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

    conn.on('error', console.error.bind(console, 'connection error:'));
    conn.once('open', function() {
        app.listen(port, function() {
            console.log('DB and App running on port 8080')
        })
        // Wait for the database connection to establish, then start the app.
    });

});