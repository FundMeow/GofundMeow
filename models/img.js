/**
 * Created by JoshuaBrummet on 4/26/17.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('img', new mongoose.Schema({
    photo: {
        data: Buffer,
        contentType: String
    }
}));