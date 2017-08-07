nb.define({
    name: 'app.page.main.Main',
    parent: 'app.Page',
    slot: {
        content: ['html', {
            $name: 'content',
            $type: 'app.page.main.view.Content',
            $model: 'content'
        }],
        footer: ['html', {
            $name: 'footer',
            $type: 'app.page.main.view.Footer',
            $model: 'footer'
        }]
    },
    method: {
        init: function () {
            var self = this;
            this.$('footer').on('click', '.footer-tab-bar-item', function () {
                var model = self.getModel();
                var index = $(this).attr('data-list-index');
                // if (index != 1) {
                    model.set('activePageIndex', index);
                // }
            });
            this.$('content').find('.main-page').on('click', function () {
                var appModel = self.getModel().get('appModel');
                appModel.showPage('vote');
            });
        }
    }
});