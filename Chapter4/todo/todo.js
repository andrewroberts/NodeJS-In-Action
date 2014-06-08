var http = require('http');
var url = require('url');
var items = [];
var server = http.createServer(function(req, res){
	
	var item = '';
	var response = {statusCode: 200, msg: 'OK\n'};

	switch (req.method) {

	case 'POST':

		console.log("POST");
		
		readStream(true);
		
		res.statusCode = response.statusCode;
		res.end(response.msg);
		
		break;
		
	case 'GET':

		console.log("GET");

		// Use join() to add a new line between the elements of 
		// the array, but we still need to add an extra on the end.
		var body = items.map(function(item, i){
			return i + ') ' + item;
		}).join('\n') + '\n';
			
		res.setHeader('Content-Length', Buffer.byteLength(body));
		res.setHeader('Content-Type', 'text/plain; charset="utf-8"');

		res.statusCode = response.statusCode;
		res.end(body);

		break;
		
	case 'PUT':
		
		console.log("PUT");
		
		readStream(false);		
		
		res.statusCode = response.statusCode;
		res.end(response.msg);
		
		break;
	
	case 'DELETE':
		
		console.log("DELETE");
		
		var i = getIndex();
		
		if (i !== -1) {
			
			// Found the item so delete it.
			items.splice(i, 1);
			response.msg = 'Item ' + i + ' removed\n';
			console.log('Deleted item ' + i);
		}

		res.statusCode = response.code;
		res.end(response.msg);
	
		break;
		
	default:

		res.statusCode = 400;
		res.end('Unexpected request\n');
	
		console.log("Unexpected method");
		
		break;
		
	}
	
	function getIndex() {
		
		var path = url.parse(req.url).pathname;
		var i = parseInt(path.slice(1), 10);
		
		if (isNaN(i)) {
			
			response.statusCode = 400;
			response.msg = 'Invalid item id\n';
			console.log('getIndex() - invalid item id');
			return -1;
			
		} else if (!items[i]) {
			
			response.statusCode = 404;
			response.msg = 'Item ' + i + ' not found\n';
			console.log('getIndex() - item not found');			
			return -1;
			
		}
		
		console.log('getIndex() - ' + i);		
		return i;

	} // getIndex()

	function readStream(add) {
		
		var item = '';
		
		req.setEncoding('utf8');
		
		req.on('data', function(chunk){
			item += chunk;
		});
		
		req.on('end', function(){
			
			if (add) {
				
				items.push(item);
				response.msg = 'Item added\n';
				console.log("readStream() - item added");
				
			} else {
				
				// Got all of the data so replace this entry.
			
				var i = getIndex();
				
				if (i !== -1) {
					
					items[i] = item;
					response.msg = 'Item replaced\n';
					console.log("readStream() - item replaced");					
				}
	
			}
			
		});
		
		req.on('error', function(){
			response.msg = 'Error receiving data\n';
			console.log('Error receiving data');
		});
		
	} // readStream()
	
});

server.listen(3000, '127.0.0.1',function() {
	console.log("Listening on port 3000");
});