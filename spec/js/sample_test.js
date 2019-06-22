const assert = require('chai').assert;
const sampleTest = require('../../src/sample').sampleTest;
const CsvParserTest = require('../../src/CsvParser');

describe("Sample Test", function(){
    it('Should return Mocha Testing', function () {
        var result = sampleTest();
        assert.equal(result, "Mocha Testing");
    });
});

describe("CSV string test",function(){
    var CsvParserTestObj;
    beforeEach(function(){
        CsvParserTestObj=new CsvParserTest("1,2,3","testid","csvstring");
    })
    it('Should return csv testing', function () {
        // console.log(CsvParserTestObj.csvMatrix);

    });
});