import 'mocha';
import { expect } from 'chai';
import { GameServer, IMessage } from '@core/gameServer';

describe('Server', () => {
    it('should allow for player registration', (done) => {
        const s = new GameServer();
        const m = {type: 'REGISTER_PLAYER', name: 'Bob'};
        s.broadcast$.subscribe((message: IMessage) => {
            done();
        })
        s.onMessage(m);

        //TODO Test for maleformed messages
        
    });
});