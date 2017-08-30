/**
 * Created by lu on 2017/8/6.
 */
(function () {
    nb.define({
        name: 'app.view.form.Radio',
        view:{
            $name:'label',
            tag:'label',
            'class':'am-radio',
            $html:[{
                $name:'input',
                name:nb.bind('name'),
                tag:'input',
                type:'radio',
                value:nb.bind('value'),
                checked:nb.bind('checked'),
                disabled:nb.bind('disabled'),
                'data-am-ucheck':'data-am-ucheck'
            }, {
                'class': 'am-inline-block',
                $text: nb.bind('text')
            }]
        },
        method: {
            init: function () {
                var self = this;
                var $el = this.$();
                $(function() {
                    $el.find('input[type="radio"]').uCheck();
                });
            }
        }
    });
})();