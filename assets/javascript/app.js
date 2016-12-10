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
	playerChoice: ''
};

var player2Storage = {
	player: false,
	playerWins: 0,
	playerLosses: 0,
	playerChoice: ''
};

var name = 'No Name';
var nameFirebase = '';
var oneOrTwo = 1;
var chatCounter = 0000;
var bg;
var player;
var data;

database.ref().child('initialize').set({
	active: true 
})

function wait(waitFunc) {
    counter = setTimeout(waitFunc, 2000);
}

function printInitial() {
	$('<input id="name-input" placeholder="Choose A Player Icon">').appendTo('#name-form');
	$('#chat-output').empty();
	if (name === 'No Name') {
		$('#player2, #player1').css('pointerEvents', 'none');
	}
	database.ref().once('value', function(snapshot) {
		if (snapshot.child('chat').exists()) {
			$('#chat-output').empty();
		}
	});
}

function trigger() {
	database.ref().child('trigger').push({
		trigger: true
	});
}

function printChat() {
	var chat = database.ref().child('chat');
	var init = database.ref().child('initialize');
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
}

function chatCountSet() {
	database.ref().child('chatCount').set({
		chatCounts: chatCounter
	});
}

function iconChoose() {
	$('.elements').on('click', function() {
		var chosenIcon = $(this);
		data = chosenIcon.data('type');
		bg = chosenIcon.css('background-image');
		chosenIcon.siblings().remove();
		chosenIcon.css({
			transform: 'scale(5)',
			marginTop: '250px',
			marginLeft: '25%'
		});
		$('#name-input').attr('placeholder', '       ...Now You May Enter Your Name    ________    & Press "Enter" to begin');
		$('#name-input').focus();
	});
}

function whoIsPlayer() {
	if (oneOrTwo === 2) {
		player = $('#player1');
	} else {
		player = $('#player2');
	}
}

database.ref().on('value', function(snapshot) {

	var chatNode = snapshot.child('chatCount');
	chatCounter = chatNode.child('chatCounts').val();
	chatCounter++;
	var p1Node = snapshot.child('player_1');
	var answer1 = p1Node.child('choice').val();
	var p2Node = snapshot.child('player_2');
	var answer2 = p2Node.child('choice').val();
	var chosen1 =  p1Node.child('chosen').val();
	var chosen2 =  p2Node.child('chosen').val();

	if (chosen1 && chosen2) {
		if (answer1 === "Rock" && answer2 === "Paper") {
			uponWin(answer1, answer2, p1Node, p2Node);
			player2Win(p2Node);
			trigger();
			wait(resetChoices);
			wait(resetResult);
		}
		else if (answer1 === "Rock" && answer2 === "Scissors") {
			uponWin(answer1, answer2, p1Node, p2Node);
			player1Win(p1Node);
			trigger();
			wait(resetChoices);
			wait(resetResult);
		}
		else if (answer1 === "Rock" && answer2 === "Rock") {
			$('#result').html("Tie!");
			uponWin(answer1, answer2, p1Node, p2Node);
			wait(resetChoices);
			wait(resetResult);
		}
		else if (answer1 === "Paper" && answer2 === "Rock") {
			uponWin(answer1, answer2, p1Node, p2Node);
			player1Win(p1Node);
			trigger();
			wait(resetChoices);
			wait(resetResult);
		}
		else if (answer1 === "Paper" && answer2 === "Paper") {
			$('#result').html("Tie!");
			uponWin(answer1, answer2, p1Node, p2Node);
			wait(resetChoices);
			wait(resetResult);
		}
		else if (answer1 === "Paper" && answer2 === "Scissors") {
			uponWin(answer1, answer2, p1Node, p2Node);
			player2Win(p2Node);
			trigger();
			wait(resetChoices);
			wait(resetResult);
		}
		else if (answer1 === "Scissors" && answer2 === "Paper") {
			uponWin(answer1, answer2, p1Node, p2Node);
			player1Win(p1Node);
			trigger();
			wait(resetChoices);
			wait(resetResult);
		}
		else if (answer1 === "Scissors" && answer2 === "Scissors") {
			$('#result').html("Tie!");
			uponWin(answer1, answer2, p1Node, p2Node);
			wait(resetChoices);
			wait(resetResult);
		}
		else if (answer1 === "Scissors" && answer2 === "Rock") {
			uponWin(answer1, answer2, p1Node, p2Node);
			player2Win(p2Node);
			trigger();
			wait(resetChoices);
			wait(resetResult);
		} 
	} 

	if (snapshot.child("player_1").exists() && snapshot.child("player_2").exists()) {
		updatePlayer1(p1Node);
		updatePlayer2(p2Node);
	} else if (snapshot.child("player_1").exists()) {
		updatePlayer1(p1Node);
		resetPlayer2();
	} else if (snapshot.child("player_2").exists()) {
		updatePlayer2(p2Node);
		resetPlayer1();
	} else {
		resetPlayer1();
		resetPlayer2();
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
		chosen: false
	});
	database.ref().child('player_2').update({
		chosen: false
	});
	$('#p1-choice').css('fontSize', '36px').html(answer1);
	$('#p2-choice').css('fontSize', '36px').html(answer2);
}

function updatePlayer1(node) {
	$("#p1-name").html(node.child('name').val());
	$("#p1-wins").html("Wins: " + node.child('wins').val());
	$("#p1-losses").html("Losses: " + node.child('losses').val());
	$('#image').css({
			'background-image': node.child('icon').val(),
			'background-size': '225px 225px'
		});
}

function updatePlayer2(node) {
	$("#p2-name").html(node.child('name').val());
	$("#p2-wins").html("Wins: " + node.child('wins').val());
	$("#p2-losses").html("Losses: " + node.child('losses').val());
	$('#enemy-pic').css({
			'background-image': node.child('icon').val(),
			'background-size': '225px 225px'
		});
}

function choose() {
	$(document.body).on('click', 'div.choices', function(event) {
		$('#result').empty();
		var chosenID = $(this).parent().attr('id');
		var choice = $(this).html();
		if (choice === "Rock") {
			player.html("A naturally occurring substance, a solid aggregate of one or more minerals or mineraloids. For example, granite, a common rock, is a combination of the minerals quartz, feldspar and biotite.");
		} else if (choice === "Paper") {
			player.html("A thin material produced by pressing together moist fibres of cellulose pulp derived from wood, rags or grasses, and drying them into flexible sheets.");
		} else if (choice === "Scissors"){
			player.html("A pair of metal blades pivoted so that the sharpened edges slide against each other when the handles (bows) opposite to the pivot are closed. Used for cutting various thin materials, such as paper, cardboard, metal, and cloth.");
		}
		// $('#result').html(choice);
		if (chosenID === 'p1-choice') {
			player1Storage.playerChoice = choice;
			database.ref().child('player_1').update({
				choice: choice,
				chosen: true
			});
			$('#p1-choice').css('fontSize', '36px').html(choice);
		} else if (chosenID === 'p2-choice') {
			player2Storage.playerChoice = choice;
			database.ref().child('player_2').update({
				choice: choice,
				chosen: true
			});
			$('#p2-choice').css('fontSize', '36px').html(choice);
		}
	});
}

function resetChoices() {
	$('.choice').empty();
	$('.choice').css('fontSize', '14px');
	$('<div class="choices rock">').html('Rock').appendTo('.choice');
	$('<div class="choices paper">').html('Paper').appendTo('.choice');
	$('<div class="choices scissors">').html('Scissors').appendTo('.choice');
}

function resetResult() {
	$('#result').html('Select a defense');
	player.html('');
}

function resetPlayer1() {
	$("#p1-name").html("Waiting for Player1");
	$("#p1-wins").html("Wins: " + 0);
	$("#p1-losses").html("Losses: " + 0);
}

function resetPlayer2() {
	$("#p2-name").html("Waiting for Player2");
	$("#p2-wins").html("Wins: " + 0);
	$("#p2-losses").html("Losses: " + 0);
}

function storeName() {
	$(document).on('keypress', 'input#name-input', function(e) {
		if (e.which == 13) {
	        e.preventDefault();
			$('#result').empty();
			$('#player2, #player1').css('pointerEvents', 'auto');
			name = $('#name-input').val().trim();
			var chat = database.ref().child('chat');
			chatCountSet();
			database.ref().once('value', function(snapshot) {
				if (snapshot.child("player_1").exists() && snapshot.child("player_2").exists()) {
					alert("Queing for position... Try again soon.");
					$("#p1-name").html(snapshot.val().player_1.name);
					$("#p2-name").html(snapshot.val().player_2.name);
					$('#image').css({
						'background-image': snapshot.val().player_1.icon,
						'background-size': '225px 225px'
					});
					$('#enemy-pic').css({
						'background-image': snapshot.val().player_2.icon,
						'background-size': '225px 225px'
					});
				} else if (snapshot.child("player_1").exists()) {
					player2Storage.player = true;
					oneOrTwo = 2;
					nameFirebase = 'player_2';
					$('#name-form').html('You have actived player ' + oneOrTwo + ' With the confirmation - ' + name);
					$('#result').html('Select a Defense');
					database.ref().child('player_2').set({
						name: name,
						choice: player2Storage.playerChoice,
						wins: player2Storage.playerWins,
						losses: player2Storage.playerLosses,
						icon: bg
					});
					$("#p1-name").html(snapshot.val().player_1.name);
					$('#p2-name').html(name);
					$('#descript').append("&quot;" + data + "&quot;");
					$('#image').css({
						'background-image': snapshot.val().player_1.icon,
						'background-size': '225px 225px'
					});
					$('#enemy-pic').css({
						'background-image': bg,
						'background-size': '225px 225px'
					});
					$('#player1').css('pointerEvents', 'none');
					$('#player1').html('');
					$('#name-input').val('');
					chat.child('chat' + chatCounter).set({
						chat: name + " has joined the game."
					});
				} else {
					player1Storage.player = true;
					oneOrTwo = 1;
					nameFirebase = 'player_1';
					$('#name-form').html('You have actived player ' + oneOrTwo + ' With the confirmation - ' + name);
					$('#result').html('Choose a weapon');
					database.ref().child('player_1').set({
						name: name,
						choice: player1Storage.playerChoice,
						wins: player1Storage.playerWins,
						losses:player1Storage.playerLosses, 
						icon: bg
					});
					$("#p1-name").html(name);
					$('#descript2').append("&quot;" + data + "&quot;");
					$('#image').css({
						'background-image': bg,
						'background-size': '225px 225px'
					});
					$('#player2').css('pointerEvents', 'none');
					$('#player2').html('');
					$('#name-input').val('');
					chat.child('chat' + chatCounter).set({
						chat: name + " has joined the game."
					});
				}
			});
		} whoIsPlayer();
	});
}


function leaveGame() {
	$(window).on('beforeunload', function() {
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
iconChoose();
storeName();
choose();
leaveGame();

});
