import {View} from "./View";
import {CsvParser} from "./CsvParser";

class SimpleDataGrapher{
    'use strict';
    static elementIdSimpleDataGraphInstanceMap = {};
    elementId = null;
    view = null;
    constructor(elementId){
        this.elementId = elementId;
        this.elementIdSimpleDataGraphInstanceMap[this.elementId] = this;
        this.view = new View(elementId);
    }
};

export {SimpleDataGrapher};

window.SimpleDataGrapher = SimpleDataGrapher;