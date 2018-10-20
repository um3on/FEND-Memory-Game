
window.addEventListener('load', new_game);
document.querySelector('.restart').addEventListener('click',new_game);
document.querySelector('.deck').addEventListener('click',card_clicked);
let opened_cards = []; //saves the two cards that are being compared each move
let matches = 0;
let moves = 0; //this variable save the number of PAIRS that were opened and compared
let stars = document.querySelectorAll('.fa-star');
let timer; //timer for keeping cards open


/*
 * Create a list that holds all of your cards (8 pairs)
 */
 let cards=["diamond","diamond",
 			"paper-plane-o","paper-plane-o",
 			"anchor","anchor",
 			"bolt","bolt",
 			"cube","cube",
 			"leaf","leaf",
 			"bicycle","bicycle",
 			"bomb","bomb"];


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
}

//start a new game
function new_game()
{
	//every new game we empty the array and reinitialize the matches and moves variables
	opened_cards = [];
	matches = 0;
	moves = 0;
	
	//Initialize the moves text to zero every new game
	document.querySelector('.moves').textContent = moves;

	//All 3 stars are visible at the begining of each game
	for(let i=0;i<3;i++)
	{
		stars[i].style.visibility = "visible";
	}

	//First step: shuffle the list of cards using the provided "shuffle" method above
	shuffle(cards);

	//Second step: create deck HTML
	let cards_html_string="";
	for(let i =1;i<=cards.length;i++){
		cards_html_string = cards_html_string + "<li class='card'><i class='fa fa-"+ cards[i-1] + "'></i></li>";
	}

	//Third step: update deck elemnt's innerHTML 
	let deck_element = document.querySelector('.deck');
	deck_element.innerHTML = cards_html_string;
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

function card_clicked(e)
{
	//if user clicks same opened card, alert msg and return 
	//I added this condition: opened_cards.length === 1, to make sure this is the second card
	if(opened_cards.length === 1 && e.target === opened_cards[0])
	{
		alert("This card is already open, please choose another card");
		return;
	}

	display_symbol(e.target);
	opened_cards.push(e.target);
	
	
	if(opened_cards.length === 2)//new pair to compare
	{
		update_moves();//updates moves and stars(depending on moves value)

		if(opened_cards[0].firstElementChild.classList.item(1) === opened_cards[1].firstElementChild.classList.item(1))
		{
			matched();

			//if number of matches is 8, this means all cards (8 pairs) are matched
			if(matches === 8)
			{
				alert("Total number of moves: " + moves);
			}
		}
		else
		{
			not_matched();
		}

	}
}

function display_symbol(card)
{
	//display symbole of the last card clicked
	card.classList.add('open','show');
}

function update_moves()
{
	//increment moves
	moves++;

	//update the # of moves on page
	document.querySelector('.moves').textContent = moves;

	//update stars depemding on moves value
	if(moves > 10 ) //lose one star if more than 10 moves
	{
		stars[0].style.visibility = "hidden";
	}

	if(moves > 15 ) //lose the second star if more than 15 moves
	{
		stars[1].style.visibility = "hidden";
	}

	if(moves > 20 ) //lose the third (last) star if more than 20 moves
	{
		stars[2].style.visibility ="hidden";
	}
}

function matched()
{
	//add class "match" to the cards being compared
	opened_cards[0].classList.add('match');
	opened_cards[1].classList.add('match');
	
	//remove event listener to the matched cards
	opened_cards[0].removeEventListener('click',card_clicked);
	opened_cards[1].removeEventListener('click',card_clicked);
	
	//increase matches counter
	matches++;

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
	// opened_cards[0].classList.remove('open','show');
	// opened_cards[1].classList.remove('open','show');
}
