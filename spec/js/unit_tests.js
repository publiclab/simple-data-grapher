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
        CsvParserTestObj=new CsvParserTest("A,2,3\nB,5,6\nC,8,9\nD,11,12\nE,14,15\nF,17,18","testid","csvstring");
    })
    it('Should Return csvMatrix', function () {
        var produced=JSON.stringify(CsvParserTestObj.csvMatrix);
        var expected=JSON.stringify([ [ "A", 2, 3 ],[ "B", 5, 6 ],[ "C", 8, 9 ],[ "D", 11, 12 ],[ "E", 14, 15 ],[ "F", 17, 18 ] ]);
        assert.equal(produced,expected); 
    });

    it('Should Return csvHeaders when there are no headers',function(){
        var produced=JSON.stringify(CsvParserTestObj.csvHeaders);
        var expected=JSON.stringify(["Column1","Column2","Column3"]);
        assert.equal(produced,expected);
    });

    it('Should Return completeCsvMatrix', function(){
        var produced=JSON.stringify(CsvParserTestObj.completeCsvMatrix);
        var expected=JSON.stringify([["A","B","C","D","E","F"],[2,5,8,11,14,17],[3,6,9,12,15,18]]);
        assert.equal(produced,expected);
    });
    it('Should Return completeCsvMatrixTranspose', function(){
        var produced=JSON.stringify(CsvParserTestObj.completeCsvMatrixTranspose);
        var expected=JSON.stringify([["Column1","Column2","Column3"],[ "A", 2, 3 ],[ "B", 5, 6 ],[ "C", 8, 9 ],[ "D", 11, 12 ],[ "E", 14, 15 ],[ "F", 17, 18 ]]);
        assert.equal(produced,expected);
    });

    it('Should Return csvSampleData', function(){
        var produced=JSON.stringify(CsvParserTestObj.csvSampleData);
        var expected=JSON.stringify([["A","B","C","D","E"],[2,5,8,11,14],[3,6,9,12,15]]);
        assert.equal(produced,expected);
    });

    it('Should Return csvValidForYAxis',function(){
        var produced=JSON.stringify(CsvParserTestObj.csvValidForYAxis);
        var expected=JSON.stringify(["Column2","Column3"]);
        assert.equal(produced,expected);
    });

});



describe("CSV googleSheet test",function(){
    //googleSheetFileObj contains the data.feed.entry returned after fetching the data
    var googleSheetFileObj=[

        {
          "id": {
            "$t": "https://spreadsheets.google.com/feeds/list/1vfvBKa2e0E1cG310-SnvoYLM_b08g4AucKpYoDQEcOU/od6/public/values/cokwr"
          },
          "updated": {
            "$t": "2019-06-23T10:24:45.578Z"
          },
          "category": [
            {
              "scheme": "http://schemas.google.com/spreadsheets/2006",
              "term": "http://schemas.google.com/spreadsheets/2006#list"
            }
          ],
          "title": {
            "type": "text",
            "$t": "1"
          },
          "content": {
            "type": "text",
            "$t": "test2: A, test3: 3, test4: D"
          },
          "link": [
            {
              "rel": "self",
              "type": "application/atom+xml",
              "href": "https://spreadsheets.google.com/feeds/list/1vfvBKa2e0E1cG310-SnvoYLM_b08g4AucKpYoDQEcOU/od6/public/values/cokwr"
            }
          ],
          "gsx$test1": {
            "$t": "1"
          },
          "gsx$test2": {
            "$t": "A"
          },
          "gsx$test3": {
            "$t": "3"
          },
          "gsx$test4": {
            "$t": "D"
          }
        },
        {
          "id": {
            "$t": "https://spreadsheets.google.com/feeds/list/1vfvBKa2e0E1cG310-SnvoYLM_b08g4AucKpYoDQEcOU/od6/public/values/cpzh4"
          },
          "updated": {
            "$t": "2019-06-23T10:24:45.578Z"
          },
          "category": [
            {
              "scheme": "http://schemas.google.com/spreadsheets/2006",
              "term": "http://schemas.google.com/spreadsheets/2006#list"
            }
          ],
          "title": {
            "type": "text",
            "$t": "2"
          },
          "content": {
            "type": "text",
            "$t": "test2: B, test3: 4, test4: E"
          },
          "link": [
            {
              "rel": "self",
              "type": "application/atom+xml",
              "href": "https://spreadsheets.google.com/feeds/list/1vfvBKa2e0E1cG310-SnvoYLM_b08g4AucKpYoDQEcOU/od6/public/values/cpzh4"
            }
          ],
          "gsx$test1": {
            "$t": "2"
          },
          "gsx$test2": {
            "$t": "B"
          },
          "gsx$test3": {
            "$t": "4"
          },
          "gsx$test4": {
            "$t": "E"
          }
        },
        {
          "id": {
            "$t": "https://spreadsheets.google.com/feeds/list/1vfvBKa2e0E1cG310-SnvoYLM_b08g4AucKpYoDQEcOU/od6/public/values/cre1l"
          },
          "updated": {
            "$t": "2019-06-23T10:24:45.578Z"
          },
          "category": [
            {
              "scheme": "http://schemas.google.com/spreadsheets/2006",
              "term": "http://schemas.google.com/spreadsheets/2006#list"
            }
          ],
          "title": {
            "type": "text",
            "$t": "11"
          },
          "content": {
            "type": "text",
            "$t": "test2: C, test3: 77, test4: F"
          },
          "link": [
            {
              "rel": "self",
              "type": "application/atom+xml",
              "href": "https://spreadsheets.google.com/feeds/list/1vfvBKa2e0E1cG310-SnvoYLM_b08g4AucKpYoDQEcOU/od6/public/values/cre1l"
            }
          ],
          "gsx$test1": {
            "$t": "11"
          },
          "gsx$test2": {
            "$t": "C"
          },
          "gsx$test3": {
            "$t": "77"
          },
          "gsx$test4": {
            "$t": "F"
          }
        }
      ]
    var CsvParserTestObjGoogleSheet;
    beforeEach(function(){
        CsvParserTestObjGoogleSheet=new CsvParserTest(googleSheetFileObj,"testid2","googleSheet");
    });
    it('Should Return csvMatrix googleSheet', function () {
        //will return a blank matrix because it is not required in the case of googleSheet
        var produced=JSON.stringify(CsvParserTestObjGoogleSheet.csvMatrix);
        var expected=JSON.stringify([]);
        assert.equal(produced,expected);
    });
    it('Should Return csvHeaders googleSheet with headers', function () {
        var produced=JSON.stringify(CsvParserTestObjGoogleSheet.csvHeaders);
        var expected=JSON.stringify(["test1","test2","test3","test4"]);
        assert.equal(produced,expected);
    });
    it('Should Return completeCsvMatrix googleSheet', function () {
        var produced=JSON.stringify(CsvParserTestObjGoogleSheet.completeCsvMatrix);
        var expected=JSON.stringify([[1,2,11],["A","B","C"],[3,4,77],["D","E","F"]]);
        assert.equal(produced,expected);
    });
    it('Should Return completeCsvMatrixTranspose googleSheet', function () {
        var produced=JSON.stringify(CsvParserTestObjGoogleSheet.completeCsvMatrixTranspose);
        var expected=JSON.stringify([["test1","test2","test3","test4"],[1,"A",3,"D"],[2,"B",4,"E"],[11,"C",77,"F"]]);
        assert.equal(produced,expected);
    });
    it('Should Return csvSampleData googleSheet', function () {
        //length of sampleData is less than 5 in this case
        var produced=JSON.stringify(CsvParserTestObjGoogleSheet.csvSampleData);
        var expected=JSON.stringify([[1,2,11],["A","B","C"],[3,4,77],["D","E","F"]]);
        assert.equal(produced,expected);
    });
    it('Should Return csvValidForYAxis googleSheet', function () {
        var produced=JSON.stringify(CsvParserTestObjGoogleSheet.csvValidForYAxis);
        var expected=JSON.stringify(["test1","test3"]);
        assert.equal(produced,expected);
    });
});
describe("CSV Remote test",function(){
    var CsvParserTestObjRemote;
    beforeEach(function(){
        CsvParserTestObjRemote=new CsvParserTest("A1,B1,,C1,\n1,2,3,4,5\n6,7,8,9,10\n11,12,13,14,15\n16,17,18,19,20\n21,22,23,24,25\n26,27,28,29,30","testid3","remote");
    });
    it('Should Return csvMatrix remote', function () {
        var produced=JSON.stringify(CsvParserTestObjRemote.csvMatrix);
        var expected=JSON.stringify([["A1","B1",null,"C1",null],[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25],[26,27,28,29,30]]);
        assert.equal(produced,expected);
    });
    it('Should Return csvHeaders remote', function () {
        var produced=JSON.stringify(CsvParserTestObjRemote.csvHeaders);
        var expected=JSON.stringify(["A1","B1","Column3","C1","Column5"]);
        assert.equal(produced,expected);
    });
    it('Should Return completeCsvMatrix remote', function () {
        var produced=JSON.stringify(CsvParserTestObjRemote.completeCsvMatrix);
        var expected=JSON.stringify([[1,6,11,16,21,26],[2,7,12,17,22,27],[3,8,13,18,23,28],[4,9,14,19,24,29],[5,10,15,20,25,30]]);
        assert.equal(produced,expected);
    });
    it('Should Return completeCsvMatrixTranspose remote', function () {
        var produced=JSON.stringify(CsvParserTestObjRemote.completeCsvMatrixTranspose);
        var expected=JSON.stringify([["A1","B1","Column3","C1","Column5"],[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25],[26,27,28,29,30]]);
        assert.equal(produced,expected);
    });
    it('Should Return csvSampleData remote', function () {
        var produced=JSON.stringify(CsvParserTestObjRemote.csvSampleData);
        var expected=JSON.stringify([[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],[5,10,15,20,25]]);
        assert.equal(produced,expected);
    });
    it('Should Return csvValidForYAxis remote', function () {
        var produced=JSON.stringify(CsvParserTestObjRemote.csvValidForYAxis);
        var expected=JSON.stringify(["A1","B1","Column3","C1","Column5"]);
        assert.equal(produced,expected);
    });

});