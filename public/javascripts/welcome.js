

var socket = io.connect('http://localhost:3000')
socket.on('connection',function (socket) {
	console.log(socket.id,'is connected')
})