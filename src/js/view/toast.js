/**
 * Created by PuTi(编程即菩提) 6/27/16.
 */
(function () {
    nb.define({
        name: 'app.view.Toast',
        model:'nb.Model',
        view: {
            tag: 'p',
            'class': ['app-toast', nb.bind('visible')],
            $html: {
                $name: 'text',
                tag: 'span',
                $text:nb.bind('text')
            }
        },
        method: {
            setOpts: function (inOpts) {
                var self = this;
                var model = this.getModel();
                var opts = inOpts || {};
                var duration = opts.duration || 3;
                if (this._timeout1) {
                    clearTimeout(this._timeout1);
                }
                if (this._timeout2) {
                    clearTimeout(this._timeout2);
                }
                model.set('visible','fadeIn');
                model.set('text',opts.text);
                this._timeout1 = setTimeout(function () {
                    model.set('visible','fadeOut');
                    self._timeout2 = setTimeout(function(){
                        model.set('visible','');
                    },1000);
                }, duration * 1000);
            }
        }
    });
})();
