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
      var self = this;

      document.getElementById(saveImageButton.id).onclick = function (e) {
        self.saveAsImageFunction(canvasId);
      };
    }
  }, {
    key: "plotGraph",
    value: function plotGraph() {
      if (this.flag) {
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