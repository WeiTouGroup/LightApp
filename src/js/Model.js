/**
 * Created by PuTi(编程即菩提) 10/19/16.
 */
(function () {
    var appId = 'test20170426';
    nb.define({
        name: 'app.Model',
        parent: 'nb.mobile.Model',
        method: {
            init: function () {
                var self = this;
                var paramMap = app.util.getURLParams();
                var code = paramMap['code'];
                var state = paramMap['state'];

                this.set('wxCode', code);
                // this.set('defaultPage', 'main');
                if(state != 'STATE'){
                    this.set('pOpenId',state);
                }

                var wx = nb.slide.wx;
                var config = app.config;
                var serverURL = config.serverURL;
                var shareData = {
                    imgUrl: serverURL + '/images/shareWX.jpg',
                    link: serverURL + '/index.html',
                    title: '测试',
                    timelineTitle: '测试 测试 测试  测试',
                    desc: '测试，我只偷偷告诉你！'
                };
                wx.signature = {
                    url: config.cgiUrl,
                    cmd: 'social/weixin/signature'
                };
                nb.name('app.shareData', shareData);
                this._configWX();
            },
            start: function () {
                this._getWXuser();
            },
            _configWX:function(){
                var wx = nb.slide.wx;
                var self = this;
                wx.config({
                    //companyCode: 'byd',
                    shareData: app.shareData,
                    //allHidden:true,
                    success: function (inType) {
                        var type = 2;
                        if (inType == 'timeline') {
                            type = 3;
                        }
                        var data = {
                            openId: self.get('openIdMD5'),
                            actionType: type,
                            appId: appId
                        };
                        app.io.trace({
                            data: data
                        });
                    }
                });
            },
            _getWXuser: function () {
                app.io.getWXUser({
                    data: {
                        code: this.get('wxCode')
                    },
                    scope: this,
                    success: function (inResp) {
                        var openId = inResp.openid;
                        var openIdMD5 = md5(openId);
                        this.set('openId', openId);
                        this.set('openIdMD5', openIdMD5);
                        app.shareData.link += '?state=' + openIdMD5;
                        this._configWX();
                        app.io.trace({
                            scope:this,
                            data: {
                                pOpenId:this.get('pOpenId'),
                                openId: openIdMD5,
                                actionType: 1,
                                appId: appId
                            }
                        });
                    }
                });
            }
        }
    });
})();
