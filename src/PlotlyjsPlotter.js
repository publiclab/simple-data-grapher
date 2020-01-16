class PlotlyjsPlotter {
    'use strict';
    dataHash = {};
    elementId = null;
    graphCounting = 0;
    canvasContainerId = null;
    graphType = null;
    length = 0;
    flag = false;

    determineType2() {
        if (this.graphType == "Horizontal" || this.graphType == "Vertical") {
            return "bar";
        } else if (this.graphType == "Pie" || this.graphType == "Doughnut" || this.graphType == "Radar") {
            return "pie";
        } else if (this.graphType == "Basic" || this.graphType == "Stepped" || this.graphType == "Point") {
            return "scatter";
        }
    }
    layoutMaker() {
        var layout = {};
        if (this.graphType == "Horizontal" || this.graphType == "Vertical") {
            layout["barmode"] = "group";
        }
        return layout;
    }
    traceMaker() {
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
    keyDeterminer() {
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
    plotGraph2() {
        if (this.flag) {
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
        var div = document.createElement('div');
        div.id = this.elementId + '_chart_container_' + this.graphCounting;
        document.getElementById(this.canvasContainerId).appendChild(div);
        Plotly.newPlot(div.id, data, layout);

    }
    constructor(hash, length, type, flag, canvasContainerId, elementId, graphCounting) {
        this.dataHash = hash;
        this.length = length;
        this.graphType = type;
        this.flag = flag;
        this.canvasContainerId = canvasContainerId;
        this.elementId = elementId;
        this.graphCounting = graphCounting;
        this.plotGraph2();
    }
}
module.exports = PlotlyjsPlotter;