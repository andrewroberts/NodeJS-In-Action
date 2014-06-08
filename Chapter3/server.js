var http = require('http');

var server = http.createServer(function(req, res){
	console.log(req.headers.host);
	res.write('Hello World');
	res.end();
});

server.listen(3000, '127.0.0.1', function() {
	console.log('listening on port 3000');
});