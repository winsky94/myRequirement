var url="";
var model;
var request;
var password;



(function(){
  var app=angular.module('password',[ ]);
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

  app.controller('PasswordController',['$http','$window','$scope',function($http,$window,$scope){
    password=this;
    model=password;
    url = getPath();
    password.submit=function(){
      var info = client.readGlobalInfo("myinfo");

       if(info!=null&&info!='')
       {
        var obj = eval("("+info+")");
        password.userInfo=obj;
       }
       if(password.oldPwd==undefined || password.oldPwd=='' || password.oldPwd!= password.userInfo.password)
       {
           progress("Error","原密码输入错误！","");  
           return;
       }
      if(password.newPwd == undefined || password.newPwd  == '')
      {
         progress("Error","新密码不能为空！","");  
         return;
      }
      if(password.newPwd != password.rePwd)
      {
         progress("Error","新密码与确认密码不一致！","");  
         return;
      }
            $http({url:'http://'+url+'/mp/app/MedicalPlatform!resetPwd.action',method:'post',data:{'password':password.newPwd}}).success(function(data){
              progress("Dismiss");
              //alert(JSON.stringify(data));
              if(data.errcode==100)
              {
                progress("Success",data.errmsg.toString(),"goIndex('"+JSON.stringify(data.user)+"')");
                 //location.href="index.html";
              }
              else if(data.errcode==101)
               {
                 progress("Error",data.errmsg.toString(),"goPrevious()");
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

function goIndex(info){
     client.saveGlobalInfo("myinfo",info);
     client.setNameAndPass(info.uname,info.password);
     goPrevious();
}