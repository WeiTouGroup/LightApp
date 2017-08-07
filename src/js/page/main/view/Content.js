/**
 * Created by lu on 2017/8/2.
 */
(function () {
    nb.define({
        name: 'app.page.main.view.Content',
        view: {
            'class': ['content-full main-pages', nb.bind('status')],
            $html: [{
                'class': 'main-page',
                $type: 'app.page.main.view.list.List',
                $model: 'listModel'
            }, {
                'class': 'main-page',
                $type: 'app.page.main.view.add.Add',
                $model: 'addModel'
            }, {
                'class': 'main-page',
                $type: 'app.page.main.view.home.Home',
                $model: 'homeModel'
            }]
        },
        method: {
            init: function () {

            },
            onModelReady: function (inModel) {
                inModel.onChange({
                    name: 'activePageIndex',
                    scope: this,
                    fn: function (inEvent) {
                        var $pages = this.$().find('.main-page');
                        var index = inEvent.data;
                        var lastIndex = inEvent.origin;
                        if (lastIndex >= 0 && lastIndex < $pages.length) {
                            $($pages[lastIndex]).removeClass('active');
                        }
                        if (index >= 0) {
                            $($pages[index]).addClass('active');
                        }
                    }
                });

            }
        }
    });
})();