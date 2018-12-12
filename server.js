var mysql = require('mysql');
var express = require('express');
var terminal = require("web-terminal");
var app = express();
var http = require('http');
var url = require('url');
var request = require('request');
var nodemailer = require('nodemailer');
var mergeJSON = require("merge-json");
var fileUpload = require('express-fileupload');
var multipart = require('connect-multiparty');
var path = require('path');
var xml = require('xml');
var XLSX = require('xlsx');
var QRCode = require('qrcode');
var async = require("async");
var Q = require('Q');
var bodyParser = require('body-parser');
var MailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
var MobileNoPattern = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
const utf8 = require('utf8');
var compiler = require('compilex');

var option = {stats : true};
compiler.init(option);

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'websitebuilder',
	connectionLimit: 100,
	acquireTimeout: 15000
});

app.listen(5000);

console.log("Server Listen 5000");
con.connect(function (err) {
	if (err) {
		throw err;
		return;
	} else {
		console.log("Connection Established.");
	}
});
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));



var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'aswinnsh@gmail.com',
		pass: 'aswin3009'
	}
});


app.get('/' , function (req , res ) {
	res.sendfile( __dirname + "/index.html");
});

app.post('/compilecode' , function (req , res ) {
	var input = req.body.input || '';
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;
    var code = req.body.code;
    console.log(lang,inputRadio,input)
    if((lang === "C") || (lang === "C++"))
    {        
        if(inputRadio === "true")
        {    
        	var envData = { OS : "windows" , cmd : "g++"};	   	
        	compiler.compileCPPWithInput(envData , code ,input , function (data) {
        		if(data.error)
        		{
        			res.send(data.error);    		
        		}
        		else
        		{
        			res.send(data.output);
        		}
        	});
	   }
	   else
	   {
	   	
	   	var envData = { OS : "windows" , cmd : "g++"};	   
        	compiler.compileCPP(envData , code , function (data) {
        	if(data.error)
        	{
        		res.send(data.error);
        	}    	
        	else
        	{
        		res.send(data.output);
        	}
    
            });
	   }
    }
    if(lang === "Java")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows" };     
            console.log(code,input);
            compiler.compileJavaWithInput( envData , code , input , function(data){
                res.send(data);
            });
        }
        else
        {
            var envData = { OS : "windows" };     
            console.log(code);
            compiler.compileJava( envData , code ,  function(data){
                res.send(data);
            });

        }

    }
    if( lang === "Python")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows"};
            compiler.compilePythonWithInput(envData , code , input , function(data){
                res.send(data);
            });            
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compilePython(envData , code , function(data){
                res.send(data);
            });
        }
    }
    if( lang === "CS")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows"};
            compiler.compileCSWithInput(envData , code , input , function(data){
                res.send(data);
            });            
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compileCS(envData , code , function(data){
                res.send(data);
            });
        }

    }
    if( lang === "VB")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows"};
            compiler.compileVBWithInput(envData , code , input , function(data){
                res.send(data);
            });            
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compileVB(envData , code , function(data){
                res.send(data);
            });
        }

    }

});















