function cordovaCall(Klasse, Funktion){
	var result = "something on the native call went bad!";
	var params = new Array();
	for (var i = 0; i < cordovaCall.arguments.length-2; i++)
    	params[i] = cordovaCall.arguments[i+2];
	Cordova.exec(
	   	function(succ) {
			result = succ;
		}, 
		function(err) {
			result = err;
		}, Klasse, Funktion,
		params);
	return result;
}