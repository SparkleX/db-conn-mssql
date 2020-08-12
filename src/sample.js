/*var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var config = {
  authentication: {
	type:"default",
	options: {
		userName:"sa",
		password:"12345678"		
	}
  },
  options: {
	trustServerCertificate: true,
	port: 1433,
    encrypt: false
  },
  server: "localhost"
};
var connection = new Connection(config);
connection.connect();
connection.on('connect', function(err) {
	console.debug(err);
	request = new Request("select * from SBODemoUS.dbo.ORDR where DocEntry = @a", function(err, rowCount) {

	});
	request.addParameter('a', TYPES.Int)
	request.on('row', function (columns) { 
		console.debug("r");
	});
	request.on('prepared', function () {
		connection.execute(request, {a:1});
	 });
	connection.prepare(request);
  }
);*/