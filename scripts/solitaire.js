/***********************************************************************/
/*  solitaire.js                                Waflera Transhumanista */
/*                                                                     */
/*  Solitaire game used as a sandbox to try out different things with  */
/*  JavaScript, and to practise my coding skills                       */
/*  Plain JS, no use of jQuery                                         */
/*                                                                     */
/*  May 2022 - August 2022                                             */
/*  February 2024: bug fixes                                           */
/*                                                                     */
/*  Refer to Visio (docs/Solitaire.vsd) for HLD and functional design  */
/*                                                                     */
/***********************************************************************/

// built on top of deck.js => credits
import { readCkie, writeCkie, clearCkie, sleep, shuffle } from './utils.min.js';

/***********************************************************************/
/*                               GLOBALS                               */
/***********************************************************************/

// grab divs in html to append card divs to
const stockPileDiv = document.querySelector("#stockPileDiv");
const openPileDiv = document.querySelector("#openPileDiv");
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
// face values of cards (with '0'to match CARD_VALUE_MAP)
const CARD_VALUES = ["0", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
// suits of cards
const CARD_SUITS = ["♠","♥","♦","♣"];
// map suit to colour
const SUIT_VALUE_MAP = {
    "♠": "black", 
    "♣": "black",
    "♥": "red",
    "♦": "red"
}

// History array to store all moves
var Hist = [];

// All created card divs in newGame(), with their event handlers
var cardDivs = [];

// Canvas coords for (previously) selected cardDivs in onclick(), used for animation in MoveCards()
var Coords = {};
Coords.top = 0, Coords.left = 0;

/***********************************************************************/
/*                         START OF PROGRAM                            */
/***********************************************************************/
// Solitaire game: only 1 shuffled deck needed
// 2024: Deck is created in 'New Game' or 'Reload Game' 
// Start of program now only loads:
// - the html, 
// - the callbacks for the buttons, and 
// - the handlers of all the containers

/***********************************************************************/
/*                          MAIN FUNCTIONS                             */
/***********************************************************************/


// *****************************************************************
function newGame() {  // game initialization: create stock pile and store in cookie
// create all card divs; shuffle and distribute over stock pile and stacks
// *****************************************************************

    // Delete all cards and clear any history - remove any previous game
    cardDivs.forEach((el) => el.parentNode.removeChild(el));
    bayDivs.forEach((el) => el.dataset.ord = 0);
    clearCkie("SolHist");
    document.querySelector('h1').style.display = 'none';
    document.querySelector('#winBtn').style.display = 'none';
    Hist = [];

    // Create a new shuffled deck of cards
    let ord = shuffle(52);
    let cards = new Array(52);

    for (let i=0; i<52; i++){
        cards[i] = {};
        cards[i].container = "stockPile";
        cards[i].selected = false;
        cards[i].value = CARD_VALUES[ ord[i]%13 + 1 ];      // ord(0..51)%[0 - 12] -> [1 - 13]
        cards[i].suit = CARD_SUITS[Math.floor(ord[i]/13)];  // [0 - 3]
        cards[i].colour = SUIT_VALUE_MAP[cards[i].suit];
    }

    let stockPile = {};
    stockPile.cards = [];
    stockPile.cards = cards;

    // store the order of cards in localStorage
    writeCkie("SolDeck", JSON.stringify(stockPile));

    // Create cards
    // for each stack array do: 
    // - 'draw' card element from stockPile array
    // - overload each card object with 'container' (parent pile)

    let card = {};
    let num = 0;

    for(let i=1; i<8; i++){
        
        // for each card in stack do:
       for( let j=0; j<i; j++){

            // 'draw' one card from stockPile array
            card = stockPile.cards.shift();

            // set its container
            card.container=`stack${i}`;

            // create card div, and append it to container
            createCard(`stack${i}Div`, card);

           // if final card of stack, make sure to turn it (to open)
           if (j == i - 1) document.querySelector(`#stack${i}Div`).lastChild.classList.remove("closed");
        }
    }

    // for all the left-over cards in the stockPile array, 
    // create div and append it to parent container 
    for(let i=0; i<stockPile.cards.length; i++){

        // set colour separately to align with rldGame()
        stockPile.cards[i].colour = SUIT_VALUE_MAP[stockPile.cards[i].suit];

        // create card div, and append it to container
        createCard("stockPileDiv", stockPile.cards[i]);
    }

    AddCardHandlers();

} // end of: newGame()


// *****************************************************************
async function rldGame() {  // game reload; read stock pile from cookie
// create all card divs; shuffle and distribute over stock pile and stacks
// *****************************************************************
    
    // Delete all cards and clear any history - remove any previous game
    cardDivs.forEach((el) => el.parentNode.removeChild(el));
    bayDivs.forEach((el) => el.dataset.ord = 0);
    document.querySelector('h1').style.display = 'none';
    document.querySelector('#winBtn').style.display = 'none';

    // Reload old shuffled deck
    let stockPile = JSON.parse(readCkie("SolDeck"));

    // if no cookie, then break out of rldGame
    if( stockPile === null) {
        stockPile = [];
        alert("No previous game stored.");
        return false;
    }

    // Create cards
    // for each stack array do: 
    // - 'draw' card element from stockPile array
    // - overload each card object with 'container' (parent pile)
    // - add color attribute, since card comes from array, not object

    let card = {};

    for(let i=1; i<8; i++){
        
        // for each card in stack do:
        for( let j=0; j<i; j++){

            // 'draw' one card from stockPile array
            card = stockPile.cards.shift();

            // set its container
            card.container=`stack${i}`;

            // set colour separately to align with rldGame()
            // card.colour = SUIT_VALUE_MAP[card.suit];

            // create card div, and append it to container
            createCard(`stack${i}Div`, card);

            // if final card of stack, make sure to turn it (to open)
            if (j == i - 1) document.querySelector(`#stack${i}Div`).lastChild.classList.remove("closed");
        }
    }

    // for all the left-over cards in the stockPile array, create div, and append it to container
    for(let i=0; i<stockPile.cards.length; i++){

        // set colour separately to align with rldGame()
        // stockPile.cards[i].colour = SUIT_VALUE_MAP[stockPile.cards[i].suit];

        // create card div, and append it to container
        createCard("stockPileDiv", stockPile.cards[i]);
    }

    AddCardHandlers(); // add all handlers for the card divs

    // attempt to load history array of moves 
    Hist = JSON.parse(readCkie("SolHist"));
    
    // is there any History that can be loaded?
    if( Hist != null) {
    
        console.log("reload game:"+ Hist.length); // DEBUG // 

        // there is some history parsed
        // reenact the game by clicking through the history
        let moves = Hist.length;

        for( let i=0; i<moves; i++){

            // For each Hist item perform the two clicks to move the card
            // no need for checks since the move was deemed legal in any case

            // find the correct index of the card that was selected (childNodes will also count label!)
            let indx = document.querySelector("#" + Hist[i].fromCntr).childElementCount + 1 - Hist[i].numCrds;

            // ensure nothing is selected
            document.querySelectorAll(".sel").forEach((el) => el.classList.remove("sel"));

            // every click will add to Hist history, so the history will become polluted.
            // this will need to be corrected once the entire Hist has been traversed through
            // (Hist.length has been captured before the first 'click')

            // perform first click
            // Special case: stockPile div handles the click (never recipient)
            if( Hist[i].fromCntr == "stockPileDiv" ) {
                document.querySelector("#" + Hist[i].fromCntr).click();

            // Special case: openPile always only move last child (never recipient)
            } else if( Hist[i].fromCntr == "openPileDiv" ){
                // wait a bit first
                await sleep(200);
                document.querySelector("#" + Hist[i].fromCntr).lastChild.click();

            // standard cases: click on card
            } else {
                // wait a bit first
                await sleep(200);
                document.querySelector("#" + Hist[i].fromCntr).childNodes[indx].click();
            }

            // then perform second click on the last card of the target container 
            // or empty cntr if there are no child elements (only label)
            if( document.querySelector("#" + Hist[i].toCntr).childElementCount > 0 ) {
                document.querySelector("#" + Hist[i].toCntr).lastChild.click()
            } else {
                document.querySelector("#" + Hist[i].toCntr).click();
            }

        }  // end of: for all moves
    }  // end of: History is not null

    // restore history to before the reload, since clicks have been added...
    Hist = JSON.parse(readCkie("SolHist"));

    // If there was no history, the ReadCkie would set Hist to null
    if( Hist == null) {
        Hist = []; // Hist was filled with null pointer
        console.log("Hist = [], after reload"); // DEBUG //
    }
    console.log("reload successful; history length:" + Hist.length); // DEBUG //
    
} // end of: rldGame()
    
// *****************************************************************
function AddCardHandlers() {  // add all handlers on the newly created card divs
// this function is called in newGame() and rldGame()
// *****************************************************************

    // first resize all stack containers for better wrapping
    // stackDivs.forEach(sdiv => {
    //     sdiv.style.height = 6.5 + (sdiv.childElementCount - 1) * 2 + 'rem'; 
    // });
    

    // *************************************************************
    // create a handle for all the card divs and
    // create event listeners for cards 
    // *************************************************************
        
    cardDivs = document.querySelectorAll(".card");

    // add drag 'n' drop event listeners to  all the card divs
    cardDivs.forEach(el => {
        el.addEventListener('dragstart', dragStart); 
    });
    cardDivs.forEach(el => {
        el.addEventListener('dragover', allowDrop);
    });
    cardDivs.forEach(el => {
        el.addEventListener('drop', drop);
    });
    
    // *************************************************************
    // card select handler
    // *****************************************************************
    // for each cardDiv; toggle select card on click, 
    // if already other card selected attempt play action       
    cardDivs.forEach(cel => {
        cel.addEventListener('click', () => {
        // *****************************************************************

            // DEBUG // console.log("Card Clicked: " + cel.innerText);

            // retrieve all selected cards
            const selCards = document.querySelectorAll(".sel");

            // if this card is open AND this card is NOT in bay; then it is selectable
            if (!cel.classList.contains("closed") && !cel.parentNode.classList.contains("bay")) {
                
                // if this card is selected
                if (cel.classList.contains("sel")) {

                    // deselect all cards
                    selCards.forEach((el) => el.classList.remove("sel"));

                } else { // this card is not selected

                    if (selCards && selCards.length == 0) {

                        // nothing selected; select this card by adding sel class
                        cel.classList.add("sel");

                        // select any siblings below this card
                        selSibsBelow(cel);

                        // store coords of clicked card for later animation in MoveCards()
                        Coords.top = Math.round(cel.getBoundingClientRect().top);
                        Coords.left = Math.round(cel.getBoundingClientRect().left);
                        // console.log("card ("+ Coords.left +","+ Coords.top +")");  // DEBUG // 

                        // DEBUG // console.log("# of sel: " + document.querySelectorAll(".sel").length);

                    } else if (cel.parentNode.id != "openPileDiv") { // make sure that clicked card is not in openPile (only select one) 

                        // already card(s) selected, this card is target
                        // check if move is allowed: alternate suit colour and  the card value is one less
                        if (selCards[0].dataset.colour != cel.dataset.colour && 
                            parseInt(selCards[0].dataset.ord) == parseInt(cel.dataset.ord) - 1) {
                        
                            // this card is target, move cardDiv(s) from source to target container
                            moveCards(selCards, cel.parentNode);
                            
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

            // DEBUG // console.log("Card Double Clicked: " + cel.innerText);

            // check all 4 bays for correct suit and value
            bayDivs.forEach(bel => {

                // for each bay: if card suit matches and card value is one more than bay
                if (cel.dataset.suit == bel.dataset.suit && 
                    parseInt(cel.dataset.ord) == parseInt(bel.dataset.ord) + 1) {

                    // DEBUG // console.log("Card can be moved: " + cel.innerText);
                    
                    // replace bay data-value with card data-value
                    bel.dataset.ord = cel.dataset.ord;

                    // select this card, in order to determine any card that need to be flipped
                    // this card will be deselected later on
                    cel.classList.add("sel");

                    // in order to use moveCards() the 'cel' needs to be pushed into array
                    const cards =[];
                    cards.push(cel);

                    // append selected card to bay
                    moveCards(cards, bel);

                    // make card undraggable
                    bel.lastChild.setAttribute('draggable', false);

                } // end if card belongs on bay

            });

        }); // end of: ondblclick for cardDiv
    }); // end of: for all cardDivs

} // end of: AddCardHandlers()
    

// *****************************************************************
function createCard(cont, card) {  // given element in array, create card div and append it to 'cont'
    // this function is used by newGame() and rldGame() 
    // *****************************************************************
    
    let cnt = document.querySelector('#' + cont);                   // grab container div
    let cardDiv = document.createElement('div');                    // create new card div
    cardDiv.classList.add("card", card.colour, "closed");           // set card class attributes
    cardDiv.innerHTML = `${card.value}<br />${card.suit}<span>${card.value}<br />${card.suit}</span>`;                // set value text
    cardDiv.dataset.value = `${card.suit}${card.value}`;            // set value in data-value
    cardDiv.dataset.suit = card.suit;                               // set suit in data-suit
    cardDiv.dataset.colour = card.colour;                           // set suit colour in data-colour
    cardDiv.dataset.ord = CARD_VALUE_MAP[card.value];               // set ordinal in daata-ord
    cardDiv.setAttribute('draggable', true);                        // enable drag action on div
    cnt.appendChild(cardDiv);                                       // place card in container
} // end of: createCard()
    

// *****************************************************************
function moveCards(mveDivs, trgtCont) { // move array of selected cardDivs to trgtCont 
// turn any card open that is left behind at the bottom of a stack 
// *****************************************************************

    // determine if card left behind has to be turned
    const notSelCards = mveDivs[0].parentNode.querySelectorAll(".card:not(.sel)");
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
    let move = new Move(mveDivs, trgtCont.id, flip);   // create Move object for all cards

    // store move in Hist
    Hist.push(move);

    let dx = 0, dy = 0;

    // forEach mveDivs move and deselect card
    mveDivs.forEach((el) => {
        trgtCont.appendChild(el);
        el.classList.remove("sel");

        // check coords and setup transition by comparing coords with Coords from selection click
        dx = el.getBoundingClientRect().left - Coords.left; 
        dy = el.getBoundingClientRect().top - Coords.top;
        // DEBUG // console.log("card now ("+ Math.round(el.getBoundingClientRect().left) +","+ Math.round(el.getBoundingClientRect().top) +")");  // DEBUG // 
        el.classList.add("anim");    // card will be moved on top of all other cards

        // move card back (instantly) to original position
        el.style.left = -dx + "px";  
        el.style.top = -dy + "px";

        // perform animation over .5s
        el.style.cssText += `transition: transform 0.5s ease; transform: translate(${dx}px, ${dy}px);`;

        // wait for it to finish, then remove all obsolete styling and remove anim class
        // this could cause a race condition, but I wasn't able to force it...
        setTimeout(() => { el.style.cssText = ""; el.classList.remove("anim");}, [500]);

    });

    // Check for win condition and provide feedback
    if (winCond()) {
        if ( document.querySelector('h1').style.display != 'block') {
            document.querySelector('h1').style.display = 'block';
            document.querySelector('#winBtn').style.display = 'block';
            window.scrollTo(0, 0);
        }
    }

} // end of: moveCards()

// *****************************************************************
function winCond() {  // will return false when not all stacks are properly sorted
// returns true when win condition is met, false when game not over yet
// *****************************************************************

    let notYet = 0;  // assume win condition

    // cycle through each stack
    stackDivs.forEach((div) => {

        // check if stack has cards
        if(div.childElementCount > 0) {

            // check if the entire stack is sorted
            selSibsBelow(div.querySelectorAll(".card")[0]);

            // check if there's any .nope cards; means no win
            notYet += document.querySelectorAll(".closed").length;

            // remove any selection in this stack
            div.querySelectorAll(".card").forEach((el) => el.classList.remove("sel"));

        }  // end of: if any children
    });  // end of: for each stack

    return !notYet; // not not yet, meaning: win? yes: true, no: false

}  // end of: winCond()
    

// *****************************************************************
function selSibsBelow(card) {  // select all lower siblings from card on
// *****************************************************************

    // retrieve all open cards in this stack/pile
    const stck = card.parentNode.querySelectorAll(".card:not(.closed)");

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
// No need to keep identification of the cardDiv, since it is always the bottom one.
// No need to store whether card is open or closed. This can be derived from context.
// For each player turn one Move is created and needs to get appended to Hist array.
// *****************************************************************
    this.fromCntr = cardDivs[0].parentNode.id;
    this.numCrds = cardDivs.length;
    this.toCntr = trgtCntrId;
    this.flip = Flipped;

}  // end of: Move()


// *****************************************************************
// Globals that are used in winSequence()
var Dir = 1;     // direction of animation (left/right)
var Zndx = 1;    // z-index is upped for each bouncing animation


// *****************************************************************
async function winSequence(card) {  // Completes a bouncing sequence for a single card
// Creates many cloned divs of a single card (pref. in one of the bays)
//
// To be used during the MS-like card bouncing celebration
// Uses Global vars above to ensure each new card sequence displays on top of all previous ones
// *****************************************************************

// reset of variables inside function
    let i = 1;                                      // counter for x-axis (always increments)
    let j = 0;                                      // counter for y-axis (first increments, then decreases)
    let dy = .5;                                    // delta y (height)
    let dx = 2;                                     // delta x (left/right)
    let jmax = 1;                                   // count of bounce down
    let f = x => .5 * x * x;                        // function: f(x) = .5 x^2
    let rndm = Math.floor(Math.random() * 30) - 14; // random start on function x= -15 <=> 15
    let vo = -f(rndm);                              // vertical offset, enter rndm into function 
    Dir *= -1;                                      // switch direction from previous bounce series

    // L = left of bay
    // R = total width minus right of bay 
    // H = total height minus minus card height
    const L = card.parentNode.getBoundingClientRect().right;
    const R = window.innerWidth - card.parentNode.getBoundingClientRect().right;
    const H = window.innerHeight - card.parentNode.getBoundingClientRect().height; 

    var createAniCard = function(i, j) {  // function only used inside the Win Sequence

        return new Promise(function(resolve, reject) {

            // create clone, assign 'anim' class
            const clone = card.cloneNode(true);
            clone.classList.add("anim");
            clone.style.zIndex = Zndx;

            // append clone to bay (so same node level as cloned card)
            card.parentNode.appendChild(clone);

            // offset clone to card
            dy = f(j) + vo;   // function: f(x) = .5 x^2 + offset   // value gets passed out
            dx = 2*i;                                               // value gets passed out
            clone.style.top =  dy + "px";
            clone.style.left = Dir * dx + "px";

            resolve(dx, dy);
        });
    }

    // ** start of actual function **


    // keep bouncing until clone is off the page
    while ( dy < H && ((Dir<0 && dx<L) || (Dir>0 && dx<R)) ) {

        // console.log("vert offset on bounce down: " + vo); // DEBUG //
        j = rndm; // vertically bounce starts over every time at same point in function

        // bounce down
        while ( dy < H && ((Dir<0 && dx<L) || (Dir>0 && dx<R)) ) {

            createAniCard(i, j).then(await sleep(3));
            i++; j++;
        } // end of: while bottom border not reached

        // bounce up to lesser height: 90% from previous
        // dx (i) keeps growing in one direction, dy (j) goes up and down

        vo += .1 * dy; // vertical offset delta is 10%
        jmax = parseInt(.9 * (j-1)); // bounce back = 90% of original
        vo = dy - (.5 * jmax * jmax);

        for (let j = jmax; j>-rndm; j--) {
            createAniCard(i, j).then(await sleep(3));
            i++;
        }
    } // end of: while left/right border not reached

    Zndx++; // next time winSequence() is called the divs will be placed on top

}  // end of: winSequence()


/***********************************************************************/
/*                 ON-CLICK HANDLERS FOR BUTTONS                       */
/***********************************************************************/
// this section is run during page load


// *****************************************************************
document.querySelector('#winBtn').addEventListener("click", async function() {  // Win button click handler
    // Helper functions are located just above this section:
    // - Global vars definition that are used in:
    // - async function winSequence(card) = creates a complete bouncing of a single card
    // - shuffle(array of cards)
    // *****************************************************************
    // disable button against accidental double click
    this.disabled = true;
    
    // collect all cards that are candidate for animation; only spades and diamonds
    let crds = document.querySelectorAll('#bay♠Div .card:not(.anim), #bay♦Div .card:not(.anim)');
    let arr = shuffle(crds.length);
    let count = crds.length < 6? crds.length : 6;   // make sure there are enough cards (really only for debugging)

    // pick random card from collection (cannot be a repeat)
    for (let i=0; i<count; i++) await winSequence(crds[arr[i]]);

    // collect all cards that are candidate for animation; only hearts and clubs
    crds = document.querySelectorAll('#bay♥Div .card:not(.anim), #bay♣Div .card:not(.anim)');
    arr = shuffle(crds.length);
    count = crds.length < 4? crds.length : 4;
    for (let i=0; i<count; i++) await winSequence(crds[arr[i]]);

    document.querySelectorAll(".anim").forEach((el) => el.classList.add("turn")); 

    // re-enable celebrate button
    this.disabled = false;

});  // end of: click event on winBtn
    
    
    
// *****************************************************************
document.querySelector('#newBtn').addEventListener("click", function() {  // New Game button click handler
// *****************************************************************

    // in case the win sequence has been shown
    document.querySelectorAll(".card.anim").forEach((el) => el.remove());

    newGame();

}); // end of: click event on newBtn


// *****************************************************************
document.querySelector('#rldBtn').addEventListener("click", function() {  // Reload Game button click handler
// *****************************************************************

    // in case the win sequence has been shown
    document.querySelectorAll(".card.anim").forEach((el) => el.remove());

    rldGame();

}); // end of: click event on rldBtn


// *****************************************************************
document.querySelector('#sveBtn').addEventListener("click", function() {  // Save Game button click handler
// *****************************************************************

    // in case the win sequence has been shown
    document.querySelectorAll(".card.anim").forEach((el) => el.remove());

    console.log("history length:" + Hist.length);
    if ( Hist.length == 0 ) {
        alert("Cannot save any progress. Try reloading game first.");
    } else {
        writeCkie("SolHist", JSON.stringify(Hist));
    }

}); // end of: click event on sveBtn


// *****************************************************************
document.getElementById('undoBtn').addEventListener("click", function() {  // Undo button click handler
// Check Hist global var
// Use final entry to undo that user turn
// *****************************************************************

    // in case the win sequence has been shown
    document.querySelectorAll(".card.anim").forEach((el) => el.remove());

    // if a user turn has been recorded
    if (Hist && Hist.length > 0) {

        // DEBUG // console.log("undo from: " + Hist[Hist.length - 1].toCntr + ", to: " + Hist[Hist.length - 1].fromCntr);

        // collect target and source containers from their ids
        const trgtCont = document.querySelector('#' + Hist[Hist.length - 1].fromCntr);
        const srcCont = document.querySelector('#' + Hist[Hist.length - 1].toCntr);

        // record position in the source container for the 1st (maybe only) cardDiv to be moved back
        const srcLngth = srcCont.childNodes.length - Hist[Hist.length - 1].numCrds;

        // flip last card in trgtCont if needed (as recorded in move.flip)
        if(Hist[Hist.length - 1].flip) trgtCont.lastChild.classList.add('closed');

        // Special case: turn back the entire stockPile to openPile, and remove 'closed' for all cards
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
            }
        
            // Special case: if srcCont is bay container:
            if(srcCont.id.startsWith("bay")) {

                // update the data-ord attribute of bay container
                srcCont.dataset.ord = parseInt(trgtCont.lastChild.dataset.ord) - 1;

                // make card draggable again
                trgtCont.lastChild.setAttribute('draggable', true);                        
            }
        }

        // Remove the move that was just undone from History
        Hist.pop();  

        // Remove any celebratory message, if applicable
        if (!winCond()) {
            document.querySelector('h1').style.display = 'none';
            document.querySelector('#winBtn').style.display = 'none';
        }

    } else {  // there is no History entry

        alert("You are at the start of the game.");
    }
      
}); // end of: click event on undoBtn


/***********************************************************************/
/*                          DRAG 'N' DROP                              */
/***********************************************************************/
// this section is run during page load

// *****************************************************************
// determine drop target types: stackDivs, bayDivs, cardDivs
stackDivs.forEach(el => {
    el.addEventListener('dragover', allowDrop);
});
bayDivs.forEach(el => {
    el.addEventListener('dragover', allowDrop);
});
function allowDrop(e) {

    e.preventDefault();

}  // end of: allowDrop()


// *****************************************************************
function dragStart(e) {
// only single cards can be dragged (simplification)
// on start; copy over the data-value of the card to be dragged (not used)
// on start; select the card and any below it (in stack only)
// now we can use the same functionality on drop as with the (second) click

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
function drop(e) {

    e.preventDefault();

    // perform a click (to prevent coding stuff twice)
    e.target.click();

    // ensure all card are deselected
    cardDivs.forEach((el) => el.classList.remove("sel"));

}  // end of: drop()


/***********************************************************************/
/*                          EVENT LISTENERS                            */
/***********************************************************************/
// this section is run during page load

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
        const turn = {fromCntr: "openPileDiv", numCrds: numOfCards, toCntr: "stockPileDiv", flip: false};
        Hist.push(turn);

    } else { // stockPile has children: just draw one card

        // take last element of stockPileDiv and move to openPileDiv
        openPileDiv.appendChild(stockPileDiv.lastChild);

        // update attributes of cardDiv
        openPileDiv.lastChild.classList.remove("closed");

        // Store in Hist: draw a cardDiv from stockPile to openPile and turn card
        const turn = {fromCntr: "stockPileDiv", numCrds: 1, toCntr: "openPileDiv", flip: false};
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
        const selCards = document.querySelectorAll(".card.sel");

        // if stack has no children AND there are cardDivs selected AND top card of selected is King
        if (element.childElementCount < 1 && selCards && selCards[0].dataset.ord === "13") {

            // move King to empty stack
            moveCards(selCards, element);
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
            selCards[0].dataset.suit == element.dataset.suit && 
            parseInt(selCards[0].dataset.ord) == parseInt(element.dataset.ord) + 1) {
                
            // replace bay data-value with card data-value
            element.dataset.ord = selCards[0].dataset.ord;

            // append selected card to bay
            moveCards(selCards, element);

        } else { // move is not allowed

            // deselect all selected cards
            selCards.forEach((el) => el.classList.remove("sel"));
        }
    }); // end of: onclick for bayDiv
}); // end of: for all bayDivs
