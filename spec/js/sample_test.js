const assert = require('chai').assert;
const sampleTest = require('../../src/sample').sampleTest;
const Viewtest = require('../../src/View');
//  const CsvParsertest = require('../../src/CsvParser');

describe("Sample Test", function(){
    it('Should return Mocha Testing', function () {
        result = sampleTest();
        assert.equal(result, "Mocha Testing");
    });
});
// describe("View Test 1", function(){
//     const Viewtest = require('../../src/View');
//     var testViewObject;
//     beforeEach(function(){
//         testViewObject=new Viewtest(1);
//         testViewObject.handleFileSelectstring("A,B,C\
//         1,2,3");
//     });
//     // it("Should test Handlefileselectstring functions", function(){
//     //     result=[["A","B","C"],[1,2,3]];
//     //     gotResult=testViewObject.csvFile;
//     //     assert.equal(result,gotResult);
//     // });
// });
