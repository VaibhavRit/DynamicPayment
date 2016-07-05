var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
// Process payment
exports.stripeProcess_0 = function(req, res){
	var stripeToken = req.body.stripeToken;
	var charge = stripe.charges.create({
	  amount: 12345, // amount in cents, again
	  currency: "usd",
	  source: stripeToken,
	  description: "Example charge"
	}, function(err, charge) {
		if (err && err.type === 'StripeCardError') {
		    res.redirect('/payment');
		}
		else res.redirect('/');
	});
};