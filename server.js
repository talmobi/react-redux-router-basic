var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

// api here

// route all unmatched to root (single page app)
app.use('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
});

var port = process.env.port || 3000;
server.listen(port, function () {
  console.log("listening on port: %s", port);
});
