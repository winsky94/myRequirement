var url="";
var model;
var request;

var purchaseId;
var purchase;
var result=false;
var first=false;
function LoadData(){
    result=false;
    if(!first)  creatMask();
    purchase.page=1;
    request.post('http://'+url+'/oa/App/GoodsApply!list.action').success(function(data){
    if(data!=null&&data.length==0){
      $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关采购内容!</span></div>");
        $("body").removeClass("liststyle");
     }else
     {
       $("#no-data").html("");
       $("body").addClass("liststyle");
     }
     if(data!=null&&data.isLogin==false){
     $("body").html("网络访问出错！");
     }
     model.list=data;
     console.log(data);
     model.url=url;
     if(!first)  removeMask();
     result=true;
     first=true;
     }).error(function(data,status,headers,config){
              if((status>=200&&status<300)||status===304||status===1223||status===0){
              $("body").html("网络访问出错！");
              }
              });
};

function deleteAction(){
    progress("Show");
    request.post('http://'+url+'/oa/App/Apppurchase!del.action?purchaseId='+purchaseId).success(function(data){
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
	var app=angular.module('purchase',[ ]);
	app.controller('PurchaseController',['$http','$window',function($http,$window){
		purchase=this;
		//url=getPath();
    url="192.168.1.37:8080";
		//purchase.user=getUser();
		purchase.user={id:1};
    purchase.page=1;
        model=purchase;
        request=$http;
        LoadData();

		purchase.detail=function(id){
          var url = "purchase_detail.html?purchaseId="+id;
          openUrl(url,0);
		};
		purchase.edit=function(id){
          var url = "purchase.html?purchaseId="+id;
          openUrl(url,0);
		};
		purchase.del=function(id){
          purchaseId= id;
          showAlert("提示","确定删除吗？","deleteAction();");
		}
		$window.onscroll=function(){
              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				purchase.page++;
				$http.post('http://'+url+'/oa/App/Apppurchase!list.action?pages='+purchase.page+'&userId='+purchase.user.id).success(function(data){
					purchase.list=purchase.list.concat(data);
				}).error(function(data, status, headers, config){
				if(( status>= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
				{
				$("body").html("网络访问出错！");
				}
				});
			}
		}
	}]);
})();

