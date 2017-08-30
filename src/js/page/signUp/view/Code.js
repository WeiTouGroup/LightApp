/**
 * Created by lu on 2017/8/29.
 */
(function () {
    nb.define({
        name: 'app.page.signUp.view.Code',
        view: {
            'class': 'code',
            $html: [{
                $type: 'app.view.form.InputWithIcon',
                $model: ''
            }, {
                tag:'button',
                disabled:nb.bind('btnDisabled'),
                $text: nb.bind('text')
            }]
        },
        method: {
            init: function () {

            }
        }
    });
})();