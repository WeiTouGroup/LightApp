/**
 * Created by PuTi(编程即菩提) 3/21/17.
 */
nb.name('app.util', {
    getURLParams: function () {
        var params = location.search;
        var pMap = [];
        if (params.indexOf("?") != -1) {
            params = params.substr(1).split("&");
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                pMap[param[0]] = param[1];
            }
        }
        return pMap;
    },
    rand: function (inMin, inMax) {
        var range = inMax - inMin;
        var rand = Math.random();
        return inMin + Math.round(rand * range);
    },
    isMobile: function (inMobile) {
        var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
        return reg.test(inMobile);
    }
});