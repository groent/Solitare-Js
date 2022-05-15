
import Deck from './deck.js'
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

// let stacks;
const stockPileDiv = document.getElementById("stockPileDiv");
const openPileDiv = document.getElementById("openPileDiv");
const stackDivs = document.querySelectorAll(".stack");

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


// start program, create all cards
startGame();
// retrieve all created card divs
var cardDivs = document.querySelectorAll(".card");


//Functions

function startGame() {
    //renderStacks();
    shuffleAndSliceDeck();
    // sliceStacks();
} 



function shuffleAndSliceDeck() {

    stockPile.shuffle();

    
    // for each stack do:
    for(let i=1; i<8; i++){
        
        // for each card in stack do:
       for( let j=0; j<i; j++){
           stack[i].cards.push(stockPile.pop());
           stack[i].cards[j].container=`stack${i}`;
           if (j == i - 1) stack[i].cards[j].closed = false;
           createCard(`stack${i}Div`, stack[i].cards[j]);
        }
        // make the last card of the stack open
        // stack[i].cards[stack[i].cards.length - 1].closed = false;
    }

    // DEBUG //
    for(let i=1; i<8; i++){
        console.log(stack[i].cards);
    }
    console.log(stockPile.cards);

    for(let i=0; i<stockPile.cards.length; i++){
        createCard("stockPileDiv", stockPile.cards[i]);
    }
}

// Not used at the moment
function showCard(div, card) {
    let d = document.getElementById(div);
    // d.classList.add("card", card.color);
    //cardDiv.draggable = true
    d.dataset.value = `${card.value} ${card.suit}`;
    d.innerHTML = `${card.suit} ${card.value}`;
}

function createCard(cont, card) {
    let ct = document.getElementById(cont);                         // grab container div
    let cardDiv = document.createElement('div');                    // create new card div
    cardDiv.classList.add("card", card.color);                      // set card class attributes
    if (card.closed) cardDiv.classList.add("closed");
    cardDiv.innerHTML = `${card.suit}${card.value}`;                // set value text
    cardDiv.dataset.value = `${card.suit}${card.value}`;            // set value in data-value [OPTIONAL?]
    ct.appendChild(cardDiv);                                        // place card in container
}
////////////////////////
////Event Listeners////
//////////////////////

//For Stock Pile add turn card event
stockPileDiv.addEventListener('click', () => {

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


        //  console.log(openPile.cards[0])
         console.log(openPile.cards)
         console.log(stockPile.cards)
    }

    //console.log("Stock Pile CLicked: " + stockPile.cards.length);
    // stockPileDiv.innerHTML = `Stock Pile: ${stockPile.cards.length}`;
    // openPileDiv.innerHTML = `Open Pile: ${openPile.cards.length}`;
});

//stack select

//  stackDivs.forEach(element => {
//     element.addEventListener('click', () => {
//         console.log("Stack Clicked: " + element.id);
//         // stackContent.classList.add('selected')  
//         // stackContent.classList.add('firstStack') 
//       // element.classList.add("selected")
      
     
//     });
//  });

//card select
cardDivs.forEach(element => {
    element.addEventListener('click', () => {
        console.log("Card Clicked: " + element.dataset.value);

        //check if any card is selected
        const selCard = document.querySelectorAll(".sel");


        // if card is closed do nothing
        if (!element.classList.contains("closed")) {
            
            if (element.classList.contains("sel")) {

                // toggle select card
                element.classList.remove("sel");
                selCard.forEach((el) => el.classList.remove("sel"));


            } else {

                if (selCard.length == 0) {

                    // if nothing selected, select this card
                    element.classList.add("sel");

                    // cycle through all siblings, until sel card found
                    // then select all left siblings
                    const stck = element.parentNode.querySelectorAll(":not(.closed)");
                    console.log(stck);
                    for(let i=0; i<stck.length; i++) {
                        if(stck[i].classList.contains("sel")) {
                            for(let j=i; j<stck.length; j++) {
                                stck[j].classList.add("sel");
                            }
                            break;
                        }
                    }

                } else {

                    // already card(s) selected, this card is target

                    // retrieve already selected card container
                    console.log("Source: ");  console.log(selCard);
                    // retrieve this card container
                    console.log("Target: " + element.parentNode.id);

                    // execute action according to source and target container
                    selCard.forEach((el) => element.parentNode.appendChild(el));
                    // element.parentNode.appendChild(selCard[0]);

                    // deselect all previous selected cards
                    selCard.forEach((el) => el.classList.remove("sel"));

                }
               
            }

        }
        // rowContent.classList.add('selected')  
        // rowContent.classList.add('firstStack') 
       
      
     
    });
 });
