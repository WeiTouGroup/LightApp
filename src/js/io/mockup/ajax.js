/**
 * Created by PuTi(编程即菩提) 10/19/16.
 */
(function(){
    var token;
    var ajax = function (inOpts, inResult,inStatus) {
        var opts = inOpts || {};
        var status = inStatus ||{};
        var statusCode = status.code||0;
        var success = opts.success;
        var error = opts.error;
        var always = opts.always;
        var scope = opts.scope;
        var data = opts.data;
        var toast = app.view.toast;
        console.log('method:[' + arguments.callee.caller.name + ']');
        console.log('request:');
        console.log(JSON.stringify(data || {}));
        console.log('response:');
        console.log(JSON.stringify(inResult));
        switch (statusCode) {
            case 0:
                if (success) {
                    success.call(scope, inResult);
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
                        text: status.error.info,
                        duration: 2
                    });
                }
                break;
            default:
        }
        if(always){
            always.call(scope);
        }
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