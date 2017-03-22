/**
 * Created by JoshuaBrummet on 3/22/17.
 */
var mongoose = require('mongoose');

var Pet = new mongoose.Schema({
    animal: String,
    name: String,
    age: Number,
    info: String,
    funds: Number
});

module.exports = mongoose.model('User', new mongoose.Schema({
    userName: String,
    passWord: {
        type: String,
        min: 6,
        unique: true
    },
    firstName: String,
    lastName: String,
    location: String,
    age: Number,
    phoneNumber: String,
    lastLoginDate: {
        type: Date,
        default: Date.now
    },
    email: String,
    pet: [Pet]
}));

