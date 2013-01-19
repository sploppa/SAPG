package de.dhbwStuttgart.anelPwrCtrl;

import android.os.Bundle;
import org.apache.cordova.*;

public class LoadPhoneGapActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }    
}
