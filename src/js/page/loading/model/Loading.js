(function () {
    var appModel, content;
    nb.define({
        name: 'app.page.loading.model.Loading',
        parent: 'app.model.Page',
        method: {
            init: function () {
                this.onChange({
                    name: 'appModel',
                    scope: this,
                    fn: function (inEvent) {
                        appModel = inEvent.data;
                    }
                });
            },
            onReady: function (inHeader, inContent) {
                this.parent(inHeader, inContent);
                // this._loadingImages(inContent);
            },
            _loadingImages: function (inContent) {
                var imgLoader = new app.ImageLoader();
                // var depImages = ['./images/door/bg1.jpg', './images/door/bg2.jpg','./images/door/bg3.jpg','./images/door/bg4.jpg','./images/scroll1/scroll.jpg','./images/scroll1/rain1.png','./images/scroll1/rain2.png','./images/scroll1/hand1.png','./images/scroll1/hand2.png'];
                var depImages = [];
                imgLoader.load({
                    imageList: depImages,
                    scope: this,
                    fn: function (inValue) {
                        var self = this;
                        var percent = Math.floor(inValue * 100) + '%';
                        inContent.set('percent', percent, {skipSameValue: false});
                        if (inValue == 1) {
                            setTimeout(function () {
                                // debugger
                                self.set('loadingStatus', true);
                                // appModel.showPage('door');
                            }, 500);
                        }
                    }
                });
            }
        }
    });
})();