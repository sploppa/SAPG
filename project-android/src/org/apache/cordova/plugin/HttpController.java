package org.apache.cordova.plugin;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * This class echoes a string called from JavaScript.
 */
public class HttpController extends CordovaPlugin {
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("sendMessage")) {         
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
		callbackContext.success(result);
    }

}