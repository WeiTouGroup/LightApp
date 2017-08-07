/**
 * Created by lu on 2017/8/5.
 */
(function () {
    nb.define({
        name: 'app.page.vote.view.TextareaWithLabel',
        view:{
          'class':'am-form-group',
            $html:[{
                tag:'label',
                $text:nb.bind('label')
            },{
                $type:'app.view.form.Textarea',
                $model:''
            }]
        }
    });
    nb.define({
        name: 'app.page.vote.view.Textarea',
        view:{
            'class':'am-form-group',
            $html:{
                $type:'app.view.form.Textarea',
                $model:''
            }
        }
    });
})();