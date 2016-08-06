var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var TwoColumnMode=require("ksana2015-parallel").TwoColumnMode;
var leftDocs=[{name:"jin",label:"經"},{name:"lun",label:"論"}],
 rightDocs=[{name:"jin",label:"經"},{name:"lun",label:"論"},{name:"eng",label:"英"}];
var leftDoc="jin";

var maincomponent = React.createClass({
  getInitialState:function() {
    return {};
  },
  componentDidMount:function(){
  }
  ,render: function() {
    return E(TwoColumnMode,{rightDocs,leftDocs,leftDoc});
  }
});
module.exports=maincomponent;