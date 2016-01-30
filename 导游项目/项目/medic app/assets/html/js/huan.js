var url="";
var model;
var request;
var Huan;
function LoadData(){
    creatMask();
    model.page=1;
    request.post('http://'+url+'/super_market/app/SuperMarket!marketVideoList.action?id='+LogHuanin.marketId).success(function(data){
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
  var app=angular.module('Huan',[ ]);

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

  app.controller('HuanController',['$http','$window','$scope',function($http,$window,$scope){
    Huan=this;
    model=Huan;


    Huan.goback=function(){
      goPrevious();
    }

    Huan.init=function(remain,uname){
        $scope.$apply(function(){
             Huan.remain =  remain;
             Huan.uname = uname;  
            
        });
    }


    Huan.huan=function(){
      creatMask();
       if(Huan.money==null || Huan.money=='')
       {
         MyAlert("请输入兑换金额");
         return;
       }
       if(Huan.money<100 || Huan.money%100!=0)
       {

          MyAlert("输入的金额不符条件");
          return;
       }

       $http({url:'http://'+url+'/shake_bill/app/ShakeBill!applyChange.action',method:'post',data:{'sum':Huan.money}}).success(function(data){
          removeMask();
                  if(data.errcode==100)
                  {
                    client.saveNotGlobalInfo("duihuan","1");
                     MyAlert("兑换成功","goPrevious()");
                  }
                  else
                  {
                    MyAlert(data.errmsg.toString());
                  }



          }).error(function(data, status, headers, config){
            if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
            {
               removeMask();
             MyAlert("网络连接失败");
            }
          });
    }

  }]);
})();

function addNativeOK(){
   url = getPath();
   var info= client.readGlobalInfo("myinfo");

   if(info!=null &&info!='')
   {
       var dsa = eval("("+info+")");
       model.init(dsa.userextend.sum,dsa.user.uname);
   }

   
}