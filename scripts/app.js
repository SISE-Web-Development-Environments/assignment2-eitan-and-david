var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var AC_moveUp;
var AC_moveDown;
var AC_moveRight;
var AC_moveLeft;
var AC_monsterNumber = 1;
var AC_ballsNumber;
var AC_ball_5;
var AC_ball_15;
var AC_ball_25;
var AC_timeout;

var controls = {
	left: undefined,
	right: undefined,
	up: undefined,
	down: undefined
};

const usersDB =[];

var signedIn = false;

$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
});

function Start() {
	board = new Array();
	score = 0;	
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
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
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
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
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
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
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
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
var moveUp;
var moveDown;
var moveRight;
var moveLeft;
var monsterNumber = 1;
var ballsNumber;
var ball_5;
var ball_15;
var ball_25;
var timeout;

function test(e,id) {
	e.preventDefault();
	let newKey = this.addEventListener("keypress", keyUpdateListener);
	switch (id) {
		case "buttonU":
			moveUp = newKey;
			break;
		case "buttonL":
			moveLeft = newKey;
			break;
		case "buttonD":
			moveDown = newKey;
			break;
		case "buttonR":
			moveRight = newKey;
			break;
	}
}

let keyUpdateListener = function (event) {
	removeUpdateListener();
	return event.keyCode;
};

function removeUpdateListener(){
	this.removeEventListener("keypress", keyUpdateListener);
}

function copyData(element, target) {
	document.getElementById(target).textContent = element.value;
}

function setBalls() {
	ballsNumber = document.getElementById('range').value;
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
	if (!((ball_5 !== ball_15) && (ball_15 !== ball_25) && (ball_5 !== ball_25)))
		return false;
	if(!((moveRight !== moveDown) && (moveRight !== moveLeft) && (moveRight !== moveUp)
		&& (moveDown !== moveLeft) && (moveDown !== moveUp) && (moveLeft !== moveUp)))
		return false;
	if(!isRandom){
		setBalls();
		setLength();
	}
	commitChanges();
	return true;
}
// SETTINGS