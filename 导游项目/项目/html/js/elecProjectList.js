var url,model,request,elecProject;
function LoadData(){ 
  var result=false,first=false; 
  if(!first) createMask(); 
elecProject.pages=1 
result = false;
request.post('http://'+url+'/oa//App/ElecProject!list.action?pages=1).success(function(data){
if(data!=null&&data.length==0)
{
$("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关工作内容!</span></div>");
$("body").removeClass("liststyle");
}else
{
$("#no-data").html("");
$("body").addClass("liststyle");
model.list=data;
}
if(data!=null&&data.isLogin==false)
{
$("body").html("网络访问出错！");
}
if(!first) removeMask();
first=true;
result=true; 
}).error(function(data, status, headers, config){
if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
{
$("body").html("网络访问出错！");
}
});
}
(function(){ 
var app = angular.module('elecProject', [ ]);
app.controller('elecProjectController',['$http','$window', function($http,$window){ 
elecProject=this;
url=getPath();
elecProject.user=getUser();
elecProject.pages=1;
model=elecProject
request=$http; 
LoadData();
elecProject.detail=function(id){
var url = "elecProjectDetail.html?elecProjectId="+id;
openUrl(url,0);
}
elecProject.edit=function(obj){ 
var str=JSON.stringify(obj);
str = escape(str);
var url = "elecProjectEdit.html?elecProjectId="+str;
openUrl(url,0); 
}
$window.onscroll=function(){ 
var scrollTop=$(this).scrollTop();
var windowHeight = $(this).height(); 
var scrollHeight =document.body.scrollHeight; 
if(scrollTop + windowHeight >= scrollHeight){ 
elecProject.pages++;
$http.post('http://'+url+'/oa//App/ElecProject!list.action?pages='+elecProject.pages).success(function(data){
elecProject.list=elecProject.list.concat(data);
}).error(function(data, status, headers, config){ 
if(( status>= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
{
$("body").html("网络访问出错！");
}
});
}
}
}])
})();
