import { Card, ICardType } from '@core/card';
import { expect } from 'chai';
import 'mocha';
 
describe('Card', () => {
    it('Output should be the same as input', () => {
        let c = new Card({type: ICardType.color, value: 10 });
        expect(c.type).to.equal(ICardType.color);
        expect(c.value).to.equal(10);
        c = new Card({type: ICardType.trump, value: 3 });
        expect(c.type).to.equal(ICardType.trump);
        expect(c.value).to.equal(3);
    });

    it('No value need to be provided for non-color cards', () => {
        expect(() => {
            const c = new Card({type: ICardType.pirate});
        }).to.not.throw();
    });

    it('Non-color cards should have value -1', () => {
        const c = new Card({type: ICardType.pirate});
        expect(c.value).to.equal(-1);
    });

    it('Wrong values should lead to error', () => {
        expect( () => {
            const c = new Card({type: ICardType.pirate, value: 10});
        }).to.throw();
        expect( () => {
            const c = new Card({type: ICardType.trump, value: 14});
        }).to.throw();
        expect( () => {
            const c = new Card({type: ICardType.color, value: -1});
        }).to.throw();
    });
});