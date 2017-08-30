/**
 * Created by lu on 2017/8/5.
 */
(function () {
    nb.define({
        name: 'app.page.signUp.model.Phone',
        parent: 'app.model.Input',
        method: {
            init: function () {
                this.setOpts({
                    icon: 'am-icon-mobile-phone',
                    type: 'tel',
                    maxlength:'11',
                    placeholder: '请输入手机号码',
                    emptyIcon:true
                });
            },
            check:function () {
                var value = this.get('value');
                var toast = app.view.toast;
                var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
                if (this.checkEmpty(this, '手机号必须输入！')) {
                    return true;
                }
                if (reg.test(value)) {
                    return false;
                } else {
                    this.setOpts({
                        value: null,
                        errorStatus: 'error'
                        // errorMsg: '请输入有效的手机号！'
                    });
                    toast.setOpts({
                        text:'请输入有效的手机号！'
                    });
                    return true;
                }
            }
        }
    });
})();