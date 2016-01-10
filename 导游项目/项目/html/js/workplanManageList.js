var url="";
var model;
var request;
var contentSearch="";
var result=false;
var first=false;
var programId;

(function(){
	var app = angular.module('workplanManage', [ ]);
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


	app.controller('workplanManageController',['$http','$window','$scope', function($http,$window,$scope){
		var workplanManage=this;
		url=getPath();
    //url="oa.zhetian.net";
    //url="192.168.1.37:8080";
    //workplanManage.user={id:12,name:"dsadas"};
    workplanManage.user=getUser();
    workplanManage.pages=1;
    workplanManage.checkstatusList=[{id:0,name:"未报结"},{id:1,name:"已报结"}];
    workplanManage.searchapplyer = new Object();
    workplanManage.searchcopyer=new Object();
    workplanManage.refresherid =0;  //0代表更新执行人，1代表更新抄送人
    model=workplanManage;
    request=$http;
    LoadData();
     var scrollbar = tinyscrollbar(document.getElementById("scrollbar1"));
		workplanManage.detial=function(id)
		{
      openUrl("workplanManageDetail.html?workplanId="+id,0);    
		}

    workplanManage.toEdit=function(id)
    {
      openUrl("workplanManageEdit.html?workplanId="+id,0);    
    }

    workplanManage.delete=function(id){
    programId = id;
   showAlert("提示","确定要删除此任务?","DeleteAction()");
    }
   
    workplanManage.shaixuan=function(){
     
    first = false;
    LoadData();
    }

    workplanManage.clearSetting=function(){
      workplanManage.searchcontent=null;
      workplanManage.startsTime=null;
      workplanManage.starteTime=null;
      workplanManage.endsTime=null;
      workplanManage.endeTime=null;
      workplanManage.applysTime=null;
      workplanManage.applyeTime=null;
      workplanManage.searchapplyer = null;
      workplanManage.searchcopyer=null;
      workplanManage.checkstatus=null;
      workplanManage.searchapplyer = new Object();
      workplanManage.searchcopyer=new Object();
    }
    
    workplanManage.refresher=function(id,name){
                    $scope.$apply(function(){

                switch(workplanManage.refresherid)
                {
                  case 0:
                    workplanManage.searchapplyer.id=id;
                    workplanManage.searchapplyer.name=name; 
                  break;
                  case 1:
                    workplanManage.searchcopyer.id=id;
                    workplanManage.searchcopyer.name=name; 
                  break;
                } 

     
             });
    }

    workplanManage.chooseMember=function(refresher){
     workplanManage.refresherid =  refresher;     
            if(isAndroid()) {
             client.chooseInfo("chooseMember.html?cmdfrom=workplanManageList.html");
         }else{
             client.open("open",["chooseMember.html?cmdfrom=workplanManageList.html","3"],
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
				       workplanManage.pages++;

              $http.post('http://'+url+'/oa/App/AppProgram!manageList.action?starter='+workplanManage.user.id+'&pageno='+workplanManage.pages+'&status='+(workplanManage.checkstatus==null?"":workplanManage.checkstatus)+'&contentkey='+(workplanManage.searchcontent==null?"":workplanManage.searchcontent)+'&starttimeFrom='+(workplanManage.startsTime==null?"":workplanManage.startsTime)+'&starttimeTo='+(workplanManage.starteTime==null?"":workplanManage.starteTime)+'&endtime='+(workplanManage.endsTime==null?"":workplanManage.endsTime)+'&endtimeTo='+(workplanManage.endeTime==null?"":workplanManage.endeTime)+'&applytimeFrom='+(workplanManage.applysTime==null?"":workplanManage.applysTime)+'&applytimeTo='+(workplanManage.applyeTime==null?"":workplanManage.applyeTime)+'&applyer='+(workplanManage.searchapplyer.id==null?"":workplanManage.searchapplyer.id)+'&copyer='+(workplanManage.searchcopyer.id==null?"":workplanManage.searchcopyer.id)).success(function(data){
               console.log(data);
              workplanManage.list=workplanManage.list.concat(data);
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
        request.post('http://'+url+'/oa/App/AppProgram!manageList.action?starter='+model.user.id+'&pageno='+model.pages+'&status='+(model.checkstatus==null?"":model.checkstatus)+'&contentkey='+(model.searchcontent==null?"":model.searchcontent)+'&starttimeFrom='+(model.startsTime==null?"":model.startsTime)+'&starttimeTo='+(model.starteTime==null?"":model.starteTime)+'&endtime='+(model.endsTime==null?"":model.endsTime)+'&endtimeTo='+(model.endeTime==null?"":model.endeTime)+'&applytimeFrom='+(model.applysTime==null?"":model.applysTime)+'&applytimeTo='+(model.applyeTime==null?"":model.applyeTime)+'&applyer='+(model.searchapplyer.id==null?"":model.searchapplyer.id)+'&copyer='+(model.searchcopyer.id==null?"":model.searchcopyer.id)).success(function(data){
           if(data!=null&&data.length==0)
           {
            $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关任务！</span></div>");
               $("body").removeClass("liststyle");
            } else{
              $("body").addClass("liststyle");
              $("#no-data").html("");
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

function DeleteAction(){
     progress("Show");
    request.post('http://'+url+'/oa/App/AppProgram!del.action?id='+programId).success(function(data){
      if(data==1)
      {
      progress("Success","删除成功");
      LoadData();
      }else{
      progress("Error","操作失败");
      }
      });
};

  function refreshInfo(info){
   var info = eval("("+info+")");
   model.refresher(info.id,info.name);
}   
