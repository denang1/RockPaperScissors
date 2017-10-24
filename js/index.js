var playerChoice = 'rock';
var choices = ['rock', 'paper', 'scissors'];
var cpuChoice = 'rock';
var playerMoveElement;
var cpuMoveElement;
var playerWinCounter = 0;
var cpuWinCounter = 0;
var currentWinner = 0;
var inProgress = false;
var movesHistory = [];
var moveStatistics = {
	paper: 0,
	rock: 0,
	scissors: 0
};
var movePercentages = {
	rock: 0,
	paper: 0,
	scissors: 0
};

$(document).ready(function(){
	playerMoveElement = $('#playerMove');
	cpuMoveElement = $('#cpuMove');
});

function move(choice) {
	if(inProgress)
		return;
	inProgress = true;
	$(".btn").addClass("disabled");
	playerChoice = choice;
	cpuChoice = getCpuMove();
	animate();
}

function animate() {
	var properties = {
		times: 3
	};
	var duration = 1000;
	$(".move").effect("bounce", properties, duration);
	$(".move").promise().done(onAnimationComplete);
}

function getCpuMove() {
	var rockWeight = 0;
	var paperWeight = 0;
	var scissorsWeight = 0;
	var majorityChoice = null;

	if(Math.random() > 0.8) {
		var choiceIndex = parseInt(Math.random()*3);
		return choices[choiceIndex];
	}

	for(key in movePercentages) {
		if(movePercentages[key] === 100) {
			return getOppositeMove(key);
		}
	}

	for(key in movePercentages) {
		if(movePercentages[key] > 66.6 && movesHistory.length > 3) {
			majorityChoice = key;
		}
	}

	if(majorityChoice && movesHistory[movesHistory.length-1].outcome === "won") {
		return getOppositeMove(majorityChoice);
	}

	if(movesHistory.length > 0 && movesHistory[movesHistory.length-1].outcome === "tied") {
		if(Math.random() > 0.75) {
			var choiceIndex = parseInt(Math.random()*3);
			return choices[choiceIndex];
		}
		else {
			var choice = getOppositeMove(movesHistory[movesHistory.length-1].choice);
			return choice;
		}
	}

	for (key in moveStatistics) {
		if(key === "rock") {
			rockWeight = moveStatistics[key];
		}
		else if(key === "scissors") {
			scissorsWeight = moveStatistics[key];
		}
		else {
			paperWeight = moveStatistics[key];
		}
	}
	if(scissorsWeight > paperWeight && scissorsWeight > rockWeight) {
		return "rock";
	}
	else if(rockWeight > paperWeight && rockWeight > scissorsWeight) {
		return "paper";
	}
	else if(paperWeight > rockWeight && paperWeight > scissorsWeight) {
		return "scissors";
	}
	else {
		var choiceIndex = parseInt(Math.random()*3);
		return choices[choiceIndex];
	}
}

function addMove(playerMove, playerOutcome) {
	var move = {
		choice: playerMove,
		outcome: playerOutcome
	};
	movesHistory.push(move);
}

function getMoveWeights(playerMove) {
	moveStatistics = {
		rock: 0,
		paper: 0,
		scissors: 0
	};

	movesHistory.map(function(currentMove, index){
		if(index !== movesHistory.length-1) {
			var moveWeight = moveCompare(currentMove, movesHistory[index+1]);
			moveStatistics[movesHistory[index+1].choice] += moveWeight;
		}
	});
}

function getOppositeMove(move) {
	if(move === "rock") {
		return "paper";
	}
	else if(move === "paper") {
		return "scissors";
	}
	else {
		return "rock";
	}
}

function getMovePercentages() {
	var rockCounter = 0;
	var paperCounter = 0;
	var scissorsCounter = 0;
	var total = 0;

	movesHistory.map(function(currentMove, index) {
		if(currentMove.choice === "rock") {
			rockCounter++;
		}
		else if(currentMove.choice === "paper") {
			paperCounter++;
		}
		else {
			scissorsCounter++;
		}
		total++;
	});

	movePercentages["rock"] = (rockCounter/total)*100;
	movePercentages["paper"] = (paperCounter/total)*100;
	movePercentages["scissors"] = (scissorsCounter/total)*100;
}

function moveCompare(move1, move2) {
	if(move1.outcome === "won" && move2.outcome === "won") {
		return 1;
	}
	else if(move1.outcome === "lost" && move2.outcome === "won") {
		return 1;
	}
	else if(move1.outcome === "won" && move2.outcome === "lost") {
		return -1;
	}
	else if(move1.outcome === "lost" && move2.outcome === "lost") {
		return -1;
	}
	else {
		return 0;
	}
}

function onAnimationComplete() {
	playerMove();
	cpuMove();
	currentWinner = winner();
	print(currentWinner);
	var playerOutcome = "";
	if(currentWinner === 1) {
		playerOutcome = "won";
	}
	else if(currentWinner === 2) {
		playerOutcome = "lost";
	}
	else {
		playerOutcome = "tied";
	}
	addMove(playerChoice, playerOutcome);
	getMoveWeights(playerChoice);
	getMovePercentages();
	inProgress = false;
	$(".btn").removeClass("disabled");

	console.log("Moves history: " + JSON.stringify(movesHistory));
	console.log("Moves statistics: " + JSON.stringify(moveStatistics));
	console.log("Moves percentages: " + JSON.stringify(movePercentages));
}

function playerMove() {
	playerMoveElement.attr("src", "images/" + playerChoice + "-player.png");
}

function cpuMove() {
	cpuMoveElement.attr("src", "images/" + cpuChoice + "-cpu.png");
}

function winner() {
	if(playerChoice === cpuChoice) {
		return 0;
	}
	else if(playerChoice === "rock" && cpuChoice === "scissors") {
		playerWinCounter++;
		return 1;
	}
	else if(playerChoice === "rock" && cpuChoice === "paper") {
		cpuWinCounter++;
		return 2;
	}
	else if(playerChoice === "paper" && cpuChoice === "scissors") {
		cpuWinCounter++;
		return 2;
	}
	else if(playerChoice === "paper" && cpuChoice === "rock") {
		playerWinCounter++;
		return 1;
	}
	else if(playerChoice === "scissors" && cpuChoice === "rock") {
		cpuWinCounter++;
		return 2;
	}
	else if(playerChoice === "scissors" && cpuChoice === "paper") {
		playerWinCounter++;
		return 1;
	}
}

function updateScores() {
	$("#cpuWins").text("Wins: " + cpuWinCounter);
	$("#playerWins").text("Wins: " + playerWinCounter);
}

function print(winner) {
	var message = "It's a tie!";
	switch(winner) {
		case 1:
			message = "You won!";
			break;
		case 2:
			message = "You lost!";
			startLaughter();
			break;
	}
	$("#outcome").text(message);
	updateScores();
}

function startLaughter() {
	var audio = {};
	audio["laughter"] = new Audio();
	audio["laughter"].src = "./audio/tyroneWinning.wav"
	audio["laughter"].play();
}