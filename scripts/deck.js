const SUITS = ["♠","♣","♥","♦"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
var hidden;
export default class Deck {
    constructor(cards = freshDeck()) {
        this.cards = cards
        
    }

    get numberOfCards () {
        return this.cards.length
    }

    shuffle () {
        for (let i = this.numberOfCards - 1; i > 0; i-- ) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }

    pop() {
        return this.cards.shift()
    }

    push(card) {
        this.cards.push(card)
    }

}

class Card {
    constructor(suit, value){
        this.suit = suit
        this.value = value
        this.closed = true;
        this.draggingJS = false;
    }

    get color() {
        return this.suit === "♠" || this.suit === "♣" ? 'black' : 'red'
    }


     getHTML() {
        const cardDiv = document.createElement('li')
        //cardDiv.innerText = this.suit
        //cardDiv.classList.add("card", this.color)
        //  if (closed = true) {
        // cardDiv.classList.add("cardValue")
        //  cardDiv.draggable = false
        //  cardDiv.dataset.value = `X`
        //  return cardDiv
        //  } else if (hidden = false) {
        /////cardDiv.innerText = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.classList.add("cardValue", "draggable", this.color)
        cardDiv.draggable = true
        
        cardDiv.dataset.value = `${this.value} ${this.suit}`
        
        return cardDiv
       
        // }

        
    }

    
}

function freshDeck () {
    return SUITS.flatMap(suit => {
        return VALUES.map( value => {
            return new Card(suit, value)
        })
    })

}