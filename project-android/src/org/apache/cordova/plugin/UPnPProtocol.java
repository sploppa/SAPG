package org.apache.cordova.plugin;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringReader;
import java.net.DatagramPacket;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.MulticastSocket;
import java.net.Socket;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import android.util.Log;

public class UPnPProtocol {
	private static final boolean DEBBUGING = true;
	
	public String getRouterInfo(String DISCOVER_MESSAGE_ROOTDEVICE, String MULTICAST_ADDRESS, int MULTICAST_PORT){
		InetAddress multicastAddress;
		String routerIp;
		Integer routerPort;
		String DELIVERY_PATH;
		try {
			multicastAddress = InetAddress.getByName(MULTICAST_ADDRESS);
	
	      // multicast address for SSDP
	      final int port = MULTICAST_PORT; // standard port for SSDP
	      MulticastSocket socket = new MulticastSocket(port); 
	      socket.setReuseAddress(true);
	      socket.setSoTimeout(15000);
	      socket.joinGroup(multicastAddress);
	      
	      // send discover
	      byte[] txbuf = DISCOVER_MESSAGE_ROOTDEVICE.getBytes("UTF-8");
	      DatagramPacket hi = new DatagramPacket(txbuf, txbuf.length, multicastAddress, port);
	      socket.send(hi);
	      System.out.println("SSDP discover sent");
	      
	      
	      //check on message receive
	      boolean gotIt = false;
	      do {
	          byte[] rxbuf = new byte[512];
	          DatagramPacket packet = new DatagramPacket(rxbuf, rxbuf.length);
	          socket.receive(packet);
	          String msg = new String(packet.getData());
	          Log.d("msg", msg);
	          Pattern p = Pattern.compile("HTTP/1.1 200 OK");
	          Matcher m = p.matcher(msg);
	          if(m.find()){
	        	  p = Pattern.compile("LOCATION: .*");
		          m = p.matcher(msg);
		          if(m.find()){
		        	  String url = m.group().replace("LOCATION: " , "");
		        	  p = Pattern.compile("\\d+[.]\\d+[.]\\d+[.]\\d+");
		        	  m = p.matcher(url);
		        	  if(m.find()){
		        		  routerIp = m.group();
			        	  p = Pattern.compile(":\\d+");
			        	  m = p.matcher(url);
			        	  if(m.find()){
				        	  routerPort = Integer.valueOf(m.group().replace(":", ""));
				        	  String xmlDescriptor = getHTML(url);
				        	  if(DEBBUGING)
				        		  Log.d("xmlDescriptor", xmlDescriptor);
				        	  DELIVERY_PATH = getDeliveryPath(xmlDescriptor);
				        	  
				        	  return DELIVERY_PATH+":"+routerIp+":"+routerPort;
			        	  }
		        	  }
		          }
	          }
	          
	        } while (!gotIt); // should leave loop by SocketTimeoutException	      
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "null";
	}
	
	
	private String getHTML(String urlToRead) {
	      URL url;
	      HttpURLConnection conn;
	      BufferedReader rd;
	      String line;
	      String result = "";
	      try {
	         url = new URL(urlToRead);
	         conn = (HttpURLConnection) url.openConnection();
	         conn.setRequestMethod("GET");
	         rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	         while ((line = rd.readLine()) != null) {
	            result += line;
	         }
	         rd.close();
	      } catch (Exception e) {
	         e.printStackTrace();
	      }
	      return result;
	  }
	private String getDeliveryPath(String xmlDescriptor) {
		try {
			DocumentBuilder db = DocumentBuilderFactory.newInstance().newDocumentBuilder();
		    InputSource is = new InputSource();
		    is.setCharacterStream(new StringReader(xmlDescriptor));
		    Document doc = db.parse(is);
			
			
			if(DEBBUGING)
				Log.d("XMLDescriptor","Root element :" + doc.getDocumentElement().getNodeName());
			 
			NodeList nList = doc.getElementsByTagName("service");
		 
			for (int temp = 0; temp < nList.getLength(); temp++) {
		 
				Node nNode = nList.item(temp);
				
				if(DEBBUGING)
					Log.d("XMLDescriptor","\nCurrent Element :" + nNode.getNodeName());
		 
				if (nNode.getNodeType() == Node.ELEMENT_NODE) {
		 
					Element eElement = (Element) nNode;
					if(eElement.getElementsByTagName("serviceType").item(0).getTextContent().equalsIgnoreCase("urn:schemas-upnp-org:service:WANIPConnection:1")){
						return eElement.getElementsByTagName("controlURL").item(0).getTextContent();
					}
				}
			}
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
}
