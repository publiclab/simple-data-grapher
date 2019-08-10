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

var PlotlyjsPlotter = require('./PlotlyjsPlotter'); // const CODAPiFrame = require('./iframe-phone');


var iframe_phone = require('iframe-phone');

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
      console.log(document.getElementById(this.addGraphButtonId), "graph button");
    }
  }, {
    key: "createPopover",
    value: function createPopover(buttonId) {
      var self = this;
      var html = '<div id="myForm" class="hide"><label for="title">File Title:</label><input type="text" name="title" id=' + "title" + buttonId + ' class="form-control input-md"><label for="desc">File Description:</label><textarea rows="3" name="desc" id=' + "desc" + buttonId + ' class="form-control input-md"></textarea><button type="button" class="btn btn-primary" id="save"> Save</button></div>';
      $('#' + buttonId).popover({
        placement: 'bottom',
        title: 'Add Description',
        html: true,
        content: html
      }).on('click', function () {
        console.log("created popover");
        $('#save').click(function (e) {
          e.preventDefault();
          self.fileTitle = $('#' + "title" + buttonId).val();
          self.fileDescription = $('#' + "desc" + buttonId).val();
          console.log(self.fileTitle, self.fileDescription, self, "got it");
        });
      });
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
        var publish_research_button = document.createElement('button');
        publish_research_button.classList.add("btn");
        publish_research_button.classList.add("btn-primary");
        publish_research_button.innerHTML = "Publish as a Research Note";
        publish_research_button.id = this.elementId + "_publish";
        var container = document.getElementById(this.upload_button_container);
        var div_container = document.createElement('div');
        div_container.appendChild(save_file_button);
        div_container.appendChild(upload_prev_file);
        var container2 = document.getElementById(this.feature_button_container);
        container2.appendChild(publish_research_button);
        container.prepend(div_container);
      }
    }
  }, {
    key: "createDataset",
    value: function createDataset() {
      var dataset = {};
      dataset["action"] = "create";
      dataset["resource"] = "dataContext";
      var values = {};
      values["name"] = "my dataset";
      values["title"] = "Case Table";
      var collections = [];
      var hashCollections = {};
      hashCollections["name"] = "cases";
      hashCollections["attrs"] = this.csvParser.codapHeaders;
      collections.push(hashCollections);
      values["collections"] = collections;
      dataset["values"] = values;
      var dataset2 = {};
      dataset2["action"] = "create";
      dataset2["resource"] = "dataContext[my dataset].item";
      dataset2["values"] = this.csvParser.codapMatrix;
      var dataset3 = {};
      dataset3["action"] = "create";
      dataset3["resource"] = "component";
      var values3 = {};
      values3["type"] = "caseTable";
      values3["dataContext"] = "my dataset";
      dataset3["values"] = values3;
      return [dataset, dataset2, dataset3];
    }
  }, {
    key: "iframePhoneHandler",
    value: function iframePhoneHandler() {//callbackforCODAP
    }
  }, {
    key: "codapExport",
    value: function codapExport() {
      var self = this;
      console.log("clicked in codap now");
      var iframeBody = '<iframe id="codap-iframe" src="https://codap.concord.org/releases/latest?embeddedServer=yes#shared=109578" ></iframe>';
      var modal_body = document.getElementById("body_for_CODAP");
      modal_body.innerHTML = iframeBody;
      var iframe = document.getElementById("codap-iframe");
      modal_body.style.height = "500px";
      iframe.style.width = "750px";
      iframe.style.height = "90%"; // console.log(CODAPiFrame,"CODAP-IFRAME");

      var codapIframe = document.getElementById('codap-iframe');
      var rpcHandler = new iframe_phone.IframePhoneRpcEndpoint(self.iframePhoneHandler, "data-interactive", codapIframe);
      var createCodapButton = document.createElement("button");
      createCodapButton.classList.add("btn");
      createCodapButton.classList.add("btn-primary");
      createCodapButton.innerHTML = "Go!";
      createCodapButton.id = this.elementId + "_create_codap";
      modal_body.prepend(createCodapButton);
      var apiCall = this.createDataset();
      console.log(apiCall);
      console.log(this.csvParser.codapHeaders, this.csvParser.codapMatrix);
      $("#" + this.elementId + "_create_codap").click(function () {
        console.log("go go go");
        rpcHandler.call(apiCall, function (resp) {
          console.log('Response:' + JSON.stringify(resp));
        });
      });
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
      var count = 0;

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
          radio.id = "graph_type" + count;
          td.appendChild(document.createTextNode(types[i][j]));
          radio.name = this.graphMenuTypeInputName;
          td.appendChild(radio);
          tr.appendChild(td);
          count++;
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
            checkbox.id = name + i;
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

    _defineProperty(this, "fileTitle", "");

    _defineProperty(this, "fileDescription", "");

    _defineProperty(this, "codapExportButton", null);

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
    this.feature_button_container = elementId + "feature_button_container";
    this.codapExportButton = elementId + "codap_export_button";
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
        document.getElementById("popover" + _this5.fileUploadId).style.display = "inline";
        document.getElementById("popover" + _this5.csvStringUploadId).style.display = "none";
        document.getElementById("popover" + _this5.googleSheetUploadId).style.display = "none";
        document.getElementById("popover" + _this5.remoteFileUploadId).style.display = "none";

        _this5.createPopover("popover" + _this5.fileUploadId);

        _this5.handleFileSelectlocal(e);
      });
      $("#" + this.csvStringUploadId).change(function () {
        console.log(document.getElementById(_this5.csvStringUploadId).value);
        document.getElementById("popover" + _this5.csvStringUploadId).style.display = "inline";
        document.getElementById("popover" + _this5.googleSheetUploadId).style.display = "none";
        document.getElementById("popover" + _this5.remoteFileUploadId).style.display = "none";
        document.getElementById("popover" + _this5.fileUploadId).style.display = "none";

        _this5.createPopover("popover" + _this5.csvStringUploadId);

        _this5.handleFileSelectstring(document.getElementById(_this5.csvStringUploadId).value);
      });
      $("#" + this.googleSheetUploadId).change(function () {
        console.log(document.getElementById(_this5.googleSheetUploadId).value, "sheetlink");
        document.getElementById("popover" + _this5.googleSheetUploadId).style.display = "inline";
        document.getElementById("popover" + _this5.csvStringUploadId).style.display = "none";
        document.getElementById("popover" + _this5.remoteFileUploadId).style.display = "none";
        document.getElementById("popover" + _this5.fileUploadId).style.display = "none";

        _this5.createPopover("popover" + _this5.googleSheetUploadId);

        var sheetLink = document.getElementById(_this5.googleSheetUploadId).value;
        var sheetURL = "https://spreadsheets.google.com/feeds/list/" + sheetLink.split("/")[5] + "/od6/public/values?alt=json";

        _this5.getValueGoogleSheet(sheetURL);
      });
      $("#" + this.remoteFileUploadId).change(function () {
        console.log(document.getElementById(_this5.remoteFileUploadId).value);
        document.getElementById("popover" + _this5.remoteFileUploadId).style.display = "inline";
        document.getElementById("popover" + _this5.csvStringUploadId).style.display = "none";
        document.getElementById("popover" + _this5.googleSheetUploadId).style.display = "none";
        document.getElementById("popover" + _this5.fileUploadId).style.display = "none";

        _this5.createPopover("popover" + _this5.remoteFileUploadId);

        _this5.sendRemoteFileToHandler(document.getElementById(_this5.remoteFileUploadId).value);
      });
      $("#" + this.createSpreadsheetButtonId).click(function () {
        _this5.createSheet();
      });
      $("#" + this.codapExportButton).click(function () {
        _this5.codapExport();
      });
    } //renders the entire HTML view

  }, {
    key: "drawHTMLView",
    value: function drawHTMLView() {
      this.element.innerHTML = '<div class="body_container"><div class="main_heading_container"><h2 class="main_heading"> Simple Data Grapher</h2><p class="sub_heading">Plot and Export Graphs with CSV data</p></div><div class="heading_container"><ul class="headings"><li class="item-1">Upload CSV Data</li><li class="item-2">Select Columns & Graph Type</li><li class="item-3">Plotted Graph & Export Options</li></ul></div><div id=' + this.carousalId + ' class="carousel ' + this.carousalClass + ' slide" data-ride="carousel" data-interval="false"><div class="indicators"><ol class="carousel-indicators"> <li data-target="#' + this.carousalId + '" data-slide-to="0" class="active" id="up" class="first_indicator"></li> <li data-target="#' + this.carousalId + '" data-slide-to="1" class="second_indicator"></li> <li data-target="#' + this.carousalId + '" data-slide-to="2" class="third_indicator"></li></ol></div><div class="carousel-inner"><div class="carousel-item active"><div class="main_container"><div class="container_drag_drop"><span class="btn btn-outline-primary btn-file input_box"><p class="drag_drop_heading" id=' + this.dragDropHeadingId + '> <u> Choose a csv file </u> or drag & drop it here </p><input type="file" class="csv_file" id=' + this.fileUploadId + ' accept=".csv"></span><button type="button" class="btn btn-dark des" id=' + "popover" + this.fileUploadId + '><i class="fa fa-list"></i></button></div><h6 class="or"><span>OR</span></h6><div class="container_remote_link"><input type="text" class="remote_file text_field" placeholder="url of remote file" id=' + this.remoteFileUploadId + ' ><button type="button" class="btn btn-dark des" id=' + "popover" + this.remoteFileUploadId + '><i class="fa fa-list"></i></button></div><h6 class="or"><span>OR</span></h6><div class="container_csv_string"><textarea class="csv_string text_field" id=' + this.csvStringUploadId + ' placeholder="Paste a CSV string here" ></textarea><button type="button" class="btn btn-dark des" id=' + "popover" + this.csvStringUploadId + '><i class="fa fa-list"></i></button></div><h6 class="or"><span>OR</span></h6><div class="container_google_sheet"><div class="google_sheet_container"><input type="text" class="google_sheet text_field" id=' + this.googleSheetUploadId + ' placeholder="Link of published Google Sheet" ><button type="button" class="btn btn-dark des" id=' + "popover" + this.googleSheetUploadId + '><i class="fa fa-list"></i></button></div></div><div id=' + this.upload_button_container + ' class="upload_button"><button type="button" class="btn btn-primary uploadButton" id=' + this.uploadButtonId + ' >Upload CSV</button></div></div></div><div class="carousel-item tables"><div class="button_container"><div><input type="checkbox" name=' + this.xyToggleName + ' checked data-toggle="toggle" class="xytoggle" id="xy" data-width="150" data-onstyle="success" data-offstyle="warning" data-height="40"></div><div class="plot_button"><button type="button" class="btn btn-primary plotGraph" id=' + this.plotGraphId + ' >Plot Graph</button></div></div><div class="table_container"><div id=' + this.tableXParentId + ' ><table id=' + this.tableXId + ' class="table"></table></div><div id=' + this.tableYParentId + ' class="hidden"><table id=' + this.tableYId + ' class="table"></table></div><div><table id=' + this.graphMenuId + ' class="table table-dark"></table></div></div></div><div class="carousel-item graph"><div id=' + this.feature_button_container + ' class="feature_buttons"><button type="button" class="btn btn-primary addGraph" id=' + this.addGraphButtonId + '> Add Graph</button><button type="button" class="btn btn-success createSpreadsheet" id=' + this.createSpreadsheetButtonId + '> Create Spreadsheet<i class="fa fa-plus" aria-hidden="true"></i></button><button type="button" class="btn btn-info codapExport" id=' + this.codapExportButton + ' data-toggle="modal" data-target="#exampleModalCenter">View and Export to CODAP</button></div><div id=' + this.canvasContinerId + ' ></div></div></div></div></div><div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"><div class="modal-dialog modal-lg modal-dialog-centered" id="modal-style" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLongTitle">CODAP</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="body_for_CODAP"></div></div></div></div>';
    }
  }]);

  return View;
}();

exports.View = View;