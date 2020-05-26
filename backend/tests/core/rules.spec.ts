import { expect } from 'chai';
import 'mocha';
import { printCard } from '@helper/output';
import { CardCollection } from '@core/cardCollection';
import { canBeAddedToTrick } from '@core/rules.ts';
import { cc, fillCollection } from '@helper/create';

let trick: CardCollection;
let hand: CardCollection;

describe('Rules - canBeAddedToTrick', () => {
    it('should trow error if invalid hand car is selected', () => {
        trick = fillCollection();
        hand = fillCollection();
        expect(() => {
            canBeAddedToTrick(hand, 1, trick);
        }).to.throw;
    })
    it('cards can alway be added to empty trick', () => {
        trick = fillCollection();
        hand = fillCollection('cy1,cr3,t6');
        expect(canBeAddedToTrick(hand, 2, trick)).to.be.true;
    })
    it('cards can alway be added if trick is filled with non-color', () => {
        trick = fillCollection('p,s,m,x');
        hand = fillCollection('cy1,cr3,t6');
        expect(canBeAddedToTrick(hand, 2, trick)).to.be.true;
    })
    it('color cards can only be added, if Farbzwang is satisfied', () => {
        trick = fillCollection('cr8,cy7');
        hand = fillCollection('cr1,cy11');
        expect(canBeAddedToTrick(hand, 1, trick)).to.be.false;
        expect(canBeAddedToTrick(hand, 0, trick)).to.be.true;
        trick = fillCollection('cy7,cr8');
        expect(canBeAddedToTrick(hand, 0, trick)).to.be.false;
        expect(canBeAddedToTrick(hand, 1, trick)).to.be.true;
        trick = fillCollection('e,p,cy7,p,e,cr8');
        expect(canBeAddedToTrick(hand, 0, trick)).to.be.false;
        expect(canBeAddedToTrick(hand, 1, trick)).to.be.true;
        trick = fillCollection('e,t4,p,cy7,p,e,cr8');
        expect(canBeAddedToTrick(hand, 0, trick)).to.be.true;
        expect(canBeAddedToTrick(hand, 1, trick)).to.be.true;
        hand.addCard(cc('t8'));
        expect(canBeAddedToTrick(hand, 0, trick)).to.be.false;
        expect(canBeAddedToTrick(hand, 1, trick)).to.be.false;
    })
    it('non-color cards can always be added', () => {
        hand = fillCollection('cr1,cy1,p,m,e,x');
        trick = fillCollection('e,t4,p,cy7,p,e,cr8');
        expect(canBeAddedToTrick(hand, 2, trick)).to.be.true;
        expect(canBeAddedToTrick(hand, 3, trick)).to.be.true;
        expect(canBeAddedToTrick(hand, 4, trick)).to.be.true;
        expect(canBeAddedToTrick(hand, 5, trick)).to.be.true;
    })
})