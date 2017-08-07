/**
 * Created by lu on 2017/8/4.
 */
(function () {
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
            init: function () {

            }
        }
    });
})();