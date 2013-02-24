package org.apache.cordova.plugin;

import java.util.Random;

import org.teleal.cling.*;
import org.teleal.cling.android.AndroidUpnpServiceConfiguration;
import org.teleal.cling.model.types.UnsignedIntegerTwoBytes;
import org.teleal.cling.support.igd.PortMappingListener;
import org.teleal.cling.support.model.PortMapping;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiManager;

public class UPNP extends Activity{
	Context mContext;
	static int tries = 10;
	public UPNP(Context context) {
		mContext = context;
		tries=10;
	}

	public String upnpManager(String forwardToIp, int sendPort, int receivePort) {
		
		WifiManager wifi = (WifiManager) mContext.getSystemService(Context.WIFI_SERVICE);
		UpnpService upnpService =
                new UpnpServiceImpl(
                        new AndroidUpnpServiceConfiguration(wifi)
                );
		
		
		/**
		 *  Send Mapping
		 */
		final PortMapping sendMapping = new PortMapping();

		sendMapping.setDescription("Anel-PwrCtrl_SendPort");
		sendMapping.setInternalClient(forwardToIp);
		sendMapping.setProtocol(PortMapping.Protocol.UDP);
		
		sendMapping.setInternalPort(new UnsignedIntegerTwoBytes(sendPort));
		final Random randomGenerator = new Random();
		
		int randomInt = randomGenerator.nextInt(64510);
		sendMapping.setExternalPort(new UnsignedIntegerTwoBytes(1025+randomInt));
		
		
        upnpService.getControlPoint().getRegistry().addListener(new PortMappingListener(sendMapping));
        /**
         *  Receive Mapping
         */
		final PortMapping receiveMapping = new PortMapping();

		receiveMapping.setDescription("Anel-PwrCtrl_ReceivePort");
		receiveMapping.setInternalClient(forwardToIp);
		receiveMapping.setProtocol(PortMapping.Protocol.UDP);
		
		receiveMapping.setInternalPort(new UnsignedIntegerTwoBytes(receivePort));
		
		randomInt = randomGenerator.nextInt(64510);
		receiveMapping.setExternalPort(new UnsignedIntegerTwoBytes(1025+randomInt));
		
        upnpService.getControlPoint().getRegistry().addListener(new PortMappingListener(receiveMapping));
		upnpService.getControlPoint().search();
		
		Long externalSendPort = sendMapping.getExternalPort().getValue();
		Long externalReceivePort = receiveMapping.getExternalPort().getValue();
		String totalMapping = externalSendPort+":"+forwardToIp+":"+sendPort+";"+externalReceivePort+":"+forwardToIp+":"+receivePort;
        
		return totalMapping;
	}
}
