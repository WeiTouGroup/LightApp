/**
 * Created by lu on 2017/8/2.
 */
(function () {
    nb.define({
        name: 'app.page.main.view.FooterTabBarItem',
        view: {
            'class': ['footer-tab-bar-item', nb.bind('active'), nb.bind('key'),nb.bind('grid')],
            'data-key': nb.bind('key'),
            $html: [{
                tag:'i',
                'class': ['tab-icon', nb.bind('iconStatus'),nb.bind('defaultIcon')]
            }, {
                'class': 'tab-label',
                $text: nb.bind('label')
            }]
        }
    });
    nb.define({
        name: 'app.page.main.view.Footer',
        parent: 'nb.view.List',
        view: {
            'class': ['nb-m-footer am-g', nb.bind('status')],
            style:{
                'text-align':'center'
            }
        },
        method: {
            init: function () {

            }
        }
    });
})();