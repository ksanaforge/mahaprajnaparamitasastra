/*
  
*/
var actionhandler=null;
var notepat=/#([0-9.]+)/g;
var parapat=/\^([0-9.]+)/g;
var linkpat=/@([A-Za-z0-9]+)/g;
var kepanpat=/%(\d+) (.*)/g;
var boldpat=/\{([^k]+?)\}/g;
var kaipat=/\{k(.+?)k\}/g
var pgpat=/~(\d+)/g;
var taishotext=/t(\d+)p(\d+)([a-c])?/
var onTagClick=function(e){
	var cls=e.target.className;  
	if (cls==="paragraph") {
		actionhandler("gopara",e.target.innerHTML);
	} else if (cls==="link") {
		var m=e.target.innerHTML.match(taishotext);
		if (m) {
			var vol=m[1],pg=m[2],col=m[3];
			window.open("http://www.cbeta.org/cgi-bin/goto.pl?book=T&vol="+vol+"&page="+pg+"&col="+col);
		}
	}
}
var createMarker=function(classname,tag) {
		var element=document.createElement("SPAN");
		element.className=classname;
		element.innerHTML=tag;
		element.onclick=onTagClick;
		return element;
}
var markLines=function(doc,from,to,ndefs){
	var M=doc.findMarks({line:from,ch:0},{line:to,ch:65536});
	M.forEach(function(m){m.clear()});

	for (var i=from;i<to+1;i++) {
		markLine(doc, i ,{keepold:true,ndefs});
	}
}
var markAllLine=function(doc){
	var M=doc.getAllMarks();
	for (var i=0;i<M.length;i++) M[i].clear();
	var linecount=doc.lineCount();
	for (var i=0;i<linecount;i++) {
		markLine(doc,i,{keepold:true});
	}
}
var makeParagraph=function(id) {
	return "^"+id;
}
var getParagraph=function(content){
	var out=[];
	content.replace(parapat,function(m,m1){
		out.push(m1);
	});
	return out;
}
var getNotes=function(line){
	var out=[];
	line.replace(notepat,function(m,m1){
		out.push(m1);
	});
	return out;
}
var getNoteFile=function(note){
	return "ndef"+Math.floor((parseInt(note)-1) / 10);
}
var notewidgets=[];

var markNote=function(doc,i,line,ndefs){
	var notes=[];
	line.replace(notepat,function(m,m1,idx){
		var element=createMarker("footnote",m1);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
			{replacedWith:element});
		element.marker=marker;
		notes.push(m1);
	});
	clearNote();
	for (var j=0;j<notes.length;j++) {
		var suffix="_even";
		if (j%2==1) suffix="_odd";
		var element=createMarker("ndef ndef"+suffix,notes[j]+" "+ndefs[notes[j]]);
		notewidgets.push(doc.addLineWidget(i,element));
	}
}
var clearNote=function(){
	notewidgets.map(function(item){item.clear()});	
}
var markLine=function(doc,i, opts) {
	if (i>doc.lineCount())return;
	if (!opts) opts={};
	var activeline=doc.getCursor().line;
	var line=doc.getLine(i);
	if (!opts.keepold) { // set to true if all markup already been cleared
		var M=doc.findMarks({line:i,ch:0},{line:i,ch:65536});
		M.forEach(function(m){m.clear()});		
	}
	if (i==activeline) {
		line.replace(pgpat,function(m,pb,idx){
			var element=createMarker("pagebreak",pb);
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{replacedWith:element});
			element.marker=marker;
		});
	} else {
		line.replace(/~(\d+)/g,function(m,pb,idx){
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{className:"hide"});
		});
	}

	line.replace(parapat,function(m,m1,idx){
		var element=createMarker("paragraph",m1);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
			{replacedWith:element});
		element.marker=marker;
	});

	if (i==activeline) {
		markNote(doc,i,line,opts.ndefs);
	} else {
		line.replace(notepat,function(m,m1,idx){
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{className:"hide"});
		});		
	}

	line.replace(boldpat,function(m,m1,idx){
		var marker=doc.markText({line:i,ch:idx+1},{line:i,ch:idx+m.length-1},
			{className:"bold"});
		//hide control code
		doc.markText({line:i,ch:idx},{line:i,ch:idx+1},{className:"hide"});
		doc.markText({line:i,ch:idx+m.length-1},{line:i,ch:idx+m.length},{className:"hide"});
	});
//TODO : deal with cross line kai
	line.replace(kaipat,function(m,m1,idx){
		var marker=doc.markText({line:i,ch:idx+2},{line:i,ch:idx+m.length-2},
			{className:"kai"});
		//hide control code
		doc.markText({line:i,ch:idx},{line:i,ch:idx+2},{className:"hide"});
		doc.markText({line:i,ch:idx+m.length-2},{line:i,ch:idx+m.length},{className:"hide"});
	});
	if (i==activeline) {
		line.replace(linkpat,function(m,m1,idx){
			var element=createMarker("link",m1);
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{replacedWith:element});
			element.marker=marker;
		});
	} else {
		line.replace(linkpat,function(m,m1,idx){
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{className:"hide"});
		});
	}


	line.replace(kepanpat,function(m,d,title,idx){
		var element=createMarker("kepan",d);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+d.length+1},
			{replacedWith:element});
		element.marker=marker;

		doc.markText({line:i,ch:idx+d.length+2},{line:i,ch:idx+m.length},{className:"kepannode"});
	});

}

var setActionHandler=function(_actionhandler){
	actionhandler=_actionhandler;
}
module.exports={markAllLine,markLine,markLines
	,clearNote,getNotes,getNoteFile
	,getParagraph,makeParagraph
	,setActionHandler};