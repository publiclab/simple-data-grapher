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