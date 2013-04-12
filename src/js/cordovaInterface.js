function cordovaCall(callback,Klasse, Funktion){
    var result = "null2";
   	var params = new Array();
	for (var i = 0; i < cordovaCall.arguments.length-3; i++){
    	params[i] = cordovaCall.arguments[i+3];
    }
    var that = this;
	cordova.exec(callback,
                 function(err){
                    result = err;
                 }, Klasse, Funktion,
		params);
        return result;
}
function test(c){
    navigator.notification.alert(c);
    return c;
}
