// canvas content
var context;
// PacMan
var shape = new Object();
// 10*10 array
var pacmen_life = 5;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var monster1_interval;
var monster2_interval;
var monster3_interval;
var monster4_interval;
var monster1_image = new Image();
var monster2_image = new Image();
var monster3_image = new Image();
var monster4_image = new Image();
monster1_image.src = "./resources/blueGhost.png";
monster2_image.src = "./resources/yellowGhost.png";
monster3_image.src = "./resources/redGhost.png";
monster4_image.src = "./resources/greenGhost.png";
var monster1 = new Object();
var monster2 = new Object();
var monster3 = new Object();
var monster4 = new Object();
// Settings Parameters
var AC_moveUp = 38; //
var AC_moveDown = 40; //
var AC_moveRight = 39; //
var AC_moveLeft = 37; //
var AC_monsterNumber = 1;
var AC_ballsNumber = 50;
var AC_ball_5 = "#ffd737";
var AC_ball_15 = "#8340ff";
var AC_ball_25 = "#34ff1d";
var AC_timeout = 60;
var scoreToWin = 75;
// Settings Parameters
const usersDB =[];
var admin = {userName:"p",password:"p"};
usersDB.push(admin);
var controls = {
	left: undefined,
	right: undefined,
	up: undefined,
	down: undefined
};



var signedIn = false;



$(document).ready(function() {
	context = canvas.getContext("2d");
});

function Start() {
	board = new Array();
	score = 0;	
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = parseInt(AC_ballsNumber);
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i === 3 && j === 3) ||
				(i === 3 && j === 4) ||
				(i === 3 && j === 5) ||
				(i === 6 && j === 1) ||
				(i === 6 && j === 2)
			) {
				// put walls
				board[i][j] = 4; // Wall = 4
			}else if ((i === 0 && j === 0) ||
				(i === 9 && j === 9) ||
				(i === 9 && j === 0) ||
				(i === 0 && j === 9)) {
				monster1.i = 9;
				monster1.j = 9;
				if (AC_monsterNumber == 2){
					monster2.i = 0;
					monster2.j = 0;
				}else if (AC_monsterNumber == 3){
					monster2.i = 0;
					monster2.j = 0;
					monster3.i = 0;
					monster3.j = 9;
				}else{
					monster2.i = 0;
					monster2.j = 0;
					monster3.i = 0;
					monster3.j = 9;
					monster4.i = 9;
					monster4.j = 0;
				}
			}
			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					var food_randomNum = Math.random();
					if (food_randomNum <=0.6){
						board[i][j] = 6;
					}else if (food_randomNum>0.6 && food_randomNum<=0.9){
						board[i][j] = 3;
					}else{
						board[i][j] = 1;
					}
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2; // PacMan = 2
				} else {
					board[i][j] = 0; // Empty = 0
				}
				cnt--;
			}
		}
	}
	// place all food
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	if(pacman_remain == 1){
		var packman_emptyCell = findRandomEmptyCell(board);
		board[packman_emptyCell[0]][packman_emptyCell[1]] = 2;
		shape.i = packman_emptyCell[0];
		shape.j = packman_emptyCell[1];
		pacman_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
	monster1_interval = setInterval(updatePositionMonster,600);
	if (AC_monsterNumber == 2){
		monster2_interval = setInterval(updatePositionMonster,600);
	}else if (AC_monsterNumber == 3){
		monster2_interval = setInterval(updatePositionMonster,600);
		monster3_interval = setInterval(updatePositionMonster,600);
	}else{
		monster2_interval = setInterval(updatePositionMonster,600);
		monster3_interval = setInterval(updatePositionMonster,600);
		monster4_interval = setInterval(updatePositionMonster,600);
	}
}

function updatePositionMonster(){

}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[AC_moveUp]) {
		return 1;
	}
	if (keysDown[AC_moveDown]) {
		return 2;
	}
	if (keysDown[AC_moveLeft]) {
		return 3;
	}
	if (keysDown[AC_moveRight]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			//monsters
			var m_center1 = new Object();

			var m_center2 = new Object();

			var m_center3 = new Object();

			var m_center4 = new Object();

			m_center1.x = monster1.i * 60 + 30;
			m_center1.y = monster1.j * 60 + 30;

			m_center2.x = monster2.i * 60 + 30;
			m_center2.y = monster2.j * 60 + 30;

			m_center3.x = monster3.i * 60 + 30;
			m_center3.y = monster3.j * 60 + 30;

			m_center4.x = monster4.i * 60 + 30;
			m_center4.y = monster4.j * 60 + 30;


			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = AC_ball_25; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}else if (board[i][j] == 3) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = AC_ball_15; //color
				context.fill();
			}else if (board[i][j] == 6) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = AC_ball_5; //color
				context.fill();
			}
		}
	}
}

function gameOver() {
	if (time_elapsed > AC_timeout){
		if (score > scoreToWin){
			alert("Winner!!!");
		}else{
			alert("You are better then " + score + " points!");
		}
	}else if(pacmen_life === 0){
		alert("loser!");
	}else{
		alert("Winner!!!");
	}
	window.clearInterval(interval);
	window.clearInterval(monster1_interval);
	window.clearInterval(monster1_interval);
	window.clearInterval(monster1_interval);
	window.clearInterval(monster1_interval);
	var result = confirm("you are brave enough to play again?");
	if (result === true){
		Start();
	}else{
		alert("hope you enjoyed our game! see you soon :)");
		currentPage.setPageName("Welcome");
		changeDiv();
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score = score + 25;
	}else if(board[shape.i][shape.j] == 3){
		score = score + 15;
	}else{
		if (board[shape.i][shape.j] == 6){
			score = score + 5;
		}
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if(time_elapsed > AC_timeout){
		gameOver();
	}
	if (score >= 50 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score > scoreToWin) {
		gameOver();
	} else {
		Draw();
	}
}

var currentPage = {
	newPageName: "Welcome",
	oldPageName: undefined,
	setPageName: function(newName) {
		if (newName === "registerView"){
			document.getElementById("registerForm").reset();
			$("#password_error_message").hide();
			$("#email_error_message").hide();
			$("#fname_error_message").hide();
			$("#lname_error_message").hide();
		}
		if(newName === "loginView"){
			document.getElementById("loginForm").reset();
		}
		if (this.newPageName === "gameView"){
			window.clearInterval(interval);
			window.clearInterval(monster1_interval);
			window.clearInterval(monster1_interval);
			window.clearInterval(monster1_interval);
			window.clearInterval(monster1_interval);
		}
		this.oldPageName = this.newPageName;
		this.newPageName = newName;
	}
};

var currentUser = {
	userName: undefined,
	setUserName: function(NewUserName){
		this.userName = NewUserName;
	}
};

function changeDiv(){
	document.getElementById(currentPage.oldPageName).hidden = true;
	document.getElementById(currentPage.newPageName).hidden = false;

}

$(function() {

	$("#password_error_message").hide();
	$("#email_error_message").hide();
	$("#fname_error_message").hide();
	$("#lname_error_message").hide();
	var error_password = false;
	var error_email = false;
	var error_lname = false;
	var error_fname = false;



	function check_password() {
		var letters = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/i;
		var password = $("#form_password").val();
		var result =   letters.test(password);
		var password_length = $("#form_password").val().length;
		if(password_length < 6) {
			$("#password_error_message").html("At least 8 characters");
			$("#password_error_message").show();
			error_password = true;
		}else if(!result){
			$("#password_error_message").html("must contain only letters and numbers");
			$("#password_error_message").show();
			error_password = true;
		}
		else {
			$("#password_error_message").hide();
		}
	}

	function fname_check(){
		var result = undefined;
		if(!/^[a-zA-Z\s]+$/.test($('#form_fName').val()))
		{
			$("#fname_error_message").html("must contain only letters");
			$("#fname_error_message").show();
			error_fname = true;
		}else{
			$("#fname_error_message").hide();
		}
	}

	function lname_check(){
		var result = undefined;
		if(!/^[a-zA-Z\s]+$/.test($('#form_lName').val()))
		{
			$("#lname_error_message").html("must contain only letters");
			$("#lname_error_message").show();
			error_lname = true;
		}else{
			$("#lname_error_message").hide();
		}
	}

	function check_email() {
		var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
		if(pattern.test($("#form_email").val())) {
			$("#email_error_message").hide();
		} else {
			$("#email_error_message").html("Invalid email address");
			$("#email_error_message").show();
			error_email = true;
		}

	}

	$("#registerForm").submit(function(e) {
		error_password = false;
		error_email = false;
		error_lname = false;
		error_fname = false;
		fname_check();
		lname_check();
		check_password();
		check_email();
		if(error_password == false && error_email == false && error_lname == false && error_fname == false) {
			var password = document.getElementById("form_password").value;
			var username = document.getElementById("form_username").value;
			var player = {userName:username,password:password};
			var userExist = false;
			usersDB.forEach(element=>{
				if(element.userName === username){
					userExist = true;
				}
			});
			if(userExist){
				alert("There is already user with the same username");
				e.preventDefault();

			}else{
				usersDB.push(player);;
				alert("Registered successfully!!");
				e.preventDefault();
				currentPage.setPageName("Welcome");
				changeDiv();
			}
		} else {
			return false;
		}

	});

	});

	$(function(){
		$("#loginForm").submit(function(e){
			var password = document.getElementById("loginForm_password").value;
			var username = document.getElementById("loginForm_username").value;
			var userExist = false;
			alert(usersDB.length);
			usersDB.forEach(element=>{
				if(element.userName === username && element.password === password){
					userExist = true;
					currentUser.setUserName(element.userName);
				}
			});
			if(userExist){
				alert("Signed in successfully!!");
				e.preventDefault();
				currentPage.setPageName("Welcome");
				changeDiv();
				signedIn = true;
				document.getElementById("logout").hidden = false;
				document.getElementById("logIn").hidden = true;
				document.getElementById("register").hidden = true;
			}else{
				alert("Incorrect user or password");
				e.preventDefault();
			}
		});
	});
	

	function logOut(){
		document.getElementById("logout").hidden = true;
		document.getElementById("logIn").hidden = false;
		document.getElementById("register").hidden = false;
		signedIn = false;
		currentPage.setPageName("Welcome");
		changeDiv();
	}

// SETTINGS
var moveRight = 39;
var moveDown = 40;
var moveLeft = 37;
var moveUp = 38;
var monsterNumber = 1;
var ballsNumber;
var ball_5 = "A33643";
var ball_15 = "256E5C";
var ball_25 = "F4A000";
var timeout;

function copyData(element, target) {
	document.getElementById(target).textContent = element.value;
}

function setBalls() {
	ballsNumber = parseInt(document.getElementById('range').value);
}

function setLength() {
	timeout = document.getElementById('gameLength').value;
}

function setColor(id){
	switch (id) {
		case 1:
			ball_5 = document.getElementById('5pts').value;
			break;
		case 2:
			ball_15 = document.getElementById('15pts').value;
			break;
		case 3:
			ball_25 = document.getElementById('25pts').value;
			break;
	}
}

function moreMonsters(e){
	e.preventDefault();
	if(monsterNumber < 4)
		monsterNumber++;
	console.log(monsterNumber)
}

function lessMonsters(e){
	e.preventDefault();
	if(monsterNumber > 1)
		monsterNumber--;
	console.log(monsterNumber)
}

function randomSettings(e){
	e.preventDefault();
	moveRight = 39;
	moveDown = 40;
	moveLeft = 37;
	moveUp = 38;
	ballsNumber = Math.floor(Math.random()*40 + 50);
	monsterNumber = Math.floor(Math.random()*3 + 1);
	timeout = Math.floor(Math.random()*240 + 60);
	do{
		ball_5 = Math.floor(Math.random()*16777215).toString(16);
		ball_15 = Math.floor(Math.random()*16777215).toString(16);
		ball_25 = Math.floor(Math.random()*16777215).toString(16);
	}while (!settingsConfirm(null,true))
}

function commitChanges() {
	AC_ball_5 = ball_5;
	AC_ball_15 = ball_15;
	AC_ball_25 = ball_25;
	AC_ballsNumber = ballsNumber;
	AC_monsterNumber = monsterNumber;
	AC_moveDown = moveDown;
	AC_moveUp = moveUp;
	AC_moveRight = moveRight;
	AC_moveLeft = moveLeft;
	AC_timeout = timeout;
}

function settingsConfirm(e, isRandom){
	if (e != null)
		e.preventDefault();
	if (!((ball_5 !== ball_15) && (ball_15 !== ball_25) && (ball_5 !== ball_25))){
		if(!isRandom) alert("Balls colors have to be different");
		return false;
	}
	if(!((moveRight !== moveDown) && (moveRight !== moveLeft) && (moveRight !== moveUp)
		&& (moveDown !== moveLeft) && (moveDown !== moveUp) && (moveLeft !== moveUp))){
		if(!isRandom) alert("Movement keys have to be different");
		return false;
	}
	if(!isRandom){
		setBalls();
		setLength();
	}
	commitChanges();
	alert("Changes Updated Successfully!");
	currentPage.setPageName("Welcome");
	changeDiv();
	return true;
}

function test(code,id) {
	switch (id) {
		case "buttonU":
			moveUp = code;
			break;
		case "buttonL":
			moveLeft = code;
			break;
		case "buttonD":
			moveDown = code;
			break;
		case "buttonR":
			moveRight = code;
			break;
	}
}
// SETTINGS