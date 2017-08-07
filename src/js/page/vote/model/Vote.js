/**
 * Created by lu on 2017/8/2.
 */
(function () {
    var appModel, content, header;
    nb.define({
        name: 'app.page.vote.model.Vote',
        parent: 'app.model.Page',
        method: {
            init: function () {
                this._initModel();
                this._initEvent();
            },
            _initModel: function () {
               content.set('titleModel',new app.page.vote.model.Title());
               content.set('desModel',new app.page.vote.model.Des());
               content.set('optionsModel',new app.page.vote.model.Options());
               content.set('radioModel',new app.page.vote.model.Radio());
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
                header = inHeader;
                content = inContent;
                inHeader.set('title','创建投票');
            }
        }
    });
})();