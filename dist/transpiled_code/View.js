"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CsvParser = require('./CsvParser');

var SimpleDataGrapher = require('./SimpleDataGrapher');

var ChartjsPlotter = require('./ChartjsPlotter');

var PlotlyjsPlotter = require('./PlotlyjsPlotter');

var iframe_phone = require('iframe-phone');

var View =
/*#__PURE__*/
function () {
  _createClass(View, [{
    key: "handleFileSelectlocal",
    //extracts the uploaded file from input field and creates an object of CsvParser class with the file as one of the parameters
    value: function handleFileSelectlocal(event) {
      this.csvFile = event.target.files[0];

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
      // var csv_string = val.split("\n");
      this.csvFile = val;
      var self = this;

      document.getElementById(this.uploadButtonId).onclick = function (e) {
        self.csvParser = new CsvParser(self.csvFile, self.elementId, "csvstring");
      };
    } // function for using a previously uploaded and saved file from the data base

  }, {
    key: "usingPreviouslyUploadedFile",
    value: function usingPreviouslyUploadedFile() {
      var self = this;
      self.csvParser = new CsvParser("dummy", self.elementId, "prevfile");
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
    } //set tool tip for impot options

  }, {
    key: "setTooltip",
    value: function setTooltip(importType) {
      if (importType === "container_drag_drop") {
        return "Select a local file from your system";
      } else if (importType === "container_csv_string") {
        var x = "Type in or Paste a CSV string. \r\n";
        x += "Example: \r\n";
        x += "A,B,C \r\n";
        x += "1,2,3";
        return x;
      } else if (importType === "container_remote_link") {
        return "Type in or Paste the link of a remote CSV file. Example: \
            http://example.com/example.csv";
      } else if (importType === "container_google_sheet") {
        return "Type in or Paste the link of a Published Google Sheet. To publish a Google Sheet: 1. File -> Publish to the web -> Publish 2. Share -> Get shareable link -> Anyone with the link can -> More -> On - Public on the web -> Save 3. Copy link";
      }
    } //set tool tip for graph tips

  }, {
    key: "setTooltipGraph",
    value: function setTooltipGraph(graphType) {
      if (graphType == "Horizontal") {
        return "Data is categorical and tells how many, widths proportional to the values";
      } else if (graphType === "Vertical") {
        return "Data is categorical and tells how many, heights proportional to the values";
      } else if (graphType == "Stacked") {
        return "Ideal for comparing the total amounts across each group/segmented bar";
      } else if (graphType == "Basic") {
        return "Used to visualize a trend in data over intervals of time or to see the growth of a quantity";
      } else if (graphType == "Stepped") {
        return "Vertical parts of a step chart denote changes in the data and their magnitude";
      } else if (graphType == "Point") {
        return "Used to show the relationship between two data variables";
      } else if (graphType == "Pie") {
        return "Used to show percentage or proportional data, should be used for less number of categories";
      } else if (graphType == "Doughnut") {
        return "Used to show percentage or proportional data, but have better data intensity ratio and space efficiency";
      } else if (graphType == "Radar") {
        return "Used to display multivariate observations with an arbitrary number of variables";
      }
    } // create a popover against each import method for adding a file title and description

  }, {
    key: "createPopover",
    value: function createPopover(buttonId) {
      var self = this;
      var html = '<div id="myForm" class="hide"><label for="title" class="popover_headings">File Title:</label><input type="text" name="title" id=' + "title" + buttonId + ' class="form-control input-md"><label for="desc" class="popover_headings">File Description:</label><textarea rows="3" name="desc" id=' + "desc" + buttonId + ' class="form-control input-md"></textarea><button type="button" class="btn btn-primary popover_headings" id="save"> Save</button></div>';
      $('#' + buttonId).popover({
        placement: 'bottom',
        title: 'Add Description',
        html: true,
        content: html
      }).on('click', function () {
        $('#save').click(function (e) {
          e.preventDefault();
          self.fileTitle = $('#' + "title" + buttonId).val();
          self.fileDescription = $('#' + "desc" + buttonId).val();
        });
      });
    } // renders the required buttons for saving the files if the use is logged in

  }, {
    key: "createButtons",
    value: function createButtons(userLoginCheck) {
      this.listenersForIntegration();

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
    } // create dataset for CODAP table

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
    value: function iframePhoneHandler() {} //callbackforCODAP
    // renders the iframe for CODAP export

  }, {
    key: "codapExport",
    value: function codapExport() {
      var self = this;
      var iframeBody = '<iframe id="codap-iframe" src="https://codap.concord.org/releases/latest?embeddedServer=yes#shared=109578" ></iframe>';
      var modal_body = document.getElementById("body_for_CODAP");
      modal_body.innerHTML = iframeBody;
      var iframe = document.getElementById("codap-iframe");
      modal_body.style.height = "500px";
      iframe.style.width = "750px";
      iframe.style.height = "90%";
      var codapIframe = document.getElementById('codap-iframe');
      var rpcHandler = new iframe_phone.IframePhoneRpcEndpoint(self.iframePhoneHandler, "data-interactive", codapIframe);
      var createCodapButton = document.createElement("button");
      createCodapButton.classList.add("btn");
      createCodapButton.classList.add("btn-primary");
      createCodapButton.innerHTML = "Go!";
      createCodapButton.id = this.elementId + "_create_codap";
      modal_body.prepend(createCodapButton);
      var apiCall = this.createDataset();
      $("#" + this.elementId + "_create_codap").click(function () {
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
    value: function afterSampleData(flag, type) {
      var _this2 = this;

      document.getElementById(this.plotGraphId).onclick = function (e) {
        e.preventDefault();
        var hash = {};
        var ix = $('input[name=' + _this2.tableXInputName + ']:checked').val();
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
        var selectedGraph = $('.selected');
        var type = selectedGraph.attr('data-value');

        _this2.plotGraph(hash, columns.length, type, flag, "plotly");
      };
    } // generates a graph menu with different graph options

  }, {
    key: "graphMenu",
    value: function graphMenu(flag) {
      var self = this;
      $('.' + this.carousalClass).carousel(1);
      var menuDiv = document.getElementById("menu_holder");
      menuDiv.innerHTML = '<p id="graph_description"> blahhhhh </p> <div class="grid-container radio-group"> <div class="grid-item radio" data-value="Horizontal"> <img src="https://i.ibb.co/8gfR9d9/horizontal.png" height="100px" width="100px"> <div class="hmm" id="HorizontalType"> <p> Horizontal Bar </p> </div> </div> <div class="grid-item radio" data-value="Vertical"> <img src="https://i.ibb.co/tZVgrBw/vertical.png" height="100px" width="100px"> <div class="hmm" id="VerticalType"> <p> Vertical Bar </p> </div> </div> <div class="grid-item radio" data-value="Stacked"> <img src="https://i.ibb.co/9T2df0z/stacked.png" height="100px" width="100px"> <div class="hmm" id="StackedType"> <p> Stacked Bar </p> </div></div> <div class="grid-item radio" data-value="Basic"> <img src="https://i.ibb.co/S7rDsPV/basic.png" height="100px" width="100px"> <div class="hmm" id="BasicType"> <p> Basic Line </p> </div> </div> <div class="grid-item radio" data-value="Stepped"> <img src="https://i.ibb.co/FbB7yjg/stepped.png" height="100px" width="100px"> <div class="hmm" id="SteppedType"> <p> Stepped Line </p> </div> </div> <div class="grid-item radio" data-value="Point"> <img src="https://i.ibb.co/kqdQyqx/point.png" height="100px" width="100px"> <div class="hmm" id="PointType"> <p> Point </p> </div> </div> <div class="grid-item radio" data-value="Pie"> <img src="https://i.ibb.co/JcJ0tv3/pie.png" height="100px" width="110px"> <div class="hmm" id="PieType"> <p> Pie </p> </div> </div> <div class="grid-item radio" data-value="Doughnut"> <img src="https://i.ibb.co/SnLkwTv/doughnut.png" height="100px" width="110px"> <div class="hmm" id="DoughnutType"> <p> Doughnut </p> </div> </div> <div class="grid-item radio" data-value="Radar"> <img src="https://i.ibb.co/BCmQ2Tq/radar.png" height="100px" width="100px"> <div class="hmm" id="RadarType"> <p> Radar </p> </div> </div> </div> <p class="d"> blahhh </p>';
      $('.radio-group .radio').click(function () {
        $(this).parent().find('.radio').removeClass('selected');
        var l = document.getElementsByClassName('hmm');

        for (var i = 0; i < l.length; i++) {
          l[i].style.backgroundColor = "#cccccc";
        }

        $(this).addClass('selected');
        var type = $(this).attr('data-value');
        $('#' + type + "Type").css('backgroundColor', '#1ad1ff');
      });
      $('.radio').hover(function () {
        var tooltipVal = self.setTooltipGraph($(this).attr('data-value'));
        $('#graph_description').text(tooltipVal);
        $('#graph_description').css({
          opacity: 0.0,
          visibility: "visible"
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

      this.graphMenu(flag);
    } // renders the sample tables

  }, {
    key: "showSampleDataXandY",
    value: function showSampleDataXandY() {
      var _this3 = this;

      document.getElementById(this.addGraphButtonId).onclick = function (e) {
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
      if (x != "prevfile") {
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

      $("#" + this.fileUploadId).change(function (e) {
        document.getElementById("popover" + _this4.fileUploadId).style.display = "inline";
        document.getElementById("popover" + _this4.csvStringUploadId).style.display = "none";
        document.getElementById("popover" + _this4.googleSheetUploadId).style.display = "none";
        document.getElementById("popover" + _this4.remoteFileUploadId).style.display = "none";

        _this4.createPopover("popover" + _this4.fileUploadId);

        _this4.handleFileSelectlocal(e);
      });
      $("#" + this.csvStringUploadId).change(function () {
        document.getElementById("popover" + _this4.csvStringUploadId).style.display = "inline";
        document.getElementById("popover" + _this4.googleSheetUploadId).style.display = "none";
        document.getElementById("popover" + _this4.remoteFileUploadId).style.display = "none";
        document.getElementById("popover" + _this4.fileUploadId).style.display = "none";

        _this4.createPopover("popover" + _this4.csvStringUploadId);

        _this4.handleFileSelectstring(document.getElementById(_this4.csvStringUploadId).value);
      });
      $("#" + this.googleSheetUploadId).change(function () {
        document.getElementById("popover" + _this4.googleSheetUploadId).style.display = "inline";
        document.getElementById("popover" + _this4.csvStringUploadId).style.display = "none";
        document.getElementById("popover" + _this4.remoteFileUploadId).style.display = "none";
        document.getElementById("popover" + _this4.fileUploadId).style.display = "none";

        _this4.createPopover("popover" + _this4.googleSheetUploadId);

        var sheetLink = document.getElementById(_this4.googleSheetUploadId).value;
        var sheetURL = "https://spreadsheets.google.com/feeds/list/" + sheetLink.split("/")[5] + "/od6/public/values?alt=json";

        _this4.getValueGoogleSheet(sheetURL);
      });
      $("#" + this.remoteFileUploadId).change(function () {
        document.getElementById("popover" + _this4.remoteFileUploadId).style.display = "inline";
        document.getElementById("popover" + _this4.csvStringUploadId).style.display = "none";
        document.getElementById("popover" + _this4.googleSheetUploadId).style.display = "none";
        document.getElementById("popover" + _this4.fileUploadId).style.display = "none";

        _this4.createPopover("popover" + _this4.remoteFileUploadId);

        _this4.sendRemoteFileToHandler(document.getElementById(_this4.remoteFileUploadId).value);
      });
    }
  }]);

  function View(elementId) {
    var _this5 = this;

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

    this.elementId = elementId;
    this.element = document.getElementById(elementId);

    if (this.element == null) {
      throw "No element exist with this id";
    }

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
        visibility: "visible"
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

      $("#" + this.fileUploadId).change(function (e) {
        _this6.handleFileSelectlocal(e);
      });
      $("#" + this.csvStringUploadId).change(function () {
        _this6.handleFileSelectstring(document.getElementById(_this6.csvStringUploadId).value);
      });
      $("#" + this.googleSheetUploadId).change(function () {
        var sheetURL = "https://spreadsheets.google.com/feeds/list/" + sheetLink.split("/")[5] + "/od6/public/values?alt=json";

        _this6.getValueGoogleSheet(sheetURL);
      });
      $("#" + this.remoteFileUploadId).change(function () {
        _this6.sendRemoteFileToHandler(document.getElementById(_this6.remoteFileUploadId).value);
      });
      $("#" + this.createSpreadsheetButtonId).click(function () {
        _this6.createSheet();
      });
      $("#" + this.codapExportButton).click(function () {
        _this6.codapExport();
      });
    } //renders the entire HTML view

  }, {
    key: "drawHTMLView",
    value: function drawHTMLView() {
      this.element.innerHTML = '<div class="body_container"> <div class="main_heading_container"><h2 class="main_heading">Simple Data Grapher</h2> <p class="sub_heading sub_title">A JavaScript library that turns uploaded CSV files into customizable graphs within a few simple steps. Can be embedded on other websites!</p> <p class="sub_heading"> Open Source <a href="https://github.com/publiclab/simple-data-grapher"> <i class="fab fa-github"></i> </a> by <a href="https://publiclab.org" title="Public Lab Website"><i class="fa fa-globe"></i> Public Lab</a> </p> </div> <div class="heading_container"> <ul class="headings"> <li class="item-1">Upload CSV Data</li> <li class="item-2">Select Columns & Graph Type</li> <li class="item-3">Plotted Graph & Export Options</li> </ul> </div> <div id=' + this.carousalId + ' class="carousel ' + this.carousalClass + ' slide" data-ride="carousel" data-interval="false"> <div class="indicators"> <ol class="carousel-indicators"> <li data-target="#' + this.carousalId + '" data-slide-to="0" class="active" id="up" class="first_indicator"></li> <li data-target="#' + this.carousalId + '" data-slide-to="1" class="second_indicator"></li> <li data-target="#' + this.carousalId + '" data-slide-to="2" class="third_indicator"></li> </ol> </div> <div class="carousel-inner"> <div class="carousel-item active"> <div class="parent_main_container"> <div> <p id="import_description"> text_for_replacement</p> </div> <div class="main_container"> <div class="main_grid_container"> <div class="container_drag_drop grid-item imports"> <p class="sub_heading_import"> Local File </p> <span class="btn btn-outline-primary btn-file input_box shadow"> <p class="drag_drop_heading" id=' + this.dragDropHeadingId + '><u> Choose a csv file </u> or drag & drop it here </p> <input type="file" class="csv_file" id=' + this.fileUploadId + ' accept=".csv"> </span> <button type="button" class="btn btn-dark des" id=' + "popover" + this.fileUploadId + '> <i class="fa fa-list"></i> </button> </div> <div class="container_remote_link grid-item imports"> <p class="sub_heading_import"> Remote File </p> <input type="text" class="remote_file text_field shadow" placeholder="url of remote file" id=' + this.remoteFileUploadId + '> <button type="button" class="btn btn-dark des" id=' + "popover" + this.remoteFileUploadId + '><i class="fa fa-list"></i></button> </div> <div class="container_csv_string grid-item imports"> <p class="sub_heading_import"> String File </p> <textarea class="csv_string text_field shadow" id=' + this.csvStringUploadId + ' placeholder="Paste a CSV string here"></textarea> <button type="button" class="btn btn-dark des" id=' + "popover" + this.csvStringUploadId + '><i class="fa fa-list"></i></button> </div> <div class="container_google_sheet grid-item imports"> <p class="sub_heading_import"> Google Sheet </p> <div class="google_sheet_container"> <input type="text" class="google_sheet text_field shadow" id=' + this.googleSheetUploadId + ' placeholder="Link of published Google Sheet"> <button type="button" class="btn btn-dark des" id=' + "popover" + this.googleSheetUploadId + '><i class="fa fa-list"></i></button> </div> </div> </div> <div id=' + this.upload_button_container + ' class="upload_button"> <button type="button" class="btn btn-primary uploadButton" id=' + this.uploadButtonId + '>Upload CSV</button> </div> </div> <div style="visibility: hidden;"> <p> heyyyyy</p> </div> </div> </div> <div class="carousel-item tables"> <div class="button_container"> <div> <input type="checkbox" name=' + this.xyToggleName + ' checked data-toggle="toggle" class="xytoggle" id="xy" data-width="150" data-onstyle="success" data-offstyle="warning" data-height="40"> </div> <div class="plot_button"> <button type="button" class="btn btn-primary plotGraph" id=' + this.plotGraphId + '>Plot Graph</button> </div> </div> <div class="table_container"> <div id=' + this.tableXParentId + '> <table id=' + this.tableXId + ' class="table"></table> </div> <div id=' + this.tableYParentId + ' class="hidden"> <table id=' + this.tableYId + ' class="table"></table> </div> <div id="menu_holder"></div> </div> </div> <div class="carousel-item graph"> <div id=' + this.feature_button_container + ' class="feature_buttons"> <button type="button" class="btn btn-primary addGraph" id=' + this.addGraphButtonId + '> Add Graph</button> <button type="button" class="btn btn-success createSpreadsheet" id=' + this.createSpreadsheetButtonId + '> Create Spreadsheet<i class="fa fa-plus" aria-hidden="true"></i></button> <button type="button" class="btn btn-info codapExport" id=' + this.codapExportButton + ' data-toggle="modal" data-target="#exampleModalCenter">View and Export to CODAP</button> </div> <div class="parent_canvas_container"> <div id=' + this.canvasContinerId + '></div> </div> </div> </div> </div></div><div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"> <div class="modal-dialog modal-lg modal-dialog-centered" id="modal-style" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="exampleModalLongTitle">CODAP</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body" id="body_for_CODAP"></div> </div> </div></div>';
    }
  }]);

  return View;
}();

exports.View = View;