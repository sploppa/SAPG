var DISCOVER_MESSAGE_ROOTDEVICE =
    "M-SEARCH * HTTP/1.1\r\n" +
    "ST: urn:schemas-upnp-org:device:InternetGatewayDevice:1\r\n" +
    "MX: 4\r\n" +
    "MAN: \"ssdp:discover\"\r\n" +
    "HOST: 239.255.255.250:1900\r\n\r\n";
var DELIVERY_PATH;
var ROUTER_IP;
var ROUTER_PORT;
var c;

function switchSocket(){
	for (var i = 0; i < switchSocket.arguments.length; i++){
    var socket = switchSocket.arguments[i]-1;	
    var body = "F" + socket + "=?";
	var header = 
		 "POST /ctrl.htm HTTP/1.1\r\n"
		+"Host: 134.3.176.91\r\n"
		+"Proxy-Connection: keep-alive\r\n"
		+"Content-Length: 4\r\n"
		+"Cache-Control: max-age=0\r\n"
		+"Authorization: Basic YWRtaW46YW5lbA==\r\n"
		+"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
		+"Origin: http://134.3.176.91\r\n"
		+"User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22\r\n"
		+"Content-Type: application/x-www-form-urlencoded\r\n"
		+"Referer: http://134.3.176.91/ctrl.htm\r\n"
		+"Accept-Encoding: gzip,deflate,sdch\r\n"
		+"Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
		+"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3;\r\n\r\n";

        cordova.exec(function(succ){
        				checkStatus();
  						 var e = succ.match(/<input [^>]*>/gi);
  						 
  						 for(var j=0;j<e.length;++j){
  						 	var cSocket = e[j].match(/name=F\d/);
  						 	var cValue = e[j].match(/value=./);
  						 	if(cSocket && cValue){
	  						 	cSocket = cSocket[0].replace(/name=F/,'');
	  						 	cValue = cValue[0].replace(/value=/,'');
	  						 	if( cValue.match(/I/i)){
	  						 		changeImage(parseInt(cSocket)+1,1);
	  						 	}else if(cValue.match(/O/i)){
	  						 		changeImage(parseInt(cSocket)+1,0);
	  						 	}	
  						 	}
  						 }
                     },
                     function(err){
                     	navigator.notification.alert(err);
                     }, "HttpController", "sendMessage",
                     [header,body,"134.3.176.91",80]
     	);
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
		cordova.exec(
			function(succ){
				var result = succ.split(":");
				DELIVERY_PATH = result[0];
				ROUTER_IP = result[1];
				ROUTER_PORT = result[2];
				localStorage.setItem("DELIVERY_PATH" , DELIVERY_PATH);
				localStorage.setItem("ROUTER_IP" , ROUTER_IP);
				localStorage.setItem("ROUTER_PORT" , ROUTER_PORT);
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
				
				cordova.exec(
					function(succ){
						var e = succ.match(/<NewExternalIPAddress[^>]*>.*<\/NewExternalIPAddress[^>]*>/gi);
  						 
  						 for(var j=0;j<e.length;++j){
  						 	var address = e[j].match(/\d*[.]\d*[.]\d*[.]\d*/);
  							localStorage.setItem("EXTERNAL_IP" , address);
  							alert(address);
  						 }
				 	},
					function(err){
				 		navigator.notification.alert(err);
				 	}, 
				 	"HttpController", 
				 	"sendMessage",
				 	[header,body,ROUTER_IP,ROUTER_PORT]
		   		);
		 	},
			function(err){
		 		navigator.notification.alert(err);
		 	}, 
		 	"UPnPController", 
		 	"getRouterInfo",
		 	[DISCOVER_MESSAGE_ROOTDEVICE,"239.255.255.250",1900]
   		);
	}
}
function getRouterInfo(){
	var args = cordovaCall("UPnPController","getRouterInfo",DISCOVER_MESSAGE_ROOTDEVICE,"239.255.255.250",1900);
    navigator.notification.alert(args);
}

function checkStatus(){
	var header = 
		 "GET /strg.cfg HTTP/1.1\r\n"
		+"Host: 134.3.176.91\r\n"
		+"Proxy-Connection: keep-alive\r\n"
		+"Authorization: Basic YWRtaW46YW5lbA==\r\n"
		+"Accept: */*"
		+"User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22\r\n"
		+"Referer: http://134.3.176.91/ctrl.htm\r\n"
		+"Accept-Encoding: gzip,deflate,sdch\r\n"
		+"Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
		+"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3;\r\n\r\n";

        cordova.exec(function(succ){
        				
        			 	var e = succ.split(";");
        			 	var cSocket = 1;
        			 	for(var i=20;i<23;i++){
        			 		var j = parseInt(e[i]);
        			 		changeImage(cSocket,j);
        			 		cSocket++;
        			 	}
        			 },
                     function(err){
                     	navigator.notification.alert(err);
                     }, 
                     "HttpController", 
                     "sendMessage",
                     [header,"","134.3.176.91",80]
      	);
}

function checkDosenSetting(doseNr){
	var header =
	"GET /dd.htm?DD" + doseNr + " HTTP/1.1\r\n"
	+"Host: 134.3.176.91\r\n"
	+"Connection: keep-alive\r\n"
	+"Authorization: Basic YWRtaW46YW5lbA==\r\n"
	+"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
	+"User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31\r\n"
	+"Referer: http://134.3.176.91\r\n"
	+"Accept-Encoding: gzip,deflate,sdch\r\n"
	+"Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
	+"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3;\r\n\r\n";
	cordova.exec(
		function(succ){
			var e = succ.match(/<input [^>]*>/gi);
			 for(var j=0;j<e.length;++j){
			 	var cSocket = e[j].match(/name=\"TN\"/);
			 	var cValue = e[j].match(/value=\".*\"/);
			 	if(cSocket && cValue){
				 	cSocket = cSocket[0].replace(/name=/,'');
				 	cValue = cValue[0].replace(/value=/,'');
				 	cValue = cValue.replace(/\"/g,'');
				 	document.getElementById("socket_name_"+doseNr).innerHTML = cValue;
				 	document.getElementById("TN").value = cValue;
			 	}
			 	var cTimer = e[j].match(/name=\"T1\d\"/);
			 	var cValue = e[j].match(/value=\".*\"/);
			 	if(cTimer && cValue){
				 	cTimer = cTimer[0].replace(/name=\"T1/,'');
				 	cTimer = cTimer[0].replace(/\"/g,'');
				 	cValue = cValue[0].replace(/value=/,'');
				 	cValue = cValue.replace(/\"/g,'');
				 	document.getElementById("T1"+cTimer).value = cValue;
			 	}
			 	var cTcheckBox = e[j].match(/name=\"T0\d\"/);
			 	var cValue = e[j].match(/checked/);
			 	if(cTcheckBox && cValue != null){
			 		cTcheckBox = cTcheckBox[0].replace(/name=\"T0/,'');
				 	cTcheckBox = cTcheckBox[0].replace(/\"/g,'');
				 	document.getElementById("T0"+cTcheckBox).checked = true;	
			 	}else if(cTcheckBox && cValue == null){
			 		cTcheckBox = cTcheckBox[0].replace(/name=\"T0/,'');
				 	cTcheckBox = cTcheckBox[0].replace(/\"/g,'');
				 	document.getElementById("T0"+cTcheckBox).checked = false;
			 	}
			  	var cTtime = e[j].match(/name=\"T2\d\"/);
			 	var cValue = e[j].match(/value=\".*\"/);
			 	if(cTtime && cValue){
			 		cTtime = cTtime[0].replace(/name=\"T2/,'');
			 		cTtime = cTtime[0].replace(/\"/g,'');
				 	cValue = cValue[0].replace(/value=/,'');
				 	cValue = cValue.replace(/\"/g,'');
				 	document.getElementById("T2"+cTtime).value = cValue;
			 	}
			  	var cTtime = e[j].match(/name=\"T3\d\"/);
			 	var cValue = e[j].match(/value=\".*\"/);
			 	if(cTtime && cValue){
			 		cTtime = cTtime[0].replace(/name=\"T3/,'');
			 		cTtime = cTtime[0].replace(/\"/g,'');
				 	cValue = cValue[0].replace(/value=/,'');
				 	cValue = cValue.replace(/\"/g,'');
				 	document.getElementById("T3"+cTtime).value = cValue;
			 	}
			 	var cSocket = e[j].match(/name=\"TF\"/);
			 	var cChecked = e[j].match(/checked/);
			 	var cValue = e[j].match(/value=\".*\"/);
			 	if(cSocket && cChecked != null){
			 		cValue = cValue[0].replace(/value=/,'');
				 	cValue = cValue.replace(/\"/g,'');
				 	document.getElementById("TF"+cValue).checked = true;	
			 	}else if(cSocket && cChecked == null){
			 		cValue = cValue[0].replace(/value=/,'');
				 	cValue = cValue.replace(/\"/g,'');
				 	document.getElementById("TF"+cValue).checked = false;
			 	}
			 	var cSocket = e[j].match(/name=\"TH\"/);
			 	var cChecked = e[j].match(/checked/);
			 	if(cSocket && cChecked != null){
				 	document.getElementById("TH").checked = true;	
			 	}else if(cSocket && cChecked == null){
				 	document.getElementById("TH").checked = false;
			 	}
			 }
	 	},
		function(err){
	 		navigator.notification.alert(err);
	 	}, 
	 	"HttpController", 
	 	"sendMessage",
	 	[header,"","134.3.176.91",80]
   		);
}

function updateDoseSetting(doseNr){
	var tn = document.getElementById("TN").value;
		tn = tn.replace(/ /,'+');
		
	var t10 = document.getElementById("T10").value;
	var t20 = document.getElementById("T20").value;
		t20 = t20.replace(/\:/,'%3A');
	var t30 = document.getElementById("T30").value;
		t30 = t30.replace(/\:/,'%3A');
	
	var t11 = document.getElementById("T11").value;
	var t21 = document.getElementById("T21").value;
		t21 = t21.replace(/\:/,'%3A');
	var t31 = document.getElementById("T31").value;
		t31 = t31.replace(/\:/,'%3A');
	
	var t12 = document.getElementById("T12").value;
	var t22 = document.getElementById("T22").value;
		t22 = t22.replace(/\:/,'%3A');
	var t32 = document.getElementById("T32").value;
		t32 = t32.replace(/\:/,'%3A');
	
	var t13 = document.getElementById("T13").value;
	var t23 = document.getElementById("T23").value;
		t23 = t23.replace(/\:/,'%3A');
	var t33 = document.getElementById("T33").value;
		t33 = t33.replace(/\:/,'%3A');
		
	var t14 = document.getElementById("T14").value;
	var t24 = document.getElementById("T24").value;
		t24 = t24.replace(/\:/,'%3A');
	var t34 = document.getElementById("T34").value;
		t34 = t34.replace(/\:/,'%3A');
	var tf = "e";
	var elements = document.getElementsByName("TF");

    for (var i=0, len=elements.length; i<len; ++i)
        if (elements[i].checked) tf = elements[i].value;
	var body = "TN=" + tn;
	if(document.getElementById("T00").checked) body = body + "&T00=on";
		body = body + "&T10="+t10+"&T20="+t20+"&T30="+t30;
	if(document.getElementById("T01").checked) body = body + "&T01=on";
		body = body + "&T11="+t11+"&T21="+t21+"&T31="+t31;
	if(document.getElementById("T02").checked) body = body + "&T02=on";
		body = body + "&T12="+t12+"&T22="+t22+"&T32="+t32;
	if(document.getElementById("T03").checked) body = body + "&T03=on";
		body = body + "&T13="+t13+"&T23="+t23+"&T33="+t33;
	if(document.getElementById("T04").checked) body = body + "&T04=on";
		body = body + "&T14="+t14+"&T24="+t24+"&T34="+t34+"&TF="+tf;
	if(document.getElementById("TH").checked) body = body + "&TH=on";
		body = body + "&TS=Speichern";
	var header =
		"POST /dd.htm HTTP/1.1\r\n"
		+"Host: 134.3.176.91\r\n"
		+"Connection: keep-alive\r\n"
		+"Content-Length: " + body.length + "\r\n"
		+"Cache-Control: max-age=0\r\n"
		+"Authorization: Basic YWRtaW46YW5lbA==\r\n"
		+"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
		+"Origin: 134.3.176.91\r\n"
		+"User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31\r\n"
		+"Content-Type: application/x-www-form-urlencoded\r\n"
		+"Referer: http://134.3.176.91/dd.htm?DD" + doseNr + "\r\n"
		+"Accept-Encoding: gzip,deflate,sdch\r\n"
		+"Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
		+"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3\r\n\r\n";
		
		cordova.exec(
			function(succ){
				checkDosenSetting(doseNr);
		 	},
			function(err){
		 		navigator.notification.alert(err);
		 	}, 
		 	"HttpController", 
		 	"sendMessage",
		 	[header,body,"134.3.176.91",80]
   		);
}

function checkSteckdosenleisteSetting(){
	var header = 
		"GET /netcfg.htm HTTP/1.1\r\n"
		+"Host: 134.3.176.91\r\n"
		+"Connection: keep-alive\r\n"
		+"Authorization: Basic YWRtaW46YW5lbA==\r\n"
		+"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
		+"User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31\r\n"
		+"Referer: http://134.3.176.91/\r\n"
		+"Accept-Encoding: gzip,deflate,sdch\r\n"
		+"Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
		+"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3\r\n\r\n";
		
		cordova.exec(
		function(succ){
			var e = succ.match(/<input [^>]*>/gi);
			 for(var j=0;j<e.length;++j){
			 	var cSocket = e[j].match(/name=\"host\"/);
			 	var cValue = e[j].match(/value=\".*\"/);
			 	if(cSocket && cValue){
				 	cValue = cValue[0].replace(/value=/,'');
				 	cValue = cValue.replace(/\"/g,'');
				 	document.getElementById("SN").value = cValue;
			 	}
			 	
			 	var cSocket = e[j].match(/name=\"port\"/);
			 	var cValue = e[j].match(/value=\d+/);
			 	if(cSocket && cValue){
				 	cValue = cValue[0].replace(/value=/,'');
				 	document.getElementById("SP").value = cValue;
			 	}
			 }
	 	},
		function(err){
	 		navigator.notification.alert(err);
	 	}, 
	 	"HttpController", 
	 	"sendMessage",
	 	[header,"","134.3.176.91",80]
   		);
}

function updateSteckdosenleisteSetting(){
	var socketName = document.getElementById("SN").value;
		socketName = socketName.replace(/ /,'+');
	var port = document.getElementById("SP").value;
	alert(socketName);
	alert(port+ ";")
	var body = "host="+socketName+"&dhcp=on&zc=on&port="+port+"&udp=on&uds=8080&ude=8080&ff=0";
	var header = 
		"POST /netcfg.htm HTTP/1.1\r\n"
		+"Host: 134.3.176.91\r\n"
		+"Connection: keep-alive\r\n"
		+"Content-Length: " + body.length + "\r\n"
		+"Cache-Control: max-age=0\r\n"
		+"Authorization: Basic YWRtaW46YW5lbA==\r\n"
		+"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
		+"Origin: http://134.3.176.91\r\n"
		+"User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31\r\n"
		+"Content-Type: application/x-www-form-urlencoded\r\n"
		+"Referer: http://134.3.176.91/netcfg.htm\r\n"
		+"Accept-Encoding: gzip,deflate,sdch\r\n"
		+"Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
		+"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3\r\n\r\n";
		
		cordova.exec(
			function(succ){
		 	},
			function(err){
		 		navigator.notification.alert(err);
		 	}, 
		 	"HttpController", 
		 	"sendMessage",
		 	[header,body,"134.3.176.91",80]
   		);
}

