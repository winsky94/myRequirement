(function(){ 
var app=angular.module('elecProject',[]); 
app.controller('elecProjectController',['$http','$window',function($http,$window){ 
creatMask();
var elecProject=this;
var url=getPath();
$http.post('http://'+url+'/oa//App/ElecProject!detail.action?elecProjectId='+GetQueryString("elecProjectId")).success(function(data){
if(data!=null&&data.isLogin==false){
$("body").html("网络访问出错！");
}
elecProject.detial=data;
removeMask();
}).error(function(data,status,headers,config){
if((status>=200 && status<300)||status===304||status===1223||status===0){
$("body").html("网络访问出错！");
}
});
}]);
})();
