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
});