var spawn = require('child_process').spawn;
var cmd = './ffmpeg';
var args = [
    '-i', 
    'video.mp4',
    '-y',
    'video.mkv'
];
var proc = spawn(cmd, args);
proc.stdout.on('data', function(data) {
    console.log("STDOUT = "+data);
});
proc.stderr.setEncoding("utf8")
proc.stderr.on('data', function(data) {
    console.log("STDERR = "+data);
});
proc.on('close', function() {
    console.log('finished');
});
