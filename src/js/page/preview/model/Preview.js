/**
 * Created by lu on 2017/8/2.
 */
(function () {
    var appModel, content;
    nb.define({
        name: 'app.page.preview.model.Preview',
        parent: 'app.model.Page',
        method: {
            init: function () {
                this._initModel();
                this._initEvent();
            },
            _initModel: function () {

            },
            _initEvent: function () {
                this.onChange({
                    name: 'appModel',
                    scope: this,
                    fn: function (inEvent) {
                        appModel = inEvent.data;




                    }
                });
            },
            onReady: function (inHeader, inContent) {
                content = inContent;

            }
        }
    });
})();