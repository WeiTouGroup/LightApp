/**
 * Created by lu on 2017/8/2.
 */
(function () {
    var appModel, content;
    nb.define({
        name: 'app.page.main.model.Main',
        parent: 'app.model.Page',
        method: {
            init: function () {
                this._initModel();
                this._initEvent();
            },
            _initModel: function () {
                this.set('footer', new app.page.main.model.Footer());
                content.set('addModel',new app.page.main.model.Add());
            },
            _initEvent: function () {
                var footer = this.get('footer');
                var addModel = content.get('addModel');
                this.onChange({
                    name: 'appModel',
                    scope: this,
                    fn: function (inEvent) {
                        appModel = inEvent.data;
                    }
                });
                this.onChange({
                    name: 'activePageIndex',
                    scope: this,
                    fn: function (inEvent) {
                        var index = inEvent.data;
                        addModel.set('status','');
                        if(index==1){
                            setTimeout(function () {
                                addModel.set('status','am-modal-active');
                            });
                        }
                        footer.set('activeIndex', index);
                        content.set('activePageIndex', index);


                    }
                });
            },
            onReady: function (inHeader, inContent) {
                content = inContent;
                this.parent(inHeader, inContent);
                this.set('activePageIndex', 0);
            }
        }
    });
})();