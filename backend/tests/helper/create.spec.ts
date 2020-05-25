import { isMutableCard } from '@core/mutableCard';
import { MutableCard } from '@core/mutableCard';
import { CardType, CardColor } from '@core/card';
import { expect } from 'chai';
import 'mocha';
import {cc} from '@helper/create';

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