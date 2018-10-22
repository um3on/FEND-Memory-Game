/*
 * Create a list that holds all of your cards
 */

let opened_cards = []; //saves the two cards that are being compared each move
let matches = 0;
let moves = 0; //this letiable save the number of PAIRS that were opened and compared
let stars = document.querySelectorAll('.fa-star');
let symbols=["diamond","diamond",
 			"paper-plane-o","paper-plane-o",
 			"anchor","anchor",
 			"bolt","bolt",
 			"cube","cube",
 			"leaf","leaf",
 			"bicycle","bicycle",
 			"bomb","bomb"];

let first ="", second = "";//first and second cards to compare

let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;
let setIntervalValue ="";


// **************** Modal  ************************
//Code: https://www.w3schools.com/howto/howto_css_modals.asp

// Get the modal
let modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// *************************************************


document.querySelector('.restart').addEventListener('click',new_game);


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function prepare_deck() {
	//First step: shuffle the list of symbols using the provided "shuffle" method above
	shuffle(symbols);


	//Second step: create deck HTML
	//used data attribute as in Mike's webinar
	let cards_html_string="";
	for(let i = 1; i <= symbols.length ; i++) {
		cards_html_string = cards_html_string + "<li class='card' data-symbol='"+ symbols[i-1] + "'><i class='fa fa-"+ symbols[i-1] + "'></i></li>";
	}

	//Third step: update deck elemnt's innerHTML 
	let deck_element = document.querySelector('.deck');
	deck_element.innerHTML = cards_html_string;
}

//call new_game() function to play
new_game();

function new_game() {

	reinitialize();
	prepare_deck();

	/*
 	* Create a list that holds all of your cards
 	*/

	let cards = document.querySelectorAll('.card',);
 	cards.forEach(function(card) {
 		card.addEventListener('click',function(e) {
 			card_clicked(card,e);
 		});
 	});
}
 

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 function card_clicked(card,e) {

 	start_timing();
 	//first card: dispaly symbol on card and push it in opened_cards for later comparing.
 	if(opened_cards.length === 0) {

 		if(card.classList.contains('match')) {
 			setTimeout(function() {
				card.classList.add('shaking');
			},10);

			card.classList.remove('shaking');
 		}
 		else {
 			//display symbol on the card.
			display_symbol(card);

	 		//add it to opened_cards array for comparing.
			opened_cards.push(card);

			first = opened_cards[0];
 		}
 	}
 	else {

 		//if this is a SECOND card (this condition to prevent user from opening more than 2 cards at a time)
	 	if(opened_cards.length === 1) {

	 		//remove shaking calss from first card in case class was added.
			if(first.classList.contains('shaking')) {
				first.classList.remove('shaking');
			}

	 		//first we check if same card is chosen, do nothing.
		 	if(e.currentTarget === first) {
				setTimeout(function() {
					first.classList.add('shaking');
				},10);
			}

			//else display symbol on second card, push it to opened_cards array then compare both cards.
			else {
				//if second card choose was an already matched card then
				if(card.classList.contains('match')) {
		 			setTimeout(function() {
						card.classList.add('shaking');
					},10);
	 			}

	 			else {
					//display symbol on the card.
					display_symbol(card);

					//add it to opened_cards array for comparing.
					opened_cards.push(card);

					second = opened_cards[1];

					//updates moves and stars(depending on moves value), everytime a user opens a pair of cards
					update_moves();

					//compare cards if matching
					if(first.dataset.symbol === second.dataset.symbol) {
						matched();
						
						//after calling matched(), check if we reached end of game(8 matches), if yes then call end_game() function.
						if(matches === 8) {
							end_game();
					 	}
					}
					//cards do not match
					else {
						not_matched();
					}
				}
			}
		}
	}
 }

 function display_symbol(c) {
	//display symbol of the last card clicked
	c.classList.add('open','show');
}


function update_moves() {
	//increment moves
	moves++;

	//update the # of moves on page
	document.querySelector('.moves').textContent = moves;

	//update stars depemding on moves value
	if(moves > 10 ) {//lose one star if more than 10 moves
		stars[0].style.visibility = "hidden";
	}

	if(moves > 15 ) {//lose the second star if more than 15 moves
		stars[1].style.visibility = "hidden";
	}

	if(moves > 20 ) {//lose the third (last) star if more than 20 moves
		stars[2].style.visibility ="hidden";
	}
}


function matched() {
	//add class "match" to the cards being compared
	first.classList.add('match');
	second.classList.add('match');
	
	//increase matches counter
	matches++;

	opened_cards = [];
	first = "";
	second = "";
}

function not_matched() {
	//if not matched, remove the classes(open & show) from cards in the opened cards array
	//keep cards open for 1 second before hiding them
	setTimeout(function() {
		opened_cards.forEach(function(c) {
			c.classList.remove('open','show');
		});

		opened_cards = [];
		first = "";
		second = "";
	},800);
}

//for EVERY game re/initialize variables
function reinitialize() {
	//every new game we empty the array and reinitialize the matches and moves variables
	opened_cards = [];
	first ="";
	second = "";
	matches = 0;
	moves = 0;
	
	//Initialize the moves text to zero every new game
	document.querySelector('.moves').textContent = moves;

	//All 3 stars are visible at the begining of each game
	for(let i=0;i<3;i++) {
		stars[i].style.visibility = "visible";
	}

	if(setIntervalValue !== "") {
		//stop setInterval function
		clearInterval(setIntervalValue); 
		setIntervalValue = "";
		//reinitialize totalSeconds
		totalSeconds = 0;
	}

	//reinitialize seconds and minutes labels to 00
	secondsLabel.innerHTML = "00";
	minutesLabel.innerHTML = "00";
}

function end_game() {
	let result = "";
	if(moves <= 10) {
		result = "WOW, Excellent Job!";
	}
		
	if(moves>10 && moves<=15) {
		result = "Good Job!";
	}
		
	if(moves>15) {
		result = "You can do better."
	}

	end_timing();

	// Add output text to modal.
	let outputElement = document.querySelector('#output');
	let minutesText = "";
	if(minutesLabel.innerText > "00") {
		minutesText = minutesLabel.innerText + (minutesLabel.innerText === "01" ? " minute and" : " minutes and");
	}

	let secondsText = secondsLabel.innerText + (secondsLabel.innerText === "01" ? " second" : " seconds");

	outputElement.innerHTML = "<strong>" + result + "</strong><br>You finished the game in " + minutesText + secondsText +", using " + moves + " moves." ;

	//display modal
	modal.style.display = "block";
}


//Timer code: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
//******************************************************************************************
function start_timing() {
	if(setIntervalValue === "") {
		setIntervalValue = setInterval(setTime, 1000);
	}
}

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
//******************************************************************************************

function end_timing() {
	clearInterval(setIntervalValue);
}