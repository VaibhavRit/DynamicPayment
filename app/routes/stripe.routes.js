
 var stripeFile = require('../controller/stripe.controller.js');
module.exports = function(app) { 
app.post('/stripe_1', stripeFile.stripeProcess_0);
app.post('/stripe_2', stripeFile.stripeProcess_1);
app.post('/stripe_3', stripeFile.stripeProcess_2);
app.post('/stripe_4', stripeFile.stripeProcess_3);
}