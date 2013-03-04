package org.apache.cordova.plugin;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.Socket;
import java.net.URL;
import java.net.URLConnection;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;

import android.util.Log;

public class HttpConnection {
	 public static String excutePost(String targetURL, String urlParameters) throws ClientProtocolException, IOException
	  {
		 
		    String SOAP_ACTION = "urn:schemas-upnp-org:service:WANIPConnection:1#AddPortMapping";
		    try {
		        String xmldata = "<?xml version='1.0' encoding='utf-8'?>"
		        	    +"<s:Envelope s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/' xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>"
		        	    +"<s:Body>"
		        	    + "<u:AddPortMapping xmlns:u='urn:schemas-upnp-org:service:WANIPConnection:1'>"
		        	    + "<NewRemoteHost></NewRemoteHost>"
		        	    + "<NewExternalPort>5190</NewExternalPort>"
		        	    + "<NewProtocol>UDP</NewProtocol>"
		        	    + "<NewInternalPort>5190</NewInternalPort>"
		        	    + "<NewInternalClient>192.168.1.100</NewInternalClient>"
		        	    + "<NewEnabled>1</NewEnabled>"
		        	    + "<NewPortMappingDescription>My New Port Mapping</NewPortMappingDescription>"
		        	    + "<NewLeaseDuration>0</NewLeaseDuration>"
		        	    + "</u:AddPortMapping>"
		        	    +"</s:Body>"
		        	    +"</s:Envelope>";

		        //Create socket
		        String host = "192.168.1.1";
		        int port = 49000;
		        Socket sock = new Socket(host, port);

		        //Send header
		        BufferedWriter  wr = new BufferedWriter(new OutputStreamWriter(sock.getOutputStream(),"UTF-8"));
		        // You can use "UTF8" for compatibility with the Microsoft virtual machine.
		        wr.write("POST /upnp/control/WANIPConn1 HTTP/1.1\n");
		        wr.write("Host: 192.168.1.1:49000\n");
		        wr.write("SOAPACTION: "+ SOAP_ACTION +"\n");
		        wr.write("Content-Length: " + xmldata.length() +"\n");
		        wr.write("Content-Type: text/xml; charset='utf-8'\n");
		        wr.write("\n");
		        wr.flush();
		        //Send data
		        wr.write(xmldata);
		        wr.flush();
		  			
		        // Response
		        BufferedReader rd = new BufferedReader(new InputStreamReader(sock.getInputStream()));
		        String line;
		        while((line = rd.readLine()) != null)
		        	Log.d("rest", line);
		      } catch (Exception e) {
		        e.printStackTrace();
		      }
			return urlParameters;
	  }
}
