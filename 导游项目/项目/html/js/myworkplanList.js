var url="";
var model;
var request;
var contentSearch="";
var result=false;
var first=false;

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
                  if(ngModel.$name=="startsTime")
              {

                $( "input[name='starteTime']" ).datepicker( "option", "minDate", selectedDate );
              }
              else if(ngModel.$name=="starteTime"){
                $( "input[name='startsTime']" ).datepicker( "option", "maxDate", selectedDate );
              }
              else if(ngModel.$name=="endsTime")
              {
                $( "input[name='endeTime']" ).datepicker( "option", "minDate", selectedDate );
              }
              else if(ngModel.$name=="endeTime"){
                $( "input[name='endsTime']" ).datepicker( "option", "maxDate", selectedDate );
              }
              else if(ngModel.$name=="applysTime")
              {
                $( "input[name='applyeTime']" ).datepicker( "option", "minDate", selectedDate );
              }
              else if(ngModel.$name=="applyeTime"){
                $( "input[name='applysTime']" ).datepicker( "option", "maxDate", selectedDate );
              }
          }
                });
              
        }
    }
});


	app.controller('workplanController',['$http','$window','$scope', function($http,$window,$scope){
		var workplan=this;
		url=getPath();
    //url="oa.zhetian.net";
    //url="192.168.1.37:8080";
    //workplan.branch=getBranch();
   workplan.user=getUser();
    //workplan.user={id:12};
    workplan.pages=1;
    workplan.checkstatusList=[{id:0,name:"未报结"},{id:1,name:"已报结"}];
    workplan.procedList=[{id:0,name:"未完成"},{id:1,name:"已完成"}];
    workplan.searchstarter=new Object();
     workplan.searchapplyer = new Object();
    workplan.searchcopyer=new Object();
    workplan.refresherid =0;  //0代表更新发起人，1代表更新执行人，2代表更新抄送人
    model=workplan;
    request=$http;
    LoadData();
   var scrollbar = tinyscrollbar(document.getElementById("scrollbar1"));
		workplan.detial=function(id)
		{
      openUrl("myworkplanDetail.html?workplanId="+id,0);    
		}


    workplan.shaixuan=function(){
     
    first = false;
    LoadData();

    }

    workplan.clearSetting=function(){
      workplan.searchcontent=null;
      workplan.searchcopyer=null;
      workplan.startsTime=null;
      workplan.starteTime=null;
      workplan.endsTime=null;
      workplan.endeTime=null;
      workplan.applysTime=null;
      workplan.applyeTime=null;
      workplan.proced=null;
      workplan.checkstatus=null;
      workplan.searchcopyer=new Object();
    }
    
    workplan.refresher=function(id,name){
                    $scope.$apply(function(){

                switch(workplan.refresherid)
                {
                  case 0:
                    workplan.searchstarter=new Object();
                    workplan.searchstarter.id=id;
                    workplan.searchstarter.name=name;
                  break;
                  case 1:
                    workplan.searchapplyer = new Object();
                    workplan.searchapplyer.id=id;
                    workplan.searchapplyer.name=name; 
                  break;
                  case 2:
                      workplan.searchcopyer=new Object();
                      workplan.searchcopyer.id=id;
                      workplan.searchcopyer.name=name; 
                  break;
                } 

     
             });
    }

    workplan.chooseMember=function(refresher){
     workplan.refresherid =  refresher;     
            if(isAndroid()) {
             client.chooseInfo("chooseMember.html?cmdfrom=myworkplanList.html");
         }else{
             client.open("open",["chooseMember.html?cmdfrom=myworkplanList.html","3"],
                         function(success){
                         },
                         function(error) {
                         alert("Error: \r\n"+error);
                         });
         }
    }

		$window.onscroll=function(){


              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				       model.pages++;

              $http.post('http://'+url+'/oa/App/AppProgram!myList.action?applyer='+model.user.id+'&pageno='+model.pages+'&status='+(model.checkstatus==null?"":model.checkstatus)+'&contentkey='+(model.searchcontent==null?"":model.searchcontent)+'&starttimeFrom='+(model.startsTime==null?"":model.startsTime)+'&starttimeTo='+(model.starteTime==null?"":model.starteTime)+'&endtime='+(model.endsTime==null?"":model.endsTime)+'&endtimeTo='+(model.endeTime==null?"":model.endeTime)+'&applytimeFrom='+(model.applysTime==null?"":model.applysTime)+'&applytimeTo='+(model.applyeTime==null?"":model.applyeTime)+'&copyer='+(model.searchcopyer.id==null?"":model.searchcopyer.id)+'&proceed='+(model.proced==null?"":model.proced)).success(function(data){
              model.list=model.list.concat(data);
            }).error(function(data, status, headers, config){
              if(( status>= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
              {
                $("body").html("网络访问出错！");
              }
            });
			}
		};
	}]);
})();


function LoadData(){
    result= false;

   if(!first) creatMask();
    model.pages=1;
          request.post('http://'+url+'/oa/App/AppProgram!myList.action?applyer='+model.user.id+'&pageno='+model.pages+'&status='+(model.checkstatus==null?"":model.checkstatus)+'&contentkey='+(model.searchcontent==null?"":model.searchcontent)+'&starttimeFrom='+(model.startsTime==null?"":model.startsTime)+'&starttimeTo='+(model.starteTime==null?"":model.starteTime)+'&endtime='+(model.endsTime==null?"":model.endsTime)+'&endtimeTo='+(model.endeTime==null?"":model.endeTime)+'&applytimeFrom='+(model.applysTime==null?"":model.applysTime)+'&applytimeTo='+(model.applyeTime==null?"":model.applyeTime)+'&copyer='+(model.searchcopyer.id==null?"":model.searchcopyer.id)+'&proceed='+(model.proced==null?"":model.proced)).success(function(data){
           if(data!=null&&data.length==0)
           {
            $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关任务！</span></div>");
               $("body").removeClass("liststyle");
            } else{
              $("#no-data").html("");
              $("body").addClass("liststyle");
            } 
           if(data!=null&&data.isLogin==false)
           {
           $("body").html("网络访问出错！");
           }
           model.list=data;
           console.log(data);
           if(!first){
              removeMask();
           }  
           first=true;
           result=true;
           }).error(function(data, status, headers, config){
  
                    if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
                    {
                    $("body").html("网络访问出错！");
                    }
                    });
}


  function refreshInfo(info){
   var info = eval("("+info+")");
   model.refresher(info.id,info.name);
}   
