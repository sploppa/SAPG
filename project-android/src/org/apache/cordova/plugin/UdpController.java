package org.apache.cordova.plugin;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketTimeoutException;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;


/**
 * This class echoes a string called from JavaScript.
 */
public class UdpController extends CordovaPlugin {
	String result="";
	
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("sendBroadcastMessage")) {         
            this.sendBroadcastMessage(args, callbackContext);
            return true;
        }
        return false;
    }

	private void sendBroadcastMessage(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String command = args.getString(0);
        String ip = args.getString(1);
        int port = args.getInt(2);
        DatagramSocket socket = null;
        try {
        	//result = "";
        	socket = new DatagramSocket(port);
        	socket.setSoTimeout(3000);
        	socket.setBroadcast(true);
        	InetAddress IPAddress = InetAddress.getByName(ip);           
        	byte[] sendData = new byte[1];
        	sendData= command.getBytes();
        	DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, port);
        	socket.send(sendPacket);        
        	boolean gotIt = false;
        	do{
        		String temp = null;
	        	byte[] receiveData = new byte[256];
	        	DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
	        	socket.receive(receivePacket);
	        	System.out.println(receivePacket.getLength());
	        	temp = new String(receivePacket.getData());
	        	temp = temp.substring(0, receivePacket.getLength());
	        	if(!temp.matches(command)){
	        		temp += "\n" + receivePacket.getAddress().toString().replace("/", "");
	        		if(result == ""){
	        			result = temp;
	        		}else{
	        			result += ";"+temp;
	        		}
	        	}
        	}while(!gotIt);
        	socket.close();
        	callbackContext.success(result);
        	
		} catch(SocketTimeoutException e){
			callbackContext.success(result);
		}
        catch (IOException ExceIO)
		{
			callbackContext.error("Client getting data error : "+ExceIO.getMessage());
		}finally{
			socket.close();
		}
    }
}