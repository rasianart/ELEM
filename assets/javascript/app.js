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
var nameFirebase = '';
var oneOrTwo = 1;
var chatCounter = 0000;

database.ref().child('initialize').set({
	active: true 
})

function trigger() {
	database.ref().child('trigger').push({
		trigger: true
	});
}

function wait(waitFunc) {
    counter = setTimeout(waitFunc, 3000);
}

function printInitial() {
	$('<input id="name-input" placeholder="Name">').appendTo('#name-form');
	$('<button id="name-submit">').text('Start').appendTo('#name-form');
	$('#chat-output').empty();
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
		chatCountSet();
		chat.child('chat' + chatCounter).set({
			chat: message
		});
		var lastMessage = '';
		$('#chat-input').val('');
	});
		chat.orderByChild("dateAdded").on('child_added', function(snapshot) {
		lastMessage = snapshot.val().chat;
		var chatBox = $('#chat-output');
		chatBox.append(lastMessage + '\n');
		$(chatBox).scrollTop($(chatBox)[0].scrollHeight);
	});
	if (name !== "No Name") {
		$('#chat-output').empty();
	}
}

function printLastChat(chat, lastMessage) {
	chat.orderByChild("dateAdded").on('child_added', function(snapshot) {
		lastMessage = snapshot.val().chat;
		var chatBox = $('#chat-output');
		chatBox.append(lastMessage + '\n');
		$(chatBox).scrollTop($(chatBox)[0].scrollHeight);
	});
}

function chatCountSet() {
	database.ref().child('chatCount').set({
		chatCounts: chatCounter
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
			uponWin(answer1, answer2);
			player2Win(p2Node);
			trigger();
			wait(resetChoices);
		}
		else if (answer1 === "Rock" && answer2 === "Scissors") {
			uponWin(answer1, answer2);
			player1Win(p1Node);
			trigger();
			wait(resetChoices);
		}
		else if (answer1 === "Rock" && answer2 === "Rock") {
			$('#result').html("Tie!");
			uponWin(answer1, answer2);
			wait(resetChoices);
		}
		else if (answer1 === "Paper" && answer2 === "Rock") {
			uponWin(answer1, answer2);
			player1Win(p1Node);
			trigger();
			wait(resetChoices);
		}
		else if (answer1 === "Paper" && answer2 === "Paper") {
			$('#result').html("Tie!");
			uponWin(answer1, answer2);
			wait(resetChoices);
		}
		else if (answer1 === "Paper" && answer2 === "Scissors") {
			uponWin(answer1, answer2);
			player2Win(p2Node);
			trigger();
			wait(resetChoices);
		}
		else if (answer1 === "Scissors" && answer2 === "Paper") {
			uponWin(answer1, answer2);
			player1Win(p1Node);
			trigger();
			wait(resetChoices);
		}
		else if (answer1 === "Scissors" && answer2 === "Scissors") {
			$('#result').html("Tie!");
			uponWin(answer1, answer2);
			wait(resetChoices);
		}
		else if (answer1 === "Scissors" && answer2 === "Rock") {
			uponWin(answer1, answer2);
			player2Win(p2Node);
			trigger();
			wait(resetChoices);
		} 
	} else {
		wait(resetChoices);
	}

	if (snapshot.child("player_1").exists() && snapshot.child("player_2").exists()) {
		updatePlayer1(snapshot);
		updatePlayer2(snapshot);
	} else if (snapshot.child("player_1").exists()) {
		updatePlayer1(snapshot);
	} else if (snapshot.child("player_2").exists()) {
		updatePlayer2(snapshot);
	}
});

function player1Win(p1Node) {
	player1Storage.playerWins++;
	player2Storage.playerLosses++;
	database.ref().child('player_1').update({
		wins: player1Storage.playerWins
	});
	database.ref().child('player_2').update({
		losses: player2Storage.playerLosses
	});
	var winner = p1Node.child('name').val();
	$('#result').html(winner + " Wins!");
}

function player2Win(p2Node) {
	player2Storage.playerWins++;
	player1Storage.playerLosses++;
	database.ref().child('player_2').update({
		wins: player2Storage.playerWins
	});
	database.ref().child('player_1').update({
		losses: player1Storage.playerLosses
	});
	var winner = p2Node.child('name').val();
	$('#result').html(winner + " Wins!");
}

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
	$("#p1-wins").html("Wins: " + snapshot.val().player_1.wins);
	$("#p1-losses").html("Losses: " + snapshot.val().player_1.losses);
}

function updatePlayer2(snapshot) {
	$("#p2-name").html(snapshot.val().player_2.name);
	$("#p2-wins").html("Wins: " + snapshot.val().player_2.wins);
	$("#p2-losses").html("Losses: " + snapshot.val().player_2.losses);
}

function choose() {
	$(document.body).on('click', 'div.choices', function(event) {
		$('#result').empty();
		var chosenID = $(this).parent().attr('id');
		var choice = $(this).html();
		$('#result').html(choice);
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
	$('.choice').css('fontSize', '14px');
	$('<div id="rock" class="choices">').html('Rock').appendTo('.choice');
	$('<div id="paper" class="choices">').html('Paper').appendTo('.choice');
	$('<div id="scissors" class="choices">').html('Scissors').appendTo('.choice');
}

function storeName() {
	$(document).on('click', 'button#name-submit', function() {
		$('#player2, #player1').css('pointerEvents', 'auto');
		name = $('#name-input').val().trim();
		var chat = database.ref().child('chat');
		chatCountSet();
		chat.child('chat' + chatCounter).set({
			chat: name + " has joined the game."
		});
		database.ref().once('value', function(snapshot) {
			if (snapshot.child("player_1").exists() && snapshot.child("player_2").exists()) {
				alert("Queing for position... Try again soon.");
				$("#p1-name").html(snapshot.val().player_1.name);
				$("#p2-name").html(snapshot.val().player_2.name);
			} else if (snapshot.child("player_1").exists()) {
				player2Storage.player = true;
				oneOrTwo = 2;
				nameFirebase = 'player_2';
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
				nameFirebase = 'player_1';
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

function leaveGame() {
	$(window).unload(function() {
		database.ref().child('chat').remove();
		database.ref().child(nameFirebase).remove();
		var chat = database.ref().child('chat');
		chatCountSet();
		chat.child('chat' + chatCounter).set({
			chat: name + " has been disconnected."
		});

	});
}

printChat();
printInitial();
storeName();
choose();
leaveGame();

});
