import { expect } from 'chai';
import 'mocha';
import { printCard } from '@helper/output';
import { CardCollection } from '@core/cardCollection';
import { canBeAddedToTrick } from '@core/rules.ts';
import { cc } from '@helper/create';


const cr8 = cc('cr8');
const cr3 = cc('cr3');
const cy11 = cc('cy11');
const cr9 = cc('cr9');
const cy7 = cc('cy7');



describe('Trick', () => {
    it('should check, if color rules applies', () => {
        const hand = new CardCollection();
        hand.addCard(cr9);
        hand.addCard(cy7);

        const trick = new CardCollection();
        trick.addCard(cr8);
        trick.addCard(cy11);

        expect(canBeAddedToTrick(hand, 1, trick)).to.be.false;

    })
})