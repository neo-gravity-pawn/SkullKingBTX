import { add } from '@sandbox/testTheTest'
import { expect } from 'chai';
import 'mocha';
 
describe('First test', () => {
 
  it('should return true', () => {
    const result = add(1,2);
    expect(result).to.equal(3);
  });
 
});
