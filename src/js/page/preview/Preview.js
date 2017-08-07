nb.define({
    name: 'app.page.preview.Preview',
    parent: 'app.Page',
    slot: {
        content: ['html', {
            $type: 'app.page.preview.view.Content',
            $model: 'content'
        }]
    }
});