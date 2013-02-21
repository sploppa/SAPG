package org.apache.cordova.plugin;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;


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
        return false;
    }

	private void switchPower(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String user = args.getString(0);
        String pw = args.getString(1);
        String command = args.getString(2);
        String socket = args.getString(3);
        String ip = args.getString(4);
        int port = args.getInt(5);
          
        UPNP upnp = new UPNP(cordova.getContext());
        upnp.upnpManager();

        
        DatagramSocket theSocket = null;
		try {
			theSocket = new DatagramSocket();
			
			// but if you want to connect to your remote server, then alter the theServer address below
			InetAddress theServer = InetAddress.getByName(ip);
			theSocket.connect(theServer,port);
 
			System.out.println("Client socket created");
		}catch (SocketException ExceSocket)
		{
			System.out.println("Socket creation error  : "+ExceSocket.getMessage());
		} 
		catch (UnknownHostException ExceHost)
		{
			System.out.println("Socket host unknown : "+ExceHost.getMessage());
		}
		
		DatagramPacket theSendPacket;
		DatagramPacket theReceivedPacket;
		InetAddress theServerAddress;
		byte[] outBuffer;
		byte[] inBuffer;
 
		// the place to store the sending and receiving data
		inBuffer = new byte[500];
		outBuffer = new byte[50];
		try {
			String message = command + socket + user + pw;
			outBuffer = message.getBytes();
 
			System.out.println("Message sending is : " + message);
 
			// the server details
			theServerAddress = theSocket.getInetAddress();
 
			// build up a packet to send to the server
			theSendPacket = new DatagramPacket(outBuffer, outBuffer.length, theServerAddress, port);
			// send the data
			theSocket.send(theSendPacket);

		      // Create a packet to receive data into the buffer
		    //theReceivedPacket = new DatagramPacket(inBuffer, inBuffer.length);
			//theSocket2.receive(theReceivedPacket);
			
			theSocket.close();
		} catch (IOException ExceIO)
		{
			callbackContext.error("Client getting data error : "+ExceIO.getMessage());
		}
		callbackContext.success("call success");
    }
}