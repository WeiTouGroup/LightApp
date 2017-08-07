/**
 * Created by PuTi(编程即菩提) 11/14/16.
 */
(function () {
    function createUIID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    var token;
    var uiid = createUIID();
    var url = app.config.cgiUrl;
    //var url = 'http://appsupport.humming-tech.com/cgi';
    //var url = 'http://shbank.txpc.cn/cgi';
    var ajax = function (inOpts) {
        var opts = inOpts || {};
        var scope = opts.scope;
        var data = opts.data || {};
        var formData = opts.formData;
        var success = opts.success;
        var error = opts.error;
        var always = opts.always;
        var parameters = {};
        var toast = app.view.toast;
        var cmd = inOpts.cmd;

        var ajaxOpts = {
            url: opts.url||url,
            type: 'post'
        };
        $.each(data, function (inName, inValue) {
            parameters[inName] = inValue;
        });

        if (formData) {
            formData.append('cmd', cmd);
            formData.append('parameters', JSON.stringify(parameters));
            ajaxOpts.data=formData;
            ajaxOpts.processData = false;  // 告诉jQuery不要去处理发送的数据
            ajaxOpts.contentType = false;   // 告诉jQuery不要去设置Content-Type请求头
        } else {
            ajaxOpts.dataType = 'json';
            ajaxOpts.data = JSON.stringify({
                cmd: cmd,
                parameters: parameters
                //,
                //clientIdentifierCode: uiid,
                //token: token
            });
            ajaxOpts.contentType = "application/json";
        }
        $.ajax(ajaxOpts).done(function (inResult) {
            var statusCode = inResult.statusCode;
            switch (statusCode) {
                case 0:
                    var response = inResult.response;
                    if (success) {
                        success.call(scope, response);
                    }
                    break;
                case 412:
                case 401:
                case 403:
                case 410:
                case 500:
                    if (error) {
                        error.call(scope, inResult);
                    } else {
                        toast.setOpts({
                            text: inResult.error.info,
                            duration: 2
                        });
                    }
                    break;
                default:
            }
        }).always(function () {
            if (always) {
                always.call(scope);
            }
        }).fail(function () {
            //TODO ajax请求错误处理,例如网络不可访问
            toast.setOpts({
                text: '网络无法访问',
                duration: 2
            });
        });
    };
    var Form = nb.define({
        view: {
            tag: 'form',
            //enctype:"multipart/form-data",
            $html: [
                {
                    tag: 'input',
                    type: 'hidden',
                    $name: 'cmd',
                    name: 'cmd'
                },
                {
                    tag: 'input',
                    type: 'hidden',
                    $name: 'token',
                    name: 'token'
                }
                ,
                {
                    $name: 'parameters',
                    tag: 'input',
                    type: 'hidden',
                    name: 'parameters'
                }
            ]
        },
        method: {
            setCMD:function(inCMD){
                this.$('cmd').val(inCMD);
            },
            setToken: function (inToken) {
                this.$('token').val(inToken);
            },
            setParameters: function (inData) {
                if (inData) {
                    this.$('parameters').val(JSON.stringify(inData));
                }
            }
        }

    });
    var uploadImage = function (inOpts) {
        var opts = inOpts || {};
        var data = opts.data;
        var deferred;
        var _timeout = 60000; // 上传超时时间，单位毫秒
        var _timeoutHandle = null;
        var $input = inOpts.$input;
        var form = new Form();
        var $form = form.$();
        var scope = opts.scope;
        var success = opts.success;
        var error = opts.error;
        var always = opts.always;
        form.setParameters(data);
        form.setToken(token);
        form.setCMD(opts.cmd);
        $input.attr('name', 'files');
        console.log("上传文件大小为 "+$input[0].files[0].size+" 字节");
        var fileSize = $input[0].files[0].size;
        var fileName = $input[0].files[0].name;
        var newFileName = fileName.split(".");
        newFileName = newFileName[newFileName.length-1];
        var fileType = ["jpeg","jpg","gif","png"];
        var fileTypeFlag = "0";
        for(var i=0;i<fileType.length;i++){
            if(fileType[i]==newFileName){
                fileTypeFlag="1";
            }
        }
        if(fileTypeFlag=="0"){
            console.log("上传文件格式错误");
            app.view.slideToast.setOpts({
                text:'上传文件格式必须为:"jpeg","jpg","png","gif"',
                status:'error',
                icon:'icon-cuo'
            });
            return
        }
        console.log("扩展名为: "+newFileName);
        console.log("fileName: "+fileName);
        var str  = fileName.replace(/\s/g,"");//\s一个空字符
        console.log("修改后的字符串: "+str);
        $input[0].files[0].name = str;
        var fileName2 = $input[0].files[0].name;
        console.log("newName: "+fileName2);
        //if(fileSize>=2097151){
        if(fileSize>=1024000){
            app.view.slideToast.setOpts({
                status: 'error',
                text: '上传的图片不能超过1M,请重新上传',
                icon:'icon-cuo'
            });
            return
        }
        $form.append($input);
        if (window.FormData) {
            var formData = new FormData($form[0]);
            //var formData = new FormData();
            //formData.append('files', $input[0].files[0]);
            //formData.append('cmd', 'base/uploadImage');
            //formData.append('parameters', JSON.stringify({type:'shop'}));

            deferred = $.ajax({
                url: app.config.uploadUrl,
                type: "post",
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false
            });
        }
        deferred.done(function (inResult) {
            var statusCode = inResult.statusCode;
            switch (statusCode) {
                case 0:
                    var response = inResult.response;
                    if (success) {
                        success.call(scope, response);
                    }
                    break;
                case 412:
                case 401:
                case 403:
                case 410:
                case 500:
                    if (error) {
                        error.call(scope, inResult);
                    } else {
                        //todo 错误
                        // toast.setOpts({
                        //     text: inResult.error.errorInfo,
                        //     duration: 2
                        // });
                    }
                    break;
                default:
            }
        }).always(function () {
            if (always) {
                always.call(scope);
            }
        }).fail(function () {
            //TODO ajax请求错误处理,例如网络不可访问
            // toast.setOpts({
            //     text: '网络无法访问',
            //     duration: 2
            // });
        });

        deferred.promise();

    };
    nb.name('app.io', {
        ajax: ajax,
        uploadImage:uploadImage,
        setToken: function (inToken) {
            token = inToken;
        }
    });
})();