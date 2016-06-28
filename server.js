var express = require('express');
var processor = require('./app/controller/processor.js');
var bodyParser = require('body-parser'),
methodOverride = require('method-override');

var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.set('views', './app/views');
	app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(50000, function(){
	console.log("server is listening to port 50000");
});

app.get('/', processor.index);

app.get('/getIDs?:pageName', processor.getIDs);

app.post('/stripe', processor.injectCode);

app.get('/payment', processor.paymentPage);

app.get('/deploy', processor.deploy);require('./app/routes/stripe.routes.js')(app);
