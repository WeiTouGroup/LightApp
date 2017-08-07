/**
 * Created by lu on 2017/8/6.
 */
(function () {
    nb.define({
        name: 'app.view.form.Radio',
        view:[{
            tag:'label',
            'class':'am-radio',
            $html:{
                tag:'input',
                type:'radio',
                value:nb.bind('value'),
                checked:nb.bind('checked'),
                disabled:nb.bind('disabled'),
                'data-am-ucheck':'data-am-ucheck'
            }
        },{
            'class':'am-inline-block',
            $text:nb.bind('text')
        }],
        method: {
            init: function () {
                var $el = this.$();
                $(function() {
                    $el.find('input').uCheck();
                });
            }
        }
    });
})();