const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.43.254:8080?user_uid=1');

ws.on('open', function open() {
	console.log("SOCKET IS OPENED");
});

ws.on('message', function incoming(data) {
  	console.log(data);
  	let obj = JSON.parse(data);
  	let type = obj['type'];
  	if (type == 'initialization') {
		ws.send(JSON.stringify({
			'type': 'download_youtube',
			'keyword': 'short nature video'
		}));
  	}
});
