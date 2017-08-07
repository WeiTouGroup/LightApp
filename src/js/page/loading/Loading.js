nb.define({
    name: 'app.page.loading.Loading',
    parent: 'app.Page',
    slot: {
        content: ['html', {
            $type: 'app.page.loading.view.Content',
            $model: 'content'
        }]
    }
});