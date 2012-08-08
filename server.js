/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var mysql = require('mysql');
var TEST_DATABASE = 'nodejs_mysql_test';
var TEST_TABLE = 'test';
var client = mysql.createClient({
  user: 'root',
  password: ''
});


// middleware
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.get('/createdatabase', function(req, res){

	client.query('CREATE DATABASE '+TEST_DATABASE, function(err) {
	  if (err && err.number != mysql.ERROR_DB_CREATE_EXISTS) {
	    // throw err;
		console.log(err);
	  }
	});

  res.send('database created');
});	

app.get('/createtable', function(req, res){

	client.query(
	  'CREATE TABLE '+TEST_TABLE+
	  '(id INT(11) AUTO_INCREMENT, '+
	  'title VARCHAR(255), '+
	  'text TEXT, '+
	  'created DATETIME, '+
	  'PRIMARY KEY (id))', function(err) {
	  if (err) {
	    // throw err;
		console.log(err);
	  }
	});

  res.send('table created');
});	

app.get('/writerecords', function(req, res){

	// If no callback is provided, any errors will be emitted as `'error'`
	// events by the client
	client.query('USE '+TEST_DATABASE);

	client.query(
	  'INSERT INTO '+TEST_TABLE+' '+
	  'SET title = ?, text = ?, created = ?',
	  ['super cool', 'this is a nice text', '2010-08-16 10:00:23']
	);
	
	var query = client.query(
	  'INSERT INTO '+TEST_TABLE+' '+
	  'SET title = ?, text = ?, created = ?',
	  ['another entry', 'because 2 entries make a better test', '2010-08-16 12:42:15']
	);	
	
	
  res.send('records written');
});

	

app.get('/', function(req, res){

	// If no callback is provided, any errors will be emitted as `'error'`
	// events by the client
	client.query('USE '+TEST_DATABASE);
	
	client.query(
	  'SELECT * FROM '+TEST_TABLE,
	  function selectCb(err, results, fields) {
	    if (err) {
	      throw err;
	    }
	
	    console.log(results);
	    console.log(fields);
	  	res.send(JSON.stringify(results));
	    // client.end();
	  }
	);	
	
	
	
});

app.listen(3000, function(){
  console.log("Express server listening on port 3000");
});
