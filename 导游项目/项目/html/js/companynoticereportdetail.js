(function(){
	var app=angular.module('NoticeDet',[]);
	app.controller('NoticeDetController',['$http','$window',function($http,$window){
		creatMask();
		var NoticeDet=this;
		//var url=getPath();
		var url="oa.zhetian.net";
		$http.post('http://'+url+'/oa/App/AppCustomApply!detail.action?customApplyId='+GetQueryString("customapplyId")).success(function(data){

			if(data!=null&&data.isLogin==false){
				$("body").html("网络访问出错！");
			}
			NoticeDet.detial=data;
			removeMask();
		}).error(function(data,status,headers,config){
			if((status>=200 && status<300)||status===304||status===1223||status===0){
				$("body").html("网络访问出错！");
			}
		});

	}]);
})();
