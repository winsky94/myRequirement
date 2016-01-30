var url="";
var model;
var request;
var Index;




(function(){
  var app=angular.module('Index',[ ]);

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
  app.controller('IndexController',['$http','$window','$scope',function($http,$window,$scope){
    Index=this;
    model=Index;
    request=$http;
    url = getPath();
    Index.ads=true;
  
      Index.init=function(obj){

      $scope.$apply(function(){
         Index.ads=false;
         Index.username=obj.name; 
      });
   }

    Index.symptom = function() {
      isLogin("zhenzhuanmiaoshu.html");
    }

    Index.login= function(){
      client.open("denglu.html",0);
    }
        Index.gotolog= function(){
      isLogin("fadanjilu.html");
    }

        Index.gototuandui= function(){
      client.open("yishengtuandui.html",0);
    }

    Index.mine=function(){
      // client.setNameAndPass(null,null);
      // client.saveGlobalInfo("myinfo",null);
      // location.reload();
       var info = client.readGlobalInfo("myinfo");
      if(info==null || info=='') {
      client.setNameAndPass(null,null);
      MyAlert("未登陆","loghtml()"); 
      }
      else{
        client.open("wode.html",1);
      }
    }

       Index.login2=function(username,password){
  
         creatMask();
          $http({url:'http://'+url+'/mp/app/MedicalPlatform!login.action',method:'post',data:{'uname':username,'password':password}}).success(function(data){
           removeMask();
            if(data.errorcode==106)
            {
              Index.ads=false;
               client.saveGlobalInfo("myinfo",JSON.stringify(data.user));
               Index.username=data.user.name;
            }
            else
            {
              client.saveGlobalInfo("myinfo",null);
            }



    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
       removeMask();
       MyAlert("网络连接失败");
       client.saveGlobalInfo("myinfo",null);
      }
    });
}
  }]);
})();


function addNativeOK(){
 var denglu =  client.readNotGlobalInfo("first");
  if(denglu=="1")
  {
       client.saveNotGlobalInfo("first",null);  
       var dsa = client.readGlobalInfo("username");
       var dsa2 = client.readGlobalInfo("password");
      if(dsa !=null&&dsa!='') {
              model.login2(dsa,dsa2);
      }
  }
  else
  {
      var info = client.readGlobalInfo("myinfo");

       if(info!=null&&info!='')
       {
        var obj = eval("("+info+")");
          model.init(obj);
       }
  }

}