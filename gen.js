/* convert txt format from mpps_lecture */

var fs=require("fs");
var callback="loadscriptcb";
var jin=fs.readFileSync("../mpps_lecture/jin.txt","utf8");
var lun=fs.readFileSync("../mpps_lecture/lun.txt","utf8");
var ndef=fs.readFileSync("../mpps_lecture/ndef.txt","utf8");
var kepan=fs.readFileSync("../mpps_lecture/kepan.txt","utf8").split("\n");


jin=callback+"(`"+jin+"`)";
lun=callback+"(`"+lun+"`)";

var convertNdef=function(lines){
	var arr=[], out={},juan=0,lastnoteid="",lastnote="",lastjuan="",stop=false;
	for (var i=0;i<lines.length;i++) {
		line=lines[i];
		var m=line.match(/#(\d+)\.(\d+)/);
		if (m) {
			if (lastnoteid) {
				out[lastnoteid.trim()]=lastnote;
				lastnote=line.substr(m[0].length);
			}
			if (lastjuan!==m[1] && parseInt(lastjuan)%10==0) {
				//new batch for every 10 juan
				out[lastnoteid.trim()]=lastnote;
				console.log(lastnoteid)
				arr.push(out);
				out={};
			}
			lastnoteid=m[1]+"."+m[2];
			lastjuan=m[1];
			stop=false;
		} else {
			if (line.substr(0,4)=="----") {
				stop=true; //extra header of each word file
			}
			if (!stop) lastnote+=line;
		}
	}
	arr.push(out);
	return arr;
}

kepan=kepan.map(function(k){
	var r=k.split("\t");
	//depth, text(caption), link(target), f(font)
	var o={d:parseInt(r[0])+1,t:r[1],l:r[2]};
	if (r[3])o.f="DFKai-SB";
	if (r[4])o.l2=r[4];
	return JSON.stringify(o);
})
kepan.unshift(JSON.stringify({d:0,t:"大智度論講義"}));
ndefjsons=convertNdef(ndef.split(/\r?\n/));
fs.writeFileSync("data/jin.js",jin,"utf8");
fs.writeFileSync("data/lun.js",lun,"utf8");
fs.writeFileSync("data/kepan.js",'loadscriptcb(['+kepan.join(",\n")+'\n]);',"utf8");
ndefjsons.map(function(json,idx){
	fs.writeFileSync("data/ndef"+idx+".js",callback+"("+JSON.stringify(json,"","" )+")","utf8");	
})


console.log("data file written in data/jin.js data/lun.js and data/ndef?.js");


