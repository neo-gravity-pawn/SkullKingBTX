import { Trick } from '@core/trick';
import 'mocha'
import { cc } from '@helper/create';

describe('Trick', ()=> {
    it('should take card and player id as input', () => {
        const t = new Trick();
        const c = cc('cy3');
        t.addCard(c, 'player 1');

    })
})