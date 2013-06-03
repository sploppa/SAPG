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
        	},
        	{
        		name: 'Coffee',
        		photo: 'img/coffee_icon.png'
        	},
           	{
        		name: 'Dvd',
        		photo: 'img/dvd_icon.png'
        	},
           	{
        		name: 'Harddisk',
        		photo: 'img/harddisk_icon.png'
        	},
        	{
        		name: 'Heater',
        		photo: 'img/heater_icon.png'
        	},
           	{
        		name: 'Lamp',
        		photo: 'img/lamp_icon.png'
        	},
           	{
        		name: 'Laptop',
        		photo: 'img/laptop_icon.png'
        	},
        	{
        		name: 'Music',
        		photo: 'img/music_icon.png'
        	},
           	{
        		name: 'Pc',
        		photo: 'img/pc_icon.png'
        	},
           	{
        		name: 'Power',
        		photo: 'img/power_icon.png'
        	},
        	{
        		name: 'PowerOff',
        		photo: 'img/power_off.png'
        	},
           	{
        		name: 'PowerOn',
        		photo: 'img/power_on.png'
        	},
           	{
        		name: 'Radio',
        		photo: 'img/radio_icon.png'
        	},
        	{
        		name: 'Socket',
        		photo: 'img/socket_icon.png'
        	},
           	{
        		name: 'Storage',
        		photo: 'img/storage_icon.png'
        	},
           	{
        		name: 'Tv',
        		photo: 'img/tv_icon.png'
        	}
        ],
        proxy: {
            type: 'localstorage',
            id: 'myPhotosKey'
        }
    }
});