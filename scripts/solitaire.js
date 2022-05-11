
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
const rowDivs = document.querySelectorAll(".row");
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



startGame();


//Functions

function startGame() {
    //renderStacks();
    shuffleAndSliceDeck();
    // sliceStacks();
} 



function shuffleAndSliceDeck() {
    stockPile.shuffle();
    for(let i=1; i<8; i++){
       for( let j=0; j<i; j++){
           stack[i].cards.push(stockPile.pop());
           stack[i].cards[j].container=`stack${i}`;
        } 
    }
    // for(let i=0; i<=27; i++) {
    //     stacks.cards.push(stockPile.pop())
        
    // }
  //  console.log(stacks.cards)
    for(let i=1; i<8; i++){
        console.log(stack[i].cards)
    }
    console.log(stockPile.cards);

}

function sliceStacks() {
    stacks.cards[0].container="stack1";
    //for Loops.
    for (let i=1; i<= 2; i++){
        stacks.cards[i].container="stack2";
    }
    for (let i=3; i<= 5; i++){
        stacks.cards[i].container="stack3";
    }
    for (let i=6; i<= 9; i++){
        stacks.cards[i].container="stack4";
    }
    for (let i=10; i<= 14; i++){
        stacks.cards[i].container="stack5";
    }
    for (let i=15; i<= 20; i++){
        stacks.cards[i].container="stack6";
    }
    for (let i=21; i<= 27; i++){
        stacks.cards[i].container="stack7";
    }
    
}

function appendDivs() {
    
}
////////////////////////
////Event Listeners////
//////////////////////

//For Stock Pile add turn card event
stockPileDiv.addEventListener('click', () => {
    //console.log("Stock Pile CLicked: " + stockPile.cards.length);
    stockPileDiv.innerHTML = `Stock Pile: ${stockPile.cards.length}`;
    openPileDiv.innerHTML = `Open Pile: ${openPile.cards.length}`;
    //If no card left turn the open pile back to stock pile.
    //In reverse order
    if (stockPile.cards.length == 0) {

        // copy openPile into stockPile
        for (let i=0; i<=openPile.cards.length-1; i++ ) {
                stockPile.cards.splice(0, 0, openPile.cards[i]);
                stockPile.cards[0].container="stockPile";
                stockPile.cards[0].closed=true;
        }
        openPile.cards = [];
        // console.log("Stock Pile Reloaded");

    } else {
        //Takes the first element from the Array
        openPile.cards.splice(0, 0, stockPile.pop());
        // openPile.push(stockPile.pop());

         openPile.cards[0].container = "openPile"
         openPile.cards[0].closed = false
        //  console.log(openPile.cards[0])
        //  console.log(openPile.cards)
        //  console.log(stockPile.cards)
    }
});

//Card Select

 rowDivs.forEach(element => {
    element.addEventListener('click', () => {
        console.log("Row Clicked: " + element.id);
        // rowContent.classList.add('selected')  
        // rowContent.classList.add('firstStack') 
       
      
     
    });
 });
