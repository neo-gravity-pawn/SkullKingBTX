import { MutableCard } from '@core/mutableCard';
import { Card, ICardType, ICardColor } from '@core/card';
import { expect } from 'chai';
import 'mocha';

describe ('Mutable Card', () => {
    it('Should take two cards as input', () => {
        const mc = new MutableCard(
            new Card({type: ICardType.pirate}),
            new Card({type: ICardType.color, value: 5, color: ICardColor.yellow})
        )
    });

    it('Should should have the values of the first card', () => {
        const c1 = new Card({type: ICardType.pirate});
        const c2 = new Card({type: ICardType.color, value: 5, color: ICardColor.yellow});
        const mc = new MutableCard(c1, c2);
        expect(mc.type).to.equal(c1.type);
    });
});