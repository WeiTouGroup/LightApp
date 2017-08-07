nb.define({
    name: 'app.page.vote.Vote',
    parent: 'app.Page',
    slot: {
        content: ['html', {
            $type: 'app.page.vote.view.Content',
            $model: 'content'
        }]
    }
});