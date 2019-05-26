import {SimpleDataGrapher} from "./SimpleDataGrapher";

class CsvParser{

    csvFile = null
    csvMatrix = [];
    csvHeaders = [];
    csvFileStart = 1; //start is variable that will be passed to the function to sort out the columns. start will tell if the existing CSV file has headers or not, therefore, to start the iteration from 0 or 1 Used in header determination
    completeCsvMatrix = [];
    csvSampleData = [];
    csvValidForYAxis = [];
    elementId = null;

    constructor(file, elementId){
        this.csvFile = file;
        this.elementId = elementId;
        this.parse();
    }

    parse(){
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
                this.startFileProcessing();
            }
        });
    }

    startFileProcessing(){
        this.determineHeaders();
        this.matrixForCompleteData();
        this.extractSampleData();
        SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId].view.continueViewManipulation();
    }

    //preparing sample data for the user to choose the columns from
    extractSampleData(){
        for (var i=0;i<this.csvHeaders.length;i++){
            this.csvSampleData[i]=[];
        }
        var maxval=5;
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
                else if (this.completeCsvMatrix[i][j]!=null || this.completeCsvMatrix[i][j]!=undefined){
                    if (typeof(this.completeCsvMatrix[i][j])=='number'){
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
};

export {CsvParser}