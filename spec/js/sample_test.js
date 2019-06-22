const assert = require('chai').assert;
const sampleTest = require('../../src/sample').sampleTest;
const CsvPraserTest = require('../../src/CsvParser');
var Papa=require("papaparse");

describe("Sample Test", function(){
    it('Should return Mocha Testing', function () {
        result = sampleTest();
        assert.equal(result, "Mocha Testing");
    });
});

