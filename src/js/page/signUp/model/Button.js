/**
 * Created by lu on 2017/8/29.
 */
(function () {
    nb.define({
        name: 'app.page.signUp.model.Button',
        parent: 'nb.Model',
        method: {
            init: function () {
                this.setOpts({
                    text: '下一步',
                    colorStyle: 'am-btn-primary',
                    sizeStyle: 'am-btn-block',
                    disabled:'disabled'
                });
            }
        }
    });
})();