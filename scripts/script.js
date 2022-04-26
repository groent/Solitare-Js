import Deck from './deck.js'

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

const computerCardSlot = document.querySelector('.computer-card-slot')
const playerCardSlot = document.querySelector('.player-card-slot')
const computerDeckElement = document.querySelector('.computer-deck')
const playerDeckElement = document.querySelector('.player-deck')
const text = document.querySelector('.text')

// Row CSS Tags
const firstRowContent = document.querySelector('#firstRow')
const secondRowContent = document.querySelector('#secondRow')
const thirdRowContent = document.querySelector('#thirdRow')
const fourthRowContent = document.querySelector('#fourthRow')
const fifthRowContent = document.querySelector('#fifthRow')
const sixthRowContent = document.querySelector('#sixthRow')
const seventhRowContent = document.querySelector('#seventhRow')
const stockPileContent = document.querySelector('#stockPile')

let firstStack, secondStack, thirdStack, fourthStack, fifthStack, sixthStack, seventhStack, stockPile, inRound, playingField, hidden


//Start Round and Listen to Click to Draw a card
//
// document.addEventListener('click', () => {
//     if (stop) {
//         startGame()
//         return
//     }
//     if (inRound) {
//         cleanBeforeRound()
//     } else {
//         flipCards()
//     }
// })



startGame()
function startGame() {
const deck = new Deck()
deck.shuffle()
console.log(deck.cards)


// Get array positions for the cards in each stack

// const deckFirst = Math.ceil(deck.numberOfCards - 51)
// const deckSecond = Math.ceil(deck.numberOfCards - 49)
// const deckThird = Math.ceil(deck.numberOfCards - 46)
// const deckFourth = Math.ceil(deck.numberOfCards - 42)
// const deckFifth =  Math.ceil(deck.numberOfCards - 37)
// const deckSixth =  Math.ceil(deck.numberOfCards - 31)
// const deckSeventh = Math.ceil(deck.numberOfCards - 24)

const deckSlice = [1, 3, 6, 10, 15, 21, 28]

//Create Stacks

firstStack = new Deck(deck.cards.slice(0, deckSlice[0]))
secondStack = new Deck(deck.cards.slice(deckSlice[0], deckSlice[1]))
thirdStack = new Deck(deck.cards.slice(deckSlice[1], deckSlice[2]))
fourthStack = new Deck (deck.cards.slice(deckSlice[2], deckSlice[3]))
fifthStack = new Deck (deck.cards.slice(deckSlice[3], deckSlice[4]))
sixthStack = new Deck (deck.cards.slice(deckSlice[4], deckSlice[5]))
seventhStack = new Deck (deck.cards.slice(deckSlice[5], deckSlice[6]))
stockPile = new Deck (deck.cards.slice(deckSlice[6], deck.numberOfCards))
inRound = false

playingField = [firstStack, secondStack, thirdStack, fourthStack, fifthStack, sixthStack, seventhStack]

//Log Stacks for Debugging Purposes
console.log(firstStack)
console.log(secondStack)
console.log(thirdStack)
console.log(fourthStack)
console.log(fifthStack)
console.log(sixthStack)
console.log(seventhStack)
console.log(stockPile)

renderStacks()


}


//"Render"Values, (Place holder to test game mecanics, it will most likely be phased out once the transition to pixi is made)

// function renderStacks () {
//     // firstRowContent.appendChild(firstStack.cards[0].getHTML());

//     // //Second Row
//     // secondRowContent.appendChild(secondStack.cards[0].getHTML());
//     // secondRowContent.appendChild(secondStack.cards[1].getHTML());
//     // //Third Row
//     // thirdRowContent.appendChild(thirdStack.cards[0].getHTML());
//     // thirdRowContent.appendChild(thirdStack.cards[1].getHTML());
//     // thirdRowContent.appendChild(thirdStack.cards[2].getHTML());
//     // //Fourth
//     // fourthRowContent.appendChild(fourthStack.cards[0].getHTML());
//     // fourthRowContent.appendChild(fourthStack.cards[1].getHTML());
//     // fourthRowContent.appendChild(fourthStack.cards[2].getHTML());
//     // fourthRowContent.appendChild(fourthStack.cards[3].getHTML());
//     // //Fifth
//     // fifthRowContent.appendChild(fifthStack.cards[0].getHTML());
//     // fifthRowContent.appendChild(fifthStack.cards[1].getHTML());
//     // fifthRowContent.appendChild(fifthStack.cards[2].getHTML());
//     // fifthRowContent.appendChild(fifthStack.cards[3].getHTML());
//     // fifthRowContent.appendChild(fifthStack.cards[4].getHTML());
//     // //Sixth
//     // sixthRowContent.appendChild(sixthStack.cards[0].getHTML());
//     // sixthRowContent.appendChild(sixthStack.cards[1].getHTML());
//     // sixthRowContent.appendChild(sixthStack.cards[2].getHTML());
//     // sixthRowContent.appendChild(sixthStack.cards[3].getHTML());
//     // sixthRowContent.appendChild(sixthStack.cards[4].getHTML());
//     // sixthRowContent.appendChild(sixthStack.cards[5].getHTML());
//     // //Seventh
//     // seventhRowContent.appendChild(seventhStack.cards[0].getHTML());
//     // seventhRowContent.appendChild(seventhStack.cards[1].getHTML());
//     // seventhRowContent.appendChild(seventhStack.cards[2].getHTML()); 
//     // seventhRowContent.appendChild(seventhStack.cards[3].getHTML());
//     // seventhRowContent.appendChild(seventhStack.cards[4].getHTML());
//     // seventhRowContent.appendChild(seventhStack.cards[5].getHTML());
//     // seventhRowContent.appendChild(seventhStack.cards[6].getHTML());

//     // firstRowContent.appendChild(firstStack.cards[0].getHTML());
//     // console.log(firstStack.cards)
   

//    
   


// }

function renderStacks() {
    
    for (let i = 0; i < firstStack.cards.length; i++) {
        firstRowContent.appendChild(firstStack.cards[0].getHTML());
    }
    
    for (let i = 0; i < secondStack.cards.length; i++) {
        secondRowContent.appendChild(secondStack.cards[i].getHTML());
    }
    
    for (let i = 0; i < thirdStack.cards.length; i++) {
        thirdRowContent.appendChild(thirdStack.cards[i].getHTML());
    }

    for (let i = 0; i < fourthStack.cards.length; i++) {
        fourthRowContent.appendChild(fourthStack.cards[i].getHTML());
    }

    for (let i = 0; i < fifthStack.cards.length; i++) {
        fifthRowContent.appendChild(fifthStack.cards[i].getHTML());
    }

    for (let i = 0; i < sixthStack.cards.length; i++) {
        sixthRowContent.appendChild(sixthStack.cards[i].getHTML());
    }

    for (let i = 0; i < seventhStack.cards.length; i++) {
        seventhRowContent.appendChild(seventhStack.cards[i].getHTML());
    }

    for (let i = 0; i < stockPile.cards.length; i++) {
        stockPileContent.appendChild(stockPile.cards[i].getHTML());
    }
}

//For every array element render a Value
// Input, rowContent, Stack





// Game itself
// 
// function flipCards() {
//     inRound = true

//     const playerCard = playerDeck.pop()
//     const computerCard = computerDeck.pop()

//     playerCardSlot.appendChild(playerCard.getHTML())
//     computerCardSlot.appendChild(computerCard.getHTML())

//     updateDeckCount()

//     if (isRoundWinner(playerCard, computerCard)) {
//         text.innerText = "Win"
//         playerDeck.push(playerCard)
//         playerDeck.push(computerCard)
//     } else if (isRoundWinner(computerCard, playerCard)) {
//         text.innerText = "Loss"
//         computerDeck.push(playerCard)
//         computerDeck.push(computerCard) 
//     } else {
//         text.innerText = "Draw"
//         playerDeck.push(playerCard)
//         computerDeck.push(computerCard)
//     }
//     if (isGameOver(playerDeck)) {
//         text.innerText = "You Lose!"
//         stop = true;
//     } else if (isGameOver(computerDeck)) {
//         text.innerText = "You Win!"
//         stop = true;
//     }

// }










//Update Deck Count
//
// function cleanBeforeRound() {
//     computerCardSlot.innerHTML = ''
//     playerCardSlot.innerHTML = ''
//     text.innerText = ''
//     inRound = false

//     updateDeckCount()
// }


//Update Deck Count
//
// function updateDeckCount () {
//     computerDeckElement.innerText = computerDeck.numberOfCards
//     playerDeckElement.innerText = playerDeck.numberOfCards
// }

// Check for Victory
//
// function isRoundWinner(cardOne, cardTwo) {
//     return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
// }

//Check for Defeat
//
// function isGameOver (deck) {
//     return deck.numberOfCards === 0
// }