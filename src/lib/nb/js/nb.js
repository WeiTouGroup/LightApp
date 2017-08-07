/**
 * Created by PuTi(编程即菩提) 5/22/16.
 */
(function () {
    var propMap = {
        readonly:true,
        disabled: true,
        checked: true
    };
    var interceptors = [];
    //IE 8
    if (!Object.create) {
        Object.create = function (proto, props) {
            if (typeof props !== "undefined") {
                throw "The multiple-argument version of Object.create is not provided by this browser and cannot be shimmed.";
            }
            function ctor() {
            }

            ctor.prototype = proto;
            return new ctor();
        };
    }
    var pkg = function () {
        return {};
    };

    var RootType;

    var label = function (inName, inTarget) {
        var handler = window;
        var last;
        if (inName) {
            var names = inName.split('.');
            last = names.pop();
            $.each(names, function (inIndex, inName) {
                var temp = handler[inName];
                if (temp) {
                    handler = temp;
                    return;
                }
                handler = handler[inName] = new pkg();
            });
        }
        if (last) {
            handler[last] = inTarget;
        }
        return inTarget;
    };

    var get = function (inName, inTarget) {
        var target = inTarget || window;
        var result = target;
        var names;
        if (inName === undefined) {
            return result;
        }
        if (inName === '') {
            result = result[inName];
        } else {
            names = inName.split('.');
            $.each(names, function (inIndex, inName) {
                result = target = target[inName];
                if (!result) {
                    return false;
                }
            });
        }
        return result;
    };

    var set = function (inPath, inValue) {
        var lastDotIndex = inPath.lastIndexOf('.');
        var parentPath, parent, property;
        var model = this.__model;
        var origin = nb.get(inPath, model);
        if (lastDotIndex > 0) {
            parentPath = inPath.substring(0, lastDotIndex);
            property = inPath.substring(1);
            parent = nb.get(parentPath, this.__model);
            parent[property] = inValue;
        } else {
            this.__model[inPath] = inValue;
        }
    };


    var define = function (inDef, inIgnoreInterceptor) {
        var name = inDef['name'];
        var view = inDef['view'];
        var parent = inDef['parent'];
        if (parent) {
            if (typeof parent === 'string') {
                var parentName = parent;
                parent = get(parent);
                if (!parent) {
                    throw 'Parent not found![' + parentName + ']';
                }
            }
        }

        if (!inIgnoreInterceptor) {
            $.each(interceptors, function (inIndex, inInerceptor) {
                parent = inInerceptor.fn.call(inInerceptor.scope, inDef, parent);
            });
        }


        var type = extend(parent || RootType, inDef);
        if (name) {
            return label(name, type);
        } else {
            return type;
        }
    };

    var extend = function (inSuper, inDef) {
        var superPrototype = inSuper.prototype;
        var prototype = Object.create(superPrototype);

        var Type = function () {
            var init = this.init;
            if (init) {
                init.apply(this, arguments);
            }
        };

        $.each(inDef, function (inName, inProp) {
            if (inName == 'method') {
                extendMethods(prototype, inProp);
            } else {
                prototype[inName] = inProp;
            }
        });

        Type.prototype = prototype;
        return Type;
    };


    var extendMethods = function (inPrototype, inMethods) {
        var methods = inMethods || {};
        $.each(methods, function (inName, inMethod) {
            var prop = inPrototype[inName];
            if (prop != undefined && typeof prop == "function") {
                if (inName === 'init') {
                    inPrototype[inName] = (function (superFn, fn) {
                        return function () {
                            superFn.apply(this, arguments);
                            return fn.apply(this, arguments);
                        };
                    })(prop, inMethod);
                } else {
                    //overwrite or override
                    inPrototype[inName] = (function (superFn, fn) {
                        return function () {
                            var temp, result;
                            temp = this.parent;
                            this.parent = superFn;
                            result = fn.apply(this, arguments);
                            this.parent = temp;
                            return result;
                        };
                    })(prop, inMethod);
                }
            } else {
                inPrototype[inName] = inMethod;
            }
        });
    };

    var NBType = function () {
    };
    RootType = extend(NBType, {
        init: function () {

        },
        /**
         *  name:,
         *  scope:
         *  fn:function
         * @param inOpts
         */
        on: function (inOpts) {
            var eventMap = this.__eventMap;
            var name = inOpts.name;
            var scope = inOpts.scope;
            var fn = inOpts.fn;
            var array;
            if (!eventMap) {
                eventMap = this.__eventMap = {};
            }
            array = eventMap[name];
            if (!array) {
                array = eventMap[name] = [];
            }
            array.push({
                scope: scope,
                fn: fn
            });
        },
        fire: function (inName, inData) {
            var eventMap = this.__eventMap;
            var eventArray = (eventMap ? eventMap[inName] : []) || [];
            $.each(eventArray, function (inIndex, inOpts) {
                var scope = inOpts.scope;
                var fn = inOpts.fn;
                fn.call(scope, inData);
            });
        },
        callHandler: function (inKey, inOpts) {
            var handler = this.getHandler(inKey);
            if (!handler) {
                throw new Error('Handler nout found.[' + inKey + ']');
            }
            handler.call(this, inOpts);
        },
        getHandler: function (inKey) {
            return this[inKey + 'Handler'];
        },
        setOpts: function (inOpts) {
            if (inOpts instanceof nb.Model) {
                return this.setModel(inOpts);
            } else {
                return this.setJSONData(inOpts);
            }
        },
        setJSONData: function (inOpts) {
            var model = this._model;
            if (!model) {
                model = this.initDefaultModel();
            }
            model.setOpts(inOpts);
            return model;
        },
        initDefaultModel: function () {
            var Model = nb.getType(this.model || 'nb.Model');
            var model = this.getModel();
            if (!Model) {
                throw new Error('Can not get model type for [' + this.model + '].' + (this.name ? 'view name is [' + this.name + ']' : ''));
            }
            if (!model) {
                model = this.setModel(new Model());

            }

            return model;
        },
        resetModel: function (inModel) {
            inModel.reset();
        },
        setModel: function (inModel) {
            var self = this;
            var viewInstance = this.__viewInstance;
            var $modelMappingList = viewInstance.$modelMappingList;
            var $bindMappingList = viewInstance.$bindMappingList;
            var events = this._modelEvents = this._modelEvents || [];
            if (this._model) {
                this.resetModel(this._model);
            }
            this._model = inModel;
            if ($modelMappingList) {
                $.each($modelMappingList, function (inIndex, inItem) {
                    var target = inItem.target;
                    var model = inItem.model;
                    var modelType;
                    var temp;
                    var naming;
                    var targetModel = inModel;
                    var key = model;
                    if (typeof model === 'string') {
                        if (model.indexOf('.') > 0) {
                            naming = model.split('.');
                            key = naming.pop();
                            $.each(naming, function (inIndex, inName) {
                                targetModel = targetModel.get(inName);
                            });
                            if (!targetModel) {
                                throw new Error('target model not found.[' + naming + ']');
                            }
                        }
                        if (key === '') {
                            target.setModel(targetModel);
                        } else {
                            targetModel.onChange({
                                name: key,
                                scope: target,
                                fn: function (inEvent) {
                                    target.setOpts(inEvent.data);
                                }
                            });
                        }
                    } else {
                        modelType = nb.getType(target.model || 'nb.Model');
                        temp = target.getModel() || new modelType();
                        $.each(model, function (inName, inKey) {
                            if (inName) {
                                inModel.onChange({
                                    name: inName,
                                    scope: temp,
                                    fn: function (inEvent) {
                                        temp.set(inKey, inEvent.data);
                                    }
                                });
                            } else {
                                self._addRootModelWatcher(inKey, target);
                                temp.set(inKey, inModel);
                            }
                        });
                        if (!target.getModel()) {
                            target.setModel(temp);
                        }
                    }
                })
            }
            if (events) {
                $.each(events, function (inIndex, inEvent) {
                    var target = inEvent.target;
                    var model = target.getModel();
                    model.set(inEvent.key, inModel);
                });
            }
            if ($bindMappingList) {
                $.each($bindMappingList, function (inIndex, inItem) {
                    self._addBind(inItem, inModel);
                });
            }
            this.onModelReady(inModel);
            return inModel;
        },
        _addRootModelWatcher: function (inKey, inTarget) {
            var events = this._modelEvents = this._modelEvents || [];
            events.push({
                target: inTarget,
                key: inKey
            });
        },
        _addBind: function (inBind, inModel) {
            var target = inBind.target;
            var model = inModel;
            var modelName = inBind.model;
            var bindName = inBind.name
            var attrName = inBind.attrName;
            var opts = inBind.opts;
            var defaultEvent = 'change keyup';
            var event = opts ? (opts.event || defaultEvent ) : defaultEvent;
            if (modelName !== undefined) {
                model = inModel.get(modelName);
                if (!model) {
                    throw Error('Can not found model for [' + modelName + ']');
                }
            }
            if (propMap[attrName]) {
                target.attr('data-nb-bind', bindName);
                target.on(event, function (inEvent) {
                    var data = target.prop(attrName);
                    model.set(bindName, data);
                });
            } else if (attrName === 'value' && target.prop("tagName") === 'INPUT') {
                var valueBindings =target.attr('data-nb-bind-value');
                var instanceIds = valueBindings? valueBindings.split(','):[];
                var hasBind = false;
                var instanceId = model.__instanceId;
                $.each(instanceIds,function(inIndex,inId){
                    if(instanceId == inId){
                        hasBind = true;
                        return true;
                    }
                });
                if(hasBind){
                    //ignore
                }else{
                    if(!instanceIds[0]){
                        instanceIds[0]=instanceId
                    }else{
                        instanceIds.push(instanceId);
                    }
                    target.attr('data-nb-bind-value', instanceIds.join(','));
                    target.on(event, function (inEvent) {
                        var data = target.val();
                        model.set(bindName, data);
                    });
                }
            }
            model.onChange({
                name: bindName,
                scope: target,
                fn: function (inEvent) {
                    var data = inEvent.data;
                    //var strValue = data? '' + data:'';
                    var strValue = (data==undefined || data == null)? '':'' + data;
                    var origin = inEvent.origin;
                    //var attrName = inBind.attrName;
                    switch (inBind.attrType) {
                        case 'text':
                            target.text(strValue);
                            break;
                        case 'html':
                            target.html(strValue);
                            break;
                        case 'attr':
                            if(propMap[attrName]){
                                target.prop(attrName,data);
                            }else if(inBind.attrName == 'value'){
                                target.val(strValue);
                            }else{
                                target.attr(inBind.attrName, strValue);
                            }
                            break;
                        case 'class':
                            target.removeClass(origin||'');
                            target.addClass(strValue);
                            break;
                        case 'style':
                            target.css(inBind.attrName, strValue);
                            break;
                    }
                }
            });
        },
        /**
         * template method,on model instance ready
         * @param inModel
         */
        onModelReady: function (inModel) {

        },
        getModel: function () {
            return this._model;
        }
    });

    var addDefineInterceptor = function (inInterceptor) {
        interceptors.push(inInterceptor);
    };

    var nb = window.nb = {};
    nb.name = label;
    nb.define = define;
    nb.extend = extend;
    nb.addDefineInterceptor = addDefineInterceptor;
    nb.get = get;
    nb.set = set;
    /**
     * get type when type is string
     * @param inType
     * @returns {*}
     */
    nb.getType = function (inType) {
        var type = inType;
        if (typeof inType === 'string') {
            var name = inType;
            type = nb.get(name);
            if (type == null) {
                throw 'Type not found[' + name + ']'
            }
        }
        return type;
    };
})();
/**
 * Created by PuTi(编程即菩提) 5/23/16.
 */
(function () {
    var seq = 1;
    var Model = nb.define({
        name: 'nb.Model',
        method: {
            init: function () {
                this.__instanceId = seq++;
                this.__model = {};
                this.__eventMap = {};
            },
            setOpts: function (inOpts) {
                var opts = inOpts || {};
                var self = this;
                $.each(opts, function (inName, inValue) {
                    if (inValue !== undefined) {
                        self.set(inName, inValue, {skipSameValue: false});
                    }
                });
            },
            get: function (inPath) {
                var obj = nb.get(inPath, this.__model);
                return obj;
            },
            set: function (inPath, inValue, inOpts) {
                var lastDotIndex = inPath.lastIndexOf('.');
                var parentPath, parent, property;
                var model = this.__model;
                var origin = nb.get(inPath, model);
                if (lastDotIndex > 0) {
                    parentPath = inPath.substring(0, lastDotIndex);
                    property = inPath.substring(1);
                    parent = nb.get(parentPath, this.__model);
                    parent[property] = inValue;
                } else {
                    this.__model[inPath] = inValue;
                }
                this._fireChangeEvent(inPath, inValue, inOpts, origin);
            },
            /**
             * {
             *  name:model name,
             *  type:before/after(default),
             *  scope:
             *  fn:function
             * }
             * @param inOpts
             */
            onChange: function (inOpts) {
                var map = this.__eventMap;
                var name = inOpts.name;
                var before = inOpts.before;
                var type = before ? 'before' : 'after';
                var once = inOpts.once;
                var scope = inOpts.scope;
                var fn = inOpts.fn;
                var events = map[name];
                var typeArray;
                var data = this.get(name);
                if (!events) {
                    events = {};
                    map[name] = events;
                }
                typeArray = events[type];
                if (!typeArray) {
                    typeArray = [];
                    events[type] = typeArray;
                }

                if (data !== undefined) {
                    fn.call(scope, {name: name, data: data});
                    if (once) {
                        return;
                    }
                }

                typeArray.push({scope: scope, fn: fn, once: once});
            },
            /**
             * clear all event change listener
             */
            reset: function () {
                this.__eventMap = {};
            },
            /**
             * off event listener
             */
            switchChange: function (inOpts) {
                //TODO add off change by scope
                var name = inOpts.name;
                var off = inOpts.off;
                var map = this.__eventMap;
                var eventArray = (events ? events['before'] : []) || [];
                this._turnOffEventArray(eventArray, off);
                eventArray = (events ? events['after'] : []) || [];
                this._turnOffEventArray(eventArray, off);
            },
            _fireChangeEvent: function (inName, inData, inOpts, inOrigin) {
                var model = this.__model;
                var map = this.__eventMap;
                var events = map[inName];
                var data = inData;
                //before change event
                var eventArray = (events ? events['before'] : []) || [];
                var eventData = {
                    name: inName,
                    origin: inOrigin,
                    data: data
                };
                var skipSameValue = inOpts ? inOpts.skipSameValue : true;
                var noBefore = inOpts ? inOpts.noBefore : false;
                var temp;
                if (skipSameValue && data == inOrigin) {
                    return;
                }
                if (noBefore != true) {
                    temp = this._executeEventArray(eventArray, eventData, true);
                    if (temp !== undefined) {
                        data = temp;
                        eventData.data = data;
                    }
                }
                model[inName] = data;
                //after change event
                eventArray = (events ? events['after'] : []) || [];
                this._executeEventArray(eventArray, eventData);
            },
            _turnOffEventArray: function (inEventArray, inOff) {
                $.each(inEventArray, function (inIndex, inOpts) {
                    inOpts.off = inOff;
                });
            },
            _executeEventArray: function (inEventArray, inData, inBefore) {
                var currentData = inData;
                var temp;
                $.each(inEventArray, function (inIndex, inOpts) {
                    if (!inOpts) {
                        return;
                    }
                    var scope = inOpts.scope;
                    var fn = inOpts.fn;
                    var once = inOpts.once;
                    var off = inOpts.off;

                    if (!off) {
                        temp = fn.call(scope, currentData);
                        if (inBefore) {
                            currentData = {
                                name: inData.name,
                                origin: inData.origin,
                                data: temp
                            };
                        }
                        if (once) {
                            delete inEventArray[inIndex];
                        }
                    }
                });
                return temp;
            }
        }
    });
})();
/**
 * Created by PuTi(编程即菩提) 9/14/16.
 */
var Bind = nb.define({
    name: 'nb.Bind',
    method: {
        init: function (inName, inOpts) {
            var name = inName;
            var model;
            var index = inName.lastIndexOf('.');
            if(index>0){
                name=inName.substring(index+1);
                model=inName.substring(0,index);
            }
            this._name = name;
            this._model = model;
            this._opts = inOpts;
        },
        //init: function (inArg1, inArg2) {
        //    if (!inArg2) {
        //        this._name = inArg1;
        //    } else {
        //        this._model = inArg1;
        //        this._name = inArg2;
        //    }
        //},
        getName: function () {
            return this._name;
        },
        getModel: function () {
            return this._model;
        },
        getOpts:function(){
            return this._opts;
        }
    }
});
nb.bind = function (inArg1, inArg2) {
    var bind = new Bind(inArg1, inArg2);
    return bind;
};
/**
 * Created by PuTi(编程即菩提) 5/22/16.
 */
(function () {
    var add$ModelMapping = function (inRoot, in$model, inChild) {
        if (in$model!=undefined) {
            inRoot.$modelMappingList = inRoot.$modelMappingList = inRoot.$modelMappingList || [];
            inRoot.$modelMappingList.push({model: in$model, target: inChild});
        }
    };
    var contentHandlerMap = {
        'string': function (inOpts) {
            var $el = inOpts.$;
            var tag = $el.prop('tagName').toLowerCase();
            var content = inOpts.content;
            switch (inOpts.type) {
                case 'text':
                    $el.text(content);
                    break;
                case 'html':
                    $el.html(content);
                    break;
                default:
                    break;
            }
        },
        'object': function (inOpts) {
            var content = inOpts.content;
            var root = inOpts.root;
            var child = define(content, root);
            var name = content['$name'];
            var $el = child.$();
            var $model = content.$model;
            var $bind = content.$bind;
            inOpts.$.append($el);
            if (name) {
                var key = '$' + name;
                var temp = root[key];
                if (temp) {
                    if ($.type(temp) != 'array') {
                        var array = [temp];
                        temp = root[key] = array;
                    }
                    temp.push(child)
                } else {
                    root[key] = child;
                }
            }
            //add$ModelMapping(root,$model,child);
        },
        'array': function (inOpts) {
            $.each(inOpts.content, function (inIndex, inContent) {
                content({
                    $: inOpts.$,
                    container: inOpts.container,
                    root: inOpts.root,
                    content: inContent
                });
            });
        },
        'undefined': function () {
            //do nothing
        }
    };
    var content = function (inOpts) {
        var content = inOpts['content'];
        var type = $.type(content);
        contentHandlerMap[type](inOpts);
    };
    var addBind = function (root, inBind) {
        root.$bindMappingList = root.$bindMappingList = root.$bindMappingList || [];
        root.$bindMappingList.push(inBind);
    };
    var attrHandlerMap = {
        'class': function (inObj, in$El, inJson, inRoot) {
            var cls = inJson['class'];
            var root = inRoot || inObj;

            if (typeof  cls === 'string') {
                in$El.addClass(cls);
            } else if ($.isArray(cls)) {
                $.each(cls, function (inIndex, inCls) {
                    if (typeof inCls === 'string') {
                        in$El.addClass(inCls);
                    } else if (inCls instanceof nb.Bind) {
                        addBind(root, {
                            name: inCls.getName(),
                            model: inCls.getModel(),
                            target: in$El,
                            attrType: 'class'
                        });
                    }
                });
            } else if (cls instanceof nb.Bind) {
                addBind(root, {
                    name: cls.getName(),
                    model: cls.getModel(),
                    target: in$El,
                    attrType: 'class'
                });
            }
        },
        'style': function (inObj, in$El, inJson, inRoot) {
            var style = inJson['style'];
            var root = inRoot || inObj;
            if (typeof style === 'string') {
                //TODO Maybe support
            } else {
                $.each(style, function (inName, inStyle) {
                    if (inStyle instanceof nb.Bind) {
                        addBind(root, {
                            name: inStyle.getName(),
                            model: inStyle.getModel(),
                            target: in$El,
                            attrName: inName,
                            attrType: 'style'
                        });
                    } else {
                        in$El.css(inName, inStyle);
                    }
                });
            }
        },
        $text: function (inObj, in$El, inJson, inRoot) {
            var $text = inJson.$text;
            var root = inRoot || inObj;
            if ($text instanceof nb.Bind) {
                addBind(root, {name: $text.getName(), model: $text.getModel(), target: in$El, attrType: 'text'});
            } else {
                content({
                    $: in$El,
                    container: inObj,
                    root: root,
                    content: inJson.$text,
                    type: 'text'
                });
            }
        },
        $html: function (inObj, in$El, inJson, inRoot) {
            var $html = inJson.$html;
            var root = inRoot || inObj;
            if ($html instanceof nb.Bind) {
                addBind(root, {name: $html.getName(), model: $html.getModel(), target: in$El, attrType: 'html'});
            } else {
                content({
                    $: in$El,
                    container: inObj,
                    root: inRoot || inObj,
                    content: inJson.$html,
                    type: 'html'
                });
            }
        }
    };
    var find = function (inName, inType) {
        var obj;
        if (inName != undefined) {
            obj = this['$' + inName];
            if (!obj) {
                throw new Error('Child not found.Please check the $name property.[' + inName + ']')
            }
        } else {
            obj = this;
        }
        if (!inType) {
            obj = obj['$root'] || obj.__viewInstance['$root'];
        }
        return obj;
    };
    var define = function (inJson, inRoot) {
        var obj;
        if (inJson['$type']) {
            obj = define4Type(inJson, inRoot);
        } else if (inJson['$template']) {
            obj = define4Template(inJson, inRoot);
        } else {
            obj = define4JSON(inJson, inRoot);
        }
        return obj;
    };
    var define4Template = function (inJson, inRoot) {
        //TODO no implement
    };
    var define4Type = function (inJson, inRoot) {
        var $type = inJson.$type;
        var $opts = inJson.$opts;
        var $model = inJson.$model;
        var cls = inJson['class'];
        var style = inJson.style;
        var path, currentModel, targetModel;
        $type = nb.getType($type);
        var obj = new $type;
        var $obj = obj.$();
        if ($opts) {
            obj.setOpts($opts);
        }

        if (cls) {
            if (typeof cls === 'string') {
                $obj.addClass(cls);
            } else if ($.isArray(cls)) {
                $.each(cls, function (inIndex, inCls) {
                    if (typeof inCls === 'string') {
                        $obj.addClass(inCls);
                    } else if (inCls instanceof nb.Bind) {
                        addBind(inRoot || obj, {
                            name: inCls.getName(),
                            model: inCls.getModel(),
                            target: obj.$(),
                            attrType: 'class'
                        })
                    }
                })
            }

        }
        if (style) {
            $obj.css(style);
        }
        add$ModelMapping(inRoot,$model,obj);
        return obj;
    };
    var define4JSON = function (inJson, inRoot) {
        var obj = {
            $: find
        };
        if ($.isArray(inJson)) {
            var $el = $('<div>');
            $.each(inJson, function (inIndex, inChild) {
                var name = inChild.$name;
                //var child = define4JSON(inChild, obj);
                var child = define(inChild, obj);
                if (name) {
                    obj['$' + name] = child;
                }
                $el.append(child.$());
            });
            obj.$root = $el.children();
        } else {
            obj.$root = createEl(obj, inJson, inRoot);
        }
        return obj;
    };
    var createEl = function (inObj, inJson, inRoot) {
        var tag = inJson.tag || 'div';
        var root = inRoot || inObj;
        var $el = $('<' + tag + '>');
        $.each(inJson, function (inName, inValue) {
            var name = inName.toLowerCase();
            var isBind = inValue instanceof nb.Bind;
            if (name == 'tag') {
                return true;
            }
            var fn = attrHandlerMap[inName];
            if (fn) {
                fn(inObj, $el, inJson, inRoot);
            } else {
                if (name.indexOf('$') === 0) {
                    if (isBind) {

                    } else {
                        $el.attr('data-nb-' + name.substring(1), inValue);
                    }
                } else {
                    if (isBind) {
                        addBind(root, {
                            name: inValue.getName(),
                            model: inValue.getModel(),
                            target: $el,
                            attrName: name,
                            attrType: 'attr',
                            opts:inValue.getOpts()
                        });
                    } else {
                        $el.attr(name, inValue);
                    }
                }
            }
        });
        return $el;
    };

    var init = function () {
        var self = this;
        var opts = this.opts;
        var view = parseSlot(this.view, this.slot);
        var viewInstance;

        if (view) {
            viewInstance = this.__viewInstance = define(view);
        }
        if (this.model) {
            this.initDefaultModel();
        }
        if (opts) {
            this.setOpts(opts);
        }
    };

    var parseSlot = function (inView, inSlot) {
        var view = inView;
        var clone = $.isArray(inView)? [] : {};

        if (inSlot) {
            view = $.extend(true, clone, inView);
            view = replaceSlot(view, inSlot);
        }
        return view;
    };

    var replaceSlot = function (inObj, inSlot) {
        var clone;
        if (typeof inObj === 'string') {
            clone = inObj;
        } else if($.isNumeric(inObj)){
            clone = inObj;
        }else if (inObj instanceof nb.Bind) {
            clone = inObj;
        } else {
            if ($.isArray(inObj)) {
                clone = [];
            } else {
                clone = {};
            }
            $.each(inObj, function (inName, inValue) {
                var content;
                if (inName == '$slot') {
                    content = inSlot[inValue];
                    if(content){
                        clone['$' + content[0]] = content[1];
                    }
                } else {
                    clone[inName] = replaceSlot(inValue, inSlot);
                }
            });
        }
        return clone;
    };

    var viewFind = function (inName, inType) {
        return this.__viewInstance.$(inName, inType);
    };

    nb.addDefineInterceptor({
        scope: this,
        fn: function (inDef, inParent) {
            if (!inDef || !inDef.view) {
                return inParent;
            }

            if (inParent && inParent.prototype.view) {
                return nb.define({
                    parent: inParent,
                    method: {
                        $: viewFind
                    }
                }, true);
            }
            return nb.define({
                parent: inParent,
                method: {
                    init: init,
                    $: viewFind
                }
            }, true);
        }
    })
})();