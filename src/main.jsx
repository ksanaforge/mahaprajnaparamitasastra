var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var TwoColumnMode=require("ksana2015-parallel").TwoColumnMode;

var rule=require("./rule");
var leftDocs=[{name:"jin",label:"經",rule},{name:"lun",label:"論",rule}],
 rightDocs=[{name:"jin",label:"經",rule},{name:"lun",label:"論",rule}];
// ,{name:"eng",label:"英",rule}];
var leftDoc="jin",rightDoc="lun";

var maincomponent = React.createClass({
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