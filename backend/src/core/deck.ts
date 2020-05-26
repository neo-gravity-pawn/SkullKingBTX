import { CardCollection } from '@core/cardCollection';
import { MutableCard } from './mutableCard';
import { Card, CardColor, CardType } from "./card";

export class Deck extends CardCollection {
    constructor() {
        super();
        this.addColorCards();
        this.addOtherCards();
    }

    private addColorCards() {
        const colors = [CardColor.red, CardColor.blue, CardColor.yellow, CardColor.black];
        colors.forEach( (color: CardColor) => {
            for (let value = 1; value <= 13; value ++) {
                this.addCard(
                    new Card({type: (color === CardColor.black) ? CardType.trump : CardType.color , color, value })
                );
            }
        })      
    }

    private addOtherCards() {
        for (let i = 0; i < 5; i++) {
            this.addCard(new Card({type: CardType.pirate}));
            this.addCard(new Card({type: CardType.escape}));
        }
        for (let i = 0; i < 2; i++) {
            this.addCard(new Card({type: CardType.mermaid}));
        }
        this.addCard(new Card({type: CardType.skullking}));
        this.addCard(new MutableCard(CardType.scarymary,
            [new Card({type: CardType.pirate}), new Card({type: CardType.escape})]
        ));
    }

    public shuffle() {
        // Fisher-Yates shuffle
        // https://javascript.info/task/shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
          }
    }
}