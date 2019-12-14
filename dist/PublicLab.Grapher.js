(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ChartjsPlotter =
/*#__PURE__*/
function () {
  _createClass(ChartjsPlotter, [{
    key: "determineType",
    value: function determineType() {
      // console.log("at type");
      if (this.graphType == 'Basic' || this.graphType == 'Stepped' || this.graphType == 'Point') {
        return 'line';
      } else if (this.graphType == 'Horizontal') {
        return 'horizontalBar';
      } else if (this.graphType == 'Vertical') {
        return 'bar';
      } else {
        return this.graphType.toLowerCase();
      }
    }
  }, {
    key: "colorGenerator",
    value: function colorGenerator(i, tb, count) {
      // console.log("at color");
      var colors = ['rgba(255, 77, 210, 0.5)', 'rgba(0, 204, 255, 0.5)', 'rgba(128, 0, 255, 0.5)', 'rgba(255, 77, 77, 0.5)', 'rgba(0, 179, 0, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(255, 0, 102, 0.5)', 'rgba(0, 115, 230, 0.5)'];
      var bordercolors = ['rgb(255, 0, 191)', 'rgb(0, 184, 230)', 'rgb(115, 0, 230)', 'rgb(255, 51, 51)', 'rgb(0, 153, 0)', 'rgb(230, 230, 0)', 'rgb(230, 0, 92)', 'rgb(0, 102, 204)'];
      var length = 8;

      if (this.graphType == 'Pie' || this.graphType == 'Doughnut') {
        var colorSet = [];
        var borderColorSet = [];

        for (var j = 0; j < count; j++) {
          colorSet.push(colors[j % length]);
          borderColorSet.push(bordercolors[j % length]);
        }

        if (tb == 'bg') {
          return colorSet;
        } else {
          return borderColorSet;
        }
      } else {
        if (tb == 'bg') {
          return colors[i % length];
        } else {
          return bordercolors[i % length];
        }
      }
    }
  }, {
    key: "determineData",
    value: function determineData(i) {
      // console.log("at data");
      var h = {};

      if (this.graphType == 'Basic') {
        h['fill'] = false;
      } else if (this.graphType == 'Stepped') {
        h['steppedLine'] = true;
        h['fill'] = false;
      } else if (this.graphType == 'Point') {
        h['showLine'] = false;
        h['pointRadius'] = 10;
      }

      h['backgroundColor'] = this.colorGenerator(i, 'bg', this.dataHash['y_axis_values' + i].length);
      h['borderColor'] = this.colorGenerator(i, 'bo', this.dataHash['y_axis_values' + i].length);
      h['borderWidth'] = 1;
      h['label'] = this.dataHash['labels'][1][i];
      h['data'] = this.dataHash['y_axis_values' + i];
      return h;
    }
  }, {
    key: "determineConfig",
    value: function determineConfig() {
      // console.log("at config");
      var config = {};
      config['type'] = this.determineType();
      var data = {};
      data['labels'] = this.dataHash['x_axis_labels'];
      var datasets = [];

      for (var i = 0; i < this.length; i++) {
        var h = this.determineData(i);
        datasets.push(h);
      }

      var options = {
        responsive: true,
        maintainAspectRatio: true,
        chartArea: {
          backgroundColor: 'rgb(204, 102, 255)'
        }
      };
      options['scales'] = this.scales();
      config['options'] = options;
      data['datasets'] = datasets;
      config['data'] = data;
      return config;
    }
  }, {
    key: "scales",
    value: function scales() {
      // console.log("at scales");
      var scales = {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: this.dataHash['labels'][0]
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }]
      };
      return scales;
    }
  }, {
    key: "saveAsImageFunction",
    value: function saveAsImageFunction(canvId) {
      // console.log("entered image");
      var newDate = new Date();
      var timestamp = newDate.getTime();
      var temp = canvId;
      temp = '#' + temp;
      $(temp).get(0).toBlob(function (blob) {
        window.saveAs(blob, 'chart' + timestamp);
      });
    }
  }, {
    key: "createSaveAsImageButton",
    value: function createSaveAsImageButton(canvasDiv, canvasId) {
      var saveImageButton = document.createElement('BUTTON');
      saveImageButton.classList.add('btn');
      saveImageButton.classList.add('btn-primary');
      saveImageButton.innerHTML = 'Save as Image';
      saveImageButton.id = canvasId + 'image';
      canvasDiv.appendChild(saveImageButton); // console.log(this, "this");

      var self = this;

      document.getElementById(saveImageButton.id).onclick = function () {
        self.saveAsImageFunction(canvasId);
      };
    }
  }, {
    key: "plotGraph",
    value: function plotGraph() {
      if (this.flag) {
        //   console.log("at plotGraph");
        document.getElementById(this.canvasContainerId).innerHTML = '';
      }

      var div = document.createElement('div');
      div.classList.add(this.elementId + '_chart_container_' + this.graphCounting);
      var canv = document.createElement('canvas');
      canv.id = this.elementId + '_canvas_' + this.graphCounting;
      div.appendChild(canv);
      document.getElementById(this.canvasContainerId).appendChild(div);
      var ctx = canv.getContext('2d');
      var configuration = this.determineConfig();
      new window.Chart(ctx, configuration);
      this.createSaveAsImageButton(div, canv.id); // $('.'+this.carousalClass).carousel(2);
    }
  }]);

  function ChartjsPlotter(hash, length, type, flag, canvasContainerId, elementId, graphCounting) {
    _classCallCheck(this, ChartjsPlotter);

    _defineProperty(this, "dataHash", {});

    _defineProperty(this, "elementId", null);

    _defineProperty(this, "graphCounting", 0);

    _defineProperty(this, "canvasContainerId", null);

    _defineProperty(this, "graphType", null);

    _defineProperty(this, "length", 0);

    _defineProperty(this, "flag", false);

    this.dataHash = hash;
    this.length = length;
    this.graphType = type;
    this.flag = flag;
    this.canvasContainerId = canvasContainerId;
    this.elementId = elementId;
    this.graphCounting = graphCounting;
    this.plotGraph();
  }

  return ChartjsPlotter;
}();

module.exports = ChartjsPlotter;
},{}],2:[function(require,module,exports){
'use strict'; // import {SimpleDataGrapher} from "./SimpleDataGrapher";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SimpleDataGrapher = require('./SimpleDataGrapher');

var Papa = require('papaparse');

var CsvParser =
/*#__PURE__*/
function () {
  //start is variable that will be passed to the function to sort out the columns. start will tell if the existing CSV file has headers or not, therefore, to start the iteration from 0 or 1 Used in header determination
  function CsvParser(file, elementId, functionParameter) {
    _classCallCheck(this, CsvParser);

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

    if (functionParameter == 'prevfile') {
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
      if (functionParameter == 'local') {
        this.csvMatrix = this.parse();
      } else {
        if (functionParameter == 'csvstring' || functionParameter == 'remote') {
          this.csvFile = this.csvFile.split('\n');
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
      var count = 0; // var f = this.parseReturn;

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
        if (this.csvFile[i] == '' || this.csvFile[i] == ' ') {
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

      for (var _i = 0; _i < this.csvHeaders.length; _i++) {
        var counter = 0;
        var bool = false;

        for (var j = 0; j < this.completeCsvMatrix[_i].length; j++) {
          if (counter >= maxval) {
            break;
          } else if (this.completeCsvMatrix[_i][j] !== null || this.completeCsvMatrix[_i][j] !== undefined) {
            if (typeof this.completeCsvMatrix[_i][j] === 'number') {
              bool = true;
            }

            counter += 1;

            csvSampleDataLocal[_i].push(this.completeCsvMatrix[_i][j]);
          }
        }

        if (bool) {
          csvValidForYAxisLocal.push(this.csvHeaders[_i]);
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

      for (var _i2 = this.csvFileStart; _i2 < this.csvMatrix.length; _i2++) {
        for (var j = 0; j < this.csvHeaders.length; j++) {
          completeCsvMatrixLocal[j].push(this.csvMatrix[_i2][j]);
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

      for (var _i3 = 0; _i3 < this.csvHeaders.length; _i3++) {
        for (var key in this.csvFile) {
          var valueCell = this.csvFile[key][this.csvHeaders[_i3]]['$t'];

          if (!isNaN(valueCell)) {
            matrixComplete[_i3].push(+valueCell);
          } else {
            matrixComplete[_i3].push(valueCell);
          }
        }
      }

      for (var _i4 = 0; _i4 < this.csvHeaders.length; _i4++) {
        this.csvHeaders[_i4] = this.csvHeaders[_i4].slice(4, this.csvHeaders[_i4].length);
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

      return codapMatrix;
    } //checks if the first row has most of the potential header names, if not, assign dummy headers to the file.

  }, {
    key: "determineHeaders",
    value: function determineHeaders() {
      var csvHeadersLocal = [];
      var flag = false;

      for (var i = 0; i < this.csvMatrix[0].length; i++) {
        if (i == 0) {
          if (typeof this.csvMatrix[0][i] == 'string') {
            csvHeadersLocal[i] = this.csvMatrix[0][i];
          } else {
            flag = true;
            break;
          }
        } else {
          if (_typeof(this.csvMatrix[0][i]) == _typeof(this.csvMatrix[0][i - 1]) && _typeof(this.csvMatrix[0][i]) != 'object' || _typeof(this.csvMatrix[0][i]) != _typeof(this.csvMatrix[0][i - 1]) && csvHeadersLocal[i - 1].substring(0, 6) == 'Column') {
            csvHeadersLocal[i] = this.csvMatrix[0][i];
          } //in case of an unnamed column
          else if (_typeof(this.csvMatrix[0][i]) == 'object') {
              csvHeadersLocal[i] = 'Column' + (i + 1);
            } else {
              flag = true;
              break;
            }
        }
      } //if there are no headers present, make dummy header names


      if (flag && csvHeadersLocal.length != this.csvMatrix[0].length) {
        this.csvFileStart = 0;

        for (var _i5 = 0; _i5 < this.csvMatrix[0].length; _i5++) {
          csvHeadersLocal[_i5] = 'Column' + (_i5 + 1);
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
          if (headKey.slice(0, 4) == 'gsx$') {
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
        element['name'] = this.csvHeaders[i];
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

      for (var _i6 = 0; _i6 < this.completeCsvMatrix.length; _i6++) {
        completeCsvMatrixTransposeLocal[0][_i6] = this.csvHeaders[_i6];
      }

      for (var _i7 = 0; _i7 < this.completeCsvMatrix.length; _i7++) {
        for (var j = 0; j < this.completeCsvMatrix[0].length; j++) {
          completeCsvMatrixTransposeLocal[j + 1][_i7] = this.completeCsvMatrix[_i7][j];
        }
      }

      return completeCsvMatrixTransposeLocal;
    }
  }]);

  return CsvParser;
}();

module.exports = CsvParser;
},{"./SimpleDataGrapher":4,"papaparse":11}],3:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PlotlyjsPlotter =
/*#__PURE__*/
function () {
  _createClass(PlotlyjsPlotter, [{
    key: "determineType2",
    value: function determineType2() {
      if (this.graphType == 'Horizontal' || this.graphType == 'Vertical') {
        return 'bar';
      } else if (this.graphType == 'Pie' || this.graphType == 'Doughnut' || this.graphType == 'Radar') {
        return 'pie';
      } else if (this.graphType == 'Basic' || this.graphType == 'Stepped' || this.graphType == 'Point') {
        return 'scatter';
      }
    }
  }, {
    key: "layoutMaker",
    value: function layoutMaker() {
      var layout = {};

      if (this.graphType == 'Horizontal' || this.graphType == 'Vertical') {
        layout['barmode'] = 'group';
      }

      return layout;
    }
  }, {
    key: "traceMaker",
    value: function traceMaker() {
      var trace = {};
      trace['type'] = this.determineType2();

      if (this.graphType == 'Horizontal') {
        trace['orientation'] = 'h';
      } else if (this.graphType == 'Doughnut') {
        trace['hole'] = 0.5;
      } else if (this.graphType == 'Basic') {
        trace['mode'] = 'lines';
      } else if (this.graphType == 'Point') {
        trace['mode'] = 'markers';
      } else if (this.graphType == 'Stepped') {
        trace['mode'] = 'lines+markers';
        trace['line'] = {
          shape: 'hv'
        };
      }

      return trace;
    }
  }, {
    key: "keyDeterminer",
    value: function keyDeterminer() {
      var keys = ['x', 'y'];

      if (this.graphType == 'Pie' || this.graphType == 'Doughnut') {
        keys[1] = 'values';
        keys[0] = 'labels';
      } else if (this.graphType == 'Horizontal') {
        keys[0] = 'y';
        keys[1] = 'x';
      }

      return keys;
    }
  }, {
    key: "plotGraph2",
    value: function plotGraph2() {
      if (this.flag) {
        //   console.log("at plotGraph");
        document.getElementById(this.canvasContainerId).innerHTML = '';
      }

      var layout = this.layoutMaker();
      var data = [];
      var keySet = this.keyDeterminer();

      for (var i = 0; i < this.length; i++) {
        var new_trace = this.traceMaker();
        new_trace[keySet[0]] = this.dataHash['x_axis_labels'];
        new_trace[keySet[1]] = this.dataHash['y_axis_values' + i];
        new_trace['name'] = this.dataHash['labels'][1][i];
        data.push(new_trace);
      } // console.log(data);


      var div = document.createElement('div');
      div.id = this.elementId + '_chart_container_' + this.graphCounting;
      document.getElementById(this.canvasContainerId).appendChild(div);
      window.Plotly.newPlot(div.id, data, layout);
    }
  }]);

  function PlotlyjsPlotter(hash, length, type, flag, canvasContainerId, elementId, graphCounting) {
    _classCallCheck(this, PlotlyjsPlotter);

    _defineProperty(this, "dataHash", {});

    _defineProperty(this, "elementId", null);

    _defineProperty(this, "graphCounting", 0);

    _defineProperty(this, "canvasContainerId", null);

    _defineProperty(this, "graphType", null);

    _defineProperty(this, "length", 0);

    _defineProperty(this, "flag", false);

    this.dataHash = hash;
    this.length = length;
    this.graphType = type;
    this.flag = flag;
    this.canvasContainerId = canvasContainerId;
    this.elementId = elementId;
    this.graphCounting = graphCounting;
    this.plotGraph2();
  }

  return PlotlyjsPlotter;
}();

module.exports = PlotlyjsPlotter;
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleDataGrapher = void 0;

var _View = require("./View");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SimpleDataGrapher = function SimpleDataGrapher(elementId) {
  _classCallCheck(this, SimpleDataGrapher);

  _defineProperty(this, "elementId", null);

  _defineProperty(this, "view", null);

  this.elementId = elementId;
  SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId] = this;
  this.view = new _View.View(elementId);
};

exports.SimpleDataGrapher = SimpleDataGrapher;

_defineProperty(SimpleDataGrapher, "elementIdSimpleDataGraphInstanceMap", {});

window.SimpleDataGrapher = SimpleDataGrapher;
},{"./View":5}],5:[function(require,module,exports){
/* moved to the top of file to fix linter error.
 ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Strict_Non_Simple_Params*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CsvParser = require('./CsvParser'); // const SimpleDataGrapher = require('./SimpleDataGrapher');


var ChartjsPlotter = require('./ChartjsPlotter');

var PlotlyjsPlotter = require('./PlotlyjsPlotter');

var iframe_phone = require('iframe-phone');

var sheetLink;

var View =
/*#__PURE__*/
function () {
  _createClass(View, [{
    key: "handleFileSelectlocal",
    //extracts the uploaded file from input field and creates an object of CsvParser class with the file as one of the parameters
    value: function handleFileSelectlocal(event) {
      this.csvFile = event.target.files[0];

      if (this.csvFile['name'].split('.')[1] != 'csv') {
        alert('Invalid file type');
      } else {
        $('#' + this.dragDropHeadingId).text(this.csvFile['name']);
        var self = this;

        document.getElementById(this.uploadButtonId).onclick = function () {
          self.csvParser = new CsvParser(self.csvFile, self.elementId, 'local');
        };
      }
    } //receives the string value and creates an object of CsvParser class with the string as one of the parameters

  }, {
    key: "handleFileSelectstring",
    value: function handleFileSelectstring(val) {
      // var csv_string = val.split("\n");
      this.csvFile = val;
      var self = this;

      document.getElementById(this.uploadButtonId).onclick = function () {
        self.csvParser = new CsvParser(self.csvFile, self.elementId, 'csvstring');
      };
    } // function for using a previously uploaded and saved file from the data base

  }, {
    key: "usingPreviouslyUploadedFile",
    value: function usingPreviouslyUploadedFile() {
      var self = this;
      self.csvParser = new CsvParser('dummy', self.elementId, 'prevfile');
    } //receives the JSON file value and creates an object of CsvParser class with the file as one of the parameters

  }, {
    key: "handleFileSelectGoogleSheet",
    value: function handleFileSelectGoogleSheet(googleSheetData) {
      this.csvFile = googleSheetData;
      var self = this;

      document.getElementById(this.uploadButtonId).onclick = function () {
        self.csvParser = new CsvParser(self.csvFile, self.elementId, 'googleSheet');
      };
    } // get's the JSON form of the Google Sheet through Google Sheet's URL and passes it to the handler

  }, {
    key: "getValueGoogleSheet",
    value: function getValueGoogleSheet(googleSheetLink) {
      var self = this;
      $.getJSON(googleSheetLink, function (data) {
        self.handleFileSelectGoogleSheet(data.feed.entry);
      });
    } // uses a CORS proxy to fetch the value of a remote files and passes the received value to a callback function

  }, {
    key: "sendRemoteFileToHandler",
    value: function sendRemoteFileToHandler(val) {
      var _this = this;

      var proxyurl = 'https://cors-anywhere.herokuapp.com/';
      var url = val;
      fetch(proxyurl + url).then(function (response) {
        return response.text();
      }).then(function (contents) {
        return _this.handleFileSelectremote(contents);
      }); // .catch((e) => console.log(e)) ;
    } // callback function which receives the remote file's value and creates an object of CsvParser class with the file as one of the parameters

  }, {
    key: "handleFileSelectremote",
    value: function handleFileSelectremote(remoteVal) {
      this.csvFile = remoteVal;
      var self = this;

      document.getElementById(this.uploadButtonId).onclick = function () {
        self.csvParser = new CsvParser(self.csvFile, self.elementId, 'remote');
      };
    } // adapter function which switches between Plotly.js and Chart.js as a graph plotting library and creates theri respective objects which take over the graph plotting

  }, {
    key: "plotGraph",
    value: function plotGraph(hash, length, type, flag, library) {
      if (library == 'chartjs') {
        this.chartjsPlotter = new ChartjsPlotter(hash, length, type, flag, this.canvasContinerId, this.elementId, this.graphCounting);
      } else {
        this.plotlyjsPlotter = new PlotlyjsPlotter(hash, length, type, flag, this.canvasContinerId, this.elementId, this.graphCounting);
      }

      $('.' + this.carousalClass).carousel(2);
    } //set tool tip for impot options

  }, {
    key: "setTooltip",
    value: function setTooltip(importType) {
      if (importType === 'container_drag_drop') {
        return 'Select a local file from your system';
      } else if (importType === 'container_csv_string') {
        var x = 'Type in or Paste a CSV string. \r\n';
        x += 'Example: \r\n';
        x += 'A,B,C \r\n';
        x += '1,2,3';
        return x;
      } else if (importType === 'container_remote_link') {
        return 'Type in or Paste the link of a remote CSV file. Example: \
            http://example.com/example.csv';
      } else if (importType === 'container_google_sheet') {
        return 'Type in or Paste the link of a Published Google Sheet. To publish a Google Sheet: 1. File -> Publish to the web -> Publish 2. Share -> Get shareable link -> Anyone with the link can -> More -> On - Public on the web -> Save 3. Copy link';
      }
    } //set tool tip for graph tips

  }, {
    key: "setTooltipGraph",
    value: function setTooltipGraph(graphType) {
      if (graphType == 'Horizontal') {
        return 'Data is categorical and tells how many, widths proportional to the values';
      } else if (graphType === 'Vertical') {
        return 'Data is categorical and tells how many, heights proportional to the values';
      } else if (graphType == 'Stacked') {
        return 'Ideal for comparing the total amounts across each group/segmented bar';
      } else if (graphType == 'Basic') {
        return 'Used to visualize a trend in data over intervals of time or to see the growth of a quantity';
      } else if (graphType == 'Stepped') {
        return 'Vertical parts of a step chart denote changes in the data and their magnitude';
      } else if (graphType == 'Point') {
        return 'Used to show the relationship between two data variables';
      } else if (graphType == 'Pie') {
        return 'Used to show percentage or proportional data, should be used for less number of categories';
      } else if (graphType == 'Doughnut') {
        return 'Used to show percentage or proportional data, but have better data intensity ratio and space efficiency';
      } else if (graphType == 'Radar') {
        return 'Used to display multivariate observations with an arbitrary number of variables';
      }
    } // create a popover against each import method for adding a file title and description

  }, {
    key: "createPopover",
    value: function createPopover(buttonId) {
      var self = this;
      var html = '<div id="myForm" class="hide"><label for="title" class="popover_headings">File Title:</label><input type="text" name="title" id=' + 'title' + buttonId + ' class="form-control input-md"><label for="desc" class="popover_headings">File Description:</label><textarea rows="3" name="desc" id=' + 'desc' + buttonId + ' class="form-control input-md"></textarea><button type="button" class="btn btn-primary popover_headings" id="save"> Save</button></div>';
      $('#' + buttonId).popover({
        placement: 'bottom',
        title: 'Add Description',
        html: true,
        content: html
      }).on('click', function () {
        $('#save').click(function (e) {
          e.preventDefault();
          self.fileTitle = $('#' + 'title' + buttonId).val();
          self.fileDescription = $('#' + 'desc' + buttonId).val();
        });
      });
    } // renders the required buttons for saving the files if the use is logged in

  }, {
    key: "createButtons",
    value: function createButtons(userLoginCheck) {
      this.listenersForIntegration();

      if (userLoginCheck == 'yes') {
        var save_file_button = document.createElement('button');
        save_file_button.classList.add('btn');
        save_file_button.classList.add('btn-primary');
        save_file_button.innerHTML = 'Save CSV';
        save_file_button.id = this.elementId + '_save_CSV';
        var upload_prev_file = document.createElement('button');
        upload_prev_file.classList.add('btn');
        upload_prev_file.classList.add('btn-primary');
        upload_prev_file.innerHTML = 'Choose a previously uploaded file';
        upload_prev_file.id = this.elementId + '_prev_file';
        var publish_research_button = document.createElement('button');
        publish_research_button.classList.add('btn');
        publish_research_button.classList.add('btn-primary');
        publish_research_button.innerHTML = 'Publish as a Research Note';
        publish_research_button.id = this.elementId + '_publish';
        var container = document.getElementById(this.upload_button_container);
        var div_container = document.createElement('div');
        div_container.appendChild(save_file_button);
        div_container.appendChild(upload_prev_file);
        var container2 = document.getElementById(this.feature_button_container);
        container2.appendChild(publish_research_button);
        container.prepend(div_container);
      }
    } // create dataset for CODAP table

  }, {
    key: "createDataset",
    value: function createDataset() {
      var dataset = {};
      dataset['action'] = 'create';
      dataset['resource'] = 'dataContext';
      var values = {};
      values['name'] = 'my dataset';
      values['title'] = 'Case Table';
      var collections = [];
      var hashCollections = {};
      hashCollections['name'] = 'cases';
      hashCollections['attrs'] = this.csvParser.codapHeaders;
      collections.push(hashCollections);
      values['collections'] = collections;
      dataset['values'] = values;
      var dataset2 = {};
      dataset2['action'] = 'create';
      dataset2['resource'] = 'dataContext[my dataset].item';
      dataset2['values'] = this.csvParser.codapMatrix;
      var dataset3 = {};
      dataset3['action'] = 'create';
      dataset3['resource'] = 'component';
      var values3 = {};
      values3['type'] = 'caseTable';
      values3['dataContext'] = 'my dataset';
      dataset3['values'] = values3;
      return [dataset, dataset2, dataset3];
    }
  }, {
    key: "iframePhoneHandler",
    value: function iframePhoneHandler() {} //callbackforCODAP
    // renders the iframe for CODAP export

  }, {
    key: "codapExport",
    value: function codapExport() {
      var self = this;
      var iframeBody = '<iframe id="codap-iframe" src="https://codap.concord.org/releases/latest?embeddedServer=yes#shared=109578" ></iframe>';
      var modal_body = document.getElementById('body_for_CODAP');
      modal_body.innerHTML = iframeBody;
      var iframe = document.getElementById('codap-iframe');
      modal_body.style.height = '500px';
      iframe.style.width = '750px';
      iframe.style.height = '90%';
      var codapIframe = document.getElementById('codap-iframe');
      var rpcHandler = new iframe_phone.IframePhoneRpcEndpoint(self.iframePhoneHandler, 'data-interactive', codapIframe);
      var createCodapButton = document.createElement('button');
      createCodapButton.classList.add('btn');
      createCodapButton.classList.add('btn-primary');
      createCodapButton.innerHTML = 'Go!';
      createCodapButton.id = this.elementId + '_create_codap';
      modal_body.prepend(createCodapButton);
      var apiCall = this.createDataset();
      $('#' + this.elementId + '_create_codap').click(function () {
        rpcHandler.call(apiCall, function (resp) {
          // eslint-disable-next-line no-console
          console.log('Response:' + JSON.stringify(resp));
        });
      });
    } // creates a downloadable spreadsheet for the imported data using SheetJS

  }, {
    key: "createSheet",
    value: function createSheet() {
      // eslint-disable-next-line no-undef
      var wb = XLSX.utils.book_new();
      wb.Props = {
        Title: 'New Spreadsheet' + this.elementId,
        CreatedDate: new Date()
      };
      wb.SheetNames.push('Sheet' + this.elementId);
      var ws_data = this.csvParser.completeCsvMatrixTranspose; // eslint-disable-next-line no-undef

      var ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.Sheets['Sheet' + this.elementId] = ws; // eslint-disable-next-line no-undef

      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'binary'
      });

      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);

        for (var i = 0; i < s.length; i++) {
          view[i] = s.charCodeAt(i) & 0xff;
        }

        return buf;
      } // eslint-disable-next-line no-undef


      saveAs(new Blob([s2ab(wbout)], {
        type: 'application/octet-stream'
      }), 'newSpreadsheet' + this.elementId + '.xlsx');
    } // creates a hash of the entire data in an accesible format for the charting libraries {labels: [legendx, [legendy0, legendy1 ... lengendyn]], x_axis_values: [...], y_axis_0: [...], y_axis_1: [...], ... y_axis_n: [...]} n: selected number of columns
    // flag is just for seeing if we're plotting the graph for the first time, if yes, we will have to clear the canvas.
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "afterSampleData",
    value: function afterSampleData(flag, type) {
      var _this2 = this;

      document.getElementById(this.plotGraphId).onclick = function (e) {
        e.preventDefault();
        var hash = {};
        var ix = $('input[name=' + _this2.tableXInputName + ']:checked').val();
        hash['x_axis_labels'] = _this2.csvParser.completeCsvMatrix[ix];
        var columns = new Array();
        var y_axis_names = new Array();
        $('input:checkbox[name=' + _this2.tableYInputName + ']:checked').each(function (index, element) {
          columns.push(element.value);
        });

        for (var i = 0; i < columns.length; i++) {
          hash['y_axis_values' + i] = _this2.csvParser.completeCsvMatrix[columns[i]];
          y_axis_names.push(_this2.csvParser.csvHeaders[columns[i]]);
        }

        var labels = [_this2.csvParser.csvHeaders[ix], y_axis_names];
        hash['labels'] = labels;
        var selectedGraph = $('.selected');
        var type = selectedGraph.attr('data-value');

        _this2.plotGraph(hash, columns.length, type, flag, 'plotly');
      };
    } // generates a graph menu with different graph options

  }, {
    key: "graphMenu",
    value: function graphMenu(flag) {
      var self = this;
      $('.' + this.carousalClass).carousel(1);
      var menuDiv = document.getElementById('menu_holder');
      menuDiv.innerHTML = '<p id="graph_description"> blahhhhh </p> <div class="grid-container radio-group"> <div class="grid-item radio" data-value="Horizontal"> <img src="https://i.ibb.co/8gfR9d9/horizontal.png" height="100px" width="100px"> <div class="hmm" id="HorizontalType"> <p> Horizontal Bar </p> </div> </div> <div class="grid-item radio" data-value="Vertical"> <img src="https://i.ibb.co/tZVgrBw/vertical.png" height="100px" width="100px"> <div class="hmm" id="VerticalType"> <p> Vertical Bar </p> </div> </div> <div class="grid-item radio" data-value="Stacked"> <img src="https://i.ibb.co/9T2df0z/stacked.png" height="100px" width="100px"> <div class="hmm" id="StackedType"> <p> Stacked Bar </p> </div></div> <div class="grid-item radio" data-value="Basic"> <img src="https://i.ibb.co/S7rDsPV/basic.png" height="100px" width="100px"> <div class="hmm" id="BasicType"> <p> Basic Line </p> </div> </div> <div class="grid-item radio" data-value="Stepped"> <img src="https://i.ibb.co/FbB7yjg/stepped.png" height="100px" width="100px"> <div class="hmm" id="SteppedType"> <p> Stepped Line </p> </div> </div> <div class="grid-item radio" data-value="Point"> <img src="https://i.ibb.co/kqdQyqx/point.png" height="100px" width="100px"> <div class="hmm" id="PointType"> <p> Point </p> </div> </div> <div class="grid-item radio" data-value="Pie"> <img src="https://i.ibb.co/JcJ0tv3/pie.png" height="100px" width="110px"> <div class="hmm" id="PieType"> <p> Pie </p> </div> </div> <div class="grid-item radio" data-value="Doughnut"> <img src="https://i.ibb.co/SnLkwTv/doughnut.png" height="100px" width="110px"> <div class="hmm" id="DoughnutType"> <p> Doughnut </p> </div> </div> <div class="grid-item radio" data-value="Radar"> <img src="https://i.ibb.co/BCmQ2Tq/radar.png" height="100px" width="100px"> <div class="hmm" id="RadarType"> <p> Radar </p> </div> </div> </div> <p class="d"> blahhh </p>';
      $('.radio-group .radio').click(function () {
        $(this).parent().find('.radio').removeClass('selected');
        var l = document.getElementsByClassName('hmm');

        for (var i = 0; i < l.length; i++) {
          l[i].style.backgroundColor = '#cccccc';
        }

        $(this).addClass('selected');
        var type = $(this).attr('data-value');
        $('#' + type + 'Type').css('backgroundColor', '#1ad1ff');
      });
      $('.radio').hover(function () {
        var tooltipVal = self.setTooltipGraph($(this).attr('data-value'));
        $('#graph_description').text(tooltipVal);
        $('#graph_description').css({
          opacity: 0.0,
          visibility: 'visible'
        }).animate({
          opacity: 1.0
        }, 800);
      }, function () {
        $('#graph_description').css('visibility', 'hidden');
      });
      this.afterSampleData(flag);
    } // generates the sample table data with checkboxes for y-axis and radio buttons for x-axis

  }, {
    key: "tableGenerator",
    value: function tableGenerator(name, tableId, typeOfInput, validValues, flag, tableType, badgeType) {
      document.getElementById(tableId).innerHTML = '';
      var trhead = document.createElement('tr');

      for (var i = 0; i < this.csvParser.csvHeaders.length; i++) {
        var td = document.createElement('td');
        var span = document.createElement('span');
        var textnode = document.createTextNode(this.csvParser.csvHeaders[i]);
        span.appendChild(textnode);
        span.classList.add('badge');
        span.classList.add('badge-pill');
        span.classList.add(badgeType);
        td.appendChild(span);

        for (var j = 0; j < validValues.length; j++) {
          if (validValues[j] == this.csvParser.csvHeaders[i]) {
            var checkbox = document.createElement('input');
            checkbox.type = typeOfInput;
            checkbox.value = i;
            checkbox.name = name;
            checkbox.id = name + i;
            checkbox.classList.add('check-inputs');
            span.appendChild(checkbox);
          }
        }

        trhead.appendChild(td);
      }

      trhead.classList.add(tableType);
      document.getElementById(tableId).appendChild(trhead);

      for (var _i = 0; _i < this.csvParser.csvSampleData[0].length; _i++) {
        var tr = document.createElement('tr');

        for (var _j = 0; _j < this.csvParser.csvHeaders.length; _j++) {
          var _td = document.createElement('td');

          _td.appendChild(document.createTextNode(this.csvParser.csvSampleData[_j][_i]));

          tr.appendChild(_td);
        }

        document.getElementById(tableId).appendChild(tr);
      }

      this.graphMenu(flag);
    } // renders the sample tables

  }, {
    key: "showSampleDataXandY",
    value: function showSampleDataXandY() {
      var _this3 = this;

      document.getElementById(this.addGraphButtonId).onclick = function () {
        _this3.graphCounting++;
        $('.' + _this3.carousalClass).carousel(1); /// ---------------> after

        _this3.tableGenerator(_this3.tableXInputName, _this3.tableXId, 'radio', _this3.csvParser.csvHeaders, false, 'table-success', 'badge-success');

        _this3.tableGenerator(_this3.tableYInputName, _this3.tableYId, 'checkbox', _this3.csvParser.csvValidForYAxis, false, 'table-warning', 'badge-warning');

        _this3.graphMenu();
      };

      this.tableGenerator(this.tableXInputName, this.tableXId, 'radio', this.csvParser.csvHeaders, true, 'table-success', 'badge-success');
      this.tableGenerator(this.tableYInputName, this.tableYId, 'checkbox', this.csvParser.csvValidForYAxis, true, 'table-warning', 'badge-warning');
      this.graphMenu();
    } // view manipulation resumes after the CsvParser object is created and returned

  }, {
    key: "continueViewManipulation",
    value: function continueViewManipulation(x) {
      if (x != 'prevfile') {
        this.csvParser = x;
      }

      this.showSampleDataXandY(); // this.showSampleDataXandY(this.csvParser.csvSampleData, this.csvParser.csvHeaders, this.csvParser.csvValidForYAxis, this.csvParser.csvSampleData);
      // sampleDataXandY(this.csvSampleData,this.csvHeaders,this.csvValidForYAxis,this.completeCsvMatrix);
      // matrixForCompleteData(headers,this.csvMatrix,start);
    }
  }, {
    key: "listenersForIntegration",
    value: function listenersForIntegration() {
      var _this4 = this;

      $('#' + this.fileUploadId).change(function (e) {
        // console.log("i am here23");
        document.getElementById('popover' + _this4.fileUploadId).style.display = 'inline';
        document.getElementById('popover' + _this4.csvStringUploadId).style.display = 'none';
        document.getElementById('popover' + _this4.googleSheetUploadId).style.display = 'none';
        document.getElementById('popover' + _this4.remoteFileUploadId).style.display = 'none';

        _this4.createPopover('popover' + _this4.fileUploadId);

        _this4.handleFileSelectlocal(e);
      });
      $('#' + this.csvStringUploadId).change(function () {
        // console.log(document.getElementById(this.csvStringUploadId).value);
        document.getElementById('popover' + _this4.csvStringUploadId).style.display = 'inline';
        document.getElementById('popover' + _this4.googleSheetUploadId).style.display = 'none';
        document.getElementById('popover' + _this4.remoteFileUploadId).style.display = 'none';
        document.getElementById('popover' + _this4.fileUploadId).style.display = 'none';

        _this4.createPopover('popover' + _this4.csvStringUploadId);

        _this4.handleFileSelectstring(document.getElementById(_this4.csvStringUploadId).value);
      });
      $('#' + this.googleSheetUploadId).change(function () {
        // console.log(document.getElementById(this.googleSheetUploadId).value,"sheetlink");
        document.getElementById('popover' + _this4.googleSheetUploadId).style.display = 'inline';
        document.getElementById('popover' + _this4.csvStringUploadId).style.display = 'none';
        document.getElementById('popover' + _this4.remoteFileUploadId).style.display = 'none';
        document.getElementById('popover' + _this4.fileUploadId).style.display = 'none';

        _this4.createPopover('popover' + _this4.googleSheetUploadId);

        sheetLink = document.getElementById(_this4.googleSheetUploadId).value;
        var sheetURL = 'https://spreadsheets.google.com/feeds/list/' + sheetLink.split('/')[5] + '/od6/public/values?alt=json';

        _this4.getValueGoogleSheet(sheetURL);
      });
      $('#' + this.remoteFileUploadId).change(function () {
        // console.log(document.getElementById(this.remoteFileUploadId).value);
        document.getElementById('popover' + _this4.remoteFileUploadId).style.display = 'inline';
        document.getElementById('popover' + _this4.csvStringUploadId).style.display = 'none';
        document.getElementById('popover' + _this4.googleSheetUploadId).style.display = 'none';
        document.getElementById('popover' + _this4.fileUploadId).style.display = 'none';

        _this4.createPopover('popover' + _this4.remoteFileUploadId);

        _this4.sendRemoteFileToHandler(document.getElementById(_this4.remoteFileUploadId).value);
      });
    }
  }]);

  function View(elementId) {
    var _this5 = this;

    _classCallCheck(this, View);

    _defineProperty(this, "elementId", null);

    _defineProperty(this, "element", null);

    _defineProperty(this, "fileUploadId", null);

    _defineProperty(this, "remoteFileUploadId", null);

    _defineProperty(this, "csvStringUploadId", null);

    _defineProperty(this, "googleSheetUploadId", null);

    _defineProperty(this, "csvFile", null);

    _defineProperty(this, "dragDropHeadingId", null);

    _defineProperty(this, "uploadButtonId", null);

    _defineProperty(this, "csvParser", null);

    _defineProperty(this, "chartjsPlotter", null);

    _defineProperty(this, "plotlyjsPlotter", null);

    _defineProperty(this, "graphCounting", 0);

    _defineProperty(this, "addGraphButtonId", null);

    _defineProperty(this, "tableXId", null);

    _defineProperty(this, "tableYId", null);

    _defineProperty(this, "tableXInputName", null);

    _defineProperty(this, "tableYInputName", null);

    _defineProperty(this, "carousalClass", null);

    _defineProperty(this, "carousalId", null);

    _defineProperty(this, "graphMenuId", null);

    _defineProperty(this, "plotGraphId", null);

    _defineProperty(this, "graphMenuTypeInputName", null);

    _defineProperty(this, "canvasContinerId", null);

    _defineProperty(this, "xyToggle", null);

    _defineProperty(this, "xyToggleName", null);

    _defineProperty(this, "tableXParentId", null);

    _defineProperty(this, "tableYParentId", null);

    _defineProperty(this, "upload_button_container", null);

    _defineProperty(this, "fileTitle", '');

    _defineProperty(this, "fileDescription", '');

    _defineProperty(this, "codapExportButton", null);

    this.elementId = elementId;
    this.element = document.getElementById(elementId);

    if (this.element == null) {
      throw 'No element exist with this id';
    }

    this.fileUploadId = elementId + '_csv_file';
    this.remoteFileUploadId = elementId + '_remote_file';
    this.csvStringUploadId = elementId + '_csv_string';
    this.googleSheetUploadId = elementId + '_google_sheet';
    this.dragDropHeadingId = elementId + '_drag_drop_heading';
    this.uploadButtonId = elementId + '_file_upload_button';
    this.addGraphButtonId = elementId + '_add_graph';
    this.createSpreadsheetButtonId = elementId + '_save_as_spreadsheet';
    this.tableXId = elementId + '_tableX';
    this.tableYId = elementId + '_tableY';
    this.tableXParentId = elementId + '_Xtable';
    this.tableYParentId = elementId + '_Ytable';
    this.tableXInputName = elementId + '_x_axis_input_columns';
    this.tableYInputName = elementId + '_y_axis_input_columns';
    this.carousalClass = elementId + '_carousal';
    this.carousalId = elementId + '_carousalId';
    this.graphMenuId = elementId + '_graph_menu';
    this.plotGraphId = elementId + '_plot_graph';
    this.graphMenuTypeInputName = elementId + '_types';
    this.canvasContinerId = elementId + '_canvas_container';
    this.xyToggleName = elementId + '_xytoggle';
    this.saveAsImageId = elementId + 'save-as-image';
    this.upload_button_container = elementId + 'upload_button_container';
    this.feature_button_container = elementId + 'feature_button_container';
    this.codapExportButton = elementId + 'codap_export_button';
    this.drawHTMLView();
    this.addListeners();
    var self = this;
    $('.xytoggle').bootstrapToggle({
      on: 'X-Axis',
      off: 'Y-Axis'
    });
    $('input[name=' + this.xyToggleName + ']:checked').change(function () {
      var ixy = $('input[name=' + _this5.xyToggleName + ']:checked').val();
      var ixx = 0;

      if (ixy == undefined) {
        ixx = 1;
      }

      $('#' + _this5.tableXParentId).toggle(ixx === 0);
      $('#' + _this5.tableYParentId).toggle(ixx === 1);
    });
    $('.imports').hover(function () {
      var tooltipVal = self.setTooltip(this.classList[0]);
      $('#import_description').text(tooltipVal);
      $('#import_description').css({
        opacity: 0.0,
        visibility: 'visible'
      }).animate({
        opacity: 1.0
      }, 800);
    }, function () {
      $('#import_description').css('visibility', 'hidden');
    });
  } //listen for different inputs for import by the user


  _createClass(View, [{
    key: "addListeners",
    value: function addListeners() {
      var _this6 = this;

      $('#' + this.fileUploadId).change(function (e) {
        _this6.handleFileSelectlocal(e);
      });
      $('#' + this.csvStringUploadId).change(function () {
        _this6.handleFileSelectstring(document.getElementById(_this6.csvStringUploadId).value);
      });
      $('#' + this.googleSheetUploadId).change(function () {
        var sheetURL = 'https://spreadsheets.google.com/feeds/list/' + sheetLink.split('/')[5] + '/od6/public/values?alt=json';

        _this6.getValueGoogleSheet(sheetURL);
      });
      $('#' + this.remoteFileUploadId).change(function () {
        _this6.sendRemoteFileToHandler(document.getElementById(_this6.remoteFileUploadId).value);
      });
      $('#' + this.createSpreadsheetButtonId).click(function () {
        _this6.createSheet();
      });
      $('#' + this.codapExportButton).click(function () {
        _this6.codapExport();
      });
    } //renders the entire HTML view

  }, {
    key: "drawHTMLView",
    value: function drawHTMLView() {
      this.element.innerHTML = '<div class="body_container"> <div class="main_heading_container"> <h2 class="main_heading">Simple Data Grapher</h2> <p class="sub_heading">A JavaScript library that turns uploaded CSV files into customizable graphs within a few simple steps. Can be embedded on other websites!</p> <p class="sub_heading"> Open Source <a href="https://github.com/publiclab/simple-data-grapher"> <i class="fab fa-github"></i> </a> by <a href="https://publiclab.org" title="Public Lab Website"><i class="fa fa-globe"></i> Public Lab</a> </p> </div> <div class="heading_container"> <ul class="headings"> <li class="item-1">Upload CSV Data</li> <li class="item-2">Select Columns & Graph Type</li> <li class="item-3">Plotted Graph & Export Options</li> </ul> </div> <div id=' + this.carousalId + ' class="carousel ' + this.carousalClass + ' slide" data-ride="carousel" data-interval="false"> <div class="indicators"> <ol class="carousel-indicators"> <li data-target="#' + this.carousalId + '" data-slide-to="0" class="active" id="up" class="first_indicator"></li> <li data-target="#' + this.carousalId + '" data-slide-to="1" class="second_indicator"></li> <li data-target="#' + this.carousalId + '" data-slide-to="2" class="third_indicator"></li> </ol> </div> <div class="carousel-inner"> <div class="carousel-item active"> <div class="parent_main_container"> <div> <p id="import_description"> text_for_replacement</p> </div> <div class="main_container"> <div class="main_grid_container"> <div class="container_drag_drop grid-item imports"> <p class="sub_heading_import"> Local File </p> <span class="btn btn-outline-primary btn-file input_box shadow"> <p class="drag_drop_heading" id=' + this.dragDropHeadingId + '><u> Choose a csv file </u> or drag & drop it here </p> <input type="file" class="csv_file" id=' + this.fileUploadId + ' accept=".csv"> </span> <button type="button" class="btn btn-dark des" id=' + 'popover' + this.fileUploadId + '> <i class="fa fa-list"></i> </button> </div> <div class="container_remote_link grid-item imports"> <p class="sub_heading_import"> Remote File </p> <input type="text" class="remote_file text_field shadow" placeholder="url of remote file" id=' + this.remoteFileUploadId + '> <button type="button" class="btn btn-dark des" id=' + 'popover' + this.remoteFileUploadId + '><i class="fa fa-list"></i></button> </div> <div class="container_csv_string grid-item imports"> <p class="sub_heading_import"> String File </p> <textarea class="csv_string text_field shadow" id=' + this.csvStringUploadId + ' placeholder="Paste a CSV string here"></textarea> <button type="button" class="btn btn-dark des" id=' + 'popover' + this.csvStringUploadId + '><i class="fa fa-list"></i></button> </div> <div class="container_google_sheet grid-item imports"> <p class="sub_heading_import"> Google Sheet </p> <div class="google_sheet_container"> <input type="text" class="google_sheet text_field shadow" id=' + this.googleSheetUploadId + ' placeholder="Link of published Google Sheet"> <button type="button" class="btn btn-dark des" id=' + 'popover' + this.googleSheetUploadId + '><i class="fa fa-list"></i></button> </div> </div> </div> <div id=' + this.upload_button_container + ' class="upload_button"> <button type="button" class="btn btn-primary uploadButton" id=' + this.uploadButtonId + '>Upload CSV</button> </div> </div> <div style="visibility: hidden;"> <p> heyyyyy</p> </div> </div> </div> <div class="carousel-item tables"> <div class="button_container"> <div> <input type="checkbox" name=' + this.xyToggleName + ' checked data-toggle="toggle" class="xytoggle" id="xy" data-width="150" data-onstyle="success" data-offstyle="warning" data-height="40"> </div> <div class="plot_button"> <button type="button" class="btn btn-primary plotGraph" id=' + this.plotGraphId + '>Plot Graph</button> </div> </div> <div class="table_container"> <div id=' + this.tableXParentId + '> <table id=' + this.tableXId + ' class="table"></table> </div> <div id=' + this.tableYParentId + ' class="hidden"> <table id=' + this.tableYId + ' class="table"></table> </div> <div id="menu_holder"></div> </div> </div> <div class="carousel-item graph"> <div id=' + this.feature_button_container + ' class="feature_buttons"> <button type="button" class="btn btn-primary addGraph" id=' + this.addGraphButtonId + '> Add Graph</button> <button type="button" class="btn btn-success createSpreadsheet" id=' + this.createSpreadsheetButtonId + '> Create Spreadsheet<i class="fa fa-plus" aria-hidden="true"></i></button> <button type="button" class="btn btn-info codapExport" id=' + this.codapExportButton + ' data-toggle="modal" data-target="#exampleModalCenter">View and Export to CODAP</button> </div> <div class="parent_canvas_container"> <div id=' + this.canvasContinerId + '></div> </div> </div> </div> </div></div><div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"> <div class="modal-dialog modal-lg modal-dialog-centered" id="modal-style" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="exampleModalLongTitle">CODAP</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body" id="body_for_CODAP"></div> </div> </div></div>';
    }
  }]);

  return View;
}();

exports.View = View;
},{"./ChartjsPlotter":1,"./CsvParser":2,"./PlotlyjsPlotter":3,"iframe-phone":10}],6:[function(require,module,exports){
var structuredClone = require('./structured-clone');
var HELLO_INTERVAL_LENGTH = 200;
var HELLO_TIMEOUT_LENGTH = 60000;

function IFrameEndpoint() {
  var listeners = {};
  var isInitialized = false;
  var connected = false;
  var postMessageQueue = [];
  var helloInterval;

  function postToParent(message) {
    // See http://dev.opera.com/articles/view/window-postmessage-messagechannel/#crossdoc
    //     https://github.com/Modernizr/Modernizr/issues/388
    //     http://jsfiddle.net/ryanseddon/uZTgD/2/
    if (structuredClone.supported()) {
      window.parent.postMessage(message, '*');
    } else {
      window.parent.postMessage(JSON.stringify(message), '*');
    }
  }

  function post(type, content) {
    var message;
    // Message object can be constructed from 'type' and 'content' arguments or it can be passed
    // as the first argument.
    if (arguments.length === 1 && typeof type === 'object' && typeof type.type === 'string') {
      message = type;
    } else {
      message = {
        type: type,
        content: content
      };
    }
    if (connected) {
      postToParent(message);
    } else {
      postMessageQueue.push(message);
    }
  }

  function postHello() {
    postToParent({
      type: 'hello'
    });
  }

  function addListener(type, fn) {
    listeners[type] = fn;
  }

  function removeAllListeners() {
    listeners = {};
  }

  function getListenerNames() {
    return Object.keys(listeners);
  }

  function messageListener(message) {
    // Anyone can send us a message. Only pay attention to messages from parent.
    if (message.source !== window.parent) return;
    var messageData = message.data;
    if (typeof messageData === 'string') messageData = JSON.parse(messageData);

    if (!connected && messageData.type === 'hello') {
      connected = true;
      stopPostingHello();
      while (postMessageQueue.length > 0) {
        post(postMessageQueue.shift());
      }
    }

    if (connected && listeners[messageData.type]) {
      listeners[messageData.type](messageData.content);
    }
  }

  function disconnect() {
    connected = false;
    stopPostingHello();
    window.removeEventListener('message', messsageListener);
  }

  /**
    Initialize communication with the parent frame. This should not be called until the app's custom
    listeners are registered (via our 'addListener' public method) because, once we open the
    communication, the parent window may send any messages it may have queued. Messages for which
    we don't have handlers will be silently ignored.
  */
  function initialize() {
    if (isInitialized) {
      return;
    }
    isInitialized = true;
    if (window.parent === window) return;

    // We kick off communication with the parent window by sending a "hello" message. Then we wait
    // for a handshake (another "hello" message) from the parent window.
    startPostingHello();
    window.addEventListener('message', messageListener, false);
  }

  function startPostingHello() {
    if (helloInterval) {
      stopPostingHello();
    }
    helloInterval = window.setInterval(postHello, HELLO_INTERVAL_LENGTH);
    window.setTimeout(stopPostingHello, HELLO_TIMEOUT_LENGTH);
    // Post the first msg immediately.
    postHello();
  }

  function stopPostingHello() {
    window.clearInterval(helloInterval);
    helloInterval = null;
  }

  // Public API.
  return {
    initialize: initialize,
    getListenerNames: getListenerNames,
    addListener: addListener,
    removeAllListeners: removeAllListeners,
    disconnect: disconnect,
    post: post
  };
}

var instance = null;

// IFrameEndpoint is a singleton, as iframe can't have multiple parents anyway.
module.exports = function getIFrameEndpoint() {
  if (!instance) {
    instance = new IFrameEndpoint();
  }
  return instance;
};

},{"./structured-clone":9}],7:[function(require,module,exports){
var ParentEndpoint = require('./parent-endpoint');
var getIFrameEndpoint = require('./iframe-endpoint');

// Not a real UUID as there's an RFC for that (needed for proper distributed computing).
// But in this fairly parochial situation, we just need to be fairly sure to avoid repeats.
function getPseudoUUID() {
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var len = chars.length;
  var ret = [];

  for (var i = 0; i < 10; i++) {
    ret.push(chars[Math.floor(Math.random() * len)]);
  }
  return ret.join('');
}

module.exports = function IframePhoneRpcEndpoint(handler, namespace, targetWindow, targetOrigin, phone) {
  var pendingCallbacks = Object.create({});

  // if it's a non-null object, rather than a function, 'handler' is really an options object
  if (handler && typeof handler === 'object') {
    namespace = handler.namespace;
    targetWindow = handler.targetWindow;
    targetOrigin = handler.targetOrigin;
    phone = handler.phone;
    handler = handler.handler;
  }

  if (!phone) {
    if (targetWindow === window.parent) {
      phone = getIFrameEndpoint();
      phone.initialize();
    } else {
      phone = new ParentEndpoint(targetWindow, targetOrigin);
    }
  }

  phone.addListener(namespace, function (message) {
    var callbackObj;

    if (message.messageType === 'call' && typeof this.handler === 'function') {
      this.handler.call(undefined, message.value, function (returnValue) {
        phone.post(namespace, {
          messageType: 'returnValue',
          uuid: message.uuid,
          value: returnValue
        });
      });
    } else if (message.messageType === 'returnValue') {
      callbackObj = pendingCallbacks[message.uuid];

      if (callbackObj) {
        window.clearTimeout(callbackObj.timeout);
        if (callbackObj.callback) {
          callbackObj.callback.call(undefined, message.value);
        }
        pendingCallbacks[message.uuid] = null;
      }
    }
  }.bind(this));

  function call(message, callback) {
    var uuid = getPseudoUUID();

    pendingCallbacks[uuid] = {
      callback: callback,
      timeout: window.setTimeout(function () {
        if (callback) {
          callback(undefined, new Error("IframePhone timed out waiting for reply"));
        }
      }, 2000)
    };

    phone.post(namespace, {
      messageType: 'call',
      uuid: uuid,
      value: message
    });
  }

  function disconnect() {
    phone.disconnect();
  }

  this.handler = handler;
  this.call = call.bind(this);
  this.disconnect = disconnect.bind(this);
};

},{"./iframe-endpoint":6,"./parent-endpoint":8}],8:[function(require,module,exports){
var structuredClone = require('./structured-clone');

/**
  Call as:
    new ParentEndpoint(targetWindow, targetOrigin, afterConnectedCallback)
      targetWindow is a WindowProxy object. (Messages will be sent to it)

      targetOrigin is the origin of the targetWindow. (Messages will be restricted to this origin)

      afterConnectedCallback is an optional callback function to be called when the connection is
        established.

  OR (less secure):
    new ParentEndpoint(targetIframe, afterConnectedCallback)

      targetIframe is a DOM object (HTMLIframeElement); messages will be sent to its contentWindow.

      afterConnectedCallback is an optional callback function

    In this latter case, targetOrigin will be inferred from the value of the src attribute of the
    provided DOM object at the time of the constructor invocation. This is less secure because the
    iframe might have been navigated to an unexpected domain before constructor invocation.

  Note that it is important to specify the expected origin of the iframe's content to safeguard
  against sending messages to an unexpected domain. This might happen if our iframe is navigated to
  a third-party URL unexpectedly. Furthermore, having a reference to Window object (as in the first
  form of the constructor) does not protect against sending a message to the wrong domain. The
  window object is actualy a WindowProxy which transparently proxies the Window object of the
  underlying iframe, so that when the iframe is navigated, the "same" WindowProxy now references a
  completely differeent Window object, possibly controlled by a hostile domain.

  See http://www.esdiscuss.org/topic/a-dom-use-case-that-can-t-be-emulated-with-direct-proxies for
  more about this weird behavior of WindowProxies (the type returned by <iframe>.contentWindow).
*/

module.exports = function ParentEndpoint(targetWindowOrIframeEl, targetOrigin, afterConnectedCallback) {
  var postMessageQueue = [];
  var connected = false;
  var handlers = {};
  var targetWindowIsIframeElement;

  function getIframeOrigin(iframe) {
    return iframe.src.match(/(.*?\/\/.*?)\//)[1];
  }

  function post(type, content) {
    var message;
    // Message object can be constructed from 'type' and 'content' arguments or it can be passed
    // as the first argument.
    if (arguments.length === 1 && typeof type === 'object' && typeof type.type === 'string') {
      message = type;
    } else {
      message = {
        type: type,
        content: content
      };
    }
    if (connected) {
      var tWindow = getTargetWindow();
      // if we are laready connected ... send the message
      // See http://dev.opera.com/articles/view/window-postmessage-messagechannel/#crossdoc
      //     https://github.com/Modernizr/Modernizr/issues/388
      //     http://jsfiddle.net/ryanseddon/uZTgD/2/
      if (structuredClone.supported()) {
        tWindow.postMessage(message, targetOrigin);
      } else {
        tWindow.postMessage(JSON.stringify(message), targetOrigin);
      }
    } else {
      // else queue up the messages to send after connection complete.
      postMessageQueue.push(message);
    }
  }

  function addListener(messageName, func) {
    handlers[messageName] = func;
  }

  function removeListener(messageName) {
    handlers[messageName] = null;
  }

  // Note that this function can't be used when IFrame element hasn't been added to DOM yet
  // (.contentWindow would be null). At the moment risk is purely theoretical, as the parent endpoint
  // only listens for an incoming 'hello' message and the first time we call this function
  // is in #receiveMessage handler (so iframe had to be initialized before, as it could send 'hello').
  // It would become important when we decide to refactor the way how communication is initialized.
  function getTargetWindow() {
    if (targetWindowIsIframeElement) {
      var tWindow = targetWindowOrIframeEl.contentWindow;
      if (!tWindow) {
        throw "IFrame element needs to be added to DOM before communication " +
              "can be started (.contentWindow is not available)";
      }
      return tWindow;
    }
    return targetWindowOrIframeEl;
  }

  function receiveMessage(message) {
    var messageData;
    if (message.source === getTargetWindow() && (targetOrigin === '*' || message.origin === targetOrigin)) {
      messageData = message.data;
      if (typeof messageData === 'string') {
        messageData = JSON.parse(messageData);
      }
      if (handlers[messageData.type]) {
        handlers[messageData.type](messageData.content);
      } else {
        console.log("cant handle type: " + messageData.type);
      }
    }
  }

  function disconnect() {
    connected = false;
    window.removeEventListener('message', receiveMessage);
  }

  // handle the case that targetWindowOrIframeEl is actually an <iframe> rather than a Window(Proxy) object
  // Note that if it *is* a WindowProxy, this probe will throw a SecurityException, but in that case
  // we also don't need to do anything
  try {
    targetWindowIsIframeElement = targetWindowOrIframeEl.constructor === HTMLIFrameElement;
  } catch (e) {
    targetWindowIsIframeElement = false;
  }

  if (targetWindowIsIframeElement) {
    // Infer the origin ONLY if the user did not supply an explicit origin, i.e., if the second
    // argument is empty or is actually a callback (meaning it is supposed to be the
    // afterConnectionCallback)
    if (!targetOrigin || targetOrigin.constructor === Function) {
      afterConnectedCallback = targetOrigin;
      targetOrigin = getIframeOrigin(targetWindowOrIframeEl);
    }
  }

  // Handle pages served through file:// protocol. Behaviour varies in different browsers. Safari sets origin
  // to 'file://' and everything works fine, but Chrome and Safari set message.origin to null.
  // Also, https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage says:
  //  > Lastly, posting a message to a page at a file: URL currently requires that the targetOrigin argument be "*".
  //  > file:// cannot be used as a security restriction; this restriction may be modified in the future.
  // So, using '*' seems like the only possible solution.
  if (targetOrigin === 'file://') {
    targetOrigin = '*';
  }

  // when we receive 'hello':
  addListener('hello', function () {
    connected = true;

    // send hello response
    post({
      type: 'hello',
      // `origin` property isn't used by IframeEndpoint anymore (>= 1.2.0), but it's being sent to be
      // backward compatible with old IframeEndpoint versions (< v1.2.0).
      origin: window.location.href.match(/(.*?\/\/.*?)\//)[1]
    });

    // give the user a chance to do things now that we are connected
    // note that is will happen before any queued messages
    if (afterConnectedCallback && typeof afterConnectedCallback === "function") {
      afterConnectedCallback();
    }

    // Now send any messages that have been queued up ...
    while (postMessageQueue.length > 0) {
      post(postMessageQueue.shift());
    }
  });

  window.addEventListener('message', receiveMessage, false);

  // Public API.
  return {
    post: post,
    addListener: addListener,
    removeListener: removeListener,
    disconnect: disconnect,
    getTargetWindow: getTargetWindow,
    targetOrigin: targetOrigin
  };
};

},{"./structured-clone":9}],9:[function(require,module,exports){
var featureSupported = false;

(function () {
  var result = 0;

  if (!!window.postMessage) {
    try {
      // Safari 5.1 will sometimes throw an exception and sometimes won't, lolwut?
      // When it doesn't we capture the message event and check the
      // internal [[Class]] property of the message being passed through.
      // Safari will pass through DOM nodes as Null iOS safari on the other hand
      // passes it through as DOMWindow, gotcha.
      window.onmessage = function (e) {
        var type = Object.prototype.toString.call(e.data);
        result = (type.indexOf("Null") != -1 || type.indexOf("DOMWindow") != -1) ? 1 : 0;
        featureSupported = {
          'structuredClones': result
        };
      };
      // Spec states you can't transmit DOM nodes and it will throw an error
      // postMessage implimentations that support cloned data will throw.
      window.postMessage(document.createElement("a"), "*");
    } catch (e) {
      // BBOS6 throws but doesn't pass through the correct exception
      // so check error message
      result = (e.DATA_CLONE_ERR || e.message == "Cannot post cyclic structures.") ? 1 : 0;
      featureSupported = {
        'structuredClones': result
      };
    }
  }
}());

exports.supported = function supported() {
  return featureSupported && featureSupported.structuredClones > 0;
};

},{}],10:[function(require,module,exports){
module.exports = {
  /**
   * Allows to communicate with an iframe.
   */
  ParentEndpoint:  require('./lib/parent-endpoint'),
  /**
   * Allows to communicate with a parent page.
   * IFrameEndpoint is a singleton, as iframe can't have multiple parents anyway.
   */
  getIFrameEndpoint: require('./lib/iframe-endpoint'),
  structuredClone: require('./lib/structured-clone'),

  // TODO: May be misnamed
  IframePhoneRpcEndpoint: require('./lib/iframe-phone-rpc-endpoint')

};

},{"./lib/iframe-endpoint":6,"./lib/iframe-phone-rpc-endpoint":7,"./lib/parent-endpoint":8,"./lib/structured-clone":9}],11:[function(require,module,exports){
/* @license
Papa Parse
v4.6.3
https://github.com/mholt/PapaParse
License: MIT
*/
Array.isArray||(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}),function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&"undefined"!=typeof exports?module.exports=t():e.Papa=t()}(this,function(){"use strict";var s,e,f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{},n=!f.document&&!!f.postMessage,o=n&&/(\?|&)papaworker(=|&|$)/.test(f.location.search),a=!1,h={},u=0,k={parse:function(e,t){var r=(t=t||{}).dynamicTyping||!1;z(r)&&(t.dynamicTypingFunction=r,r={});if(t.dynamicTyping=r,t.transform=!!z(t.transform)&&t.transform,t.worker&&k.WORKERS_SUPPORTED){var i=function(){if(!k.WORKERS_SUPPORTED)return!1;if(!a&&null===k.SCRIPT_PATH)throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually.");var e=k.SCRIPT_PATH||s;e+=(-1!==e.indexOf("?")?"&":"?")+"papaworker";var t=new f.Worker(e);return t.onmessage=m,t.id=u++,h[t.id]=t}();return i.userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=z(t.step),t.chunk=z(t.chunk),t.complete=z(t.complete),t.error=z(t.error),delete t.worker,void i.postMessage({input:e,config:t,workerId:i.id})}var n=null;k.NODE_STREAM_INPUT,"string"==typeof e?n=t.download?new c(t):new _(t):!0===e.readable&&z(e.read)&&z(e.on)?n=new g(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new p(t));return n.stream(e)},unparse:function(e,t){var i=!1,g=!0,m=",",y="\r\n",n='"',r=!1;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||k.BAD_DELIMITERS.filter(function(e){return-1!==t.delimiter.indexOf(e)}).length||(m=t.delimiter);("boolean"==typeof t.quotes||Array.isArray(t.quotes))&&(i=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(r=t.skipEmptyLines);"string"==typeof t.newline&&(y=t.newline);"string"==typeof t.quoteChar&&(n=t.quoteChar);"boolean"==typeof t.header&&(g=t.header)}();var s=new RegExp(M(n),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return o(null,e,r);if("object"==typeof e[0])return o(a(e[0]),e,r)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:a(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),o(e.fields||[],e.data||[],r);throw"exception: Unable to serialize unrecognized input";function a(e){if("object"!=typeof e)return[];var t=[];for(var r in e)t.push(r);return t}function o(e,t,r){var i="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&g){for(var a=0;a<e.length;a++)0<a&&(i+=m),i+=v(e[a],a);0<t.length&&(i+=y)}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(r&&!n&&(u="greedy"===r?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===r&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c])}u=""===d.join("").trim()}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(i+=m);var _=n&&s?e[p]:p;i+=v(t[o][_],p)}o<t.length-1&&(!r||0<h&&!f)&&(i+=y)}}return i}function v(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);e=e.toString().replace(s,n+n);var r="boolean"==typeof i&&i||Array.isArray(i)&&i[t]||function(e,t){for(var r=0;r<t.length;r++)if(-1<e.indexOf(t[r]))return!0;return!1}(e,k.BAD_DELIMITERS)||-1<e.indexOf(m)||" "===e.charAt(0)||" "===e.charAt(e.length-1);return r?n+e+n:e}}};if(k.RECORD_SEP=String.fromCharCode(30),k.UNIT_SEP=String.fromCharCode(31),k.BYTE_ORDER_MARK="\ufeff",k.BAD_DELIMITERS=["\r","\n",'"',k.BYTE_ORDER_MARK],k.WORKERS_SUPPORTED=!n&&!!f.Worker,k.SCRIPT_PATH=null,k.NODE_STREAM_INPUT=1,k.LocalChunkSize=10485760,k.RemoteChunkSize=5242880,k.DefaultDelimiter=",",k.Parser=v,k.ParserHandle=r,k.NetworkStreamer=c,k.FileStreamer=p,k.StringStreamer=_,k.ReadableStreamStreamer=g,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var r=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return!0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},r)})}),e(),this;function e(){if(0!==h.length){var e,t,r,i,n=h[0];if(z(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,r=n.inputElem,i=s.reason,void(z(o.error)&&o.error({name:e},t,r,i));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config))}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){z(a)&&a(e,n.file,n.inputElem),u()},k.parse(n.file,n.instanceConfig)}else z(o.complete)&&o.complete()}function u(){h.splice(0,1),e()}}}function l(e){this._handle=null,this._finished=!1,this._completed=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=E(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new r(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&z(this._config.beforeFirstChunk)){var r=this._config.beforeFirstChunk(e);void 0!==r&&(e=r)}this.isFirstChunk=!1;var i=this._partialLine+e;this._partialLine="";var n=this._handle.parse(i,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=i.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:k.WORKER_ID,finished:a});else if(z(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return;n=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!z(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}},this._sendError=function(e){z(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:k.WORKER_ID,error:e,finished:!1})}}function c(e){var i;(e=e||{}).chunkSize||(e.chunkSize=k.RemoteChunkSize),l.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(i=new XMLHttpRequest,this._config.withCredentials&&(i.withCredentials=this._config.withCredentials),n||(i.onload=w(this._chunkLoaded,this),i.onerror=w(this._chunkError,this)),i.open("GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)i.setRequestHeader(t,e[t])}if(this._config.chunkSize){var r=this._start+this._config.chunkSize-1;i.setRequestHeader("Range","bytes="+this._start+"-"+r),i.setRequestHeader("If-None-Match","webkit-no-cache")}try{i.send()}catch(e){this._chunkError(e.message)}n&&0===i.status?this._chunkError():this._start+=this._config.chunkSize}},this._chunkLoaded=function(){4===i.readyState&&(i.status<200||400<=i.status?this._chunkError():(this._finished=!this._config.chunkSize||this._start>function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return-1;return parseInt(t.substr(t.lastIndexOf("/")+1))}(i),this.parseChunk(i.responseText)))},this._chunkError=function(e){var t=i.statusText||e;this._sendError(new Error(t))}}function p(e){var i,n;(e=e||{}).chunkSize||(e.chunkSize=k.LocalChunkSize),l.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((i=new FileReader).onload=w(this._chunkLoaded,this),i.onerror=w(this._chunkError,this)):i=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t)}var r=i.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:r}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(i.error)}}function _(e){var r;l.call(this,e=e||{}),this.stream=function(e){return r=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?r.substr(0,e):r;return r=e?r.substr(e):"",this._finished=!r,this.parseChunk(t)}}}function g(e){l.call(this,e=e||{});var t=[],r=!0,i=!1;this.pause=function(){l.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){l.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){i&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):r=!0},this._streamData=w(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=w(function(e){this._streamCleanUp(),this._sendError(e)},this),this._streamEnd=w(function(){this._streamCleanUp(),i=!0,this._streamData("")},this),this._streamCleanUp=w(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function r(g){var a,o,h,i=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,n=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,r=0,s=0,u=!1,e=!1,f=[],d={data:[],errors:[],meta:{}};if(z(g.step)){var l=g.step;g.step=function(e){if(d=e,p())c();else{if(c(),0===d.data.length)return;r+=e.data.length,g.preview&&r>g.preview?o.abort():l(d,t)}}}function m(e){return"greedy"===g.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function c(){if(d&&h&&(y("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+k.DefaultDelimiter+"'"),h=!1),g.skipEmptyLines)for(var e=0;e<d.data.length;e++)m(d.data[e])&&d.data.splice(e--,1);return p()&&function(){if(!d)return;for(var e=0;p()&&e<d.data.length;e++)for(var t=0;t<d.data[e].length;t++){var r=d.data[e][t];g.trimHeaders&&(r=r.trim()),f.push(r)}d.data.splice(0,1)}(),function(){if(!d||!g.header&&!g.dynamicTyping&&!g.transform)return d;for(var e=0;e<d.data.length;e++){var t,r=g.header?{}:[];for(t=0;t<d.data[e].length;t++){var i=t,n=d.data[e][t];g.header&&(i=t>=f.length?"__parsed_extra":f[t]),g.transform&&(n=g.transform(n,i)),n=_(i,n),"__parsed_extra"===i?(r[i]=r[i]||[],r[i].push(n)):r[i]=n}d.data[e]=r,g.header&&(t>f.length?y("FieldMismatch","TooManyFields","Too many fields: expected "+f.length+" fields but parsed "+t,s+e):t<f.length&&y("FieldMismatch","TooFewFields","Too few fields: expected "+f.length+" fields but parsed "+t,s+e))}g.header&&d.meta&&(d.meta.fields=f);return s+=d.data.length,d}()}function p(){return g.header&&0===f.length}function _(e,t){return r=e,g.dynamicTypingFunction&&void 0===g.dynamicTyping[r]&&(g.dynamicTyping[r]=g.dynamicTypingFunction(r)),!0===(g.dynamicTyping[r]||g.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(i.test(t)?parseFloat(t):n.test(t)?new Date(t):""===t?null:t):t;var r}function y(e,t,r,i){d.errors.push({type:e,code:t,message:r,row:i})}this.parse=function(e,t,r){var i=g.quoteChar||'"';if(g.newline||(g.newline=function(e,t){e=e.substr(0,1048576);var r=new RegExp(M(t)+"([^]*?)"+M(t),"gm"),i=(e=e.replace(r,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<i[0].length;if(1===i.length||s)return"\n";for(var a=0,o=0;o<i.length;o++)"\n"===i[o][0]&&a++;return a>=i.length/2?"\r\n":"\r"}(e,i)),h=!1,g.delimiter)z(g.delimiter)&&(g.delimiter=g.delimiter(e),d.meta.delimiter=g.delimiter);else{var n=function(e,t,r,i){for(var n,s,a,o=[",","\t","|",";",k.RECORD_SEP,k.UNIT_SEP],h=0;h<o.length;h++){var u=o[h],f=0,d=0,l=0;a=void 0;for(var c=new v({comments:i,delimiter:u,newline:t,preview:10}).parse(e),p=0;p<c.data.length;p++)if(r&&m(c.data[p]))l++;else{var _=c.data[p].length;d+=_,void 0!==a?1<_&&(f+=Math.abs(_-a),a=_):a=0}0<c.data.length&&(d/=c.data.length-l),(void 0===s||s<f)&&1.99<d&&(s=f,n=u)}return{successful:!!(g.delimiter=n),bestDelimiter:n}}(e,g.newline,g.skipEmptyLines,g.comments);n.successful?g.delimiter=n.bestDelimiter:(h=!0,g.delimiter=k.DefaultDelimiter),d.meta.delimiter=g.delimiter}var s=E(g);return g.preview&&g.header&&s.preview++,a=e,o=new v(s),d=o.parse(a,t,r),c(),u?{meta:{paused:!0}}:d||{meta:{paused:!1}}},this.paused=function(){return u},this.pause=function(){u=!0,o.abort(),a=a.substr(o.getCharIndex())},this.resume=function(){u=!1,t.streamer.parseChunk(a,!0)},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),d.meta.aborted=!0,z(g.complete)&&g.complete(d),a=""}}function M(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function v(e){var S,O=(e=e||{}).delimiter,x=e.newline,T=e.comments,I=e.step,A=e.preview,D=e.fastMode,L=S=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(L=e.escapeChar),("string"!=typeof O||-1<k.BAD_DELIMITERS.indexOf(O))&&(O=","),T===O)throw"Comment character same as delimiter";!0===T?T="#":("string"!=typeof T||-1<k.BAD_DELIMITERS.indexOf(T))&&(T=!1),"\n"!==x&&"\r"!==x&&"\r\n"!==x&&(x="\n");var P=0,F=!1;this.parse=function(i,t,r){if("string"!=typeof i)throw"Input must be a string";var n=i.length,e=O.length,s=x.length,a=T.length,o=z(I),h=[],u=[],f=[],d=P=0;if(!i)return C();if(D||!1!==D&&-1===i.indexOf(S)){for(var l=i.split(x),c=0;c<l.length;c++){if(f=l[c],P+=f.length,c!==l.length-1)P+=x.length;else if(r)return C();if(!T||f.substr(0,a)!==T){if(o){if(h=[],k(f.split(O)),R(),F)return C()}else k(f.split(O));if(A&&A<=c)return h=h.slice(0,A),C(!0)}}return C()}for(var p,_=i.indexOf(O,P),g=i.indexOf(x,P),m=new RegExp(M(L)+M(S),"g");;)if(i[P]!==S)if(T&&0===f.length&&i.substr(P,a)===T){if(-1===g)return C();P=g+s,g=i.indexOf(x,P),_=i.indexOf(O,P)}else if(-1!==_&&(_<g||-1===g))f.push(i.substring(P,_)),P=_+e,_=i.indexOf(O,P);else{if(-1===g)break;if(f.push(i.substring(P,g)),w(g+s),o&&(R(),F))return C();if(A&&h.length>=A)return C(!0)}else for(p=P,P++;;){if(-1===(p=i.indexOf(S,p+1)))return r||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:P}),E();if(p===n-1)return E(i.substring(P,p).replace(m,S));if(S!==L||i[p+1]!==L){if(S===L||0===p||i[p-1]!==L){var y=b(-1===g?_:Math.min(_,g));if(i[p+1+y]===O){f.push(i.substring(P,p).replace(m,S)),P=p+1+y+e,_=i.indexOf(O,P),g=i.indexOf(x,P);break}var v=b(g);if(i.substr(p+1+v,s)===x){if(f.push(i.substring(P,p).replace(m,S)),w(p+1+v+s),_=i.indexOf(O,P),o&&(R(),F))return C();if(A&&h.length>=A)return C(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:P}),p++}}else p++}return E();function k(e){h.push(e),d=P}function b(e){var t=0;if(-1!==e){var r=i.substring(p+1,e);r&&""===r.trim()&&(t=r.length)}return t}function E(e){return r||(void 0===e&&(e=i.substr(P)),f.push(e),P=n,k(f),o&&R()),C()}function w(e){P=e,k(f),f=[],g=i.indexOf(x,P)}function C(e){return{data:h,errors:u,meta:{delimiter:O,linebreak:x,aborted:F,truncated:!!e,cursor:d+(t||0)}}}function R(){I(C()),h=[],u=[]}},this.abort=function(){F=!0},this.getCharIndex=function(){return P}}function m(e){var t=e.data,r=h[t.workerId],i=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){i=!0,y(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:b,resume:b};if(z(r.userStep)){for(var s=0;s<t.results.data.length&&(r.userStep({data:[t.results.data[s]],errors:t.results.errors,meta:t.results.meta},n),!i);s++);delete t.results}else z(r.userChunk)&&(r.userChunk(t.results,n,t.file),delete t.results)}t.finished&&!i&&y(t.workerId,t.results)}function y(e,t){var r=h[e];z(r.userComplete)&&r.userComplete(t),r.terminate(),delete h[e]}function b(){throw"Not implemented."}function E(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var r in e)t[r]=E(e[r]);return t}function w(e,t){return function(){e.apply(t,arguments)}}function z(e){return"function"==typeof e}return o?f.onmessage=function(e){var t=e.data;void 0===k.WORKER_ID&&t&&(k.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:k.WORKER_ID,results:k.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var r=k.parse(t.input,t.config);r&&f.postMessage({workerId:k.WORKER_ID,results:r,finished:!0})}}:k.WORKERS_SUPPORTED&&(e=document.getElementsByTagName("script"),s=e.length?e[e.length-1].src:"",document.body?document.addEventListener("DOMContentLoaded",function(){a=!0},!0):a=!0),(c.prototype=Object.create(l.prototype)).constructor=c,(p.prototype=Object.create(l.prototype)).constructor=p,(_.prototype=Object.create(_.prototype)).constructor=_,(g.prototype=Object.create(l.prototype)).constructor=g,k});
},{}]},{},[4]);
