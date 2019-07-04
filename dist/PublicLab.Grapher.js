(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

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
      console.log("at type");

      if (this.graphType == "Basic" || this.graphType == "Stepped" || this.graphType == "Point") {
        return 'line';
      } else if (this.graphType == "Horizontal") {
        return 'horizontalBar';
      } else if (this.graphType == "Vertical") {
        return 'bar';
      } else {
        return this.graphType.toLowerCase();
      }
    }
  }, {
    key: "colorGenerator",
    value: function colorGenerator(i, tb, count) {
      console.log("at color");
      var colors = ['rgba(255, 77, 210, 0.5)', 'rgba(0, 204, 255, 0.5)', 'rgba(128, 0, 255, 0.5)', 'rgba(255, 77, 77, 0.5)', 'rgba(0, 179, 0, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(255, 0, 102, 0.5)', 'rgba(0, 115, 230, 0.5)'];
      var bordercolors = ['rgb(255, 0, 191)', 'rgb(0, 184, 230)', 'rgb(115, 0, 230)', 'rgb(255, 51, 51)', 'rgb(0, 153, 0)', 'rgb(230, 230, 0)', 'rgb(230, 0, 92)', 'rgb(0, 102, 204)'];
      var length = 8;

      if (this.graphType == "Pie" || this.graphType == "Doughnut") {
        var colorSet = [];
        var borderColorSet = [];

        for (var j = 0; j < count; j++) {
          colorSet.push(colors[j % length]);
          borderColorSet.push(bordercolors[j % length]);
        }

        if (tb == "bg") {
          return colorSet;
        } else {
          return borderColorSet;
        }
      } else {
        if (tb == "bg") {
          return colors[i % length];
        } else {
          return bordercolors[i % length];
        }
      }
    }
  }, {
    key: "determineData",
    value: function determineData(i) {
      console.log("at data");
      var h = {};

      if (this.graphType == "Basic") {
        h['fill'] = false;
      } else if (this.graphType == "Stepped") {
        h['steppedLine'] = true;
        h['fill'] = false;
      } else if (this.graphType == "Point") {
        h['showLine'] = false;
        h['pointRadius'] = 10;
      }

      h['backgroundColor'] = this.colorGenerator(i, "bg", this.dataHash['y_axis_values' + i].length);
      h['borderColor'] = this.colorGenerator(i, "bo", this.dataHash['y_axis_values' + i].length);
      h['borderWidth'] = 1;
      h['label'] = this.dataHash['labels'][1][i];
      h['data'] = this.dataHash['y_axis_values' + i];
      return h;
    }
  }, {
    key: "determineConfig",
    value: function determineConfig() {
      console.log("at config");
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
        'responsive': true,
        'maintainAspectRatio': true,
        'chartArea': {
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
      console.log("at scales");
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
      console.log("entered image");
      var newDate = new Date();
      var timestamp = newDate.getTime();
      var temp = canvId;
      temp = "#" + temp;
      $(temp).get(0).toBlob(function (blob) {
        saveAs(blob, "chart" + timestamp);
      });
    }
  }, {
    key: "createSaveAsImageButton",
    value: function createSaveAsImageButton(canvasDiv, canvasId) {
      var saveImageButton = document.createElement("BUTTON");
      saveImageButton.classList.add("btn");
      saveImageButton.classList.add("btn-primary");
      saveImageButton.innerHTML = "Save as Image";
      saveImageButton.id = canvasId + "image";
      canvasDiv.appendChild(saveImageButton);
      console.log(this, "this");
      var self = this;

      document.getElementById(saveImageButton.id).onclick = function (e) {
        self.saveAsImageFunction(canvasId);
      };
    }
  }, {
    key: "plotGraph",
    value: function plotGraph() {
      if (this.flag) {
        console.log("at plotGraph");
        document.getElementById(this.canvasContainerId).innerHTML = "";
      }

      var div = document.createElement('div');
      div.classList.add(this.elementId + '_chart_container_' + this.graphCounting);
      var canv = document.createElement('canvas');
      canv.id = this.elementId + '_canvas_' + this.graphCounting;
      div.appendChild(canv);
      document.getElementById(this.canvasContainerId).appendChild(div);
      var ctx = canv.getContext('2d');
      var configuration = this.determineConfig();
      new Chart(ctx, configuration);
      this.createSaveAsImageButton(div, canv.id); // $('.'+this.carousalClass).carousel(2);
    }
  }]);

  function ChartjsPlotter(hash, length, type, flag, canvasContainerId, elementId, graphCounting) {
    _classCallCheck(this, ChartjsPlotter);

    _defineProperty(this, 'use strict', void 0);

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
    } //Google Sheet's data is in a JSON, traversal through the JSON and string manipulation are used to extract the data

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

        for (var i = 0; i < this.csvMatrix[0].length; i++) {
          csvHeadersLocal[i] = "Column" + (i + 1);
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
    } // creating the transpose of the entire data ie complete data + headers, for createSpreadsheet in View.js

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
},{"./SimpleDataGrapher":4,"papaparse":6}],3:[function(require,module,exports){
"use strict";

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
      if (this.graphType == "Horizontal" || this.graphType == "Vertical") {
        return "bar";
      } else if (this.graphType == "Pie" || this.graphType == "Doughnut" || this.graphType == "Radar") {
        return "pie";
      } else if (this.graphType == "Basic" || this.graphType == "Stepped" || this.graphType == "Point") {
        return "scatter";
      }
    }
  }, {
    key: "layoutMaker",
    value: function layoutMaker() {
      var layout = {};

      if (this.graphType == "Horizontal" || this.graphType == "Vertical") {
        layout["barmode"] = "group";
      }

      return layout;
    }
  }, {
    key: "traceMaker",
    value: function traceMaker() {
      var trace = {};
      trace["type"] = this.determineType2();

      if (this.graphType == "Horizontal") {
        trace["orientation"] = "h";
      } else if (this.graphType == "Doughnut") {
        trace["hole"] = 0.5;
      } else if (this.graphType == "Basic") {
        trace["mode"] = "lines";
      } else if (this.graphType == "Point") {
        trace["mode"] = "markers";
      } else if (this.graphType == "Stepped") {
        trace["mode"] = "lines+markers";
        trace["line"] = {
          "shape": 'hv'
        };
      }

      return trace;
    }
  }, {
    key: "keyDeterminer",
    value: function keyDeterminer() {
      var keys = ["x", "y"];

      if (this.graphType == "Pie" || this.graphType == "Doughnut") {
        keys[1] = "values";
        keys[0] = "labels";
      } else if (this.graphType == "Horizontal") {
        keys[0] = "y";
        keys[1] = "x";
      }

      return keys;
    }
  }, {
    key: "plotGraph2",
    value: function plotGraph2() {
      if (this.flag) {
        console.log("at plotGraph");
        document.getElementById(this.canvasContainerId).innerHTML = "";
      }

      var layout = this.layoutMaker();
      var data = [];
      var keySet = this.keyDeterminer();

      for (var i = 0; i < this.length; i++) {
        var new_trace = this.traceMaker();
        new_trace[keySet[0]] = this.dataHash['x_axis_labels'];
        new_trace[keySet[1]] = this.dataHash['y_axis_values' + i];
        new_trace["name"] = this.dataHash['labels'][1][i];
        data.push(new_trace);
      }

      console.log(data);
      var div = document.createElement('div');
      div.id = this.elementId + '_chart_container_' + this.graphCounting;
      document.getElementById(this.canvasContainerId).appendChild(div);
      Plotly.newPlot(div.id, data, layout);
    }
  }]);

  function PlotlyjsPlotter(hash, length, type, flag, canvasContainerId, elementId, graphCounting) {
    _classCallCheck(this, PlotlyjsPlotter);

    _defineProperty(this, 'use strict', void 0);

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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleDataGrapher = void 0;

var _View = require("./View");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SimpleDataGrapher = function SimpleDataGrapher(elementId) {
  _classCallCheck(this, SimpleDataGrapher);

  _defineProperty(this, 'use strict', void 0);

  _defineProperty(this, "elementId", null);

  _defineProperty(this, "view", null);

  this.elementId = elementId;
  SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId] = this;
  console.log(SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId]);
  this.view = new _View.View(elementId);
};

exports.SimpleDataGrapher = SimpleDataGrapher;

_defineProperty(SimpleDataGrapher, "elementIdSimpleDataGraphInstanceMap", {});

;
window.SimpleDataGrapher = SimpleDataGrapher;
},{"./View":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import {CsvParser} from "./CsvParser";
// import {SimpleDataGrapher} from "./SimpleDataGrapher";
var CsvParser = require('./CsvParser');

var SimpleDataGrapher = require('./SimpleDataGrapher');

var ChartjsPlotter = require('./ChartjsPlotter');

var PlotlyjsPlotter = require('./PlotlyjsPlotter');

var View =
/*#__PURE__*/
function () {
  _createClass(View, [{
    key: "handleFileSelectlocal",
    //extracts the uploaded file from input field and creates an object of CsvParser class with the file as one of the parameters
    value: function handleFileSelectlocal(event) {
      this.csvFile = event.target.files[0];
      console.log(event.target.files[0]);
      console.log("iam here in handle");

      if (this.csvFile['name'].split(".")[1] != "csv") {
        alert("Invalid file type");
      } else {
        $('#' + this.dragDropHeadingId).text(this.csvFile['name']);
        var self = this;

        document.getElementById(this.uploadButtonId).onclick = function (e) {
          self.csvParser = new CsvParser(self.csvFile, self.elementId, "local");
        };
      }
    } //receives the string value and creates an object of CsvParser class with the string as one of the parameters

  }, {
    key: "handleFileSelectstring",
    value: function handleFileSelectstring(val) {
      console.log("i am at csv string handler", val); // var csv_string = val.split("\n");

      this.csvFile = val;
      var self = this;

      document.getElementById(this.uploadButtonId).onclick = function (e) {
        console.log("i am uploading");
        self.csvParser = new CsvParser(self.csvFile, self.elementId, "csvstring");
      };
    }
  }, {
    key: "usingPreviouslyUploadedFile",
    value: function usingPreviouslyUploadedFile() {
      var self = this;
      console.log("prev file in use", self.elementId);
      self.csvParser = new CsvParser("dummy", self.elementId, "prevfile");
      console.log(self.csvParser, "checking");
    } //receives the JSON file value and creates an object of CsvParser class with the file as one of the parameters

  }, {
    key: "handleFileSelectGoogleSheet",
    value: function handleFileSelectGoogleSheet(googleSheetData) {
      this.csvFile = googleSheetData;
      var self = this;

      document.getElementById(this.uploadButtonId).onclick = function (e) {
        self.csvParser = new CsvParser(self.csvFile, self.elementId, "googleSheet");
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

      var proxyurl = "https://cors-anywhere.herokuapp.com/";
      var url = val;
      fetch(proxyurl + url).then(function (response) {
        return response.text();
      }).then(function (contents) {
        return _this.handleFileSelectremote(contents);
      })["catch"](function (e) {
        return console.log(e);
      });
    } // callback function which receives the remote file's value and creates an object of CsvParser class with the file as one of the parameters

  }, {
    key: "handleFileSelectremote",
    value: function handleFileSelectremote(remoteVal) {
      this.csvFile = remoteVal;
      var self = this;

      document.getElementById(this.uploadButtonId).onclick = function (e) {
        console.log("i am uploading");
        self.csvParser = new CsvParser(self.csvFile, self.elementId, "remote");
      };
    } // adapter function which switches between Plotly.js and Chart.js as a graph plotting library and creates theri respective objects which take over the graph plotting

  }, {
    key: "plotGraph",
    value: function plotGraph(hash, length, type, flag, library) {
      if (library == "chartjs") {
        this.chartjsPlotter = new ChartjsPlotter(hash, length, type, flag, this.canvasContinerId, this.elementId, this.graphCounting);
      } else {
        this.plotlyjsPlotter = new PlotlyjsPlotter(hash, length, type, flag, this.canvasContinerId, this.elementId, this.graphCounting);
      }

      $('.' + this.carousalClass).carousel(2);
    }
  }, {
    key: "createButtons",
    value: function createButtons(userLoginCheck) {
      if (userLoginCheck == "yes") {
        var save_file_button = document.createElement('button');
        save_file_button.classList.add("btn");
        save_file_button.classList.add("btn-primary");
        save_file_button.innerHTML = "Save CSV";
        save_file_button.id = this.elementId + "_save_CSV";
        var upload_prev_file = document.createElement('button');
        upload_prev_file.classList.add("btn");
        upload_prev_file.classList.add("btn-primary");
        upload_prev_file.innerHTML = "Choose a previously uploaded file";
        upload_prev_file.id = this.elementId + "_prev_file";
        var container = document.getElementById(this.upload_button_container);
        var div_container = document.createElement('div');
        div_container.appendChild(save_file_button);
        div_container.appendChild(upload_prev_file);
        container.prepend(div_container);
      }
    } // creates a downloadable spreadsheet for the imported data using SheetJS

  }, {
    key: "createSheet",
    value: function createSheet() {
      var wb = XLSX.utils.book_new();
      wb.Props = {
        Title: "New Spreadsheet" + this.elementId,
        CreatedDate: new Date()
      };
      wb.SheetNames.push("Sheet" + this.elementId);
      var ws_data = this.csvParser.completeCsvMatrixTranspose;
      var ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.Sheets["Sheet" + this.elementId] = ws;
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'binary'
      });

      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);

        for (var i = 0; i < s.length; i++) {
          view[i] = s.charCodeAt(i) & 0xFF;
        }

        return buf;
      }

      saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
      }), 'newSpreadsheet' + this.elementId + '.xlsx');
    } // creates a hash of the entire data in an accesible format for the charting libraries {labels: [legendx, [legendy0, legendy1 ... lengendyn]], x_axis_values: [...], y_axis_0: [...], y_axis_1: [...], ... y_axis_n: [...]} n: selected number of columns
    // flag is just for seeing if we're plotting the graph for the first time, if yes, we will have to clear the canvas.

  }, {
    key: "afterSampleData",
    value: function afterSampleData(flag) {
      var _this2 = this;

      console.log("at checkbox");

      document.getElementById(this.plotGraphId).onclick = function (e) {
        console.log("at click on plot_graph");
        e.preventDefault();
        var hash = {};
        var ix = $('input[name=' + _this2.tableXInputName + ']:checked').val();
        console.log(ix);
        hash["x_axis_labels"] = _this2.csvParser.completeCsvMatrix[ix];
        var columns = new Array();
        var y_axis_names = new Array();
        $("input:checkbox[name=" + _this2.tableYInputName + "]:checked").each(function (index, element) {
          columns.push(element.value);
        });

        for (var i = 0; i < columns.length; i++) {
          hash["y_axis_values" + i] = _this2.csvParser.completeCsvMatrix[columns[i]];
          y_axis_names.push(_this2.csvParser.csvHeaders[columns[i]]);
        }

        var labels = [_this2.csvParser.csvHeaders[ix], y_axis_names];
        hash["labels"] = labels;
        var type = $('input[name=' + _this2.graphMenuTypeInputName + ']:checked').val();
        console.log(hash);

        _this2.plotGraph(hash, columns.length, type, flag, "plotly");
      };
    } // generates a graph menu with different graph options

  }, {
    key: "graphMenu",
    value: function graphMenu() {
      $('.' + this.carousalClass).carousel(1);
      console.log("at menu");
      document.getElementById(this.graphMenuId).innerHTML = "";
      var bar = ["Bar", "Horizontal", "Vertical"];
      var line = ["Line", "Basic", "Stepped", "Point"];
      var disc = ["Disc", "Pie", "Doughnut", "Radar"];
      var types = [bar, line, disc];

      for (var i = 0; i < 3; i++) {
        var tr = document.createElement('tr');
        var td_head = document.createElement('td');
        td_head.className = types[i][0];
        td_head.appendChild(document.createTextNode(types[i][0]));
        tr.appendChild(td_head);

        for (var j = 1; j < types[i].length; j++) {
          var td = document.createElement('td');
          var radio = document.createElement('input');
          radio.type = 'radio';
          radio.value = types[i][j];
          td.appendChild(document.createTextNode(types[i][j]));
          radio.name = this.graphMenuTypeInputName;
          td.appendChild(radio);
          tr.appendChild(td);
        }

        document.getElementById(this.graphMenuId).appendChild(tr);
      }
    } // generates the sample table data with checkboxes for y-axis and radio buttons for x-axis

  }, {
    key: "tableGenerator",
    value: function tableGenerator(name, tableId, typeOfInput, validValues, flag, tableType, badgeType) {
      console.log("i am in tablegenerator");
      console.log("at tableGenerator");
      document.getElementById(tableId).innerHTML = "";
      var trhead = document.createElement('tr');

      for (var i = 0; i < this.csvParser.csvHeaders.length; i++) {
        var td = document.createElement('td');
        var span = document.createElement('span');
        var textnode = document.createTextNode(this.csvParser.csvHeaders[i]);
        span.appendChild(textnode);
        span.classList.add("badge");
        span.classList.add("badge-pill");
        span.classList.add(badgeType);
        td.appendChild(span);

        for (var j = 0; j < validValues.length; j++) {
          if (validValues[j] == this.csvParser.csvHeaders[i]) {
            var checkbox = document.createElement('input');
            checkbox.type = typeOfInput;
            checkbox.value = i;
            checkbox.name = name;
            checkbox.classList.add("check-inputs");
            span.appendChild(checkbox);
          }
        }

        trhead.appendChild(td);
      }

      trhead.classList.add(tableType);
      document.getElementById(tableId).appendChild(trhead);

      for (var i = 0; i < this.csvParser.csvSampleData[0].length; i++) {
        var tr = document.createElement('tr');

        for (var j = 0; j < this.csvParser.csvHeaders.length; j++) {
          var td = document.createElement('td');
          td.appendChild(document.createTextNode(this.csvParser.csvSampleData[j][i]));
          tr.appendChild(td);
        }

        document.getElementById(tableId).appendChild(tr);
      }

      this.afterSampleData(flag);
    } // renders the sample tables

  }, {
    key: "showSampleDataXandY",
    value: function showSampleDataXandY() {
      var _this3 = this;

      console.log("at sampleDataXandY", this);

      document.getElementById(this.addGraphButtonId).onclick = function (e) {
        console.log("at " + _this3.addGraphButtonId);
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
      console.log(" i am back in view manipulation", this);

      if (x != "prevfile") {
        this.csvParser = x;
      }

      this.showSampleDataXandY(); // this.showSampleDataXandY(this.csvParser.csvSampleData, this.csvParser.csvHeaders, this.csvParser.csvValidForYAxis, this.csvParser.csvSampleData);
      // sampleDataXandY(this.csvSampleData,this.csvHeaders,this.csvValidForYAxis,this.completeCsvMatrix);
      // matrixForCompleteData(headers,this.csvMatrix,start);
    }
  }]);

  function View(elementId) {
    var _this4 = this;

    _classCallCheck(this, View);

    _defineProperty(this, 'use strict', void 0);

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

    console.log("i am in view");
    this.elementId = elementId;
    this.element = document.getElementById(elementId);

    if (this.element == null) {
      throw "No element exist with this id";
    }

    console.log("i am in view");
    this.fileUploadId = elementId + "_csv_file";
    this.remoteFileUploadId = elementId + "_remote_file";
    this.csvStringUploadId = elementId + "_csv_string";
    this.googleSheetUploadId = elementId + "_google_sheet";
    this.dragDropHeadingId = elementId + "_drag_drop_heading";
    this.uploadButtonId = elementId + "_file_upload_button";
    this.addGraphButtonId = elementId + "_add_graph";
    this.createSpreadsheetButtonId = elementId + "_save_as_spreadsheet";
    this.tableXId = elementId + "_tableX";
    this.tableYId = elementId + "_tableY";
    this.tableXParentId = elementId + "_Xtable";
    this.tableYParentId = elementId + "_Ytable";
    this.tableXInputName = elementId + "_x_axis_input_columns";
    this.tableYInputName = elementId + "_y_axis_input_columns";
    this.carousalClass = elementId + "_carousal";
    this.carousalId = elementId + "_carousalId";
    this.graphMenuId = elementId + "_graph_menu";
    this.plotGraphId = elementId + "_plot_graph";
    this.graphMenuTypeInputName = elementId + "_types";
    this.canvasContinerId = elementId + "_canvas_container";
    this.xyToggleName = elementId + "_xytoggle";
    this.saveAsImageId = elementId + "save-as-image";
    this.upload_button_container = elementId + "upload_button_container";
    this.drawHTMLView();
    this.addListeners();
    this.usingPreviouslyUploadedFile();
    $('.xytoggle').bootstrapToggle({
      on: 'X-Axis',
      off: 'Y-Axis'
    });
    $('input[name=' + this.xyToggleName + ']:checked').change(function () {
      var ixy = $('input[name=' + _this4.xyToggleName + ']:checked').val();
      var ixx = 0;

      if (ixy == undefined) {
        ixx = 1;
      }

      $('#' + _this4.tableXParentId).toggle(ixx === 0);
      $('#' + _this4.tableYParentId).toggle(ixx === 1);
    });
  } //listen for different inputs for import by the user


  _createClass(View, [{
    key: "addListeners",
    value: function addListeners() {
      var _this5 = this;

      console.log("as");
      console.log("#" + this.fileUploadId);
      $("#" + this.fileUploadId).change(function (e) {
        console.log("i am here23");

        _this5.handleFileSelectlocal(e);
      });
      $("#" + this.csvStringUploadId).change(function () {
        console.log(document.getElementById(_this5.csvStringUploadId).value);

        _this5.handleFileSelectstring(document.getElementById(_this5.csvStringUploadId).value);
      });
      $("#" + this.googleSheetUploadId).change(function () {
        console.log(document.getElementById(_this5.googleSheetUploadId).value, "sheetlink");
        var sheetLink = document.getElementById(_this5.googleSheetUploadId).value;
        var sheetURL = "https://spreadsheets.google.com/feeds/list/" + sheetLink.split("/")[5] + "/od6/public/values?alt=json";

        _this5.getValueGoogleSheet(sheetURL);
      });
      $("#" + this.remoteFileUploadId).change(function () {
        console.log(document.getElementById(_this5.remoteFileUploadId).value);

        _this5.sendRemoteFileToHandler(document.getElementById(_this5.remoteFileUploadId).value);
      });
      $("#" + this.createSpreadsheetButtonId).click(function () {
        _this5.createSheet();
      });
    } //renders the entire HTML view

  }, {
    key: "drawHTMLView",
    value: function drawHTMLView() {
      this.element.innerHTML = '<div class="body_container"><div class="main_heading_container"><h2 class="main_heading"> Simple Data Grapher</h2><p class="sub_heading">Plot and Export Graphs with CSV data</p></div><div class="heading_container"><ul class="headings"><li class="item-1">Upload CSV Data</li><li class="item-2">Select Columns & Graph Type</li><li class="item-3">Plotted Graph & Export Options</li></ul></div><div id=' + this.carousalId + ' class="carousel ' + this.carousalClass + ' slide" data-ride="carousel" data-interval="false"><div class="indicators"><ol class="carousel-indicators"> <li data-target="#' + this.carousalId + '" data-slide-to="0" class="active" id="up"></li> <li data-target="#' + this.carousalId + '" data-slide-to="1"></li> <li data-target="#' + this.carousalId + '" data-slide-to="2"></li></ol></div><div class="carousel-inner"><div class="carousel-item active"><div class="main_container"><div class="container_drag_drop"><span class="btn btn-outline-primary btn-file input_box"><p class="drag_drop_heading" id=' + this.dragDropHeadingId + '> <u> Choose a csv file </u> or drag & drop it here </p><input type="file" class="csv_file" id=' + this.elementId + "_csv_file" + ' accept=".csv"></span></div><h6 class="or"><span>OR</span></h6><div class="container_remote_link"><input type="text" class="remote_file text_field" placeholder="url of remote file" id=' + this.elementId + "_remote_file" + ' ></div><h6 class="or"><span>OR</span></h6><div class="container_csv_string"><textarea class="csv_string text_field" id=' + this.elementId + "_csv_string" + ' placeholder="Paste a CSV string here" ></textarea></div><h6 class="or"><span>OR</span></h6><div class="container_google_sheet"><input type="text" class="google_sheet text_field" id=' + this.elementId + "_google_sheet" + ' placeholder="Link of published Google Sheet" ></div><div id=' + this.upload_button_container + ' class="upload_button"><button type="button" class="btn btn-primary" id=' + this.uploadButtonId + ' >Upload CSV</button></div></div></div><div class="carousel-item tables"><div class="button_container"><div><input type="checkbox" name=' + this.xyToggleName + ' checked data-toggle="toggle" class="xytoggle" data-width="150" data-onstyle="success" data-offstyle="warning" data-height="40"></div><div class="plot_button"><button type="button" class="btn btn-primary" id=' + this.plotGraphId + ' >Plot Graph</button></div></div><div class="table_container"><div id=' + this.tableXParentId + ' ><table id=' + this.tableXId + ' class="table"></table></div><div id=' + this.tableYParentId + ' class="hidden"><table id=' + this.tableYId + ' class="table"></table></div><div><table id=' + this.graphMenuId + ' class="table table-dark"></table></div></div></div><div class="carousel-item graph"><div class="feature_buttons"><button type="button" class="btn btn-primary" id=' + this.addGraphButtonId + '> Add Graph</button><button type="button" class="btn btn-success" id=' + this.createSpreadsheetButtonId + '> Create Spreadsheet<i class="fa fa-plus" aria-hidden="true"></i></button></div><div id=' + this.canvasContinerId + ' ></div></div></div></div></div>';
    }
  }]);

  return View;
}();

exports.View = View;
},{"./ChartjsPlotter":1,"./CsvParser":2,"./PlotlyjsPlotter":3,"./SimpleDataGrapher":4}],6:[function(require,module,exports){
/* @license
Papa Parse
v4.6.3
https://github.com/mholt/PapaParse
License: MIT
*/
Array.isArray||(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}),function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&"undefined"!=typeof exports?module.exports=t():e.Papa=t()}(this,function(){"use strict";var s,e,f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{},n=!f.document&&!!f.postMessage,o=n&&/(\?|&)papaworker(=|&|$)/.test(f.location.search),a=!1,h={},u=0,k={parse:function(e,t){var r=(t=t||{}).dynamicTyping||!1;z(r)&&(t.dynamicTypingFunction=r,r={});if(t.dynamicTyping=r,t.transform=!!z(t.transform)&&t.transform,t.worker&&k.WORKERS_SUPPORTED){var i=function(){if(!k.WORKERS_SUPPORTED)return!1;if(!a&&null===k.SCRIPT_PATH)throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually.");var e=k.SCRIPT_PATH||s;e+=(-1!==e.indexOf("?")?"&":"?")+"papaworker";var t=new f.Worker(e);return t.onmessage=m,t.id=u++,h[t.id]=t}();return i.userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=z(t.step),t.chunk=z(t.chunk),t.complete=z(t.complete),t.error=z(t.error),delete t.worker,void i.postMessage({input:e,config:t,workerId:i.id})}var n=null;k.NODE_STREAM_INPUT,"string"==typeof e?n=t.download?new c(t):new _(t):!0===e.readable&&z(e.read)&&z(e.on)?n=new g(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new p(t));return n.stream(e)},unparse:function(e,t){var i=!1,g=!0,m=",",y="\r\n",n='"',r=!1;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||k.BAD_DELIMITERS.filter(function(e){return-1!==t.delimiter.indexOf(e)}).length||(m=t.delimiter);("boolean"==typeof t.quotes||Array.isArray(t.quotes))&&(i=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(r=t.skipEmptyLines);"string"==typeof t.newline&&(y=t.newline);"string"==typeof t.quoteChar&&(n=t.quoteChar);"boolean"==typeof t.header&&(g=t.header)}();var s=new RegExp(M(n),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return o(null,e,r);if("object"==typeof e[0])return o(a(e[0]),e,r)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:a(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),o(e.fields||[],e.data||[],r);throw"exception: Unable to serialize unrecognized input";function a(e){if("object"!=typeof e)return[];var t=[];for(var r in e)t.push(r);return t}function o(e,t,r){var i="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&g){for(var a=0;a<e.length;a++)0<a&&(i+=m),i+=v(e[a],a);0<t.length&&(i+=y)}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(r&&!n&&(u="greedy"===r?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===r&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c])}u=""===d.join("").trim()}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(i+=m);var _=n&&s?e[p]:p;i+=v(t[o][_],p)}o<t.length-1&&(!r||0<h&&!f)&&(i+=y)}}return i}function v(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);e=e.toString().replace(s,n+n);var r="boolean"==typeof i&&i||Array.isArray(i)&&i[t]||function(e,t){for(var r=0;r<t.length;r++)if(-1<e.indexOf(t[r]))return!0;return!1}(e,k.BAD_DELIMITERS)||-1<e.indexOf(m)||" "===e.charAt(0)||" "===e.charAt(e.length-1);return r?n+e+n:e}}};if(k.RECORD_SEP=String.fromCharCode(30),k.UNIT_SEP=String.fromCharCode(31),k.BYTE_ORDER_MARK="\ufeff",k.BAD_DELIMITERS=["\r","\n",'"',k.BYTE_ORDER_MARK],k.WORKERS_SUPPORTED=!n&&!!f.Worker,k.SCRIPT_PATH=null,k.NODE_STREAM_INPUT=1,k.LocalChunkSize=10485760,k.RemoteChunkSize=5242880,k.DefaultDelimiter=",",k.Parser=v,k.ParserHandle=r,k.NetworkStreamer=c,k.FileStreamer=p,k.StringStreamer=_,k.ReadableStreamStreamer=g,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var r=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return!0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},r)})}),e(),this;function e(){if(0!==h.length){var e,t,r,i,n=h[0];if(z(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,r=n.inputElem,i=s.reason,void(z(o.error)&&o.error({name:e},t,r,i));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config))}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){z(a)&&a(e,n.file,n.inputElem),u()},k.parse(n.file,n.instanceConfig)}else z(o.complete)&&o.complete()}function u(){h.splice(0,1),e()}}}function l(e){this._handle=null,this._finished=!1,this._completed=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=E(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new r(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&z(this._config.beforeFirstChunk)){var r=this._config.beforeFirstChunk(e);void 0!==r&&(e=r)}this.isFirstChunk=!1;var i=this._partialLine+e;this._partialLine="";var n=this._handle.parse(i,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=i.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:k.WORKER_ID,finished:a});else if(z(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return;n=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!z(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}},this._sendError=function(e){z(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:k.WORKER_ID,error:e,finished:!1})}}function c(e){var i;(e=e||{}).chunkSize||(e.chunkSize=k.RemoteChunkSize),l.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(i=new XMLHttpRequest,this._config.withCredentials&&(i.withCredentials=this._config.withCredentials),n||(i.onload=w(this._chunkLoaded,this),i.onerror=w(this._chunkError,this)),i.open("GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)i.setRequestHeader(t,e[t])}if(this._config.chunkSize){var r=this._start+this._config.chunkSize-1;i.setRequestHeader("Range","bytes="+this._start+"-"+r),i.setRequestHeader("If-None-Match","webkit-no-cache")}try{i.send()}catch(e){this._chunkError(e.message)}n&&0===i.status?this._chunkError():this._start+=this._config.chunkSize}},this._chunkLoaded=function(){4===i.readyState&&(i.status<200||400<=i.status?this._chunkError():(this._finished=!this._config.chunkSize||this._start>function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return-1;return parseInt(t.substr(t.lastIndexOf("/")+1))}(i),this.parseChunk(i.responseText)))},this._chunkError=function(e){var t=i.statusText||e;this._sendError(new Error(t))}}function p(e){var i,n;(e=e||{}).chunkSize||(e.chunkSize=k.LocalChunkSize),l.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((i=new FileReader).onload=w(this._chunkLoaded,this),i.onerror=w(this._chunkError,this)):i=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t)}var r=i.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:r}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(i.error)}}function _(e){var r;l.call(this,e=e||{}),this.stream=function(e){return r=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?r.substr(0,e):r;return r=e?r.substr(e):"",this._finished=!r,this.parseChunk(t)}}}function g(e){l.call(this,e=e||{});var t=[],r=!0,i=!1;this.pause=function(){l.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){l.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){i&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):r=!0},this._streamData=w(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=w(function(e){this._streamCleanUp(),this._sendError(e)},this),this._streamEnd=w(function(){this._streamCleanUp(),i=!0,this._streamData("")},this),this._streamCleanUp=w(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function r(g){var a,o,h,i=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,n=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,r=0,s=0,u=!1,e=!1,f=[],d={data:[],errors:[],meta:{}};if(z(g.step)){var l=g.step;g.step=function(e){if(d=e,p())c();else{if(c(),0===d.data.length)return;r+=e.data.length,g.preview&&r>g.preview?o.abort():l(d,t)}}}function m(e){return"greedy"===g.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function c(){if(d&&h&&(y("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+k.DefaultDelimiter+"'"),h=!1),g.skipEmptyLines)for(var e=0;e<d.data.length;e++)m(d.data[e])&&d.data.splice(e--,1);return p()&&function(){if(!d)return;for(var e=0;p()&&e<d.data.length;e++)for(var t=0;t<d.data[e].length;t++){var r=d.data[e][t];g.trimHeaders&&(r=r.trim()),f.push(r)}d.data.splice(0,1)}(),function(){if(!d||!g.header&&!g.dynamicTyping&&!g.transform)return d;for(var e=0;e<d.data.length;e++){var t,r=g.header?{}:[];for(t=0;t<d.data[e].length;t++){var i=t,n=d.data[e][t];g.header&&(i=t>=f.length?"__parsed_extra":f[t]),g.transform&&(n=g.transform(n,i)),n=_(i,n),"__parsed_extra"===i?(r[i]=r[i]||[],r[i].push(n)):r[i]=n}d.data[e]=r,g.header&&(t>f.length?y("FieldMismatch","TooManyFields","Too many fields: expected "+f.length+" fields but parsed "+t,s+e):t<f.length&&y("FieldMismatch","TooFewFields","Too few fields: expected "+f.length+" fields but parsed "+t,s+e))}g.header&&d.meta&&(d.meta.fields=f);return s+=d.data.length,d}()}function p(){return g.header&&0===f.length}function _(e,t){return r=e,g.dynamicTypingFunction&&void 0===g.dynamicTyping[r]&&(g.dynamicTyping[r]=g.dynamicTypingFunction(r)),!0===(g.dynamicTyping[r]||g.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(i.test(t)?parseFloat(t):n.test(t)?new Date(t):""===t?null:t):t;var r}function y(e,t,r,i){d.errors.push({type:e,code:t,message:r,row:i})}this.parse=function(e,t,r){var i=g.quoteChar||'"';if(g.newline||(g.newline=function(e,t){e=e.substr(0,1048576);var r=new RegExp(M(t)+"([^]*?)"+M(t),"gm"),i=(e=e.replace(r,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<i[0].length;if(1===i.length||s)return"\n";for(var a=0,o=0;o<i.length;o++)"\n"===i[o][0]&&a++;return a>=i.length/2?"\r\n":"\r"}(e,i)),h=!1,g.delimiter)z(g.delimiter)&&(g.delimiter=g.delimiter(e),d.meta.delimiter=g.delimiter);else{var n=function(e,t,r,i){for(var n,s,a,o=[",","\t","|",";",k.RECORD_SEP,k.UNIT_SEP],h=0;h<o.length;h++){var u=o[h],f=0,d=0,l=0;a=void 0;for(var c=new v({comments:i,delimiter:u,newline:t,preview:10}).parse(e),p=0;p<c.data.length;p++)if(r&&m(c.data[p]))l++;else{var _=c.data[p].length;d+=_,void 0!==a?1<_&&(f+=Math.abs(_-a),a=_):a=0}0<c.data.length&&(d/=c.data.length-l),(void 0===s||s<f)&&1.99<d&&(s=f,n=u)}return{successful:!!(g.delimiter=n),bestDelimiter:n}}(e,g.newline,g.skipEmptyLines,g.comments);n.successful?g.delimiter=n.bestDelimiter:(h=!0,g.delimiter=k.DefaultDelimiter),d.meta.delimiter=g.delimiter}var s=E(g);return g.preview&&g.header&&s.preview++,a=e,o=new v(s),d=o.parse(a,t,r),c(),u?{meta:{paused:!0}}:d||{meta:{paused:!1}}},this.paused=function(){return u},this.pause=function(){u=!0,o.abort(),a=a.substr(o.getCharIndex())},this.resume=function(){u=!1,t.streamer.parseChunk(a,!0)},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),d.meta.aborted=!0,z(g.complete)&&g.complete(d),a=""}}function M(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function v(e){var S,O=(e=e||{}).delimiter,x=e.newline,T=e.comments,I=e.step,A=e.preview,D=e.fastMode,L=S=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(L=e.escapeChar),("string"!=typeof O||-1<k.BAD_DELIMITERS.indexOf(O))&&(O=","),T===O)throw"Comment character same as delimiter";!0===T?T="#":("string"!=typeof T||-1<k.BAD_DELIMITERS.indexOf(T))&&(T=!1),"\n"!==x&&"\r"!==x&&"\r\n"!==x&&(x="\n");var P=0,F=!1;this.parse=function(i,t,r){if("string"!=typeof i)throw"Input must be a string";var n=i.length,e=O.length,s=x.length,a=T.length,o=z(I),h=[],u=[],f=[],d=P=0;if(!i)return C();if(D||!1!==D&&-1===i.indexOf(S)){for(var l=i.split(x),c=0;c<l.length;c++){if(f=l[c],P+=f.length,c!==l.length-1)P+=x.length;else if(r)return C();if(!T||f.substr(0,a)!==T){if(o){if(h=[],k(f.split(O)),R(),F)return C()}else k(f.split(O));if(A&&A<=c)return h=h.slice(0,A),C(!0)}}return C()}for(var p,_=i.indexOf(O,P),g=i.indexOf(x,P),m=new RegExp(M(L)+M(S),"g");;)if(i[P]!==S)if(T&&0===f.length&&i.substr(P,a)===T){if(-1===g)return C();P=g+s,g=i.indexOf(x,P),_=i.indexOf(O,P)}else if(-1!==_&&(_<g||-1===g))f.push(i.substring(P,_)),P=_+e,_=i.indexOf(O,P);else{if(-1===g)break;if(f.push(i.substring(P,g)),w(g+s),o&&(R(),F))return C();if(A&&h.length>=A)return C(!0)}else for(p=P,P++;;){if(-1===(p=i.indexOf(S,p+1)))return r||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:P}),E();if(p===n-1)return E(i.substring(P,p).replace(m,S));if(S!==L||i[p+1]!==L){if(S===L||0===p||i[p-1]!==L){var y=b(-1===g?_:Math.min(_,g));if(i[p+1+y]===O){f.push(i.substring(P,p).replace(m,S)),P=p+1+y+e,_=i.indexOf(O,P),g=i.indexOf(x,P);break}var v=b(g);if(i.substr(p+1+v,s)===x){if(f.push(i.substring(P,p).replace(m,S)),w(p+1+v+s),_=i.indexOf(O,P),o&&(R(),F))return C();if(A&&h.length>=A)return C(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:P}),p++}}else p++}return E();function k(e){h.push(e),d=P}function b(e){var t=0;if(-1!==e){var r=i.substring(p+1,e);r&&""===r.trim()&&(t=r.length)}return t}function E(e){return r||(void 0===e&&(e=i.substr(P)),f.push(e),P=n,k(f),o&&R()),C()}function w(e){P=e,k(f),f=[],g=i.indexOf(x,P)}function C(e){return{data:h,errors:u,meta:{delimiter:O,linebreak:x,aborted:F,truncated:!!e,cursor:d+(t||0)}}}function R(){I(C()),h=[],u=[]}},this.abort=function(){F=!0},this.getCharIndex=function(){return P}}function m(e){var t=e.data,r=h[t.workerId],i=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){i=!0,y(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:b,resume:b};if(z(r.userStep)){for(var s=0;s<t.results.data.length&&(r.userStep({data:[t.results.data[s]],errors:t.results.errors,meta:t.results.meta},n),!i);s++);delete t.results}else z(r.userChunk)&&(r.userChunk(t.results,n,t.file),delete t.results)}t.finished&&!i&&y(t.workerId,t.results)}function y(e,t){var r=h[e];z(r.userComplete)&&r.userComplete(t),r.terminate(),delete h[e]}function b(){throw"Not implemented."}function E(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var r in e)t[r]=E(e[r]);return t}function w(e,t){return function(){e.apply(t,arguments)}}function z(e){return"function"==typeof e}return o?f.onmessage=function(e){var t=e.data;void 0===k.WORKER_ID&&t&&(k.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:k.WORKER_ID,results:k.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var r=k.parse(t.input,t.config);r&&f.postMessage({workerId:k.WORKER_ID,results:r,finished:!0})}}:k.WORKERS_SUPPORTED&&(e=document.getElementsByTagName("script"),s=e.length?e[e.length-1].src:"",document.body?document.addEventListener("DOMContentLoaded",function(){a=!0},!0):a=!0),(c.prototype=Object.create(l.prototype)).constructor=c,(p.prototype=Object.create(l.prototype)).constructor=p,(_.prototype=Object.create(_.prototype)).constructor=_,(g.prototype=Object.create(l.prototype)).constructor=g,k});
},{}]},{},[4]);
