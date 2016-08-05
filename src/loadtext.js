/* jsonp loading text dynamically */
var {action,store,getter,registerGetter}=require("ksana2015-parallel").model;

var datafiles={};
var loadingfilename="";
var loadscriptcb=function(data){
	if (!loadingfilename) {
		throw "not loading any file"
		return;
	}
	datafiles[loadingfilename]=data;
	action("loaded",{filename:loadingfilename,data});
	loadingfilename="";
}
window.loadscriptcb=loadscriptcb;

var loadfile=function(filename){
	if (datafiles[filename]) {
		action("loaded",{filename,data:datafiles[filename]});
	} else {
		loadingfilename=filename;
		var script = document.createElement('script');
		script.src = 'data/'+filename+".js";
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}
registerGetter("file",loadfile);
module.exports=loadfile;