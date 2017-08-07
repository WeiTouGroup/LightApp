/**
 * Created by PuTi(编程即菩提) 1/15/17.
 */
(function () {
    nb.name('app.io.getWXUser', function getWXUser(inOpts) {
        var result = {
            nickname:'tome',
            openid:'open_id_mockup'
        };
        app.io.ajax(inOpts, result);
    });
})();