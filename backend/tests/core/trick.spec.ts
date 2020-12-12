import { Trick } from '@core/trick';
import 'mocha'
import { cc } from '@helper/create';
import { expect } from 'chai';
import { Player } from '@core/player';

const p1 = new Player('Bob');
const p2 = new Player('Carl');

describe('Trick', ()=> {
    it('should take card and player as input', () => {
        const t = new Trick();
        const c = cc('cy3');
        t.addCard(c, p1);
    })
    it('should provide player id for every card', () => {
        const t = new Trick();
        const c0 = cc('cy3');
        const c1 = cc('t6');
        t.addCard(c0, p1);
        t.addCard(c1, p2);
        expect(t.getCard(0)).to.eql(c0);
        expect(t.getPlayerForCard(0)).to.eql(p1);
        expect(t.getCard(1)).to.eql(c1);
        expect(t.getPlayerForCard(1)).to.eql(p2);
    })
    it('removing card should also remove player id', () => {
        const t = new Trick();
        const c0 = cc('cy3');
        const c1 = cc('t6');
        t.addCard(c0, p1);
        t.addCard(c1, p2);
        t.removeCard(0);
        expect(t.getCard(0)).to.eql(c1);
        expect(t.getPlayerForCard(0)).to.eql(p2);
    })
})