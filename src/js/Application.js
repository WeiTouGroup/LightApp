/**
 * Created by PuTi(编程即菩提) 10/19/16.
 */
nb.define({
    name: 'app.Application',
    parent: 'nb.mobile.Application',
    model: 'app.Model',
    slot: {
        extend: ['html', {
            $name: 'audio',
            $type: 'app.view.Audio'
        }]
    },
    method: {
        init: function () {
            var self = this;
            var model = this.getModel();
            $(document).ready(function () {
                var toast = new app.view.Toast();

                var body = document.body;
                toast.$().appendTo(body);

                nb.name('app.view.toast', toast);
                self.resetPageSize();
                model.onChange({
                    name: 'winResultList',
                    scope: this,
                    fn: function (inEvent) {
                        var items = inEvent.data;
                        var opts = {
                            appModel: model,
                            items: inEvent.data
                        };
                        if (items && items.length > 0) {
                            dialogWin.setOpts(opts);
                        } else {
                            dialogLose.setOpts(opts);
                        }

                    }
                });
                model.onChange({
                    name: 'toast',
                    scope: this,
                    fn: function (inEvent) {
                        toast.setOpts(inEvent.data);
                    }
                });
                model.onChange({
                    name: 'getMoreChance',
                    scope: this,
                    fn: function (inEvent) {
                        dialogChance.setOpts({
                            appModel: model,
                            page: inEvent.data
                        });
                    }
                });
                model.onChange({
                    name: 'isNeedInfo',
                    scope: this,
                    fn: function (inEvent) {
                        dialogForm.setOpts({
                            appModel: model
                        });
                    }
                });
                model.onChange({
                    name: 'noChance',
                    scope: this,
                    fn: function (inEvent) {
                        dialogNoChance.setOpts({
                            appModel: model
                        });
                    }
                });
                model.onChange({
                    name: 'moreChance',
                    scope: this,
                    fn: function (inEvent) {
                        dialogNoChance.setOpts({
                            appModel: model
                        });
                    }
                });
                model.onChange({
                    name: 'shareTip',
                    scope: this,
                    fn: function (inEvent) {
                        dialogShareTip.setOpts({});
                    }
                });
                $(body).on('touchmove', function (inEvent) {
                    inEvent.preventDefault();
                });
                self.$('audio', true).setOpts({
                    src: 'music/music.mp3',
                    //auto - 当页面加载后载入整个音频
                    //meta - 当页面加载后只载入元数据
                    //none - 当页面加载后不载入音频
                    preload: false,
                    //是否自动播放
                    auto: false,
                    //是否循环播放
                    loop: false
                });
                model.start();
                $(body).on('touchmove', function (inEvent) {
                    inEvent.preventDefault();
                });
            });
        },
        resetPageSize: function (inWidth, inHeight) {
            var width = inWidth || 320;
            var height = inHeight || 504;
            var screenWidth = document.documentElement.clientWidth;
            var screenHeight = document.documentElement.clientHeight;
            var scale = 1;
            var screenRate = screenWidth / screenHeight;
            var designRate = width / height;
            var model = this.getModel();
            var $content = this.$().find('.nb-m-page-content');
            model.set('screenWidth', screenWidth);
            model.set('screenHeight', screenHeight);
            model.set('screenRate', screenRate);
            if (screenRate > designRate) {
                scale = screenHeight / height;
            } else {
                scale = screenWidth / width;
            }
            model.set('scale', scale);

            $content.find('>.content').css({
                width: width,
                height: height,
                'margin-top': -height / 2,
                'margin-left': -width / 2,
                'transform-origin': 'center center 0px',
                transform: 'scale(' + scale + ')'
            });
            $content.find('>.content-bottom').css({
                width: width,
                height: height,
                'margin-top': -height / 2 + (screenHeight - height * scale) / 2 + 1,
                'margin-left': -width / 2,
                'transform-origin': 'center center 0px',
                transform: 'scale(' + scale + ')'
            });
            $content.find('>.content-top').css({
                width: width,
                height: height,
                'margin-top': -height / 2 - (screenHeight - height * scale) / 2 - 1,
                'margin-left': -width / 2,
                'transform-origin': 'center center 0px',
                transform: 'scale(' + scale + ')'
            });
            $content.find('.content-full').css({
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            });
        }
    }
});