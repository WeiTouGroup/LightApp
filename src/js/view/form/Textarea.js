/**
 * Created by lu on 2017/8/5.
 */
(function () {
    nb.define({
        name: 'app.view.form.Textarea',
        view:{
            tag:'textarea',
            class:nb.bind('class'),
            placeholder:nb.bind('placeholder'),
            cols:nb.bind('cols'),
            rows:nb.bind('rows'),
            disabled:nb.bind('disabled'),
            maxlength:nb.bind('maxlength'),
            minlength:nb.bind('minlength'),
            value:nb.bind('value')
        },
        method: {
            init: function () {
                var self= this;
                this.$().on('change',function () {
                    var value = $(this).val();
                    var model = self.getModel();
                    model.set('value',value,{
                        skipSameValue:false
                    });
                });
            },
            onModelReady:function (inModel) {

            }
        }
    });
})();