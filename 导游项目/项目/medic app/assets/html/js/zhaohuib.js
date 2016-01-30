var url="";
var model;
var request;
var Zhaohuib;
function LoadData(){
    creatMask();
    model.page=1;
    request.post('http://'+url+'/super_market/app/SuperMarket!marketVideoList.action?id='+Zhaohuib.marketId).success(function(data){
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
  var app=angular.module('Zhaohuib',[ ]);
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
  
  app.controller('ZhaohuibController',['$http','$window',function($http,$window){
    Zhaohuib=this;
    model=Zhaohuib;
    url=getPath();
    Zhaohuib.flag=false;
    Zhaohuib.pic_url =  'http://'+url+'/shake_bill/app/ShakeBill!getVCode.action';

      Zhaohuib.goback=function(){
      goPrevious();
    }

    Zhaohuib.confirm=function(){
    Zhaohuib.errflag=false;
    if(Zhaohuib.postaddr==undefined || Zhaohuib.postaddr=='')
    {
           Zhaohuib.errflag=true;
           Zhaohuib.errcode='邮箱不能为空';
           return;
    }
    if(Zhaohuib.code==undefined || Zhaohuib.code=='')
    {
           Zhaohuib.errflag=true;
           Zhaohuib.errcode='验证码不能为空';
           return;
    }

      //progress("Show");
               $http({url:'http://'+url+'/shake_bill/app/ShakeBill!findPwd.action',method:'post',data:{'mailaddress':Zhaohuib.postaddr,'vcode':Zhaohuib.code}}).success(function(data){

             if(data.errcode==100)
             {
                MyAlert("发送成功","goIndex()");
             }
             else
             {
               MyAlert(data.errmsg.toString());
             }



    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
       MyAlert("网络连接失败");
      }
    });

      
    }

        Zhaohuib.testnet=function(){

    $http.post('http://'+url+'/shake_bill/app/ShakeBill!getVCode.action').success(function(data){
    Zhaohuib.flag=true;
    
     //alert();
      console.log(data);
      }).error(function(data,status,headers,config){
           client.showmsg("网络连接失败");
           Zhuce.flag=false;
          
       });



}

    Zhaohuib.fresh=function(){
       document.location.reload();
    }

          Zhaohuib.testnet();

  }]);
})();

function goIndex(){
   client.open("index.html",0);
}

function addNativeOK(){
  
}