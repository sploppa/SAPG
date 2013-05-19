Ext.define('MyApp.view.SearchList', {
    extend: 'Ext.Container',
    alias: 'widget.searchList',

    config: {
        layout: {
            type: 'fit',
        },
        items: [
            {
                xtype: 'list',
                flex: 1,
                height: 899,
                store: 'TempSteckdosen',
                fullscreen: true,
                itemTpl: [
                    '{name}'
                ]
            },
            {
                xtype: 'button',
                docked: 'bottom',
                text: 'MyButton9'
            }
        ]
    }

});