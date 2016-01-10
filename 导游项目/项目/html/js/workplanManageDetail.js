var url="";
var model;
var request;
var applyId;
var user;

function LoadData(){

  creatMask();
  request.post('http://'+url+'/oa/App/AppProgram!toAddProgram.action?id='+GetQueryString("workplanId")).success(function(data){
  if(data!=null&&data.isLogin==false)
  {
    $("body").html("登陆超时，请重新登陆！");
  }
  console.log(data);


  model.detial=data.programBean;
  model.workPlanList = data.workPlanList;
if(data.users!=null)
{
  model.initUsers(data.users);

}  
 if(data.ccUsers!=null) model.initccUsers(data.ccUsers);
  removeMask();
}).error(function(data, status, headers, config){
  if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
  {
    $("body").html("网络访问出错！");
  }
});
}


(function(){
var app = angular.module('workplan', [ ]);
app.controller('workplanController',['$http','$window', function($http,$window){
var workplan=this;
//url=getPath();
//url="oa.zhetian.net";
//user=getUser();
user={id:12};
 url="192.168.1.37:8080";
request=$http;
model=workplan;
LoadData();

workplan.initUsers=function(data){
  workplan.users='';
  for(var i=0;i<data.length;i++)
  {
    workplan.users+=(data[i].name+',');
  }
}


workplan.initccUsers=function(data){
  workplan.ccUsers='';

  for(var i=0;i<data.length;i++)
  {
    workplan.ccUsers+=(data[i].name+',');
  }
}

}]);
})();
