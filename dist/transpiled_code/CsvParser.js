"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CsvParser = void 0;

var _SimpleDataGrapher = require("./SimpleDataGrapher");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CsvParser =
/*#__PURE__*/
function () {
  //start is variable that will be passed to the function to sort out the columns. start will tell if the existing CSV file has headers or not, therefore, to start the iteration from 0 or 1 Used in header determination
  function CsvParser(file, elementId) {
    _classCallCheck(this, CsvParser);

    _defineProperty(this, 'use strict', void 0);

    _defineProperty(this, "csvFile", null);

    _defineProperty(this, "csvMatrix", []);

    _defineProperty(this, "csvHeaders", []);

    _defineProperty(this, "csvFileStart", 1);

    _defineProperty(this, "completeCsvMatrix", []);

    _defineProperty(this, "csvSampleData", []);

    _defineProperty(this, "csvValidForYAxis", []);

    _defineProperty(this, "elementId", null);

    this.csvFile = file;
    this.elementId = elementId;
    this.parse();
  }

  _createClass(CsvParser, [{
    key: "parse",
    value: function parse() {
      var _this = this;

      var count = 0;
      Papa.parse(this.csvFile, {
        download: true,
        dynamicTyping: true,
        comments: true,
        step: function step(row) {
          _this.csvMatrix[count] = row.data[0];
          count += 1;
        },
        complete: function complete() {
          //calling a function to determine headers for columns
          _this.startFileProcessing();
        }
      });
    }
  }, {
    key: "startFileProcessing",
    value: function startFileProcessing() {
      this.determineHeaders();
      this.matrixForCompleteData();
      this.extractSampleData();

      _SimpleDataGrapher.SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId].view.continueViewManipulation();
    } //preparing sample data for the user to choose the columns from

  }, {
    key: "extractSampleData",
    value: function extractSampleData() {
      var maxval = 5;

      if (this.completeCsvMatrix.length[0] < 5) {
        maxval = this.completeCsvMatrix[0].length;
      }

      for (var i = 0; i < this.csvHeaders.length; i++) {
        var counter = 0;
        var bool = false;

        for (var j = 0; j < this.completeCsvMatrix[i].length; j++) {
          if (counter >= maxval) {
            break;
          } else if (this.completeCsvMatrix[i][j] !== null || this.completeCsvMatrix[i][j] !== undefined) {
            if (typeof this.completeCsvMatrix[i][j] === 'number') {
              bool = true;
            }

            counter += 1;
            this.csvSampleData[i].push(this.completeCsvMatrix[i][j]);
          }
        }

        if (bool) {
          this.csvValidForYAxis.push(this.csvHeaders[i]);
        }
      }
    } //makes a 2D matrix with the transpose of the CSV file, each column having the same index as its column heading

  }, {
    key: "matrixForCompleteData",
    value: function matrixForCompleteData() {
      for (var i = 0; i < this.csvHeaders.length; i++) {
        this.completeCsvMatrix[i] = [];
      }

      for (var i = this.csvFileStart; i < this.csvMatrix.length; i++) {
        for (var j = 0; j < this.csvHeaders.length; j++) {
          this.completeCsvMatrix[j].push(this.csvMatrix[i][j]);
        }
      }
    }
  }, {
    key: "determineHeaders",
    value: function determineHeaders() {
      var flag = false;

      for (var i = 0; i < this.csvMatrix[0].length; i++) {
        if (i == 0) {
          this.csvHeaders[i] = this.csvMatrix[0][i];
        } else {
          if (_typeof(this.csvMatrix[0][i]) == _typeof(this.csvMatrix[0][i - 1]) && _typeof(this.csvMatrix[0][i]) != 'object') {
            this.csvHeaders[i] = this.csvMatrix[0][i];
          } else if (_typeof(this.csvMatrix[0][i]) == 'object') {
            this.csvHeaders[i] = "Column" + (i + 1);
          } else {
            flag = true;
            break;
          }
        }
      } //if there are no headers present, make dummy header names


      if (flag && this.csvHeaders.length != this.csvMatrix[0].length) {
        this.csvFileStart = 0;

        for (var i = 0; i < this.csvMatrix[0].length; i++) {
          this.csvHeaders[i] = "Column" + (i + 1);
        }
      }
    }
  }]);

  return CsvParser;
}();

exports.CsvParser = CsvParser;
;