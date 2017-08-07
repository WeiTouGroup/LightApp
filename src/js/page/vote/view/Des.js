/**
 * Created by lu on 2017/8/5.
 */
(function () {
    //todo 图片上传及裁剪
    nb.define({
        name: 'app.page.vote.view.Des',
        view:{
            'class':'vote-des',
            $html:[{
                $type:'app.page.vote.view.TextareaWithLabel',
                $model:'textarea'
            }]
        },
        method: {
            init: function () {

            }
        }
    });
})();