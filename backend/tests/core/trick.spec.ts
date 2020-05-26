import { Trick } from '@core/trick';
import 'mocha'
import { cc } from '@helper/create';
import { Card } from '@core/card';
import { expect } from 'chai';

describe('Trick', ()=> {
    it('should take card and player id as input', () => {
        const t = new Trick();
        const c = cc('cy3');
        t.addCard(c, 'player 1');
    })
    it('should provide player id for every card', () => {
        const t = new Trick();
        const c0 = cc('cy3');
        const c1 = cc('t6');
        t.addCard(c0, 'p1');
        t.addCard(c1, 'p2');
        expect(t.getCard(0)).to.eql(c0);
        expect(t.getPlayerIdForCard(0)).to.eql('p1');
        expect(t.getCard(1)).to.eql(c1);
        expect(t.getPlayerIdForCard(1)).to.eql('p2');
    })
})