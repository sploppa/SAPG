package org.apache.cordova.plugin;

import org.apache.cordova.api.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.api.CordovaPlugin;

public class UPnPController extends CordovaPlugin{

	
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("addPortMapping")){
        	this.addPortMapping(args, callbackContext);
        	return true;
        }
        return false;
    }
	
	private void addPortMapping(JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		String forwardToIp = args.getString(0);
		int sendPort = args.getInt(1);
		int receivePort = args.getInt(2);
        UPNP upnp = new UPNP(cordova.getContext());
        String result = upnp.upnpManager(forwardToIp, sendPort, receivePort);
		callbackContext.success(result);
	}
}
