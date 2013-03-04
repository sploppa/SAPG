package org.apache.cordova.plugin;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.teleal.common.util.ByteArray;


/**
 * This class echoes a string called from JavaScript.
 */
public class UdpController extends CordovaPlugin {
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("switchPower")) {         
            this.switchPower(args, callbackContext);
            return true;
        }
        if (action.equals("activatePortForwarding")){
        	this.activatePortForwarding(args, callbackContext);
        	return true;
        }
        return false;
    }

	private void activatePortForwarding(JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		String forwardToIp = args.getString(0);
		int sendPort = args.getInt(1);
		int receivePort = args.getInt(2);
        UPNP upnp = new UPNP(cordova.getContext());
        String result = upnp.upnpManager(forwardToIp, sendPort, receivePort);
		callbackContext.success(result);
	}

	private void switchPower(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String command = args.getString(0);
        String ip = args.getString(1);
        int sendPort = args.getInt(2);
        int receivePort = args.getInt(3);

        try {
			DatagramSocket sendSocket = new DatagramSocket();
			DatagramSocket receiveSocket = new DatagramSocket(receivePort);
			
			InetAddress theServer = InetAddress.getByName(ip);
			sendSocket.connect(theServer,sendPort);
			
			DatagramPacket sendPacket;
			InetAddress sendServerAddress;
	
			// the place to store the sending and receiving data
			byte[] inBuffer = new byte[500];
			byte[] outBuffer = new byte[50];
			String message = command;
			
			new HttpConnection().excutePost("http://fritz.box", "test");
			
			outBuffer = message.getBytes();
	
			System.out.println("Message sending is : " + message);
	
			DatagramPacket receivePacket = new DatagramPacket(inBuffer, inBuffer.length);
			
			// the server details
			sendServerAddress = sendSocket.getInetAddress();
	
			// build up a packet to send to the server
			sendPacket = new DatagramPacket(outBuffer, outBuffer.length, sendServerAddress, sendPort);
			// send the data
			sendSocket.send(sendPacket);
			      
			receiveSocket.setSoTimeout(1000);
			
            try {
            	receiveSocket.receive(receivePacket);
            	
            	inBuffer = receivePacket.getData(); 
            	String result = new String(inBuffer);
    			callbackContext.success(result);
    	        sendSocket.close();
    	        receiveSocket.close();
            }
            catch (SocketTimeoutException e) {
                // timeout exception.
            	String result = new String(inBuffer);
            	result= result.trim();
            	if(result.equals("")){
            		callbackContext.error("Timeout");
            	}
                sendSocket.close();
                receiveSocket.close();
            }    			
		} catch (IOException ExceIO)
		{
			callbackContext.error("Client getting data error : "+ExceIO.getMessage());
		}
    }
private String toString(byte[] byteArray){
    char[] charray = new char[byteArray.length]; 
    for (int i=0;i<=byteArray.length-1;i++) 
    { 
      Byte bt = new Byte(byteArray[i]); 
      charray[i]=(char) bt.intValue(); 
    } 
    return new String (charray); 
}
}