$(function() {

	var COLORS = [
	    '#e21400', '#91580f', '#f8a700', '#f78b00',
	    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
	    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  	];

  	var UserWatchObj = {};
	// jQuery获取组件名字
	var $window = $(window);
	// 展示区
	var $showArea = $('.slides');
	// 输入区域
	var $inputMessage = $('.inputMessage');
	// 聊天区
	var $messages = $('.messages');
	// 开始展示按钮
	var $presIdInput = $('.presIdInput');
	var $startWatchBtn = $('.startWatchBtn');

	$startWatchBtn.click(startWatch);


	/**
	 * 标志是否连接到聊天室
	 * @name connected
	 * @type {boolean}
	 */
	var connected = false;

	/** 
	 * 绑定所有socket事件
	 * @param socket - socket实例
	 */
	function setupSocket(socket) {

		/**
		 * socket接收到'slide change'时, Ajax获取最新json文件
		 * 解析并切换客户端slides
		 * @function
		 * @name onSlideChange
		 */
		socket.on('slide change', function() {
			$.get('/ajax/slide-watch', {
					command: 'newstate',
					presId: UserWatchObj.presId
				}, function(res) {
					if (res.success != 1) {
						// 获取最新展示状态错误
						alert('获取最新展示状态失败');
					}
					else {
						var newState = res.data.state;
						console.log(newState);
						if (newState)
							Reveal.setState(JSON.parse(newState));
					}

				});
		});

		/**
		 * socket接收到'show end'时, 通知用户展示已结束	
		 * @function
		 * @name onShowEnd
		 * @todo 告诉用户展示完毕
		 */
		socket.on('show end', function() {
			alert('show end');
		});

		/**
		 * socket接收到'login'时, 通知用户已加入聊天室	
		 * @function
		 * @name onLogin
		 * @todo 展示欢迎信息
		 */
		socket.on('login', function(data) {
			connected = true;
			var message = "Welcome to the chat room!";
			addLog(message);
		});

		/**
		 * socket接收到'show end'时, 通知用户展示已结束	
		 * @function
		 * @name onShowEnd
		 */
		socket.on('new message', function(data) {
			addChatMessage(data.username, data.message);
		});

		/**
		 * socket接收到'user joined'时, 通知其他用户某用户已加入	
		 * @function
		 * @name onUserJoined
		 */
		socket.on('user joined', function(data) {
			var message = data.username + " join the chat room.";
			addLog(message);
		});

		/**
		 * socket接收到'user left'时, 通知其他用户某用户已退出	
		 * @function
		 * @name onUserLeft
		 */
		socket.on('user left', function(data) {
			var message = data.username + " left the chat room.";
			addLog(message);
		});

		/**
		 * 将特定用户的发言显示进聊天区
		 * @name addChatMessage
		 * @function
		 * @param {string} username - 发言用户名
		 * @param {string} message - 发言内容
		 */
		function addChatMessage(username, message) {
			var $usernameDiv = $('<span class="username" />')
				.text(username)
				.css('color', getUsernameColor(username));
			var $messageBodyDiv = $('<span class="messageBody">')
	      		.text(message);
	      	var $messageDiv = $('<li class="message"/>')
	      			.data('username', username)
	      			.append($usernameDiv, $messageBodyDiv);
	      	$messages.append($messageDiv);
	      	// scroll to bottom
	      	$messages[0].scrollTop = $messages[0].scrollHeight;
		};

		/**
		 * 将特定日志加到聊天区
		 * @name addChatMessage
		 * @function
		 * @param {string} message - 日志内容
		 */
		function addLog(message) {
			var $messageDiv = $('<li>').addClass('log').text(message);
			$messages.append($messageDiv);
	      	$messages[0].scrollTop = $messages[0].scrollHeight;
		};

		/**
		 * 键盘事件
		 */
		$window.keydown(function (event) {
		    // Auto-focus the current input when a key is typed
		    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
		      $inputMessage.focus();
		    }
		    // When the client hits ENTER on their keyboard
		    if (event.which === 13) {
		        sendMessage();
		    }
		});

		/**
		 * 发送消息
		 * @name sendMessage
		 * @function
		 */
		function sendMessage() {
			var message = $inputMessage.val();
			// 防止markup被injected
			message = cleanInput(message);
			if (message && connected) {
				$inputMessage.val('');
				// 发送给服务器
				socket.emit('new message', message);
			}
		};


		/**
		 * 防止markup injected
		 * @name cleanInput
		 * @function
		 */
		function cleanInput (input) {
	    	return $('<div/>').text(input).text();
	  	};


	  	/**
	  	 * 计算某个用户名的颜色
	  	 * @name getUsernameColor
		 * @function
		 * @param {string} username - 用户名
	  	 */
	  	function getUsernameColor (username) {
	    	// Compute hash code
	    	var hash = 7;
	    	for (var i = 0; i < username.length; i++) {
	       		hash = username.charCodeAt(i) + (hash << 5) - hash;
	    	}
	    	// Calculate color
	    	var index = Math.abs(hash % COLORS.length);
	    	return COLORS[index];
	  	}
  }
});