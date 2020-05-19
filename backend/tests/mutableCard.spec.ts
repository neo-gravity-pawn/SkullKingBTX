import { MutableCard, MutableCardType } from '@core/mutableCard';
import { Card, CardType, CardColor } from '@core/card';
import { expect } from 'chai';
import 'mocha';

describe ('Mutable Card', () => {
    it('Should take type and two cards array as input', () => {
        const mc = new MutableCard(
            MutableCardType.scaryMary,
            [new Card({type: CardType.pirate}),
            new Card({type: CardType.color, value: 5, color: CardColor.yellow})]
        )
    });

    it('Should provide the given type', () => {
        const mc = new MutableCard(
            MutableCardType.scaryMary,
            [new Card({type: CardType.pirate}),
            new Card({type: CardType.color, value: 5, color: CardColor.yellow})]
        )
        expect(mc.mutableType).to.equal(MutableCardType.scaryMary);
    })

    it('Should should initally have the values of the first card', () => {
        const c1 = new Card({type: CardType.pirate});
        const c2 = new Card({type: CardType.color, value: 5, color: CardColor.yellow});
        const mc = new MutableCard(MutableCardType.scaryMary, [c1, c2]);
        expect(mc.type).to.equal(c1.type);
        expect(mc.color).to.equal(c1.color);
        expect(mc.value).to.equal(c1.value);
    });

    it('Should should have the values of the selected card', () => {
        const c1 = new Card({type: CardType.pirate});
        const c2 = new Card({type: CardType.color, value: 5, color: CardColor.yellow});
        const c3 = new Card({type: CardType.escape});
        const mc = new MutableCard(MutableCardType.scaryMary, [c1, c2, c3]);
        mc.selectCard(1);
        expect(mc.type).to.equal(c2.type);
        expect(mc.color).to.equal(c2.color);
        expect(mc.value).to.equal(c2.value);
    });

    it('Selecting invalid card should lead to error', () => {
        const c1 = new Card({type: CardType.pirate});
        const c2 = new Card({type: CardType.color, value: 5, color: CardColor.yellow});
        const c3 = new Card({type: CardType.escape});
        const mc = new MutableCard(MutableCardType.scaryMary, [c1, c2, c3]);
        expect(() => {
            mc.selectCard(-1);
        }).to.throw();
        expect(() => {
            mc.selectCard(3);
        }).to.throw();

    });
});