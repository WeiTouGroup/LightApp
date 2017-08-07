/**
 * Created by PuTi(编程即菩提) 9/27/16.
 */
//TODO 考虑是否需要封装出来
//(function () {
//    var definePage = function(inPageKey,inPageDef){
//        var pageKey = inPageKey;
//        //动态创建nb对象
//        var Page = nb.define(inPageDef);
//        var page = new Page();
//        var model = page.getModel();
//        $(document).ready(function () {
//            page.$().appendTo(document.body);
//        });
//        model.onChange({
//            name:'language',
//            scope:this,
//            fn:function(inEvent){
//                var language = inEvent.data;
//                //model.get,通过key查值。
//                var title = language.get('html_title_'+pageKey);
//                $('title').text(title);
//            }
//        });
//        nb.name('app.page',page);
//    };
//    nb.name('app.definePage',definePage);
//})();

/**
 * Created by PuTi(编程即菩提) 9/20/16.
 */
nb.define({
    name: 'nb.view.List',
    view: {},
    method: {
        onModelReady: function (inModel) {
            var self = this;
            inModel.onChange({
                name: 'items',
                scope: this,
                fn: function (inEvent) {
                    this.appendList(inModel,inEvent.data);
                }
            });
            inModel.onChange({
                name: 'activeIndex',
                scope: this,
                fn: function (inEvent) {
                    self.onActiveIndexChange(inEvent);
                }
            });
            inModel.onChange({
                name:'addItem',
                scope:this,
                fn:function (inEvent) {
                    this.addItem(inEvent);
                }
            });
            inModel.onChange({
                name:'removeItem',
                scope:this,
                fn:function (inEvent) {
                    this.removeItem(inEvent);
                }
            });
        },
        onActiveIndexChange: function (inEvent) {
            var lastIndex = inEvent.origin;
            var index = inEvent.data;
            var $el = this.$();
            var $itemList = this._$itemList;
            if (lastIndex >= 0 && lastIndex<$itemList.length) {
                $itemList[lastIndex].removeClass('nb-v-active');
            }
            if (index >= 0) {
                $itemList[index].addClass('nb-v-active');
                $el.addClass('nb-v-active')
            } else {
                $el.removeClass('nb-v-active')
            }

        },
        appendList:function (inModel,inList,InAddItem) {
            var self = this;
            var $el = this.$();
            var items = inList;
            var getItemType = inModel.getItemType;
            var defaultItemType = inModel.get('defaultItemType');
            var itemType = inModel.get('itemType');
            var ItemType = nb.getType(itemType || 'nb.view.List.Item');
            var isArray = false;
            var item;
            var array = [];
            var $itemList = this._$itemList;
            var $item;
            this._items = items;
            if(!InAddItem){
                $el.empty();
                $el.scrollTop(0);
                $el.scrollLeft(0);
                $itemList = this._$itemList = [];
                if ($.isArray(itemType)) {
                    isArray = true;
                }
                $.each(items, function (inIndex, inItem) {
                    var type = ItemType;
                    if(isArray){
                        type = nb.getType(itemType[inIndex]);
                    }else if (getItemType) {
                        type = nb.getType(inModel.getItemType(inIndex,inItem) || defaultItemType || 'nb.view.List.Item');
                    }
                    item = new type();
                    array.push(item);
                    item.setOpts(inItem);
                    $item = item.$();
                    $item.attr('data-list-index',inIndex);
                    $itemList.push($item);
                    $el.append($item);
                    self.onItemReady(item);
                });
                this.onItemsReady(array);
            }else {
                var type = InAddItem.itemType || InAddItem.get('itemType') || ItemType || defaultItemType || 'nb.view.List.Item';
                item = new type();
                array.push(item);
                item.setOpts(InAddItem);
                $item = item.$();
                $item.attr('data-list-index',items.length-1);
                $itemList.push($item);
                $el.append($item);
                self.onItemReady(item);
                this.onItemsReady(array);
            }

        },
        onItemReady: function (inItem) {

        },
        onItemsReady: function (inItemList) {

        },
        addItem:function (inOpts) {
            var items = this._items;
            var itemData = inOpts.data.itemData||inOpts.data;
            var model = this.getModel();
            items.push(itemData);
            this.appendList(model,items,itemData);
        },
        removeItem:function (inOpts) {
            var index = inOpts.data;
            var $itemList = this._$itemList;
            var $removeItem = $itemList[index];
            $removeItem.remove();
            $itemList.splice(index,1);
            $.each($itemList,function (inIndex,inItem) {
                inItem.attr('data-list-index',inIndex);
            });
        }
    }
});

nb.define({
    name: 'nb.view.List.Item',
    view: {},
    method: {
        setOpts: function (inOpts) {
            this.parent(inOpts);
            this.$().text(JSON.stringify(inOpts));
        }
    }
});

nb.define({
    name: 'app.view.List.Item',
    view: {
        tag: 'li',
        'data-id': nb.bind('id'),
        $html: [{
            tag: 'span',
            $text: nb.bind('name')
        }]
    }
});
/**
 * Created by PuTi(编程即菩提) 8/5/16.
 * itemType
 * itemList
 * activeIndex
 */
nb.define({
    name: 'nb.view.Selector',
    view: {
        tag: 'ul',
        'class':'nb-v-selector'
    },
    method: {
        init: function () {
            var self = this;
            var $el = this.$();
            $el.on('click', '.nb-v-selector-item', function (inEvent) {
                var $item = $(this);
                var index = $item.attr('data-index');
                self.getModel().set('activeIndex', index);
                $el.addClass('nb-v-selector-active');
            });
            $el.on('click', '.nb-v-close', function (inEvent) {
                var model = self.getModel();
                model.set('activeIndex',-1);
                $el.removeClass('nb-v-selector-active');
                inEvent.stopImmediatePropagation();
            });
        },
        onModelReady: function (inModel) {
            var self = this;
            inModel.onChange({
                name: 'itemList',
                scope: this,
                fn: function (inEvent) {
                    inModel.set('activeIndex', -1);
                    this._setItemList(inEvent.data);
                }
            });
            inModel.onChange({
                name: 'activeIndex',
                scope: this,
                fn: function (inEvent) {
                    self.onActiveIndexChange(inEvent);
                }
            });
        },
        onActiveIndexChange: function (inEvent) {
            var lastIndex = inEvent.origin;
            var index = inEvent.data;
            var $el = this.$();
            var $itemList = this._$itemList;

            if (lastIndex >= 0) {
                $itemList[lastIndex].removeClass('nb-v-selector-active');
            }
            if (index >= 0) {
                $itemList[index].addClass('nb-v-selector-active');
                $el.addClass('nb-v-selector-active')
            } else {
                $el.removeClass('nb-v-selector-active')
            }
        },
        _setItemList: function (inItems) {
            var $el = this.$();
            var itemType = this.getModel().get('itemType') || 'app.view.Selector.Item';
            var Type = nb.getType(itemType);
            var $itemList = this._$itemList = [];
            if (!itemType) {
                throw new Error('Can not find itemType for nb.bs.view.Switcher');
            }
            $el.empty();
            if (inItems && inItems.length) {
                $.each(inItems, function (inIndex, inItem) {
                    var ItemType = nb.getType(inItem.itemType || Type);
                    var item = new ItemType();
                    var $item = item.$();
                    item.setOpts(inItem);
                    $item.attr('data-index', inIndex);
                    $item.addClass('nb-v-selector-item');
                    $itemList.push($item);
                    $el.append($item);
                });
            }
            this.onItemsReady();
        },
        /**
         * template method,after item list appended to container
         */
        onItemsReady: function () {
        }
    }
});

nb.define({
    name: 'app.view.Selector.Item',
    view: {
        tag: 'li',
        'data-id':nb.bind('id'),
        $html: [{
            $name: 'label',
            tag: 'span',
            'class':'nb-v-label',
            $text:nb.bind('name')
        }, {
            $name: 'btn',
            tag: 'span',
            'class':'nb-v-close',
            $html: 'X'
        }]
    }
});