nb.define({
    name: 'app.page.loading.view.Content',
    view: {
        'class': ['content-full', nb.bind('status')],
        $html: [{
            'class': 'text',
            $text: nb.bind('percent')
        }]
    }
});