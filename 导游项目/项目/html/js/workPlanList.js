var url="";
var model;
var request;
var planId;
var workPlan;
var result=false;
var first=false;

function LoadData(){
    if(!first) creatMask(); 
result = false;
    workPlan.pages=1;
    request.post('http://'+url+'/oa/App/AppProject!workPlanList.action?pages='+"1"+"&userId="+model.user.id+"&time="+new Date().toTimeString()).success(function(data){
        if(data!=null&&data.length==0)
        {
        $("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关任务内容!</span></div>");
        $("body").removeClass("liststyle");
        }else $("body").addClass("liststyle");
        if(data!=null&&data.isLogin==false)
        {
        $("body").html("登陆超时，请重新登陆！");
        }
        model.list=data;
        if(!first) removeMask();
first=true;
result=true; 
        }).error(function(data, status, headers, config){
         if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
         {
         $("body").html("网络访问出错！");
         }
         });
};

function deleteAction(){
    progress("Show");
    request.post('http://'+url+'/oa/App/AppProject!deleteWorkPlan.action?planId='+planId).success(function(data){
         if(data.flag)
         {
         progress("Success","删除成功");
         LoadData();
         }else{
         progress("Error","删除失败");
         }
         });
};

(function(){
var app = angular.module('workPlan', [ ]);
app.controller('WorkPlanController',['$http','$window', function($http,$window){
workPlan=this;
url=getPath();
workPlan.user=getUser();
workPlan.pages=1;
model=workPlan;
request=$http;
LoadData();
                                     
workPlan.delete=function(id)
		{
            planId = id ;
            showAlert("提示","确定删除吗？","deleteAction();");
		}
workPlan.edit=function(id){
     var url = "workPlanEdit2.html?workPlanId="+id;
     openUrl(url,0);
}
                                     
workPlan.detial = function(id){
     var url = "workPlanDetial.html?workPlanId="+id;
     openUrl(url,0);
}
                                     
$window.onscroll=function(){
     var scrollTop=$(this).scrollTop();
     var windowHeight = $(this).height();
     var scrollHeight =document.body.scrollHeight;
     if(scrollTop + windowHeight >= scrollHeight){
		workPlan.pages++;
		$http.post('http://'+url+'/oa/App/AppProject!workPlanList.action?pages='+workPlan.pages+"&userId="+workPlan.user.id).success(function(data){
		workPlan.list=workPlan.list.concat(data);
		}).error(function(data, status, headers, config){
		if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
		{
			$("body").html("网络访问出错！");
		}
		});
	}
	};
}]);
})();




