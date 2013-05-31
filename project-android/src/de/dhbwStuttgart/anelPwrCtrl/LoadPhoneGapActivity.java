package de.dhbwStuttgart.anelPwrCtrl;

import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.os.Bundle;

import org.apache.cordova.*;

public class LoadPhoneGapActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl("file:///android_asset/www/src/app.html", 10000);
        super.appView.getSettings().setAllowFileAccess(true);        
        super.appView.getSettings().setDatabaseEnabled(true);
        super.appView.getSettings().setDatabasePath("/data/data/" + appView.getContext().getPackageName() + "/databases/");
        super.appView.getSettings().setDomStorageEnabled(true);
        boolean xlarge = ((getApplicationContext().getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == 4);
        boolean large = ((getApplicationContext().getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE);
        if(xlarge || large)
        	setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
    }    
}
