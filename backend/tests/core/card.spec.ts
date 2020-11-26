import { CardValueOutsideRangeError, InvalidColorCardError } from '@core/error';
import { Card, CardType, CardColor } from '@core/card';
import { expect } from 'chai';
import 'mocha';
 
describe('Card', () => {
    it('Should support empty constructor', () => {
        let c = new Card();
    });
    it('Output should be the same as input', () => {
        let c = new Card({type: CardType.color, value: 10, color: CardColor.yellow });
        expect(c.type).to.equal(CardType.color);
        expect(c.value).to.equal(10);
        expect(c.color).to.equal(CardColor.yellow);
        c = new Card({type: CardType.trump, value: 3 });
        expect(c.type).to.equal(CardType.trump);
        expect(c.value).to.equal(3);
    });

    it('No value need to be provided for non-color cards', () => {
        expect(() => {
            const c = new Card({type: CardType.pirate});
        }).to.not.throw();
    });

    it('Non-color cards should have value -1', () => {
        const c = new Card({type: CardType.pirate});
        expect(c.value).to.equal(-1);
    });

    it('Color cards should have a color', () => {
        const c = new Card({type: CardType.color, value: 10, color: CardColor.yellow});
        expect(c.color).to.equal(CardColor.yellow);
    });

    it('Color card note being of correct color / no color leads to error', () => {
        expect( () => {
            const c = new Card({type: CardType.color, value: 10});
        }).to.throw(InvalidColorCardError);
        expect( () => {
            const c = new Card({type: CardType.color, value: 10, color: CardColor.black});
        }).to.throw(InvalidColorCardError);
    });

    it('Trump cards should be black', () => {
        const c = new Card({type: CardType.trump, value: 5});
        expect(c.color).to.equal(CardColor.black);
    });

    it('Other cards cards should have no color', () => {
        const c = new Card({type: CardType.pirate, color: CardColor.red});
        expect(c.color).to.equal(CardColor.none);
    });

    it('Wrong values should lead to error', () => {
        expect( () => {
            const c = new Card({type: CardType.pirate, value: 10});
        }).to.throw(CardValueOutsideRangeError);
        expect( () => {
            const c = new Card({type: CardType.trump, value: 14});
        }).to.throw(CardValueOutsideRangeError);
        expect( () => {
            const c = new Card({type: CardType.color, value: -1});
        }).to.throw(CardValueOutsideRangeError);
    });
});