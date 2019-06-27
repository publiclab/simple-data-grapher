"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _CsvParser = require("./CsvParser");

var _SimpleDataGrapher = require("./SimpleDataGrapher");

var _xlsx = _interopRequireDefault(require("xlsx"));

var _fileSaver = require("file-saver");

var _chartjs = _interopRequireDefault(require("chartjs"));

var _papaparse = _interopRequireDefault(require("papaparse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

        document.getElementById(this.uploadButtonId).onclick = function () {
          self.csvParser = new CsvParser(self.csvFile, self.elementId, "local");
        };
      }
    } //receives the string value and creates an object of CsvParser class with the string as one of the parameters

  }, {
    key: "handleFileSelectstring",
    value: function handleFileSelectstring(val) {
      console.log("i am at csv string handler");
      var csv_string = val.split("\n");
      var mat = [];

      for (var i = 0; i < csv_string.length; i++) {
        if (csv_string[i] == "" || csv_string[i] == " ") {
          continue;
        }

        var dataHash = _papaparse["default"].parse(csv_string[i], {
          dynamicTyping: true,
          comments: true
        });

        mat[i] = dataHash['data'][0];
      }
      console.log("i am at csv string handler", val); // var csv_string = val.split("\n");

      this.csvFile = val;
      var self = this;

      document.getElementById(this.uploadButtonId).onclick = function () {
        console.log("i am uploading");
        self.csvParser = new CsvParser(self.csvFile, self.elementId, "csvstring");
      };
    } //receives the JSON file value and creates an object of CsvParser class with the file as one of the parameters

  }, {
    key: "handleFileSelectGoogleSheet",
    value: function handleFileSelectGoogleSheet(googleSheetData) {
      this.csvFile = googleSheetData;
      var self = this;

      document.getElementById(this.uploadButtonId).onclick = function () {
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
    } // creates a downloadable spreadsheet for the imported data using SheetJS

  }, {
    key: "createSheet",
    value: function createSheet() {
      var wb = _xlsx["default"].utils.book_new();

      wb.Props = {
        Title: "New Spreadsheet" + this.elementId,
        CreatedDate: new Date()
      };
      wb.SheetNames.push("Sheet" + this.elementId);
      var ws_data = this.csvParser.completeCsvMatrixTranspose;

      var ws = _xlsx["default"].utils.aoa_to_sheet(ws_data);

      wb.Sheets["Sheet" + this.elementId] = ws;

      var wbout = _xlsx["default"].write(wb, {
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

      (0, _fileSaver.saveAs)(new Blob([s2ab(wbout)], {
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

      for (var x = 0; x < this.csvParser.csvSampleData[0].length; x++) {
        var tr = document.createElement('tr');

        for (var y = 0; y < this.csvParser.csvHeaders.length; y++) {
          var tds = document.createElement('td');
          tds.appendChild(document.createTextNode(this.csvParser.csvSampleData[y][x]));
          tr.appendChild(tds);
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

      document.getElementById(this.addGraphButtonId).onclick = function () {
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
      this.csvParser = x;
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
      this.element.innerHTML = '<div class="body_container"><div class="main_heading_container"><h2 class="main_heading"> Simple Data Grapher</h2><p class="sub_heading">Plot and Export Graphs with CSV data</p></div><div class="heading_container"><ul class="headings"><li class="item-1">Upload CSV Data</li><li class="item-2">Select Columns & Graph Type</li><li class="item-3">Plotted Graph & Export Options</li></ul></div><div id=' + this.carousalId + ' class="carousel ' + this.carousalClass + ' slide" data-ride="carousel"><div class="indicators"><ol class="carousel-indicators"> <li data-target="#' + this.carousalId + '" data-slide-to="0" class="active" id="up"></li> <li data-target="#' + this.carousalId + '" data-slide-to="1"></li> <li data-target="#' + this.carousalId + '" data-slide-to="2"></li></ol></div><div class="carousel-inner"><div class="carousel-item active"><div class="main_container"><div class="container_drag_drop"><span class="btn btn-outline-primary btn-file input_box"><p class="drag_drop_heading" id=' + this.dragDropHeadingId + '> <u> Choose a csv file </u> or drag & drop it here </p><input type="file" class="csv_file" id=' + this.elementId + "_csv_file" + ' accept=".csv"></span></div><h6 class="or"><span>OR</span></h6><div class="container_remote_link"><input type="text" class="remote_file text_field" placeholder="url of remote file" id=' + this.elementId + "_remote_file" + ' ></div><h6 class="or"><span>OR</span></h6><div class="container_csv_string"><textarea class="csv_string text_field" id=' + this.elementId + "_csv_string" + ' placeholder="Paste a CSV string here" ></textarea></div><h6 class="or"><span>OR</span></h6><div class="container_google_sheet"><input type="text" class="google_sheet text_field" id=' + this.elementId + "_google_sheet" + ' placeholder="Link of published Google Sheet" ></div><div class="upload_button"><button type="button" class="btn btn-primary" id=' + this.uploadButtonId + ' >Upload CSV</button></div></div></div><div class="carousel-item tables"><div class="button_container"><div><input type="checkbox" name=' + this.xyToggleName + ' checked data-toggle="toggle" class="xytoggle" data-width="150" data-onstyle="success" data-offstyle="warning" data-height="40"></div><div class="plot_button"><button type="button" class="btn btn-primary" id=' + this.plotGraphId + ' >Plot Graph</button></div></div><div class="table_container"><div id=' + this.tableXParentId + ' ><table id=' + this.tableXId + ' class="table"></table></div><div id=' + this.tableYParentId + ' class="hidden"><table id=' + this.tableYId + ' class="table"></table></div><div><table id=' + this.graphMenuId + ' class="table table-dark"></table></div></div></div><div class="carousel-item graph"><div class="feature_buttons"><button type="button" class="btn btn-primary" id=' + this.addGraphButtonId + '> Add Graph</button><button type="button" class="btn btn-success" id=' + this.createSpreadsheetButtonId + '> Create Spreadsheet<i class="fa fa-plus" aria-hidden="true"></i></button></div><div id=' + this.canvasContinerId + ' ></div></div></div></div></div>';
    }
  }]);

  return View;
}();

exports.View = View;