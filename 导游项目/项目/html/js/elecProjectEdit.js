var model;
(function(){ 
var app = angular.module('elecProject', [ ]);
app.config(function($httpProvider) { 
$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded'; 
$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; 
$httpProvider.defaults.transformRequest = [function(data) { 
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
? param(data): data;
}];
});
app.controller('elecProjectController',['$http','$window','$scope', function($http,$window,$scope){
var elecProject=this;
var url=getPath();
model=elecProject;
elecProject.user=getUser();
elecProject.branch= getBranch();
elecProject.edit=function(){
progress("Show");
$http({url:'http://'+url+'/oa//App/ElecProject!edit.action',method:'post',data:{}}).success(function(data){
if(data!=null&&data.isLogin==false){
$("body").html("登陆超时，请重新登陆！");
}
if(data.flag){
 progress("Success","保存成功","goPrevious()");
}else{
progress("Error","保存失败","");
}
}).error(function(data, status, headers, config){
if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
{
$("body").html("网络访问出错！");
}
});
};
}]);
})();
