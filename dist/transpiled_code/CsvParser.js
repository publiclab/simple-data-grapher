"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import {SimpleDataGrapher} from "./SimpleDataGrapher";
var SimpleDataGrapher = require('./SimpleDataGrapher');

var Papa = require("papaparse");

var CsvParser =
/*#__PURE__*/
function () {
  //start is variable that will be passed to the function to sort out the columns. start will tell if the existing CSV file has headers or not, therefore, to start the iteration from 0 or 1 Used in header determination
  function CsvParser(file, elementId, functionParameter) {
    _classCallCheck(this, CsvParser);

    _defineProperty(this, 'use strict', void 0);

    _defineProperty(this, "csvFile", null);

    _defineProperty(this, "csvMatrix", []);

    _defineProperty(this, "csvHeaders", []);

    _defineProperty(this, "csvFileStart", 1);

    _defineProperty(this, "completeCsvMatrix", []);

    _defineProperty(this, "completeCsvMatrixTranspose", []);

    _defineProperty(this, "csvSampleData", []);

    _defineProperty(this, "csvValidForYAxis", []);

    _defineProperty(this, "elementId", null);

    this.elementId = elementId;
    this.csvFile = file;
    this.allFunctionHandler(functionParameter);
  }

  _createClass(CsvParser, [{
    key: "callbackForLocalFile",
    value: function callbackForLocalFile(csvMatrixLocal) {
      this.csvMatrix = csvMatrixLocal;
      this.csvHeaders = this.determineHeaders();
      this.completeCsvMatrix = this.matrixForCompleteData();
      var totalData = this.extractSampleData();
      this.csvSampleData = totalData[0];
      this.csvValidForYAxis = totalData[1];
      this.completeCsvMatrixTranspose = this.createTranspose();
      this.startFileProcessing();
    }
  }, {
    key: "allFunctionHandler",
    value: function allFunctionHandler(functionParameter) {
      // if (functionParameter=="local" || functionParameter=="csvstring" || functionParameter=="remote"){
      if (functionParameter == "local") {
        this.csvMatrix = this.parse();
      } else {
        if (functionParameter == "csvstring" || functionParameter == "remote") {
          this.csvMatrix = this.parseString();
          this.csvHeaders = this.determineHeaders();
          this.completeCsvMatrix = this.matrixForCompleteData();
        } else {
          this.csvHeaders = this.headersForGoogleSheet();
          this.completeCsvMatrix = this.completeMatrixForGoogleSheet();
        }

        var totalData = this.extractSampleData();
        this.csvSampleData = totalData[0];
        this.csvValidForYAxis = totalData[1];
        this.completeCsvMatrixTranspose = this.createTranspose();
        this.startFileProcessing();
      }
    }
  }, {
    key: "parse",
    value: function parse(functionParameter) {
      var _this = this;

      var csvMatrixLocal = [];
      var count = 0;
      var f = this.parseReturn;
      Papa.parse(this.csvFile, {
        download: true,
        dynamicTyping: true,
        comments: true,
        step: function step(row) {
          csvMatrixLocal[count] = row.data[0];
          count += 1;
        },
        complete: function complete() {
          _this.callbackForLocalFile(csvMatrixLocal);
        }
      });
    }
  }, {
    key: "parseString",
    value: function parseString(functionParameter) {
      var mat = [];

      for (var i = 0; i < this.csvFile.length; i++) {
        if (this.csvFile[i] == "" || this.csvFile[i] == " ") {
          continue;
        }

        var dataHash = Papa.parse(this.csvFile[i], {
          dynamicTyping: true,
          comments: true
        });
        mat[i] = dataHash['data'][0];
      }

      return mat;
    }
  }, {
    key: "startFileProcessing",
    value: function startFileProcessing(functionParameter) {
      var self = this; //checking the elementIdSimpleDataGraphInstanceMap map's length, to be sure it's not empty

      if (Object.keys(SimpleDataGrapher.SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap).length != 0) {
        SimpleDataGrapher.SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[self.elementId].view.continueViewManipulation(self);
      }
    } //preparing sample data for the user to choose the columns from

  }, {
    key: "extractSampleData",
    value: function extractSampleData() {
      var maxval = 5;
      var csvSampleDataLocal = [];
      var csvValidForYAxisLocal = [];
      var totalDataLocal = [];

      for (var i = 0; i < this.csvHeaders.length; i++) {
        csvSampleDataLocal[i] = [];
      }

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
            csvSampleDataLocal[i].push(this.completeCsvMatrix[i][j]);
          }
        }

        if (bool) {
          csvValidForYAxisLocal.push(this.csvHeaders[i]);
        }
      }

      totalDataLocal = [csvSampleDataLocal, csvValidForYAxisLocal];
      return totalDataLocal;
    } //makes a 2D matrix with the transpose of the CSV file, each column having the same index as its column heading

  }, {
    key: "matrixForCompleteData",
    value: function matrixForCompleteData() {
      var completeCsvMatrixLocal = [];

      for (var i = 0; i < this.csvHeaders.length; i++) {
        completeCsvMatrixLocal[i] = [];
      }

      for (var i = this.csvFileStart; i < this.csvMatrix.length; i++) {
        for (var j = 0; j < this.csvHeaders.length; j++) {
          completeCsvMatrixLocal[j].push(this.csvMatrix[i][j]);
        }
      }

      return completeCsvMatrixLocal;
    }
  }, {
    key: "completeMatrixForGoogleSheet",
    value: function completeMatrixForGoogleSheet() {
      var matrixComplete = [];

      for (var i = 0; i < this.csvHeaders.length; i++) {
        matrixComplete[i] = [];
      }

      for (var i = 0; i < this.csvHeaders.length; i++) {
        for (var key in this.csvFile) {
          var valueCell = this.csvFile[key][this.csvHeaders[i]]["$t"];

          if (!isNaN(valueCell)) {
            matrixComplete[i].push(+valueCell);
          } else {
            matrixComplete[i].push(valueCell);
          }
        }
      }

      for (var i = 0; i < this.csvHeaders.length; i++) {
        this.csvHeaders[i] = this.csvHeaders[i].slice(4, this.csvHeaders[i].length);
      }

      return matrixComplete;
    }
  }, {
    key: "determineHeaders",
    value: function determineHeaders() {
      var csvHeadersLocal = [];
      var flag = false;

      for (var i = 0; i < this.csvMatrix[0].length; i++) {
        if (i == 0) {
          csvHeadersLocal[i] = this.csvMatrix[0][i];
        } else {
          if (_typeof(this.csvMatrix[0][i]) == _typeof(this.csvMatrix[0][i - 1]) && _typeof(this.csvMatrix[0][i]) != 'object') {
            csvHeadersLocal[i] = this.csvMatrix[0][i];
          } else if (_typeof(this.csvMatrix[0][i]) == 'object') {
            csvHeadersLocal[i] = "Column" + (i + 1);
          } else {
            flag = true;
            break;
          }
        }
      } //if there are no headers present, make dummy header names


      if (flag && csvHeadersLocal.length != this.csvMatrix[0].length) {
        this.csvFileStart = 0;

        for (var i = 0; i < this.csvMatrix[0].length; i++) {
          csvHeadersLocal[i] = "Column" + (i + 1);
        }
      }

      return csvHeadersLocal;
    }
  }, {
    key: "headersForGoogleSheet",
    value: function headersForGoogleSheet() {
      var headers_sheet = [];

      for (var key in this.csvFile) {
        var h = this.csvFile[key];

        for (var headKey in h) {
          if (headKey.slice(0, 4) == "gsx$") {
            headers_sheet.push(headKey);
          }
        }

        break;
      }

      return headers_sheet;
    }
  }, {
    key: "createTranspose",
    value: function createTranspose() {
      var completeCsvMatrixTransposeLocal = [];

      for (var i = 0; i <= this.completeCsvMatrix[0].length; i++) {
        completeCsvMatrixTransposeLocal[i] = [];
      }

      for (var i = 0; i < this.completeCsvMatrix.length; i++) {
        completeCsvMatrixTransposeLocal[0][i] = this.csvHeaders[i];
      }

      for (var i = 0; i < this.completeCsvMatrix.length; i++) {
        for (var j = 0; j < this.completeCsvMatrix[0].length; j++) {
          completeCsvMatrixTransposeLocal[j + 1][i] = this.completeCsvMatrix[i][j];
        }
      }

      return completeCsvMatrixTransposeLocal;
    }
  }]);

  return CsvParser;
}();

;
module.exports = CsvParser;