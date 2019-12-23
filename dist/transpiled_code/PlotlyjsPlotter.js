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