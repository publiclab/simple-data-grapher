const assert = require('chai').assert;
const sampleTest = require('../../src/sample').sampleTest;
const CsvParserTest = require('../../src/CsvParser');
var Papa = require("papaparse");

describe("Sample Test", function(){
    it('Should return Mocha Testing', function () {
        var result = sampleTest();
        assert.equal(result, "Mocha Testing");
    });
});

describe("Sample csv test",function(){
    it('Should return csv testing', function () {
        console.log(CsvParserTest);
        // var testobj=new CsvParserTest("A,B,C","testid","csvstring");

    });
});