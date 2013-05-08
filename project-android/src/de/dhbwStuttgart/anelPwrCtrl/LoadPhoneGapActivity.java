package de.dhbwStuttgart.anelPwrCtrl;

import android.os.Bundle;
import org.apache.cordova.*;

public class LoadPhoneGapActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/src/app.html");
        super.appView.getSettings().setAllowFileAccess(true);        
        super.appView.getSettings().setDatabaseEnabled(true);
        super.appView.getSettings().setDatabasePath("/data/data/" + appView.getContext().getPackageName() + "/databases/");
        super.appView.getSettings().setDomStorageEnabled(true);
    }    
}
