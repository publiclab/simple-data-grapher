import {View} from "./View";

class SimpleDataGrapher{
    'use strict';
    static elementIdSimpleDataGraphInstanceMap = {};
    elementId = null;
    view = null;
    constructor(elementId){
        this.elementId = elementId;
        SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId] = this;
        console.log(SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId]);
        this.view = new View(elementId);
    }
};

export {SimpleDataGrapher};

window.SimpleDataGrapher = SimpleDataGrapher;