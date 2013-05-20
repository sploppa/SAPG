/*
 * File: app/controller/SteckdosenMaster.js
 *
 * This file was generated by Sencha Architect version 2.2.1.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.2.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */
var tapEventTime;
var tapOnTimer;
var currentTapLvl=0;
var DISCOVER_MESSAGE_ROOTDEVICE =
    "M-SEARCH * HTTP/1.1\r\n" +
    "ST: urn:schemas-upnp-org:device:InternetGatewayDevice:1\r\n" +
    "MX: 4\r\n" +
    "MAN: \"ssdp:discover\"\r\n" +
    "HOST: 239.255.255.250:1900\r\n\r\n";
var DISCOVER_MESSAGE_IP = "239.255.255.250";
var DISCOVER_MESSAGE_PORT = 1900;

var internalIp = null;
var externalIp = null;
var steckdosenName = null;
var dosenName = null;
var dosenId = null;
var typ = null;
var httpPort = null;
var userName = null;
var password = null;
Ext.define('MyApp.controller.SteckdosenMaster', {
    extend: 'Ext.app.Controller',

    config: {
        models: [
            'Steckdose'
        ],
        stores: [
            'Steckdosen'
        ],

        refs: {
            mySteckdosenList: 'steckdosenList'
        },

        control: {
            "steckdosenList": {
                activate: 'onListActivate',
                itemtaphold: 'onSteckdosenListItemTapHold',
                itemtap: 'onSteckdosenListItemTap'
            },
            "dosenList":{
            	itemtap: 'onSwitchSocketTap',
            	disclose: 'disclose'
            },
            "steckdosenSearchList":{
            	itemtap: 'onSteckdosenSearchListItemTap'
            },
            "button[itemId=addSteckdose]": {
                tap: 'onAddSteckdoseTap'
            },
            "button[itemId=searchSteckdose]": {
                tap: 'onSearchSteckdoseTap'
            },
		   "button[itemId=save]" : {
		    	tap : 'onSaveSteckdoseTap'
		   },
		   "button[itemId=alleUmschalten]" : {
		    	tap : 'onAlleUmschaltenTap'
		   },
		   "button[itemId=alleEinschalten]" : {
		    	tap : 'onAlleEinschaltenTap'
		   },
		   "button[itemId=alleAusschalten]" : {
		    	tap : 'onAlleAusschaltenTap'
		   },
		   "button[itemId=saveTimer]" : {
		    	tap : 'onSaveTimerButtonTap'
		   },
		   "#ext-button-1" : {
		   		tap : 'onBackButtonTap'
		   }
        }
    },

    onListActivate: function(container, newActiveItem, oldActiveItem, eOpts) {
        console.log('Main container is active');
    },

    onSteckdosenListItemTapHold: function(view, index, target, record, event) {
    	tapEventTime = new Date();
    	var editForm = Ext.getCmp('menuTapHold');
    	if(!editForm){
	        editForm = Ext.widget("menuTapHold");
		}
        editForm.showBy(target);
        //Action: Button Tap Edit -> Anzeige Bearbeitungsview
        editForm.down("button[itemId=edit]").on("tap",
	        function(){
	        	console.log('Bearbeiten Klick');
			    steckdosenForm = Ext.Viewport.down('steckdosenEdit');
			    if(!steckdosenForm){
			   		steckdosenForm = Ext.widget("steckdosenEdit");
			   	}
            	steckdosenForm.setRecord(record);
            	steckdosenForm.showBy(target);
            	editForm.hide();
	        }
	    );
	    //Action: Button Tap Delete -> L�schen des Listenelements
        editForm.down("button[itemId=delete]").on("tap",
        	function(){
        		editForm.hide();
        		Ext.Msg.confirm("Sicherheitsabfrage","Sind Sie sicher das Element zu entfernen?", function(antwort){
        			if(antwort=='yes'){
        				var store = Ext.getStore('Steckdosen');
		            	store.remove(store.getById(record.getId()));
		            	Ext.getStore('Steckdosen').sync();
        			}
        		});
        	}
        );
    },

    onAddSteckdoseTap: function(button, e, eOpts) {
        var steckdosenForm = Ext.Viewport.down("steckdosenEdit");
        //Erstellen eines SteckdosenEdit Views, wenn er noch nicht existiert
        if(!steckdosenForm){
            steckdosenForm = Ext.widget("steckdosenEdit");
        } 
        steckdosenForm.reset();
        steckdosenForm.showBy(button);
    },
    
    onSearchSteckdoseTap: function(button, e, eOpts) {
    	var networkState = navigator.network.connection.type;
	    if(networkState == Connection.WIFI){
	    	var tempStore = Ext.getStore('TempSteckdosen');
	    		tempStore.removeAll();
	    	var ListPanel = Ext.Viewport.down('steckdosenSearch');
	    	if(!ListPanel){
	    		ListPanel = Ext.widget("steckdosenSearch");
	    	}
	        ListPanel.showBy(button);
	    	cordova.exec(function(succ){
	    				tempStore.removeAll();
						var steckdosenArray = succ.split(";");
						for(var i in steckdosenArray){
						    var currentSteckdose = steckdosenArray[i];
							var respond = currentSteckdose.split("\n");
		                	var steckdosenName = respond[0];
		                	var mac = respond[1];
		                	var version = respond[2];
		                	var httpPort = respond[3];
		                	var internalIp = respond[4];
		                	var externalIp = null;
		                	cordova.exec(
		                		function(succ2){
		                			var result = succ2.split(":");
									DELIVERY_PATH = result[0];
									ROUTER_IP = result[1];
									ROUTER_PORT = result[2];
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
				                		function(succ3){
				                			var e = succ3.match(/<NewExternalIPAddress[^>]*>.*<\/NewExternalIPAddress[^>]*>/gi);
					  						for(var j=0;j<e.length;++j){
					  							externalIp = e[j].match(/\d*[.]\d*[.]\d*[.]\d*/);
					  						}
					  	                	tempStore.add({
						                		name: steckdosenName,
						                		httpPort: httpPort,
						                		internalIp: internalIp,
						                		externalIp: externalIp,
						                		mac: mac,
						                		version: version
						                	});
				                		},
				                		function(err3){
				                			console.log(err3);
				                			Ext.Msg.alert('ExternalIp Error','Es gab leider ein Problem beim Abfragen der Externen IP');
				                			tempStore.add({
						                		name: steckdosenName,
						                		httpPort: httpPort,
						                		internalIp: internalIp,
						                		externalIp: externalIp,
						                		mac: mac,
						                		version: version
						                	});
				                		},
				                		"HttpController", 
				 						"sendMessage",
				 						[header,body,ROUTER_IP,ROUTER_PORT]
				                	);
		                		},
		                		function(err2){},
		                		"UPnPController", 
		 						"getRouterInfo",
		 						[DISCOVER_MESSAGE_ROOTDEVICE,DISCOVER_MESSAGE_IP,DISCOVER_MESSAGE_PORT]
		                	);
						}
                     },
                     function(err){
                     	console.log(err);
                     	
                     }, "UdpController", "sendBroadcastMessage",
                     ["D","255.255.255.255",30303]
     		);
	    }else{
	    	Ext.Msg.alert('Suchen einer Steckdose im Netzwerk','Diese Funktion ist nur im Wifi-Netzwerk verf&uumlgbar.',Ext.emptyFn);
	    }
    },
    
    onSteckdosenSearchListItemTap:function(view, index, target, record, event) {
    	var steckdosenStore = Ext.getStore('Steckdosen');
    	steckdosenStore.add(record);
    	var tempSteckdosenStore = Ext.getStore('TempSteckdosen');
    	if(tempSteckdosenStore.getCount() > 1){
    		Ext.Msg.confirm("Weiter ?","M&oumlchten Sie noch weitere Dosen aus der Suche hinzuf&uumlgen?", function(antwort){
        			if(antwort=='no'){
        				view.up('panel').hide();
        			}
        		});
    	}else{
    		view.up('panel').hide();
    	}
    },
    
    onSaveSteckdoseTap: function(button, e, eOpts) {
		console.log('Button Click for Save new Steckdose');
		var form = button.up('panel');
		var record = form.getRecord();
		var values = form.getValues();
		console.log(values);
		if(!record){
			var newRecord = new MyApp.model.Steckdose(values);
			newRecord.setDirty();
		   	Ext.getStore('Steckdosen').add(newRecord);
		}
		else {
			record.set(values);
		}
		form.hide();
		Ext.getStore('Steckdosen').sync();
    },
    
    onSteckdosenListItemTap: function(view, index, target, record, event) {
		console.log(record);
    	if (!tapEventTime || (new Date() - tapEventTime > 1000)) {
    		currentTapLvl += 1;
    		tapEventTime = null;
			var dosenPanel = Ext.widget('dosenPanel');
			dosenPanel.config.title = record.data.name;
			internalIp = record.data.internalIp;
			externalIp = record.data.externalIp;
			steckdosenName = record.data.name;
			httpPort = record.data.httpPort;
			typ = record.data.typ;
			userName = record.data.userName;
			password = record.data.password;
			
			if(Ext.getStore(steckdosenName)){
				var store = Ext.getStore(steckdosenName);
			}else{
				var store = Ext.create('Ext.data.Store', {
			        model: 'MyApp.model.Dose',
			        storeId: steckdosenName,
			        autoLoad: true,
			        proxy: {
			            type: 'localstorage',
			            id: 'id'
			        }
				});
			}
			var dosenInfo = this.getDosenInfo(typ);
			var anzahlDosen = dosenInfo.split(":")[0];
			var blockedDosen = dosenInfo.split(":")[1];
			if(anzahlDosen<store.getCount){
				store.removeAll();
			}
			for(var i=1;i<=anzahlDosen;i++){
				if(i<=blockedDosen){
					store.add({
			    		id: 'on',
			    		idName: 'Dose On',
			    		name: 'Dosenname',
			    		status_url: 'img/power_on.png'
					});
					blockedDosen -= 1;
					i = 0;
				}else{
					store.add({
			    		id: i,
			    		idName: 'Dose '+i,
			    		name: 'Dosenname',
			    		status_url: 'img/power_off.png'
					});
				}
			}
			dosenPanel.down('dosenList').setStore(store);
			
			var ip = null;
			if(externalIp){
				ip = externalIp;
			}else{
				ip = internalIp;
			}
			var dosenInfo = this.getDosenInfo(typ);
			var anzahlDosen = dosenInfo.split(":")[0];
			this.read_rel(ip, userName, password,  steckdosenName, anzahlDosen);
		  	view.up('navigationview').push(dosenPanel);
		  	
		  	Ext.getCmp("addSteckdose").hide();
		   	Ext.getCmp("searchSteckdose").hide();
		}
    },
    
    onBackButtonTap: function(button){
    	currentTapLvl -= 1;
    	if(currentTapLvl <= 0){
    		Ext.getCmp("addSteckdose").show();
	   		Ext.getCmp("searchSteckdose").show();
	   	}
    },
    onSwitchSocketTap: function(view, index, target, record, event){
    	if(!tapOnTimer){
    		if(index==0 && typ == 'Home'){
    			Ext.Msg.alert('Nicht m&ouml;glich', 'Steckdose 1 kann nicht geschaltet werden.\nSie ist dauerhaft an.');
    		}else{
				var ip = null;
				if(externalIp){
					ip = externalIp;
				}else{
					ip = internalIp;
				}
				console.log("Switch Socket " + index);
				// Set status
				var indexArray = new Array();
				indexArray[0]=record.data.id;
				this.set_rel(indexArray,ip, userName,password);
				
				var dosenInfo = this.getDosenInfo(typ);
				var anzahlDosen = dosenInfo.split(":")[0];

				// Get status
				this.read_rel(ip,userName,password,steckdosenName,anzahlDosen);
    		}
		}
		tapOnTimer = false;
    },
    onAlleUmschaltenTap: function(button){
		this.buttonDosenPanelTap(button,'s');
    },
    onAlleEinschaltenTap: function(button){
    	this.buttonDosenPanelTap(button,'1');
    },
    onAlleAusschaltenTap: function(button){
    	this.buttonDosenPanelTap(button,'0');
    },
    onBackup: function(button){
       	xhttp=new XMLHttpRequest();

		var OPEN = 'http://192.168.1.9/dd.htm?DD2';
	
		xhttp.open('POST',OPEN,false);
		xhttp.setRequestHeader("Content-type","text/plain");
		xhttp.setRequestHeader("Authorization","Basic " + Base64.encode('admin:anel'));
		xhttp.send('TN=Bla');
		alert(xhttp.responseText + " " + xhttp.status);
    },
    getDosenInfo: function(typ){
    		var anzahlDosen 	= 0;
			var anzahlIo 		= 0;
			var blockedDosen 	= 0;
			switch(typ){
					case "Home":
						anzahlDosen = 3;
						blockedDosen = 1;
						break;
					case "Pro":
					case "ADV":
						anzahlDosen = 8;
						break;
					case "HUT":
					case "IO":
						anzahlDosen = 8;
						anzahlIo = 8;
						break;
					default:
						anzahlDosen = 8;
						break;
			}
			return anzahlDosen+":"+blockedDosen;
    },
    read_rel: function(ip,user,pass, steckdosenName, anzahlDosen){
		xhttp=new XMLHttpRequest();
	
		var OPEN = 'http://' + ip + '/strg.cfg?Auth:'+ user+pass 
		// z.B. "http://net-control/strg.cfg?Auth:user7anel"
	
		xhttp.open('GET',OPEN,false);
		xhttp.send("");
		
		var Strg_Var = xhttp.responseText.split(";");
		
		if(Strg_Var[58]=='end') // Pr�ft ob die �bertragung vollst�ndig ist. 
		{
			var Geraetename 	= Strg_Var[0];
			var Hostname 	= Strg_Var[1];
			var IP 			= Strg_Var[2];
			var Maske 		= Strg_Var[3];
			var Gateway 	= Strg_Var[4];
			var MAC 		= Strg_Var[5];
			var Port 		= Strg_Var[6];
			
			var Temteratur 	= Strg_Var[7];
			var	Typ 		= Strg_Var[8];
			
			var Rel_Name = new Array();
			var Rel_Stand = new Array();
			var Rel_Dis = new Array();
			var Rel_Info = new Array();
			var Rel_TK = new Array();
			var store = Ext.getStore(steckdosenName);
			for(i=0;i<anzahlDosen;i++)
			{
				Rel_Name[i] 	= Strg_Var[10+i];
				Rel_Stand[i] 	= Strg_Var[20+i];
				Rel_Dis[i] 		= Strg_Var[30+i];
				Rel_Info[i] 	= Strg_Var[40+i];
				Rel_TK[i] 		= Strg_Var[50+i];
				var index = store.find('id',i+1);
				var element = store.getAt(index);
				element.set('name',Rel_Name[i]);
				element.set('status',Rel_Stand[i]);
				if(Rel_Stand[i]==0){
					element.set('status_url','img/power_off.png');
				}else{
					element.set('status_url','img/power_on.png');
				}
				
			}
			console.log('Relais &Uumlbertragung vollst&aumlndig.');
		}
		else Ext.Msg.alert('Verbindungsprobleme!');
    },
    set_rel: function(DosenIndexArray, ip, user, pass){
		for(var i in DosenIndexArray){
			console.log((DosenIndexArray[i])+ " wird geschaltet");
			xhttp=new XMLHttpRequest();
		
			var OPEN = 'http://' + ip + '/ctrl.htm?Auth:' + user + pass;
			// z.B. "http://net-control/ctrl.htm?Auth:user7anel"
		
			xhttp.open('POST',OPEN,false);
			xhttp.setRequestHeader("Content-type","text/plain");
			xhttp.send("F"+(DosenIndexArray[i]-1)+"=S");
		}
	},
	buttonDosenPanelTap: function(button,task){
		var ip = null;
		if(externalIp){
			ip = externalIp;
		}else{
			ip = internalIp;
		}
		var indexArray = new Array();
		var anzahlDosen = this.getDosenInfo(typ).split(':')[0];
		var store = Ext.getStore(steckdosenName);
		for(var i=0;i<anzahlDosen;i++){
			var index = store.find('id',i+1);
			var element = store.getAt(index);
			switch(task){
				case '0':
					if(element.get('status') == 1){
						indexArray.push(i+1);
					}
					break;
				case '1':
					if(element.get('status') == 0){
						indexArray.push(i+1);
					}
					break;
				case 's':
					indexArray.push(i+1);
					break;
			}
		}
		this.set_rel(indexArray, ip, userName, password);
		this.read_rel(ip,userName,password, steckdosenName, anzahlDosen);
	},
	disclose: function(list, record, node, index, event, eOpts){
		currentTapLvl += 1;
		event.stopEvent(); //stop listItemTap 
		timerView = Ext.widget('timer');
		dosenName = record.data.name;
		dosenId   = record.data.id;
		timerView.config.title = dosenName;
		timerView.down('textfield').setValue(record.data.name);
		var timerStore = Ext.create('Ext.data.Store', {
			        model: 'MyApp.model.Timer',
			        storeId: dosenName+dosenId,
			        autoLoad: true,
			        proxy: {
			            type: 'localstorage',
			            id: 'id'
			        }
				});
		timerView.down('list').setStore(timerStore);
		Ext.getCmp('DosenList').up('navigationview').push(timerView);
		this.checkDosenTimer();
	},
    checkDosenTimer: function(){
    	var ip = null;
		if(externalIp){
			ip = externalIp;
		}else{
			ip = internalIp;
		}
    	var header =
			"GET /dd.htm?DD" + dosenId + " HTTP/1.1\r\n"
			+"Host: " + ip + "\r\n"
			+"Connection: keep-alive\r\n"
			+"Authorization: Basic " + Base64.encode(userName+":"+password) + "\r\n"
			+"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
			+"User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31\r\n"
			+"Referer: http://" + ip + "\r\n"
			+"Accept-Encoding: gzip,deflate,sdch\r\n"
			+"Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
			+"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3;\r\n\r\n";
			
		cordova.exec(
			function(succ){
				var timerStore = Ext.getStore(dosenName+dosenId);
			
				var e = succ.match(/.*<html>/gi);
				var domText = succ.replace(e,"<html>");
				var doc = document.implementation.createHTMLDocument("example");
				doc.documentElement.innerHTML = domText;
				
				dosenName = doc.getElementsByName("TN")[0].getAttribute("value");
				
				var parameterPerDose = 4;
				var maxTimerAnzahl = 10;
				var bezeichner = "T";
				
				for(var i = 0; i < maxTimerAnzahl; i++){
					var checked = null;
					var days = null;
					var startTime = null;
					var endTime = null;
					
					for(var j = 0; j < parameterPerDose;j++){
						switch(j){
							case 0:
								checked = doc.getElementsByName((bezeichner + j ) + i )[0].hasAttribute("checked");
								if(checked){checked = 'checked'}else{checked = 'unchecked'};
								break;
							case 1:
								days = doc.getElementsByName((bezeichner + j) + i )[0].getAttribute("value"); 
								break;
							case 2:
								startTime = doc.getElementsByName((bezeichner + j) + i )[0].getAttribute("value"); 
								break;
							case 3:
								endTime = doc.getElementsByName((bezeichner + j) + i )[0].getAttribute("value"); 
								break;
						}
					}
					
					//Format der Wiederholen an Store anpassen
					var MO = DI = MI = DO = FR = SA = SO = 'noWdhDay';
					var daysNumbers = days;				
					var days = days.split('');
					for(var k in days){
						var day = days[k];
						switch(day){
							case "1":
								MO = "wdhDay";
								break;
							case "2":
								DI = "wdhDay";
								break;
							case "3":
								MI = "wdhDay";
								break;
							case "4":
								DO = "wdhDay";
								break;
							case "5":
								FR = "wdhDay";
								break;
							case "6":
								SA = "wdhDay";
								break;
							case "7":
								SO = "wdhDay";
								break;
						}
					}
					timerStore.add({
					    id: (i+1), 
					    name: 'Timer '+(i+1),
					    MO: MO,
					    DI: DO,
					    MI: MO,
					    DO: DO,
					    FR: FR,
					    SA: SA,
					    SO: SO,
					    days: daysNumbers,
					    startTime: startTime, 
					    endTime: endTime, 
					    checked: checked,
					});
				}
			},
			function(err){
				console.log("Error bei HTTPController sendMessage: "+err);
			},
			"HttpController",
			"sendMessage",
			[header,"",ip,httpPort]
		);
    },
    onSaveTimerButtonTap: function(button){
		var timerStore = Ext.getStore(dosenName+dosenId);

		dosenName = Ext.getCmp('dosenName').getValue();
		var body = "TN="+dosenName;
		for(var i = 1; i <= timerStore.getCount(); i++){
			var index = timerStore.find('id',i);
			var timer = timerStore.getAt(index)
			var startTime = timer.data.startTime;
			var endTime = timer.data.endTime;
			var days = timer.data.days;
			var checked = timer.data.checked;
			if(checked=="checked"){
				checked="on";
			}else{
				checked="off";
			}
			body += ("&T0"+(i-1))+"="+checked+("&T1"+(i-1))+"="+startTime+("&T2"+(i-1))+"="+endTime+("&T3"+(i-1))+"="+days;
		}
		body += "&TS=speichern";
		var ip = null;
		if(externalIp){
			ip = externalIp;
		}else{
			ip = internalIp;
		}
		var header =
			"POST /dd.htm HTTP/1.1\r\n"
			+"Host: "+ip+"\r\n"
			+"Connection: keep-alive\r\n"
			+"Content-Length: " + body.length + "\r\n"
			+"Cache-Control: max-age=0\r\n"
			+"Authorization: Basic " + Base64.encode(userName+":"+password) + "\r\n"
			+"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
			+"Origin: "+ip+"\r\n"
			+"User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31\r\n"
			+"Content-Type: application/x-www-form-urlencoded\r\n"
			+"Referer: http://"+ip+"/dd.htm?DD" + dosenId + "\r\n"
			+"Accept-Encoding: gzip,deflate,sdch\r\n"
			+"Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
			+"Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3\r\n\r\n";
		
		cordova.exec(
			function(succ){
				alert(succ);
			},
			function(err){
				alert(err);
			},
			"HttpController",
			"sendMessage",
			[header, body, ip, httpPort]
		);
    }
});