import { Card, CardType } from './card';
import { MutableCardIndexOutsideRangeError } from './error';


export class MutableCard extends Card {
    private cards: Array<Card>;
    private mType: CardType;
    private selectedCardIndex = 0;
    constructor(type: CardType, cards: Array<Card>) {
        super();
        this.cards = cards;
        this.setConfiguration();
        this.mType = type;
    }

    private setConfiguration() {
        this.configuration = this.cards[this.selectedCardIndex].conf;
    }

    public selectCard(index: number) {
        if (index < 0 || index >= this.cards.length) {
            throw new MutableCardIndexOutsideRangeError(this.cards.length - 1);
        }
        this.selectedCardIndex = index;
        this.setConfiguration();
    }

    get mutableType() {
        return this.mType;
    }
}

export function isMutableCard(card: Card) {
    return (card instanceof MutableCard)
}