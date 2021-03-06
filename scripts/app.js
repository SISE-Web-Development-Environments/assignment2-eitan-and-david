// canvas content
var context;
// PacMan
var shape = new Object();
// 10*10 array
var eaten = false;
var special_eaten = false;
var beginningSong = new Audio("./resources/sound/pacman_beginning.mp3");
var chompSong = new Audio("./resources/sound/pacman_chomp.mp3");
var deathSong = new Audio("./resources/sound/pacman_death.mp3");
var gameOverSong = new Audio("./resources/sound/pacman_gameover.mp3");
var winSong = new Audio("./resources/sound/pacman_win.mp3");
var extraLifeSong = new Audio("./resources/sound/pacman_eatfruit.mp3");
beginningSong.loop = false;
var extraLifeCell;
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
var specialPts_interval;
var monster1_image = new Image();
var pacman_image = new Image();
var pacman_greenImageU = new Image();
var pacman_imageU = new Image();
var pacman_greenImageD = new Image();
var pacman_imageD = new Image();
var pacman_greenImageL = new Image();
var pacman_imageL = new Image();
var pacman_greenImageR = new Image();
var pacman_imageR = new Image();
var monster2_image = new Image();
var monster3_image = new Image();
var monster4_image = new Image();
var extraLife_image = new Image();
var extraPoints_image = new Image();
var wall = new Image();
wall.src = "./resources/wall.png";
var pacman_image_direction = 0;
extraLife_image.src = "./resources/extraLife.png";
monster1_image.src = "./resources/monster/blueGhost.png";
monster2_image.src = "./resources/monster/yellowGhost.png";
monster3_image.src = "./resources/monster/redGhost.png";
monster4_image.src = "./resources/monster/greenGhost.png";
pacman_imageR.src = "./resources/player/player.png";
pacman_greenImageR.src = "./resources/player/greenPlayer.png";
pacman_imageL.src = "./resources/player/playerL.png";
pacman_greenImageL.src = "./resources/player/greenPlayerL.png";
pacman_imageD.src = "./resources/player/playerD.png";
pacman_greenImageD.src = "./resources/player/greenPlayerD.png";
pacman_imageU.src = "./resources/player/playerU.png";
pacman_greenImageU.src = "./resources/player/greenPlayerU.png";
extraPoints_image.src = "./resources/movingPoints.png";
pacman_image = pacman_imageR;
var green = false;
//monsters objects
var monster1 = new Object();
var monster2 = new Object();
var monster3 = new Object();
var monster4 = new Object();
//special objects
var extraLife = new Object();
var specialPts = new Object();
// Settings Parameters
var AC_moveUp = 38; //
var AC_moveDown = 40; //
var AC_moveRight = 39; //
var AC_moveLeft = 37; //
var AC_monsterNumber = 1;
var AC_ballsNumber = 50;
var AC_ball_5 = "#377d43";
var AC_ball_15 = "#3f657d";
var AC_ball_25 = "#7d5d65";
var AC_timeout = 60;
var scoreToWin = 300;
var newGame = true;
var food_remain;
var AC_food_remain;
// Settings Parameters
const usersDB = [];
var admin = {userName: "p", password: "p"};
usersDB.push(admin);
var signedIn = false;

$(document).ready(function () {
    context = canvas.getContext("2d");
});

function Start() {
    beginningSong.play();
    board = new Array();
    if (newGame) {
        score = 0;
        pacmen_life = 5;
        AC_ballsNumber = document.getElementById("range").value;
        green = false;
        newGame = false;
        special_eaten = false;
    }
    pac_color = "yellow";
    var cnt = 100;
    food_remain = parseInt(AC_ballsNumber);
    var pacman_remain = 1;
    start_time = new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if (
                (i === 2 && j === 3) ||
                (i === 2 && j === 4) ||
                (i === 2 && j === 5) ||
                (i === 6 && j === 4) ||
                (i === 7 && j === 4)
            ) {
                // put walls
                board[i][j] = 4; // Wall = 4
            } else if ((i === 0 && j === 0) ||
                (i === 9 && j === 9) ||
                (i === 9 && j === 0) ||
                (i === 0 && j === 9)) {
                monster1.i = 9;
                monster1.j = 9;
                if (AC_monsterNumber === 2) {
                    monster2.i = 0;
                    monster2.j = 0;
                } else if (AC_monsterNumber === 3) {
                    monster2.i = 0;
                    monster2.j = 0;
                    monster3.i = 0;
                    monster3.j = 9;
                } else if (AC_monsterNumber === 4) {
                    monster2.i = 0;
                    monster2.j = 0;
                    monster3.i = 0;
                    monster3.j = 9;
                    monster4.i = 9;
                    monster4.j = 0;
                }
            } else {
                var randomNum = Math.random();
                if (randomNum <= (1.0 * food_remain) / cnt) {
                    food_remain--;
                    var food_randomNum = Math.random();
                    if (food_randomNum <= 0.6) {
                        board[i][j] = 6;
                    } else if (food_randomNum > 0.6 && food_randomNum <= 0.9) {
                        board[i][j] = 3;
                    } else {
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
    if (pacman_remain == 1) {
        var packman_emptyCell = findRandomEmptyCell(board);
        board[packman_emptyCell[0]][packman_emptyCell[1]] = 2;
        shape.i = packman_emptyCell[0];
        shape.j = packman_emptyCell[1];
        pacman_remain--;
    }

    extraLifeCell = findRandomEmptyCell(board);

    keysDown = {};
    addEventListener(
        "keydown",
        function (e) {
            keysDown[e.keyCode] = true;
        },
        false
    );
    addEventListener(
        "keyup",
        function (e) {
            keysDown[e.keyCode] = false;
        },
        false
    );
    interval = setInterval(UpdatePosition, 200);
    monster1_interval = setInterval(updatePositionMonster1, 500);
    if (AC_monsterNumber == 2) {
        monster2_interval = setInterval(updatePositionMonster2, 500);
    } else if (AC_monsterNumber == 3) {
        monster2_interval = setInterval(updatePositionMonster2, 500);
        monster3_interval = setInterval(updatePositionMonster3, 500);
    } else if (AC_monsterNumber == 4) {
        monster2_interval = setInterval(updatePositionMonster2, 500);
        monster3_interval = setInterval(updatePositionMonster3, 500);
        monster4_interval = setInterval(updatePositionMonster4, 500);
    }
    var emptyCell = findRandomEmptyCell(board);
    specialPts.i = emptyCell[0];
    specialPts.j = emptyCell[1];
    specialPts_interval = setInterval(update_50pts_Position, 1050);
}

function boom() {
    chompSong.pause();
    beginningSong.pause();
    deathSong.play();
    if (pacmen_life > 0)
        document.getElementById("life" + pacmen_life).hidden = true;
    pacmen_life--;
    window.clearInterval(interval);
    window.clearInterval(specialPts_interval);
    window.clearInterval(monster1_interval);
    window.clearInterval(monster2_interval);
    window.clearInterval(monster3_interval);
    window.clearInterval(monster4_interval);
    score = score - 10;
    if (pacmen_life === 0) {
        gameOver();
    } else {
        // window.alert("hit!");
        $('#hit').modal('show');
        setTimeout(function () {
            $('#hit').modal('hide');
        }, 1000);
        Start();
    }
}

function updatePositionMonster1() {
    var delta_y = shape.i - monster1.i;
    var delta_x = shape.j - monster1.j;
    if (Math.abs(delta_x) > Math.abs(delta_y)) {
        if (delta_x > 0) {
            if ((monster1.j < 9) && board[monster1.i][monster1.j + 1] !== 4) {
                monster1.j++;
            } else if ((monster1.i < 9) && board[monster1.i + 1][monster1.j] !== 4) {// pass wall - down
                monster1.i++;
            }
        } else {
            if ((monster1.j > 0) && board[monster1.i][monster1.j - 1] !== 4) {
                monster1.j--;
            } else if ((monster1.i < 9) && board[monster1.i + 1][monster1.j] !== 4) {// pass wall - down
                monster1.i++;
            }
        }
    } else {
        if (delta_y > 0) {
            if ((monster1.i < 9) && board[monster1.i + 1][monster1.j] !== 4) {
                monster1.i++;
            } else if ((monster1.j > 0) && board[monster1.i][monster1.j - 1] !== 4) {// pass wall - right
                monster1.j--;
            }
        } else {
            if ((monster1.i > 0) && board[monster1.i - 1][monster1.j] !== 4) {
                monster1.i--;
            } else if ((monster1.j > 0) && board[monster1.i][monster1.j - 1] !== 4) {// pass wall - right
                monster1.j--;
            }
        }
    }
    if (monster1.i === shape.i && monster1.j === shape.j) {
        boom();
    } else {
        Draw();
    }
}

function updatePositionMonster2() {
    var delta_y = shape.i - monster2.i;
    var delta_x = shape.j - monster2.j;
    if (Math.abs(delta_x) > Math.abs(delta_y)) {
        if (delta_x > 0) {
            if ((monster2.j < 9) && board[monster2.i][monster2.j + 1] !== 4) {
                monster2.j++;
            } else if ((monster2.i < 9) && board[monster2.i + 1][monster2.j] !== 4) {// pass wall - down
                monster2.i++;
            } else {// pass wall - up
                monster2.i--;
            }
        } else {
            if ((monster2.j > 0) && board[monster2.i][monster2.j - 1] !== 4) {
                monster2.j--;
            } else if ((monster2.i < 9) && board[monster2.i + 1][monster2.j] !== 4) {// pass wall - down
                monster2.i++;
            } else {// pass wall - up
                monster2.j--;
            }
        }
    } else {
        if (delta_y > 0) {
            if ((monster2.i < 9) && board[monster2.i + 1][monster2.j] !== 4) {
                monster2.i++;
            } else if ((monster2.j < 9) && board[monster2.i][monster2.j + 1] !== 4) {// pass wall - right
                monster2.j++;
            } else {// pass wall - left
                monster2.j++;
            }
        } else {
            if ((monster2.i > 0) && board[monster2.i - 1][monster2.j] !== 4) {
                monster2.i--;
            } else if ((monster2.j < 9) && board[monster2.i][monster2.j + 1] !== 4) {// pass wall - right
                monster2.j++;
            } else {// pass wall - left
                monster2.j++;
            }
        }
    }
    if (monster2.i === shape.i && monster2.j === shape.j) {
        boom();
    } else {
        Draw();
    }
}

function updatePositionMonster3() {
    var delta_y = shape.i - monster3.i;
    var delta_x = shape.j - monster3.j;
    if (Math.abs(delta_x) > Math.abs(delta_y)) {
        if (delta_x > 0) {
            if ((monster3.j < 9) && board[monster3.i][monster3.j + 1] !== 4) {
                monster3.j++;
            } else if ((monster3.i < 9) && board[monster3.i + 1][monster3.j] !== 4) {// pass wall - down
                monster3.i++;
            } else {// pass wall - up
                monster3.i--;
            }
        } else {
            if ((monster3.j > 0) && board[monster3.i][monster3.j - 1] !== 4) {
                monster3.j--;
            } else if ((monster3.i < 9) && board[monster3.i + 1][monster3.j] !== 4) {// pass wall - down
                monster3.i++;
            } else {// pass wall - up
                monster3.j--;
            }
        }
    } else {
        if (delta_y > 0) {
            if ((monster3.i < 9) && board[monster3.i + 1][monster3.j] !== 4) {
                monster3.i++;
            } else if ((monster3.j < 9) && board[monster3.i][monster3.j + 1] !== 4) {// pass wall - right
                monster3.j++;
            } else {// pass wall - left
                monster3.j++;
            }
        } else {
            if ((monster3.i > 0) && board[monster3.i - 1][monster3.j] !== 4) {
                monster3.i--;
            } else if ((monster3.j < 9) && board[monster3.i][monster3.j + 1] !== 4) {// pass wall - right
                monster3.j++;
            } else {// pass wall - left
                monster3.j++;
            }
        }
    }
    if (monster3.i === shape.i && monster3.j === shape.j) {
        boom();
    } else {
        Draw();
    }
}

function updatePositionMonster4() {
    var delta_y = shape.i - monster4.i;
    var delta_x = shape.j - monster4.j;
    if (Math.abs(delta_x) > Math.abs(delta_y)) {
        if (delta_x > 0) {
            if ((monster4.j < 9) && board[monster4.i][monster4.j + 1] !== 4) {
                monster4.j++;
            } else if ((monster4.i < 9) && board[monster4.i + 1][monster4.j] !== 4) {// pass wall - down
                monster4.i++;
            } else {// pass wall - up
                monster4.i--;
            }
        } else {
            if ((monster4.j > 0) && board[monster4.i][monster4.j - 1] !== 4) {
                monster4.j--;
            } else if ((monster4.i < 9) && board[monster4.i + 1][monster4.j] !== 4) {// pass wall - down
                monster4.i++;
            } else {// pass wall - up
                monster4.j--;
            }
        }
    } else {
        if (delta_y > 0) {
            if ((monster4.i < 9) && board[monster4.i + 1][monster4.j] !== 4) {
                monster4.i++;
            } else if ((monster4.j < 9) && board[monster4.i][monster4.j + 1] !== 4) {// pass wall - right
                monster4.j++;
            } else {// pass wall - left
                monster4.j++;
            }
        } else {
            if ((monster4.i > 0) && board[monster4.i - 1][monster4.j] !== 4) {
                monster4.i--;
            } else if ((monster4.j < 9) && board[monster4.i][monster4.j + 1] !== 4) {// pass wall - right
                monster4.j++;
            } else {// pass wall - left
                monster4.j++;
            }
        }
    }
    if (monster4.i === shape.i && monster4.j === shape.j) {
        boom();
    } else {
        Draw();
    }
}

function extraLifeToAdd() {
    chompSong.pause();
    extraLifeSong.play();
    eaten = true;
    pacmen_life++;
    document.getElementById("life2").hidden = false;
}

function update_50pts_Position() {
    var emptyCell = findRandomCellForSpecialPts(board);
    specialPts.i = emptyCell[0];
    specialPts.j = emptyCell[1];
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
    lblTime.value = parseFloat(time_elapsed).toFixed(1);
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

            var lifeCenter = new Object();

            var specialCenter = new Object();

            m_center1.x = monster1.i * 60 + 30;
            m_center1.y = monster1.j * 60 + 30;

            m_center2.x = monster2.i * 60 + 30;
            m_center2.y = monster2.j * 60 + 30;

            m_center3.x = monster3.i * 60 + 30;
            m_center3.y = monster3.j * 60 + 30;

            m_center4.x = monster4.i * 60 + 30;
            m_center4.y = monster4.j * 60 + 30;

            lifeCenter.x = extraLifeCell[0] * 60 + 30;
            lifeCenter.y = extraLifeCell[1] * 60 + 30;

            specialCenter.x = specialPts.i * 60 + 30;
            specialCenter.y = specialPts.j * 60 + 30;


            if (board[i][j] == 2) {
                // context.beginPath();
                // context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                // context.lineTo(center.x, center.y);
                // context.fillStyle = pac_color; //color
                // context.fill();
                // context.beginPath();
                // context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                // context.fillStyle = "black"; //color
                // context.fill();
                context.drawImage(pacman_image, center.x - 30, center.y - 30, canvas.width / 10, canvas.height / 10);
            } else if (board[i][j] == 1) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = AC_ball_25; //color
                context.fill();
            } else if (board[i][j] == 4) {
                // context.beginPath();
                // context.rect(center.x - 30, center.y - 30, 60, 60);
                // context.fillStyle = "grey"; //color
                // context.fill();
                context.drawImage(wall, i*60, j*60 , canvas.width / 10, canvas.height / 10);
            } else if (board[i][j] == 3) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = AC_ball_15; //color
                context.fill();
            } else if (board[i][j] == 6) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = AC_ball_5; //color
                context.fill();
            }
            if (monster1.i == i && monster1.j == j) {
                context.drawImage(monster1_image, m_center1.x - 30, m_center1.y - 30, canvas.width / 10, canvas.height / 10);
            }
            if (monster2.i == i && monster2.j == j && AC_monsterNumber > 1) {
                context.drawImage(monster2_image, m_center2.x - 30, m_center2.y - 30, canvas.width / 10, canvas.height / 10);
            }
            if (monster3.i == i && monster3.j == j && AC_monsterNumber > 2) {
                context.drawImage(monster3_image, m_center3.x - 30, m_center3.y - 30, canvas.width / 10, canvas.height / 10);
            }
            if (monster4.i == i && monster4.j == j && AC_monsterNumber > 3) {
                context.drawImage(monster4_image, m_center4.x - 30, m_center4.y - 30, canvas.width / 10, canvas.height / 10);
            }
            if (!eaten && pacmen_life === 1) {
                extraLife.i = extraLifeCell[0];
                extraLife.j = extraLifeCell[1];
                context.drawImage(extraLife_image, lifeCenter.x - 30, lifeCenter.y - 30, canvas.width / 10, canvas.height / 10);
            }
            if (!special_eaten) {
                context.drawImage(extraPoints_image, specialCenter.x - 30, specialCenter.y - 30, canvas.width / 10, canvas.height / 10);
            }

        }
    }
}

function gameOver() {
    beginningSong.pause();
    deathSong.pause();
    if (time_elapsed > AC_timeout) {
        if (score > scoreToWin) {
            $('#winnerAlert').modal('show');
        } else {
            alert("You are better than " + score + " points!");
        }
    } else if (pacmen_life === 0) {
        document.getElementById("loserSong").play();
        alert("loser!");
    } else {
        winSong.play();
        window.alert("Winner!!!");
        $('#winnerAlert').modal('show');
    }
    window.clearInterval(interval);
    window.clearInterval(specialPts_interval);
    window.clearInterval(monster1_interval);
    window.clearInterval(monster2_interval);
    window.clearInterval(monster3_interval);
    window.clearInterval(monster4_interval);
    document.getElementById("life1").hidden = false;
    document.getElementById("life2").hidden = false;
    document.getElementById("life3").hidden = false;
    document.getElementById("life4").hidden = false;
    document.getElementById("life5").hidden = false;
    eaten = false;
    newGame = true;
    setBalls();
    AC_ballsNumber = ballsNumber;
    var result = confirm("you are brave enough to play again?");
    pacmen_life = 5;
    if (result === true) {
        Start();
    } else {
        gameOverSong.play();
        window.alert("hope you enjoyed our game! see you soon :)");
        currentPage.setPageName("afterLogin");
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
        pacman_image = pacman_imageU;
        if (green) pacman_image = pacman_greenImageU;
    }
    if (x == 2) {
        if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
            shape.j++;
        }
        pacman_image = pacman_imageD;
        if (green) pacman_image = pacman_greenImageD;
    }
    if (x == 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
            shape.i--;
        }
        pacman_image = pacman_imageL;
        if (green) pacman_image = pacman_greenImageL;
    }
    if (x == 4) {
        if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
            shape.i++;
        }
        pacman_image = pacman_imageR;
        if (green) pacman_image = pacman_greenImageR;
    }
    if (shape.i === extraLife.i && shape.j === extraLife.j && !eaten && pacmen_life === 1) {
        extraLifeToAdd();
    }
    if (shape.i === specialPts.i && shape.j === specialPts.j && !special_eaten) {
        score = score + 50;
        special_eaten = true;
        chompSong.pause();
        extraLifeSong.play();
        window.clearInterval(specialPts_interval);
    }
    if (board[shape.i][shape.j] == 1) {
        score = score + 25;
        AC_ballsNumber--;
        chompSong.play();
    } else if (board[shape.i][shape.j] == 3) {
        score = score + 15;
        AC_ballsNumber--;
        chompSong.play();
    } else {
        if (board[shape.i][shape.j] == 6) {
            score = score + 5;
            AC_ballsNumber--;
            chompSong.play();
        }
    }
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (time_elapsed > AC_timeout) {
        gameOver();
    }
    if (score >= 0.8 * scoreToWin) {
        green = true;
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
    setPageName: function (newName) {
        if (newName === "registerView") {
            document.getElementById("registerForm").reset();
            $("#password_error_message").hide();
            $("#email_error_message").hide();
            $("#fname_error_message").hide();
            $("#lname_error_message").hide();
        }
        if (newName === "loginView") {
            document.getElementById("loginForm").reset();
        }
        if (this.newPageName === "gameView") {
            window.clearInterval(interval);
            window.clearInterval(specialPts_interval);
            window.clearInterval(monster1_interval);
            window.clearInterval(monster2_interval);
            window.clearInterval(monster3_interval);
            window.clearInterval(monster4_interval);
            beginningSong.pause();
        }
        if (newName === "settingsView") {
            AC_timeout = parseInt(document.getElementById("gameLength").textContent.replace(" sec", ""));
            timeout = AC_timeout;
        }
        this.oldPageName = this.newPageName;
        this.newPageName = newName;
    }
};

function setNewGame() {
    newGame = true;
}

var currentUser = {
    userName: undefined,
    setUserName: function (NewUserName) {
        this.userName = NewUserName;
    }
};

function changeDiv() {
    document.getElementById(currentPage.oldPageName).hidden = true;
    document.getElementById(currentPage.newPageName).hidden = false;

}

$(function () {

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
        var result = letters.test(password);
        var password_length = $("#form_password").val().length;
        if (password_length < 6) {
            $("#password_error_message").html("At least 8 characters");
            $("#password_error_message").show();
            error_password = true;
        } else if (!result) {
            $("#password_error_message").html("must contain only letters and numbers");
            $("#password_error_message").show();
            error_password = true;
        } else {
            $("#password_error_message").hide();
        }
    }

    function fname_check() {
        var result = undefined;
        if (!/^[a-zA-Z\s]+$/.test($('#form_fName').val())) {
            $("#fname_error_message").html("must contain only letters");
            $("#fname_error_message").show();
            error_fname = true;
        } else {
            $("#fname_error_message").hide();
        }
    }

    function lname_check() {
        var result = undefined;
        if (!/^[a-zA-Z\s]+$/.test($('#form_lName').val())) {
            $("#lname_error_message").html("must contain only letters <br>");
            $("#lname_error_message").show();
            error_lname = true;
        } else {
            $("#lname_error_message").hide();
        }
    }

    function check_email() {
        var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
        if (pattern.test($("#form_email").val())) {
            $("#email_error_message").hide();
        } else {
            $("#email_error_message").html("Invalid email address");
            $("#email_error_message").show();
            error_email = true;
        }
    }

    $("#registerForm").submit(function (e) {
        error_password = false;
        error_email = false;
        error_lname = false;
        error_fname = false;
        fname_check();
        lname_check();
        check_password();
        check_email();
        if (error_password == false && error_email == false && error_lname == false && error_fname == false) {
            var password = document.getElementById("form_password").value;
            var username = document.getElementById("form_username").value;
            var player = {userName: username, password: password};
            var userExist = false;
            usersDB.forEach(element => {
                if (element.userName === username) {
                    userExist = true;
                }
            });
            if (userExist) {
                alert("There is already user with the same username");
                e.preventDefault();

            } else {
                usersDB.push(player);
                ;
                alert("Registered successfully!!");
                e.preventDefault();
                currentPage.setPageName("loginView");
                changeDiv();
            }
        } else {
            return false;
        }

    });

});

$(function () {
    $("#loginForm").submit(function (e) {
        var password = document.getElementById("loginForm_password").value;
        var username = document.getElementById("loginForm_username").value;
        var userExist = false;
        usersDB.forEach(element => {
            if (element.userName === username && element.password === password) {
                userExist = true;
                currentUser.setUserName(element.userName);
            }
        });
        if (userExist) {
            alert("Signed in successfully!!");
            e.preventDefault();
            currentPage.setPageName("afterLogin");
            changeDiv();
            signedIn = true;
            document.getElementById("logout").hidden = false;
            document.getElementById("logIn").hidden = true;
            document.getElementById("register").hidden = true;
            document.getElementById("settings").hidden = false;
            document.getElementById("play").hidden = false;
            document.getElementById("usernameBinding").textContent ="User  :  " + currentUser.userName;
        } else {
            alert("Incorrect user or password");
            e.preventDefault();
        }
    });
});


function logOut() {
    document.getElementById("logout").hidden = true;
    document.getElementById("mainMenu").hidden = true;
    document.getElementById("settings").hidden = true;
    document.getElementById("play").hidden = true;
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
var timeout = 60;

function copyData(element, target) {
    document.getElementById(target).textContent = element.value;
}

function bindSettings(variable, target) {
    document.getElementById(target).style.backgroundColor = variable;
}

function bindIntSettings(variable, target) {
    document.getElementById(target).textContent = variable;
}

function setBalls() {
    ballsNumber = parseInt(document.getElementById('range').value);
}

function setColor(id) {
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

function moreMonsters(e) {
    e.preventDefault();
    if (monsterNumber < 4)
        monsterNumber++;
    document.getElementById("monsterAmount").textContent = "x " + monsterNumber;
}

function moreTime(e) {
    e.preventDefault();
    if (timeout < 300)
        timeout++;
    document.getElementById("gameLength").textContent = timeout + " sec";
}

function lessMonsters(e) {
    e.preventDefault();
    if (monsterNumber > 1)
        monsterNumber--;
    document.getElementById("monsterAmount").textContent = "x " + monsterNumber;
}

function lessTime(e) {
    e.preventDefault();
    if (timeout > 60)
        timeout--;
    document.getElementById("gameLength").textContent = timeout + " sec";
}

function randomSettings(e) {
    e.preventDefault();
    moveRight = 39;
    moveDown = 40;
    moveLeft = 37;
    moveUp = 38;
    ballsNumber = Math.floor(Math.random() * 40 + 50);
    monsterNumber = Math.floor(Math.random() * 3 + 1);
    timeout = Math.floor(Math.random() * 240 + 60);
    do {
        ball_5 = "#" + Math.floor(Math.random() * 16777215).toString(16);
        ball_15 = "#" + Math.floor(Math.random() * 16777215).toString(16);
        ball_25 = "#" + Math.floor(Math.random() * 16777215).toString(16);
    } while (!settingsConfirm(null, true))
}

function commitChanges() {
    AC_ball_5 = ball_5.toString();
    bindSettings(AC_ball_5, "colors_5_bind");
    AC_ball_15 = ball_15.toString();
    bindSettings(AC_ball_15, "colors_15_bind");
    AC_ball_25 = ball_25.toString();
    bindSettings(AC_ball_25, "colors_25_bind");
    AC_ballsNumber = ballsNumber;
    AC_monsterNumber = monsterNumber;
    AC_moveDown = moveDown;
    AC_moveUp = moveUp;
    AC_moveRight = moveRight;
    AC_moveLeft = moveLeft;
    AC_timeout = timeout;
    bindIntSettings(AC_timeout, "length_bind");
    bindIntSettings(AC_monsterNumber, "monsters_bind");
}

function settingsConfirm(e, isRandom) {
    if (e != null)
        e.preventDefault();
    if (!((ball_5 !== ball_15) && (ball_15 !== ball_25) && (ball_5 !== ball_25))) {
        if (!isRandom) alert("Balls colors have to be different");
        return false;
    }
    if (!((moveRight !== moveDown) && (moveRight !== moveLeft) && (moveRight !== moveUp)
        && (moveDown !== moveLeft) && (moveDown !== moveUp) && (moveLeft !== moveUp))) {
        if (!isRandom) alert("Movement keys have to be different");
        return false;
    }
    if (!isRandom) {
        ball_5 = document.getElementById('5pts').value;
        ball_15 = document.getElementById('15pts').value;
        ball_25 = document.getElementById('25pts').value;
        setBalls();
    }
    commitChanges();
    alert("Changes Updated Successfully!");
    currentPage.setPageName("afterLogin");
    changeDiv();
    return true;
}

function test(code, id) {
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

function findRandomCellForSpecialPts(board) {
    var i = Math.floor(Math.random() * 9 + 1);
    var j = Math.floor(Math.random() * 9 + 1);
    while (board[i][j] === 4 || board[i][j] === 2) {
        i = Math.floor(Math.random() * 9 + 1);
        j = Math.floor(Math.random() * 9 + 1);
    }
    return [i, j];
}

// SETTINGS