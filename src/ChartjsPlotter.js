class ChartjsPlotter{
    'use strict';
    dataHash={};
    elementId =null;
    graphCounting = 0;
    canvasContainerId = null;
    graphType=null;
    length=0;
    flag=false;

    determineType(){
        console.log("at type");
        if (this.graphType=="Basic" || this.graphType=="Stepped" || this.graphType=="Point"){
            return 'line';
        }
        else if (this.graphType=="Horizontal"){
            return 'horizontalBar';
        }
        else if (this.graphType=="Vertical"){

            return 'bar';
        }
        else{
            return this.graphType.toLowerCase();
        }
    }

    colorGenerator(i,tb,count){
        console.log("at color");
        var colors=['rgba(255, 77, 210, 0.5)','rgba(0, 204, 255, 0.5)','rgba(128, 0, 255, 0.5)','rgba(255, 77, 77, 0.5)','rgba(0, 179, 0, 0.5)','rgba(255, 255, 0, 0.5)','rgba(255, 0, 102, 0.5)','rgba(0, 115, 230, 0.5)'];
        var bordercolors=['rgb(255, 0, 191)','rgb(0, 184, 230)','rgb(115, 0, 230)','rgb(255, 51, 51)','rgb(0, 153, 0)','rgb(230, 230, 0)','rgb(230, 0, 92)','rgb(0, 102, 204)'];
        var length=8;
        if (this.graphType=="Pie" || this.graphType=="Doughnut"){
            var colorSet=[];
            var borderColorSet=[];
            for (var j=0;j<count;j++){
                colorSet.push(colors[j%length]);
                borderColorSet.push(bordercolors[j%length]);
            }
            if (tb=="bg"){
                return colorSet;
            }
            else{
                return borderColorSet;
            }
        }
        else{
            if (tb=="bg"){
                return colors[i%length];
            }
            else{
                return bordercolors[i%length];
            }
        }
    }

    determineData(i){
        console.log("at data");
        var h = {};
        if (this.graphType=="Basic"){
            h['fill'] = false;
        }
        else if (this.graphType=="Stepped"){
            h['steppedLine']= true;
            h['fill']= false;
        }
        else if (this.graphType=="Point"){
            h['showLine']= false;
            h['pointRadius']= 10;
        }
        h['backgroundColor']=this.colorGenerator(i,"bg",this.dataHash['y_axis_values'+i].length);
        h['borderColor']=this.colorGenerator(i,"bo",this.dataHash['y_axis_values'+i].length);
        h['borderWidth']=1;
        h['label']=this.dataHash['labels'][1][i];
        h['data']=this.dataHash['y_axis_values'+i];
        return h;
    }

    determineConfig(){
        console.log("at config");
        var config = {};
        config['type'] = this.determineType();
        var data={};
        data['labels']= this.dataHash['x_axis_labels'];
        var datasets=[];
        for (var i=0;i<this.length;i++){
            var h = this.determineData(i);
            datasets.push(h);
        }
        var options={'responsive':true, 'maintainAspectRatio': true, 'chartArea': {
                backgroundColor: 'rgb(204, 102, 255)'
            }};
        options['scales']= this.scales();
        config['options']=options;
        data['datasets']=datasets;
        config['data']=data;
        return config;
    }

    scales(){
        console.log("at scales");
        var scales= {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: this.dataHash['labels'][0]
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                }
            }]
        }
        return scales;
    }
    saveAsImageFunction(canvId){
        console.log("entered image");
        var newDate=new Date();
        var timestamp=newDate.getTime();
        var temp=canvId;
        temp="#"+temp;
        $(temp).get(0).toBlob(function(blob) {
            saveAs(blob, "chart"+timestamp);
        });

    }
    createSaveAsImageButton(canvasDiv,canvasId){
        var saveImageButton=document.createElement("BUTTON");
        saveImageButton.classList.add("btn");
        saveImageButton.classList.add("btn-primary");
        saveImageButton.innerHTML="Save as Image";
        saveImageButton.id=canvasId+"image";
        canvasDiv.appendChild(saveImageButton);
        console.log(this,"this");
        let self=this;
        document.getElementById(saveImageButton.id).onclick = (e) => {
            self.saveAsImageFunction(canvasId);
        }
    }
    plotGraph(){
        if (this.flag){
            console.log("at plotGraph");
            document.getElementById(this.canvasContainerId).innerHTML="";
        }
        var div = document.createElement('div');
        div.classList.add(this.elementId + '_chart_container_'+this.graphCounting);
        var canv = document.createElement('canvas');
        canv.id= this.elementId + '_canvas_'+ this.graphCounting;
        div.appendChild(canv);
        document.getElementById(this.canvasContainerId).appendChild(div);
        var ctx = canv.getContext('2d');
        var configuration = this.determineConfig();
        new Chart(ctx, configuration);
        this.createSaveAsImageButton(div,canv.id);
        // $('.'+this.carousalClass).carousel(2);
    }
    constructor(hash,length,type,flag,canvasContainerId,elementId,graphCounting){
        this.dataHash=hash;
        this.length=length;
        this.graphType=type;
        this.flag=flag;
        this.canvasContainerId=canvasContainerId;
        this.elementId=elementId;
        this.graphCounting=graphCounting;
        this.plotGraph();
    }
}
module.exports=ChartjsPlotter;