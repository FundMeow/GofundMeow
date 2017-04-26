/**
 * Created by JoshuaBrummet on 4/25/17.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Image', new mongoose.Schema({
    img:
        {
            data: Buffer,
            contentType: String
        }
}));
