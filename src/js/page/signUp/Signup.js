/**
 * Created by lu on 2017/8/21.
 */
(function () {
    nb.define({
        name: 'app.page.signUp.SignUp',
        parent: 'app.Page',
        slot: {
            content: ['html', {
                $type: 'app.page.signUp.view.Content',
                $model: 'content'
            }]
        }
    });
})();