/**
 * Created by lu on 2017/8/4.
 */
(function () {
    var EmptyIcon = nb.define({
        view: {
            'class': 'input-opts',
            $html: {
                tag: 'i',
                'class': 'am-icon-close'
            }
        }
    });
    nb.define({
        name: 'app.view.form.Input',
        view: {
            class: nb.bind('class'),
            tag: 'input',
            type: nb.bind('type'),
            placeholder: nb.bind('placeholder'),
            value: nb.bind('value'),
            disabled: nb.bind('disabled'),
            readonly: nb.bind('readonly'),
            required: nb.bind('required'),
            pattern: nb.bind('pattern'),
            minlength: nb.bind('minlength'),
            maxlength: nb.bind('maxlength'),
            min: nb.bind('min'),
            max: nb.bind('max'),
            minchecked: nb.bind('minchecked'),//checkbox
            maxchecked: nb.bind('maxchecked')//checkbox
        },
        method: {
            onModelReady: function (inModel) {
                inModel.onChange({
                    name: 'emptyIcon',
                    scope: this,
                    fn: function (inEvent) {
                        var status = inEvent.data;
                        if (status) {
                            var View = new EmptyIcon();
                            var $view = View.$();
                            this.$().parent().append($view);
                            inModel.onChange({
                                name: 'value',
                                scope: this,
                                fn: function (inEvent) {
                                    var value = inEvent.data;
                                    if (!value || value.trim().length == 0) {
                                        $view.css('display','none');
                                    }else {
                                        $view.css('display','block');
                                    }
                                }
                            });
                            $view.on('click',function () {
                                inModel.set('value','');
                            });
                        }
                    }
                });
            }
        }
    });
})();