/**
 * Created by lu on 2017/8/21.
 */
(function () {
    nb.define({
        name: 'app.page.signUp.view.Content',
        view: {
            'class': 'content-full',
            $html: [{
                'class': ['page-content', nb.bind('status')],
                $html: [{
                    'class': 'phone',
                    $html: {
                        $type: 'app.view.form.InputWithIcon',
                        $model: 'phoneModel'
                    }
                }, {
                    $name: 'code',
                    $type: 'app.page.signUp.view.Code',
                    $model: 'codeModel'
                }, {
                    $name: 'btn',
                    $type: 'app.view.Button',
                    $model: 'buttonModel'
                }, {
                    'class': 'register-tips',
                    $html: nb.bind('registerTips')
                }]
            }]
        },
        method: {
            init: function () {
                var self = this;
                this.$('btn').on('click', function () {
                    var model = self.getModel();
                    model.set('clickBtn', new Date());
                });
                this.$('code').on('click', 'button', function () {
                    var model = self.getModel();
                    model.set('requireRegisterCode', new Date());
                });
            }
        }
    });
})();