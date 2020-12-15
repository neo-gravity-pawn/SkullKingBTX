
import { expect } from 'chai';
import 'mocha';
import {shuffleArray} from '@helper/algorithms';


describe('algorithms', () => {
    it('should provide function for shuffling arrays', () => {
        const a = {};
        const b = 123;
        const c = 'Hallo';
        const a1 = [a, b, c];
        const aIndices = [0, 0, 0];
        const iterations = 40;
        for (let i = 0; i < iterations; i++) {
            shuffleArray(a1);
            aIndices[a1.indexOf(a)] += 1;
            expect(a1.indexOf(a) !== -1 && a1.indexOf(b) !== -1 && a1.indexOf(c) !== -1).to.be.true;
        }
        expect(aIndices[0] > 0 && aIndices[1] > 0 && aIndices[2] > 0 && ((aIndices[0] + aIndices[1] + aIndices[2]) === iterations)).to.be.true;
    })
});