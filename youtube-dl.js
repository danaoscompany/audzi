var spawn = require('child_process').spawn;
var cmd = './youtube-dl';
var args = [
    '--get-url', 
    'https://www.youtube.com/watch?v=668nUCeBHyY'
];
var proc = spawn(cmd, args);
proc.stdout.on('data', function(data) {
    console.log("STDOUT = "+data);
});
proc.on('close', function() {
    console.log('finished');
});
