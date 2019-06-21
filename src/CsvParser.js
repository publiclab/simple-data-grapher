import {SimpleDataGrapher} from "./SimpleDataGrapher";

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

    constructor(file, elementId, functionParameter){
        this.elementId = elementId;
        if (functionParameter=="local"){
            this.csvFile = file;
            this.parse(functionParameter);
        }
        else if (functionParameter=="csvstring" || functionParameter=="remote"){
            this.csvFile=file;
            this.parseString(functionParameter);
        }
        else if (functionParameter=="googleSheet"){
            this.csvFile = file;
            this.startFileProcessing(functionParameter);
        }
    }

    parse(functionParameter){
        var count = 0;
        Papa.parse(this.csvFile, {
            download: true,
            dynamicTyping: true,
            comments: true,
            step: (row) => {
                this.csvMatrix[count] = row.data[0];
                count += 1;
            },
            complete: () => {
                //calling a function to determine headers for columns
                this.startFileProcessing(functionParameter);
            }
        });
    }

    parseString(functionParameter){
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
        this.csvMatrix=mat;
        this.startFileProcessing(functionParameter);
    }

    startFileProcessing(functionParameter){
        if (functionParameter=="local" || functionParameter=="csvstring" || functionParameter=="remote"){
            this.determineHeaders();
            this.matrixForCompleteData();
            this.extractSampleData();
        }
        else if (functionParameter=="googleSheet"){
            this.headersForGoogleSheet();
            this.completeMatrixForGoogleSheet();
            this.extractSampleData();
        }
        this.createTranspose();
        let self = this;
        SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[self.elementId].view.continueViewManipulation(self);
    }

    //preparing sample data for the user to choose the columns from
    extractSampleData(){
        var maxval=5;
        for (var i=0;i<this.csvHeaders.length;i++){
            this.csvSampleData[i]=[];
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
                    this.csvSampleData[i].push(this.completeCsvMatrix[i][j]);}
            }
            if (bool){
                this.csvValidForYAxis.push(this.csvHeaders[i]);
            }
        }
    }

    //makes a 2D matrix with the transpose of the CSV file, each column having the same index as its column heading
    matrixForCompleteData(){
        for (var i=0;i<this.csvHeaders.length;i++){
            this.completeCsvMatrix[i]=[];
        }
        for (var i=this.csvFileStart;i<this.csvMatrix.length;i++){
            for(var j=0;j<this.csvHeaders.length;j++){
                this.completeCsvMatrix[j].push(this.csvMatrix[i][j]);
            }
        }
    }
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
        this.completeCsvMatrix=matrixComplete;
    }

    determineHeaders(){
        var flag = false;
        for (var i=0;i<this.csvMatrix[0].length;i++){
            if (i==0){
                this.csvHeaders[i]=this.csvMatrix[0][i];
            }
            else{
                if (typeof(this.csvMatrix[0][i])==typeof(this.csvMatrix[0][i-1]) && typeof(this.csvMatrix[0][i])!='object'){
                    this.csvHeaders[i]=this.csvMatrix[0][i];
                }
                else if(typeof(this.csvMatrix[0][i])=='object'){

                    this.csvHeaders[i]="Column"+(i+1);
                }
                else{
                    flag = true;
                    break;
                }
            }
        }
        //if there are no headers present, make dummy header names
        if (flag && this.csvHeaders.length!=this.csvMatrix[0].length){
            this.csvFileStart=0;
            for (var i=0;i<this.csvMatrix[0].length;i++){
                this.csvHeaders[i]="Column"+(i+1);
            }
        }
    }
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
        this.csvHeaders=headers_sheet;
    }
    createTranspose(){
        for (var i=0;i<=this.completeCsvMatrix[0].length;i++){
            this.completeCsvMatrixTranspose[i]=[];
        }
        for (var i=0;i<this.completeCsvMatrix.length;i++){
            this.completeCsvMatrixTranspose[0][i]=this.csvHeaders[i];
        }
        for (var i=0;i<this.completeCsvMatrix.length;i++){
            for (var j=0;j<this.completeCsvMatrix[0].length;j++){
                this.completeCsvMatrixTranspose[j+1][i]=this.completeCsvMatrix[i][j];
            }
        }
    }
};

export {CsvParser}