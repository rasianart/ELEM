$(document).ready(function() {
var config = {
    apiKey: "AIzaSyAZKKAyRnTOYF_i78DXqtqnV8AntEy9A7U",
    authDomain: "prsc-47a9d.firebaseapp.com",
    databaseURL: "https://prsc-47a9d.firebaseio.com",
    storageBucket: "prsc-47a9d.appspot.com",
    messagingSenderId: "364507904221"
};

firebase.initializeApp(config);
var database = firebase.database();

resetChoices();

var player1Storage = {
	player: false,
	name: 'No Name',
	playerWins: 0,
	playerLosses: 0,
	playerChoice: '',
	oneOrTwo: 1,
	answer: '',
	answerOld: ''
}

var player2Storage = {
	player: false,
	name: 'No Name',
	playerWins: 0,
	playerLosses: 0,
	playerChoice: '',
	oneOrTwo: 1,
	answer: '',
	answerOld: ''
};

var player1 = false;
var player2 = false;
var name = 'No Name';
var player1Wins = 0;
var player2Wins = 0;
var player1Losses = 0;
var player2Losses = 0;
var player1Choice = '';
var player2Choice = '';
var oneOrTwo = 1;
var answer1 = '';
var answer2 = '';
var answerOld1 = '';
var answerOld2 = '';


database.ref().child('initialize').set({
	active: true 
})

function printInitial() {
	$('<input id="name-input" placeholder="Name">').appendTo('#name-form');
	$('<button id="name-submit">').text('Start').appendTo('#name-form');
	if (name === 'No Name') {
		$('#player2, #player1').css('pointerEvents', 'none');
	}
}

database.ref().on('value', function(snapshot) {
	answer1 = snapshot.val().player_1.choice;
	answer2 = snapshot.val().player_2.choice;
	if (player1New !=== player1Old && player2New !=== player2Old) {
		if (answer1 === "rock" && answer2 === "paper") {
			alert("Player 2 wins!");
			p2score = p2score++;
		}
		else if (answer1 === "rock" && answer2 === "scissors") {
			alert("Player 1 wins!");
			p2score = p1score++;
		}
		else if (answer1 === "rock" && answer2 === "rock") {
			alert("Tie");
		}
		else if (answer1 === "paper" && answer2 === "rock") {
			alert("Player 1 wins!");
			p2score = p1score++;
		}
		else if (answer1 === "paper" && answer2 === "paper") {
			alert("Tie");
		}
		else if (answer1 === "paper" && answer2 === "scissors") {
			alert("Player 2 wins!");
			p2score = p1score++;
		}
		else if (answer1 === "scissors" && answer2 === "paper") {
			alert("Player 1 wins!");
			p2score = p1score++;
		}
		else if (answer1 === "scissors" && answer2 === "scissors") {
			alert("Tie");
		}
		else if (answer1 === "scissors" && answer2 === "rock") {
			alert("Player 2 wins!");
			p2score = p1score++;
		}
	}
	answerOld1 = answer1;
	answerOld2 = answer2;
	if (snapshot.child("player_1").exists() && snapshot.child("player_2").exists()) {
		updatePlayer1(snapshot);
		updatePlayer2(snapshot);
	}
	if (snapshot.child("player_1").exists()) {
		updatePlayer1(snapshot);
	}
});

function updatePlayer1(snapshot) {
	$("#p1-name").html(snapshot.val().player_1.name);
	// $("#p1-choice").html(snapshot.val().player_1.choice);
	$("#p1-wins").html(snapshot.val().player_1.player1Wins);
	$("#p1-losses").html(snapshot.val().player_1.player1Losses);
}

function updatePlayer2(snapshot) {
	$("#p2-name").html(snapshot.val().player_2.name);
	// $("#p2-choice").html(snapshot.val().player_2.choice);
	$("#p2-wins").html(snapshot.val().player_2.player2Wins);
	$("#p2-losses").html(snapshot.val().player_2.player2Losses);
}

function choose() {
	$(document.body).on('click', 'div.choices', function(event) {
		var chosenID = $(this).parent().attr('id');
		var choice = $(this).html();
		if (chosenID === 'p1-choice') {
			player1Choice = choice;
			database.ref().child('player_1').update({
				choice: choice
			});
			$('#p1-choice').css('fontSize', '36px').html(choice);
		} else if (chosenID === 'p2-choice') {
			player2Choice = choice;
			database.ref().child('player_2').update({
				choice: choice
			});
			$('#p2-choice').css('fontSize', '36px').html(choice);
		}
	});
}

function resetChoices() {
	$('.choice').empty();
	$('<div id="rock" class="choices">').html('Rock').appendTo('.choice');
	$('<div id="paper" class="choices">').html('Paper').appendTo('.choice');
	$('<div id="scissors" class="choices">').html('Scissors').appendTo('.choice');
}

function storeName() {
	$(document).on('click', 'button#name-submit', function() {
		$('#player2, #player1').css('pointerEvents', 'auto');
		name = $('#name-input').val().trim();
		database.ref().once('value', function(snapshot) {
			if (snapshot.child("player_1").exists() && snapshot.child("player_2").exists()) {
				alert("Queing for position... Try again soon.");
				$("#p1-name").html(snapshot.val().player_1.name);
				$("#p2-name").html(snapshot.val().player_2.name);
			} else if (snapshot.child("player_1").exists()) {
				player2 = true;
				oneOrTwo = 2;
				$('#name-form').html('Hi ' + name + '! You are player ' + oneOrTwo);
				database.ref().child('player_2').set({
					name: name,
					choice: player2Choice,
					wins: player2Wins,
					losses:player2Losses
				});
				$("#p1-name").html(snapshot.val().player_1.name);
				$('#p2-name').html(name);
				$('#player1').css('pointerEvents', 'none');
				$('#name-input').val('');
			} else {
				player1 = true;
				oneOrTwo = 1;
				$('#name-form').html('Hi ' + name + '! You are player ' + oneOrTwo);
				database.ref().child('player_1').set({
					name: name,
					choice: player1Choice,
					wins: player1Wins,
					losses: player1Losses
				});
				$("#p1-name").html(name);
				$('#player2').css('pointerEvents', 'none');
				$('#name-input').val('');
			} 
		});
		return false;
	});
}

function printChat() {
	$(document).on('submit', 'form', function(event) {
		event.preventDefault(); 
		var message = ($('#chat-input').val().trim()) + '\n';
		$('#chat-output').append(name + ': ' + message);
		$('#chat-input').val('');
	})
}

if (name === 'No Name') {
	$('#player2, #player1').css('pointerEvents', 'none');
}




printChat();
printInitial();
storeName();
choose();
});


// use the key/timestamps of the node in firebase as a way to identify

// take players name
// assign player one or two
// make all consequential action be a part of the player's firebase object
// firebase should just have two play objects, upon quit or loss, one players object is removed

