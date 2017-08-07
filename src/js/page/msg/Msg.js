nb.define({
    name: 'app.page.msg.Msg',
    parent: 'app.Page',
    slot: {
        content: ['html', {
            $type: 'app.page.msg.view.Content',
            $model: 'content'
        }]
    }
});