/**
 * Created by lu on 2017/7/22.
 */
(function () {
    nb.name('app.io.getRegisterCode', function getRegisterCode(inOpts) {
        var result = {
            code: '2334'
        };
        app.io.ajax(inOpts, result);
    });
})();