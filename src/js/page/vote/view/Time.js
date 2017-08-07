/**
 * Created by lu on 2017/8/6.
 */
(function () {
    //todo 开始时间
    nb.define({
        name: 'app.page.vote.view.Time',
        view:{
            'class':'vote-time',
            $html:[{
                'class':'vote-end-time am-g',
                $html:[{
                    'class':'am-inline-block',
                    tag:'label',
                    $text:'截止日期'
                },{
                    'class':'am-inline-block am-fr',
                    $html:{
                        $type:'app.view.form.DatePicker'
                    }
                }]
            }]
        },
        method: {
            init: function () {

            }
        }
    });
})();