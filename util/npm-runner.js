module.exports = function(script, done) {

	var exec = require('child_process').exec;
	
	var command = "npm run " + script;
	
	exec(command, function(error, stdout, stderr) {
	
		if (error) {			
			console.log(error);
			console.log(stdout);
			console.log(stderror);				
		}
		
		return done();		

	});
	
};