window.onload = function() {
	const deskNum = 3;
	const deskSize = 150;
	const border = 15;
	let isMyTurn = false;
	const desksId = [["A0", "A1", "A2"], ["B0", "B1", "B2"], ["C0", "C1", "C2"]];
	let desks = [];

	const message = document.getElementById("messageArea");
	const canvas = document.querySelectorAll(".draw");
	const lineCanvas = document.querySelector("#winnerLine");
	canvas.forEach( canva => canva.addEventListener("click", playerRound, false) );
	lineCanvas.addEventListener("click", reset, false);
	reset();

function reset() {
	for (let i = 0; i < deskNum; i++) {
		desks[i] = [];
		for (let j = 0; j < deskNum; j++) {
			desks[i][j] = false;
		}
	}
	message.innerHTML = "Tic-Tac-Toe";
	canvas.forEach( canva => clearCanvas(canva) );
	clearCanvas(lineCanvas);
	lineCanvas.style.setProperty("z-index", "0");
	isMyTurn = !isMyTurn;
	if (isMyTurn) return;
	computerRound();
}

function playerRound() {
	const player = "player"
	const indexes = idToIndexes(this.id);

	if (!isMyTurn) return;	
	if (desks[indexes[0]][indexes[1]]) return;
	drawCircle(this);
	desks[indexes[0]][indexes[1]] = player;
	if (isGameOver(player)) {
		return;
	} 
	isMyTurn = !isMyTurn;
	computerRound();
}

function computerRound() {
	const deskId = computerChoose();
	const desk = document.getElementById(deskId);
	const player = "computer";
	const indexes = idToIndexes(desk.id);

	drawCross(desk);
	desks[indexes[0]][indexes[1]] = player;
	if (isGameOver(player)) {
		return;
	} 
	isMyTurn = !isMyTurn;
}

function computerChoose() {
	let randomX, randomY;
	do {
		randomX = Math.floor(Math.random() * deskNum);
		randomY = Math.floor(Math.random() * deskNum);
	}
	while(desks[randomX][randomY]);
	return desksId[randomX][randomY];
}

function isGameOver(player) {
	if ( (hasWinner(player) == "player") || (hasWinner(player) == "computer") ) {
		gameOver(player);
		return player;
	}
	for (let i = 0; i < deskNum; i++) {
		if (desks[i].indexOf(false) != -1) {
			return false;
		}
	}
	gameOver("draw");
	return "draw";
}

function hasWinner(player) {
	let start = [];
	let end = [];
	for (let i = 0; i < deskNum; i++) {
		if ( (desks[i][0] == player) && (desks[i][1] == player) && (desks[i][2] == player) ) {
			start = [deskSize*0.1, (deskSize * 0.5) + (deskSize + border) * i];
			end = [(deskSize * 2.9) + border * 2, (deskSize * 0.5) + (deskSize + border) * i];
			winnerLine(start, end, player);
			return player;
		}
	}
	for (let i = 0; i < deskNum; i++) {
		if ( (desks[0][i] == player) && (desks[1][i] == player) && (desks[2][i] == player) ) {
			start = [(deskSize * 0.5) + (deskSize + border) * i, deskSize*0.1];
			end = [(deskSize * 0.5) + (deskSize + border) * i, (deskSize * 2.9) + border * 2];
			winnerLine(start, end, player);
			return player;
		}
	}
	if ( (desks[0][0] == player) && (desks[1][1] == player) && (desks[2][2] == player) ) {
		start = [deskSize*0.1, deskSize*0.1];
		end = [(deskSize * 2.9) + border * 2, (deskSize * 2.9) + border * 2];
		winnerLine(start, end, player);
		return player;
	} else if ( (desks[2][0] == player) && (desks[1][1] == player) && (desks[0][2] == player) ) {
		start = [deskSize*0.1, (deskSize * 2.9) + border * 2];
		end = [(deskSize * 2.9) + border * 2, deskSize*0.1];
		winnerLine(start, end, player);
		return player;
	} 
	return false;
}

function gameOver(result) {
	if (result == "player") {
		message.innerHTML = "You Win!";
	} else if (result == "computer") {
		message.innerHTML = "You lose!";
	} else {
		message.innerHTML = "No Winner";
	}
	lineCanvas.style.setProperty("z-index", "1");
}

function idToIndexes(id) {
	const indexes = [];
	for (let i = 0; i < deskNum; i++) {
		 if (desksId[i].indexOf(id) !== -1) {
		 	indexes[0] = i;
		 	indexes[1] = desksId[i].indexOf(id);
		 }
	}
	return indexes;
}

function drawCircle(desk) {
	const context = desk.getContext("2d");
	context.lineWidth = 20;
	context.strokeStyle = "rgba(179, 30, 24, 0.9)";
	context.lineCap = "round";
	context.beginPath();
	context.arc(desk.width*0.5, desk.height*0.5, desk.width*0.3, (280 * Math.PI)/180, (310 * Math.PI)/180, true);
	context.stroke();
}

function drawCross(desk) {
	const context = desk.getContext("2d");
	context.lineWidth = 20;
	context.strokeStyle = "rgba(34, 101, 144, 0.9)";
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(desk.width*0.75, desk.height*0.25);
	context.lineTo(desk.width*0.25, desk.height*0.75);
	context.stroke();
	context.beginPath();
	context.moveTo(desk.width*0.3, desk.height*0.3);
	context.lineTo(desk.width*0.85, desk.height*0.85);
	context.stroke();
}

function winnerLine(start, end, winner) {
	const context = lineCanvas.getContext("2d");
	context.lineWidth = 20;
	if (winner == "player") {
		context.strokeStyle = "rgb(179, 30, 24)";
	} else {
		context.strokeStyle = "rgb(34, 101, 144)";
	}
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(start[0], start[1]);
	context.lineTo(end[0], end[1]);
	context.stroke();
}
function clearCanvas(canvas) {
	const context = canvas.getContext("2d");
	context.clearRect(0,0,canvas.width,canvas.height); 
}

};

















