import { Stock } from '@core/stock';
import { expect } from 'chai';
import 'mocha';

describe('Stock', () => {
    it('should contain 66 cards', () => {
        const s = new Stock();
        expect(s.getNumberOfCards()).to.be.equal(66);
    })
    it('cards should be accessible', () => {
        const s = new Stock();
        const c = s.getCard(0);
        const c2 = s.getCard(65);
    })
    it('should throw error if invalid cards are accessed', () => {
        const s = new Stock();
        expect(() => {
            const c = s.getCard(-1);
        }).to.throw();
        expect(() => {
            const c = s.getCard(66);
        }).to.throw();
    })

    it('should contain 65 standard cards and one mutable card', () => {
        const s = new Stock();
        for (let i = 0; i < s.getNumberOfCards(); i++) {
            // const c = 
        }
    })
})