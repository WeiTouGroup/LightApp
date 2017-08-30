/**
 * Created by lu on 2017/8/5.
 */
(function () {
    nb.define({
        name: 'app.page.signUp.model.Code',
        parent: 'app.model.Input',
        method: {
            init: function () {
                this.setOpts({
                    icon: 'am-icon-envelope-o',
                    type: 'tel',
                    maxlength:'4',
                    placeholder: '请输入验证码',
                    emptyIcon:true
                });
            },
            check: function () {
                var value = this.get('value');
                if (this.checkEmpty(this, '请输入正确的验证码！')) {
                    return true;
                }
            }
        }
    });
})();