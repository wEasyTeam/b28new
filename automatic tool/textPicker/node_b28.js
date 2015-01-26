var jsdom = require('jsdom'),
	fs = require('fs'),
	path = require('path'),
	B = require('./b28lib').b28lib,
	excludeList = ['.svn', 'goform', 'css', 'images', 'lang', 'img', 'libs'];

var fileList = [],
	langArr = [],
	isFinished = false;
	excludeList = excludeList.join("\t");

function writeFile(filename, content) {
	fs.writeFile(filename, content, function (err) {
		fileList = [];
		if (err) {
			throw err;
		}
		console.log('\n**' + filename + ' successfully saved!');
		console.log('**Press "ctrl + C" to quit');
		console.log('**Or Start another picker:');
	});
}

function getPageLangData(page, saveTo, callback) {
	jsdom.env({
		file: page,
		done: function (errors, window) {
			var document = window.document,
				bodyElem = document;
			bodyElem.documentElement.innerHTML = bodyElem.documentElement.innerHTML.replace(/<(style|script)[\w\W]*?<\/\1>/gi, '');
			var obj = new B.getPageData(),
				arr = obj.getNodeValue(document);
			obj = null;
			if (saveTo && saveTo !== "" && typeof saveTo == "string") {
				writeFile(saveTo, arr.join("\r\n"));
			} else {
				if (typeof saveTo == "function") {
					callback = saveTo;
				}
			}

			if (callback) {
				callback.call(null, arr);
			}
			return arr;
		}
	});
}

function getResLangData(file, saveTo, callback) {
	fs.readFile(file, 'utf-8', function (err, content) {
		if (err) {
			throw ('read file: ' + file + ' error!');
		} else {
			var obj = new B.getResData(),
				arr = obj.getResValue(content);
			if (saveTo && saveTo !== "" && typeof saveTo == "string") {
				writeFile(saveTo, arr.join("\r\n"));
			} else {
				if (typeof saveTo == "function") {
					callback = saveTo;
				}
			}
			if (callback) {
				callback.call(null, arr);
			}
		}
	});
}


function getFileList(parentDirectory) {
	try {
		var stat = fs.statSync(parentDirectory);
	} catch(e) {
		console.log('Please Check your input!');
		console.log('Input a new folder/file:');
		return;
	}
	if(stat.isDirectory()) {
		parentDirectory = parentDirectory.replace(/([^\\/]$)/g, "$1\\");
		var files = fs.readdirSync(parentDirectory);
		files.forEach(function (val) {
			var stat = fs.statSync(parentDirectory + val);

			if (stat.isDirectory() && excludeList.indexOf(val) == -1) {
				getFileList(parentDirectory + val);
			} else {
				fileList.push({
					fileName: parentDirectory + val,
					fileType: path.extname(val)
				});
			}
		});
	} else {
		fileList.push({
			fileName: parentDirectory,
			fileType: path.extname(parentDirectory)
		});	
	}
}

function getAllPalgeLangData(srcdir, saveTo) {
	if (srcdir && typeof srcdir == 'string') {
		getFileList(srcdir);

		//add: check filelist empty
		if(fileList.length === 0) {
			console.log('No avalible file to pick text!');
			return;
		}
		//add: sort file by name
		fileList.sort(function(x, y) {
			return x.fileName.match(/\\(.*$)/)[1] - y.fileName.match(/\\(.*$)/)[1];
		})
		/*fileList.forEach(function(n,i) {
			console.log(n.fileName)
		});*/
		isFinished = false;
		fileList.forEach(function (val, idx) {
			if (val.fileType == ".js") {
				getResLangData(val.fileName, function (data) {
					//console.log(data);
					langArr = langArr.concat('\r\n/*---  ' + val.fileName + '  ---*/', data);
					isFinished = true;
				});
			} else if (val.fileType == ".htm" || val.fileType == ".html" || val.fileType == ".asp") {
				getPageLangData(val.fileName, function (data) {
					langArr = langArr.concat('\r\n/*---  ' + val.fileName + '  ---*/', data);
					isFinished = true;
				});
			} else if(idx === fileList.length - 1){
				
				//handle width nothing to pick
				isFinished = true;
			}
		});
		waitToWrite(saveTo);
	}
}


function waitToWrite(saveTo) {
	var t = setInterval(function () {
		if (isFinished) {
			writeFile(saveTo, B.unique(langArr).join("\r\n"));
			t = clearInterval(t);
			isFinished = false;
		}
	}, 1500);
}


//modify the arguments here
//getAllPalgeLangData("FileName", "OutPutFileName");
//getAllPalgeLangData("debug", "debug.json");
process.stdin.resume();
console.log('**Html text picker');
console.log('**Input like this:\n**FolderName|FileName[/OutPutFileName]');
process.stdin.on('data', function(chunk) {
	if(/\S/.test(chunk)) {
		var chunk = chunk.toString().trim().split('/'),
			input = chunk[0].trim(),
			output = (chunk[1] || input).trim();
		if(!/\.json/.test(output)) {
			 output += '.json';
		}
		getAllPalgeLangData(input, output);
		//process.stdout.write('waiting...\n');
	} else {
		process.stdout.write('No input!\n');
	}
});
process.stdin.on('end', function() {
	process.stdout.write('end');
});