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
/*                               GLOBALS                               */
/***********************************************************************/

// Solitaire game: arrays for: stockPile, 7 stacks
const stockPile = new Deck();
const stack = [];
for (let i=1; i<8; i++) {
    stack[i] = new Object();
    stack[i].cards = [];
}

// grab divs in html to append card divs to
const stockPileDiv = document.getElementById("stockPileDiv");
const openPileDiv = document.getElementById("openPileDiv");
const stackDivs = document.querySelectorAll(".stack");
const bayDivs = document.querySelectorAll(".bay");

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

// History array to store all moves
var Hist = [];

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

    // DEBUG // console.log all the cards with their piles
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

    let cnt = document.getElementById(cont);                        // grab container div
    let cardDiv = document.createElement('div');                    // create new card div
    cardDiv.classList.add("card", card.color);                      // set card class attributes
    if (card.closed) cardDiv.classList.add("closed");
    cardDiv.innerHTML = `${card.suit}${card.value}`;                // set value text
    cardDiv.dataset.value = `${card.suit}${card.value}`;            // set value in data-value
    cardDiv.setAttribute('draggable', true);                        // enable drag action on div
    cnt.appendChild(cardDiv);                                       // place card in container
} // end of: createCard()


// *****************************************************************
function moveCards(cardDivs, trgtCont) { // move array of selected cardDivs to trgtCont 
// turn any card open that is left behind at the bottom of a stack 
// *****************************************************************

    // determine if card left behind has to be turned
    const notSelCards = cardDivs[0].parentNode.querySelectorAll(":not(.sel)");
    let flip = false;

    if (notSelCards && notSelCards.length > 0) { 

        // if there are cards that will be left behind in the stack or the open pile
        // grab the last card
        let btm =  notSelCards[notSelCards.length-1];

        // flip stores closed state of last card
        flip = btm.classList.contains("closed");

        // make sure bottom card is opened (not with .closed)
        btm.classList.remove("closed");
    }

    // store all movements in move array
    let move = new Move(cardDivs, trgtCont.id, flip);   // create Move object for all cards

    // store move in Hist
    Hist.push(move);

    // DEBUG // console.log(move); 

    // forEach cardDivs move and deselect card
    cardDivs.forEach((el) => {
        trgtCont.appendChild(el);
        el.classList.remove("sel");
    });

    // Check for win condition and provide feedback
    if (openPileDiv.childNodes.length == 0 && document.querySelectorAll(".closed").length == 0) {
        if ( document.getElementsByTagName('h1')[0].style.display == 'none') {
            document.getElementsByTagName('h1')[0].style.display = 'block';
            window.scrollTo(0, 0);
        }
    }

} // end of: moveCards()


// *****************************************************************
function selSibsBelow(card) {  // select all lower siblings from card on
// *****************************************************************

    // retrieve all open cards in this stack/pile
    const stck = card.parentNode.querySelectorAll(":not(.closed)");

    // DEBUG // console.log(stck); 

    // cycle through all siblings, until sel card found
    // then select all further siblings
    
    for(let i=0; i<stck.length; i++) {          // go through all open cards in container
        if(stck[i].classList.contains("sel")) { // find clicked card (which has sel class)
            for(let j=i; j<stck.length; j++) {  // for all further cards in container
                stck[j].classList.add("sel");   // select card by add sel class to card div
            }
            break;                              // no need to check other cards (all are sel)
        }                                       // break out of for loop (and function)
    }
    
} // end of: selSibsBelow()


// *****************************************************************
function Move(cardDivs, trgtCntrId, Flipped) {  // Constructor for Move object
// a Move consists of a source (fromCntr) and a destination container (toCntr)
// Need to store as well: 
//  - how many cards where moved at once (numCrds) 
//  - whether the bottom card in the left-behind stack/pile needed to be flipped 
//
// No need to keep identicification of the cardDiv, since it is always the bottom one.
// No need to store whether card is open or closed. This can be derived from context.
// For each player turn one Move is created and needs to get appended to Hist array.
// *****************************************************************
    this.fromCntr = cardDivs[0].parentNode.id;
    // this.closed = cardDivs[0].classList.contains("closed");
    this.numCrds = cardDivs.length;
    this.toCntr = trgtCntrId;
    this.flip = Flipped;
}


// *****************************************************************
document.getElementById('undoBtn').addEventListener("click", function() {  // Undo button click handler
// Check Hist global var
// Use final entry to undo that user turn
// *****************************************************************

    // if a user turn has been recorded
    if(Hist.length > 0) {

        // DEBUG // console.log("undo from: " + Hist[Hist.length - 1].toCntr + ", to: " + Hist[Hist.length - 1].fromCntr);

        // collect target and source containers from their ids
        const trgtCont = document.getElementById(Hist[Hist.length - 1].fromCntr);
        const srcCont = document.getElementById(Hist[Hist.length - 1].toCntr);

        // record position in the source container for the 1st (maybe only) cardDiv to be moved back
        const srcLngth = srcCont.childNodes.length - Hist[Hist.length - 1].numCrds;

        // flip last card in trgtCont if needed (as recorded in move.flip)
        if(Hist[Hist.length - 1].flip) trgtCont.lastChild.classList.add('closed');

        // Special case: turn back the entire stockPile to openPile, and remove 'closed´for all cards
        if(srcCont.id == "stockPileDiv") {

            // move entire stockPile into openPile (and reverse order)  
            for (let i=0; i<Hist[Hist.length - 1].numCrds; i++ ) {

                // flip closed card of stockPile back into the openPile
                trgtCont.appendChild(srcCont.lastChild);

                // turn cardDiv into "open"
                trgtCont.lastChild.classList.remove("closed");
            }

        } else {  // moved cardDiv(s) do not come from stockPile

            // move card(s) back to fromCntr (stack/openPile)
            for (let i=0; i < Hist[Hist.length - 1].numCrds; i++) {

                trgtCont.appendChild(srcCont.childNodes[srcLngth]);
            }

            // Special case: if moved card goes back to stockPile it needs to turn into 'closed'
            if(trgtCont.id == "stockPileDiv") {
                trgtCont.lastChild.classList.add('closed');
            // } else {
            //     trgtCont.lastChild.classList.remove('closed'); 
            }
        
            // Special case: if srcCont is bay container: update the data-value
            if(srcCont.id.startsWith("bay")) {

                // determine the new value for the bay from moved cardDiv (do minus 1)
                const val = CARD_VALUE_MAP[trgtCont.lastChild.dataset.value.substr(1, 2)] - 1;
                let key = "";

                // reverse map the value to the key
                Object.entries(CARD_VALUE_MAP).map(([k,v]) => {

                    // if correct value found, copy over the associated key
                    if(v == val) key = k;
                });
                
                // replace the data-value attribute of the bay
                srcCont.dataset.value = trgtCont.lastChild.dataset.value.substr(0, 1) + key;

                // DEBUG // console.log("bay val: " + trgtCont.lastChild.dataset.value.substr(0, 1) + key);
            }

        }

        // Remove the move that was just undone from History
        Hist.pop();  

        // Remove any celebratory message, if applicable
        if (openPileDiv.childNodes.length > 0 || document.querySelectorAll(".closed").length > 0) {
            document.getElementsByTagName('h1')[0].style.display = 'none';
        }

    } else {  // there is no History entry

        // DEBUG // console.log("no more Hist to undo");
        alert("You are at the start of the game.");
    }
      
}); // end of: click event on undoBtn

/***********************************************************************/
/*                          DRAG 'N' DROP                              */
/***********************************************************************/

// *****************************************************************
// determine drop target types: stackDivs, bayDivs, cardDivs
stackDivs.forEach(el => {
    el.addEventListener('dragover', allowDrop);
});
bayDivs.forEach(el => {
    el.addEventListener('dragover', allowDrop);
});
cardDivs.forEach(el => {
    el.addEventListener('dragover', allowDrop);
});
function allowDrop(e) {

    e.preventDefault();

}  // end of: allowDrop()


// *****************************************************************
// only single cards can be dragged (simplification)
cardDivs.forEach(el => {
    el.addEventListener('dragstart', dragStart); 
});
// on start; copy over the data-value of the card to be dragged (not used)
// on start; select the card and any below it (in stack only)
// now we can use the same functionality on drop as with the (second) click
function dragStart(e) {

    // DEBUG //
    // console.log("drag starts: " + e.target.dataset.value);
    // e.dataTransfer.setData('text', e.target.dataset.value);

    // deselect all cards
    cardDivs.forEach((el) => el.classList.remove("sel"));

    // select this card
    e.target.classList.add("sel");

    // if card is child of stack then select any other cards below it as well
    if (e.target.parentNode.classList.contains("stack")) selSibsBelow(e.target);

}  // end of: dragStart()


// *****************************************************************
// add event handler for all drop target types: stackDivs, bayDivs, cardDivs 
stackDivs.forEach(el => {
    el.addEventListener('drop', drop);
});
bayDivs.forEach(el => {
    el.addEventListener('drop', drop);
});
cardDivs.forEach(el => {
    el.addEventListener('drop', drop);
});
function drop(e) {

    e.preventDefault();

    // DEBUG //
    // let src = e.dataTransfer.getData('text');
    // console.log("dropped: " + src);
    // console.log("dropped on: " + e.target.dataset.value);

    // perform a click (to prevent coding stuff twice)
    e.target.click();

    // ensure all card are deselected
    cardDivs.forEach((el) => el.classList.remove("sel"));

}  // end of: drop()


/***********************************************************************/
/*                          EVENT LISTENERS                            */
/***********************************************************************/

// stockPile select:
// *****************************************************************
// for Stock Pile add turn card action on click event
stockPileDiv.addEventListener('click', () => {
// *****************************************************************
    
    // retrieve all selected cards
    const selCards = document.querySelectorAll(".sel");
    selCards.forEach((el) => el.classList.remove("sel"));

    // If no card left turn the open pile back to stock pile:
    // reverse order and update attributes
    if (stockPileDiv.childNodes.length == 0) {

        // determine the number of cards that need to be turned over
        const numOfCards = openPileDiv.childNodes.length

        // move openPile into stockPile
        for (let i=0; i<numOfCards; i++ ) {

            // flip shown card of openPile back into the stockPile
            stockPileDiv.appendChild(openPileDiv.lastChild);

            // flip cardDiv into "closed"
            stockPileDiv.lastChild.classList.add("closed");
            
        }
        // Store in Hist: the flip back of all openPile cardDivs into stockPile as a single move  
        const turn = {fromCntr: "openPileDiv", closed: false, numCrds: numOfCards, toCntr: "stockPileDiv", flip: false};
        Hist.push(turn);

    } else { // stockPile has children: just draw one card

        // take last element of stockPileDiv and move to openPileDiv
        openPileDiv.appendChild(stockPileDiv.lastChild);

        // update attributes of cardDiv
        openPileDiv.lastChild.classList.remove("closed");

        // Store in Hist: draw a cardDiv from stockPile to openPile and turn card
        const turn = {fromCntr: "stockPileDiv", closed: true, numCrds: 1, toCntr: "openPileDiv", flip: false};
        Hist.push(turn);
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
        if (element.childElementCount < 1 && selCards && selCards[0].dataset.value.substr(1, 1) === "K") {

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

        } else { // move is not allowed
            // deselect all selected cards
            selCards.forEach((el) => el.classList.remove("sel"));
        }
    }); // end of: onclick for bayDiv
}); // end of: for all bayDivs


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

                    // select any siblings below this card
                    selSibsBelow(element);

                    // DEBUG // console.log("# of sel: " + document.querySelectorAll(".sel").length);

                } else if (element.parentNode.id != "openPileDiv") { // make sure that clicked card is not in openPile (only select one) 

                    // already card(s) selected, this card is target
                    // check if move is allowed: alternate suit colour and  the card value is one less
                    if (SUIT_VALUE_MAP[selCards[0].dataset.value.substr(0, 1)] != SUIT_VALUE_MAP[element.dataset.value.substr(0, 1)] && 
                        CARD_VALUE_MAP[selCards[0].dataset.value.substr(1, 2)] == CARD_VALUE_MAP[element.dataset.value.substr(1, 2)] - 1) {
                           
                        // this card is target, move cardDiv(s) from source to target container
                        moveCards(selCards, element.parentNode);
                        
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


// *****************************************************************
// for each cardDiv; check if card can go to any bay on double click, 
// move card if allowed
cardDivs.forEach(cel => {
    cel.addEventListener('dblclick', () => {
// *****************************************************************

        // DEBUG // console.log("Card Double Clicked: " + cel.dataset.value);

        // check all 4 bays for correct suit and value
        bayDivs.forEach(bel => {

            // DEBUG // console.log("bay " + bel.dataset.value.substr(0,1) + ": " + bel.dataset.value.substr(1, 2));

            // for each bay: if card suit matches and card value is one more than bay
            if (cel.dataset.value.substr(0, 1) == bel.dataset.value.substr(0, 1) && 
                CARD_VALUE_MAP[cel.dataset.value.substr(1, 2)] == CARD_VALUE_MAP[bel.dataset.value.substr(1, 2)] + 1) {

                // DEBUG // console.log("Card can be moved: " + cel.dataset.value);
                
                // replace bay data-value with card data-value
                bel.dataset.value = cel.dataset.value;

                // select this card, in order to determine any card that need to be flipped
                // this card will be deselected later on
                cel.classList.add("sel");

                // in order to use moveCards() the 'cel' needs to be pushed into array
                const cards =[];
                cards.push(cel);

                // append selected card to bay
                moveCards(cards, bel);

            } // end if card belongs on bay

        });

    }); // end of: ondblclick for cardDiv
}); // end of: for all cardDivs
