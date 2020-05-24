import { MutableCard } from '@core/mutableCard';
import { CardType, CardColor, Card } from '@core/card';
import { CardCollection } from '@core/cardCollection';
import { expect } from 'chai';
import 'mocha';

/*describe('Hand', () => {
    it('should be sortable', () => {
        const hand = new CardCollection();
        const cards = [
            new Card({type: CardType.color, color: CardColor.blue, value: 8}),
            new Card({type: CardType.color, color: CardColor.blue, value: 1}),
            new Card({type: CardType.color, color: CardColor.blue, value: 13}),
            new Card({type: CardType.color, color: CardColor.red, value: 10}),
            new Card({type: CardType.color, color: CardColor.red, value: 2}),
            new Card({type: CardType.color, color: CardColor.blue, value: 13}),
            new Card({type: CardType.pirate}),
            new Card({type: CardType.pirate}),
            new Card({type: CardType.skullking}),
            new Card({type: CardType.mermaid}),
            new MutableCard(MutableCardType.scaryMary, [new Card({type: CardType.escape}), new Card({type: CardType.pirate})]),
            new Card({type: CardType.escape})
        ]
        cards.forEach( card => {
            hand.addCard(card);
        });
        hand.sort();
        expect(
            hand.getCard(0) === cards[8]
        ).to.be.true;
    })
})*/