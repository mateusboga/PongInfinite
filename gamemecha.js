/*
	Game Mechanics
*/

var Upload;

(function(){
/*canvas*/ var C = $( "#MainCanvas" )[ 0 ], ctx = C.getContext("2d");
/*dimensions*/ var width = 800, height = 600;
/*paddle*/ var paddleX = 0, mouse = {};
	var ballX = width/2, ballY = 150, ballYSpeed = 2, ballXSpeed = 1;
	var score = 0, highscore = 0, prevscore = 0, scoreString = "Score: 0",highscoreString = "Highscore: 0";
	var light = false, auto = 0;
	var S_Poc = new Audio("sounds/poc.wav"), S_Puc = new Audio("sounds/puc.wav"), S_Puc1 = new Audio("sounds/pucR.wav"), S_Puc2 = new Audio("sounds/pucL.wav");

	if(typeof(Storage) != "undefined") {
		highscore = localStorage.getItem("playerhighscore");
		console.log("Scores loaded!");
		highscoreString = "Highscore: "+highscore;
	} else {
		console.log("Could not load scores!");
	}

	function getMousePos(C, evt) {
        var rect = C.getBoundingClientRect();
        return {X: evt.clientX - rect.left, Y: evt.clientY - rect.top}
      }

      C.addEventListener('mousemove', function(evt) {
        mouse = getMousePos(C, evt);
      }, false);

window.setInterval(function(){
	ballX += ballXSpeed; ballY += ballYSpeed;
	if (auto == 1){ paddleX = ballX  - 75; }
	
		if(ballY >= 505 && ballY <= 510){
			if(ballX >= paddleX-10 && ballX <= paddleX+160){
				ballYSpeed = -ballYSpeed;
				score++;scoreString = ""+score;light = true;
				if(ballYSpeed < 0){
					ballYSpeed--;
				}else{ballYSpeed++;}
				if(ballXSpeed < 0){
					ballXSpeed -= (Math.random()*3);
				}else{ballXSpeed += (Math.random()*3);}
				S_Poc.play();
			}
		}
		if(ballY <= 0){
			ballYSpeed = -ballYSpeed; S_Puc.play();
		}
		if(ballX >= (width)){
			ballXSpeed = -ballXSpeed; S_Puc1.play();
		}
		if(ballX <= 0){
			ballXSpeed = -ballXSpeed; S_Puc2.play();
		}
		if(ballY > height){
			ballX = width/2;
			ballY = 150;

			ballYSpeed = 2;
			ballXSpeed = (Math.random()*6)-3;
			prevscore = score;
			if(score > highscore){ highscore = score; highscoreString = "Highscore: "+highscore; }
			score = 0;scoreString = "Score: 0";
			if(typeof(Storage) != "undefined") {
				localStorage.setItem("playerhighscore", highscore);
			} else {
				console.log("Could not store!");
			}
		}
	
	
	ctx.clearRect(0, 0, width, height);
	
	if(auto != 1) { paddleX = mouse.X - 75; }
	ctx.fillStyle = "#2299DD";
	if(light == true){
		ctx.fillStyle = "#22EEFF";
		setTimeout(function(){light = false;},30)
	}
	ctx.fillRect(paddleX, 510, 150, 15);
	
	ctx.fillStyle = "#222";
	ctx.beginPath();
	ctx.arc(mouse.X, mouse.Y, 2, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = "#55DDFF";
	ctx.beginPath();
	ctx.arc(ballX, ballY, 8, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	
	ctx.font="15px Arial";
	ctx.fillText(highscoreString,50,50);
	ctx.fillStyle = "#33BBDD";
	ctx.fillText("Previous score: "+prevscore,50,70);
	ctx.font="20px Arial";
	ctx.fillText(scoreString,paddleX,500);
	
	
	
	Upload = function(){
		var Name = $('#Name').val();
		$.post('scores.js', { name: Name, score: highscore }, function(data) {
			$('#Board').html(data);
		});
		$('#Name').val('');
	};
	
}, 10);
})();