/**
 * Created by lu on 2017/8/5.
 */
(function () {
    var Textarea = nb.define({
        parent:'nb.Model',
        method:{
            init:function () {
                this.setOpts({
                    label:'详情描述',
                    placeholder:'填写投票描述，让更多的人参与投票',
                    rows:5
                });
            }
        }
    });
    nb.define({
        name: 'app.page.vote.model.Des',
        parent:'nb.Model',
        method: {
            init: function () {
                var textarea = new Textarea();
                this.set('textarea',textarea);

            }
        }
    });
})();