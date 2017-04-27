/**
 * Created by JoshuaBrummet on 3/22/17.
 */

'use strict';

var User = require('../../models/user');
var _ = require('lodash');
var multer = require('multer');
var upload = multer({dest: './uploads/'});
var formidable = require("formidable");
var fs = require('fs');
var grid = require("gridfs-stream");
var random = require("random-js")();
var mongoose = require("mongoose");
var conn = mongoose.connection;

module.exports = {
    index: index,
    create: create,
    show: show,
    update: update,
    destroy: destroy,
    postImage: postImage
};

//get all users in the database
function index(req,res){
    User.find(_.omitBy({
        firstName: req.swagger.params.firstName.value
    }, function (value) {
        return _.isNull(value) || _.isUndefined(value);

    }), function (err, users) {
        if(err){
            res.status(500).json(err).end();
        }
        res.json({
            users: users
        }).end();
    });
}

//create a new user
function create(req,res){

    var _user = new User(req.swagger.params.user.value);
    _user.metadata.path = "/user/" + _user._id;
    _user.img = '';
    //res.json(_user);
    _user.save(function(err) {
        if (err){
             res.status(500).json(err).end();
             return;
         }
        res.json({
            message: 'User Created',
            created: _user
        })
   })
}

//get a single user
function show(req,res){
    User.findById(req.swagger.params.userId.value, function(err, user){

        if(err){
            res.status(500).json(err).end();
            return;
        }
        res.json({
            user: user
        }).end();
    })
}

//update a user
function update(req,res){
    User.findById(req.swagger.params.userId.value, function(err, user){
        if(err){
            res.status(500).json(err).end();
            return;
        }
        _.assign(user, req.swagger.params.user.value.user);

        user.save(function(err){
            if(err){
                res.status(500).json(err).end();
                return;
            }
            res.json({
                message: 'The following user has been updated',
                user: user
            }).end();
        })
    })
}

//delete a user
function destroy(req,res){
    User.findByIdAndRemove(req.swagger.params.userId.value, function(err,user){
        if (err){
            res.status(500).json(err).end();
            return;
        }
        res.json({
            message: 'The following user has been deleted',
            user: user
        }).end();
    })
}

function postImage(req,res){

    var supported_mimes = [
        'image/png',
        'image/jpeg',
        'image/gif'
    ];
    var file = req.swagger.params.file.value;
    //console.log(file);

    if (supported_mimes.indexOf(file.mimetype) === -1) {
        var err = {
            message: 'File type not supported for uploads'
        };
        return res.json(err);
    }
    var data = {
        'id': file.originalname,
        'field': file.fieldname,
        'destination': file.destination,
        'size': file.size,
        'type': file.mimetype,
        'encoding': file.encoding
    };
    console.log(data);
    var path = 'uploads/';
    var _id = random.integer(1, 100000000000);
    fs.writeFile(path + file.originalname, file.buffer , function (err) {
        if (err) {
            return res.json({message: 'File not uploaded'});
        }
        else
        User.findById(req.swagger.params.userId.value, function(err, user){

            fs.readFile('uploads/'+ file.originalname, function(err, img){
                if(err){
                    res.json({err: err});
                }
                else
                    user.img = img;
                    console.log(user);
                    user.save(function(err){
                        if(err){
                        res.status(500).json(err).end();
                        return;
                        }
                        res.json({
                            message: user
                        }).end();
                    });
           })
        });
    });
}
