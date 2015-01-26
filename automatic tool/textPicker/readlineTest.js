/*var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
//rl.setPrompt('input filename');
rl.on('line', function(cmd) {
	console.log('cmd');
})
*/
//var process = require('process');
process.stdin.resume();
process.stdin.on('data', function(chunk) {
	//var chunk = process.stdin.read();
	if(chunk) {
		process.stdout.write('your input:' + chunk);
	}
});
process.stdin.on('end', function() {
	//process.stdout.write('end');
	console.log('end');
});