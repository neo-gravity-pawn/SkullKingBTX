import { Card, ICardType, ICardColor } from '@core/card';
import { expect } from 'chai';
import 'mocha';
 
describe('Card', () => {
    it('Should support empty constructor', () => {
        let c = new Card();
    });
    it('Output should be the same as input', () => {
        let c = new Card({type: ICardType.color, value: 10, color: ICardColor.yellow });
        expect(c.type).to.equal(ICardType.color);
        expect(c.value).to.equal(10);
        expect(c.color).to.equal(ICardColor.yellow);
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

    it('Color cards should have a color', () => {
        const c = new Card({type: ICardType.color, value: 10, color: ICardColor.yellow});
        expect(c.color).to.equal(ICardColor.yellow);
    });

    it('Color card note being of correct color / no color leads to error', () => {
        expect( () => {
            const c = new Card({type: ICardType.color, value: 10});
        }).to.throw();
        expect( () => {
            const c = new Card({type: ICardType.color, value: 10, color: ICardColor.black});
        }).to.throw();
    });

    it('Trump cards should be black', () => {
        const c = new Card({type: ICardType.trump, value: 5});
        expect(c.color).to.equal(ICardColor.black);
    });

    it('Other cards cards should have no color', () => {
        const c = new Card({type: ICardType.pirate, color: ICardColor.red});
        expect(c.color).to.equal(ICardColor.none);
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