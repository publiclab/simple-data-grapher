(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./SimpleDataGrapher":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleDataGrapher = void 0;

var _View = require("./View");

var _CsvParser = require("./CsvParser");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SimpleDataGrapher = function SimpleDataGrapher(elementId) {
  _classCallCheck(this, SimpleDataGrapher);

  _defineProperty(this, 'use strict', void 0);

  _defineProperty(this, "elementId", null);

  _defineProperty(this, "view", null);

  this.elementId = elementId;
  SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId] = this;
  this.view = new _View.View(elementId);
};

exports.SimpleDataGrapher = SimpleDataGrapher;

_defineProperty(SimpleDataGrapher, "elementIdSimpleDataGraphInstanceMap", {});


window.SimpleDataGrapher = SimpleDataGrapher;
},{"./CsvParser":1,"./View":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _CsvParser = require("./CsvParser");

var _SimpleDataGrapher = require("./SimpleDataGrapher");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var View =
/*#__PURE__*/
function () {
  _createClass(View, [{
    key: "handleFileSelectlocal",
    value: function handleFileSelectlocal(event) {
      var _this = this;

      this.csvFile = event.target.files[0];
      console.log("iam here in handle");
      console.log(this);

      if (this.csvFile['name'].split(".")[1] != "csv") {
        alert("Invalid file type");
      } else {
        $('#' + this.dragDropHeadingId).text(this.csvFile['name']);

        document.getElementById(this.uploadButtonId).onclick = function (e) {
          console.log("i am uploading");
          console.log(_this);
          _this.csvParser = new _CsvParser.CsvParser(_this.csvFile, _this.elementId);
        };
      }
    }
  }, {
    key: "determineType",
    value: function determineType(type) {
      console.log("at type");
      console.log(type);

      if (type == "Basic" || type == "Stepped" || type == "Point") {
        return 'line';
      } else if (type == "Horizontal") {
        return 'horizontalBar';
      } else if (type == "Vertical") {
        return 'bar';
      } else {
        return type.toLowerCase();
      }
    }
  }, {
    key: "colorGenerator",
    value: function colorGenerator(i, tb, type, count) {
      console.log("at color");
      var colors = ['rgba(255, 77, 210, 0.5)', 'rgba(0, 204, 255, 0.5)', 'rgba(128, 0, 255, 0.5)', 'rgba(255, 77, 77, 0.5)', 'rgba(0, 179, 0, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(255, 0, 102, 0.5)', 'rgba(0, 115, 230, 0.5)'];
      var bordercolors = ['rgb(255, 0, 191)', 'rgb(0, 184, 230)', 'rgb(115, 0, 230)', 'rgb(255, 51, 51)', 'rgb(0, 153, 0)', 'rgb(230, 230, 0)', 'rgb(230, 0, 92)', 'rgb(0, 102, 204)'];
      var length = 8;

      if (type == "Pie" || type == "Doughnut") {
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
    value: function determineData(type, i, hash) {
      console.log("at data");
      var h = {};

      if (type == "Basic") {
        h['fill'] = false;
      } else if (type == "Stepped") {
        h['steppedLine'] = true;
        h['fill'] = false;
      } else if (type == "Point") {
        h['showLine'] = false;
        h['pointRadius'] = 10;
      }

      h['backgroundColor'] = this.colorGenerator(i, "bg", type, hash['y_axis_values' + i].length);
      h['borderColor'] = this.colorGenerator(i, "bo", type, hash['y_axis_values' + i].length);
      h['borderWidth'] = 1;
      h['label'] = hash['labels'][1][i];
      h['data'] = hash['y_axis_values' + i];
      return h;
    }
  }, {
    key: "determineConfig",
    value: function determineConfig(hash, length, type) {
      console.log("at config");
      var config = {};
      config['type'] = this.determineType(type);
      var data = {};
      data['labels'] = hash['x_axis_labels'];
      var datasets = [];

      for (var i = 0; i < length; i++) {
        var h = this.determineData(type, i, hash);
        datasets.push(h);
      }

      var options = {
        'responsive': true,
        'maintainAspectRatio': true,
        'chartArea': {
          backgroundColor: 'rgb(204, 102, 255)'
        }
      };
      options['scales'] = this.scales(hash);
      config['options'] = options;
      data['datasets'] = datasets;
      config['data'] = data;
      return config;
    }
  }, {
    key: "scales",
    value: function scales(hash) {
      console.log("at scales");
      var scales = {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: hash['labels'][0]
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
    key: "plotGraph",
    value: function plotGraph(hash, length, type, flag) {
      if (flag) {
        console.log("at plotGraph");
        document.getElementById(this.canvasContinerId).innerHTML = "";
      }

      var div = document.createElement('div');
      div.classList.add(this.elementId + '_chart_container_' + this.graphCounting);
      var canv = document.createElement('canvas');
      canv.id = this.elementId + '_canvas_' + this.graphCounting;
      div.appendChild(canv);
      document.getElementById(this.canvasContinerId).appendChild(div);
      var ctx = canv.getContext('2d');
      var configuration = this.determineConfig(hash, length, type);
      new Chart(ctx, configuration);
      $('.' + this.carousalClass).carousel(2); // saveAsImage();
      // new RangeSliderChart({
      // 	chartData: config, //The same data you give to Chart.js
      // 	chartOpts: options, //Your Chart.js options
      // 	chartType: type, //Which Chart.js chart you want (eg. Lie, Bar, Pie, etc.)
      // 	chartCTX: ctx, //your canvas context
      // 	class: 'my-chart-ranger', //Specifies a custom class you want applied to your sliders
      // 	initial: [3, 10] //Which data points to start the sliders on
      // })
    }
  }, {
    key: "afterSampleData",
    value: function afterSampleData(flag) {
      var _this2 = this;

      console.log("at checkbox");
      console.log(this.csvParser.completeCsvMatrix);

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

        _this2.plotGraph(hash, columns.length, type, flag);
      };
    }
  }, {
    key: "graphMenu",
    value: function graphMenu() {
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
    }
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
    }
  }, {
    key: "showSampleDataXandY",
    value: function showSampleDataXandY() {
      var _this3 = this;

      console.log("at sampleDataXandY");

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
    }
  }, {
    key: "continueViewManipulation",
    value: function continueViewManipulation() {
      console.log(" i am back in view manipulation");
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

    _defineProperty(this, "csvFile", null);

    _defineProperty(this, "dragDropHeadingId", null);

    _defineProperty(this, "uploadButtonId", null);

    _defineProperty(this, "csvParser", null);

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

    _defineProperty(this, "saveAsImage", null);

    console.log("i am in view");
    this.elementId = elementId;
    this.element = document.getElementById(elementId);

    if (this.element == null) {
      throw "No element exist with this id";
    }

    console.log("i am in view");
    this.fileUploadId = elementId + "_csv_file";
    this.dragDropHeadingId = elementId + "_drag_drop_heading";
    this.uploadButtonId = elementId + "_file_upload_button";
    this.addGraphButtonId = elementId + "_add_graph";
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
    this.drawHTMLView();
    this.addListeners();
    $('.' + this.carousalClass).carousel({
      interval: false
    });
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
  }

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
    }
  }, {
    key: "drawHTMLView",
    value: function drawHTMLView() {
      this.element.innerHTML = '<div id=' + this.carousalId + ' class="carousel ' + this.carousalClass + ' slide" data-ride="carousel"><div class="indicators"><ol class="carousel-indicators"> <li data-target="#' + this.carousalId + '" data-slide-to="0" class="active" id="up"></li> <li data-target="#' + this.carousalId + '" data-slide-to="1"></li> <li data-target="#' + this.carousalId + '" data-slide-to="2"></li></ol></div><div class="carousel-inner"><div class="carousel-item active"><div class="main_container"><div class="container_drag_drop"><span class="btn btn-outline-primary btn-file input_box"><p class="drag_drop_heading" id=' + this.dragDropHeadingId + '> <u> Choose a csv file </u> or drag & drop it here </p><input type="file" class="csv_file" id=' + this.elementId + "_csv_file" + ' accept=".csv"></span></div><h6 class="or"><span>OR</span></h6><div class="container_remote_link"><input type="text" class="remote_file text_field" placeholder="url of remote file" ></div><h6 class="or"><span>OR</span></h6><div class="container_csv_string"><textarea class="csv_string text_field" placeholder="Paste a CSV string here" ></textarea></div><div class="upload_button"><button type="button" class="btn btn-primary" id=' + this.uploadButtonId + ' >Upload CSV</button></div></div></div><div class="carousel-item tables"><div class="button_container"><div><input type="checkbox" name=' + this.xyToggleName + ' checked data-toggle="toggle" class="xytoggle" data-width="150" data-onstyle="success" data-offstyle="warning" data-height="40"></div><div class="plot_button"><button type="button" class="btn btn-primary" id=' + this.plotGraphId + ' >Plot Graph</button></div></div><div class="table_container"><div id=' + this.tableXParentId + ' ><table id=' + this.tableXId + ' class="table"></table></div><div id=' + this.tableYParentId + ' class="hidden"><table id=' + this.tableYId + ' class="table"></table></div><div><table id=' + this.graphMenuId + ' class="table table-dark"></table></div></div></div><div class="carousel-item graph"><div class="feature_buttons"><button type="button" class="btn btn-primary" id="update_graph">Update Graph</button><button type="button" class="btn btn-primary" id="save_as_image"> Save as image</button><button type="button" class="btn btn-primary" id=' + this.addGraphButtonId + '> Add Graph</button></div><div id=' + this.canvasContinerId + ' ></div></div></div></div>';
    }
  }]);

  return View;
}();

exports.View = View;
},{"./CsvParser":1,"./SimpleDataGrapher":2}]},{},[2]);
