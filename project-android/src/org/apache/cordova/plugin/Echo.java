package org.apache.cordova.plugin;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import de.dhbwStuttgart.anelPwrCtrl.LoadPhoneGapActivity;

import android.annotation.SuppressLint;
import android.widget.Toast;

/**
 * This class echoes a string called from JavaScript.
 */
public class Echo extends CordovaPlugin {
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("echo")) {
            String message = args.getString(0); 
            this.echo(message, callbackContext);
            return true;
        } else if (action.equals("blubba")) {
            String message = args.getString(0); 
            this.echo(message, callbackContext);
            return true;
        }
        return false;
    }

	private void echo(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) { 
            callbackContext.success(message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }
	private void blubba(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) { 
            callbackContext.success(message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }
}