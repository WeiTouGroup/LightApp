/**
 * Created by lu on 2017/8/5.
 */
(function () {
    nb.define({
        name: 'app.model.Input',
        parent:'nb.Model',
        method: {
            init: function () {

            },
            checkEmpty: function (inModel, inErrorMsg) {
                var toast = app.view.toast;
                var value = inModel.get('value');
                if (!value || value.trim().length == 0) {
                    // inModel.set('focus', true, {skipSameValue: false});
                    inModel.set('value', null);
                    // inModel.set('errorStatus', 'error');
                    toast.setOpts({
                        'text': inErrorMsg || '这个是必填项。'
                    });
                    return true;
                }
            }
        }
    });
})();