/**
 * Created by JoshuaBrummet on 3/22/17.
 */

'use strict';

var mongoose = require('mongoose');
var User = require('../../models/user');
var _ = require('lodash');

module.exports = {
    index: index,
    create: create,
    show: show,
    update: update,
    destroy: destroy
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
        console.log(users);
        res.json({
            users: users
        }).end();
    });
}

//create a new user
function create(req,res){

    var _user = new User(req.swagger.params.user.value.user);
    _user.save(function(err) {
        // if (err){
        //     res.status(500).json(err).end();
        //     return;
        // }
        //Need to find why this gives a error, when using the POST method

        res.json({
            message: 'User Created',
            user: _user
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
                message: 'The following movie has been updated',
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