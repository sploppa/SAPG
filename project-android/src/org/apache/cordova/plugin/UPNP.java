package org.apache.cordova.plugin;

import org.teleal.cling.*;
import org.teleal.cling.android.AndroidUpnpServiceConfiguration;
import org.teleal.cling.support.igd.PortMappingListener;
import org.teleal.cling.support.model.PortMapping;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiManager;

public class UPNP extends Activity{
	Context mContext;
	public UPNP(Context context) {
		mContext = context;
	}

	public void upnpManager() {
		PortMapping desiredMapping = 
		        new PortMapping( 
		                75, 
		                "192.168.1.8", 
		                PortMapping.Protocol.TCP, 
		                "My Port Mapping" 
		        ); 

		WifiManager wifi = (WifiManager) mContext.getSystemService(Context.WIFI_SERVICE);
		
		UpnpService upnpService =
                new UpnpServiceImpl(
                        new AndroidUpnpServiceConfiguration(wifi)
                );

        upnpService.getRegistry().addListener(new PortMappingListener(desiredMapping));


		upnpService.getControlPoint().search(); 
	}
}
