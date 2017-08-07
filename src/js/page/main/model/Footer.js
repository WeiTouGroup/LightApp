/**
 * Created by lu on 2017/8/2.
 */
(function () {
    nb.define({
        name: 'app.page.main.model.Footer',
        parent:'nb.mobile.model.Footer',
        method: {
            init: function () {
                this.set('itemType', 'app.page.main.view.FooterTabBarItem');
            }
        }
    });
})();