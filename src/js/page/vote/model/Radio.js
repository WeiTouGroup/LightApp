/**
 * Created by lu on 2017/8/6.
 */
(function () {
    var Radio1 = nb.define({
        parent:'nb.Model',
        method:{
            init:function () {
                this.setOpts({
                    text:'单选'
                })
            }
        }
    });
    var Radio2 = nb.define({
        parent:'nb.Model',
        method:{
            init:function () {
                this.setOpts({
                    text:'多选'
                });
            }
        }
    });
    nb.define({
        name: 'app.page.vote.model.Radio',
        parent:'nb.Model',
        method: {
            init: function () {
                var radio1 = new Radio1();
                var radio2 = new Radio2();
                this.set('radio1',radio1);
                this.set('radio2',radio2);
            }
        }
    });
})();