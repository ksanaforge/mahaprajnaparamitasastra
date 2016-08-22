(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\ksana2015\\mahaprajnaparamitasastra\\index.js":[function(require,module,exports){
var React=require("react");
var ReactDOM=require("react-dom");
require("ksana2015-webruntime/livereload")(); 
var ksanagap=require("ksana2015-webruntime/ksanagap");
ksanagap.boot("mahaprajnaparamitasastra",function(){
	var Main=React.createElement(require("./src/main.jsx"));
	ksana.mainComponent=ReactDOM.render(Main,document.getElementById("main"));
});
},{"./src/main.jsx":"C:\\ksana2015\\mahaprajnaparamitasastra\\src\\main.jsx","ksana2015-webruntime/ksanagap":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js","ksana2015-webruntime/livereload":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js","react":"react","react-dom":"react-dom"}],"C:\\ksana2015\\mahaprajnaparamitasastra\\src\\main.jsx":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var TwoColumnMode=require("ksana2015-parallel").TwoColumnMode;

var rule=require("./rule");
var leftDocs=[{name:"jin",label:"經",rule},{name:"lun",label:"論",rule}],
 rightDocs=[{name:"jin",label:"經",rule},{name:"lun",label:"論",rule}];
// ,{name:"eng",label:"英",rule}];
var leftDoc="jin",rightDoc="lun";

var maincomponent = React.createClass({displayName: "maincomponent",
  getInitialState:function() {
    return {};
  },
  componentDidMount:function(){
  }
  ,render: function() {
    return E(TwoColumnMode,{
      ControlTab:"kepan",rightDocs,leftDocs,leftDoc,rightDoc});
  }
});
module.exports=maincomponent;
},{"./rule":"C:\\ksana2015\\mahaprajnaparamitasastra\\src\\rule.js","ksana2015-parallel":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\index.js","react":"react"}],"C:\\ksana2015\\mahaprajnaparamitasastra\\src\\rule.js":[function(require,module,exports){
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
		line.replace(pagebreak,function(m,pb,idx){
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
		var marker=doc.markText({line:i,ch:idx},{line:i,ch:idx+d.length+1},
			{replacedWith:element});
		element.marker=marker;

		doc.markText({line:i,ch:idx+d.length+2},{line:i,ch:idx+m.length},
			{className:"kepannode"});
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
module.exports={markAllLine,markLine,markLines
	,getNotes,getNoteFile
	,excerptCopy
	,getParagraph,makeParagraph,makeKepan,makeFootnote
	,patterns
	,setActionHandler};
},{}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\index.js":[function(require,module,exports){
var model=require("./src/model");
var TwoColumnMode=require("./src/twocolumnmode");
module.exports={model,TwoColumnMode};
},{"./src/model":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\model.js","./src/twocolumnmode":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\twocolumnmode.js"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\cmview.js":[function(require,module,exports){
var React=require("react");
var ReactDOM=require("react-dom");
var E=React.createElement;
var PT=React.PropTypes;
var CodeMirror=require("ksana-codemirror").Component;
var TopRightMenu=require("./toprightmenu");
var NotePopup=require("./notepopup");
require("./loadfile");

var CMView=React.createClass({
	getInitialState:function(){
		return {data:this.props.data||"empty",popupX:0,popupY:0,popupText:""}
	}
	,contextTypes:{
		store:PT.object,
		getter:PT.func,
		action:PT.func
	}
	,componentWillReceiveProps:function(nextProps) {
		if (nextProps.doc!==this.props.doc) {
			this.context.getter("file",{filename:nextProps.doc,side:nextProps.side});	
		}
	}
	,defaultListeners:function(){
		this.context.store.listen("gopara",this.onGoPara,this);
		this.context.store.listen("leavingfrom",this.onLeavingFrom,this);
		this.context.store.listen("gokepan",this.onGoKepan,this);
		this.context.store.listen("loaded",this.onLoaded,this);
		this.context.store.listen("showfootnote",this.showfootnote,this);
		this.context.store.listen("hidefootnote",this.hidefootnote,this);
	}
	,hasFootnoteInScreen:function(note){
		var screentext=this.getScreenText();
		var rule=this.getDocRule();
		var n=rule.makeFootnote(note);
		var m=screentext.match(rule.patterns.footnote);
		if (m) {
			var at=m.indexOf(n);
			return at>-1;
		}	
		return false;
	}
	,leavingFrom:null
	,leavingClass:""
	,onLeavingFrom:function(link){
		if(this.leavingFrom) {
				this.leavingFrom.replacedWith.className=this.leavingClass;
				this.leavingFrom=null;
		}
		var cm=this.refs.cm.getCodeMirror();
		var screentext=this.getScreenText();
		var vp=cm.getViewport();
		var i=screentext.indexOf(link);
		if (i>-1) {
			var pos=cm.posFromIndex(i+cm.indexFromPos({line:vp.from,ch:1}));
			var marks=cm.findMarks(pos,{line:pos.line,ch:pos.ch+link.length});
			if (marks&&marks.length) for (var i=0;i<marks.length;i++) {
				var m=marks[i];
				if (m.replacedWith) {
					this.leavingClass=m.replacedWith.className;
					this.leavingFrom=m;
					m.replacedWith.className="link_visited";
				}				
			}
		}
	}
	,popupFootnote:function(){
			var rule=this.getDocRule();
			var ndeffile=rule.getNoteFile(this.note);
			var ndefs=this.context.getter("fileSync",ndeffile);
			this.setState({popupX:this.popupX,popupY:this.popupY,
				popupW:this.popupW,popupH:this.popupH,
				popupText:ndefs[this.note]})
	}
	,showfootnote:function(opts){
		if (this.hasFootnoteInScreen(opts.note)){
			var n=ReactDOM.findDOMNode(this).getBoundingClientRect();
			this.popupX=opts.x-n.left; this.popupY=opts.y-n.top;
			this.popupW=n.width; this.popupH=n.height;
			this.note=opts.note;
			this.loadNote(opts.note);
		}
	}
	,hidefootnote:function(note){
		if (this.hasFootnoteInScreen(note)){

		}
	}
	,componentDidMount:function(){
		this.defaultListeners();
		if (this.props.doc) {
			this.context.getter("file",{filename:this.props.doc,side:this.props.side});
		}
	}
	,getScreenText:function(){
		var cm=this.refs.cm.getCodeMirror();
		var vp=cm.getViewport();
		var rule=this.getDocRule();
		var t="";
		for (var i=vp.from;i<=vp.to;i++) {
			t+=cm.doc.getLine(i)+"\n";
		}
		return t;
	}
	,scrollToText:function(t){
		var cm=this.refs.cm.getCodeMirror();
		var text=cm.getValue();
		var at=text.indexOf(t);
		if (at>-1) {
			var pos=cm.doc.posFromIndex(at);
			//scroll to last line , so that the paragraph will be at top
			cm.scrollIntoView({line:cm.doc.lineCount()-1,ch:0})
			if (pos.line) pos.line--;
			cm.scrollIntoView(pos);
		}
	}
	/*
			var screentext=this.getScreenText();
	*/
	,onGoKepan:function(kepan) {
		var rule=this.getDocRule();
		var kepantext=rule.makeKepan(kepan+" ");//prevent 37.1 jump to 37.10
		this.scrollToText(kepantext);
	}
	,onGoPara:function(para){
		var rule=this.getDocRule();
		var paratext=rule.makeParagraph(para);
		this.scrollToText(paratext);
	}
	,onNDefLoaded:function(arg){
		this.context.store.unlistenAll(this);
		this.defaultListeners();
		this.popupFootnote();
	}
	,markViewport:function(){
		var cm=this.refs.cm.getCodeMirror();
		var vp=cm.getViewport();
		this.vpfrom=-1;//force onViewport
		this.onViewportChange(cm,vp.from,vp.to);
		var rule=this.getDocRule();
	}
	,loadNote:function(note){
		var rule=this.getDocRule();
		var filename=rule.getNoteFile(note);
		var d=this.context.getter("fileSync",filename);
		if (d){
			this.popupFootnote();
		} else {
			this.context.store.unlistenAll(this);
			this.context.store.listen("loaded",this.onNDefLoaded,this);
			this.context.getter("file",{filename,side:this.props.side});
		}
	}
	,onCursorActivity:function(cm){
		//var c=cm.doc.getCursor();
		//if (this.activeline==c.line) return;
		//this.loadNote(cm,c.line);
	}
	,onSetDoc:function(side,filename){
		this.context.getter("setDoc",side,filename);
	}
	,getDocRule:function(doc){
		doc=doc||this.props.doc;
		var docs=this.props.docs;
		for (var i=0;i<docs.length;i++) {
			if (docs[i].name==this.props.doc) {
				return docs[i].rule;
			}
		}
	}
	,onLoaded:function(res){
		if (res.side!==this.props.side) return;
		var cm=this.refs.cm.getCodeMirror();

		var rule=this.getDocRule();
		rule.setActionHandler(this.context.action);
		this.text=res.data;
		cm.setValue(res.data);
	}
	,onViewportChange:function(cm,from,to) {
		var rule=this.getDocRule();
		if (!rule)return;

		var clearMarksBeyondViewport=function(f,t){
			var M=cm.doc.findMarks({line:0,ch:0},{line:f-1,ch:65536});
			M.forEach(function(m){m.clear()});

			var M=cm.doc.findMarks({line:0,ch:t},{line:cm.lineCount(),ch:65536});
			M.forEach(function(m){m.clear()});			
		}		

		if (this.vptimer) clearTimeout(this.vptimer);
		this.vptimer=setTimeout(function(){ //marklines might trigger viewport change			
			//rule.clearNote();
			var vp=cm.getViewport(); //use current viewport instead of from,to
			if (Math.abs(this.vpfrom-vp.from)<2)return;
			
			//this will trigger another onViewport
			//clearMarksBeyondViewport(vp.from,vp.to+10);

			rule.markLines(cm,vp.from,vp.to+20,{note:true,pagebreak:true,link:true});
			this.vpfrom=vp.from,this.vpto=vp.to;
		}.bind(this),400); 
		//might be big enough, otherwise onViewport will be trigger again, causing endless loop
	}
	,onCopy:function(cm,evt){
		var rule=this.getDocRule();
		if (rule.excerptCopy) {
			evt.target.value=rule.excerptCopy(evt.target.value, this.text, cm.indexFromPos(cm.getCursor()));
			evt.target.select();//reselect the hidden textarea
		}
	}
	,render:function(){
		var rule=this.getDocRule();
		return E("div",{},
			E(NotePopup,{x:this.state.popupX,y:this.state.popupY,
				w:this.state.popupW,h:this.state.popupH,
				rule,
				text:this.state.popupText}),
			E(TopRightMenu,{side:this.props.side,onSetDoc:this.onSetDoc,
				buttons:this.props.docs,selected:this.props.doc}),
	  	E(CodeMirror,{ref:"cm",value:"",theme:"ambiance",readOnly:true,
  	  onCursorActivity:this.onCursorActivity
  	  ,onCopy:this.onCopy
  	  ,onViewportChange:this.onViewportChange})
  	 )
	}
})
module.exports=CMView;
},{"./loadfile":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\loadfile.js","./notepopup":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\notepopup.js","./toprightmenu":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\toprightmenu.js","ksana-codemirror":"ksana-codemirror","react":"react","react-dom":"react-dom"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\controlpanel.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var Tabs={kepan:require("./kepan")}
var ControlPanel = React.createClass({
  getInitialState:function() {
    return {order:0};
  }
  ,render:function(){
    var Tab=Tabs[this.props.ControlTab];
  	return E("div",{style:this.props.style},
        Tab?E(Tab):null
    );
  }
});

module.exports=ControlPanel;
},{"./kepan":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\kepan.js","react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\inputbox.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;

var InputBox=React.createClass({
	getInitialState:function(){
		return {tofind:"",order:1,focusing:false}
	}
	,propTypes:{
		onInputChanged:PT.func.isRequired
	}
  ,onChange:function(e){
    var tofind=e.target.value;
    this.setState({tofind});
    clearTimeout(this.timer1);
    this.timer1=setTimeout(function(){
    	this.props.onInputChanged(this.state.tofind,this.state.order);
    }.bind(this),300);
  }
  ,onChangeOrder:function(e){
  	var order=parseInt(e.target.value);
  	clearTimeout(this.timer2);
  	this.refs.input.focus();
  	this.setState({order});
  	this.props.onInputChanged(this.state.tofind,order);
  }
  ,sortOption:function(){
  	if (this.state.tofind.trim() && this.state.focusing) {
  		return [
  		  E("br",{key:1})
        ,E("label",{key:2},E("input",{onChange:this.onChangeOrder,
        	name:"order",type:"radio",value:1,defaultChecked:true}),"Natural")
        ,E("label",{key:3},E("input",{onChange:this.onChangeOrder,
        	name:"order",type:"radio",value:2}),"Depth")
        ,E("label",{key:4},E("input",{onChange:this.onChangeOrder,
        	name:"order",type:"radio",value:3}),"Length")
      ]
  	}
  }
  ,onFocus:function(){
  	this.setState({focusing:true});
  }
  ,onBlur:function(){
  	clearTimeout(this.timer2);
  	this.timer2=setTimeout(function(){
  		this.setState({focusing:false});
  	}.bind(this),500);
  }
	,render:function(){
		return E("div",{style:styles.inputBox},
        E("input",{placeholder:"Search",style:styles.input,
        	ref:"input",
        	onFocus:this.onFocus,
        	onBlur:this.onBlur,
          value:this.state.tofind,onChange:this.onChange})
        ,this.sortOption()
     );
  }
});
module.exports=InputBox;
var styles={
  inputBox:{position:"fixed",zIndex:200, left:15,top:10,opacity:0.6},
  input:{fontSize:"120%", width:210,borderRadius:5,background:"silver",outline:"none",border:"0px"}
}
},{"react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\kepan.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var TreeToc=require("ksana2015-treetoc").Component;
var TocResult=require("./tocresult");
var InputBox=require("./inputbox");
var KepanPanel = React.createClass({
  getInitialState:function() {
    return {filename:"jin",toc:[],tofind:"",order:0};
  }
  ,contextTypes:{
  	store:PT.object.isRequired,
  	getter:PT.func.isRequired,
  	action:PT.func.isRequired
  }
  ,componentDidMount:function(){
    this.context.getter("file","kepan");
    this.context.store.listen("loaded",this.treeloaded,this);
  }
  ,treeloaded:function(obj){
    if (obj.filename!=="kepan")return;
  	this.setState({toc:obj.data});
  }
  ,onSelect:function(ctx,node,i,nodes){
    this.context.action("gokepan",node.l);
  }
  ,renderToc:function(){
    if(this.state.tofind.trim()){
      return [E("br",{key:1}),
        E(TocResult,{key:2,tofind:this.state.tofind,toc:this.state.toc
        ,order:this.state.order
        ,onSelect:this.onSelect})
        ];
    }else{
      return E(TreeToc,{opts:{rainbow:true},
        toc:this.state.toc,onSelect:this.onSelect});
    }
  }
  ,onInputChanged:function(tofind,order){
    this.setState({tofind,order});
  }
  ,render:function(){
  	return E("div",{style:this.props.style},
      E(InputBox,{onInputChanged:this.onInputChanged}), 
      E("br"),
      this.renderToc()
    );
  }
});

module.exports=KepanPanel;
},{"./inputbox":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\inputbox.js","./tocresult":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\tocresult.js","ksana2015-treetoc":"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\index.js","react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\loadfile.js":[function(require,module,exports){
/* jsonp loading text dynamically */
var {action,store,getter,registerGetter}=require("./model");

var loadqueue=[];
var running=false;

var fireEvent=function(){
	if (loadqueue.length===0) {
		running=false;
		return;
	}
	running=true;
	var task=loadqueue.pop();
	var func=task[0], opts=task[1], cb=task[2], context=task[3];
	func.call(context,opts);
}

var queueTask=function(func,opts,cb,context) {
	loadqueue.unshift([func,opts,cb,context]);
	if (!running) fireEvent();
}
var loadfile=function(obj){
	queueTask(_loadfile,obj);
}
var datafiles={};
var loadingfilename="";
var loadingobj=null;
var loadscriptcb=function(data){
	if (!loadingfilename) {
		throw "not loading any file"
		return;
	}
	datafiles[loadingfilename]=data;

	if (loadingobj) {
		var o=JSON.parse(JSON.stringify(loadingobj));
		o.data=data;
	} else {
		var o={filename:loadingfilename,data};
	}
	
	action("loaded",o);
	loadingfilename="";
	loadingobj=null;
	setTimeout(fireEvent,0);
}
window.loadscriptcb=loadscriptcb;

var _loadfile=function(obj){
	if (loadingfilename) return;

	if (typeof obj=="string") {
		filename=obj;
		obj=null;
	} else {
		filename=obj.filename;
	}
	if (!filename) {
		throw "Missing filename"
	}
	if (datafiles[filename]) {
		o=JSON.parse(JSON.stringify(obj));
		o.data=datafiles[filename];
		action("loaded",o);
		setTimeout(fireEvent,0);
	} else {
		loadingfilename=filename;
		loadingobj=obj;
		var script = document.createElement('script');
		script.src = 'data/'+filename+".js";
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}
var fileSync=function(filename){
	return datafiles[filename];
}
registerGetter("file",loadfile);
registerGetter("fileSync",fileSync);//make sure already loaded
module.exports=loadfile;
},{"./model":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\model.js"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\model.js":[function(require,module,exports){
/* action dispatcher */
var listeners=[];
var getters={};

var eventqueue=[];
var running=false;

var fireEvent=function(){
	if (eventqueue.length===0) {
		running=false;
		return;
	}
	running=true;

	var task=eventqueue.pop();
	var func=task[0], opts=task[1], cb=task[2], context=task[3];

	if (func.length>1){
		func.call(context,opts,function(err,res,res2){
			cb&&cb(err,res,res2);
			setTimeout(fireEvent,0);
		});
	} else { //sync func
		func.call(context,opts);
		setTimeout(fireEvent,0);
	}
}

var queueTask=function(func,opts,cb,context) {
	eventqueue.unshift([func,opts,cb,context]);
	if (!running) setTimeout(fireEvent,0);
}

var action=function(evt,opts,cb){
	for (var i=0;i<listeners.length;i+=1) {
		var listener=listeners[i];
		if (evt===listener[1] ) {
			if (listener[2]==undefined) {
				console.error("action has no callback",evt,listener);
			}
			queueTask( listener[2], opts,cb  , listener[0]);
		}
	}
}

var getter=function(name,opts,cb){ // sync getter
	if (getters[name]) {
		return getters[name](opts,cb);
	} else {
		console.error("getter '"+name +"' not found");
	}
}
var hasGetter=function(name) {
	return (!!getters[name]);
}
var registerGetter=function(name,cb,opts){
	opts=opts||{};
	if (!cb && name) delete getters[name];
	else {
		if (getters[name] && !opts.overwrite) {
			console.error("getter name "+name+" overwrite.");
		}
		getters[name]=cb;
	} 
}
var unregisterGetter=function(name) {
	registerGetter(name);
}

var store={
	listen:function(event,cb,element){
		listeners.push([element,event,cb]);
	}
	,unlistenAll:function(element){
		if (!element) {
			console.error("unlistenAll should specify this")
		}
		listeners=listeners.filter(function(listener){
			return (listener[0]!==element) ;
		});
	}
}

module.exports={ action, store, getter, registerGetter, unregisterGetter, hasGetter};
},{}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\notepopup.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var CodeMirror=require("ksana-codemirror").Component;

var NotePopup=React.createClass({
	getInitialState:function(){
		return {close:true};
	},
	propTypes:{
		rule:PT.object.isRequired,
		x:PT.number.isRequired,
		y:PT.number.isRequired,
		text:PT.string.isRequired
	},
	close:function(){
		this.setState({close:true});
	},
	componentWillReceiveProps:function(nextProps){
		if (nextProps.text) this.setState({close:false});
	},
	componentDidUpdate:function(){
		var cm=this.refs.cm;
		if (!cm)return;
		cm=cm.getCodeMirror();
		this.props.rule.markLines(cm,0,cm.lineCount()-1,
			{note:true,pagebreak:true,link:true});
	},
	render:function(){
		if (!this.props.text||this.props.x<0 ||this.state.close){
			return E("div",{});
		}
		var style=JSON.parse(JSON.stringify(styles.viewcontrols));
		style.left=this.props.x;
		style.top=this.props.y;
		style.height=150;
		style.width=320;
		if (style.left+style.width>this.props.w) {
				style.left-=style.left+style.width-this.props.w+20;
		} 
		if (style.top+style.height>this.props.h) {
				style.top-=style.top+style.height-this.props.h+20;
		} 
		return	E("div",{style:styles.container},
				E("div",{style},
					E("button",{style:styles.button,onClick:this.close},"x"),
					E(CodeMirror,{ref:"cm",readOnly:true,value:this.props.text})
				)
		)
	}
})

var styles={
	button:{position:"absolute",right:0,
	fontSize:20,borderRadius:"50%",zIndex:103,opacity:0.5},
	container:{background:"blue",position:"relative",zIndex:101},
	viewcontrols:{position:"absolute"} //for scrollbar
}
module.exports=NotePopup;
},{"ksana-codemirror":"ksana-codemirror","react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\taishoview.js":[function(require,module,exports){
var React=require("react");
var ReactDOM=require("react-dom");
var E=React.createElement;
var PT=React.PropTypes;
var CodeMirror=require("ksana-codemirror").Component;
var TopRightMenu=require("./toprightmenu");
var NotePopup=require("./notepopup");
require("./loadfile");

var TaishoView=React.createClass({
	getInitialState:function(){
		return {data:this.props.data||"empty"};
	}
	,contextTypes:{
		store:PT.object,
		getter:PT.func,
		action:PT.func
	}
	,componentWillReceiveProps:function(nextProps) {
		if (nextProps.doc!==this.props.doc) {
			this.context.getter("file",{filename:nextProps.doc,side:nextProps.side});	
		}
	}
	,componentDidMount:function(){
		this.defaultListeners();
		if (this.props.doc) {
			this.context.getter("file",{filename:this.props.doc,side:this.props.side});
		}
	}
	,onCopy:function(cm,event){
		//event.target.value=event.target.value.replace(/[，！。；：]/g,"");
		//event.target.select();
	}
	,defaultListeners:function(){
		this.context.store.listen("loaded",this.onLoaded,this);
		this.context.store.listen("layout",this.onLayout,this);
		this.context.store.listen("toggleLineNumber",this.onToggleLineNumber,this);
	}
	,getDocRule:function(doc){
		doc=doc||this.props.doc;
		var docs=this.props.docs;
		for (var i=0;i<docs.length;i++) {
			if (docs[i].name==this.props.doc) {
				return docs[i].rule;
			}
		}
	}
	,onLayout:function(mode){
		var rule=this.getDocRule();
		if (!rule)return;
		var cm=this.refs.cm.getCodeMirror();
		var {pointers,text}=rule.breakline(this.data,mode||"lb");
		this.pointers=pointers;
		cm.setValue(text);
	}
	,onToggleLineNumber:function(side){
		if (side!==this.props.side)return;
		var cm=this.refs.cm.getCodeMirror();
		var lineNumbers=cm.getOption("lineNumbers");
		cm.setOption("lineNumbers",!lineNumbers);
	}
	,onLoaded:function(res){
		if (res.side!==this.props.side) return;
		var cm=this.refs.cm.getCodeMirror();

		var rule=this.getDocRule();
		rule.setActionHandler(this.context.action);
		rule.afterLoad(res.data);
		var {pointers,text}=rule.breakline(res.data,"lb");
		this.data=res.data;
		this.pointers=pointers;
		cm.setValue(text);
	}
	,onCursorActivity:function(cm){
		var cursor=cm.listSelections();
		//console.log(cursor);
	}
	,pointers:[]
	,lineNumberFormatter:function(line){
		var rule=this.getDocRule();
		if (!rule)return line;
		var pointer=this.pointers[line-1];
		if (!pointer) return "";

		var marker=rule.formatPointer(pointer);

		marker=marker.substr(3,7);
		while (marker[0]=="0")marker=marker.substr(1);
		return marker;
	}
	,render:function(){
		var Menu=this.props.menu||TopRightMenu;
		return E("div",{},
			E(Menu,{side:this.props.side,onSetDoc:this.onSetDoc,
				buttons:this.props.docs,selected:this.props.doc}),
	  	E(CodeMirror,{ref:"cm",value:"",theme:"ambiance",readOnly:true
	  		,onCopy:this.onCopy
	  		,lineNumbers:true
	  		,lineNumberFormatter:this.lineNumberFormatter
	  		,onCursorActivity:this.onCursorActivity})
			);
	}	
})
module.exports=TaishoView;
},{"./loadfile":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\loadfile.js","./notepopup":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\notepopup.js","./toprightmenu":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\toprightmenu.js","ksana-codemirror":"ksana-codemirror","react":"react","react-dom":"react-dom"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\tocresult.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;

var TocResult=React.createClass({
	getInitialState:function(){
		return {res:[]};
	},
	componentDidMount:function(){
		this.setState({res:this.search()})
	}
	,sortByDepth:function(res){
		var T=this.props.toc;
		return res.sort(function(a,b){
			return T[a].d-T[b].d;
		});
	}
	,sortByLength:function(res){
		var T=this.props.toc;
		return res.sort(function(a,b){
			return T[a].t.length-T[b].t.length;
		});
	}
	,search:function(tofind,order,toc){
		var res=[];
		tofind=tofind||this.props.tofind,
		order=order||this.props.order,
		toc=toc||this.props.toc;
		var pat=new RegExp(tofind);
		for (var i=0;i<toc.length;i++) {
			var m=toc[i].t.match(pat);
			if (m) {
				res.push(i);
			}
		}
		if (order===2) this.sortByDepth(res);
		else if (order===3) this.sortByLength(res);
		if (res.length>300) {
			res.length=300;
			res.push("only first 300 matches are shown");
		}
		return res;
	}
	,componentWillReceiveProps:function(nextProps){
		if (nextProps.tofind!==this.props.tofind ||nextProps.order!==this.props.order) {
	    this.setState({res:this.search(nextProps.tofind,nextProps.order)});
		}
	}
	,highlightText:function(text) {
		var pat=new RegExp(this.props.tofind);
		var out=[],lastidx=0;
		text.replace(pat,function(t,key){
			out.push(text.substring(lastidx,key));
			out.push(E("span",{className:"found",key},t));
			lastidx=key+t.length;
		});
		out.push(text.substr(lastidx));
		return out;
	}
	,onSelect:function(e){
		var n=parseInt(e.target.dataset.n);
		if (isNaN(n)) {
			n=parseInt(e.target.parentElement.dataset.n);
		}
		if (this.props.toc[n]){
			this.props.onSelect(this,this.props.toc[n]);			
		}
	}
	,renderNode:function(n,key){
		var item=this.props.toc[n];
		if (typeof n=="string") {
			return E("div",{key},n);
		}
		var hl=this.highlightText(item.t);
		return E("div",{className:"foundline",key,onClick:this.onSelect,"data-n":n},
			E("div",{style:{fontFamily:item.f}},hl)
		);
	}
	,render:function(){
		return E("div",{},
			this.state.res.map(this.renderNode)
		);
	}
});
module.exports=TocResult;
},{"react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\toprightmenu.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;

var TopRightMenu=React.createClass({
	setDoc:function(name){
		this.props.onSetDoc(this.props.side,name);
	}
	,createButton:function(item,key){
		var style=styles.button;
		if (item.name==this.props.selected) {
			style=JSON.parse(JSON.stringify(styles.button));
			style=Object.assign(style,styles.selectedButton);
		}
		return E("button",{key,style,onClick:this.setDoc.bind(this,item.name)},item.label);
	},
	render:function(){
		return	E("div",{style:styles.container},
				E("div",{style:styles.viewcontrols},
					this.props.buttons.map(this.createButton)
				)
		)
	}
})

var styles={
	button:{fontSize:20,borderRadius:"10%"},
	selectedButton:{background:"blue",color:"white"},
	container:{position:"relative",zIndex:100,opacity:0.7},
	viewcontrols:{position:"absolute",right:20,top:5} //for scrollbar
}
module.exports=TopRightMenu;
},{"react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\twocolumn.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;

var Viewers={
  default:require('./cmview'),
  taisho:require("./taishoview")
}

var TwoColumn = React.createClass({
  getInitialState:function() {
    return {};
  },
  render:function(){
    var LeftView=Viewers[this.props.leftView||"default"];
    var RightView=Viewers[this.props.rightView||"default"];
  	return E("div",{style:this.props.style},
  		E("div",{style:{display:'flex'}},
  			E("div",{style:{flex:1}},
  				E(LeftView,{side:0,menu:this.props.leftMenu,
            doc:this.props.leftDoc,docs:this.props.leftDocs})),
  			E("div",{style:{flex:1}},
  				E(RightView,{side:1,menu:this.props.rightMenu,
            doc:this.props.rightDoc,docs:this.props.rightDocs}))
  		)
  	)
  }
});
module.exports=TwoColumn;
},{"./cmview":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\cmview.js","./taishoview":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\taishoview.js","react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\twocolumnmode.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var ControlPanel=require("./controlpanel");
var TwoColumn=require("./twocolumn");


var {action,store,getter,registerGetter,unregisterGetter}=require("./model");

var modemain = React.createClass({
  getInitialState:function() {
    return {rightDoc:this.props.rightDoc,leftDoc:this.props.LeftDoc};
  }
  ,onSetDoc:function(side,filename){
    if (side===0) this.setState({leftDoc:filename});
    else if (side===1) this.setState({rightDoc:filename});
  }
  ,componentDidMount:function(){
    registerGetter("setDoc",this.onSetDoc);
  }
  ,childContextTypes: {
    store: PT.object
    ,action: PT.func
    ,getter: PT.func
    ,registerGetter:PT.func
    ,unregisterGetter:PT.func
  }
  ,getChildContext:function(){
    return {action,store,getter,registerGetter,unregisterGetter};
  }  
  ,render: function() {
    var props1=Object.assign({},this.props);
    props1.style=styles.controls;

    var props2=Object.assign({},this.props);
    props2.style=styles.body;
    props2.rightDoc=this.state.rightDoc||props2.rightDoc;
    props2.leftDoc=this.state.leftDoc||props2.leftDoc;

    return E("div",
      {style:styles.topcontainer},
      E(ControlPanel,props1),
      E(TwoColumn,props2)
    )
  }
});
var styles={
  topcontainer:{display:"flex"},
  controls:{flex:1,background:'gray',fontSize:"75%",
  height:"100%",overflowY:"scroll",overflowX:"hidden"},
  body:{flex:4},
}
module.exports=modemain;
},{"./controlpanel":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\controlpanel.js","./model":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\model.js","./twocolumn":"C:\\ksana2015\\node_modules\\ksana2015-parallel\\src\\twocolumn.js","react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\addnode.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;
var styles={
	textarea:{fontSize:"100%"}
}
var linecount=function(t) {
	var lcount=0;
	t.replace(/\n/g,function(){
		lcount++;
	})
	return lcount+2;
}
var AddNode=React.createClass({
	propTypes:{
		action: React.PropTypes.func.isRequired
	}
	,addingkeydown:function(e) {
		var t=e.target.value;
		if (e.key=="Enter" && t.charCodeAt(t.length-1)===10) {
			this.props.action("addnode",t.split("\n"),this.props.insertBefore);
		}
		var lc=linecount(t);
		e.target.rows=lc;
	}
	,componentDidMount:function() {
		this.refs.adding.focus();
	}
	,render:function(){
		return E("div", {}, 
			E("textarea",
				{style:styles.textarea,onKeyDown:this.addingkeydown,ref:"adding"
				 ,placeholder:"leading space to create child node",defaultValue:""}
		));
	}

})

module.exports=AddNode;
},{"react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\controls.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;

var Controls=React.createClass({
	propTypes:{
		enabled:React.PropTypes.array.isRequired
		,action:React.PropTypes.func.isRequired
	}
	,getDefaultProps:function(){
		return {enabled:[]};
	}
	,enb:function(name) {
		return this.props.enabled.indexOf(name)===-1;		
	}
	,act:function(name) {
		var that=this;
		return function(e){
			that.props.action(name,e.ctrlKey);
		}
	}
	,render:function() {
		return E("span",{},
			E("button" ,{onClick:this.act("addingnode"),title:"Create a new node below, press Ctrl to above here."},"＋"),
			E("button" ,{style:{visibility:"hidden"}}," "),
			E("button" ,{onClick:this.act("levelup"),title:"level -1",disabled:this.enb("levelup")},"⇠"),
			E("button" ,{onClick:this.act("leveldown"),title:"level +1",disabled:this.enb("leveldown")},"⇢")
		);
	}
})

module.exports=Controls;
},{"react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\index.js":[function(require,module,exports){
/*
   toc data format
   array of { d:depth, o:opened, t:text, n:next_same_level ]

   only first level can be 0

   TODO, do not write directly to props.toc
*/
var React=require("react");
var TreeNode=require("./treenode");
var E=React.createElement;
var manipulate=require("./manipulate");

var buildToc = function(toc) {
	if (!toc || !toc.length || toc.built) return;
	var depths=[];
 	var prev=0;
 	if (toc.length>1) {
 		toc[0].o=true;//opened
 	}
 	for (var i=0;i<toc.length;i++) delete toc[i].n;
	for (var i=0;i<toc.length;i++) {
	    var depth=toc[i].d||toc[i].depth;
	    if (prev>depth) { //link to prev sibling
	      if (depths[depth]) toc[depths[depth]].n = i;
	      for (var j=depth;j<prev;j++) depths[j]=0;
	    }
    	depths[depth]=i;
    	prev=depth;
	}
	toc.built=true;
	return toc;
}
var genToc=function(toc,title) {
    var out=[{d:0,t:title||ksana.js.title}];
    if (toc.texts) for (var i=0;i<toc.texts.length;i++) {
      out.push({t:toc.texts[i],d:toc.depths[i], vpos:toc.vpos[i]});
    }
    return out;
}

var TreeToc=React.createClass({
	propTypes:{
		toc:React.PropTypes.array.isRequired  //core toc dataset
		,opts:React.PropTypes.object    
		,onSelect:React.PropTypes.func  //user select a treenode
		,tocid:React.PropTypes.string  //toc view 
		,styles:React.PropTypes.object //custom styles
		,conv:React.PropTypes.func //custom converter for each item
	}
	,getInitialState:function(){
		return {editcaption:-1,selected:[]};
	}
	,clearHits:function() {
		for (var i=0;i<this.props.toc.length;i++) {
			if (this.props.toc[i].hit) delete this.props.toc[i].hit;
		}
	}
	,componentDidMount:function() {
		buildToc(this.props.toc);
	}
	,componentWillReceiveProps:function(nextProps) {
		if (nextProps.toc && !nextProps.toc.built) {
			buildToc(nextProps.toc);
		}
		if (nextProps.hits!==this.props.hits) {
			this.clearHits();
		}
		this.action("updateall");
	}
	,getDefaultProps:function() {
		return {opts:{}};
	}
	,markDirty:function() {
		this.props.onChanged&&this.props.onChanged();
	}
	,action:function() {
		var args=Array.prototype.slice.apply(arguments);
		var act=args.shift();
		var p1=args[0];
		var p2=args[1];
		var sels=this.state.selected;
		var toc=this.props.toc;
		var r=false;
		if (act==="updateall") {
			this.setState({editcaption:-1,deleting:-1});
		} else if (act==="editcaption") {
			var n=parseInt(p1);
			this.setState({editcaption:n,selected:[n]});
		} else if (act==="deleting") {
			this.setState({deleting:this.state.editcaption});
		} else if (act==="changecaption") {
			if (!this.state.editcaption===-1) return;
			if (!p1) {
				this.action("deleting");
			} else {
				this.props.toc[this.state.editcaption].t=p1;
				this.setState({editcaption:-1});
				this.markDirty();
			}
		} else if (act==="select") {
			var selected=this.state.selected;
			if (!(this.props.opts.multiselect && p2)) {
				selected=[];
			}
			var n=parseInt(p1);
			if (!isNaN(n)) {
				selected.push(n);
				this.props.onSelect&&this.props.onSelect(this.props.tocid,this.props.toc[n],n,this.props.toc);
			}
			this.setState({selected:selected,editcaption:-1,deleting:-1,adding:0});
		} else if (act==="addingnode") {
			var insertAt=sels[0];
			if (p1) {
				insertAt=-insertAt; //ctrl pressed insert before
			}
			this.setState({adding:insertAt,editcaption:-1});
		} else if (act=="addnode") {
			var n=this.state.selected[0];
			r=manipulate.addNode(toc,n,p1,p2)
		}else if (act==="levelup") r=manipulate.levelUp(sels,toc);
		else if (act==="leveldown") r=manipulate.levelDown(sels,toc);
		else if (act==="deletenode") r=manipulate.deleteNode(sels,toc);
		else if (act==="hitclick") {
			this.props.onHitClick&&this.props.onHitClick(this.props.tocid,this.props.toc[p1],p1,this.props.toc);
		}
		if (r) {
			toc.built=false;//force rebuild
			buildToc(toc);
			this.setState({editcaption:-1,deleting:-1,adding:0});
			if (act==="deletenode") this.setState({selected:[]});
			this.markDirty();
		}
	}
	,render:function() {
		return E("div",{},
			E(TreeNode,{toc:this.props.toc,
				editcaption:this.state.editcaption,
				deleting:this.state.deleting,
				selected:this.state.selected,
				treename:this.props.treename,
				styles:this.props.styles,
				adding:this.state.adding,
				opened:this.props.opened,
				closed:this.props.closed,
				captionClass:this.props.captionClass,
				nodeicons:this.props.nodeicons,
				action:this.action,opts:this.props.opts,cur:0,
				hits:this.props.hits,
				conv:this.props.conv
			}));
	}
})
module.exports={Component:TreeToc,genToc:genToc,buildToc:buildToc};

},{"./manipulate":"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\manipulate.js","./treenode":"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\treenode.js","react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\manipulate.js":[function(require,module,exports){
var descendantOf=function(n,toc) { /* returning all descendants */
	var d=toc[n].d;
	n++;
	while (n<toc.length) {
		if (toc[n].d<=d) return n;
		n++;
	}
	return toc.length-1;
}
var levelUp =function(sels,toc) { //move select node and descendants one level up
	if (!canLevelup(sels,toc))return;
	var n=sels[0];
	var cur=toc[n];
	var next=toc[n+1];
	var nextsib=cur.n||descendantOf(n,toc);
	if (next && next.d>cur.d) { //has child
		for (var i=n+1;i<nextsib;i++) {
			toc[i].d--;
		}
	}
	cur.d--;
	cur.o=true;//force open this node , so that sibling is visible
	return true;
}
var levelDown =function(sels,toc) {
	if (!canLeveldown(sels,toc))return; //move select node descendants one level down
	var n=sels[0];
	var cur=toc[n];
	var next=toc[n+1];

	//force open previous node as it becomes parent of this node
	var p=prevSibling(n,toc);
	if (p) toc[p].o=true;

	if (!cur.o) { //do no move descendants if opened
		if (next && next.d>cur.d) { //has child
			for (var i=n+1;i<cur.n;i++) {
				toc[i].d++;
			}
		}		
	}
	cur.d++;
	return true;
}
var parseDepth=function(s,basedepth,dnow) {
	var d=0;
	
	while (s[0]===" ") {
		s=s.substr(1);
		d++;
	}
	if (basedepth+d>dnow+1) d=dnow+1-basedepth;

	return {d:basedepth+d,t:s.trim()};
}
var addNode =function(toc,n,newnodes,insertbefore) {
	var d=toc[n].d, basedepth=d, dnow=d;
	if (!insertbefore) {
		//toc[n].o=true;
		if (toc[n].n)	n=toc[n].n ;
		else (n++);
	}
	

	var args=[n,0];

	for (var i=0;i<newnodes.length;i++) {
		var r=parseDepth(newnodes[i],basedepth,dnow);
		if (r.t) {
			args.push(r);
			dnow=r.d;
		}
	}
	toc.splice.apply(toc,args);
	return true;
}
var deleteNode =function(sels,toc) {
	if (!canDeleteNode(sels,toc))return; //move select node descendants one level down
	var n=sels[0];
	var to=descendantOf(n,toc);
	var del=to-n;
	if (n==toc.length-1) del++;
	toc.splice(n,del);
	return true;
}

var canDeleteNode=function(sels,toc) {
	if (sels.length==0) return false;
	var n=sels[0];
	return (sels.length==1 && toc[n].d>0 && toc.length>2);
}
var canLevelup=function(sels,toc) {
	if (sels.length==0) return false;
	var n=sels[0];
	return (sels.length==1 && toc[n].d>1);
}
var prevSibling=function(n,toc) {
	var p=n-1;
	var d=toc[n].d;
	while (p>0) {
		if (toc[p].d<d) return 0;
		if (toc[p].d==d) return p;
		p--;
	}
}
var canLeveldown=function(sels,toc) {
	if (sels.length==0) return false;
	var n=sels[0];
	return (sels.length==1 && prevSibling(n,toc));
}
var enabled=function(sels,toc) {
	var enabled=[];
	if (canLeveldown(sels,toc)) enabled.push("leveldown");
	if (canLevelup(sels,toc)) enabled.push("levelup");
	if (canDeleteNode(sels,toc)) enabled.push("deletenode");
	return enabled;
}
module.exports={enabled:enabled,levelUp:levelUp,levelDown:levelDown,
	addNode:addNode,deleteNode:deleteNode,descendantOf:descendantOf};
},{}],"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\treenode.js":[function(require,module,exports){
var React=require("react");
var E=React.createElement;

var manipulate=require("./manipulate");
var Controls=require("./controls");
var AddNode=require("./addnode");
var treenodehits=null;

try {
	treenodehits=require("ksana-simple-api").treenodehits;
} catch(e) {
	//don't have ksana libray
	treenodehits=function(){return 0};
}

var defaultstyles={
	selectedcaption:{borderBottom:"1px solid blue",cursor:"pointer",borderRadius:"5px"}
	,caption:{cursor:"pointer"}
	,childnode:{left:"0.7em",position:"relative"}
	,rootnode:{position:"relative"}
	,folderbutton: {cursor:"pointer",borderRadius:"50%"}
	,closed:{cursor:"pointer",fontSize:"75%"}
	,opened:{cursor:"pointer",fontSize:"75%"}	
	,leaf:{fontSize:"75%"}	
	,hiddenleaf:{visibility:"hidden"}	
	,deletebutton:{background:"red",color:"yellow"}
	,nodelink:{fontSize:"65%",cursor:"pointer"}
	,hit:{color:"red",fontSize:"65%",cursor:"pointer"}
	,input:{fontSize:"100%"}	
};
var styles={};

var TreeNode=React.createClass({
	propTypes:{
		toc:React.PropTypes.array.isRequired
		,opts:React.PropTypes.object
		,action:React.PropTypes.func.isRequired 
		,selected:React.PropTypes.array         //selected treenode (multiple)
		,cur:React.PropTypes.number.isRequired //current active treenode
		,styles:React.PropTypes.object  //custom style
		,nodeicons:React.PropTypes.node
	}
	,getDefaultProps:function() {
		return {cur:0,opts:{},toc:[]};
	}
	,componentWillMount:function(){
		this.cloneStyle();
	}
	,click:function(e) {
		ele=e.target;
		while (ele && !ele.attributes['data-n']) {
			ele=ele.parentElement;
		}
		var n=parseInt(ele.attributes['data-n'].value);
		this.props.toc[n].o=!this.props.toc[n].o;
		this.forceUpdate();
		e.preventDefault();
    e.stopPropagation();
	}
	,select:function(e){
		if (e.target.nodeName!=="SPAN") return;
		var datan=e.target.parentElement.attributes['data-n'];
		if (!datan) return;
		var n=parseInt(datan.value);
		var selected=this.props.selected.indexOf(n)>-1;
		if (selected) {
			if (this.props.opts.editable)  {
				this.props.action("editcaption",n);	
			} else {
				//toggle folder button
				this.click(e);
			}
		} else {
			this.props.action("select",n,e.ctrlKey);
		}
		e.preventDefault();
    e.stopPropagation();
	}
	,cloneStyle:function(newstyles) {
		styles={};
		for (var i in defaultstyles) styles[i]=defaultstyles[i];
		if (newstyles) for (var i in newstyles) styles[i]=newstyles[i];
	}

	,componentWillReceiveProps:function(nextProps) {
		if (nextProps.styles && nextProps.styles!==this.props.styles) this.cloneStyle(nextProps.styles)
	}
	,componentDidUpdate:function() {
		if (this.refs.editcaption) {
			var dom=this.refs.editcaption;
			dom.focus();
			dom.selectionStart=dom.value.length;
		}
	}
	,oninput:function(e) {
		var size=e.target.value.length+2;;
		if (size<5) size=5;
		e.target.size=size;
	}

	,editingkeydown:function(e) {
		if (e.key=="Enter") {
			this.props.action("changecaption",e.target.value);	
			e.stopPropagation();
		} else this.oninput(e);
	}
	,deleteNodes:function() {
		this.props.action("deletenode");
	}
	,renderDeleteButton:function(n) {
		var childnode=null;
		var children=manipulate.descendantOf(n,this.props.toc);
		if (children>n+1) childnode=E("span",{}," "+(children-n)+" nodes");
		var out=E("button",{onClick:this.deleteNodes,style:styles.deletebutton},"Delete",childnode);
		return out;
	}
	,mouseenter:function(e) {
		//e.target.style.background="highlight";
		e.target.style.oldcolor=e.target.style.color;
		//e.target.style.color="HighlightText";
		e.target.style.borderRadius="5px";
		this.lasttarget=e.target;
	}
	,mouseleave:function(e) {
		if (!this.lasttarget)return;
		//this.lasttarget.style.background="none";
		this.lasttarget.style.color=this.lasttarget.style.oldcolor;
	}
	,renderFolderButton:function(n) {
		var next=this.props.toc[n+1];
		var cur=this.props.toc[n];
		var folderbutton=null;
		var props={style:styles.closed, onClick:this.click, onMouseEnter:this.mouseenter,onMouseLeave:this.mouseleave};
		if (cur.o) props.style=styles.opened;
		if (next && next.d>cur.d && cur.d) { 
			if (cur.o) folderbutton=E("a",props,this.props.opened||"－");//"▼"
			else       folderbutton=E("a",props,this.props.closed||"＋");//"▷"
		} else {
			folderbutton=E("a",{ style:styles.hiddenleaf},"＊");
		}
		return folderbutton;
	}
	,renderCaption:function(n,depth) {
		var cur=this.props.toc[n];
		var stylename="caption";
		var defaultCaption="";
		var t=cur.t;
		if (this.props.conv) t=this.props.conv(t)||t;
		if (n==0) defaultCaption=this.props.treename;

		if (this.props.selected.indexOf(n)>-1) stylename="selectedcaption";
		var caption=null;
		if (this.props.deleting===n) {
			caption=this.renderDeleteButton(n);
		} else if (this.props.editcaption===n) {
			var size=cur.t.length+2;
			if (size<5) size=5;
			caption=E("input",{onKeyDown:this.editingkeydown,style:styles.input,
				               size:size,ref:"editcaption",defaultValue:t});
		} else {
			if (t.length<5) t=t+"  ";
			var style=JSON.parse(JSON.stringify(styles[stylename]));

			if (this.props.nodeicons) {
				var nodeicon=getNodeIcon(depth,this.props.nodeicons);
				if (typeof nodeicon=="string") style.backgroundImage="url("+nodeicon+")";
				style.backgroundRepeat="no-repeat";
			}

			caption=E("span",{onMouseEnter:this.mouseenter,onMouseLeave:this.mouseleave,
				className:this.props.captionClass,style:style,title:n},(defaultCaption||t)+(cur.o?" ":""));
			//force caption to repaint by appending extra space at the end
		}
		return caption;
	}
	,renderAddingNode:function(n,above) {
		if (this.props.adding===n && n) { 
			return E(AddNode,{insertBefore:above,action:this.props.action});
		}
	}
	,renderEditControls:function(n) {
		if (!this.props.opts.editable) return;
		if (this.props.editcaption===n && n>0) {	
			var enabled=manipulate.enabled([n],this.props.toc);
			return E(Controls,{action:this.props.action,enabled:enabled});
		} 
	}
	,renderItem:function(e,idx){
		var t=this.props.toc[e];
		var props={};
		for (var i in this.props) {
			props[i]=this.props[i];
		}
		var opened=t.o?"o":"";
		props.key="k"+e;
		props.cur=e;
		return E(TreeNode,props);
	}
	,clickhit:function(e) {
		var n=parseInt(e.target.dataset.n);
		this.props.action("hitclick",n);
		e.preventDefault();
		e.stopPropagation();
	}
	,renderHit:function(hit,n) {
		if (!hit) return;
		return E("span",{onClick:this.clickhit,style:styles.hit,"data-n":n,className:"treenode_hit",
			onMouseEnter:this.mouseenter,onMouseLeave:this.mouseleave},hit);
	}
	,render:function() {
		if (this.props.toc.length===0) return E("span",{},"");
		var n=this.props.cur;
		var cur=this.props.toc[n];
		var stylename="childnode",children=[];
		var selected=this.props.selected.indexOf(n)>-1;
		var nodeicon="";
		if (this.props.nodeicons&&typeof this.props.nodeicons[0]!=="string"){
			var nodeicon=getNodeIcon(cur.d,this.props.nodeicons);	
		}
		
		var depthdeco=renderDepth(cur.d,this.props.opts)
		if (cur.d==0) stylename="rootnode";
		var adding_before_controls=this.renderAddingNode(-n,true);
		var adding_after_controls=this.renderAddingNode(n);
		var editcontrols=this.renderEditControls(n);
		var folderbutton=this.renderFolderButton(n);
		var caption=this.renderCaption(n,cur.d);

		if (cur.o) children=enumChildren(this.props.toc,n);

		var extracomponent=this.props.opts.onNode&& this.props.opts.onNode(cur,selected,n,this.props.editcaption);
		if (this.props.deleting>-1) extracomponent=null;
		if (this.props.deleting>-1) editcontrols=null;
		var hitcount=treenodehits(this.props.toc,this.props.hits,n);
		var s=styles[stylename];
		if (this.props.opts.rainbow&& stylename=="childnode") {
			s=JSON.parse(JSON.stringify(styles[stylename]));
			s.left="";//no ident
			var angle=(cur.d+1)*30;
			if (cur.f) {
				s.fontFamily=cur.f;
			} else {
				s.fontFamily=this.props.opts.font||"system";
			}
			s.background="hsl("+angle+",40%,50%)";
		}

		return E("div",{onClick:this.select,"data-n":n,style:s,className:"treenode_lv"+cur.d},

			   adding_before_controls,
			   folderbutton,nodeicon,depthdeco,
			   editcontrols,
			   caption,
			   this.renderHit(hitcount,n),
			   extracomponent,
			   adding_after_controls,
			   children.map(this.renderItem));
	}
});

var getNodeIcon=function(depth,nodeicons) {
	if (!nodeicons) return;
	if (!nodeicons[depth]) return nodeicons[nodeicons.length-1];//return last icon
	return nodeicons[depth];
}
var ganzhi="　甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥";

var renderDepth=function(depth,opts) {
  var out=[];
  if (opts&&opts.tocstyle=="ganzhi") {
    return E("span", null, ganzhi[depth].trim()+" ");
  } else {
    if (opts&&opts.numberDepth && depth) return E("span", null, depth, ".")
    else return null;
  }
  return null;
};


var enumChildren=function(toc,cur) {
    var children=[];
    if (!toc || !toc.length || toc.length==1) return children;
    thisdepth=toc[cur].d||toc[cur].depth;
    if (cur==0) thisdepth=0;
    if (cur+1>=toc.length) return children;
    if ((toc[cur+1].d||toc[cur+1].depth)!= 1+thisdepth) {
    	return children;  // no children node
    }
    var n=cur+1;
    var child=toc[n];
    
    while (child) {
      children.push(n);
      var next=toc[n+1];
      if (!next) break;
      if ((next.d||next.depth)==(child.d||child.depth)) {
        n++;
      } else if ((next.d||next.depth)>(child.d||child.depth)) {
        n=child.n||child.next;
      } else break;
      if (n) child=toc[n];else break;
    }
    return children;
}
module.exports=TreeNode;
},{"./addnode":"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\addnode.js","./controls":"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\controls.js","./manipulate":"C:\\ksana2015\\node_modules\\ksana2015-treetoc\\manipulate.js","ksana-simple-api":"ksana-simple-api","react":"react"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js":[function(require,module,exports){

var userCancel=false;
var files=[];
var totalDownloadByte=0;
var targetPath="";
var tempPath="";
var nfile=0;
var baseurl="";
var result="";
var downloading=false;
var startDownload=function(dbid,_baseurl,_files) { //return download id
	var fs     = require("fs");
	var path   = require("path");

	
	files=_files.split("\uffff");
	if (downloading) return false; //only one session
	userCancel=false;
	totalDownloadByte=0;
	nextFile();
	downloading=true;
	baseurl=_baseurl;
	if (baseurl[baseurl.length-1]!='/')baseurl+='/';
	targetPath=ksanagap.rootPath+dbid+'/';
	tempPath=ksanagap.rootPath+".tmp/";
	result="";
	return true;
}

var nextFile=function() {
	setTimeout(function(){
		if (nfile==files.length) {
			nfile++;
			endDownload();
		} else {
			downloadFile(nfile++);	
		}
	},100);
}

var downloadFile=function(nfile) {
	var url=baseurl+files[nfile];
	var tmpfilename=tempPath+files[nfile];
	var mkdirp = require("./mkdirp");
	var fs     = require("fs");
	var http   = require("http");

	mkdirp.sync(path.dirname(tmpfilename));
	var writeStream = fs.createWriteStream(tmpfilename);
	var datalength=0;
	var request = http.get(url, function(response) {
		response.on('data',function(chunk){
			writeStream.write(chunk);
			totalDownloadByte+=chunk.length;
			if (userCancel) {
				writeStream.end();
				setTimeout(function(){nextFile();},100);
			}
		});
		response.on("end",function() {
			writeStream.end();
			setTimeout(function(){nextFile();},100);
		});
	});
}

var cancelDownload=function() {
	userCancel=true;
	endDownload();
}
var verify=function() {
	return true;
}
var endDownload=function() {
	nfile=files.length+1;//stop
	result="cancelled";
	downloading=false;
	if (userCancel) return;
	var fs     = require("fs");
	var mkdirp = require("./mkdirp");

	for (var i=0;i<files.length;i++) {
		var targetfilename=targetPath+files[i];
		var tmpfilename   =tempPath+files[i];
		mkdirp.sync(path.dirname(targetfilename));
		fs.renameSync(tmpfilename,targetfilename);
	}
	if (verify()) {
		result="success";
	} else {
		result="error";
	}
}

var downloadedByte=function() {
	return totalDownloadByte;
}
var doneDownload=function() {
	if (nfile>files.length) return result;
	else return "";
}
var downloadingFile=function() {
	return nfile-1;
}

var downloader={startDownload:startDownload, downloadedByte:downloadedByte,
	downloadingFile:downloadingFile, cancelDownload:cancelDownload,doneDownload:doneDownload};
module.exports=downloader;
},{"./mkdirp":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js","fs":false,"http":false,"path":false}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js":[function(require,module,exports){
/* emulate filesystem on html5 browser */
var get_head=function(url,field,cb){
	var xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, true);
	xhr.onreadystatechange = function() {
			if (this.readyState == this.DONE) {
				cb(xhr.getResponseHeader(field));
			} else {
				if (this.status!==200&&this.status!==206) {
					cb("");
				}
			}
	};
	xhr.send();
}
var get_date=function(url,cb) {
	get_head(url,"Last-Modified",function(value){
		cb(value);
	});
}
var get_size=function(url, cb) {
	get_head(url,"Content-Length",function(value){
		cb(parseInt(value));
	});
};
var checkUpdate=function(url,fn,cb) {
	if (!url) {
		cb(false);
		return;
	}
	get_date(url,function(d){
		API.fs.root.getFile(fn, {create: false, exclusive: false}, function(fileEntry) {
			fileEntry.getMetadata(function(metadata){
				var localDate=Date.parse(metadata.modificationTime);
				var urlDate=Date.parse(d);
				cb(urlDate>localDate);
			});
		},function(){
			cb(false);
		});
	});
}
var download=function(url,fn,cb,statuscb,context) {
	 var totalsize=0,batches=null,written=0;
	 var fileEntry=0, fileWriter=0;
	 var createBatches=function(size) {
		var bytes=1024*1024, out=[];
		var b=Math.floor(size / bytes);
		var last=size %bytes;
		for (var i=0;i<=b;i++) {
			out.push(i*bytes);
		}
		out.push(b*bytes+last);
		return out;
	 }
	 var finish=function() {
		 rm(fn,function(){
				fileEntry.moveTo(fileEntry.filesystem.root, fn,function(){
					setTimeout( cb.bind(context,false) , 0) ;
				},function(e){
					console.log("failed",e)
				});
		 },this);
	 };
		var tempfn="temp.kdb";
		var batch=function(b) {
		var abort=false;
		var xhr = new XMLHttpRequest();
		var requesturl=url+"?"+Math.random();
		xhr.open('get', requesturl, true);
		xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
		xhr.responseType = 'blob';
		xhr.addEventListener('load', function() {
			var blob=this.response;
			fileEntry.createWriter(function(fileWriter) {
				fileWriter.seek(fileWriter.length);
				fileWriter.write(blob);
				written+=blob.size;
				fileWriter.onwriteend = function(e) {
					if (statuscb) {
						abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
						if (abort) setTimeout( cb.bind(context,false) , 0) ;
				 	}
					b++;
					if (!abort) {
						if (b<batches.length-1) setTimeout(batch.bind(context,b),0);
						else                    finish();
				 	}
			 	};
			}, console.error);
		},false);
		xhr.send();
	}

	get_size(url,function(size){
		totalsize=size;
		if (!size) {
			if (cb) cb.apply(context,[false]);
		} else {//ready to download
			rm(tempfn,function(){
				 batches=createBatches(size);
				 if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
				 API.fs.root.getFile(tempfn, {create: 1, exclusive: false}, function(_fileEntry) {
							fileEntry=_fileEntry;
						batch(0);
				 });
			},this);
		}
	});
}

var readFile=function(filename,cb,context) {
	API.fs.root.getFile(filename, {create: false, exclusive: false},function(fileEntry) {
		fileEntry.file(function(file){
			var reader = new FileReader();
			reader.onloadend = function(e) {
				if (cb) cb.call(cb,this.result);
			};
			reader.readAsText(file,"utf8");
		});
	}, console.error);
}

function createDir(rootDirEntry, folders,  cb) {
  // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
  if (folders[0] == '.' || folders[0] == '') {
    folders = folders.slice(1);
  }
  rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
    // Recursively add the new subfolder (if we still have another to create).
    if (folders.length) {
      createDir(dirEntry, folders.slice(1),cb);
    } else {
			cb();
		}
  }, cb);
};


var writeFile=function(filename,buf,cb,context){
	var write=function(fileEntry){
		fileEntry.createWriter(function(fileWriter) {
			fileWriter.write(buf);
			fileWriter.onwriteend = function(e) {
				if (cb) cb.apply(cb,[buf.byteLength]);
			};
		}, console.error);
	}

	var getFile=function(filename){
		API.fs.root.getFile(filename, {exclusive:true}, function(fileEntry) {
			write(fileEntry);
		}, function(){
				API.fs.root.getFile(filename, {create:true,exclusive:true}, function(fileEntry) {
					write(fileEntry);
				});

		});
	}
	var slash=filename.lastIndexOf("/");
	if (slash>-1) {
		createDir(API.fs.root, filename.substr(0,slash).split("/"),function(){
			getFile(filename);
		});
	} else {
		getFile(filename);
	}
}

var readdir=function(cb,context) {
	var dirReader = API.fs.root.createReader();
	var out=[],that=this;
	dirReader.readEntries(function(entries) {
		if (entries.length) {
			for (var i = 0, entry; entry = entries[i]; ++i) {
				if (entry.isFile) {
					out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
				}
			}
		}
		API.files=out;
		if (cb) cb.apply(context,[out]);
	}, function(){
		if (cb) cb.apply(context,[null]);
	});
}
var getFileURL=function(filename) {
	if (!API.files ) return null;
	var file= API.files.filter(function(f){return f[0]==filename});
	if (file.length) return file[0][1];
}
var rm=function(filename,cb,context) {
	var url=getFileURL(filename);
	if (url) rmURL(url,cb,context);
	else if (cb) cb.apply(context,[false]);
}

var rmURL=function(filename,cb,context) {
	webkitResolveLocalFileSystemURL(filename, function(fileEntry) {
		fileEntry.remove(function() {
			if (cb) cb.apply(context,[true]);
		}, console.error);
	},  function(e){
		if (cb) cb.apply(context,[false]);//no such file
	});
}
function errorHandler(e) {
	console.error('Error: ' +e.name+ " "+e.message);
}
var initfs=function(grantedBytes,cb,context) {
	webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
		API.fs=fs;
		API.quota=grantedBytes;
		readdir(function(){
			API.initialized=true;
			cb.apply(context,[grantedBytes,fs]);
		},context);
	}, errorHandler);
}
var init=function(quota,cb,context) {
	if (!navigator.webkitPersistentStorage) return;
	navigator.webkitPersistentStorage.requestQuota(quota,
			function(grantedBytes) {
				initfs(grantedBytes,cb,context);
		}, errorHandler
	);
}
var queryQuota=function(cb,context) {
	var that=this;
	navigator.webkitPersistentStorage.queryUsageAndQuota(
	 function(usage,quota){
			initfs(quota,function(){
				cb.apply(context,[usage,quota]);
			},context);
	});
}
var API={
	init:init
	,readdir:readdir
	,checkUpdate:checkUpdate
	,rm:rm
	,rmURL:rmURL
	,getFileURL:getFileURL
	,writeFile:writeFile
	,readFile:readFile
	,download:download
	,get_head:get_head
	,get_date:get_date
	,get_size:get_size
	,getDownloadSize:get_size
	,queryQuota:queryQuota
}
module.exports=API;

},{}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js":[function(require,module,exports){
var appname="installer";
if (typeof ksana=="undefined") {
	window.ksana={platform:"chrome"};
	if (typeof process!=="undefined" && 
		process.versions && process.versions["node-webkit"]) {
		window.ksana.platform="node-webkit";
	}
}
var switchApp=function(path) {
	var fs=require("fs");
	path="../"+path;
	appname=path;
	document.location.href= path+"/index.html"; 
	process.chdir(path);
}
var downloader={};
var rootPath="";

var deleteApp=function(app) {
	console.error("not allow on PC, do it in File Explorer/ Finder");
}
var username=function() {
	return "";
}
var useremail=function() {
	return ""
}
var runtime_version=function() {
	return "1.4";
}

//copy from liveupdate
var jsonp=function(url,dbid,callback,context) {
  var script=document.getElementById("jsonp2");
  if (script) {
    script.parentNode.removeChild(script);
  }
  window.jsonp_handler=function(data) {
    if (typeof data=="object") {
      data.dbid=dbid;
      callback.apply(context,[data]);    
    }  
  }
  window.jsonp_error_handler=function() {
    console.error("url unreachable",url);
    callback.apply(context,[null]);
  }
  script=document.createElement('script');
  script.setAttribute('id', "jsonp2");
  script.setAttribute('onerror', "jsonp_error_handler()");
  url=url+'?'+(new Date().getTime());
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script); 
}


var loadKsanajs=function(){

	if (typeof process!="undefined" && !process.browser) {
		var ksanajs=require("fs").readFileSync("./ksana.js","utf8").trim();
		downloader=require("./downloader");
		ksana.js=JSON.parse(ksanajs.substring(14,ksanajs.length-1));
		rootPath=process.cwd();
		rootPath=require("path").resolve(rootPath,"..").replace(/\\/g,"/")+'/';
		ksana.ready=true;
	} else{
		var url=window.location.origin+window.location.pathname.replace("index.html","")+"ksana.js";
		jsonp(url,appname,function(data){
			ksana.js=data;
			ksana.ready=true;
		});
	}
}

loadKsanajs();

var boot=function(appId,cb) {
	if (typeof appId=="function") {
		cb=appId;
		appId="unknownapp";
	}
	if (!ksana.js && ksana.platform=="node-webkit") {
		loadKsanajs();
	}
	ksana.appId=appId;
	if (ksana.ready) {
		cb();
		return;
	}
	var timer=setInterval(function(){
			if (ksana.ready){
				clearInterval(timer);
				cb();
			}
		},100);
}


var ksanagap={
	platform:"node-webkit",
	startDownload:downloader.startDownload,
	downloadedByte:downloader.downloadedByte,
	downloadingFile:downloader.downloadingFile,
	cancelDownload:downloader.cancelDownload,
	doneDownload:downloader.doneDownload,
	switchApp:switchApp,
	rootPath:rootPath,
	deleteApp: deleteApp,
	username:username, //not support on PC
	useremail:username,
	runtime_version:runtime_version,
	boot:boot
}
module.exports=ksanagap;
},{"./downloader":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js","fs":false,"path":false}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js":[function(require,module,exports){
var started=false;
var timer=null;
var bundledate=null;
var get_date=require("./html5fs").get_date;
var checkIfBundleUpdated=function() {
	get_date("bundle.js",function(date){
		if (bundledate &&bundledate!=date){
			location.reload();
		}
		bundledate=date;
	});
}
var livereload=function() {
	if(window.location.origin.indexOf("//127.0.0.1")===-1) return;

	if (started) return;

	timer1=setInterval(function(){
		checkIfBundleUpdated();
	},2000);
	started=true;
}

module.exports=livereload;
},{"./html5fs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js":[function(require,module,exports){
function mkdirP (p, mode, f, made) {
     var path = nodeRequire('path');
     var fs = nodeRequire('fs');
	
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    var cb = f || function () {};
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), mode, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, mode, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, mode, made) {
    var path = nodeRequire('path');
    var fs = nodeRequire('fs');
    if (mode === undefined) {
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), mode, made);
                sync(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

},{}]},{},["C:\\ksana2015\\mahaprajnaparamitasastra\\index.js"])
//# sourceMappingURL=bundle.js.map
