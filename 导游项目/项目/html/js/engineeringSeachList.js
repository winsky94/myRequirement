var url="";
var model;
var request;
var contentSearch="";
var result=false;
var first =false;
function LoadData(){
  result=false;
   if(!first) creatMask();
         model.pages=1;
         contentSearch =unescape(GetQueryString("searchContent"));
        document.title = contentSearch;
           request.post('http://'+url+'/oa/App/AppDProject!search.action?projectName='+encodeURI(contentSearch)+'&pages='+model.pages).success(function(data){
                                                                                            
           if(data!=null&&data.length==0)
           {
            $("body").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关工程!</span></div>");
           }
           if(data!=null&&data.isLogin==false)
           {
           $("body").html("网络访问出错！");
           }
           model.list=data;
          if(!first) removeMask(); 
          result=true;
          first=true;
           }).error(function(data, status, headers, config){
                    if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
                    {
                    $("body").html("网络访问出错！");
                    }
                    });



};



(function(){
	var app = angular.module('SearchResult', [ ]);
	app.controller('SearchResultController',['$http','$window', function($http,$window){
		var SearchResult=this;
		url=getPath();
		SearchResult.pages=1;
        model=SearchResult;
        request=$http;
        LoadData();
         SearchResult.detial=function(id){
               var url = "engineeringDetial.html?dProjectId="+id;
               openUrl(url,0);
         }
        
		$window.onscroll=function(){


              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				model.pages++;

            $http.post('http://'+url+'/oa/App/AppDProject!search.action?projectName='+encodeURI(contentSearch)+'&pages='+model.pages).success(function(data){
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


