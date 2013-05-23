package org.apache.cordova.plugin;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.util.Log;

public class Tcp {
	@SuppressWarnings("finally")
	public String sendMessage(String header,String body, String routerIp, int routerPort) {
        String respond = "";
        Socket socket = null ;
		try {
		        //Create socket
		        socket = new Socket(routerIp, routerPort);
		        socket.setSoTimeout(10000);
		        //Send header
		        BufferedWriter  wr = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(),"UTF-8"));
		        // You can use "UTF8" for compatibility with the Microsoft virtual machine.
		        
				wr.write(header);
		        wr.flush();
		        //Send data
		        wr.write(body);
		        wr.flush();
		  			
		        // Response
		        BufferedReader rd = new BufferedReader(new InputStreamReader(socket.getInputStream()));
		        String line;

		        while((line = rd.readLine()) != null)
		        	respond += line;
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Error e){
			e.printStackTrace();
			
		}finally{
	        final Pattern p = Pattern.compile("errorCode");
	        final Matcher m = p.matcher(respond);
	        if(!(m.find())){
	        	return respond;
	        }else{
	        	return "no Respond from " + routerIp + " on Port:" + routerPort;
	        }
		}		
	}
}
