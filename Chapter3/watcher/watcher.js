var events = require('events'),
	util = require('util'),
	fs = require('fs'),
	watchDir = './watch',
	processedDir = './done';

// Initialise the Watcher app
// --------------------------

// Inherit the properties of events.EventEmitter.
util.inherits(Watcher, events.EventEmitter);

// Create a new Watcher object.
var watcher = new Watcher(watchDir, processedDir);

// Register a listener for new files.
watcher.on('newfile', onNewFile);

// Register a listener for errors.
watcher.on('error', onError);

// Start the Watcher app.
watcher.start();

// Watcher listeners
// -----------------

// New file created.
function onNewFile(file) {

	console.log("onNewFile() - watch_old: " + this.watchDir + 
	            " process_old: " + this.processedDir);

	var watchFile = this.watchDir + '/' + file;
	var processedFile = this.processedDir + '/' + file.toLowerCase();

	console.log("onNewFile() - watch_new: " + watchFile + 
	            " process_new: " + processedFile);

	fs.rename(watchFile, processedFile, onError);
}

// Error occured.
function onError(err) {

	if (err) {
		throw err;
	}
}

// Watcher class
// -------------

function Watcher(watch, processed) {

	if (typeof watch !== 'string' || typeof processed !== 'string') {		
		throw("Watcher() - Illegal parameters");
	}

	// Public
	// ------

	this.watchDir = watch;
	this.processedDir = processed;

	// Privileged
	// ----------

	this.start = function() {
		console.log("Watcher.start() - watching: " + this.watchDir);
		fs.watchFile(this.watchDir, changeInDir);
	};

	
	// Private
	// -------
	
	var watcher = this;

	// New file found.
	function changeInDir() {
	
		console.log("Watcher.changeInDir() - watching: " + watcher.watchDir);
	
		fs.readdir(watcher.watchDir, function (err, files) {
			
			if (err) {
				watcher.emit('error', err);
			}
			
			for(var index in files) {
				console.log("Watcher.changeInDir() - " + files[index]);
				watcher.emit('newfile', files[index]);
			}
		});	
		
	} // Watcher.newFileFound()
	
} // Watcher()
