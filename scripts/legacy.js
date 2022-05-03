
import Deck from './deck.js'
let firstStack, secondStack, thirdStack, fourthStack, fifthStack, sixthStack, seventhStack, stockPile, selectedCards

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


// Row CSS Tags
const firstRowContent = document.querySelector('#firstRow');
const secondRowContent = document.querySelector('#secondRow');
const thirdRowContent = document.querySelector('#thirdRow');
const fourthRowContent = document.querySelector('#fourthRow');
const fifthRowContent = document.querySelector('#fifthRow');
const sixthRowContent = document.querySelector('#sixthRow');
const seventhRowContent = document.querySelector('#seventhRow');
const stockPileContent = document.querySelector('#stockPile');

const firstRowContentClass = document.querySelectorAll('.firstRow');
const secondRowContentClass = document.querySelectorAll('.secondRow');
const thirdRowContentClass = document.querySelectorAll('.thirdRow');
const fourthRowContentClass = document.querySelectorAll('.fourthRow');
const fifthRowContentClass = document.querySelectorAll('.fifthRow');
const sixthRowContentClass = document.querySelectorAll('.sixthRow');
const seventhRowContentClass = document.querySelectorAll('.seventhRow');
const stockPileContentClass = document.querySelectorAll('.stockPile');
//var Cards = document.querySelectorAll('.card');
var selectedCard = document.querySelectorAll('.selected');
var selectedCardNodeList = []



startGame()
function startGame() {
const deck = new Deck()
deck.shuffle()
console.log(deck.cards)


// Get array positions for the cards in each stack

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




function getCardDataAttr (inputElement) {
    let value = inputElement.getAttribute('data-value')
    console.log(value)
    return value
}


function getCardValues (inputValue) {



}
// J ♣
function test () {
    let cards = document.getElementsByClassName("cardValue").item(0)
    getCardDataAttr(cards)
}

test()
//"Render"Values, (Place holder to test game mecanics, it will most likely be phased out once the transition to pixi is made)

 console.log(firstStack.cards)
   
function renderStacks() {

    //Load Decks and Stacks
   
    

    for (let i = 0; i < firstStack.cards.length; i++) {
        // Create Array of visible and hidden cards
             firstRowContent.appendChild(firstStack.cards[i].getHTML());
             
             
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

    //Always have first element of Stack be exposed

    let firstStackCard = firstStack.cards[0];
    let secondStackCard = secondStack.cards[0];
    let thirdStackCard =  thirdStack.cards[0];
    let fourthStackCard = fourthStack.cards[0];
    let fifthStackCard = fifthStack.cards[0];
    let sixthStackCard = sixthStack.cards[0];
    let seventhStackCard = seventhStack.cards[0];
    let stockPileStackCard = stockPile.cards[0];

}

// Test by moving a Card from the First to second Stack

function moveCard(inputStack, destinationStack) {
     
    
     window[inputStack]
     window[destinationStack]

     console.log(inputStack)
     console.log(destinationStack)
let moved = inputStack.cards[0]


destinationStack.push(moved)

console.log(destinationStack)

moveCardAfter()

inputStack.pop()

clearStacks()

renderStacks()

}

function moveCardAfter(destinationStack, moved) {
   
}



const Cards = document.querySelectorAll('.cardValue')
const containers = document.querySelectorAll('.container')




///////////////////
// CLICK EVENTS //
/////////////////

firstRowContentClass.forEach(rowContent => {
    rowContent.addEventListener('click', () => {
        console.log("First Row CLicked")
        rowContent.classList.add('selected')  
        rowContent.classList.add('firstStack') 
       
      checkSelected();
    });
});

secondRowContentClass.forEach(rowContent => {
    rowContent.addEventListener('click', () => {
        console.log("Second Row CLicked")
        rowContent.classList.add('selected')  
        rowContent.classList.add('secondStack') 
        checkSelected();
})
})
thirdRowContentClass.forEach(rowContent => {
    rowContent.addEventListener('click', () => {
        console.log("Third Row CLicked")
        rowContent.classList.add('selected')  
        rowContent.classList.add('thirdStack') 
        checkSelected();
})
})
fourthRowContentClass.forEach(rowContent => {
    rowContent.addEventListener('click', () => {
        console.log("Fourth Row CLicked")
        rowContent.classList.add('selected')  
        rowContent.classList.add('fourthStack') 
        checkSelected();
})
})
fifthRowContentClass.forEach(rowContent => {
    rowContent.addEventListener('click', () => {
        console.log("Fifth Row CLicked")
        rowContent.classList.add('selected')  
        rowContent.classList.add('fifthStack') 
        checkSelected();
})
})
sixthRowContentClass.forEach(rowContent => {
    rowContent.addEventListener('click', () => {
        console.log("Sixth Row CLicked")
        rowContent.classList.add('selected')  
        rowContent.classList.add('sixthStack') 
        checkSelected();
})
})
seventhRowContentClass.forEach(rowContent => {
    rowContent.addEventListener('click', () => {
        console.log("Seventh Row CLicked")
        rowContent.classList.add('selected')  
        rowContent.classList.add('seventhStack') 
        checkSelected();
})
})
stockPileContentClass.forEach(rowContent => {
    rowContent.addEventListener('click', () => {
        console.log("Stockpile CLicked")
        rowContent.classList.add('selected')  
        rowContent.classList.add('stockPile') 
        checkSelected();
})
})





// Cards.forEach(cardDiv => {
//          cardDiv.addEventListener('click', () => {
//         console.log("Card CLicked");
//         cardDiv.classList.add('selected')   
//         styleCard()
//         checkSelected()
//     });
// });

// function styleCard () {
//     let victim = document.querySelectorAll('.selected');   
//     for (let i = 0; i < victim.length; i++) {
//         checkSelected()
//         victim[i].innerHTML = "(selected)";
//         console.log("Got Victim")
        
//     }
    
   
// }
var selected = [];

 function checkSelected() {
     var selectedCardNodeList = document.querySelectorAll('.selected'); 
     console.log(selectedCardNodeList)
    if (selectedCardNodeList.length === 2) {
        for (let i = 0; i < selectedCardNodeList.length; i++) {
           
            selectedCardNodeList[i].classList.remove('.selected')
            
             console.log('removed')

              let classes  = selectedCardNodeList[i].classList.toString()
                let classArr = classes.split(" ");
                console.log(classArr)
                selected[i] = classArr[2]
                console.log(selected)   
                console.log(selected[0], selected[1])     
                checkToMove();
        }
        
        
        
     } 


 }


function checkToMove () {
    if (selected.length === 2) {
        let card1 = selected[0]

        if (card1 === "firstStack") {
            card1 = firstStack
        } else if (card1 === "secondStack") {
            card1 = secondStack
        }   else if (card1 === "thirdStack") {
            card1 = thirdStack
        }   else if (card1 === "fourthStack") {
            card1 = fourthStack
        }else if (card1 === "fifthStack") {
            card1 = fifthStack
        }else if (card1 === "sixthStack") {
            card1 = sixthStack
        }else if (card1 === "seventhStack") {
            card1 = seventhStack
        } else {
            card1 = stockPile
        }

            let card2 = selected[1]

            if (card2 === "firstStack") {
                card2 = firstStack
            } else if (card2 === "secondStack") {
                card2 = secondStack
            }   else if (card2 === "thirdStack") {
                card2 = thirdStack
            }   else if (card2 === "fourthStack") {
                card2 = fourthStack
            }else if (card2 === "fifthStack") {
                card2 = fifthStack
            }else if (car21 === "sixthStack") {
                card2 = sixthStack
            }else if (card2 === "seventhStack") {
                card2 = seventhStack
            } else {
                card2 = stockPile
            }

        // let input1 = window[card1]
        // let input2 = window[card2]

        // console.log(input1)
        // console.log(input2)

        moveCard(card1, card2)
            selected = []

    }


}





//Clear cards (For use to update visuals)

function clearStacks() {

        firstRowContent.innerHTML = ''
        secondRowContent.innerHTML = ''
        thirdRowContent.innerHTML = ''
        fourthRowContent.innerHTML = ''
        fifthRowContent.innerHTML = ''
        sixthRowContent.innerHTML = ''
        seventhRowContent.innerHTML = ''
        stockPileContent.innerHTML = ''

}


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



