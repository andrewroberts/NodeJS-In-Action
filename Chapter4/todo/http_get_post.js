var http = require('http');
var items = [];

var server = http.createServer(function(req, res){
	
	if (req.url === '/') {
		
		switch (req.method) {

		case 'GET':
			show(res);
			break;
			
		case 'POST':
			processPost(req, res);
			break;

		default:
			badRequest(res);
			break;
		}
		
	} else {
		
		notFound(res);
	}
	
	// Private functions.
	
	function show(res) {
		
		var html = 
			'<h1>Todo List</h1>' +
			'<ul>' +
			items.map(function(item){
				// console.log('add item: ' + item);
				return '<li>' + item + '</li>';
			}).join('') +
			'</ul>' +
			'<form method="post" action="/">' +
			'<p><input type="text" name="item" /></p>' +
			'<p><input type="submit" value="Add Item" name="add"/></p>' +
			'<p><input type="submit" value="Delete Item" name="delete"/></p>' +					
			'</form>';
					
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', Buffer.byteLength(html));
		res.end(html);
	}

	function notFound(res) {

		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/plain');
		res.end('Not Found');
	}

	function badRequest(res) {
		
		res.statusCode = 400;
		res.setHeader('Content-Type', 'text/plain');
		res.end('Bad Request');
	}

	function processPost(req, res) {
		
		var body = '';
		
		req.setEncoding('utf8');
		
		req.on('data', function(chunk) {
			
			body += chunk;
		});
		
		req.on('end', function() {
			
			var obj = require('querystring').parse(body);
			console.log(obj);
			
			if (obj.add) {
			
				items.push(obj.item);
				console.log("new item added, num: " + items.length);
				
			} else {
				
				// Find ths item and remove it.
				var itemIndex = items.indexOf(obj.item);
				
				if (itemIndex !== -1) {
					
					items.splice(itemIndex, 1);
					console.log("new item removed, num: " + items.length);
					
				} else {
					
					console.log("item not found");
				}
			}
			
			show(res);
		});
	}

});

server.listen(3000, function(){
	console.log('listening on port 3000');
});