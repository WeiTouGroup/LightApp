/**
 * Created by lu on 2017/8/21.
 */
(function () {
    var countdown = 60;
    var timeout;
    var appModel, content, header;
    nb.define({
        name: 'app.page.signUp.model.SignUp',
        parent: 'app.model.Page',
        method: {
            init: function () {
                this._initModel();
                this._initEvent();
            },
            _initModel: function () {
                content.set('phoneModel', new app.page.signUp.model.Phone());
                content.set('codeModel', new app.page.signUp.model.Code());
                content.set('buttonModel', new app.page.signUp.model.Button());
                content.set('status', 'check-mobile');
            },
            _initEvent: function () {
                var phoneModel = content.get('phoneModel');
                var codeModel = content.get('codeModel');
                var buttonModel = content.get('buttonModel');
                this.onChange({
                    name: 'appModel',
                    scope: this,
                    fn: function (inEvent) {
                        appModel = inEvent.data;
                    }
                });
                content.onChange({
                    name: 'status',
                    scope: this,
                    fn: function (inEvent) {
                        var status = inEvent.data;
                        switch (status) {
                            case 'check-mobile':
                                content.set('registerTips', '点击“下一步”，即同意<span>《用户协议》</span>');
                                break;
                            case 'check-code':
                                buttonModel.set('text', '注册');
                                content.set('registerTips', '');
                                break;
                        }
                    }
                });
                phoneModel.onChange({
                    name: 'value',
                    scope: this,
                    fn: function (inEvent) {
                        var value = inEvent.data||'';
                        buttonModel.set('disabled', true);
                        if (value.trim().length == 11) {
                            buttonModel.set('disabled', false);
                        }
                    }
                });
                codeModel.onChange({
                    name: 'value',
                    scope: this,
                    fn: function (inEvent) {
                        var value = inEvent.data;
                        buttonModel.set('disabled', true);
                        if (value.trim().length == 4) {
                            buttonModel.set('disabled', false);
                        }
                    }
                });
                content.onChange({
                    name: 'clickBtn',
                    scope: this,
                    fn: function (inEvent) {
                        buttonModel.set('disabled', true);
                        var status = content.get('status');
                        if (status == 'check-mobile') {
                            if (phoneModel.check()) {
                                buttonModel.set('disabled', false);
                                return false;
                            }
                            content.set('status', 'check-code');
                            content.set('requireRegisterCode', new Date());
                        } else if (status == 'check-code') {
                            if (codeModel.check()) {
                                buttonModel.set('disabled', false);
                                return false;
                            }
                            this._register()
                        }

                    }
                });
                content.onChange({
                    name: 'requireRegisterCode',
                    scope: this,
                    fn: function (inEvent) {
                        var require = inEvent.data;
                        var value = phoneModel.get('value');
                        if (!require) {
                            return;
                        }
                        codeModel.set('btnDisabled', true);
                        app.io.getRegisterCode({
                            scope: this,
                            data: {
                                phone: value
                            },
                            success: function (inResp) {
                                codeModel.set('focus', true);
                                timeout = setInterval(function () {
                                    var txt;
                                    countdown--;
                                    if (countdown > 0) {
                                        txt = countdown + 's 后重发'
                                    } else {
                                        txt = '重新发送';
                                        codeModel.set('btnDisabled', false);
                                        content.set('requireRegisterCode', false);
                                        countdown = 60;
                                        clearInterval(timeout);
                                    }
                                    codeModel.set('text', txt);
                                }, 1000);
                            },
                            error: function (inResult) {
                                var errorCode = inResult.error.code;
                                var info = inResult.error.info;
                                var toast = app.view.toast;
                                switch (errorCode) {
                                    case 1:
                                        phoneModel.setOpts({
                                            errorStatus: 'error',
                                            // errorMsg: info
                                        });
                                        toast.setOpts({
                                            text: info
                                        });
                                        break;
                                }
                            }
                        });
                    }
                });
            },
            onReady: function (inHeader, inContent) {
                header = inHeader;
                content = inContent;
                inHeader.set('title', '注册');
            },
            _register: function () {
                var phoneModel = content.get('phoneModel');
                var codeModel = content.get('codeModel');
                // var buttonModel = content.get('buttonModel');
                var toats = app.view.toast;
                app.io.register({
                    data: {
                        phone: phoneModel.get('value'),
                        code: codeModel.get('value')
                    },
                    scope: this,
                    success: function (inResp) {
                        // var status = inResp.status;
                        toats.setOpts({
                            text: '注册成功'
                        });
                        setTimeout(function () {
                            appModel.showPage('main');
                        }, 500);
                    }
                });
            }
        }
    });
})();