/**
 * Created by PuTi(编程即菩提) 6/4/16.
 */
(function () {
    var isWeiXin = navigator.userAgent.match('MicroMessenger');
    var hideItems = ['menuItem:share:appMessage', 'menuItem:share:timeline',
        'menuItem:copyUrl', 'menuItem:share:qq', 'menuItem:share:weiboApp',
        'menuItem:favorite', 'menuItem:share:facebook','menuItem:share:QZone','menuItem:openWithQQBrowser','menuItem:openWithSafari'];
    var showItems = ['menuItem:share:appMessage', 'menuItem:share:timeline',
        'menuItem:copyUrl', 'menuItem:share:qq', 'menuItem:share:weiboApp',
        'menuItem:favorite', 'menuItem:share:facebook','menuItem:share:QZone','menuItem:openWithQQBrowser','menuItem:openWithSafari'];
    var shareDataSetFlag = false;
    var config = function (inOpts) {
        var opts = inOpts || {};
        var signature = nb.slide.wx.signature;
        if (!isWeiXin) {
            return;
        }
        wx.ready(function () {
            if (shareDataSetFlag) {
                return;
            }
            wx.hideMenuItems({
                menuList: hideItems,
                success: function (res) {
                },
                fail: function (res) {
                }
            });
        });
        $.ajax({
            //url: 'http://appsupport.humming-tech.com/cgi',
            url:signature.url,
            type: "post",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify({
                //"cmd": "weixin/signature",
                "cmd":signature.cmd,
                "parameters": {
                    "companyCode":opts.companyCode||'',
                    "url":location.href
                }
            }),
            success: function (inData) {
                var statusCode = inData.statusCode;
                if (statusCode == 0) {
                    initWX(inData.response);
                    setShareData(opts);
                }
            }
        });
    };

    var initWX = function (json) {
        wx.config({
//			 debug : true,
            appId: json.appId,
            timestamp: json.timestamp,
            nonceStr: json.nonceStr,
            signature: json.signature,
            jsApiList: ['checkJsApi', 'onMenuShareTimeline',
                'onMenuShareAppMessage', 'hideMenuItems', 'showMenuItems', 'chooseImage', 'uploadImage']
        });
    };


    var setShareData = function (inOpts) {
        var shareData = inOpts.shareData;
        wx.ready(function () {
            shareDataSetFlag = true;
            if(inOpts.allHidden){
                return;
            }
            wx.showMenuItems({
                menuList: showItems,
                success: function (res) {
                },
                fail: function (res) {
                }
            });
            wx.onMenuShareAppMessage({
                title: shareData.title,
                desc: shareData.desc,
                link: shareData.link,
                imgUrl: shareData.imgUrl,
                success: function () {
                    if (inOpts.success) {
                        inOpts.success('app');
                    }
                }
            });
            wx.onMenuShareTimeline({
                title: shareData.timelineTitle || shareData.title,
                desc: shareData.desc,
                link: shareData.timelineLink || shareData.link,
                imgUrl: shareData.imgUrl,
                success: function () {
                    if (inOpts.success) {
                        inOpts.success('timeline');
                    }
                }
            });
            if (inOpts.callback) {
                callback.call(inOpts.scope);
            }
        });
    };
    nb.name('nb.slide.wx', {
        isWeiXin:isWeiXin,
        signature:{
            url:'http://appsupport.humming-tech.com/cgi',
            cmd: "weixin/signature"
        },
        config: config,
        setShareData: setShareData
    });
})();