var model;
var url;
var workplan;
(function(){
    var app = angular.module('workplan', [ ]);
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
              else if(ngModel.$name=="endDate"){
                $( "input[name='date']" ).datepicker( "option", "maxDate", selectedDate );
              }
          }
                });
              
        }
    }
});

app.controller('workplanController',['$http','$window','$scope', function($http,$window,$scope){
    creatMask();
    workplan=this;
    url=getPath();
    var user=getUser(); 
    //var branch=getBranch();
      // url="192.168.1.37:8080";
      // var user={id:12};
    model=workplan;
    workplan.refresher =  0;
    workplan.detail = new Object();
    workplan.checkstatusList=[{id:0,name:"未报结"},{id:1,name:"已报结"}];
    //workplan.userlist =[{id:1,name:"肖凌峰"},{id:2,name:"范佩西"}];
    // var url = "26.ztoas.com:88";
    // var url = "192.168.1.129:8080";
    // var branch={roleId:197,deptId:65,unitId:1,roleLevel:3};
    // var user={id:153};
    // var branch={roleId:4,deptId:6,unitId:2,roleLevel:1};
    // var user={id:175};
    
    if(GetQueryString("workplanId")==-1)  workplan.addflag = true;
    else                                   workplan.addflag = false; 

    if(workplan.addflag)
    {
       removeMask();
    }
    else
    
    
    $http.post('http://'+url+'/oa/App/AppProgram!toAddProgram.action?id='+GetQueryString("workplanId")).success(function(data){
         if(data!=null&&data.isLogin==false){
    	   $("body").html("网络访问出错！");
         }
         console.log(data);
         workplan.detail=data.programBean;
        if(data.users!=null) workplan.detail.applyers =data.users;


        workplan.detail.copyers  = data.ccUsers;
         workplan.planlist = data.workPlanList;
         removeMask();
    }).error(function(data,status,headers,config){
      if((status>=200 && status<300)||status===304||status===1223||status===0){
    	  $("body").html("网络访问出错！");
      }
});

 
workplan.deleteapplyer=function(id){
    if(workplan.detail.applyers!=null)
    {
       for(var i=0; i<workplan.detail.applyers.length; i++){
            if(workplan.detail.applyers[i].id==id){
               workplan.detail.applyers.splice(i,1);
            }
          }
    }
}

workplan.deletecopyer=function(id){
    if(workplan.detail.copyers!=null)
    {
       for(var i=0; i<workplan.detail.copyers.length; i++){
            if(workplan.detail.copyers[i].id==id){
               workplan.detail.copyers.splice(i,1);
            }
          }
    }
}


workplan.add=function(id,name){
       var flag = false;
       $scope.$apply(function(){

        if(workplan.refresher==0)
        {
                if(workplan.detail.applyers==null) 
           {
            var dsa = new Array();
            workplan.detail.applyers = dsa;
           } 

              for(var i=0; i<workplan.detail.applyers.length; i++){
                if(workplan.detail.applyers[i].id==id) flag = true;
              }
              if(!flag)
              {

                var dsa = new Object();
                dsa.id = id;
                dsa.name = name;
                workplan.detail.applyers.push(dsa);
              }
        }
        else if(workplan.refresher==1)
        {
           if(workplan.detail.copyers==null) 
           {
            var dsa = new Array();
            workplan.detail.copyers = dsa;
           } 

            for(var i=0; i<workplan.detail.copyers.length; i++){
                if(workplan.detail.copyers[i].id==id) flag = true;
              }
              if(!flag)
              {
                var dsa = new Object();
                dsa.id = id;
                dsa.name = name;
                workplan.detail.copyers.push(dsa);
              }
        }

      });

}

workplan.chooseMember=function(refresher){
  workplan.refresher = refresher; 
        if(isAndroid()) {
         client.chooseInfo("chooseMember.html?cmdfrom=workplanManageEdit.html");
     }else{
         client.open("open",["chooseMember.html?cmdfrom=workplanManageEdit.html","3"],
                     function(success){
                     },
                     function(error) {
                     alert("Error: \r\n"+error);
                     });
     }
}

   workplan.check=function(){

        if(workplan.detail.applyers==null||workplan.detail.applyers.length<1)
          {return false;} 

         return true;
      }

  workplan.checkproceed=function(){
    var sum=0;
    if(workplan.planlist==null)  return true;
    
      for(var i=0;i<workplan.planlist.length;i++)
      {
           if(workplan.planlist[i].schedule==1)
           {
            sum++;
           }
      }
      if((sum<workplan.planlist.length)&&(workplan.detail.state==1))  return false;
      else                                     return  true;
  }

workplan.edit=function(){
progress("Show"); 

if(!workplan.checkproceed())
{
   progress("Error","有项目未完成","");
   return;
}

    var appyers = ArrayToStrings(workplan.detail.applyers);
    var copyers = ArrayToStrings(workplan.detail.copyers);
    console.log(appyers);
     $http({url:'http://'+url+'/oa/App/AppProgram!addProgram.action',method:'post',data:{'id':workplan.detail.id,'content':workplan.detail.name,'launcher':user.id,'applyer':appyers,'copyer':copyers,'start_time':workplan.detail.startTimeStr,'end_time':workplan.detail.endTimeStr,'status':workplan.detail.state,'finish_time':workplan.detail.finish_time}}).success(function(data){
    console.log(data);
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



}]);
})();

  function refreshInfo(info){
   var info = eval("("+info+")");
   model.add(info.id,info.name);
}

function ArrayToStrings(arr){
   var ds='';
   if(arr!=null)
   {
      for(var i=0;i<arr.length;i++)
       {

         ds+=(arr[i].id+(i==(arr.length-1)?'':','));
       }
   }
    return ds;
}  