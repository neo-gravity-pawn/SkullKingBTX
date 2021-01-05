import 'mocha';
import { expect } from 'chai';
import { cc, fillCollection } from '@helper/create';
import { CardCollection } from '@core/cardCollection';
import { Card, CardColor, CardType } from '@core/card';
import { createCardString, createCollectionString } from '@helper/output';
import { MutableCard } from '@core/mutableCard';

describe('Output', () => {
    it('should print a card', () => {
        const c1 = new Card({type: CardType.color, color: CardColor.red, value: 13});
        const c2 = cc('x') as MutableCard;
        c2.selectCard(1);
        expect(createCardString(c1)).to.equal('r13');
        expect(createCardString(c2)).to.equal('sm(e)');

    });
    it('should print a card collection', () => {
        const c = fillCollection(CardCollection, {cardCodes: 'cy3,p,t5,e,m,cb11,cr3,x'});
        expect(createCollectionString(c)).to.equal('(8): y3, p, t5, e, m, b11, r3, sm(p)');
    })
});