class SimpleDataGrapher{
    static elementIdSimpleDataGraphInstanceMap = {};
    elementId = null;
    view = null;

    constructor(elementId){
        console.log("i am here");
        this.elementId = elementId;
        SimpleDataGrapher.elementIdSimpleDataGraphInstanceMap[this.elementId] = this;
        console.log(this.elementId);
        console.log("calling view");
        this.view = new View(elementId);
    }

}

class View{
    elementId = null;
    element = null;
    fileUploadId = null;
    csvFile = null;
    dragDropHeadingId = null;
    uploadButtonId = null;
    csvParser = null;
    graphCounting = 0;
    addGraphButtonId = null;
    tableXId = null;
    tableYId = null;
    tableXInputName = null;
    tableYInputName = null;
    carousalClass = null;
    carousalId = null;
    graphMenuId = null;
    plotGraphId = null;
    graphMenuTypeInputName = null;
    canvasContinerId = null;
    xyToggle = null;
    xyToggleName = null;
    tableXParentId = null;
    tableYParentId = null;
    saveAsImage = null;


    handleFileSelectlocal(event) {
        this.csvFile = event.target.files[0];
        console.log("iam here in handle");
        console.log(this);
        if 	(this.csvFile['name'].split(".")[1]!="csv"){
            alert("Invalid file type");
        }
        else{
            $('#' + this.dragDropHeadingId).text(this.csvFile['name']);
            document.getElementById(this.uploadButtonId).onclick = (e) => {
                console.log("i am uploading");
                console.log(this);
                this.csvParser = new CsvParser(this.csvFile, this.elementId);
            }
        }
    }

    determineType(type){
        console.log("at type");
        console.log(type);
        if (type=="Basic" || type=="Stepped" || type=="Point"){
            return 'line';
        }
        else if (type=="Horizontal"){
            return 'horizontalBar';
        }
        else if (type=="Vertical"){

            return 'bar';
        }
        else{
            return type.toLowerCase();
        }
    }

     colorGenerator(i,tb,type,count){
        console.log("at color");
        var colors=['rgba(255, 77, 210, 0.5)','rgba(0, 204, 255, 0.5)','rgba(128, 0, 255, 0.5)','rgba(255, 77, 77, 0.5)','rgba(0, 179, 0, 0.5)','rgba(255, 255, 0, 0.5)','rgba(255, 0, 102, 0.5)','rgba(0, 115, 230, 0.5)'];
        var bordercolors=['rgb(255, 0, 191)','rgb(0, 184, 230)','rgb(115, 0, 230)','rgb(255, 51, 51)','rgb(0, 153, 0)','rgb(230, 230, 0)','rgb(230, 0, 92)','rgb(0, 102, 204)'];
        var length=8;
        if (type=="Pie" || type=="Doughnut"){
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

    determineData(type,i,hash){
        console.log("at data");
        var h = {};
        if (type=="Basic"){
            h['fill'] = false;
        }
        else if (type=="Stepped"){
            h['steppedLine']= true;
            h['fill']= false;
        }
        else if (type=="Point"){
            h['showLine']= false;
            h['pointRadius']= 10;
        }
        h['backgroundColor']=this.colorGenerator(i,"bg",type,hash['y_axis_values'+i].length);
        h['borderColor']=this.colorGenerator(i,"bo",type,hash['y_axis_values'+i].length);
        h['borderWidth']=1;
        h['label']=hash['labels'][1][i];
        h['data']=hash['y_axis_values'+i];
        return h;
    }

    determineConfig(hash,length,type){
        console.log("at config");
        var config = {};
        config['type'] = this.determineType(type);
        var data={};
        data['labels']= hash['x_axis_labels'];
        var datasets=[];
        for (var i=0;i<length;i++){
            var h = this.determineData(type,i,hash);
            datasets.push(h);
        }
        var options={'responsive':true, 'maintainAspectRatio': true, 'chartArea': {
                backgroundColor: 'rgb(204, 102, 255)'
            }};
        options['scales']= this.scales(hash);
        config['options']=options;
        data['datasets']=datasets;
        config['data']=data;
        return config;
    }

    scales(hash){
        console.log("at scales");
        var scales= {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: hash['labels'][0]
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

    plotGraph(hash,length,type,flag){
        if (flag){
            console.log("at plotGraph");
            document.getElementById(this.canvasContinerId).innerHTML="";
        }
        var div = document.createElement('div');
        div.classList.add(this.elementId + '_chart_container_'+this.graphCounting);
        var canv = document.createElement('canvas');
        canv.id= this.elementId + '_canvas_'+ this.graphCounting;
        div.appendChild(canv);
        document.getElementById(this.canvasContinerId).appendChild(div);
        var ctx = canv.getContext('2d');
        var configuration = this.determineConfig(hash,length,type);
        new Chart(ctx, configuration);
        $('.'+this.carousalClass).carousel(2);
        // saveAsImage();
        // new RangeSliderChart({

        // 	chartData: config, //The same data you give to Chart.js
        // 	chartOpts: options, //Your Chart.js options
        // 	chartType: type, //Which Chart.js chart you want (eg. Lie, Bar, Pie, etc.)
        // 	chartCTX: ctx, //your canvas context

        // 	class: 'my-chart-ranger', //Specifies a custom class you want applied to your sliders

        // 	initial: [3, 10] //Which data points to start the sliders on
        // })
    }

    afterSampleData(flag){
        console.log("at checkbox");
        console.log(this.csvParser.completeCsvMatrix);
        document.getElementById(this.plotGraphId).onclick = (e) => {
            console.log("at click on plot_graph");
            e.preventDefault();
            var hash={};
            var ix=$('input[name=' + this.tableXInputName + ']:checked').val();
            console.log(ix);
            hash["x_axis_labels"]=this.csvParser.completeCsvMatrix[ix];
            var columns = new Array();
            var y_axis_names = new Array();
            $("input:checkbox[name=" + this.tableYInputName +"]:checked").each((index, element)=>{
                columns.push(element.value);
            });
            for(var i=0;i<columns.length;i++){
                hash["y_axis_values"+(i)]=this.csvParser.completeCsvMatrix[columns[i]];
                y_axis_names.push(this.csvParser.csvHeaders[columns[i]]);
            }
            var labels=[this.csvParser.csvHeaders[ix],y_axis_names];
            hash["labels"]=labels;
            var type=$('input[name='+ this.graphMenuTypeInputName +']:checked').val();
            console.log(hash);
            this.plotGraph(hash,columns.length,type,flag);

        };
    }

    graphMenu(){
        console.log("at menu");
        document.getElementById(this.graphMenuId).innerHTML="";
        var bar=["Bar","Horizontal","Vertical"];
        var line=["Line","Basic","Stepped","Point"];
        var disc=["Disc","Pie","Doughnut","Radar"];
        var types=[bar,line,disc];
        for (var i=0;i<3;i++){
            var tr=document.createElement('tr');
            var td_head=document.createElement('td');
            td_head.className=types[i][0];
            td_head.appendChild(document.createTextNode(types[i][0]));
            tr.appendChild(td_head);
            for (var j=1;j<types[i].length;j++){
                var td=document.createElement('td');
                var radio=document.createElement('input');
                radio.type = 'radio';
                radio.value = types[i][j];
                td.appendChild(document.createTextNode(types[i][j]));
                radio.name = this.graphMenuTypeInputName;
                td.appendChild(radio);
                tr.appendChild(td);
            }
            document.getElementById(this.graphMenuId).appendChild(tr);
        }
    }



    tableGenerator(name,tableId,typeOfInput,validValues,flag,tableType,badgeType){
        console.log("i am in tablegenerator");
        console.log("at tableGenerator");
        document.getElementById(tableId).innerHTML="";
        var trhead=document.createElement('tr');
        for (var i=0;i<this.csvParser.csvHeaders.length;i++){
            var td=document.createElement('td');
            var span=document.createElement('span');
            var textnode=document.createTextNode(this.csvParser.csvHeaders[i]);
            span.appendChild(textnode);
            span.classList.add("badge");
            span.classList.add("badge-pill");
            span.classList.add(badgeType);
            td.appendChild(span);
            for (var j=0;j<validValues.length;j++){
                if (validValues[j]==this.csvParser.csvHeaders[i]){
                    var checkbox=document.createElement('input')
                    checkbox.type = typeOfInput;
                    checkbox.value = i;
                    checkbox.name = name;
                    checkbox.classList.add("check-inputs");
                    span.appendChild(checkbox);}
            }
            trhead.appendChild(td);
        }
        trhead.classList.add(tableType);
        document.getElementById(tableId).appendChild(trhead);
        for(var i=0;i<this.csvParser.csvSampleData[0].length;i++){
            var tr=document.createElement('tr');
            for(var j=0;j<this.csvParser.csvHeaders.length;j++){
                var td=document.createElement('td');
                td.appendChild(document.createTextNode(this.csvParser.csvSampleData[j][i]));
                tr.appendChild(td);
            }
            document.getElementById(tableId).appendChild(tr);
        }
        this.afterSampleData(flag);
    }

    showSampleDataXandY(){
        console.log("at sampleDataXandY");
        document.getElementById(this.addGraphButtonId).onclick = (e) => {
            console.log("at " + this.addGraphButtonId);
            this.graphCounting++;
            $('.'+this.carousalClass).carousel(1); /// ---------------> after
            this.tableGenerator(this.tableXInputName, this.tableXId, 'radio', this.csvParser.csvHeaders, false, 'table-success','badge-success');
            this.tableGenerator(this.tableYInputName, this.tableYId, 'checkbox', this.csvParser.csvValidForYAxis, false, 'table-warning','badge-warning');
            this.graphMenu();

        };
        this.tableGenerator(this.tableXInputName, this.tableXId, 'radio', this.csvParser.csvHeaders, true, 'table-success','badge-success');
        this.tableGenerator(this.tableYInputName, this.tableYId, 'checkbox', this.csvParser.csvValidForYAxis, true, 'table-warning','badge-warning');
        this.graphMenu();
    }

    continueViewManipulation(){
        console.log(" i am back in view manipulation");
        this.showSampleDataXandY();
        // this.showSampleDataXandY(this.csvParser.csvSampleData, this.csvParser.csvHeaders, this.csvParser.csvValidForYAxis, this.csvParser.csvSampleData);
        // sampleDataXandY(this.csvSampleData,this.csvHeaders,this.csvValidForYAxis,this.completeCsvMatrix);
        // matrixForCompleteData(headers,this.csvMatrix,start);
    }

    constructor(elementId){
        console.log("i am in view");
        this.elementId = elementId;
        this.element = document.getElementById(elementId);
        if(this.element == null){
            throw "No element exist with this id";
        }
        console.log("i am in view");
        this.fileUploadId = elementId + "_csv_file";
        this.dragDropHeadingId = elementId + "_drag_drop_heading";
        this.uploadButtonId = elementId + "_file_upload_button";
        this.addGraphButtonId = elementId + "_add_graph";
        this.tableXId = elementId + "_tableX";
        this.tableYId = elementId + "_tableY";
        this.tableXParentId = elementId + "_Xtable";
        this.tableYParentId = elementId + "_Ytable";
        this.tableXInputName = elementId + "_x_axis_input_columns";
        this.tableYInputName = elementId + "_y_axis_input_columns";
        this.carousalClass = elementId + "_carousal";
        this.carousalId = elementId + "_carousalId";
        this.graphMenuId = elementId + "_graph_menu";
        this.plotGraphId = elementId + "_plot_graph";
        this.graphMenuTypeInputName = elementId + "_types";
        this.canvasContinerId = elementId + "_canvas_container";
        this.xyToggleName = elementId + "_xytoggle";
        this.saveAsImageId = elementId + "save-as-image";
        this.drawHTMLView();
        this.addListeners();
        $('.' + this.carousalClass).carousel({
            interval: false
        });
        $('.xytoggle').bootstrapToggle({
            on: 'X-Axis',
            off: 'Y-Axis'
        });
        $('input[name=' + this.xyToggleName +']:checked').change(()=>{
            var ixy=$('input[name='+ this.xyToggleName +']:checked').val();
            var ixx=0;
            if (ixy==undefined){
                ixx=1;
            }
            $('#'+ this.tableXParentId ).toggle( ixx===0);
            $('#' + this.tableYParentId).toggle( ixx===1);
        });
    }

    addListeners(){
        console.log("as");
        console.log("#"+this.fileUploadId);
        $("#"+this.fileUploadId).change((e)=>{
            console.log("i am here23");
            this.handleFileSelectlocal(e);
        });

    }



    drawHTMLView(){
        this.element.innerHTML = '<div id=' + this.carousalId + ' class="carousel ' + this.carousalClass + ' slide" data-ride="carousel"><div class="indicators"><ol class="carousel-indicators"> <li data-target="#'+this.carousalId +'" data-slide-to="0" class="active" id="up"></li> <li data-target="#'+this.carousalId +'" data-slide-to="1"></li> <li data-target="#'+this.carousalId +'" data-slide-to="2"></li></ol></div><div class="carousel-inner"><div class="carousel-item active"><div class="main_container"><div class="container_drag_drop"><span class="btn btn-outline-primary btn-file input_box"><p class="drag_drop_heading" id=' + this.dragDropHeadingId  + '> <u> Choose a csv file </u> or drag & drop it here </p><input type="file" class="csv_file" id=' + this.elementId + "_csv_file"  + ' accept=".csv"></span></div><h6 class="or"><span>OR</span></h6><div class="container_remote_link"><input type="text" class="remote_file text_field" placeholder="url of remote file" ></div><h6 class="or"><span>OR</span></h6><div class="container_csv_string"><textarea class="csv_string text_field" placeholder="Paste a CSV string here" ></textarea></div><div class="upload_button"><button type="button" class="btn btn-primary" id=' + this.uploadButtonId + ' >Upload CSV</button></div></div></div><div class="carousel-item tables"><div class="button_container"><div><input type="checkbox" name='+ this.xyToggleName +' checked data-toggle="toggle" class="xytoggle" data-width="150" data-onstyle="success" data-offstyle="warning" data-height="40"></div><div class="plot_button"><button type="button" class="btn btn-primary" id='+ this.plotGraphId + ' >Plot Graph</button></div></div><div class="table_container"><div id='+ this.tableXParentId +' ><table id=' + this.tableXId + ' class="table"></table></div><div id='+ this.tableYParentId +' class="hidden"><table id='+ this.tableYId +' class="table"></table></div><div><table id='+ this.graphMenuId + ' class="table table-dark"></table></div></div></div><div class="carousel-item graph"><div class="feature_buttons"><button type="button" class="btn btn-primary" id="update_graph">Update Graph</button><button type="button" class="btn btn-primary" id="save_as_image"> Save as image</button><button type="button" class="btn btn-primary" id=' + this.addGraphButtonId + '> Add Graph</button></div><div id='+ this.canvasContinerId +' ></div></div></div></div>';
    }
}


class CsvParser{

    csvFile = null;
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
                console.log(this.csvMatrix);
                //calling a function to determine headers for columns
                this.startFileProcessing();
            }
        });
    }

    startFileProcessing(){
        this.determineHeaders();
        this.matrixForCompleteData();
        this.extractSampleData();
        console.log("in processing");
        console.log(this.completeCsvMatrix);
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
        console.log(this.csvSampleData,"sampleData");
        console.log(this.csvValidForYAxis);
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
        console.log(this.completeCsvMatrix,"completeData");
        // extractSampleData(completeData,headers);

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
        console.log(this.csvHeaders);
    }
}