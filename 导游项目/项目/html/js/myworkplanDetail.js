var url="";
var model;
var request;
var applyId;
var user;

function LoadData(){

  creatMask();
  request.post('http://'+url+'/oa/App/AppProgram!detail.action?id='+GetQueryString("workplanId")).success(function(data){
  if(data!=null&&data.isLogin==false)
  {
    $("body").html("登陆超时，请重新登陆！");
  }
  console.log(data);
  model.detial=data;
  model.checkShowEdit();
  removeMask();
}).error(function(data, status, headers, config){
  if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
  {
    $("body").html("网络访问出错！");
  }
});
}


(function(){
var app = angular.module('Workplan', [ ]);
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

app.directive('cyDatepicker', function () {
    return {
    require: 'ngModel', 
        restrict:'AEC',
        scope:{
            model:"=ngModel"
        },
        link: function (scope, element, attrs, ngModel) {
                $(element).datepicker({
        onSelect: function (dateText, inst) {
            ngModel.$setViewValue(dateText);
            },
          onClose: function( selectedDate ) {
              if(ngModel.$name=="date")
              {
                $( "input[name='endDate']" ).datepicker( "option", "minDate", selectedDate );
              }
              else{
                $( "input[name='date']" ).datepicker( "option", "maxDate", selectedDate );
              }
          }
                });
              
        }
    }
});



app.controller('workplanController',['$http','$window', function($http,$window){
var workplan=this;
url=getPath();
//url="192.168.1.37:8080";
user=getUser();
//user={id:175};
// url="192.168.1.129:8080";
request=$http;
model=workplan;
LoadData();
workplan.editinfo=new Object();
workplan.show=true;
workplan.turnflag=true;
workplan.statuslist=[{Id:0,name:"未完成"},{Id:1,name:"已完成"}];


workplan.showturn=function(flag){
   workplan.turnflag = flag;
}

//判断是否要显示编辑，若自己已经完成，则不显示
workplan.checkShowEdit=function(){
  for(var i=0;i<workplan.detial.workPlanList.length;i++)
  {
    if(workplan.detial.workPlanList[i].execute_user==user.id)
    {
      workplan.editid= workplan.detial.workPlanList[i].id;
      if( workplan.detial.workPlanList[i].schedule==1)
      {
        workplan.show = false;
      }
      break;
    }
  }
}

workplan.edit=function(){
progress("Show"); 

if(workplan.editstatus==null || workplan.editstatus=='' || workplan.editendtime==null || workplan.editendtime=='' || workplan.editnote==null|| workplan.editnote=='')
{
  progress("Error","提交信息不全","");
}
else
{
 
    $http({url:'http://'+url+'/oa/App/AppProgram!addMyParam.action',method:'post',data:{'id':workplan.editid,'status':workplan.editstatus,'end_time':workplan.editendtime,'note':workplan.editnote}}).success(function(data){

        if(data==1)
        {
         progress("Success","保存成功","goPrevious()");
       }
       else
       {
         progress("Error","保存失败","");
       }
      }).error(function(data, status, headers, config){
        if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
        {
          $("body").html("网络访问出错！");
        }
      });

}


}

}]);
})();
