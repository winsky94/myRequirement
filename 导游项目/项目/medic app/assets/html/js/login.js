var url="";
var model;
var request;
var Login;
function LoadData(){
    creatMask();
    model.page=1;
    request.post('http://'+url+'/super_market/app/SuperMarket!marketVideoList.action?id='+Login.marketId).success(function(data){
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
  var app=angular.module('Login',[ ]);
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

  app.controller('LoginController',['$http','$window',function($http,$window){
    Login=this;
    model=Login;
    url = getPath();
    //url = "26.ztoas.com:88";

    Login.forget=function(){
      client.open("zhaohuimima1.html",0);
    }

    Login.register=function(){
   client.open("zhuce.html",0);
    }

    Login.back=function(){
      goPrevious();
    }

    Login.submit=function(){
    progress("Show");
    if(Login.username == undefined || Login.username == '')
    {
       progress("Dismiss");
       MyAlert("请填写用户名");
      return;
    }
       if(Login.password == undefined || Login.password == '')
    {
      progress("Dismiss");
       MyAlert("请填写密码");
      return;
    }
   //http://tech.zhetian.net/app/mlm/submitRegister.txt //登陆接口
          $http({url:'http://'+url+'/mp/app/MedicalPlatform!login.action',method:'post',data:{'uname':Login.username,'password':Login.password}}).success(function(data){
   progress("Dismiss");
            if(data.errorcode==106)
            {
               MyAlert(data.errormsg.toString(),"goIndex('"+JSON.stringify(data.user)+"')");
            }
            else
            {

              MyAlert(data.errormsg.toString());
            }



    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
         progress("Dismiss");
       MyAlert("网络连接失败");
      }
    });
    


    }

    Login.goback=function(){
      goPrevious();
    }

  }]);
})();

function goIndex(info){
     client.saveGlobalInfo("myinfo",info);
     client.setNameAndPass(model.username,model.password);
     goPrevious();
}

function addNativeOK(){
  
}