/**
 * Created by lu on 2017/8/6.
 */
(function () {
    nb.define({
        name: 'app.page.vote.view.Radio',
        view:{
            'class':'vote-radio-opts',
            $html:{
                'class':'am-form-group',
                $html:[{
                    $type:'app.view.form.Radio',
                    $model:'radio1'
                },{
                    $type:'app.view.form.Radio',
                    $model:'radio2'
                }]
            }
        },
        method: {
            init: function () {

            }
        }
    });
})();