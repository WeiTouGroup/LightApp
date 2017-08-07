/**
 * Created by lu on 2017/8/6.
 */
(function () {
    nb.define({
        name: 'app.view.form.DatePicker',
        view:{
            'class':'am-form-field',
            tag:'input',
            type:'text',
            placeholder:'选择日期',
            readonly:'readonly',
            required:'required'
        },
        method: {
            init: function () {
                var self = this;
                $(function() {
                   self.$().datepicker().
                    on('changeDate.datepicker.amui', function(event) {
                        console.log(event.date);
                    });
                });
            }
        }
    });
})();