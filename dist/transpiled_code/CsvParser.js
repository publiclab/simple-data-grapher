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

    _defineProperty(this, "codapHeaders", []);

    _defineProperty(this, "codapMatrix", []);

    this.elementId = elementId;
    this.csvFile = file;

    if (functionParameter == "prevfile") {
      return this;
    } else {
      this.allFunctionHandler(functionParameter);
    }
  } //since parsing a local file works asynchronously, a callback function is required to call the remaining functions after the parsing is complete


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
      this.codapHeaders = this.headersForCodap();
      this.codapMatrix = this.completeMatrixForCodap();
      this.startFileProcessing();
    } //a function handler that calls one function after the other after assigning the correct values to different class variables.

  }, {
    key: "allFunctionHandler",
    value: function allFunctionHandler(functionParameter) {
      if (functionParameter == "local") {
        this.csvMatrix = this.parse();
      } else {
        if (functionParameter == "csvstring" || functionParameter == "remote") {
          this.csvFile = this.csvFile.split("\n");
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
        this.codapHeaders = this.headersForCodap();
        this.codapMatrix = this.completeMatrixForCodap();
        this.startFileProcessing();
      }
    } //parsing a local file, works asynchronously

  }, {
    key: "parse",
    value: function parse() {
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
    } // parsing string: for remote and csvString import options. Dat is parsed line by line but NOT asynchronously.

  }, {
    key: "parseString",
    value: function parseString() {
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
    } // checks for the presence of the corresponding View object in elementIdSimpleDataGraphInstanceMap, if present, the CsvParser object is assigned to the View object and the flow resumes from View.js file

  }, {
    key: "startFileProcessing",
    value: function startFileProcessing() {
      var self = this;

      if (self.elementId in SimpleDataGrapher.SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap) {
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

      for (var x = 0; x < this.csvHeaders.length; x++) {
        var counter = 0;
        var bool = false;

        for (var j = 0; j < this.completeCsvMatrix[x].length; j++) {
          if (counter >= maxval) {
            break;
          } else if (this.completeCsvMatrix[x][j] !== null || this.completeCsvMatrix[x][j] !== undefined) {
            if (typeof this.completeCsvMatrix[x][j] === 'number') {
              bool = true;
            }

            counter += 1;
            this.csvSampleData[x].push(this.completeCsvMatrix[x][j]);
          }
        }

        if (bool) {
          this.csvValidForYAxis.push(this.csvHeaders[x]);
        }
      }

      totalDataLocal = [csvSampleDataLocal, csvValidForYAxisLocal];
      return totalDataLocal;
    } //makes a 2D matrix with the transpose of the CSV file, each column having the same index as its column heading

  }, {
    key: "matrixForCompleteData",
    value: function matrixForCompleteData() {
      var completeCsvMatrixLocal = [];

      for (var y = 0; y < this.csvHeaders.length; y++) {
        completeCsvMatrixLocal[y] = [];
      }

      for (var v = this.csvFileStart; v < this.csvMatrix.length; v++) {
        for (var j = 0; j < this.csvHeaders.length; j++) {
          completeCsvMatrixLocal[j].push(this.csvMatrix[v][j]);
        }
      }

      return completeCsvMatrixLocal;
    } //Google Sheet's data is in a JSON, traversal through the JSON and string manipulation are used to extract the data

  }, {
    key: "completeMatrixForGoogleSheet",
    value: function completeMatrixForGoogleSheet() {
      var matrixComplete = [];

      for (var i = 0; i < this.csvHeaders.length; i++) {
        matrixComplete[i] = [];
      }

      for (var x = 0; i < this.csvHeaders.length; x++) {
        for (var key in this.csvFile) {
          var valueCell = this.csvFile[key][this.csvHeaders[x]]["$t"];

          if (!isNaN(valueCell)) {
            matrixComplete[x].push(+valueCell);
          } else {
            matrixComplete[x].push(valueCell);
          }
        }
      }

      for (var j = 0; j < this.csvHeaders.length; j++) {
        this.csvHeaders[j] = this.csvHeaders[j].slice(4, this.csvHeaders[j].length);
      }

      return matrixComplete;
    } // matrix in JSON form for CODAP export

  }, {
    key: "completeMatrixForCodap",
    value: function completeMatrixForCodap() {
      var codapMatrix = [];

      for (var i = 1; i < this.completeCsvMatrixTranspose.length; i++) {
        var element = {};

        for (var j = 0; j < this.csvHeaders.length; j++) {
          element[this.csvHeaders[j]] = this.completeCsvMatrixTranspose[i][j];
        }

        codapMatrix.push(element);
      }

      console.log("matrix codap", codapMatrix);
      return codapMatrix;
    } //checks if the first row has most of the potential header names, if not, assign dummy headers to the file.

  }, {
    key: "determineHeaders",
    value: function determineHeaders() {
      var csvHeadersLocal = [];
      var flag = false;

      for (var i = 0; i < this.csvMatrix[0].length; i++) {
        if (i == 0) {
          if (typeof this.csvMatrix[0][i] == "string") {
            csvHeadersLocal[i] = this.csvMatrix[0][i];
          } else {
            flag = true;
            break;
          }
        } else {
          if (_typeof(this.csvMatrix[0][i]) == _typeof(this.csvMatrix[0][i - 1]) && _typeof(this.csvMatrix[0][i]) != 'object' || _typeof(this.csvMatrix[0][i]) != _typeof(this.csvMatrix[0][i - 1]) && csvHeadersLocal[i - 1].substring(0, 6) == "Column") {
            csvHeadersLocal[i] = this.csvMatrix[0][i];
          } //in case of an unnamed column
          else if (_typeof(this.csvMatrix[0][i]) == 'object') {
              csvHeadersLocal[i] = "Column" + (i + 1);
            } else {
              flag = true;
              break;
            }
        }
      } //if there are no headers present, make dummy header names


      if (flag && csvHeadersLocal.length != this.csvMatrix[0].length) {
        this.csvFileStart = 0;

        for (var u = 0; u < this.csvMatrix[0].length; u++) {
          csvHeadersLocal[u] = "Column" + (u + 1);
        }
      }

      return csvHeadersLocal;
    } //Google Sheet's data is in a JSON, extracting column names by string slicing

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
    } //determine a JSON for headers for CODAP

  }, {
    key: "headersForCodap",
    value: function headersForCodap() {
      var codapHeaders = [];

      for (var i = 0; i < this.csvHeaders.length; i++) {
        var element = {};
        element["name"] = this.csvHeaders[i];
        codapHeaders.push(element);
      }

      return codapHeaders;
    } // creating the transpose of the entire data ie complete data + headers, for createSpreadsheet in View.js

  }, {
    key: "createTranspose",
    value: function createTranspose() {
      var completeCsvMatrixTransposeLocal = [];

      for (var i = 0; i <= this.completeCsvMatrix[0].length; i++) {
        completeCsvMatrixTransposeLocal[i] = [];
      }

      for (var v = 0; v < this.completeCsvMatrix.length; v++) {
        completeCsvMatrixTransposeLocal[0][v] = this.csvHeaders[v];
      }

      for (var s = 0; s < this.completeCsvMatrix.length; s++) {
        for (var j = 0; j < this.completeCsvMatrix[0].length; j++) {
          completeCsvMatrixTransposeLocal[j + 1][s] = this.completeCsvMatrix[s][j];
        }
      }

      console.log("transpose", completeCsvMatrixTransposeLocal);
      return completeCsvMatrixTransposeLocal;
    }
  }]);

  return CsvParser;
}();

module.exports = CsvParser;