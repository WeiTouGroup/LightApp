/**
 * Created by PuTi(编程即菩提) 1/15/17.
 */
(function () {
    nb.name('app.io.getWXUser', function getWXUser(inOpts) {
        inOpts.cmd='social/weixin/userInfo';
        app.io.ajax(inOpts);
    });
})();