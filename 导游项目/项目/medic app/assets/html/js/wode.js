var url="";
var model;
var request;
var Wode;
function LoadData(){
    creatMask();
    model.page=1;
    request.post('http://'+url+'/super_market/app/SuperMarket!marketVideoList.action?id='+Wode.marketId).success(function(data){
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
  var app=angular.module('Wode',[ ]);
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

  app.controller('WodeController',['$http','$window','$scope',function($http,$window,$scope){
    Wode=this;
    model=Wode;
    //url = getPath();
    url = "26.ztoas.com:88";


Wode.MyInfo=function(){
  client.open("gerenxinxi.html",3);
}

Wode.MyCase=function(){
  client.open("gerenbingli.html",1);
}

Wode.changePwd=function(){
  client.open("xiugaimima.html",1);
}

Wode.logout=function(){
     client.setNameAndPass(null,null);
     client.saveGlobalInfo("myinfo",null);
     MyAlert("退出登录成功！","goPrevious()");
};


    Wode.init=function(obj){
         $scope.$apply(function(){
          Wode.user = obj;
         });
    }

  }]);
})();


function addNativeOK(){
  var ds = client.readGlobalInfo("myinfo");
  var obj= eval("("+ds+")");
  model.init(obj);
}