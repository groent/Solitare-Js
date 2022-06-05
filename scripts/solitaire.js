/***********************************************************************/
/*  solitaire.js                                Waflera Transhumanista */
/*                                                                     */
/*  Solitaire game used as a sandbox to try out different things with  */
/*  JavaScript, and to practise my coding skills                       */
/*  Plain JS, no use of jQuery                                         */
/*                                                                     */
/*  May 2022 - present                                                 */
/*                                                                     */
/*  Refer to Visio (docs/Solitaire.vsd) for HLD and functional design  */
/*                                                                     */
/***********************************************************************/

// built on top of deck.js => credits
import Deck from './deck.js'


/***********************************************************************/
/*                           GLOBALS CREATION                          */
/***********************************************************************/

// Solitaire game: arrays for: stockPile, openPile, 7 stacks
const stockPile = new Deck();
const openPile = new Object();
const stack = [];
for (let i=1; i<8; i++) {
    stack[i] = new Object();
    stack[i].cards = [];
}

const stacks = new Object(); 
openPile.cards  = [];
stacks.cards = [];

// grab divs in html to append card divs to
const restart = document.getElementById("restart");
const stockPileDiv = document.getElementById("stockPileDiv");
const openPileDiv = document.getElementById("openPileDiv");
const stackDivs = document.querySelectorAll(".stack");
const bayDivs = document.querySelectorAll(".bay");
// DEBUG //
console.log(stockPileDiv.id)

// map card face value to integer value
const CARD_VALUE_MAP = {
    "0": 0, // for empty bay
    "A": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13
}
const SUIT_VALUE_MAP = {
    "♠": "black", 
    "♣": "black",
    "♥": "red",
    "♦": "red"
}

/***********************************************************************/
/*                         START OF PROGRAM                            */
/***********************************************************************/
// start program, create all cards
startGame();

// retrieve all created card divs in startGame()
var cardDivs = document.querySelectorAll(".card");


/***********************************************************************/
/*                          MAIN FUNCTIONS                             */
/***********************************************************************/

// *****************************************************************
function startGame() {  // game initialization
// *****************************************************************
    shuffleAndSliceDeck();
    
} // end of: startGame()


// *****************************************************************
function shuffleAndSliceDeck() {  // create all card divs; shuffle and distribute over stockpile and stacks
// this function is only called in startGame() 
// *****************************************************************

stockPile.shuffle(); // 'shuffle()' is defined in deck.js

    // for each stack array do: 
    //      - 'draw' card element from stockPile array
    //      - overload each card object with 'closed' (true/false), 'container' (parent pile)

    for(let i=1; i<8; i++){
        
        // for each card in stack do:
       for( let j=0; j<i; j++){

           // 'draw' one card from stockPile array
           stack[i].cards.push(stockPile.pop());

           // set its container
           stack[i].cards[j].container=`stack${i}`;

           // if final card of stack, make sure to turn it (to open)
           if (j == i - 1) stack[i].cards[j].closed = false;

           // create card div, and append it to container
           createCard(`stack${i}Div`, stack[i].cards[j]);
        }
    }

    // // DEBUG // console.log all the cards with their piles
    // for(let i=1; i<8; i++){
    //     console.log(stack[i].cards);
    // }
    // console.log(stockPile.cards);

    // for all the left-over cards in the stockPile array, create div, and append it to container
    for(let i=0; i<stockPile.cards.length; i++){
        createCard("stockPileDiv", stockPile.cards[i]);
    }
} // end of: shuffleAndSliceDeck()


// *****************************************************************
function createCard(cont, card) {  // given element in array, create card div and append it to 'cont'
// this function is used by shuffleAndSliceDeck() to create a new game in html 
// *****************************************************************

    let ct = document.getElementById(cont);                         // grab container div
    let cardDiv = document.createElement('div');                    // create new card div
    cardDiv.classList.add("card", card.color);                      // set card class attributes
    if (card.closed) cardDiv.classList.add("closed");
    cardDiv.innerHTML = `${card.suit}${card.value}`;                // set value text
    cardDiv.dataset.value = `${card.suit}${card.value}`;            // set value in data-value [OPTIONAL?]
    ct.appendChild(cardDiv);                                        // place card in container
} // end of: createCard()


function isWinner() { // show winner message to user
    
    document.getElementsByTagName('h1')[0].style.display = 'block';

} // end of isWinner()


function moveCards(cardDivs, trgtCont) { // move array of selected cardDivs to trgtCont 

    // determine if card has to be turned
    const notSelCards = cardDivs[0].parentNode.querySelectorAll(":not(.sel)");

    if (notSelCards && notSelCards.length > 0) { 

        // if there are cards that will be left behind in the stack or the open pile
        // make sure bottom card is opened (not with .closed)
        notSelCards[notSelCards.length-1].classList.remove("closed");
    }

    // forEach cardDivs move and deselect card
    cardDivs.forEach((el) => {
        trgtCont.appendChild(el);
        el.classList.remove("sel");
    });

} // end of: moveCards()


/***********************************************************************/
/*                          EVENT LISTENERS                            */
/***********************************************************************/

// *****************************************************************
// for Stock Pile add turn card action on click event
stockPileDiv.addEventListener('click', () => {
// *****************************************************************
    
    // retrieve all selected cards
    const selCards = document.querySelectorAll(".sel");
    selCards.forEach((el) => el.classList.remove("sel"));

    // If no card left turn the open pile back to stock pile.
    // reverse order and update attributes
    if (stockPileDiv.childNodes.length == 0) {

        // copy openPile into stockPile
        const numOfCards = openPileDiv.childNodes.length
        for (let i=0; i<numOfCards; i++ ) {

            stockPileDiv.appendChild(openPileDiv.lastChild);
            // update attributes of cardDiv
            stockPileDiv.lastChild.classList.add("closed");
            
        }

    } else { // stockPile has children
        // cardDiv handling:
        // take last element of stockPileDiv and move to openPileDiv
        openPileDiv.appendChild(stockPileDiv.lastChild);

        // update attributes of cardDiv
        openPileDiv.lastChild.classList.remove("closed");
    }
});


// stack select:
// *****************************************************************
// for each stackDiv; allow stack (not card) as target when stack is empty       
stackDivs.forEach(element => {
    element.addEventListener('click', () => {
// *****************************************************************

        // retrieve all selected cards
        const selCards = document.querySelectorAll(".sel");

        // if stack has no children AND there are cardDivs selected AND top card of selected is King
        if (element.childElementCount < 1 && selCards && selCards[0].dataset.value.substr(1, 2) === "K") {

            // move King to empty stack
            moveCards(selCards, element);

        } else {  
            // if stack has children do nothing 
        }

    }); // end of: onclick for stackDiv
}); // end of: for all stackDivs


// bay select:
// *****************************************************************
// for each bayDiv; allow bay (not card) as target     
bayDivs.forEach(element => {
    element.addEventListener('click', () => {
// *****************************************************************

        // retrieve all selected cards
        const selCards = document.querySelectorAll(".sel");
        
        // if only 1 cardDiv selected AND suits are same AND value is 1+ of bay
        if (selCards && selCards.length == 1 && 
            selCards[0].dataset.value.substr(0, 1) == element.dataset.value.substr(0, 1) && 
            CARD_VALUE_MAP[selCards[0].dataset.value.substr(1, 2)] == CARD_VALUE_MAP[element.dataset.value.substr(1, 2)] + 1) {
                
            // replace bay data-value with card data-value
            element.dataset.value = selCards[0].dataset.value;

            // append selected card to bay
            moveCards(selCards, element);

            // check if win condition has been met
            // if (bayDivs.childElementCount === 56) {
            if (openPileDiv.childNodes.length == 0 && document.querySelectorAll(".closed").length == 0) {
                isWinner();
            }

        } else { // move is not allowed
            // deselect all selected cards
            selCards.forEach((el) => el.classList.remove("sel"));
        }
    }); // end of: onclick for stackDiv
}); // end of: for all stackDivs


// card select:
// *****************************************************************
// for each cardDiv; toggle select card on click, 
// if already other card selected attempt play action       
cardDivs.forEach(element => {
    element.addEventListener('click', () => {
// *****************************************************************
        // DEBUG // console.log("Card Clicked: " + element.dataset.value);

        // retrieve all selected cards
        const selCards = document.querySelectorAll(".sel");

        // if this card is open AND this card is NOT in bay; then it is selectable
        if (!element.classList.contains("closed") && !element.parentNode.classList.contains("bay")) {
            
            // if this card is selected
            if (element.classList.contains("sel")) {

                // deselect all cards
                selCards.forEach((el) => el.classList.remove("sel"));

            } else { // this card is not selected

                if (selCards && selCards.length == 0) {

                    // nothing selected; select this card by adding sel class
                    element.classList.add("sel");

                    // retrieve all open cards in this stack/pile
                    const stck = element.parentNode.querySelectorAll(":not(.closed)");

                    // console.log(stck); // DEBUG //

                    // cycle through all siblings, until sel card found
                    // then select all further siblings
                    
                    for(let i=0; i<stck.length; i++) {          // go through all open cards in container
                        if(stck[i].classList.contains("sel")) { // find clicked card (which has sel class)
                            for(let j=i; j<stck.length; j++) {  // for all further cards in container
                                stck[j].classList.add("sel");   // select card by add sel class to card div
                            }
                            break;                              // no need to check other cards (all are sel)
                        }                                       // break out of for loop
                    }

                } else if (element.parentNode.id != "openPileDiv") { // make sure that clicked card is not in openPile (only select one) 

                    // already card(s) selected, this card is target
                    // check if move is allowed: alternate suit colour and  the card value is one less
                    if (SUIT_VALUE_MAP[selCards[0].dataset.value.substr(0, 1)] != SUIT_VALUE_MAP[element.dataset.value.substr(0, 1)] && 
                        CARD_VALUE_MAP[selCards[0].dataset.value.substr(1, 2)] == CARD_VALUE_MAP[element.dataset.value.substr(1, 2)] - 1) {
                           
                        // this card is target, move cardDiv(s) from source to target container
                        moveCards(selCards, element.parentNode);
                        
                        // check if win condition has been met
                        if (openPileDiv.childNodes.length == 0 && document.querySelectorAll(".closed").length == 0) {
                            isWinner();
                        }

                    } else {    // move conditions have not been satisfied

                        // DEBUG // console.log("this move is not allowed");

                        // deselect all cards
                        selCards.forEach((el) => el.classList.remove("sel"));
                    }
                    
                } else { // try moving card to open pile
                    
                    // DEBUG // console.log("you can't move cards to the open pile")

                    // deselect all cards
                    selCards.forEach((el) => el.classList.remove("sel"));
                }
            }
        } // end of: this card is open and NOT in bay

    }); // end of: onclick for cardDiv
}); // end of: for all cardDivs

// game restart

restart.addEventListener('click', () => {
    // TODO: confirmation pop-up
    window.location.reload();
})

