class SimpleDataGrapher{
    elementId = null;
    view = null;

    constructor(elementId){
        console.log("i am here");
        this.elementId = elementId;
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
        this.drawHTMLView();
        this.addListeners();
    }

    addListeners(){
        console.log("as");
        console.log("#"+this.fileUploadId);
        $("#"+this.fileUploadId).change((e)=>{
            console.log("i am here23");
            this.handleFileSelectlocal(e);
        });

    }

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
                // parse(csv_file_local);
            }

        }
    }

    drawHTMLView(){
        this.element.innerHTML = '<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel"><div class="indicators"><ol class="carousel-indicators"> <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active" id="up"></li> <li data-target="#carouselExampleIndicators" data-slide-to="1"></li> <li data-target="#carouselExampleIndicators" data-slide-to="2"></li></ol></div><div class="carousel-inner"><div class="carousel-item active"><div class="main_container"><div class="container_drag_drop"><span class="btn btn-outline-primary btn-file input_box"><p class="drag_drop_heading" id=' + this.dragDropHeadingId  + '> <u> Choose a csv file </u> or drag & drop it here </p><input type="file" class="csv_file" id=' + this.elementId + "_csv_file"  + ' accept=".csv"></span></div><h6 class="or"><span>OR</span></h6><div class="container_remote_link"><input type="text" class="remote_file text_field" placeholder="url of remote file" ></div><h6 class="or"><span>OR</span></h6><div class="container_csv_string"><textarea class="csv_string text_field" placeholder="Paste a CSV string here" ></textarea></div><div class="upload_button"><button type="button" class="btn btn-primary" id=' + this.uploadButtonId + ' >Upload CSV</button></div></div></div><div class="carousel-item tables"><div class="button_container"><div><input type="checkbox" name="xy" checked data-toggle="toggle" class="xytoggle" data-width="150" data-onstyle="success" data-offstyle="warning" data-height="40"></div><div class="plot_button"><button type="button" class="btn btn-primary" id="plot_graph" >Plot Graph</button></div></div><div class="table_container"><div id="xtable"><table id="tablex" class="table"></table></div><div id="ytable" class="hidden"><table id="tabley" class="table"></table></div><div><table id="graph_menu" class="table table-dark"></table></div></div></div><div class="carousel-item graph"><div class="feature_buttons"><button type="button" class="btn btn-primary" id="update_graph">Update Graph</button><button type="button" class="btn btn-primary" id="save_as_image"> Save as image</button><button type="button" class="btn btn-primary" id="add_graph"> Add Graph</button></div><div id="canvas_container"></div></div></div></div>';
    }
}


class CsvParser{

    constructor(){

    }

}