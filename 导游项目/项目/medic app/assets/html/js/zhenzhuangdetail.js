var url="";
var model;
var request;
var symptom;



(function(){
  var app=angular.module('symptom',[ ]);
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

  app.controller('SymptomController',['$http','$window',function($http,$window){
    symptom=this;
    model=symptom;
    url = getPath();
    //url="26.ztoas.com:88";
    symptom.url=url;
    symptom.pic1=new Array();
    symptom.pic2=new Array();
    symptom.pic3=new Array();
    //url="26.ztoas.com:88";
   //http://tech.zhetian.net/app/mlm/submitRegister.txt //登陆接口
      $http({url:'http://'+url+'/mp/app/MedicalPlatform!getSymptomDetail.action?symptomId='+GetQueryString('id'),method:'post'}).success(function(data){

            symptom.detail=data.symptomDetail;
            if(symptom.detail!=null)
            {

               symptom.pic1=symptom.detail.cases.split(',');
               symptom.pic2=symptom.detail.laboratory.split(',');
               symptom.pic3=symptom.detail.affectedPart.split(',');
            }
       }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
         MyAlert("网络连接失败");
      } 
   });

      symptom.back=function(){
        goPrevious();
      }


  }]);
})();