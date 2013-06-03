Ext.define('MyApp.view.PhotoList', {
    extend: 'Ext.Container',
    alias: 'widget.photoList',

    config: {
        layout: {
            type: 'fit',
        },
        disableSelection: true,
        items: [
            {
                xtype: 'dataview',
                store: 'Photos',
                itemId: 'photoList',
                inline: true,
                itemTpl: [
                    '<img src="{photo}" width=60  height=60 />'
                ]
            }
        ]
    }

});