var http = require('http');

var server = http.createServer(function(req, res){

	switch (req.method) {

	case 'GET':

		show(req, res);
		
		break;
		
	case 'POST':
	
		upload(req, res);
		break;
	}
	
	function show(req, res) {
	
		var html = '' +
			'<form method="post" action="/" enctype="multipart/form-data">' +
			'<p><input type="text" name="name" /></p>' +
			'<p><input type="file" name="file" /></p>' +
			'<p><input type="submit" value="Upload" /></p>' +
			'</form>';
			
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', Buffer.byteLength(html));
		res.end(html);
	}

	function upload(req, res) {
		// upload logic
	}
	
});

server.listen(3000, function() {
	console.log("listening on port 3000");
});
