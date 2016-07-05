var express = require('express');
var processor = require('./app/controller/processor.js');
var editor = require('./app/controller/editor.js');
var bodyParser = require('body-parser'),
methodOverride = require('method-override');
var mustacheExpress = require('mustache-express');

var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './app/views');
app.use(express.static('public'));

//app.use('/static', express.static('public/editor/js'));

app.listen(50000, function(){
	console.log("server is listening to port 50000");
});

//app.get('/', processor.index);

app.get('/getIDs?:pageName', processor.getIDs);

app.post('/stripe', processor.injectCode);

app.get('/payment', processor.paymentPage);

app.get('/deploy', processor.deploy);

app.get('/nodes', editor.nodes);

app.get('/', editor.startNode);

app.get('/settings', editor.settings);

app.get('/locales/editor', editor.edit);

app.get('/locales/node-red', editor.nodered);

app.get('/locales/node-red-node-email/email', editor.email);

app.get('/locales/node-red-node-feedparser/feedparse', editor.feedparse);

app.get('/locales/node-red-node-rbe/rbe', editor.rbe);

app.get('/locales/node-red-node-serialport/serialport', editor.serialport);

app.get('/locales/node-red-node-twitter/twitter', editor.twitter);

require('./app/routes/stripe.routes.js')(app);
