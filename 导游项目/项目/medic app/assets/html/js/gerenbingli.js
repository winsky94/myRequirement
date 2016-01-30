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
    request = $http;
    $http.post('http://'+url+'/mp/app/MedicalPlatform!getMyCase.action').success(function(data){
           myCase.list=data.caseList;

    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
         progress("Dismiss");
         MyAlert("网络连接失败");
      }
    });


  myCase.back=function(){
    goPrevious();
  };

  myCase.addCase=function(){
    client.open("binglibianji.html",1);
  };

  myCase.detail=function(id){
    client.open("binglixiangqing.html?id="+id,1);
  };
  }]);
})();

function MyRefresh(){
    request.post('http://'+url+'/mp/app/MedicalPlatform!getMyCase.action').success(function(data){
           model.list=data.caseList;

    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
         progress("Dismiss");
         MyAlert("网络连接失败");
      }
    });

}
