var url="";
var model;
var request;
var myCase;



(function(){
  var app=angular.module('myCase',[ ]);
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

  app.controller('MyCaseController',['$http','$window',function($http,$window){
    myCase=this;
    model=myCase;
    url = getPath();
    //url="26.ztoas.com:88";
    myCase.url=url;
    myCase.pic1=new Array();
    //myCase="26.ztoas.com:88";
   //http://tech.zhetian.net/app/mlm/submitRegister.txt //登陆接口
      $http({url:'http://'+url+'/mp/app/MedicalPlatform!getMyCaseDetail.action?caseId='+GetQueryString('id'),method:'post'}).success(function(data){

            myCase.detail=data.caseDetail;
            if(myCase.detail!=null)
            {

               myCase.pic1=myCase.detail.data.split(',');
            }
       }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
         MyAlert("网络连接失败");
      } 
   });

      myCase.back=function(){
        goPrevious();
      }


  }]);
})();