import { printCollection } from '@helper/output';
import { MutableCard } from '@core/mutableCard';
import { CardType, CardColor, Card } from '@core/card';
import { CardCollection } from '@core/cardCollection';
import { expect } from 'chai';
import 'mocha';

describe('Hand', () => {
    it('should be sortable', () => {
        const hand = new CardCollection();
        const cards = [
            new Card({type: CardType.color, color: CardColor.blue, value: 8}), //0
            new Card({type: CardType.color, color: CardColor.red, value: 10}), //1
            new Card({type: CardType.color, color: CardColor.yellow, value: 12}), //2
            new Card({type: CardType.color, color: CardColor.red, value: 2}), //3
            new Card({type: CardType.color, color: CardColor.blue, value: 1}), //4
            new Card({type: CardType.color, color: CardColor.blue, value: 13}), //5
            new Card({type: CardType.pirate}), //6
            new Card({type: CardType.pirate}), //7
            new Card({type: CardType.skullking}), //8
            new Card({type: CardType.mermaid}), //9
            new MutableCard(CardType.scarymary, [new Card({type: CardType.escape}), new Card({type: CardType.pirate})]),
            new Card({type: CardType.escape}), //11
            new Card({type: CardType.trump, value: 2}), //12
            new Card({type: CardType.trump, value: 9}), //13

        ]
        cards.forEach( card => {
            hand.addCard(card);
        });
        hand.sort();
        expect(
            hand.getCard(0) === cards[8] &&
            hand.getCard(1) === cards[10] &&
            hand.getCard(2) === cards[6] &&
            hand.getCard(3) === cards[7] &&
            hand.getCard(4) === cards[9] &&
            hand.getCard(5) === cards[11] &&
            hand.getCard(6) === cards[13] &&
            hand.getCard(7) === cards[12] &&
            hand.getCard(8) === cards[5] &&
            hand.getCard(9) === cards[0] &&
            hand.getCard(10) === cards[4] &&
            hand.getCard(11) === cards[1] &&
            hand.getCard(12) === cards[3] &&
            hand.getCard(13) === cards[2]
        ).to.be.true;
    })
})