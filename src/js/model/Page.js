/**
 * Created by PuTi(编程即菩提) 11/25/16.
 */
nb.define({
    name:'app.model.Page',
    parent: 'nb.mobile.model.Page',
    method:{
        onReady: function (inHeader, inContent) {
            var options = inHeader.get('options');
            inHeader.set('visible',false);
            this.onChange({
                name: 'next',
                scope: this,
                fn: function (inEvent) {
                    var key = inEvent.data;
                    if(this.get('activeStatus') == 'active'){
                        this.get('appModel').showPage(key);
                    }
                }
            });
            this.onChange({
                name: 'previous',
                scope: this,
                fn: function (inEvent) {
                    if(this.get('activeStatus') == 'active') {
                        this.get('appModel').hidePage();
                    }
                }
            });
        },
        onEnter: function () {
            var content = this.get('content');
            content.set('enterPage', new Date());
            this.set('pageEnterLeaveStatus', 'enter');
        }
    }
});