var Connection = require('tedious').Connection;
var config = {
  authentication: {
	type:"default",
	options: {
		userName:"sa",
		password:"12345678"		
	}
    /*options: {
		userName:"sa",
		password:"12345678"		
	}*/
  },
  options: {
	trustServerCertificate: true,
	port: 1433,
    encrypt: false
  },
  server: "127.0.0.1"
};
var connection = new Connection(config);
connection.connect();
connection.on('connect', function(err) {
    console.debug(err);
  }
);