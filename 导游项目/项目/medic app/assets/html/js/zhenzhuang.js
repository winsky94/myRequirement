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

  app.controller('SymptomController',['$http','$window','$scope',function($http,$window,$scope){
    symptom=this;
    model=symptom;
    symptom.screencap =["images/iong_07.jpg","images/iong_07.jpg","images/iong_07.jpg",
                        "images/iong_07.jpg","images/iong_07.jpg","images/iong_07.jpg",
                        "images/iong_07.jpg","images/iong_07.jpg","images/iong_07.jpg",];
    symptom.picurl=['','','','','','','','','',];
    symptom.index=-1;
    url = getPath();

      $http({url:'http://'+url+'/mp/app/MedicalPlatform!getServiceList.action',method:'post'}).success(function(data){
            symptom.list=data.serviceList;
            symptom.serviceId = symptom.list[0].id;
       }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
         progress("Dismiss");
         MyAlert("网络连接失败");
      } 
   });

      symptom.back=function(){
        goPrevious();
      }
      
      symptom.capture=function(id){
        symptom.index=id;
        client.capture();
      }

      symptom.freshPic=function(picurl){
         var url2;
         if(picurl.indexOf("p")!=-1)
         {
          symptom.picurl[symptom.index] = picurl;
          url2= 'http://'+url+'/upload/medical/s_'+picurl;
          $scope.$apply(function(){

              symptom.screencap[symptom.index]=url2;
          });
         }

      }

      symptom.submit=function(){
      progress("Show");
      if(symptom.description == undefined || symptom.description == '')
      {
         progress("Dismiss");
         MyAlert("请填写症状描述");
        return;
      }
      var case1 = symptom.picurl[0]+','+symptom.picurl[1]+','+symptom.picurl[2];
      var laboratory = symptom.picurl[3]+','+symptom.picurl[4]+','+symptom.picurl[5];
      var affectedPart = symptom.picurl[6]+','+symptom.picurl[7]+','+symptom.picurl[8];
     //http://tech.zhetian.net/app/mlm/submitRegister.txt //登陆接口
            $http({url:'http://'+url+'/mp/app/MedicalPlatform!addSymptom.action',method:'post',data:{'cases':case1,'laboratory':laboratory,'affectedPart':affectedPart,'description':symptom.description,'serviceId':symptom.serviceId}}).success(function(data){
              progress("Dismiss");
              //alert(JSON.stringify(data));
              if(data.errcode==100)
              {
                MyAlert(data.errmsg.toString(),"goPrevious()");
                 //location.href="index.html";
              }
              else if(data.errcode==105)
               {
                client.setNameAndPass(null,null);
                client.saveGlobalInfo("myinfo",null);
                 MyAlert(data.errmsg.toString(),"goPrevious()");
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


function OnScreenResult(ds){

   model.freshPic(ds);
}