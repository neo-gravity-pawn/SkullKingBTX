import { Stock } from '@core/stock';
import { expect } from 'chai';
import 'mocha';

describe('Stock', () => {
    it('should contain 66 cards', () => {
        const s = new Stock();
        expect(s.getNumberOfCards()).to.be.equal(66);
    })
})