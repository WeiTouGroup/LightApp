/**
 * Created by PuTi(编程即菩提) 4/11/17.
 */
nb.define({
    name: 'app.Page',
    parent: 'nb.mobile.view.Page',
    view: {
        'class': ['nb-m-page','container-fluid', nb.bind('key'),nb.bind('activeStatus'), nb.bind('status'), nb.bind('header.status'),nb.bind('pageEnterLeaveStatus')],
        'data-ready': nb.bind('dataReady'),
        $html: [{
            $type: 'nb.mobile.view.Header',
            $model: 'header'
        }, {
            'class': 'nb-m-page-content-wrapper',
            $html: [{
                'class': 'nb-m-page-content',
                $slot: 'content'
            }, {
                'class': 'nb-m-page-content-mask',
                $html: {
                    $type: 'nb.mobile.view.DotLoading',
                    $model:'loading'
                }
            }]
        },{
            'class':'nb-m-page-footer-wrapper',
            $slot:'footer'
        }]
    }
});