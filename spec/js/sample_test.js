import { assert } from 'chai';
import { sampleTest } from '../../src/sample';

assert.describe("Sample Test", function () {
    assert.it('Should return Mocha Testing', function () {
        var result = sampleTest();
        assert.equal(result, "Mocha Testing");
    });
});