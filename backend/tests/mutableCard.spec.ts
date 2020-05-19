import { MutableCard } from '@core/mutableCard';
import { Card, ICardType, ICardColor } from '@core/card';
import { expect } from 'chai';
import 'mocha';

describe ('Mutable Card', () => {
    it('Should take two cards array as input', () => {
        const mc = new MutableCard(
            [new Card({type: ICardType.pirate}),
            new Card({type: ICardType.color, value: 5, color: ICardColor.yellow})]
        )
    });

    it('Should should initally have the values of the first card', () => {
        const c1 = new Card({type: ICardType.pirate});
        const c2 = new Card({type: ICardType.color, value: 5, color: ICardColor.yellow});
        const mc = new MutableCard([c1, c2]);
        expect(mc.type).to.equal(c1.type);
        expect(mc.color).to.equal(c1.color);
        expect(mc.value).to.equal(c1.value);
    });

    it('Should should have the values of the selected card', () => {
        const c1 = new Card({type: ICardType.pirate});
        const c2 = new Card({type: ICardType.color, value: 5, color: ICardColor.yellow});
        const c3 = new Card({type: ICardType.escape});
        const mc = new MutableCard([c1, c2, c3]);
        mc.selectCard(1);
        expect(mc.type).to.equal(c2.type);
        expect(mc.color).to.equal(c2.color);
        expect(mc.value).to.equal(c2.value);

    });
});