import {View} from "./View";
import {CsvParser} from "./CsvParser";

class SimpleDataGrapher{
    static elementIdSimpleDataGraphInstanceMap = {};
    elementId = null;
    view = null;

    constructor(elementId){
        this.elementId = elementId;
        SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId] = this;
        this.view = new View(elementId);
    }

};

export {SimpleDataGrapher};