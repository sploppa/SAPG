var result = "null";
var backendCall = false;
var getLocation = function(callback){
    navigator.geolocation.getCurrentPosition(function(pos){
                                             succesfull(pos);
                                             typeof callback === 'function' && callback(geoloc);
                                             }, function(){
                                             alert("fail");
                                             });
};
function cordovaCall(Klasse, Funktion){
   	var params = new Array();
	for (var i = 0; i < cordovaCall.arguments.length; i++){
    	params[i] = cordovaCall.arguments[i+2];
    }

	cordova.exec(
                 function(succ){
                    result = succ;
                 },
                 function(err){
                    result = err;
                 }, Klasse, Funktion,
		params);
    return result;
}
function getResult(){
    return result;
}