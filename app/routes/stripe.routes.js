
 var stripeFile = require('../controller/stripe.controller.js');
module.exports = function(app) { 

app.post('/stripe1', stripeFile.stripeProcess_0);
}