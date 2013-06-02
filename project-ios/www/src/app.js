/*
 * File: app.js
 *
 * This file was generated by Sencha Architect version 2.2.1.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.2.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 */

//@require @packageOverrides
Ext.Loader.setConfig({

});

Ext.application({
    models: [
        'Steckdose',
        'Dose',
        'Timer',
        'Photo'
    ],
    stores: [
        'Steckdosen',
        'Dosen',
        'Timers',
        'TempSteckdosen',
        'Photos'
    ],
    views: [
        'DosenPanel',
        'NavigationTabs',
        'TimerPanel',
        'SteckdosenList',
        'SteckdosenEdit',
        'MenuTapHold',
        'DosenList',
        'SteckdosenSearch',
        'SteckdosenSearchList',
        'TimerEdit',
        'TimerList',
        'PhotoList',
        'PhotoPanel'
    ],
    controllers: [
        'SteckdosenMaster'
    ],
    name: 'MyApp',

    launch: function() {
    
    	// set up a listener to handle the back button for Android 
        if (Ext.os.is('Android')) {
          document.addEventListener("backbutton", Ext.bind(onBackKeyDown, this), false);  // add back button listener
 
          function onBackKeyDown(e) {
          		Ext.Msg.confirm("Verlassen ? ","M&oumlchten Sie die Anwendung verlassen?", function(antwort){
        			if(antwort=='no'){
        				e.preventDefault();
        			}else{
        				navigator.app.exitApp();
        			}
        		});
          }
       	}

        Ext.create('MyApp.view.NavigationTabs', {fullscreen: true});
    }

});