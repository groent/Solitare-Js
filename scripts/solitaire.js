/***********************************************************************/
/*  solitaire.js                                Waflera Transhumanista */
/*                                                                     */
/*  Solitaire game used as a sandbox to try out different things with  */
/*  JavaScript, and to practise my coding skills                       */
/*  Plain JS, no use of jQuery                                         */
/*                                                                     */
/*  May 2022 - present                                                 */
/*                                                                     */
/*  Refer to Visio (+++++++++++++) for HLD and functional design       */
/*                                                                     */
/***********************************************************************/

// built on top of deck.js => credits
import Deck from './deck.js'


/***********************************************************************/
/*                           GLOBALS CREATION                          */
/***********************************************************************/

// Solitaire game: stockPile, openPile, 4 bays (not created yet), 7 stacks
const stockPile = new Deck();
const openPile = new Object();
const stack = [];
for (let i=1; i<8; i++) {
    stack[i] = new Object();
    stack[i].cards = [];
}

// DEBUG // this is not used
const stacks = new Object(); 
openPile.cards  = [];
stacks.cards = [];
// let stacks;

// grab divs in html to append card divs to
const stockPileDiv = document.getElementById("stockPileDiv");
const openPileDiv = document.getElementById("openPileDiv");
const stackDivs = document.querySelectorAll(".stack");

// map card face value to integer value
const CARD_VALUE_MAP = {
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
    //renderStacks();
    shuffleAndSliceDeck();
    // sliceStacks();
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

        // DEBUG // make the last card of the stack open
        // stack[i].cards[stack[i].cards.length - 1].closed = false;
    }

    // DEBUG // console.log all the cards with their piles
    for(let i=1; i<8; i++){
        console.log(stack[i].cards);
    }
    console.log(stockPile.cards);

    // for all the left-over cards in the stockPile array, create div, and append it to container
    for(let i=0; i<stockPile.cards.length; i++){
        createCard("stockPileDiv", stockPile.cards[i]);
    }
} // end of: shuffleAndSliceDeck()


function showCard(div, card) { // Not used at the moment
    let d = document.getElementById(div);
    // d.classList.add("card", card.color);
    //cardDiv.draggable = true
    d.dataset.value = `${card.value} ${card.suit}`;
    d.innerHTML = `${card.suit} ${card.value}`;
}

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



/***********************************************************************/
/*                          EVENT LISTENERS                            */
/***********************************************************************/

// *****************************************************************
// for Stock Pile add turn card action on click event
stockPileDiv.addEventListener('click', () => {
// *****************************************************************

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
        console.log("Stock Pile Reloaded");

        // delete all children of openPile
        // openPileDiv.innerHTML = 'Open Pile';

    } else {
        // cardDiv handling:
        // take last element of stockPileDiv and move to openPileDiv
        openPileDiv.appendChild(stockPileDiv.lastChild);
        // update attributes of cardDiv
        openPileDiv.lastChild.classList.remove("closed");


        // DEBUG //  console.log(openPile.cards[0])
         console.log(openPile.cards)
         console.log(stockPile.cards)
    }

    // DEBUG // 
    //console.log("Stock Pile CLicked: " + stockPile.cards.length);
    // stockPileDiv.innerHTML = `Stock Pile: ${stockPile.cards.length}`;
    // openPileDiv.innerHTML = `Open Pile: ${openPile.cards.length}`;
});


// stack select:
// *****************************************************************
// for each stackDiv; allow stack (not card) as target when stack is empty       
stackDivs.forEach(element => {
    element.addEventListener('click', () => {
// *****************************************************************

        // retrieve all selected cards
        const selCard = document.querySelectorAll(".sel")

        // if stack has no children AND there are cardDivs selected
        if (element.childElementCount < 1 && selCard) {

            // TODO: check if selected card is King

            // DEBUG //
            // console.log("can move")
            // check if any card is selected
            // const selCard = document.querySelectorAll(".sel");

            // DEBUG // retrieve already selected card container
            console.log("Source: ");  console.log(selCard);
            // DEBUG // retrieve this container
            console.log("Target: " + element.id);

            // this stack is target, move cardDiv(s) from source to target container
            // execute action according to source and target container
            selCard.forEach((el) => element.appendChild(el));

            // element.parentNode.appendChild(selCard[0]);

            // deselect all selected cards
            selCard.forEach((el) => el.classList.remove("sel"));

            // flip cards closed cards if no open cards left

        } else {  
            // if stack has children do nothing OR throw error 
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
        // DEBUG //
        console.log("Card Clicked: " + element.dataset.value);

        // retrieve all selected cards
        const selCard = document.querySelectorAll(".sel");

        // if this card is closed do nothing
        if (!element.classList.contains("closed")) {
            
            // if this card is selected
            if (element.classList.contains("sel")) {

                // deselect card
                element.classList.remove("sel");

                // also deselect any other card
                selCard.forEach((el) => el.classList.remove("sel"));

            } else { // this card is not selected

                if (selCard.length == 0) {

                    // nothing selected, select this card
                    element.classList.add("sel");

                    // cycle through all siblings, until sel card found
                    // then select all further siblings

                    // retrieve all open cards in this stack/pile
                    // TODO: make sure it is not a child of openPile
                    const stck = element.parentNode.querySelectorAll(":not(.closed)");

                    console.log(stck); // DEBUG //

                    // 
                    for(let i=0; i<stck.length; i++) {
                        if(stck[i].classList.contains("sel")) {
                            for(let j=i; j<stck.length; j++) {
                                stck[j].classList.add("sel");
                            }
                            break;
                        }
                    }

                } else { // other card(s) are selected

                    // DEBUG // retrieve already selected card container
                    console.log("Source: ");  console.log(selCard);
                    // DEBUG // retrieve this card container
                    console.log("Target: " + element.parentNode.id);


                    // already card(s) selected, this card is target
                    // TODO: check is move is allowed

                    // this card is target, move cardDiv(s) from source to target container
                    selCard.forEach((el) => element.parentNode.appendChild(el));
                    // element.parentNode.appendChild(selCard[0]);

                    // deselect all selected cards
                    selCard.forEach((el) => el.classList.remove("sel"));

                }
            }
        } // end of: this card is open

    }); // end of: onclick for cardDiv
}); // end of: for all cardDivs
