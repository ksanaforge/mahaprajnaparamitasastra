/*
  
*/
var createMarker=function(classname,tag) {
		var element=document.createElement("SPAN");
		element.className=classname;
		element.innerHTML=tag;
		//element.onclick=onTagClick;
		return element;
}
var markLines=function(doc,from,to){
	var M=doc.findMarks({line:from,ch:0},{line:to,ch:65536});
	M.forEach(function(m){m.clear()});

	for (var i=from;i<to+1;i++) {
		markLine(doc, i ,true);
	}
}
var markAllLine=function(doc){
	var M=doc.getAllMarks();
	for (var i=0;i<M.length;i++) M[i].clear();
	var linecount=doc.lineCount();
	for (var i=0;i<linecount;i++) {
		markLine(doc,i,true);
	}
}

var markLine=function(doc,i, keepold) {
	if (i>doc.lineCount())return;
	var line=doc.getLine(i);
	if (!keepold) { // set to true if all markup already been cleared
		var M=doc.findMarks({line:i,ch:0},{line:i,ch:65536});
		M.forEach(function(m){m.clear()});		
	}


	line.replace(/~(\d+)/g,function(m,pb,idx){
		var element=createMarker("pagebreak",pb);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
			{replacedWith:element});
		element.marker=marker;
	});

	line.replace(/\^([0-9.]+)/g,function(m,m1,idx){
		var element=createMarker("paragraph",m1);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
			{replacedWith:element});
		element.marker=marker;
	});

	line.replace(/#([0-9.]+)/g,function(m,m1,idx){
		var element=createMarker("footnote",m1);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
			{replacedWith:element});
		element.marker=marker;
	});

	line.replace(/\{([^k]+?)\}/g,function(m,m1,idx){
		var marker=doc.markText({line:i,ch:idx+1},{line:i,ch:idx+m.length-1},
			{className:"bold"});
		//hide control code
		doc.markText({line:i,ch:idx},{line:i,ch:idx+1},{className:"hide"});
		doc.markText({line:i,ch:idx+m.length-1},{line:i,ch:idx+m.length},{className:"hide"});
	});
//TODO : deal with cross line kai
	line.replace(/\{k(.+?)k\}/g,function(m,m1,idx){
		var marker=doc.markText({line:i,ch:idx+2},{line:i,ch:idx+m.length-2},
			{className:"kai"});
		//hide control code
		doc.markText({line:i,ch:idx},{line:i,ch:idx+2},{className:"hide"});
		doc.markText({line:i,ch:idx+m.length-2},{line:i,ch:idx+m.length},{className:"hide"});
	});

	line.replace(/@([A-Za-z0-9]+)/g,function(m,m1,idx){
		var element=createMarker("link",m1);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
			{replacedWith:element});
		element.marker=marker;
	});


	line.replace(/%(\d) (.*)/g,function(m,d,title,idx){
		var element=createMarker("kepan",d);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+d.length+1},
			{replacedWith:element});
		element.marker=marker;

		doc.markText({line:i,ch:idx+d.length+2},{line:i,ch:idx+m.length},{className:"kepannode"});
	});

}
module.exports={markAllLine,markLine,markLines};