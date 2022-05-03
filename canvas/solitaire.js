

import Deck from '../scripts/deck.js'
let firstStack, secondStack, thirdStack, fourthStack, fifthStack, sixthStack, seventhStack, stockPile, card

//Card 100 x 150
//Canvas Related Variables

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d');
const cardWidth = 35;
const cardLength = 85;




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
    "K": 13,
}


startGame()


//Functions 

function startGame() {
    createStacks()
    renderBoard()
    renderBays()
    renderCard()

}

//These notes might start to seem stupid but I really want my code to be as organized as possible
//
//Make the Canvas Green
function renderBoard() {

    ctx.fillStyle = 'green';
    ctx.fillRect(0,0,canvas.width,canvas.height);

}

function renderBays() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';

    //First Bay
    const firstBay = ctx.fillRect(550,20,100,150);
    const secondBay = ctx.fillRect(660,20,100,150);
    const thridBay = ctx.fillRect(770,20,100,150);
    const fourthBay = ctx.fillRect(880,20,100,150);

}



function renderCard() {
    ctx.fillStyle = 'white'
    var card = ctx.fillRect(0,0,100,150)
    

     
}

function drawValue(width,  height) {
    ctx.fillStyle = "black";
    ctx.font = "30px Verdana"
    let value = ctx.fillText(`${firstStack.cards[0].value}` + `${firstStack.cards[0].suit}`, cardWidth + width, cardLength + height)

}

drawValue()



function createStacks() {
    const deck = new Deck()
    deck.shuffle()
    console.log(deck.cards)
    //Array Positions to slice the Deck to create a Solitaire Desk
    const deckSlice = [1, 3, 6, 10, 15, 21, 28]

    firstStack = new Deck(deck.cards.slice(0, deckSlice[0]))
    secondStack = new Deck(deck.cards.slice(deckSlice[0], deckSlice[1]))
    thirdStack = new Deck(deck.cards.slice(deckSlice[1], deckSlice[2]))
    fourthStack = new Deck (deck.cards.slice(deckSlice[2], deckSlice[3]))
    fifthStack = new Deck (deck.cards.slice(deckSlice[3], deckSlice[4]))
    sixthStack = new Deck (deck.cards.slice(deckSlice[4], deckSlice[5]))
    seventhStack = new Deck (deck.cards.slice(deckSlice[5], deckSlice[6]))
    stockPile = new Deck (deck.cards.slice(deckSlice[6], deck.numberOfCards))

    console.log(firstStack)
    console.log(secondStack)
    console.log(thirdStack)
    console.log(fourthStack)
    console.log(fifthStack)
    console.log(sixthStack)
    console.log(seventhStack)
    console.log(stockPile)
}