var url="";
var model;
var request;
var Zhuce;
function LoadData(){
    creatMask();
    model.page=1;
    request.post('http://'+url+'/super_market/app/SuperMarket!marketVideoList.action?id='+Zhuce.marketId).success(function(data){
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
  var app=angular.module('Zhuce',[ ]);
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

  app.controller('ZhuceController',['$http','$window','$scope',function($http,$window,$scope){
    Zhuce=this;
    model=Zhuce;
    request=$http;
    Zhuce.flag=false;
    url = getPath();
    
    Zhuce.goback=function(){
      goPrevious();
    }

    Zhuce.check=function(){
      Zhuce.errflag=false;
      var first =client.readGlobalInfo("first");
      if(first!=null&&first!="")  Zhuce.first = null;
      else                        Zhuce.first = "1";
      if(Zhuce.username==undefined || Zhuce.username == '')
      {

           Zhuce.errflag=true;
           Zhuce.errcode='用户名为空';
              return;
      }

      if(Zhuce.password==undefined || Zhuce.password=='' || Zhuce.password.indexOf(" ")!=-1)
      {

           Zhuce.errflag=true;
           Zhuce.errcode='密码不能为空或包含空格';
           return;
      }

      if(Zhuce.confirmpassword==undefined || Zhuce.confirmpassword!=Zhuce.password)
      {

           Zhuce.errflag=true;
           Zhuce.errcode='两次密码不一致';
           return;
      }

      if(Zhuce.postaddr==undefined || Zhuce.postaddr=='')
      {

             Zhuce.errflag=true;
           Zhuce.errcode='邮箱用于找回密码，请填写';
           return;
      }

      
     progress("Show");
         $http({url:'http://'+url+'/shake_bill/app/ShakeBill!regiest.action',method:'post',data:{'uname':Zhuce.username,'password':Zhuce.password,'mailaddress':Zhuce.postaddr,'avatar':null,'flagfirst':Zhuce.first}}).success(function(data){
     progress("Dismiss");
            if(data.errcode==100)
            {
               client.saveGlobalInfo("first","1");
               client.saveNotGlobalInfo("login","1"); 
               client.setNameAndPass(Zhuce.username,Zhuce.password);
               MyAlert(data.errmsg.toString(),"goIndex()");

            }
            else
            {
              progress("Error",data.errmsg.toString());
            }



    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
        progress("Dismiss");
        MyAlert("网络连接失败");
      }
    });


    }

//     Zhuce.testnet=function(){

//     request.post('http://'+url+'/shake_bill/app/ShakeBill!getVCode.action').success(function(data){
//     Zhuce.flag=true;
    
//      //alert();
//       console.log(data);
//       }).error(function(data,status,headers,config){
//            client.showmsg("网络连接失败");
//            Zhuce.flag=false;
          
//        });



// }

    Zhuce.fresh=function(){
       document.location.reload();
    }

  //        Zhuce.testnet();

  }]);
})();

function addNativeOK(){
      //url = getPath();
    //url="192.168.1.103:8080";
    //    model.pic_url = 'http://'+url+'/shake_bill/app/ShakeBill!getVCode.action';
}

function goIndex(){
   client.open("index.html",0);
}