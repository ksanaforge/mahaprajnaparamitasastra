var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var Parallel=require("ksana2015-parallel");
var {action,store,getter,registerGetter,unregisterGetter}=Parallel.model;
var ControlPanel=Parallel.ControlPanel;
var TwoColumn=Parallel.TwoColumn;
var loadtext=require("./loadtext");

var maincomponent = React.createClass({
  getInitialState:function() {
    return {};
  },
  componentDidMount:function(){
    store.listen("loaded",this.loaded,this);
  }
  ,loaded:function(obj){
    console.log(obj)
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
    return E("div",
      {style:styles.topcontainer},
      E(ControlPanel,{style:styles.controls}),
      E(TwoColumn,{style:styles.body})
    )
  }
});
var styles={
  topcontainer:{display:"flex",width:"100%"},
  controls:{flex:1,background:'gray'},
  body:{flex:4},
}
module.exports=maincomponent;