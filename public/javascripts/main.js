
var socket
var countKeyPress = 0
var piano = {

	initialize : function() {
		this.socketAction()
		this.pianoStartHandler()
	},
	keyAction : function () {
		$(document).keypress(function(event) {
			var keycode = (event.keyCode ? event.keyCode : event.which)
			$('.piano .press').each(function (key,value) {
				if(String.fromCharCode(event.keyCode) == $(value).text().toLowerCase()) {
					countKeyPress ++
					$(this).removeClass('white').addClass('activeKey').removeClass('press')
					socket.emit('keypress',event.keyCode)
					if(countKeyPress == 5) {
						$(document).off('keypress')
						socket.emit('endTurn')
		
					}

				}
			})
		})
	},
	socketAction : function () {
		// socket.on('enableKey',function (enable) {
		// 	if(enable){
		// 		piano.keyAction()
		// 	}
		// })
		socket.on('keys',function (keys) {
			$('.piano .press').each(function (key,value) {
				for(var i=0;i<keys.length; i++){
					if(String.fromCharCode(keys[i]) == $(value).text().toLowerCase()) {
						var that = this
						setTimeout(function () {
							$(that).removeClass('white').addClass('activeKey').removeClass('press')
						}, 1000*i);
					}
				}
			})
			setTimeout(function () {
				piano.keyAction()
			}, 6000);

		})
		socket.on('welcomeName', function (name) {
			$(".cover").text("Welcome "+name+". Let's wait for other clients to join...")

		})
		socket.on('gameStart',function () {
			socket.emit('throwName')
		})

		socket.on('you', function (name) {
			$(".yourName").text("You: "+name)
			$(".yourPoint").text("Point: ")
		})
		socket.on('oppo', function (name) {
			$(".oppoName").text("Opponent: "+name)
			$(".oppoPoint").text("Point: ")
		})
		socket.on('timer',function (time) {
			$('.time').text(time)
		})

		socket.on('youFirst', function (name) {
			$('.cover').hide()
			$(".random").show()
			$(".randomText").text(name)
			piano.keyAction()

		})

		socket.on('oppoFirst', function (name) {
			$('.cover').hide()
			$(".random").show()
			$(".randomText").text(name)

		})
		socket.on('pianoStart',function () {
			$('.random').hide()
		})
	},
	pianoStartHandler : function () {
		$(document).on('click','#start',function () {
			socket.emit('ready')
		})
	}
}

var welcome = {

	initialize : function () {

		this.setUpHandler()

	},

	setUpHandler : function () {

		$('#join').click(function () {
			socket = io.connect('http://localhost:3000')
			socket.emit('playerJoin',$("#name").val())
			$('#main-container').load('piano',function () {
				piano.initialize()
			})

		})
	}
}

welcome.initialize()
