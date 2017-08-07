/**
 * Created by PuTi(编程即菩提) 8/3/16.
 */
(function () {
    window.tracer = {
        trace: function (inOpts) {
            var time = new Date().getTime();
            var msg = JSON.stringify(inOpts) + ' ' + time;
            console.log(msg);
        }
    };
})();