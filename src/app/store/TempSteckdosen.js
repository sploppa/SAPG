Ext.define('MyApp.store.TempSteckdosen', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.Steckdose'
    ],

    config: {
        model: 'MyApp.model.Steckdose',
        storeId: 'TempSteckdosen',
        autoLoad: true,
        data: [
	    	{
	    		name:'New-Dose',
	    		internalIp: '192.168.1.7',
	    	},
	       	{
	    		name:'New-Dose-2',
	    		internalIp: '192.168.1.9',
	    	}
		],
        proxy: {
            type: 'memory',
            id: 'mySteckdoseKey'
        }
    }
});