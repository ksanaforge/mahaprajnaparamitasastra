/*
  
*/
var actionhandler=null;
var patterns={
 footnote:/#(\d+\.\d+)/g,
 paragraph:/\^(\d+\.\d+)/g,
 link:/@([A-Za-z0-9]+)/g,
 kepan:/%(\d+\.\d+) (.*)%?/g,
 kepan_seq:/%(\d+\.\d+)/g,
 bold:/\{([^k]+?)\}/g,
 kai:/\{k(.+?)k\}/g,
 pagebreak:/~(\d+)/g,
 taisho:/t(\d+)p(\d+)([a-c]?)/,
 taisho_full:/t(\d+)p(\d+)([a-c])([0-9]+)/,
 yinshun_note:/y([A-Z][0-9]+)p[0-9]+/
}

var onTagClick=function(e){
	var cls=e.target.className;  
	var t=e.target.innerHTML;
	if (cls==="paragraph") {
		actionhandler("gopara",e.target.innerHTML);
	} else if (cls==="link") {
		
		var m=t.match(patterns.taisho);
		if (m) {
			var full=t.match(patterns.taisho_full);
			vol=m[1],pg=m[2],col=m[3],line=1;
			full&&(line=full[4]);
			actionhandler("leavingfrom",makeLink(t));
			var url="http://www.cbeta.org/cgi-bin/goto.pl?book=T&vol="+vol+"&page="+pg+"&col="+col+"&line="+line;
			window.open(url);
		}
		m=e.target.innerHTML.match(patterns.yinshun_note);
		if (m) {
			actionhandler("leavingfrom",makeLink(t));
			var url="http://ya.ksana.tw/mpps_yinshun_note_img/"+m[1][0]+"/"+m[1]+".jpg";
			window.open(url);
		}
	} else if (cls=="kepan") {
		actionhandler("openkepan",t);
	}
}
var hovertimer=null;
var onMouseOver=function(e){
	var cls=e.target.className;
	if (cls==="footnote") {
		var x=e.pageX,y=e.pageY,note=e.target.innerHTML;
		hovertimer=setTimeout(function(){//prevent fly over
			actionhandler("showfootnote",{x,y,note});
		},300);
	}
}
var onMouseOut=function(e){
	clearTimeout(hovertimer);

	var cls=e.target.className;  
	if (cls==="footnote") {
		actionhandler("hidefootnote",{x:e.pageX,y:e.pageY,note:e.target.innerHTML});
	}
}
var createMarker=function(classname,tag) {
		var element=document.createElement("SPAN");
		element.className=classname;
		element.innerHTML=tag;
		element.onclick=onTagClick;
		return element;
}
var createHover=function(classname,tag){
		var element=document.createElement("SPAN");
		element.className=classname;
		element.innerHTML=tag;
		element.onmouseover=onMouseOver;
		element.onmouseout=onMouseOut;
		return element;	
}
var markLines=function(doc,from,to,opts){
	var M=doc.findMarks({line:from,ch:0},{line:to,ch:65536});
	M.forEach(function(m){m.clear()});
	opts.keepold=true;
	for (var i=from;i<to+1;i++) {
		markLine(doc, i ,opts);
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
var makeFootnote=function(id){
	return "#"+id;
}
var makeParagraph=function(id) {
	return "^"+id;
}
var makeKepan=function(id) {
	return "%"+id;
}
var makeLink=function(id){
	return "@"+id
}
var getParagraph=function(content){
	var out=[];
	content.replace(patterns.paragraph,function(m,m1){
		out.push(m1);
	});
	return out;
}
var getNotes=function(line){
	var out=[];
	line.replace(patterns.footnote,function(m,m1){
		out.push(m1);
	});
	return out;
}
var getNoteFile=function(note){
	return "ndef"+Math.floor((parseInt(note)-1) / 10);
}
var notewidgets=[];

var markNote=function(doc,i,line){
	var notes=[];
	line.replace(patterns.footnote,function(m,m1,idx){
		var element=createHover("footnote",m1);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
			{replacedWith:element});
		element.marker=marker;
		notes.push(m1);
	});
	/*
	clearNote();
	for (var j=0;j<notes.length;j++) {
		var suffix="_even";
		if (j%2==1) suffix="_odd";
		var element=createMarker("ndef ndef"+suffix,notes[j]+" "+ndefs[notes[j]]);
		notewidgets.push(doc.addLineWidget(i,element));
	}
	*/
}
/*
var clearNote=function(){
	notewidgets.map(function(item){item.clear()});	
}
*/
var markLine=function(doc,i, opts) {
	if (i>doc.lineCount())return;
	if (!opts) opts={};
	var activeline=doc.getCursor().line;
	var line=doc.getLine(i);
	if (!opts.keepold) { // set to true if all markup already been cleared
		var M=doc.findMarks({line:i,ch:0},{line:i,ch:65536});
		M.forEach(function(m){m.clear()});		
	}
	if (i==activeline || opts.pagebreak) {
		line.replace(patterns.pagebreak,function(m,pb,idx){
			var element=createMarker("pagebreak",pb);
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{replacedWith:element});
			element.marker=marker;
		});
	} else {
		line.replace(patterns.pagebreak,function(m,pb,idx){
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{className:"hide"});
		});
	}

	line.replace(patterns.paragraph,function(m,m1,idx){
		var element=createMarker("paragraph",m1);
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
			{replacedWith:element});
		element.marker=marker;
	});

	if (i==activeline || opts.note) {
		markNote(doc,i,line);
	} else {
		line.replace(patterns.footnote,function(m,m1,idx){
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{className:"hide"});
		});		
	}

	line.replace(patterns.bold,function(m,m1,idx){
		var marker=doc.markText({line:i,ch:idx+1},{line:i,ch:idx+m.length-1},
			{className:"bold"});
		//hide control code
		doc.markText({line:i,ch:idx},{line:i,ch:idx+1},{className:"hide"});
		doc.markText({line:i,ch:idx+m.length-1},{line:i,ch:idx+m.length},{className:"hide"});
	});
//TODO : deal with cross line kai
	line.replace(patterns.kai,function(m,m1,idx){
		var marker=doc.markText({line:i,ch:idx+2},{line:i,ch:idx+m.length-2},
			{className:"kai"});
		//hide control code
		doc.markText({line:i,ch:idx},{line:i,ch:idx+2},{className:"hide"});
		doc.markText({line:i,ch:idx+m.length-2},{line:i,ch:idx+m.length},{className:"hide"});
	});
	if (i==activeline || opts.link) {
		line.replace(patterns.link,function(m,m1,idx){
			var element=createMarker("link",m1);
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{replacedWith:element});
			element.marker=marker;
		});
	} else {
		line.replace(patterns.link,function(m,m1,idx){
			var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+m.length},
				{className:"hide"});
		});
	}

	line.replace(patterns.kepan,function(m,d,title,idx){
			var element=createMarker("kepan",d);

			if (i==activeline){
				var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+d.length+1},
				{replacedWith:element});
				element.marker=marker;
			} else {
				var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+d.length+1},
					{className:"hide"});
			}

			var toci=getTocNodeById(d)||{d:0};
			console.log("kepanlevel"+toc[toci].d)
			doc.markText({line:i,ch:idx+d.length+2},{line:i,ch:idx+m.length},
				{className:"kepanlevel kepanlevel"+toc[toci].d});
	});		

}
var getCiteFrom=function(text,position){
	var t=text.substring(0,position);
	var p=t.lastIndexOf("~");
	var page=0;
	if (p>-1) {
		page=parseInt(t.substr(p+1));
	}

	return "《大智度論講義》"+(page?"第"+page+"頁":"");
}
var excerptCopy=function(selected,text,position){
	var citefrom=getCiteFrom(text,position);
	return "「"+selected.replace(patterns.footnote,"")
	.replace(/\{k/g,"").replace(/k\}/g,"")
	.replace(/\}/g,"").replace(/\}/g,"")
	.replace(patterns.link,"")
	.replace(patterns.kepan_seq,"")
	.replace(patterns.pagebreak,"")+"」"+citefrom;

}
var setActionHandler=function(_actionhandler){
	actionhandler=_actionhandler;
}
var toc=null;
var tocindex=[];//group name, starting, ending
var buildTocIndex=function(toc){
	var prevgroup=0,groupstart=0;
	tocindex=[];
	for (var i=0;i<toc.length;i++) {
		var T=toc[i];
		if (!T.l)continue;
		var at=T.l.indexOf(".");
		var group=parseInt(T.l.substr(0,at));
		if (prevgroup && group!==prevgroup){
			tocindex[prevgroup]=[groupstart,i];
			groupstart=i;
		}
		prevgroup=group;
	}
	tocindex[prevgroup]=[groupstart,toc.length];
}
var setToc=function(_toc){
	if (toc!==_toc) buildTocIndex(_toc);
	toc=_toc;
}
var getTocNodeById=function(id){
	var group=parseInt(id);
	if (!tocindex[group])return null;
	var g=tocindex[group];
	for (var i=g[0] ;i<g[1];i++) {
		if (toc[i].l==id) return i;
	}
	return null;
}
module.exports={markAllLine,markLine,markLines
	,getNotes,getNoteFile
	,excerptCopy
	,getParagraph,makeParagraph,makeKepan,makeFootnote
	,patterns
	,setToc
	,getTocNodeById
	,setActionHandler};