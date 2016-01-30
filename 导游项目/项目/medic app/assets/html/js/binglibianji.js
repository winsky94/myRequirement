var url="";
var model;
var request;
var editCase;



(function(){
  var app=angular.module('editCase',[ ]);
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

  app.controller('EditCaseController',['$http','$window','$scope',function($http,$window,$scope){
    editCase=this;
    model=editCase;
    editCase.screencap =["images/iong_07.jpg","images/iong_07.jpg","images/iong_07.jpg"];
    editCase.picurl=['','',''];
    editCase.index=-1;
    url = getPath();

      editCase.back=function(){
        goPrevious();
      }
      
      editCase.capture=function(id){
        editCase.index=id;
        client.capture1();
      }

      editCase.freshPic=function(picurl){
         var url2;
         if(picurl.indexOf("p")!=-1)
         {
          editCase.picurl[editCase.index] = picurl;
          url2= 'http://'+url+'/upload/medical/s_'+picurl;
          $scope.$apply(function(){

              editCase.screencap[editCase.index]=url2;
          });
         }

      }

      editCase.submit=function(){
      progress("Show");
      if(editCase.content == undefined || editCase.content == '')
      {
         progress("Dismiss");
         MyAlert("请填写基本病情");
        return;
      }
      var case1 = editCase.picurl[0]+','+editCase.picurl[1]+','+editCase.picurl[2];
     //http://tech.zhetian.net/app/mlm/submitRegister.txt //登陆接口
            $http({url:'http://'+url+'/mp/app/MedicalPlatform!addCase.action',method:'post',data:{'cases':case1,'content':editCase.content}}).success(function(data){
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