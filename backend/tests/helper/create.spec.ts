import { CardCollection } from './../../src/core/cardCollection';
import { Card } from './../../src/core/card';
import { isMutableCard } from '@core/mutableCard';
import { MutableCard } from '@core/mutableCard';
import { CardType, CardColor } from '@core/card';
import { expect } from 'chai';
import 'mocha';
import {cc, fillCollection} from '@helper/create';
import { Trick } from '@core/trick';

describe('CC (create cards shortcut helper)', () => {
    it('should create correct standard cards', () => {
        const cr8 = cc('cr8');
        const p = cc('p');
        const s = cc('s');
        const t6 = cc('t6');
        expect([cr8.type, cr8.color, cr8.value]).to.eql([CardType.color, CardColor.red, 8]);
        expect([p.type, p.color, p.value]).to.eql([CardType.pirate, CardColor.none, -1]);
        expect([s.type, s.color, s.value]).to.eql([CardType.skullking, CardColor.none, -1]);
        expect([t6.type, t6.color, t6.value]).to.eql([CardType.trump, CardColor.black, 6]);
    })
    it('should create scary mary', () => {
        const sm = cc('x') as MutableCard;
        expect(isMutableCard(sm)).to.be.true;
        sm.selectCard(0);
        expect([sm.type, sm.color, sm.value]).to.eql([CardType.pirate, CardColor.none, -1]);
        sm.selectCard(1);
        expect([sm.type, sm.color, sm.value]).to.eql([CardType.escape, CardColor.none, -1]);
    })
});

describe('fillCollection', () => {
    it('should create CardCollection instance', () => {
        expect(fillCollection(CardCollection) instanceof CardCollection).to.be.true;
    })
    it('should add correct cards', () => {
        const col = fillCollection(CardCollection, {cardCodes: 'cr8,cr9,cy4,t4,p,s,x,e,m'});
        expect(col.getCard(0).conf).to.eql({type: CardType.color, color: CardColor.red, value:8});
        expect(col.getCard(1).conf).to.eql({type: CardType.color, color: CardColor.red, value:9});
        expect(col.getCard(2).conf).to.eql({type: CardType.color, color: CardColor.yellow, value:4});
        expect(col.getCard(3).conf).to.eql({type: CardType.trump, color: CardColor.black, value:4});
        expect(col.getCard(4).conf).to.eql({type: CardType.pirate, color: CardColor.none, value:-1});
        expect(col.getCard(5).conf).to.eql({type: CardType.skullking, color: CardColor.none, value:-1});
        expect(col.getCard(7).conf).to.eql({type: CardType.escape, color: CardColor.none, value:-1});
        expect(col.getCard(8).conf).to.eql({type: CardType.mermaid, color: CardColor.none, value:-1});
        expect((col.getCard(6) as MutableCard).mutableType).to.eql(CardType.scarymary);
    })
    it('should create an empty collection, if no / empty string is provided', () => {
        let col = fillCollection(CardCollection, {cardCodes: ''});
        expect(col.getNumberOfCards()).to.equal(0);
        col = fillCollection(CardCollection);
        expect(col.getNumberOfCards()).to.equal(0);
    })
});

describe('fillTrick', () => {
    it('should create Trick instance', () => {
        expect(fillCollection(Trick) instanceof Trick).to.be.true;
    })
    it('should add correct cards', () => {
        const col = fillCollection(Trick, {playerId: 'bob', cardCodes: 'cr8,cr9,cy4,t4,p,s,x,e,m'});
        expect(col.getCard(0).conf).to.eql({type: CardType.color, color: CardColor.red, value:8});
        expect(col.getCard(1).conf).to.eql({type: CardType.color, color: CardColor.red, value:9});
        expect(col.getCard(2).conf).to.eql({type: CardType.color, color: CardColor.yellow, value:4});
        expect(col.getCard(3).conf).to.eql({type: CardType.trump, color: CardColor.black, value:4});
        expect(col.getCard(4).conf).to.eql({type: CardType.pirate, color: CardColor.none, value:-1});
        expect(col.getCard(5).conf).to.eql({type: CardType.skullking, color: CardColor.none, value:-1});
        expect(col.getCard(7).conf).to.eql({type: CardType.escape, color: CardColor.none, value:-1});
        expect(col.getCard(8).conf).to.eql({type: CardType.mermaid, color: CardColor.none, value:-1});
        expect((col.getCard(6) as MutableCard).mutableType).to.eql(CardType.scarymary);
        for (let i = 0; i < 9; i++) {
            expect(col.getPlayerIdForCard(i)).to.eql('bob');
        }
    })
});