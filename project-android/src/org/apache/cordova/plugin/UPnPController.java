package org.apache.cordova.plugin;

import org.apache.cordova.api.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.api.CordovaPlugin;

public class UPnPController extends CordovaPlugin{
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if (action.equals("getRouterInfo")){
        	this.getRouterInfo(args, callbackContext);
        	return true;
        }
        return false;
    }
	private void getRouterInfo(JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		String DISCOVER_MESSAGE_ROOTDEVICE = args.getString(0);
		String MULTICAST_ADDRESS = args.getString(1);
		int MULTICAST_PORT = args.getInt(2);
		UPnPProtocol upnp = new UPnPProtocol();
		String result = upnp.getRouterInfo(DISCOVER_MESSAGE_ROOTDEVICE, MULTICAST_ADDRESS, MULTICAST_PORT);
		callbackContext.success(result);
	}
}
