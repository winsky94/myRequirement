var url="";
var model;
var request;
var purchaseId;
function LoadData(){

  creatMask();
  request.post('http://'+url+'/oa/App/AppPurchase!detail.action?purchaseId='+GetQueryString("purchaseId")).success(function(data){
                                                                                                    
  if(data!=null&&data.isLogin==false)
  {
                                                                                                                  
    $("body").html("登陆超时，请重新登陆！");
  }
  model.detial=data; 
  console.log(data);
  removeMask();
}).error(function(data, status, headers, config){
  if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
  {
    $("body").html("网络访问出错！");
  }
});
}


(function(){
var app = angular.module('purchase', [ ]);
app.controller('PurchaseController',['$http','$window', function($http,$window){
var purchase=this;
url=getPath();
//url="oa.zhetian.net";
request=$http;
model=purchase;
LoadData();

}]);
})();



