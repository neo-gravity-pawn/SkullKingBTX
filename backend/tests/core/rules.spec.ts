import { expect } from 'chai';
import 'mocha';
import { printCard } from '@helper/output';
import { CardCollection } from '@core/cardCollection';
import { canBeAddedToTrick } from '@core/rules.ts';
import { cc } from '@helper/create';

let trick: CardCollection;
let hand: CardCollection;

function setup() {
    [trick, hand] = [new CardCollection(), new CardCollection()]
}

describe('Trick', () => {
    it('should trow error if invalid hand car is selected', () => {
        setup();
        expect(() => {
            canBeAddedToTrick(hand, 1, trick);
        }).to.throw;
    })
    it('should check, if color rules applies', () => {
        setup();
        hand.addCard(cc('cr9'));
        hand.addCard(cc('cy7'));

        expect(canBeAddedToTrick(hand, 1, trick)).to.be.true;

        trick.addCard(cc('cr8'));
        trick.addCard(cc('cy11'));

        expect(canBeAddedToTrick(hand, 1, trick)).to.be.false;

        hand.removeCard(0);
        hand.addCard(cc('cy6'));

        expect(canBeAddedToTrick(hand, 0, trick)).to.be.true;

    })
})