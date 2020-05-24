import 'mocha';
import { expect } from 'chai';
import { CardType, Card, CardColor } from '@core/card';
import { CardCollection } from '@core/cardCollection';

const c1 = new Card({type: CardType.pirate});
const c2 = new Card({type: CardType.color, color: CardColor.blue, value: 8});
const c3 = new Card({type: CardType.trump, value: 3});
const c4 = new Card({type: CardType.color, color: CardColor.blue, value: 4});
const c5 = new Card({type: CardType.color, color: CardColor.red, value: 11});
const c6 = new Card({type: CardType.color, color: CardColor.yellow, value: 1});

describe ('Card Collection', () => {

    it('should hold given cards', () => {
        const col = new CardCollection();
        col.addCard(c1);
        col.addCard(c2);
        col.addCard(c3);
        expect(col.getNumberOfCards()).to.be.equal(3);
        expect(col.getCard(0)).to.equal(c1);
        expect(col.getCard(1)).to.equal(c2);
        expect(col.getCard(2)).to.equal(c3);
    });

    it('should be possible to remove cards', () => {
        const col = new CardCollection();
        col.addCard(c1);
        col.addCard(c2);
        col.addCard(c3);
        const c = col.removeCard(1);
        expect(c).to.equal(c2);
        expect(col.getNumberOfCards()).to.be.equal(2);
        expect(col.getCard(0)).to.equal(c1);
        expect(col.getCard(1)).to.equal(c3);
    });

    it('should throw error if invalid cards are accessed', () => {
        const col = new CardCollection();
        col.addCard(c1);
        col.addCard(c2);
        col.addCard(c3);
        expect(col.getCard(0)).to.equal(c1);
        expect(col.getCard(1)).to.equal(c2);
        expect(col.getCard(2)).to.equal(c3);
        expect(() => {
            const c = col.getCard(1);
        }).to.not.throw();
        expect(() => {
            const c = col.getCard(-1);
        }).to.throw();
        expect(() => {
            const c = col.getCard(3);
        }).to.throw();
    })

    it('shuffling should lead to randomized card order', () => {
        const col = new CardCollection();
        col.addCard(c1);
        col.addCard(c2);
        col.addCard(c3);
        col.addCard(c4);
        col.addCard(c5);
        col.addCard(c6);
        expect(
            c1 === col.getCard(0) &&
            c2 === col.getCard(1) &&
            c3 === col.getCard(2) &&
            c4 === col.getCard(3) &&
            c5 === col.getCard(4) &&
            c6 === col.getCard(5)
        ).to.be.true;
        col.shuffle();
        expect(
            c1 === col.getCard(0) &&
            c2 === col.getCard(1) &&
            c3 === col.getCard(2) &&
            c4 === col.getCard(3) &&
            c5 === col.getCard(4) &&
            c6 === col.getCard(5)
        ).to.be.false;
    });
});