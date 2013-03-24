var DISCOVER_MESSAGE_ROOTDEVICE =
    "M-SEARCH * HTTP/1.1\r\n" +
    "ST: urn:schemas-upnp-org:device:InternetGatewayDevice:1\r\n" +
    "MX: 4\r\n" +
    "MAN: \"ssdp:discover\"\r\n" +
    "HOST: 239.255.255.250:1900\r\n\r\n";
var DELIVERY_PATH;
var ROUTER_IP;
var ROUTER_PORT;

function switchSocket(){
	for (var i = 0; i < switchSocket.arguments.length; i++){
    	navigator.notification.alert("switchSocket " + switchSocket.arguments[i]);
    	
    var body = "F" + switchSocket.arguments[i] + "=?";
	var header = 
		 "POST /ctrl.htm HTTP/1.1\r\n"
		+"Host: 134.3.157.228\r\n"
		+"Proxy-Connection: keep-alive\r\n"
		+"Content-Length: 4\r\n"
		+"Cache-Control: max-age=0\r\n"
		+"Authorization: Basic YWRtaW46YW5lbA==\r\n"
		+"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
		+"Origin: http://134.3.157.228\r\n"
		+"User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22\r\n"
		+"Content-Type: application/x-www-form-urlencoded\r\n"
		+"Referer: http://134.3.157.228/ctrl.htm\r\n"
		+"Accept-Encoding: gzip,deflate,sdch\r\n"
		+"Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
		+"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3;\r\n\r\n";
	var result = cordovaCall("HttpController","sendMessage",header,body,"134.3.157.228",80);	
	navigator.notification.alert(header + "\n" + body + "\n" + result);	
	}
}
function setTimer(){
	navigator.notification.alert("setTimer");
}
function setCountdown(){
	navigator.notification.alert("setCountdown");
}
function addPortMapping(protocol, externalPort, internalClient, internalPort, description){
	if(ROUTER_IP == null || ROUTER_PORT == null || DELIVERY_PATH == null){
		getRouterInfo();
	}
	var SOAP_ACTION = "urn:schemas-upnp-org:service:WANIPConnection:1#AddPortMapping";
        
	var body = 	
	  	 "<?xml version='1.0' encoding='utf-8'?>"
  	    +"<s:Envelope s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/' xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>"
  	    +"<s:Body>"
  	    + "<u:AddPortMapping xmlns:u='urn:schemas-upnp-org:service:WANIPConnection:1'>"
  	    + "<NewRemoteHost></NewRemoteHost>"
  	    + "<NewExternalPort>"+externalPort+"</NewExternalPort>"
  	    + "<NewProtocol>"+protocol+"</NewProtocol>"
  	    + "<NewInternalPort>"+internalPort+"</NewInternalPort>"
  	    + "<NewInternalClient>"+internalClient+"</NewInternalClient>"
  	    + "<NewEnabled>1</NewEnabled>"
  	    + "<NewPortMappingDescription>"+description+"</NewPortMappingDescription>"
  	    + "<NewLeaseDuration>0</NewLeaseDuration>"
  	    + "</u:AddPortMapping>"
  	    +"</s:Body>"
  	    +"</s:Envelope>";
  
	var header = 
		 "POST " + DELIVERY_PATH + " HTTP/1.1\n"
		+"Host: "+ROUTER_IP+":"+ROUTER_PORT+"\r\n"
		+"SOAPACTION: "+ SOAP_ACTION +"\r\n"
		+"Content-Length: " + body.length +"\r\n"
		+"Content-Type: text/xml; charset='utf-8'\r\n"
		+"\r\n";
	var result = cordovaCall("HttpController","sendMessage",header,body,ROUTER_IP,ROUTER_PORT);	
	navigator.notification.alert(header + "\n" + body + "\n" + result);	
}
function deletePortMapping(protocol, externalPort){
	if(ROUTER_IP == null || ROUTER_PORT == null || DELIVERY_PATH == null){
		getRouterInfo();
	}
	var SOAP_ACTION = "urn:schemas-upnp-org:service:WANIPConnection:1#DeletePortMapping";
	        
	var body = 	
	  	 "<?xml version='1.0' encoding='utf-8'?>"
  	    +"<s:Envelope s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/' xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>"
  	    + "<s:Body>"
  	    +  "<u:DeletePortMapping xmlns:u='urn:schemas-upnp-org:service:WANIPConnection:1'>"
  	    +   "<NewRemoteHost></NewRemoteHost>"
  	    +   "<NewExternalPort>"+externalPort+"</NewExternalPort>"
  	    +   "<NewProtocol>"+protocol+"</NewProtocol>"
  	    +  "</u:DeletePortMapping>"
  	    + "</s:Body>"
  	    +"</s:Envelope>";
  
	var header = 
		 "POST " + DELIVERY_PATH + " HTTP/1.1\n"
		+"Host: "+ROUTER_IP+":"+ROUTER_PORT+"\r\n"
		+"SOAPACTION: "+ SOAP_ACTION +"\r\n"
		+"Content-Length: " + body.length +"\r\n"
		+"Content-Type: text/xml; charset='utf-8'\r\n"
		+"\r\n";
	var result = cordovaCall("HttpController","sendMessage",header,body,ROUTER_IP,ROUTER_PORT);	
	navigator.notification.alert(header + "\n" + body + "\n" + result);
}
function getExternalIp(){
	if(ROUTER_IP == null || ROUTER_PORT == null || DELIVERY_PATH == null){
		getRouterInfo();
	}
	var SOAP_ACTION = "urn:schemas-upnp-org:service:WANIPConnection:1#GetExternalIPAddress";
		        
	var body = 	
		 "<?xml version='1.0' encoding='utf-8'?>"
		+"<s:Envelope s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/' xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>"
		+"<s:Body>"
		+ "<u:GetExternalIPAddress xmlns:u='urn:schemas-upnp-org:service:WANIPConnection:1'>"
		+ "</u:GetExternalIPAddress>"
		+"</s:Body>"
		+"</s:Envelope>";
	  	  
	var header = 
		 "POST " + DELIVERY_PATH + " HTTP/1.1\n"
		+"Host: "+ROUTER_IP+":"+ROUTER_PORT+"\r\n"
		+"SOAPACTION: "+ SOAP_ACTION +"\r\n"
		+"Content-Length: " + body.length +"\r\n"
		+"Content-Type: text/xml; charset='utf-8'\r\n"
		+"\r\n";
	
	var result = cordovaCall("HttpController","sendMessage",header,body,ROUTER_IP,ROUTER_PORT);	
	navigator.notification.alert(header + "\n" + body + "\n" + result);
}
function getRouterInfo(){
	var args = cordovaCall("UPnPController","getRouterInfo",DISCOVER_MESSAGE_ROOTDEVICE,"239.255.255.250",1900);
	DELIVERY_PATH = args[0];
	ROUTER_IP = args[1];
	ROUTER_PORT = args[2];
}

