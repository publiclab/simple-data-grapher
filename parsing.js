//determines headers for columns
function determineHeaders(mat){
	var headers=[]
	var flag=false;
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
		for (var i=0;i<mat[0][0].length;i++){
			headers[i]="Column"+(i+1);
		}
	}
	console.log(headers);

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