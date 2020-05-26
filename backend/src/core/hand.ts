import { CardType } from './card';
import { CardCollection } from '@core/cardCollection';
import { isMutableCard, MutableCard} from '@core/mutableCard';


export class Hand extends CardCollection {
    cardTypeOrder = [
        CardType.skullking,
        CardType.scarymary,
        CardType.pirate,
        CardType.mermaid,
        CardType.trump,
        CardType.color,
        CardType.escape
    ]

    public sort() {
        const valueCards = [
            CardType.trump,
            CardType.color
        ]
        
        const cards = this.cards.filter( a => valueCards.indexOf(a.type) === -1 );
        const vCards = this.cards.filter( a => valueCards.indexOf(a.type) !== -1);
        cards.sort((a, b) => {
            const aType = isMutableCard(a) ? (a as MutableCard).mutableType : a.type;
            const bType = isMutableCard(b) ? (b as MutableCard).mutableType : b.type;
            return (this.cardTypeOrder.indexOf(aType) - this.cardTypeOrder.indexOf(bType));
        });
        vCards.sort((a,b) => {
            if (a.type !== b.type) {
                return valueCards.indexOf(a.type) - valueCards.indexOf(b.type);
            } else {
                if (a.color === b.color) {
                    return b.value - a.value;
                }
                else {
                    return this.colorCount[b.color] - this.colorCount[a.color];
                }
            }
        })
        this.cards = [...cards, ...vCards];
    }
}