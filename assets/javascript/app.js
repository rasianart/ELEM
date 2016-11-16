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
	playerWins: 0,
	playerLosses: 0,
	playerChoice: '',
	choiceOld: ''
};

var player2Storage = {
	player: false,
	playerWins: 0,
	playerLosses: 0,
	playerChoice: '',
	choiceOld: ''
};

var name = 'No Name';
var oneOrTwo = 1;
var chatCounter = 0000;

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

function printChat() {
	var chat = database.ref().child('chat');
	var lastMessage = '';
	$(document).on('submit', 'form', function(event) {
		event.preventDefault(); 
		var message = name + ': ' + ($('#chat-input').val().trim());
		database.ref().child('chatCount').set({
			chatCounts: chatCounter
		});
		chat.child('chat' + chatCounter).set({
			chat: message
		});
		var lastMessage = '';
		$('#chat-input').val('');
	});
	chat.orderByChild("dateAdded").on('child_added', function(snapshot) {
		lastMessage = snapshot.val().chat;
		console.log(lastMessage);
		var chatBox = $('#chat-output');
		chatBox.append(lastMessage + '\n');
		$(chatBox).scrollTop($(chatBox)[0].scrollHeight);
	});
}

database.ref().on('value', function(snapshot) {

	var chatNode = snapshot.child('chatCount');
	chatCounter = chatNode.child('chatCounts').val();
	chatCounter++;
	var p1Node = snapshot.child('player_1');
	var answer1 = p1Node.child('choice').val();
	var answer1Old = p1Node.child('oldChoice').val();
	var p2Node = snapshot.child('player_2');
	var answer2 = p2Node.child('choice').val();
	var answer2Old = p2Node.child('oldChoice').val();

	if (answer1 !== answer1Old && answer2 !== answer2Old) {
		if (answer1 === "Rock" && answer2 === "Paper") {
			alert("Player 2 wins!");
			uponWin(answer1, answer2);
			// p2score = p2score++;
		}
		else if (answer1 === "Rock" && answer2 === "Scissors") {
			alert("Player 1 wins!");
			uponWin(answer1, answer2);
			// p2score = p1score++;
		}
		else if (answer1 === "Rock" && answer2 === "Rock") {
			alert("Tie");
			uponWin(answer1, answer2);
		}
		else if (answer1 === "Paper" && answer2 === "Rock") {
			alert("Player 1 wins!");
			uponWin(answer1, answer2);
			// p2score = p1score++;
		}
		else if (answer1 === "Paper" && answer2 === "Paper") {
			alert("Tie");
			uponWin(answer1, answer2);
		}
		else if (answer1 === "Paper" && answer2 === "Scissors") {
			alert("Player 2 wins!");
			uponWin(answer1, answer2);
			// p2score = p1score++;
		}
		else if (answer1 === "Scissors" && answer2 === "Paper") {
			alert("Player 1 wins!");
			uponWin(answer1, answer2);
			// p2score = p1score++;
		}
		else if (answer1 === "Scissors" && answer2 === "Scissors") {
			alert("Tie");
			uponWin(answer1, answer2);
		}
		else if (answer1 === "Scissors" && answer2 === "Rock") {
			alert("Player 2 wins!");
			uponWin(answer1, answer2);
			// p2score = p1score++;
		}
	}

	if (snapshot.child("player_1").exists() && snapshot.child("player_2").exists()) {
		updatePlayer1(snapshot);
		updatePlayer2(snapshot);
	}
	if (snapshot.child("player_1").exists()) {
		updatePlayer1(snapshot);
	}

});

function uponWin(answer1, answer2) {
	database.ref().child('player_1').update({
		oldChoice: answer1,
	});
	database.ref().child('player_2').update({
		oldChoice: answer2,
	});
}

function updatePlayer1(snapshot) {
	$("#p1-name").html(snapshot.val().player_1.name);
	$("#p1-wins").html(snapshot.val().player_1.player1Wins);
	$("#p1-losses").html(snapshot.val().player_1.player1Losses);
}

function updatePlayer2(snapshot) {
	$("#p2-name").html(snapshot.val().player_2.name);
	$("#p2-wins").html(snapshot.val().player_2.player2Wins);
	$("#p2-losses").html(snapshot.val().player_2.player2Losses);
}

function choose() {
	$(document.body).on('click', 'div.choices', function(event) {
		var chosenID = $(this).parent().attr('id');
		var choice = $(this).html();
		if (chosenID === 'p1-choice') {
			player1Storage.playerChoice = choice;
			database.ref().child('player_1').update({
				choice: choice
			});
			$('#p1-choice').css('fontSize', '36px').html(choice);
		} else if (chosenID === 'p2-choice') {
			player2Storage.playerChoice = choice;
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
				player2Storage.player = true;
				oneOrTwo = 2;
				$('#name-form').html('Hi ' + name + '! You are player ' + oneOrTwo);
				database.ref().child('player_2').set({
					name: name,
					choice: player2Storage.playerChoice,
					oldChoice: player2Storage.choiceOld,
					wins: player2Storage.playerWins,
					losses:player2Storage.playerLosses
				});
				$("#p1-name").html(snapshot.val().player_1.name);
				$('#p2-name').html(name);
				$('#player1').css('pointerEvents', 'none');
				$('#name-input').val('');
			} else {
				player1Storage.player = true;
				oneOrTwo = 1;
				$('#name-form').html('Hi ' + name + '! You are player ' + oneOrTwo);
				database.ref().child('player_1').set({
					name: name,
					choice: player1Storage.playerChoice,
					oldChoice: player1Storage.choiceOld,
					wins: player1Storage.playerWins,
					losses:player1Storage.playerLosses
				});
				$("#p1-name").html(name);
				$('#player2').css('pointerEvents', 'none');
				$('#name-input').val('');
			}
		});
		return false;
	});
}

if (name === 'No Name') {
	$('#player2, #player1').css('pointerEvents', 'none');
}

printChat();
printInitial();
storeName();
choose();

});


