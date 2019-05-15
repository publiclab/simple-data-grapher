function saveAsImage(){
		var x=new Date();
		var timestamp=x.getTime();
		$("#save_as_image").click(function() {
		  $("#canvas").get(0).toBlob(function(blob) {
		    saveAs(blob, "chart"+timestamp);
		  });
		});
}
function determineType(type){
	if (type=="Basic" || type=="Stepped" || type=="Point"){
		console.log("wtf");
		return 'line';
	}
	else if (type=="Horizontal"){
		console.log("did i enter");
		return 'horizontalBar';
	}
	else if (type=="Vertical"){

		return 'bar';
	}
	else{
		return type.toLowerCase();
	}
}
function determineConfig(type){
	if (type=="Basic"){
		return {'fill': false};
	}
	else if (type=="Stepped"){
		return {'steppedLine': true, 'fill': false};
	}
	else if (type=="Point"){
		return {'showLine': false, 'pointRadius': 10};
	}
	else{
		return {};
	}
}
function graphMenu(){
	document.getElementById("graph_menu").innerHTML="";
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
			var radio=document.createElement('input')
			radio.type = 'radio';
			radio.value = types[i][j];
			td.appendChild(document.createTextNode(types[i][j]));
			radio.name = 'types';
			td.appendChild(radio);
			tr.appendChild(td);
		}
		document.getElementById("graph_menu").appendChild(tr);
	}
}
function colorGenerator(i,tb,type,count){
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
function scales(hash){
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
function plotGraph(hash,length,type){
	var config = {};
	config['type']=determineType(type);
	var data={};
	data['labels']=hash['x_axis_labels'];
	var datasets=[];
	for (var i=0;i<length;i++){
		var h=determineConfig(type);
		h['backgroundColor']=colorGenerator(i,"bg",type,hash['y_axis_values'+i].length);
		h['borderColor']=colorGenerator(i,"bo",type,hash['y_axis_values'+i].length);
		h['borderWidth']=1;
		h['label']=hash['labels'][1][i];
		h['data']=hash['y_axis_values'+i];
		datasets.push(h);
	}
	var options={'responsive':true, 'maintainAspectRatio': true, 'chartArea': {
					backgroundColor: 'rgb(204, 102, 255)'
				}};
	options['scales']=scales(hash);
	config['options']=options;
	data['datasets']=datasets;
	config['data']=data;
	document.getElementById('canvas').remove();
	var canv=document.createElement('canvas');
	canv.id="canvas";
	document.getElementById('canvas_container').appendChild(canv);
	var ctx = document.getElementById('canvas').getContext('2d');
	Chart.plugins.register({
	    beforeDraw: function() {
	        ctx.fillStyle = 'white';
	        ctx.fillRect(0, 0, canv.width, canv.height);
	    }
	});
	window.myLine = new Chart(ctx, config);
	$('.carousel').carousel(2);
	saveAsImage();
}
function afterSampleData(sampleData,headers){
	document.getElementById("plot_graph").onclick = function(e){
		e.preventDefault();
		var hash={};
		var ix=$('input[name=x_axis_column]:checked').val();
		hash["x_axis_labels"]=sampleData[ix];
		var columns = new Array(); 
		var y_axis_names = new Array();
		$("input:checkbox[name=y_axis_column]:checked").each(function(){
		    columns.push($(this).val());
		 });
		for(var i=0;i<columns.length;i++){
			hash["y_axis_values"+(i)]=sampleData[columns[i]];
			y_axis_names.push(headers[columns[i]]);
		}
		var labels=[headers[ix],y_axis_names];
		hash["labels"]=labels;
		var type=$('input[name=types]:checked').val();
		console.log(hash);
		plotGraph(hash,columns.length,type);

	};

}
function tableGenerator(sampleData,headers,name,tableName,typeOfInput,validValues){
	document.getElementById(tableName).innerHTML="";
	var trhead=document.createElement('tr');
	for (var i=0;i<headers.length;i++){
		var td=document.createElement('td');
		td.appendChild(document.createTextNode(headers[i]));
		for (var j=0;j<validValues.length;j++){
			if (validValues[j]==headers[i]){
			var checkbox=document.createElement('input')
			checkbox.type = typeOfInput;
			checkbox.value = i;
			checkbox.name = name;
			td.appendChild(checkbox);}
		}
		trhead.appendChild(td);
	}
	document.getElementById(tableName).appendChild(trhead);
	for(var i=0;i<5;i++){
		var tr=document.createElement('tr');
		for(var j=0;j<headers.length;j++){
			var td=document.createElement('td');
			td.appendChild(document.createTextNode(sampleData[j][i]));
			tr.appendChild(td);
		}
		document.getElementById(tableName).appendChild(tr);
	}
	afterSampleData(sampleData,headers);


}
function sampleDataXandY(sampleData,headers,validForYAxis){
	tableGenerator(sampleData,headers,'x_axis_column','tablex','radio',headers);
	tableGenerator(sampleData,headers,'y_axis_column','tabley','checkbox',validForYAxis);
	graphMenu();

}
//preparing sample data for the user to choose the columns from
function extractSampleData(completeData,headers){
	var sampleData=[];
	var validForYAxis=[];
	for (var i=0;i<headers.length;i++){
		sampleData[i]=[];
	}
	for (var i=0;i<headers.length;i++){
		var counter=0;
		var bool=false;
		for(var j=0;j<completeData[i].length;j++){
			if (counter>=5){
				break;
			}
			else if (completeData[i][j]!=null || completeData[i][j]!=undefined){
				if (typeof(completeData[i][j])=='number'){
					bool=true;
				}
				counter+=1;
				sampleData[i].push(completeData[i][j]);}
		}
		if (bool){
			validForYAxis.push(headers[i]);
		}
	}
	console.log(sampleData);
	console.log(validForYAxis);
	sampleDataXandY(sampleData,headers,validForYAxis);

}
//makes a 2D matrix with the transpose of the CSV file, each column having the same index as its column heading
function matrixForCompleteData(headers,mat,start){
	var completeData=[];
	for (var i=0;i<headers.length;i++){
		completeData[i]=[];
	}
	for (var i=start;i<mat.length;i++){
		for(var j=0;j<headers.length;j++){
			completeData[j].push(mat[i][j]);
		}
	}
	console.log(completeData);
	extractSampleData(completeData,headers);

}

//determines headers for columns
function determineHeaders(mat){
	var headers=[]
	var flag=false;
	var start=1; //start is variable that will be passed to the function to sort out the columns. start will tell if the existing CSV file has headers or not, therefore, to start the iteration from 0 or 1
	for (var i=0;i<mat[0].length;i++){
		
		if (i==0){
			headers[i]=mat[0][i];
		}
		else{
			if (typeof(mat[0][i])==typeof(mat[0][i-1]) && typeof(mat[0][i])!='object'){
				headers[i]=mat[0][i];
			}
			else if(typeof(mat[0][i])=='object'){
				headers[i]="Column"+(i+1);
			}
			else{
				flag=true;
				break;
			}
		}
	}
	//if there are no headers present, make dummy header names
	if (flag && headers.length!=mat[0].length){
		start=0;
		for (var i=0;i<mat[0].length;i++){
			headers[i]="Column"+(i+1);
		}
	}
	console.log(headers);
	matrixForCompleteData(headers,mat,start);

	

}
//using papaparse, parsing the retrieved file
function parse(file){
	var mat=[];
	var count=0;
	Papa.parse(file, {
		download: true,
		dynamicTyping: true,
		comments: true,
		step: function(row) {
			mat[count]=row.data[0];
			count+=1;
		},
		complete: function() {
			console.log(mat);
			$('.carousel').carousel(1);
			//calling a function to determine headers for columns
			determineHeaders(mat);
		}
	});

	
	
}
//extracts the file uploaded in the field
function handleFileSelectlocal(evt) {
	var csv_file_local = evt.target.files[0];
	if 	(csv_file_local['name'].split(".")[1]!="csv"){
		alert("Invalid file type");
	}
	else{
		$('.drag_drop_heading').text(csv_file_local['name']);
		document.getElementById("upload").onclick = function(e){
			parse(csv_file_local);
		}

	}
}
//reads the input from the text field in which the link of the remote file is included
function handleFileSelectremote(val){
	var csv_file_remote = val;
	document.getElementById("upload").onclick = function(e){
		parse(csv_file_remote);
	}
}
//this triggers handleFileSelectLocal function whenever a file is uploaded in the field
$(document).ready(function(){

	$(".csv_file").change(handleFileSelectlocal);
	$(".remote_file").on('change',function(){
		handleFileSelectremote(this.value);
	});

});
$('.carousel').carousel({
    interval: false
});
$('.xytoggle').bootstrapToggle({
	on: 'X-Axis',
  	off: 'Y-Axis'
});

document.getElementById("update_graph").onclick = function(e){
	$('.carousel').carousel(1);
}
$('input[name=xy]:checked').change(function(){
	var ixy=$('input[name=xy]:checked').val();
	var ixx=0;
	if (ixy==undefined){
		ixx=1;
	}
	$('#xtable').toggle( ixx===0);
	$('#ytable').toggle( ixx===1);
});