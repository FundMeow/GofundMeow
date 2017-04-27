
/**
 * Created by Christopher Corona on 4/26/2017.
 */


'use strict';
//npm install braintree
var braintree = require('braintree');

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   '86smvm5pk58rw9wf',
    publicKey:    'fmz87pkcpg9xhyv4',
    privateKey:   'd8b03cee1ba2e26a25ccc97d8a95a28c'
});
module.exports = {
    getToken: getToken,
    postPayment: postPayment
};

function getToken (request, response) {

    gateway.clientToken.generate({}, function (err, res) {
        response.render('index', {
            clientToken: res.clientToken
        });
    });

};



function postPayment(request, response) {

    var transaction = request.body;

    gateway.transaction.sale({
        amount: transaction.amount,
        paymentMethodNonce: transaction.payment_method_nonce,
        options: transaction.options
    }, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }

        if (result.success) {
            response.json({
                message: 'Transaction ID: ' + result.transaction.id
            })
        }
        else {
            console.error(result.message);
        }
    })

}
