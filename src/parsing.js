//dynamic table for selecting column for X-Axis
function sampleDataY(sampleData,headers){
	document.getElementById('tabley').innerHTML="";
	var trhead=document.createElement('tr');
	for (var i=0;i<headers.length;i++){
		var td=document.createElement('td');
		var checkbox=document.createElement('input')
		checkbox.type = 'checkbox';
		checkbox.value = headers[i];
		checkbox.name = 'y_axis_column';
		td.appendChild(document.createTextNode(headers[i]));
		td.appendChild(checkbox);
		trhead.appendChild(td);
	}
	document.getElementById('tabley').appendChild(trhead);
	for(var i=0;i<5;i++){
		var tr=document.createElement('tr');
		for(var j=0;j<headers.length;j++){
			var td=document.createElement('td');
			td.appendChild(document.createTextNode(sampleData[j][i]));
			tr.appendChild(td);
		}
		document.getElementById('tabley').appendChild(tr);
	}
	var columns = new Array(); 
	$('input[name=y_axis_column]').click(function() {
		$("input[name=y_axis_column]:checked").each(function(){
		    columns.push($(this).val());
		    var y_axis_column_names=[...new Set(columns)];
			console.log(y_axis_column_names);
		});
	});


}
function sampleDataX(sampleData,headers){
	document.getElementById('tablex').innerHTML="";
	var trhead=document.createElement('tr');
	for (var i=0;i<headers.length;i++){
		var td=document.createElement('td');
		var radio=document.createElement('input')
		radio.type = 'radio';
		radio.value = headers[i];
		radio.name = 'x_axis_column';
		td.appendChild(document.createTextNode(headers[i]));
		td.appendChild(radio);
		trhead.appendChild(td);
	}
	document.getElementById('tablex').appendChild(trhead);
	for(var i=0;i<5;i++){
		var tr=document.createElement('tr');
		for(var j=0;j<headers.length;j++){
			var td=document.createElement('td');
			td.appendChild(document.createTextNode(sampleData[j][i]));
			tr.appendChild(td);
		}
		document.getElementById('tablex').appendChild(tr);
	}
	$('input[name=x_axis_column]').click(function() {
		console.log($('input[name=x_axis_column]:checked').val());
	});



}

//preparing sample data for the user to choose the columns from
function extractSampleData(completeData,headers){
	sampleData=[]
	for (var i=0;i<headers.length;i++){
		sampleData[i]=[];
	}
	for (var i=0;i<headers.length;i++){
		for(var j=0;j<5;j++){
			sampleData[i].push(completeData[i][j]);
		}
	}
	console.log(sampleData);
	sampleDataX(sampleData,headers);
	sampleDataY(sampleData,headers);

}
//makes a 2D matrix with the transpose of the CSV file, each column having the same index as its column heading
function matrixForCompleteData(headers,mat,start){
	completeData=[]
	for (var i=0;i<headers.length;i++){
		completeData[i]=[];
	}
	for (var i=start;i<mat.length;i++){
		for(var j=0;j<headers.length;j++){
			completeData[j].push(mat[i][0][j]);
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
	for (var i=0;i<mat[0][0].length;i++){
		
		if (i==0){
			headers[i]=mat[0][0][i];
		}
		else{
			if (typeof(mat[0][0][i])==typeof(mat[0][0][i-1]) && typeof(mat[0][0][i])!='object'){
				headers[i]=mat[0][0][i];
			}
			else if(typeof(mat[0][0][i])=='object'){
				headers[i]="Column"+(i+1);
			}
			else{
				flag=true;
				break;
			}
		}
	}
	//if there are no headers present, make dummy header names
	if (flag && headers.length!=mat[0][0].length){
		start=0;
		for (var i=0;i<mat[0][0].length;i++){
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
			mat[count]=row.data;
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
	parse(csv_file_local);
}
//reads the input from the text field in which the link of the remote file is included
function handleFileSelectremote(val){
	var csv_file_remote = val;
	parse(csv_file_remote);
}
//this triggers handleFileSelectLocal function whenever a file is uploaded in the field
$(document).ready(function(){
	$(".csv_file").change(handleFileSelectlocal);
});