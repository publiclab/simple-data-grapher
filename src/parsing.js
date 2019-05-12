function plotGraph(hash,length){
	var config = {};
	config['type']='line';
	var data={};
	data['labels']=hash['x_axis_labels'];
	var datasets=[];
	for (var i=0;i<length;i++){
		var h={};
		h['label']=hash['labels'][1][i];
		h['data']=hash['y_axis_values'+i];
		datasets.push(h);
	}
	data['datasets']=datasets;
	config['data']=data;

	var ctx = document.getElementById('canvas').getContext('2d');
	window.myLine = new Chart(ctx, config);
}
function afterSampleData(sampleData,headers){
	document.getElementById("upload").onclick = function(e){
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
		console.log(hash);
		plotGraph(hash,columns.length);
	};

}
function tableGenerator(sampleData,headers,name,tableName,typeOfInput){
	document.getElementById(tableName).innerHTML="";
	var trhead=document.createElement('tr');
	for (var i=0;i<headers.length;i++){
		var td=document.createElement('td');
		var checkbox=document.createElement('input')
		checkbox.type = typeOfInput;
		checkbox.value = i;
		checkbox.name = name;
		td.appendChild(document.createTextNode(headers[i]));
		td.appendChild(checkbox);
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
function sampleDataXandY(sampleData,headers){
	tableGenerator(sampleData,headers,'x_axis_column','tablex','radio');
	tableGenerator(sampleData,headers,'y_axis_column','tabley','checkbox');

}

//preparing sample data for the user to choose the columns from
function extractSampleData(completeData,headers){
	sampleData=[];
	for (var i=0;i<headers.length;i++){
		sampleData[i]=[];
	}
	for (var i=0;i<headers.length;i++){
		var counter=0;
		for(var j=0;j<completeData[i].length;j++){
			if (counter>=5){
				break;
			}
			else if (completeData[i][j]!=null || completeData[i][j]!=undefined){
				counter+=1;
				sampleData[i].push(completeData[i][j]);}
		}
	}
	console.log(sampleData);
	sampleDataXandY(sampleData,headers);

}
//makes a 2D matrix with the transpose of the CSV file, each column having the same index as its column heading
function matrixForCompleteData(headers,mat,start){
	completeData=[];
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
		parse(csv_file_local);}
}
//reads the input from the text field in which the link of the remote file is included
function handleFileSelectremote(val){
	var csv_file_remote = val;
	parse(csv_file_remote);
}
//this triggers handleFileSelectLocal function whenever a file is uploaded in the field
$(document).ready(function(){
	$(".csv_file").change(handleFileSelectlocal);
	$(".remote_file").on('change',function(){
		handleFileSelectremote(this.value);
	});
});

