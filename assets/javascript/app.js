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

var player1 = false;
var player2 = false;
var player1Wins = 0;
var player2Wins = 0;
var player1Losses = 0;
var player2Losses = 0;
var player1Choice = '';
var player2Choice = '';
var oneOrTwo = 1;


database.ref().child('initialize').set({
	active: true 
})

function printInitial() {
	$('<input id="name-input" placeholder="Name">').appendTo('#name-form');
	$('<button id="name-submit">').text('Start').appendTo('#name-form');
}

database.ref().once('value', function(snapshot) {
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
	$(document.body).on('click', div.choice, function() {
		console.log($(this.attr('id')));
		if ($(this).prop('id') === 'p1-choice') {
			player1Choice = $(this).html();
			console.log(player1Choice);
			database.ref().player_1.choice.set({
				choice: player1Choice
			});
		} else if ($(this).prop('id') === 'p2-choice') {
			player2Choice = $(this).html();
			database.ref().player_2.choice.set({
				choice: player2Choice
			});
		}
	});
}

function resetChoices() {
	$('.choice').empty();
	$('<div id="rock">').html('Rock').appendTo('.choice');
	$('<div id="paper">').html('Paper').appendTo('.choice');
	$('<div id="scissors">').html('Scissors').appendTo('.choice');
}

function storeName() {
	$(document).on('click', 'button#name-submit', function() {
		var name = $('#name-input').val().trim();
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

			} 
		});
		$('#name-input').val('');
		return false;
	});
}





printInitial();
storeName();
});


// use the key/timestamps of the node in firebase as a way to identify

// take players name
// assign player one or two
// make all consequential action be a part of the player's firebase object
// firebase should just have two play objects, upon quit or loss, one players object is removed

















// function storeName() {
// 	$(document).on('click', 'button#name-submit', function() {
// 		var name = $('#name-input').val().trim();
// 		if (noPlayers) {
// 			oneOrTwo = 1;
// 			database.ref('player_1').set({
// 				player1: name
// 			});
// 		} else {
// 			oneOrTwo = 2;
// 			database.ref('player_2').set({
// 				player2: name
// 			});
// 		}

// 		$('#name-input').val('');
// 		$('#name-form').empty();
// 		$('<div id="status">').text('Hi ' + name + '! You are player ' + oneOrTwo).appendTo('name-form');
// 		noPlayers = false;
// 		return false;
// 	});
// }

// var adaRef = firebase.database().ref("prsc-47a9d/");
// var key = adaRef.key;                 // key === "ada"
// console.log(key);
// key = adaRef.child("player1/lost").key;  // key === "last"
// console.log(key);

// var usersRef = firebase.database().ref('users');
// var path = usersRef.parent.toString();
		// if (database.ref().child('player_1') == null){
		// 	player2 = true;
		// 	database.ref().child('player_2').set({
		// 			name: name
		// 		});
		// 	console.log(player2);
		// } else {
		// 	player1 = true;
		// 	database.ref().child('player_1').set({
		// 			name: name
		// 		});
		// 	console.log(player1);
		// }
