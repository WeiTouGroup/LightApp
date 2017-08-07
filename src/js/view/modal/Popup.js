/**
 * Created by lu on 2017/8/3.
 */
(function () {
    nb.define({
        name: 'app.view.modal.Popup',
        view: {
            'class': 'am-popup',
            $html: {
                'class': 'am-popup-inner',
                $html: [{
                    'class': 'am-popup-hd',
                    $html: [{
                        'class': 'am-popup-title',
                        $html: nb.bind('title')
                    }, {
                        'class': 'am-close',
                        'data-am-modal-close': 'data-am-modal-close',
                        $text: 'x'
                    }]
                }, {
                    'class': 'am-popup-hd',
                    $slot: 'body'
                }]
            }
        },
        method: {
            init: function () {

            },
            open: function () {
                this.$().modal();
            },
            close: function () {
                this.$().modal('close');
            }
        }
    });
})();