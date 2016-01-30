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

 app.filter("phoneFilter",function(){
                return function(input){
                     var out = "";
                    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                    if(input==null || !myreg.test(input))
                    {
                      out = "";
                    }
                    else
                    {
                      out = (input.substring(0,3)+'XXXXXXXX');
                    }

                    return out;
                }
            });

  app.filter("mailaddressFilter",function(){
                return function(input){
                     var out = "";

                   if(input==null)  return "";
                   else
                   {
                    var indexofat = input.indexOf("@");
                    if(indexofat==-1)
                    {
                      out="";
                    }
                    else
                    {
                       if(indexofat>3)
                       {
                        var dsa1 = input.substring(0,3);
                        var dsa2 = input.substring(indexofat,input.length);
                        var dsa ='';
                        for(var i=0;i<indexofat-3;i++)
                          { 
                             dsa +='X';
                          }
                        out=dsa1+dsa+dsa2;
                       }
                       else
                       {
                         out=input;
                       }
                    }
                   } 

                    return out;
                }
            });

  app.controller('GerenController',['$http','$window','$scope',function($http,$window,$scope){
    Geren=this;
    model=Geren;
    //Geren.phone = '13132332345';
    //Geren.mailaddress='572f@qq.com';
   
    Geren.loginout=function(){
      client.setNameAndPass(null,null);
      client.saveGlobalInfo("myinfo",null);
      goPrevious();
    }

    Geren.edit=function(){
      client.open("gerenbianji.html",0);
    }

    Geren.goback=function(){
      goPrevious();
    }

    Geren.init=function(uname,mailaddress,remain){
          $scope.$apply(function(){
            Geren.uname =  uname;
            Geren.mailaddress= mailaddress;
            Geren.remain=remain;
          });
    }


       Geren.login2=function(username,password){
       
          $http({url:'http://'+url+'/shake_bill/app/ShakeBill!login.action',method:'post',data:{'uname':username,'password':password}}).success(function(data){
            if(data.errorcode==106)
            { 

                    Geren.uname =  data.user.uname;
                   Geren.mailaddress= data.user.mailaddress;
                   Geren.remain=data.userextend.sum;

               client.saveGlobalInfo("myinfo",JSON.stringify(data));
            }



    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
       MyAlert("网络连接失败");
      }
    });
}

  }]);
})();

function addNativeOK(){
     url = getPath();
     var updateflag= client.readNotGlobalInfo("up");
     var obj = eval("("+updateflag+")");

     if(obj!=null&&obj!=''&&obj.update=="1")
     {
                      client.saveNotGlobalInfo("up",null);
                      client.saveGlobalInfo("username",obj.uname);
           var dsa2 = client.readGlobalInfo("password");

          if(obj.uname !=null&&dsa2!='') {
                  model.login2(obj.uname,dsa2);
          }
     }
     else
     {
        var dsa = client.readGlobalInfo("myinfo");
        var obj = eval("("+dsa+")");
        model.init(obj.user.uname,obj.user.mailaddress,obj.userextend.sum);
     }



}