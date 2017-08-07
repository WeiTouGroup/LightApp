/**
 * Created by PuTi(编程即菩提) 1/21/17.
 */
(function () {
    var isWeiXin = navigator.userAgent.match('MicroMessenger');
    nb.define({
        name: 'app.view.Audio',
        view: {
            $html: [{
                $name: 'audio',
                tag: 'audio'
            }, {
                $name: 'btn',
                'class': 'btn-audio',
                $html: {
                    tag: 'i'
                }
            }]
        },
        method: {
            init: function () {
                var self = this;
                var audio = this._audio = this.$('audio')[0];
                var $btn = this.$('btn');
                $btn.on('click', function () {
                    if ($btn.hasClass('on')) {
                        self.stop();
                    } else {
                        self.play();
                    }
                });
            },
            play: function () {
                var self = this;
                if (isWeiXin) {
                    wx.ready(function () {
                        self._audio.play();
                    })
                } else {
                    this._audio.play();
                }
                this.$('btn').removeClass('off').addClass('on');
            },
            stop: function () {
                this._audio.pause();
                this.$('btn').removeClass('on').addClass('off');
            },
            setOpts: function (inOpts) {
                var $audio = this.$('audio');
                var audio = this._audio;
                var opts = inOpts || {};
                var src = opts.src;
                var preload = opts.preload || 'auto';
                var auto = opts.auto != false;
                var loop = opts.loop != false;
                var wx = window.wx;
                audio.volume = 1;
                $audio.attr('preload', preload);
                if (auto) {
                    $audio.attr('autoplay', 'autoplay');
                } else {
                    $audio.removeAttr('autoplay');
                }
                if (loop) {
                    $audio.attr('loop', 'loop');
                } else {
                    $audio.removeAttr('loop');
                }
                $audio.empty();
                if (src) {
                    $audio.html('<source src="' + src + '"/>');
                }
                audio.pause();
                if (auto) {
                    this.play();
                }

            }
        }
    })
})();