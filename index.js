var spawn = require('child_process').spawn;
const http = require('http');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const moment = require('moment');
const clients = {};

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  console.log("REQUEST URL: "+req.url);
  let url = req.url;
  let params = url.substring(url.indexOf("?")+1, url.length);
  let userUID = params.split("&")[0].split("=")[1];
  clients[userUID] = ws;
  console.log("USER ID: "+userUID);
  ws.on('message', function incoming(message) {
    console.log('received from client: %s', message);
    var data = JSON.parse(message);
    var type = data['type'];
    console.log("Message type: "+type);
    if (type == "download_youtube") {
    	let keyword = data['keyword'];
    	console.log("Keyword: "+keyword);
		var proc = spawn("./youtube-dl", [
			"--extract-audio",
			"--audio-format",
			"mp3",
			"--get-url",
			"ytsearch1:"+keyword
		]);
		proc.stdout.on('data', function(data) {
			let output = data.toString();
			//console.log("Get youtube download url output: "+output);
			let downloadLinks = [];
			if (output.includes("\n")) {
				downloadLinks = output.split("\n");
			}
			if (downloadLinks.length > 0) {
				let downloadLink = downloadLinks[0];
				console.log("Downloading url: "+downloadLink);
				clients[userUID].send(JSON.stringify({
	  				'type': 'download_url',
	  				'download_url': downloadLink
				}));
				/*sendMessage(userUID, "Downloading url: "+downloadLink);
  				let input = "input-"+userUID+"-"+moment(new Date()).format('YYYYMMDDHHmmss');
  				let output = "output-"+userUID+"-"+moment(new Date()).format('YYYYMMDDHHmmss')+".mp3";
				const file = fs.createWriteStream(input);
				const request = https.get(downloadLink, function(response) {
  					response.pipe(file);
  					console.log("Downloading complete");
  					sendMessage(userUID, "Downloading complete");
  					var proc = spawn('./ffmpeg', ['-i', input, '-y', output]);
  					proc.stderr.setEncoding("utf8");
					proc.stderr.on('data', function(data) {
						console.log("FFMPEG OUTPUT: "+data);
						sendMessage(userUID, "FFMPEG OUTPUT: "+data);
					});
					proc.on('close', function() {
    					console.log('Conversion finished');
    					sendMessage(userUID, "Conversion complete");
					});
				});*/
			}
		});
		proc.on('close', function() {
    		console.log('Download finished');
    		//sendMessage(userUID, "Download finished");
		});
    }
  });
  ws.send(JSON.stringify({
  	'type': 'initialization',
  	'user_uid': userUID
  }));
});

function sendMessage(to, message) {
	clients[to].send(JSON.stringify({
	  	'type': 'message',
	  	'message': message
	}));
}
