/**
 * Created by PuTi(编程即菩提) 1/15/17.
 */
(function () {
    nb.name('app.io.trace', function trace(inOpts) {
        inOpts.cmd = 'wxaction/insert';
        app.io.ajax(inOpts);
    });
})();