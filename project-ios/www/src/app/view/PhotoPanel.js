Ext.define('MyApp.view.PhotoPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.photoPanel',

    config: {
        fullscreen: false,
        left: 0,
        top: 0,
        tplWriteMode: 'insertAfter',
        floating: true,
        hideOnMaskTap: true,
        height: '50%',
        width:  '98%',
        layout: {
            type: 'fit'
        },
        modal: true,
        items: [
            {
                xtype: 'photoList',
            }
        ]
    }

});