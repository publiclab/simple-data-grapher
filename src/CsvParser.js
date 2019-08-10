// import {SimpleDataGrapher} from "./SimpleDataGrapher";
const SimpleDataGrapher = require('./SimpleDataGrapher');
const Papa = require("papaparse");
class CsvParser{

    'use strict';

    csvFile = null;
    csvMatrix = [];
    csvHeaders = [];
    csvFileStart = 1; //start is variable that will be passed to the function to sort out the columns. start will tell if the existing CSV file has headers or not, therefore, to start the iteration from 0 or 1 Used in header determination
    completeCsvMatrix = [];
    completeCsvMatrixTranspose = [];
    csvSampleData = [];
    csvValidForYAxis = [];
    elementId = null;
    codapHeaders=[];
    codapMatrix=[];

    constructor(file, elementId, functionParameter){
        this.elementId = elementId;
        this.csvFile = file;
        if (functionParameter=="prevfile"){
            return this;
        }
        else{
            this.allFunctionHandler(functionParameter);
        }

    }
    //since parsing a local file works asynchronously, a callback function is required to call the remaining functions after the parsing is complete
    callbackForLocalFile(csvMatrixLocal){
        this.csvMatrix=csvMatrixLocal;
        this.csvHeaders=this.determineHeaders();
        this.completeCsvMatrix=this.matrixForCompleteData();
        var totalData=this.extractSampleData();
        this.csvSampleData=totalData[0];
        this.csvValidForYAxis=totalData[1];
        this.completeCsvMatrixTranspose=this.createTranspose();
        this.codapHeaders=this.headersForCodap();
        this.codapMatrix=this.completeMatrixForCodap();
        this.startFileProcessing();
    }
    //a function handler that calls one function after the other after assigning the correct values to different class variables.
    allFunctionHandler(functionParameter){
            if (functionParameter=="local"){
                this.csvMatrix=this.parse();
            }
            else{
                if (functionParameter=="csvstring" || functionParameter=="remote"){
                    this.csvFile=this.csvFile.split("\n");
                    this.csvMatrix=this.parseString();
                    this.csvHeaders=this.determineHeaders();
                    this.completeCsvMatrix=this.matrixForCompleteData();
                }
                else{
                    this.csvHeaders=this.headersForGoogleSheet();
                    this.completeCsvMatrix=this.completeMatrixForGoogleSheet();
                }
                var totalData=this.extractSampleData();
                this.csvSampleData=totalData[0];
                this.csvValidForYAxis=totalData[1];
                this.completeCsvMatrixTranspose=this.createTranspose();
                this.codapHeaders=this.headersForCodap();
                this.codapMatrix=this.completeMatrixForCodap();
                this.startFileProcessing();
            }

    }
     //parsing a local file, works asynchronously
    parse(){
        var csvMatrixLocal=[];
        var count = 0;
        var f=this.parseReturn;
        Papa.parse(this.csvFile, {
            download: true,
            dynamicTyping: true,
            comments: true,
            step: (row) => {
                csvMatrixLocal[count] = row.data[0];
                count += 1;
            },
            complete: () => {
                this.callbackForLocalFile(csvMatrixLocal);
                
            }
        });
    }
    // parsing string: for remote and csvString import options. Dat is parsed line by line but NOT asynchronously.
    parseString(){
        var mat=[];
        for (var i=0;i<this.csvFile.length;i++){
            if (this.csvFile[i]=="" || this.csvFile[i]==" "){
            continue;
            }
            var dataHash=Papa.parse(this.csvFile[i],{
            dynamicTyping: true,
            comments: true
            });
            mat[i]=dataHash['data'][0];
        }
        return mat;
    }
    // checks for the presence of the corresponding View object in elementIdSimpleDataGraphInstanceMap, if present, the CsvParser object is assigned to the View object and the flow resumes from View.js file
    startFileProcessing(){
        let self = this;
        if (self.elementId in SimpleDataGrapher.SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap){
            SimpleDataGrapher.SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[self.elementId].view.continueViewManipulation(self);
        }
    }

    //preparing sample data for the user to choose the columns from
    extractSampleData(){
        var maxval=5;
        var csvSampleDataLocal=[];
        var csvValidForYAxisLocal=[];
        var totalDataLocal=[];
        for (var i=0;i<this.csvHeaders.length;i++){
            csvSampleDataLocal[i]=[];
        }
        if (this.completeCsvMatrix.length[0]<5){
            maxval=this.completeCsvMatrix[0].length;
        }
        for (var i=0;i<this.csvHeaders.length;i++){
            var counter=0;

            var bool=false;
            for(var j=0;j<this.completeCsvMatrix[i].length;j++){
                if (counter>=maxval){
                    break;
                }
                else if (this.completeCsvMatrix[i][j]!==null || this.completeCsvMatrix[i][j]!==undefined){
                    if (typeof(this.completeCsvMatrix[i][j])==='number'){
                        bool=true;
                    }
                    counter+=1;
                    csvSampleDataLocal[i].push(this.completeCsvMatrix[i][j]);}
            }
            if (bool){
                csvValidForYAxisLocal.push(this.csvHeaders[i]);
            }
        }
        totalDataLocal=[csvSampleDataLocal,csvValidForYAxisLocal];
        return totalDataLocal;

    }

    //makes a 2D matrix with the transpose of the CSV file, each column having the same index as its column heading
    matrixForCompleteData(){
        var completeCsvMatrixLocal=[];
        for (var i=0;i<this.csvHeaders.length;i++){
            completeCsvMatrixLocal[i]=[];
        }
        for (var i=this.csvFileStart;i<this.csvMatrix.length;i++){
            for(var j=0;j<this.csvHeaders.length;j++){
                completeCsvMatrixLocal[j].push(this.csvMatrix[i][j]);
            }
        }
        return completeCsvMatrixLocal;
    }
    //Google Sheet's data is in a JSON, traversal through the JSON and string manipulation are used to extract the data
    completeMatrixForGoogleSheet(){
        var matrixComplete=[];
        for (var i=0;i<this.csvHeaders.length;i++){
            matrixComplete[i]=[];
        }
        for (var i=0;i<this.csvHeaders.length;i++){
            for (var key in this.csvFile){
                var valueCell=this.csvFile[key][this.csvHeaders[i]]["$t"];
                if (!isNaN(valueCell)){
                    matrixComplete[i].push(+valueCell);}
                else{
                    matrixComplete[i].push(valueCell);
                }
            }
        }
        for (var i=0;i<this.csvHeaders.length;i++){
            this.csvHeaders[i]=this.csvHeaders[i].slice(4,this.csvHeaders[i].length);
        }
       return matrixComplete;
    }
    // matrix in JSON form for CODAP export
    completeMatrixForCodap(){
        var codapMatrix=[];
        for (var i=1;i<this.completeCsvMatrixTranspose.length;i++){
            var element={};
            for (var j=0;j<this.csvHeaders.length;j++){
                element[this.csvHeaders[j]]=this.completeCsvMatrixTranspose[i][j];
            }
            codapMatrix.push(element);
        }
        console.log("matrix codap",codapMatrix);
        return codapMatrix;
    }
    //checks if the first row has most of the potential header names, if not, assign dummy headers to the file.
    determineHeaders(){
        var csvHeadersLocal=[];
        var flag = false;
        for (var i=0;i<this.csvMatrix[0].length;i++){
            if (i==0){
                if (typeof(this.csvMatrix[0][i])=="string"){
                    csvHeadersLocal[i]=this.csvMatrix[0][i];
                }
                else{
                    flag=true;
                    break;
                }
            }
            else{
                if ((typeof(this.csvMatrix[0][i])==typeof(this.csvMatrix[0][i-1]) && typeof(this.csvMatrix[0][i])!='object') || (typeof(this.csvMatrix[0][i])!=typeof(this.csvMatrix[0][i-1]) && csvHeadersLocal[i-1].substring(0,6)=="Column")){
                    csvHeadersLocal[i]=this.csvMatrix[0][i];
                }
                //in case of an unnamed column
                else if(typeof(this.csvMatrix[0][i])=='object'){

                    csvHeadersLocal[i]="Column"+(i+1);
                }
                else{
                    flag = true;
                    break;
                }
            }
        }
        //if there are no headers present, make dummy header names
        if (flag && csvHeadersLocal.length!=this.csvMatrix[0].length){
            this.csvFileStart=0;
            for (var i=0;i<this.csvMatrix[0].length;i++){
                csvHeadersLocal[i]="Column"+(i+1);
            }
        }
        return csvHeadersLocal;
    }
    //Google Sheet's data is in a JSON, extracting column names by string slicing
    headersForGoogleSheet(){
        var headers_sheet=[];
        for (var key in this.csvFile){
            var h=this.csvFile[key];
            for (var headKey in h){
                if (headKey.slice(0,4)=="gsx$"){
                    headers_sheet.push(headKey);
                }
            }
            break;
        }
        return headers_sheet;
    }
    //determine a JSON for headers for CODAP
    headersForCodap(){
        var codapHeaders=[];
        for (var i=0;i<this.csvHeaders.length;i++){
            var element={};
            element["name"]=this.csvHeaders[i];
            codapHeaders.push(element);
        }
        return codapHeaders;
    }
    // creating the transpose of the entire data ie complete data + headers, for createSpreadsheet in View.js
    createTranspose(){
        var completeCsvMatrixTransposeLocal=[];
        for (var i=0;i<=this.completeCsvMatrix[0].length;i++){
            completeCsvMatrixTransposeLocal[i]=[];
        }
        for (var i=0;i<this.completeCsvMatrix.length;i++){
            completeCsvMatrixTransposeLocal[0][i]=this.csvHeaders[i];
        }
        for (var i=0;i<this.completeCsvMatrix.length;i++){
            for (var j=0;j<this.completeCsvMatrix[0].length;j++){
                completeCsvMatrixTransposeLocal[j+1][i]=this.completeCsvMatrix[i][j];
            }
        }
        console.log("transpose",completeCsvMatrixTransposeLocal);
        return completeCsvMatrixTransposeLocal;
    }
};

module.exports = CsvParser;