Ext.define('MyApp.store.Photos', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.Photo'
    ],

    config: {
        model: 'MyApp.model.Photo',
        storeId: 'Photos',
        autoLoad: true,
        data:[
        	{
        		name: 'Beamer',
        		photo: 'img/beamer_icon.png'
        	},
           	{
        		name: 'Bolt',
        		photo: 'img/bolt_icon.png'
        	},
           	{
        		name: 'ChristmasTree',
        		photo: 'img/christmas_tree_icon.png'
        	}
        ],
        proxy: {
            type: 'localstorage',
            id: 'myPhotosKey'
        }
    }
});