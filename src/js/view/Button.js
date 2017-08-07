/**
 * Created by lu on 2017/8/6.
 */
(function () {
    nb.define({
        name: 'app.view.Button',
        view:{
            tag:'button',
            type:'button',
            'class':['am-btn',nb.bind('colorStyle'),nb.bind('sizeStyle')],
            $text:nb.bind('text'),
            disabled:nb.bind('disabled')
        },
        method: {
            init: function () {

            }
        }
    });
})();