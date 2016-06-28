var fs = require('fs');
var linereader = require('readline');

//pk_test_6pRNASCoBOKtIshFeQd4XMUh

exports.index = function(req, res){
	fs.readdir('./app/views', function(err, files){
		if(err){
			console.log("not able to list the directories");
			res.render('index', {
				files : [],
				error : "not able to list the directories"
			});
		} else {
			console.log(files);
			res.render('index', {
				files : files,
				error : null
			});
		}
	});
};

exports.getIDs = function(req, res){
	var pageName = "./app/views/" + req.query.page;
	console.log("page name is " + pageName);
	var myRegex_1 = /id\s*=\s*/g;
	listOfIds = [];

	var lineReader = require('readline').createInterface({
					input : fs.createReadStream(pageName)
				});

	lineReader.on('line', function(line){			
		var match;
		var isFirst = true;
		var lastFound;
		var lastPos;
		while ((match = myRegex_1.exec(line)) != null) {  		
			var i = match.index;					
			//console.log("hey " + i);
			while(i < line.length + 1){
				if(line.charAt(i) == '"' || line.charAt(i) == '\''){
					//console.log("heyy");
					if(isFirst){
						lastFound = line.charAt(i);
						lastPos = i;
						isFirst = false;	
					} else {
						if(lastFound === line.charAt(i)) listOfIds.push(line.substring(lastPos + 1, i));
						isFirst = true;
						break;					
					}	
				}			
				i++;
			} 
		}	
	});

	lineReader.on('close', function(){
		console.log("ID LIST IS");
		for(var i = 0; i < listOfIds.length; i++){
			console.log(listOfIds[i]);
		}
		res.json({
			listOfIds : listOfIds
		});
	});
};

function injectIntoFile(req, res, functionNumber, amount, stripeProcessingController, endPoint){
	// Read stripe related data from public/stripe/stripe.txt
	fs.readFile('public/stripe/stripe.txt','utf-8', function(err, data){
		if(err){
			console.error("NOOOOO");
		} else {
			var result = data.replace(/amount: 999/g, 'amount: ' + amount);
			var functionName = 'exports.stripeProcess_' + functionNumber;
			result = result.replace(/exports.stripeProcess/g, functionName);
			fs.appendFile("./app/controller/" + stripeProcessingController, result, function(err){
				if (err) console.error("Big no");
				else {					
					if(functionNumber == 0){	
						var stripeFileAppend = "\n var stripeFile = require('./app/controller/stripe.controller.js');\n";
						stripeFileAppend += "require('./app/routes/stripe.routes.js')(app);\n";
						fs.appendFile('server.js', stripeFileAppend, function(err){
							if(err) console.error("in append server.js ");				
						});
					}
					var endpointFunction = 'stripeFile.stripeProcess_' + functionNumber;
					fs.writeFile('./app/routes/stripe.routes.txt', "app.post('/" + endPoint + "', " + endpointFunction + ");\n", function(err){
						if(err) console.error('error in writing stripe.txt');
						else fs.readFile('./app/routes/stripe.routes.txt', 'utf-8', function(err, data){
							if(err) console.error('error reading stripe.txt');
							else {
								var result = 'module.exports = function(app) { \n' + data + '}';
								fs.writeFile('./app/routes/stripe.routes.js', result, function(err){
									if(err) console.error("Error writing stripe.routes.js");
									else res.josn({});
								});
							}
						});
					});										
				}
			});
		}
	});
}

exports.injectCode = function(req, res){

	console.log("Called");
	var outputString = "";
	console.log("ID " + req.body['currentId']);
	console.log("Page " +  req.body['currentPage']);
	var myRegex = new RegExp("id\s*=\s*" + "\"" + req.body['currentId'] + "\"");

	var codeSnippet = "<form action=\"" + req.body['routeTo'] + "\" method=\"POST\">" +
   " <script " +
    " src=\"https://checkout.stripe.com/checkout.js\" class=\"stripe-button\" " + 
    " data-key=" + req.body['apiKey'] + " " + 
    " data-amount=" + req.body['amount'] + " " +
    "data-name=" +  req.body['name'] + " " +
    "data-description=" + req.body['description'] + " " +
    " data-image=" + req.body['imagePath'] + " " + 
    " data-locale=\"auto\"> " + 
    "</script> </form> ";

    var inputFile = "./app/views/" + req.body['currentPage'];

	var lineReader = require('readline').createInterface({
			input : fs.createReadStream(inputFile)
		});

	lineReader.on('line', function(line){			
		var match;
		if(match = myRegex.exec(line)){
			var pos = match.index;		
			console.log("matched " + pos);
			while(line[pos] != '>'){
				++pos;
			}
			outputString +=  line.substring(0, pos + 1) + codeSnippet + line.substring(pos + 1) +  "\n";
		} else {
			outputString += line + "\n";
		}
	});

	lineReader.on('close', function(){
		//console.log("FINAL OUTPUT IS \n" + outputString);
		fs.writeFile(inputFile, outputString, function(err){
			if(err) console.log("something went wrong while writing");
		});

		// BackEnd changes
		var stripeProcessingController = "stripe.controller.js";
		var fileExists = fs.existsSync("./app/controller/" + stripeProcessingController);
		if(!fileExists){
			injectIntoFile(req, res, 0, req.body['amount'], stripeProcessingController, req.body['endpoint']);
		} else {
			fs.readFile('./app/controller/stripe.controller.js', 'utf-8', function(err, data){
				if(err) {
					console.error("Error while opening the file");
					res.redirect('/');
				}
				else {
					var pattern = /exports\.stripeProcess/g;
					var number_of_functions = 0;
					while(pattern.exec(data)){
						++number_of_functions;
					}
					injectIntoFile(req, res, number_of_functions, req.body['amount'], stripeProcessingController, req.body['endpoint']);
				}
			});
		}
	});
};

exports.paymentPage = function(req, res){
	res.render('payment', {});
};