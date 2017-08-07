/**
 * Created by PuTi(编程即菩提) 10/9/16.
 */
(function () {
    window.requestAnimFrame = (function () {
            return function (callback) {
                //window.setTimeout(callback, 1000 / 60);
                window.setTimeout(callback, 1000 / 30);
            };
    })();
    //window.requestAnimFrame = (function () {
    //    return window.requestAnimationFrame ||
    //        window.webkitRequestAnimationFrame ||
    //        window.mozRequestAnimationFrame ||
    //        window.oRequestAnimationFrame ||
    //        window.msRequestAnimationFrame ||
    //        function (callback) {
    //            window.setTimeout(callback, 1000 / 60);
    //        };
    //})();
    var shell = nb.mobile.shell;
    shell.setDefaultPage('main');
    shell.start();
})();