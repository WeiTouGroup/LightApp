/**
 * Created by lu on 2017/8/5.
 */
(function () {
    nb.define({
        name: 'app.page.vote.model.Title',
        parent:'app.model.Input',
        method: {
            init: function () {
                this.setOpts({
                    icon:'am-icon-bar-chart',
                    type:'text',
                    placeholder:'请输入投票标题'
                });
            },
            check:function () {
                var value = this.get('value');
                if (this.checkEmpty(this,'请输入投票标题！')) {
                    return true;
                }
            }
        }
    });
})();