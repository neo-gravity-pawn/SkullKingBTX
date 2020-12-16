import 'mocha';
import { Player } from '@core/player';
import { expect } from 'chai';
import { Hand } from '@core/hand';
import { Card, CardColor, CardType } from '@core/card';
describe('Player', () => {
    it('should have a name', () => {
        const p = new Player('Bob');
        expect(p.name).to.eql('Bob');
    })
    it('should have a hand', () => {
        const p = new Player('Bob');
        expect(p.hand instanceof Hand).to.be.true;
    })
    it('should be able to reset hand', () => {
        const p = new Player('Bob');
        p.hand.addCard(new Card({type: CardType.color, color: CardColor.red, value: 10}));
        expect(p.hand.getNumberOfCards()).to.equal(1);
        p.resetHand();
        expect(p.hand.getNumberOfCards()).to.equal(0);
    })
})