import 'mocha';
import { expect } from 'chai';
import { CardType, Card, CardColor } from '@core/card';
import { CardCollection } from '@core/cardCollection';
import { CardCollectionIndexOutsideRangeError } from '@core/error';

const c1 = new Card({type: CardType.pirate});
const c2 = new Card({type: CardType.color, color: CardColor.blue, value: 8});
const c3 = new Card({type: CardType.trump, value: 3});
const c4 = new Card({type: CardType.color, color: CardColor.blue, value: 4});
const c5 = new Card({type: CardType.color, color: CardColor.red, value: 11});
const c6 = new Card({type: CardType.color, color: CardColor.yellow, value: 1});
const c7 = new Card({type: CardType.color, color: CardColor.blue, value: 7});

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
        }).to.throw(CardCollectionIndexOutsideRangeError);
        expect(() => {
            const c = col.getCard(3);
        }).to.throw(CardCollectionIndexOutsideRangeError);
    })


    it('should provide correct number of color cards', () => {
        const col = new CardCollection();
        col.addCard(c1);
        col.addCard(c2);
        col.addCard(c3);
        col.addCard(c4);
        col.addCard(c5);
        col.addCard(c6);
        expect(col.getNumberOfCards(CardColor.blue)).to.equal(2);
        expect(col.getNumberOfCards(CardColor.red)).to.equal(1);
        expect(col.getNumberOfCards(CardColor.yellow)).to.equal(1);
        expect(col.getNumberOfCards(CardColor.black)).to.equal(1);
        expect(col.getNumberOfCards(CardColor.none)).to.equal(1);
        col.addCard(c7);
        expect(col.getNumberOfCards(CardColor.blue)).to.equal(3);
        col.removeCard(2);
        expect(col.getNumberOfCards(CardColor.black)).to.equal(0);
    });
});