Ext.override(Ext.Picker, {
	cls:'timePicker',
	initComponent : function() {
       	if (Ext.isDefined(this.showDoneButton)) {
            console.warn("[Ext.Picker] showDoneButton config is deprecated. Please use doneButton instead");
        }

        if (Ext.isDefined(this.doneText)) {
            console.warn("[Ext.Picker] doneText config is deprecated. Please use doneButton instead");
            this.doneButton = this.doneText;
        }
        this.addEvents(
            'pick',
            'change',
            'cancel'
        );            
        this.layout = {
            type: 'hbox',
            align: 'stretch'
        };
		 if (this.slots) {
            this.items = this.items ? (Ext.isArray(this.items) ? this.items : [this.items]) : [];
            this.items = this.items.concat(this.slots);
        }       
        if (this.useTitles) {
            this.defaults = Ext.applyIf(this.defaults || {}, {title: ''});            
        }
		this.on('slotpick', this.onSlotPick, this);
		if (this.doneButton || this.cancelButton) {
            var toolbarItems = [];
            if (this.cancelButton) {
                toolbarItems.push(
                    Ext.apply(
                        {
                            handler: this.onCancelButtonTap,
                            scope: this
                        },
                        ((Ext.isObject(this.cancelButton) ? this.cancelButton : { text: String(this.cancelButton) }))
                    )
                );
            }
            toolbarItems.push({xtype: 'spacer'});
            if (this.doneButton) {
                toolbarItems.push(
                    Ext.apply(
                        {
                            ui: 'action',
                            handler: this.onDoneButtonTap,
                            scope: this
                        },
                        ((Ext.isObject(this.doneButton) ? this.doneButton : { text: String(this.doneButton) }))
                    )
                );
            }
            this.toolbar = new Ext.Toolbar(Ext.applyIf(this.buttonBar || {
				cls:'topToolbar',
                dock: 'top',
                items: toolbarItems,
                defaults: {
                    xtype: 'button'
                }
            }));
			this.titleBar = false;
			var titleItems = [];
			if(this.useTitles){
				Ext.each(this.items, function(item){
					titleItems.push({html:item.title, flex:item.flex});						  
				});
				this.titleBar = new Ext.Panel({
					cls:'topTitleToolbar',
					items: titleItems,
					defaults: {
						xtype: 'panel',						
					},
					layout:{
						type:'hbox'
					}
				});
			}        
            this.dockedItems = this.dockedItems ? (Ext.isArray(this.dockedItems) ? this.dockedItems : [this.dockedItems]) : [];
			if(this.titleBar){
				this.dockedItems.push(this.titleBar);
			}else{
				this.componentCls +=' withoutTitle';	
			}
			this.dockedItems.push(this.toolbar);
        }
        Ext.Picker.superclass.initComponent.call(this);
    }	 
});
/**
 * @class Ext.AlertTimePicker
 * @extends Ext.Picker
 *
 * <p>A date picker component which shows a AlertTimePicker on the screen. This class extends from {@link Ext.Picker} and {@link Ext.Sheet} so it is a popup.</p>
 * <p>This component has no required properties.</p>
 *
 *
 * @constructor
 * Create a new List
 * @param {Object} config The config object
 * @xtype AlertTimePicker
 */
Ext.AlertTimePicker = Ext.extend(Ext.Picker, {
	cls:'timePicker alertTimePicker',
	countText:'#/Day',
	sTimeText:'Start',
	eTimeText:'Stop',
     /**
     * @cfg {Array} slotOrder
     * An array of strings that specifies the order of the slots. Defaults to <tt>['count', 'sTime', 'eTime']</tt>.
     */
    slotOrder: ['count', 'sTime', 'eTime'],
	ampm:['AM', 'PM'],
	padText:'&nbsp;',
	height:340,
	message:'Set Custom Start, Stop, Frequency, and<br /> Days for your Reminders.',
	countMin:1,
	countMax:4,
    initComponent: function() {
		var me 		= this, count	= [], i;
        for(i=this.countMin;i<=this.countMax;i++){
            count.push({
                text:(i>9)?i:me.padText+i,
                value:i 
            });
        }		
		function time(){
			var j, k, sTime=[], AMPM;
			for (i = 0; i<24 ; i++) {
				AMPM 	= (i>11)?'PM':'AM';
				k=j=i;
				if(i>12){k = i-12;}
				if(k==0){
					k=12;
				}
				if(k<10){
					k	= me.padText+''+k;
				}				
				sTime.push({
					text:k+''+AMPM,
					value:j
				});
			}
			return sTime;
		}		
        this.slots = [];
        this.slotOrder.forEach(function(item){
            this.slots.push(this.createSlot(item, count, time(), time()));
        }, this);
		this.messagePanel = new Ext.Panel({
			cls:'messagePanel',
			html:me.message	   
		});
		this.dockedItems = new Ext.Panel({
			cls:'topCustomToolbar',
			items:[this.messagePanel,{
				cls:'topDaysToolbar',
				labelAlign:'top',
				defaults: {
					xtype: 'checkboxfield',
					labelAlign:'top',
					flex1:1
				},
				layout:{
					type:'hbox',
					pack:'justify'
				},
				items:[{label:'Sun', name:'sun'},{label:'Mon', name:'mon'},{label:'Tue', name:'tue'},{label:'Wed', name:'wed'},{label:'Thu', name:'thu'},{label:'Fri', name:'fri'},{label:'Sat', name:'sat'}]
			}]
		});
        Ext.AlertTimePicker.superclass.initComponent.call(this);
    },
    setValue: function(values, animated) {
       	Ext.AlertTimePicker.superclass.setValue.apply(this, arguments);
		var day, dayBar = this.dockedItems.items[0].items.items[1];
		Ext.iterate(values, function(key, value) {									
			day = dayBar.child('[name=' + key + ']');
			if(day) {
				day.setChecked(value);
			}
		}, this);
        return this;
    },
    getValue: function() {
		var values = Ext.AlertTimePicker.superclass.getValue.apply(this);
        var day, dayBar = this.dockedItems.items[0].items.items[1];
		dayBar.items.each(function(day) {
			values[day.name]= day.isChecked();
		}, this);
        return values;
    },
    afterRender: function() {
        Ext.AlertTimePicker.superclass.afterRender.apply(this, arguments);
        this.setValue(this.value);
    },
	onDoneButtonTap : function() {
		var anim = this.animSheet('exit');
		Ext.apply(anim, {
			after: function() {
				this.fireEvent('change', this, this.getValue());
			},
			scope: this
		});
		this.hide(anim);   
    },
    createSlot: function(name, count, sTime, eTime){
        switch (name) {
            case 'count':
                return {
                    name: name,
                    align: 'center',
                    data: count,
                    title: this.useTitles ? this.countText : false,
                    flex: 5
                };
            case 'sTime':
                return {
                    name: name,
                    align:'center',
                    data: sTime,
                    title: this.useTitles ? this.sTimeText : false,
                    flex: 4
                };
            case 'eTime':
                return {
                    name: name,
                    align: 'center',
                    data: eTime,
                    title: this.useTitles ? this.eTimeText : false,
                    flex: 4
                };
        }
    }
});

Ext.reg('AlertTimePicker', Ext.AlertTimePicker);