/*
 * Create a list that holds all of your cards
 */
var opened_cards = []; //saves the two cards that are being compared each move
var matches = 0;
var moves = 0; //this variable save the number of PAIRS that were opened and compared
var stars = document.querySelectorAll('.fa-star');
var timer; //timer for keeping cards open
var symbols=["diamond","diamond",
 			"paper-plane-o","paper-plane-o",
 			"anchor","anchor",
 			"bolt","bolt",
 			"cube","cube",
 			"leaf","leaf",
 			"bicycle","bicycle",
 			"bomb","bomb"];

document.querySelector('.restart').addEventListener('click',new_game);


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function prepare_deck(){
	//First step: shuffle the list of symbols using the provided "shuffle" method above
	shuffle(symbols);


	//Second step: create deck HTML
	var cards_html_string="";
	for(var i = 1; i <= symbols.length ; i++){
		cards_html_string = cards_html_string + "<li class='card' data-symbol='"+ symbols[i-1] + "'><i class='fa fa-"+ symbols[i-1] + "'></i></li>";
	}

	//Third step: update deck elemnt's innerHTML 
	var deck_element = document.querySelector('.deck');
	deck_element.innerHTML = cards_html_string;
}

//call new_game() function to play
new_game();

function new_game(){

	reinitialize();
	prepare_deck();

	/*
 	* Create a list that holds all of your cards
 	*/

	var cards = document.querySelectorAll('.card');
 	cards.forEach(function(card){
 		card.addEventListener('click',function(e)
 		{
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
 
 function card_clicked(card,e){

 	if(opened_cards.length === 1 && e.target === opened_cards[0])
		{
			alert("This card is already open, please choose another card");
			return;
		}

		//display symbol on the card.
		display_symbol(card);

		opened_cards.push(card);

		if(opened_cards.length === 2)//new pair to compare
		{
			if(opened_cards[0].dataset.symbol === opened_cards[1].dataset.symbol)
			{
				matched();
				
				//after calling matched(), check if we reached end of game(8 matches), if yes then alert message to user.
				var output = "";
 				if(matches === 8){
			 		if(moves <= 7){
			 			output = "WOW, Excellent Job!";
			 		}
			 		
			 		if(moves>7 && moves<=13){
			 			output = "Good Job!";
			 		}
			 		
			 		if(moves>13){
			 			output = "You can do better."
			 		}

			 		alert(output + " You finished the game using " + moves + " mismatches.");
			 	}
			}
			else
			{
				not_matched();
				update_moves();//updates moves and stars(depending on moves value)
			}
		}
 }

 function display_symbol(c)
{
	//display symbole of the last card clicked
	c.classList.add('open','show');
}


function update_moves()
{
	//increment moves
	moves++;

	//update the # of moves on page
	document.querySelector('.moves').textContent = moves;

	//update stars depemding on moves value
	if(moves > 7 ) //lose one star if more than 10 moves
	{
		stars[0].style.visibility = "hidden";
	}

	if(moves > 13 ) //lose the second star if more than 15 moves
	{
		stars[1].style.visibility = "hidden";
	}

	if(moves > 18 ) //lose the third (last) star if more than 20 moves
	{
		stars[2].style.visibility ="hidden";
	}
}


function matched()
{
	//add class "match" to the cards being compared
	opened_cards[0].classList.add('match');
	opened_cards[1].classList.add('match');
	
	//increase matches counter
	matches++;

	//remove event listener from matched cards
	opened_cards.forEach(function(oc){
		oc.removeEventListener('click',card_clicked);
	});

	opened_cards = [];
}

function not_matched()
{
	//if not matched, remove the classes(open & show) from cards in the opened cards array
	//keep cards open for 1 second before hiding them
	setTimeout(function(){
		opened_cards.forEach(function(c){
			c.classList.remove('open','show');
		});
		opened_cards = [];
	},1000);
}

//for EVERY game re/initialize variables
function reinitialize()
{
	//every new game we empty the array and reinitialize the matches and moves variables
	opened_cards = [];
	matches = 0;
	moves = 0;
	
	//Initialize the moves text to zero every new game
	document.querySelector('.moves').textContent = moves;

	//All 3 stars are visible at the begining of each game
	for(var i=0;i<3;i++)
	{
		stars[i].style.visibility = "visible";
	}
}