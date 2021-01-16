import 'mocha';
import { expect } from 'chai';
import { GameServer, IMessage } from '@core/gameServer';
import { MaleformedMessageError, UnknownMessageTypeError } from '@core/error';

describe('Server', () => {
    it('should only accept valid messages', () => {
        const s = new GameServer();
        const m = {type: 'WRONG_TYPE'};
        expect(() => {
            s.onMessage(m);
        }).to.throw(UnknownMessageTypeError);
        const m2 = {type: 'REGISTER_PLAYER', wrongPayload: 123};
        expect(() => {
            s.onMessage(m2);
        }).to.throw(MaleformedMessageError);
        const m3 = {type: 'REGISTER_PLAYER', name: 123};
        expect(() => {
            s.onMessage(m3);
        }).to.throw(MaleformedMessageError);
        const m4 = {type: 'REGISTER_PLAYER', name: 'Bob'};
        expect(() => {
            s.onMessage(m4);
        }).to.not.throw;

    })

    it('should allow for and broadcast player registration', (done) => {
        const s = new GameServer();
        const m = {type: 'REGISTER_PLAYER', name: 'Bob'};
        s.broadcast$.subscribe((message: IMessage) => {
            expect(message.type).to.equal('PLAYERS_REGISTERED');
            // todo: test for players
            done();
        })
        s.onMessage(m);        
    });
});