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
    mongoose.connect('mongodb://localhost/movieHouse');

    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function() {
        app.use(jsonErrorFormatter);
        app.listen(port, function() {
            console.log('DB and App running on port 8080')
        })

    })

});
