import 'mocha';
import { Player } from '@core/player';
import { expect } from 'chai';
import { Hand } from '@core/hand';
describe('Player', () => {
    it('should have a name', () => {
        const p = new Player('Bob');
        expect(p.name).to.eql('Bob');
    })
    it('should have a hand', () => {
        const p = new Player('Bob');
        expect(p.hand instanceof Hand).to.be.true;
    })
})