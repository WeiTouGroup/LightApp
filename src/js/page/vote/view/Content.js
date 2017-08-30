/**
 * Created by lu on 2017/8/2.
 */
(function () {
    nb.define({
        name: 'app.page.vote.view.Content',
        view: {
            'class': ['content-full', nb.bind('status')],
            $html: {
                'class': 'scroll',
                $html: {
                    'class': 'page-content',
                    $html: [{
                        'class': 'am-form',
                        $html: [{
                            $type: 'app.page.vote.view.Title',
                            $model: 'titleModel'
                        }, {
                            $type: 'app.page.vote.view.Des',
                            $model: 'desModel'
                        }, {
                            $type: 'app.page.vote.view.Options',
                            $model: 'optionsModel'
                        }, {
                            $type: 'app.page.vote.view.Time',
                            $model: 'timeModel'
                        }, {
                            $type: 'app.page.vote.view.Radio',
                            $model: 'radioModel'
                        }]
                    }, {
                        'class': 'vote-btn-group',
                        $html: [{
                            $name: 'submit',
                            'class': 'am-btn am-btn-primary',
                            $text: '提交'
                        }]
                    }]
                }
            }
        },
        method: {
            init: function () {
                var self = this;
                this.$('submit').on('click', function () {
                    var model = self.getModel();
                    model.set('checkSubmit', new Date());
                });
            }
        }
    });
})();