var stopwatch = require('timer-stopwatch')
var doOneTime = 0
var ready = 0
function Player(socket,name){
	this.turn = false
	this.socket = socket
	this.name = name
	this.keys = []
	this.resKeys = []
}

function getTimer(players) {
	var timer = new stopwatch(10000,{refreshRateMS: 50})
	// timer
	timer.on('time', function(time) {
		for(var player of players)player.socket.emit('timer',Math.round(time.ms/1000))
	})
	timer.on('done',function(){
		if(doOneTime%2==0){
		}
		doOneTime++
	});
	return timer
}


function socketHandler(io) {

	var count = 0
	var firstPlayer
	var newPlayer



	var players = []
	function changeTurn() {
		for(var i=0;i<players.length;i++){
			if(players[i].turn==true){
				socket.emit('enableKey',true)
			}else{
				socket.emit('enableKey',false)
			}
		}
	}

	io.on('connection', function (socket) {

		socket.on('endTurn',function () {

			for(var i=0;i<players.length;i++){
			
				if(players[i].socket == socket){
					players[i].turn = false
					players[i].socket.emit('enableKey',false)
				}else{
					players[i].turn = true
					players[i].socket.emit('enableKey',true)
					players[i].socket.emit('keys',players[i==0? 1:0].keys)
				}
			}
		})

		socket.on('keypress',function (key) {
			for(var i=0;i<players.length;i++){
				if(players[i].socket==socket){
					players[i].keys.push(key)
				}
			}
		})

		socket.on('endRound', function (argument) {
			socket.emit('youGoAgain')
		})

		socket.on('ready',function () {
			ready++
			if(ready == 2 ){
				io.emit('pianoStart')
			}
		})

		socket.on('playerJoin', function (name) {

			newPlayer = new Player(socket,name)
			players.push(newPlayer)
			count++
			socket.emit('welcomeName',newPlayer.name)

			if(count==2) {
				io.emit('gameStart')
				firstPlayer=players[Math.floor(Math.random()*players.length)]
				for(var i=0;i<players.length;i++){
					if(players[i].socket==firstPlayer.socket){
						players[i].turn = true
						players[i].socket.emit('youFirst',"you start first")
					}else{
						players[i].socket.emit('oppoFirst',"your opponent starts first")
						players[i].turn = false
					}
				}
				var timer = getTimer(players)
				timer.start()
			}




		})


		socket.on('throwName', function () {

			for(var i=0 ; i<players.length ; i++){

				if(socket.id == players[i].socket.id){
					socket.emit('you',players[i].name)
				}else{
					socket.emit('oppo', players[i].name)
				}
			}





		})


	})


}
module.exports = socketHandler
