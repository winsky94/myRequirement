var url="";
var model;
var request;
var GerenEdit;
function LoadData(){
    creatMask();
    model.page=1;
    request.post('http://'+url+'/super_market/app/SuperMarket!marketVideoList.action?id='+GerenEdit.marketId).success(function(data){
       model.list = data;
      console.log(data);
      removeMask();
      }).error(function(data,status,headers,config){
       if((status>=200&&status<300)||status===304||status===1223||status===0){
       $("body").html('<div class="da"><img src="images/bj2_03.png"  alt=""/></div><div class="db">网络请求失败</div><div class="dc">请检查您的网络<br>重新加载吧</div><div class="dd"><div class="newss22"><a onclick="reload()">重新加载</a></div></div>');
       }
       });
}



(function(){
  var app=angular.module('GerenEdit',[ ]);
      app.config(function($httpProvider) {
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
         var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            
            for (name in obj) {
                value = obj[name];
                
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                    + encodeURIComponent(value) + '&';
                }
            }
            
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        
        return angular.isObject(data) && String(data) !== '[object File]'
        ? param(data)
        : data;
    }];
});


  app.controller('GerenEditController',['$http','$window','$scope',function($http,$window,$scope){
    GerenEdit=this;
    model=GerenEdit;
    request=$http;


    GerenEdit.goback=function(){
     goPrevious();
    }

    GerenEdit.init=function(uname,address){
         $scope.$apply(function(){
          GerenEdit.uname=uname;
          GerenEdit.mailaddress=address;
         });  
    }

     GerenEdit.save=function(){
      progress("Show");

      if(GerenEdit.uname==undefined || GerenEdit.uname=="")
      {
       progress("Dismiss");
        MyAlert("手机号不能为空");
        return;
      }
      if(GerenEdit.mailaddress==undefined || GerenEdit.mailaddress=="")
      {
         progress("Dismiss");
        MyAlert("邮箱不能为空");
        return;
      }
        $http({url:'http://'+url+'/shake_bill/app/ShakeBill!changeInfo.action',method:'post',data:{'phone':GerenEdit.uname,'mailaddress':GerenEdit.mailaddress,'avatar':null}}).success(function(data){
   progress("Dismiss");
            if(data.errcode==100)
            {
              client.saveNotGlobalInfo("up","{update:'1',uname:'"+GerenEdit.uname+"'}");
               MyAlert("修改成功","goPrevious()");     
            }
            else
            {
              MyAlert(data.errmsg.toString());
            }



    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
         progress("Dismiss");
       MyAlert("网络连接失败");
      }
    });

    }

  }]);
})();

function addNativeOK(){

  url = getPath();
   var dsa = client.readGlobalInfo("myinfo");
   var obj = eval("("+dsa+")");

   model.init(obj.user.uname,obj.user.mailaddress); 
}