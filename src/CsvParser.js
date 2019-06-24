import {SimpleDataGrapher} from "./SimpleDataGrapher";
import Papa from 'papaparse'

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
            this.csvMatrix=file;
            console.log("csv matrix",this.csvMatrix);
            this.startFileProcessing(functionParameter);
        }
        else if (functionParameter=="googleSheet"){
            console.log(file,"file",file[0],file[1]);
            this.completeCsvMatrix=file[1];
            this.csvHeaders=file[0];
            console.log(this.completeCsvMatrix,this.csvHeaders,"did it");
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

    startFileProcessing(functionParameter){
        if (functionParameter=="local" || functionParameter=="csvstring" || functionParameter=="remote"){
            this.determineHeaders();
            this.matrixForCompleteData();
            this.extractSampleData();
        }
        else if (functionParameter=="googleSheet"){
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
        for (var x=0;x<this.csvHeaders.length;x++){
            var counter=0;

            var bool=false;
            for(var j=0;j<this.completeCsvMatrix[x].length;j++){
                if (counter>=maxval){
                    break;
                }
                else if (this.completeCsvMatrix[x][j]!==null || this.completeCsvMatrix[x][j]!==undefined){
                    if (typeof(this.completeCsvMatrix[x][j])==='number'){
                        bool=true;
                    }
                    counter+=1;
                    this.csvSampleData[x].push(this.completeCsvMatrix[x][j]);}
            }
            if (bool){
                this.csvValidForYAxis.push(this.csvHeaders[x]);
            }
        }
    }

    //makes a 2D matrix with the transpose of the CSV file, each column having the same index as its column heading
    matrixForCompleteData(){
        for (var y=0;y<this.csvHeaders.length;y++){
            this.completeCsvMatrix[y]=[];
        }
        for (var v=this.csvFileStart;v<this.csvMatrix.length;v++){
            for(var j=0;j<this.csvHeaders.length;j++){
                this.completeCsvMatrix[j].push(this.csvMatrix[v][j]);
            }
        }
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
            for (var u=0;u<this.csvMatrix[0].length;u++){
                this.csvHeaders[u]="Column"+(u+1);
            }
        }
    }
    createTranspose(){
        for (var i=0;i<=this.completeCsvMatrix[0].length;i++){
            this.completeCsvMatrixTranspose[i]=[];
        }
        for (var v=0;v<this.completeCsvMatrix.length;v++){
            this.completeCsvMatrixTranspose[0][v]=this.csvHeaders[v];
        }
        for (var s=0;s<this.completeCsvMatrix.length;s++){
            for (var j=0;j<this.completeCsvMatrix[0].length;j++){
                this.completeCsvMatrixTranspose[j+1][s]=this.completeCsvMatrix[s][j];
            }
        }
    }
}

export {CsvParser}
