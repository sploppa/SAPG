package org.apache.cordova.plugin;

import java.io.IOException;

import org.apache.cordova.api.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.http.client.ClientProtocolException;

public class UPnPController extends CordovaPlugin{
	
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
       /* if (action.equals("addPortMapping")){
        	this.addPortMapping(args, callbackContext);
        	return true;
        }else if (action.equals("deletePortMapping")){
        	this.deletePortMapping(args, callbackContext);
        	return true;
        }else if (action.equals("getExternalIp")){
        	this.getExternalIp(args, callbackContext);
        	return true;
        }else*/ if (action.equals("getRouterInfo")){
        	this.getRouterInfo(args, callbackContext);
        	return true;
        }else if (action.equals("sendMessage")){
        	this.sendMessage(args, callbackContext);
        	return true;
        }
        return false;
    }
private void sendMessage(JSONArray args, CallbackContext callbackContext) throws JSONException {
	String header = args.getString(0);
	String body = args.getString(1);
	String routerIp = args.getString(2);
	int routerPort = args.getInt(3);
	Tcp tcp = new Tcp();
	String result = tcp.sendMessage(header,body,routerIp,routerPort);
	HttpConnection h = new HttpConnection();
	try {
		h.excutePost("", "");
	} catch (ClientProtocolException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	callbackContext.success(result);
	}
	/*	private void getExternalIp(JSONArray args, CallbackContext callbackContext) {
		UPnPProtocol upnp = new UPnPProtocol();
		String externalIp = upnp.getExternalIp();
			callbackContext.success(externalIp);
	}
	private void addPortMapping(JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		String forwardToIp = args.getString(0);
		int sendPort = args.getInt(1);
		int receivePort = args.getInt(2);
		UPnPProtocol upnp = new UPnPProtocol();
		String result = upnp.addPortMapping(forwardToIp, sendPort, receivePort);
		callbackContext.success(result);
	}
	private void deletePortMapping(JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		int externalSendPort = args.getInt(0);
		int externalReceivePort = args.getInt(1);
		UPnPProtocol upnp = new UPnPProtocol();
		if(upnp.deletePortMapping(externalSendPort, externalReceivePort));
			callbackContext.success("success");
	}*/
	private void getRouterInfo(JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		String DISCOVER_MESSAGE_ROOTDEVICE = args.getString(0);
		String MULTICAST_ADDRESS = args.getString(1);
		int MULTICAST_PORT = args.getInt(2);
		UPnPProtocol upnp = new UPnPProtocol();
		String[] result = upnp.getRouterInfo(DISCOVER_MESSAGE_ROOTDEVICE, MULTICAST_ADDRESS, MULTICAST_PORT).split(":");
		JSONArray json = new JSONArray();
		for(String r:result)
			json.put(r);
		callbackContext.success(json);
		
	}
}
