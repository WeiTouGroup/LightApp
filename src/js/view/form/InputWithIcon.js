/**
 * Created by lu on 2017/8/5.
 */
(function () {
    nb.define({
        name: 'app.view.form.InputWithIcon',
        view: {
            'class':'am-form-group am-form-icon',
            $html:[{
                tag:'i',
                'class':nb.bind('icon')
            },{
                'class':'am-form-field',
                $type:'app.view.form.Input',
                $model:''
            }]
        },
        method: {
            init: function () {

            }
        }
    });
})();