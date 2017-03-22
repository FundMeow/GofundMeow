/**
 * Created by JoshuaBrummet on 3/22/17.
 */

var util = require('util');
var _ = require('lodash');

module.exports = function (err, req, res, next){
    if (util.isError(err)) {

        Object.defineProperty(err,'message', {enumerable: true});
        res.json(err);
    } else {

        if (_.isFunction(next)) {
            next();
        }
        else if (_.isFunction(res)) {
            res();
        }
    }
};



