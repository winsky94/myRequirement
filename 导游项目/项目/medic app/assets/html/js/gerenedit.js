var url="";
var model;
var request;
var Geren;
function LoadData(){
    creatMask();
    model.page=1;
    request.post('http://'+url+'/super_market/app/SuperMarket!marketVideoList.action?id='+Geren.marketId).success(function(data){
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
  var app=angular.module('Geren',[ ]);
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

  app.controller('GerenController',['$http','$window','$scope',function($http,$window,$scope){
    Geren=this;
    model=Geren;
    url = getPath();
    Geren.submit=function(){
      if(Geren.user.phone == undefined || Geren.user.phone  == '')
      {
         progress("Error","电话不能为空！","");  
         return;
      }
      if(Geren.user.name == undefined || Geren.user.name  == '')
      {
         progress("Error","姓名不能为空！","");  
         return;
      }
      if(Geren.user.sex == undefined || Geren.user.sex  == '')
      {
         progress("Error","请选择性别！","");  
         return;
      }
      if(Geren.user.age == undefined || Geren.user.age  == '')
      {
         progress("Error","年龄不能为空！","");  
         return;
      }
      $http({url:'http://'+url+'/mp/app/MedicalPlatform!changeInfo.action',method:'post',data:{'phone':Geren.user.phone,'name':Geren.user.name, 'sex':Geren.user.sex, 'age':Geren.user.age}}).success(function(data){
              progress("Dismiss");
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
    Geren.forget=function(){
      client.open("zhaohuimima1.html",0);
    }

    Geren.register=function(){
   client.open("zhuce.html",0);
    }

    Geren.back=function(){
      goPrevious();
    }


    Geren.goback=function(){
      goPrevious();
    }

    Geren.init=function(obj){
         $scope.$apply(function(){
          Geren.user = obj;
         });
    }

  }]);
})();


function addNativeOK(){
  var ds = client.readGlobalInfo("myinfo");
  var obj= eval("("+ds+")");
  model.init(obj);
}

function goIndex(info){
     client.saveGlobalInfo("myinfo",info);
     client.setNameAndPass(info.uname,info.password);
     goPrevious();
}