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
            },
            _initEvent: function () {
                var footer = this.get('footer');
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
                        content.set('activePageIndex', index);
                        footer.set('activeIndex', index);
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