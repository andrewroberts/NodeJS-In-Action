var fs = require('fs'),
	completedTasks = 0,
	tasks = [],
	wordCounts = {},
	filesDir = './text';
	
function checkIfComplete() {
	
	completedTasks++;
	
	if (completedTasks === tasks.length) {
		
		for (var index in wordCounts) {
			
			console.log(index +': ' + wordCounts[index]);
		}
	}
}

function countWordsInText(text) {
	
	var words = text.toString()
					.toLowerCase()
					.split(/\W+/)
					.sort();

	for (var index in words) {
		
		var word = words[index];
		
		if (word) {
		
			wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
		}
	}
}

fs.readdir(filesDir, function(err, files) {
	
	var task;
	var index;
	
	if (err) {
		
		throw err;
	}
	
	for (index in files) {
		
		console.log("readdirCallback() - " + files[index]);
		task = getTask(filesDir + '/' + files[index]);
		tasks.push(task);
	}
	
	for (index in tasks) {
		
		tasks[index]();
	}
	
	// Private functions.
	
	function getTask(file) {
		
		return readFile(file);
	}
	
	function readFile(file) {
				
		fs.readFile(file, function (err, text) {
			
			if (err) {
				
				throw err;
			}
			
			countWordsInText(text);
			checkIfComplete();
		});
	}
});