/**
 * Created by PuTi(编程即菩提) 10/16/16.
 */
(function () {
    var seq = 1;
    nb.define({
        name: 'nb.bs.model.Carousel',
        parent: 'nb.Model',
        method: {
            init: function () {
                this._$initModel();
                this._$initEvent();
                this._$initData();
            },
            _$initModel: function () {
                var indicators = new nb.Model();
                var items = new nb.Model();
                this.set('indicatorsModel', indicators);
                this.set('itemsModel', items);
                indicators.set('itemType', 'nb.bs.view.carousel.Indicator');
                items.set('itemType', 'nb.bs.view.carousel.Item');
            },
            _$initEvent: function () {
                this.onChange({
                    name: 'items',
                    scope: this,
                    fn: function (inEvent) {
                        var items = inEvent.data;
                        var carouselIdRef = this.get('carouseIdRef');
                        var indicatorsModel = this.get('indicatorsModel');
                        var itemsModel = this.get('itemsModel');
                        var itemsItems = [];
                        var indicatorsItems = [];
                        if (items) {
                            $.each(items, function (inIndex, inItem) {
                                var indicator = {
                                    carouseIdRef: carouselIdRef,
                                    index: inIndex
                                };
                                var item = inItem;
                                if (inItem instanceof nb.Model) {
                                } else {
                                    item = {
                                        carouseIdRef: carouselIdRef,
                                        index: inIndex
                                    };
                                    $.each(inItem, function (inName, inValue) {
                                        item[inName] = inValue;
                                    });
                                }
                                indicatorsItems.push(indicator);
                                itemsItems.push(item);
                            });
                        }
                        indicatorsModel.set('items', indicatorsItems);
                        itemsModel.set('items', itemsItems);
                    }
                });
            },
            _$initData: function () {
                var carouselId = 'nb-bs-carousel-' + +(seq++);
                var carouselIdRef = '#' + carouselId;
                this.set('carouselId', carouselId);
                this.set('carouselIdRef', carouselIdRef);
            }
        }
    });
})();
/**
 * Created by PuTi(编程即菩提) 9/22/16.
 */
nb.define({
    name: 'nb.bs.model.Table',
    parent: 'nb.Model',
    method: {
        init: function () {
            this.onChange({
                name: 'showStriped',
                scope: this,
                fn: function (inEvent) {
                    var cls = '';
                    if (inEvent.data == true) {
                        cls = 'table-striped';
                    }
                    this.set('striped', cls);
                }
            });
            this.onChange({
                name: 'showBorder',
                scope: this,
                fn: function (inEvent) {
                    var cls = '';
                    if (inEvent.data == true) {
                        cls = 'table-bordered';
                    }
                    this.set('border', cls);
                }
            });
        }
    }
});
/**
 * Created by PuTi(编程即菩提) 9/27/16.
 * group:{count:5} 页面分组,可以不显示过多页码项
 */
nb.define({
    name: 'nb.bs.model.Pagination',
    parent: 'nb.Model',
    method: {
        init: function () {
            this._initData();
            this._initEvent();
        },
        setOpts: function (inOpts) {
            var index = inOpts.index || 1;
            var total = inOpts.total;
            //TODO reset data
            this.set('group', inOpts.group || null, {skipSameValue: false});
            this.set('total', total, {skipSameValue: false});
            this.set('index', index, {skipSameValue: false});
        },
        showNextGroup: function () {
            var groupIndex = this.get('groupIndex');
            var group = this.get('group');
            var pageCount = group.count;
            var nextIndex = pageCount * groupIndex + pageCount + 1;
            groupIndex++;
            this.set('requireIndex', nextIndex);
        },
        showPreviousGroup: function () {
            var groupIndex = this.get('groupIndex');
            var group = this.get('group');
            var pageCount = group.count;
            var nextIndex = pageCount * (groupIndex - 1) + pageCount;
            groupIndex--;
            this.set('requireIndex', nextIndex);
        },
        showNextPage: function () {
            var index = this.get('index');
            index++;
            this.set('requireIndex', index);
        },
        showPreviousPage: function () {
            var index = this.get('index');
            index--;
            this.set('requireIndex', index);
        },
        _initData: function () {
            var defaultMaxPageCount = 5;
            this.set('defaultMaxPageCount', defaultMaxPageCount);
            this.set('group', {count: defaultMaxPageCount});
        },
        _initEvent: function () {
            this.onChange({
                name: 'total',
                scope: this,
                fn: function (inEvent) {
                    var total = inEvent.data;
                    var pages = [];
                    var i = 0;
                    var page;
                    for (; i < total; i++) {
                        page = new nb.Model();
                        page.set('index', i + 1);
                        pages.push(page);
                    }
                    this.set('allPage', pages);
                }
            });
            this.onChange({
                name: 'requireIndex',
                scope: this,
                fn: function (inEvent) {
                    var requireIndex = inEvent.data;
                    this.onRequireIndex(requireIndex);
                }
            });
            this.onChange({
                name: 'index',
                scope: this,
                fn: function (inEvent) {
                    var pageNO = inEvent.data;
                    var lastPageNO = inEvent.origin;
                    var group = this.get('group');
                    var total = this.get('total');
                    var pages = this.get('allPage');
                    var previousPageState = 'disabled';
                    var nextPageState = 'disabled';

                    if (group) {
                        var pageCount = group.count;
                        var groupIndex = Math.ceil(pageNO / pageCount) - 1;
                        var previousGroupState = 'disabled';
                        var nextGroupState = 'disabled';

                        this.set('groupIndex', groupIndex, {skipSameValue: false});
                        if (pageNO > pageCount) {
                            previousGroupState = 'enabled';
                        }
                        if (groupIndex * pageCount + pageCount < total) {
                            nextGroupState = 'enabled';
                        }
                        this.set('previousGroupState', previousGroupState);
                        this.set('nextGroupState', nextGroupState);
                    } else {
                        this.set('pages', pages);
                    }
                    if (pageNO > 1) {
                        previousPageState = 'enabled';
                    }
                    if (pageNO < total) {
                        nextPageState = 'enabled';
                    }
                    this.set('previousPageState', previousPageState);
                    this.set('nextPageState', nextPageState);
                    if (lastPageNO) {
                        pages[lastPageNO - 1].set('active', '');
                    }
                    pages[pageNO - 1].set('active', 'active');
                }
            });
            this.onChange({
                name: 'group',
                scope: this,
                fn: function (inEvent) {
                    var group = inEvent.data;
                    if (group) {
                        group.count = group.count || this.get('defaultMaxPageCount');
                        this.set('previousGroupState', '');
                        this.set('nextGroupState', '');
                    } else {
                        this.set('previousGroupState', 'hidden');
                        this.set('nextGroupState', 'hidden');
                    }
                }
            });
            this.onChange({
                name: 'groupIndex',
                scope: this,
                fn: function (inEvent) {
                    this._updateGroupIndex(inEvent.data);
                }
            })
        },
        onRequireIndex: function (inIndex) {
            this.set('index', inIndex);
        },
        _updateGroupIndex: function (inGroupIndex) {
            var group = this.get('group');
            var allPage = this.get('allPage');
            var total = this.get('total');
            var pageCount = group.count;
            var i = inGroupIndex * pageCount;
            var end = i + pageCount;
            var pageIndex;
            var pages = [];
            for (; i < end && i < total; i++) {
                pageIndex = 1;
                pages.push(allPage[i]);
            }
            this.set('pages', pages);
        }

    }
});
/**
 * Created by PuTi(编程即菩提) 9/29/16.
 */
(function () {
    var Pagination = nb.define({
        parent: 'nb.bs.model.Pagination',
        method: {
            onRequireIndex: function (inIndex) {
                //do nothing,just overwrite parent method
            }
        }
    });
    nb.define({
        name: 'nb.bs.model.PaginationTable',
        parent: 'nb.Model',
        method: {
            init: function () {
                this._initModel();
                this._initData();
                this._initEvent();
            },
            _initEvent: function () {
                var table = this.get('table');
                var pagination = this.get('pagination');
                this.onChange({
                    name: 'currentRows',
                    scope: this,
                    fn: function (inEvent) {
                        var rows = inEvent.data;
                        table.set('rows', rows);
                    }
                });
                pagination.onChange({
                    name: 'index',
                    scope: this,
                    fn: function (inEvent) {
                        var pageNo = inEvent.data;
                        this.onIndexChange(pageNo);
                    }
                });
            },
            onIndexChange: function (inIndex) {

            },
            getPaginationType: function () {
                return Pagination;
            },
            _initModel: function () {
                var table = new nb.bs.model.Table();
                var paginationType = this.getPaginationType();
                var pagination = new paginationType();
                this.set('table', table);
                this.set('pagination', pagination);
            },
            _initData: function () {
                this.set('defaultMaxItemCount', 10);
                this._initTable();
                this._initPagination();
            },
            _initTable: function () {
                var model = this.get('table');
                model.set('showStriped', true);
                model.set('showBorder', true);
            },
            _initPagination: function () {

            }
        }
    });
})();

/**
 * Created by PuTi(编程即菩提) 9/25/16.
 */
nb.define({
    name: 'nb.bs.model.DataSetPaginationTable',
    parent: 'nb.bs.model.PaginationTable',
    method: {
        getPaginationType: function () {
            return nb.getType('nb.bs.model.Pagination');
        },
        _initEvent: function () {
            this.parent();
            var pagination = this.get('pagination');
            var table = this.get('table');
            this.onChange({
                name: 'maxItemCount',
                scope: this,
                fn: function (inEvent) {
                    var maxItemCount = inEvent.data;
                    var rows = this.get('rows');
                    var defaultMaxItemCount = this.set('defaultMaxItemCount');
                    if (maxItemCount <= 0) {
                        maxItemCount = defaultMaxItemCount;
                        this.set('maxItemCount', defaultMaxItemCount);
                    }
                    if (rows) {
                        this.set('rows', rows, {skipSameValue: false});
                    }
                }
            });
            this.onChange({
                name: 'rows',
                scope: this,
                fn: function (inEvent) {
                    var maxItemCount = this.get('defaultMaxItemCount');
                    var pagination = this.get('pagination');
                    var table = this.get('table');
                    var total = 0;
                    var rows = inEvent.data || [];
                    var length = rows.length;
                    this.set('groupIndex', 0);
                    this.set('total', total);
                    total = Math.ceil(length / maxItemCount);
                    this.set('total', total);
                    this.set('index', 1, {skipSameValue: false});
                    pagination.setOpts({
                        total: total,
                        index: 1,
                        group: {
                            count: 5
                        }
                    });
                }
            });
        },
        onRequireIndex: function (inIndex) {

        },
        onIndexChange: function (inIndex) {
            var rows = this.get('rows') || [];
            var maxItemCount = this.get('maxItemCount') || 10;
            var offset = (inIndex - 1) * maxItemCount;
            var i = offset;
            var array = [];
            var count = rows.length;
            for (; i < offset + maxItemCount; i++) {
                if (i < count) {
                    array.push(rows[i]);
                }
            }
            this.set('currentRows', array, {skipSameValue: false});
        }
    }
});
/**
 * Created by PuTi(编程即菩提) 10/16/16.
 */
nb.define({
    name: 'nb.bs.view.carousel.Indicator',
    view: {
        tag: 'li',
        'data-target': nb.bind('carouselIdRef'),
        'data-slide-to': nb.bind('index')
    }
});
/**
 * Created by PuTi(编程即菩提) 10/16/16.
 */
nb.define({
    name: 'nb.bs.view.carousel.Item',
    view: {
        'class': 'item',
        $html: [{
            tag: 'img',
            src: nb.bind('image')
        }]
    }
});
/**
 * Created by PuTi(编程即菩提) 10/16/16.
 */
(function () {
    var Indicators = nb.define({
        parent: 'nb.view.List',
        view: {
            tag: 'ol',
            'class': 'carousel-indicators'
        }
    });
    nb.define({
        name: 'nb.bs.view.Carousel',
        view: {
            id: nb.bind('carouselId'),
            'class': 'carousel slide',
            $html: [{
                $name: 'indicators',
                $type: Indicators,
                $model: 'indicatorsModel'
            }, {
                $name: 'inner',
                $type: 'nb.view.List',
                $model: 'itemsModel',
                'class': 'carousel-inner',
                'role': 'listbox'
            }, {
                tag: 'a',
                'class': 'left carousel-control',
                href: nb.bind('carouselIdRef'),
                role: 'button',
                'data-slide': 'prev',
                $html: [{
                    tag: 'span',
                    'class': 'glyphicon glyphicon-chevron-left',
                    'aria-hidden': 'true'
                }, {
                    tag: 'span',
                    'class': 'sr-only',
                    $text: 'Previous'
                }]
            }, {
                tag: 'a',
                'class': 'right carousel-control',
                href: nb.bind('carouselIdRef'),
                role: 'button',
                'data-slide': 'next',
                $html: [{
                    tag: 'span',
                    'class': 'glyphicon glyphicon-chevron-right',
                    'aria-hidden': 'true'
                }, {
                    tag: 'span',
                    'class': 'sr-only',
                    $text: 'Next'
                }]
            }]
        },
        method: {
            init: function () {
                var self = this;
                this.$().on('slid.bs.carousel', function (inEvent) {
                    var $item = $(inEvent.relatedTarget);
                    var index = $item.attr('data-list-index');
                    var model = self.getModel();
                    model.set('currentActiveIndex', index);
                });
            },
            onModelReady: function (inModel) {
                inModel.onChange({
                    name: 'items',
                    scope: this,
                    fn: function (inEvent) {
                        var items = inModel;
                        var $indicators = this.$('indicators');
                        var $inner = this.$('inner');
                        var children = $indicators.children();
                        $(children[0]).addClass('active');
                        children = $inner.children();
                        $(children[0]).addClass('active');
                        inModel.set('currentActiveIndex', 0);
                    }
                })
            }
        }
    });
})();

/**
 * Created by PuTi(编程即菩提) 9/20/16.
 */
var seq = 1;
nb.define({
    name: 'nb.bs.view.Table',
    model: 'nb.bs.model.Table',
    view: {
        tag: 'table',
        'class': ['table', nb.bind('striped'), nb.bind('border')],
        $html: [{
            $type: 'nb.bs.view.TableHeader',
            $model: {columns: 'columns'}
        }, {
            $type: 'nb.bs.view.TableBody',
            $model: {
                rows: 'rows'
            }
        }]
    }
});
nb.define({
    name: 'nb.bs.view.TableHeader',
    view: {
        tag: 'thead',
        $html: {
            $name: 'tr',
            tag: 'tr'
        }
    },
    method: {
        onModelReady: function (inModel) {
            inModel.onChange({
                name: 'columns',
                scope: this,
                fn: function (inEvent) {
                    var columns = inEvent.data;
                    var $tr = this.$('tr');
                    var Column = nb.get('nb.bs.view.TableHeaderColumn');
                    $tr.empty();
                    $.each(columns, function (inIndex, inColumn) {
                        var column = new Column();
                        column.setData(inColumn);
                        $tr.append(column.$());
                    });
                }
            });
        }
    }
});
nb.define({
    name: 'nb.bs.view.TableCell',
    view: {
        tag: 'td',
        $text: nb.bind('text'),
        colspan: nb.bind('colspan')
    },
    method: {
        setData: function (inData) {
            if (typeof inData == 'object') {
                var type = inData.type;
                var opts = inData.data || inData.model;
                var contentType = nb.getType(type);
                if (contentType) {
                    this._type(contentType, opts);
                } else {
                    this.setOpts(inData);
                }
            } else {
                this.setOpts({'text': inData});
            }
        },
        _type: function (contentType, opts) {
            var $el = this.$();
            var obj = new contentType;
            if (opts) {
                obj.setOpts(opts);
            }
            $el.append(obj.$());
        }
    }
});
nb.define({
    name: 'nb.bs.view.TableHeaderColumn',
    parent: 'nb.bs.view.TableCell',
    view: {
        tag: 'th',
        $text: nb.bind('text'),
        colspan: nb.bind('colspan')
    }
});
nb.define({
    name: 'nb.bs.view.TableBodyColumn',
    parent: 'nb.bs.view.TableCell'
});

nb.define({
    name: 'nb.bs.view.TableBody',
    view: {
        tag: 'tbody'
    },
    method: {
        onModelReady: function (inModel) {
            var $el = this.$();
            inModel.onChange({
                name: 'rows',
                scope: this,
                fn: function (inEvent) {
                    var list = inEvent.data;
                    var Row = nb.bs.view.TableRow;
                    $el.empty();
                    $.each(list, function (inIndex, inRow) {
                        var tr = new Row();
                        var $tr = tr.$();
                        $tr.attr('data-index', inIndex);
                        tr.setOpts({
                            list: inRow
                        });
                        $el.append($tr);
                    });
                }
            });
        }
    }
});
nb.define({
    name: 'nb.bs.view.TableRow',
    view: {
        tag: 'tr'
    },
    method: {
        onModelReady: function (inModel) {
            var $el = this.$();
            inModel.onChange({
                name: 'list',
                scope: this,
                fn: function (inEvent) {
                    var list = inEvent.data;
                    var Td = nb.bs.view.TableBodyColumn;
                    $.each(list, function (inIndex, inItem) {
                        var td = new Td();
                        var $td = td.$();
                        $td.addClass('td-' + inIndex);
                        $td.attr('data-index', inIndex);
                        td.setData(inItem);
                        $el.append($td);
                    });
                }
            });
        }
    }
});

/**
 * Created by PuTi(编程即菩提) 9/22/16.
 */
nb.define({
    name: 'nb.bs.view.Pagination',
    view: {
        tag: 'ul',
        'class': 'pagination',
        $html: [{
            $name: 'previousGroup',
            tag: 'li',
            'class': ['group-control previous', nb.bind('previousGroupState')],
            $html: {
                tag: 'a',
                href: "#",
                'aria-label': "Previous Group",
                $html: {
                    tag: 'span',
                    'class': 'glyphicon glyphicon-backward',
                    'aria-hidden': "true"
                }
            }
        }, {
            $name: 'previousPage',
            tag: 'li',
            'class': ['page-control previous', nb.bind('previousPageState')],
            $html: {
                tag: 'a',
                href: "#",
                'aria-label': "Previous Page",
                $html: {
                    tag: 'span',
                    'class': 'glyphicon glyphicon-triangle-left',
                    'aria-hidden': "true"
                }
            }
        }, {
            $name: 'nextPage',
            tag: 'li',
            'class': ['page-control next', nb.bind('nextPageState')],
            $html: {
                tag: 'a',
                href: "#",
                'aria-label': "Next Page",
                $html: {
                    tag: 'span',
                    'class': 'glyphicon glyphicon-triangle-right',
                    'aria-hidden': "true"
                }
            }
        }, {
            $name: 'nextGroup',
            tag: 'li',
            'class': ['group-control next', nb.bind('nextGroupState')],
            $html: {
                tag: 'a',
                href: "#",
                'aria-label': "Next Group",
                $html: {
                    tag: 'span',
                    'class': 'glyphicon glyphicon-forward',
                    'aria-hidden': "true"
                }
            }
        }]
    },
    method: {
        init: function () {
            var self = this;
            var $el = this.$();
            $el.on('click', '.page-no', function (inEvent) {
                var model = self.getModel();
                var $li = $(this);
                var index = $li.attr('data-index');
                model.set('requireIndex', index);
            });
            $el.on('click', '.group-control.previous.enabled', function (inEvent) {
                var model = self.getModel();
                model.showPreviousGroup();
            });
            $el.on('click', '.group-control.next.enabled', function (inEvent) {
                var model = self.getModel();
                model.showNextGroup();
            });
            $el.on('click', '.page-control.previous.enabled', function (inEvent) {
                var model = self.getModel();
                model.showPreviousPage();
            });
            $el.on('click', '.page-control.next.enabled', function (inEvent) {
                var model = self.getModel();
                model.showNextPage();
            });
        },
        onModelReady: function (inModel) {
            inModel.onChange({
                name: 'pages',
                scope: this,
                fn: function (inEvent) {
                    var PageNO = nb.get('nb.bs.view.Pagination.Page');
                    var pages = inEvent.data;
                    var $previousGroup = this.$('previousGroup');
                    var $previousPage = this.$('previousPage');
                    var $nextPage = this.$('nextPage');
                    var $nextGroup = this.$('nextGroup');
                    var $el = this.$();
                    $el.empty();
                    $el.append($previousGroup);
                    $el.append($previousPage);
                    $.each(pages, function (inIndex, inPage) {
                        var pageNO = new PageNO();
                        pageNO.setOpts(inPage);
                        $el.append(pageNO.$());
                    });
                    $el.append($nextPage);
                    $el.append($nextGroup);
                }
            });
            inModel.onChange({
                name: 'pageNO',
                scope: this,
                fn: function (inEvent) {
                    var pageNO = inEvent.data;
                    var $el = this.$();
                    var $pageNO = $el.find('[data-index=' + pageNO + ']');
                    $el.find('li').removeClass('active');
                    $pageNO.addClass('active');
                }
            });

        }
    }
});

nb.define({
    name: 'nb.bs.view.Pagination.Page',
    view: {
        tag: 'li',
        'class': ['page-no', nb.bind('active')],
        'data-index': nb.bind('index'),
        $html: {
            $name: 'a',
            tag: 'a',
            href: '#',
            $text: nb.bind('index')
        }
    }
});


/**
 * Created by PuTi(编程即菩提) 11/21/16.
 */
nb.define({
    name: 'nb.bs.Dialog',
    view: {
        'class': 'modal fade',
        'tabindex': -1,
        'role': "dialog",
        $html: {
            'class': 'modal-dialog confirm',
            $html: {
                $name: 'content',
                'class': 'modal-content',
                $html: [{
                    $name: 'header',
                    'class': 'modal-header',
                    $html: [{
                        tag: 'button',
                        type: 'button',
                        'class': 'close',
                        'data-dismiss': 'modal',
                        'aria-label': 'Close',
                        $html: {
                            tag: 'span',
                            'aria-hidden': 'true',
                            $text: '×'
                        }
                    }, {
                        tag: 'h4',
                        'class': 'modal-title',
                        $text: nb.bind('title')
                    }]
                }, {
                    $name: 'body',
                    'class': "modal-body",
                    $slot: 'body'
                }, {
                    $name: 'footer',
                    'class': "modal-footer",
                    $slot: 'footer'
                }]
            }
        }
    },
    method: {
        show: function () {
            this.$().modal({
                backdrop: 'static'
            });
        }
    }
});
/**
 * Created by PuTi(编程即菩提) 11/21/16.
 */
(function () {
    var Body = nb.define({
        view: [{
            $name: 'text',
            tag: 'p',
            'class': 'msg',
            $text: nb.bind('msg')
        }]
    });
    var Footer = nb.define({
        view: [{
            'class': 'col-xs-6',
            $html: {
                $name: 'btnConfirm',
                tag: 'button',
                type: 'button',
                'class': 'btn btn-primary btn-block confirm',
                $html: '确定'
            }
        }, {
            'class': 'col-xs-6',
            $html: {
                $name: 'btnCancel',
                tag: 'button',
                type: 'button',
                'class': 'btn btn-default btn-block cancel',
                'data-dismiss': "modal",
                $html: '取消'
            }
        }]
    });
    nb.define({
        name: 'nb.bs.dialog.Confirm',
        parent: 'nb.bs.Dialog',
        slot: {
            body: ['html', {
                $type: Body,
                $model: ''
            }],
            footer: ['html', {
                $name: 'buttonGroup',
                $type: Footer
            }]
        },
        method: {
            init: function () {
                var self = this;
                var $el = this.$();
                this.$('buttonGroup', true).$('btnConfirm').on('click', function (inEvent) {
                    self._confirmFlag = true;
                    var model = self.getModel() || {};
                    var scope = model.get('scope');
                    var confirm = model.get('confirm');
                    var hide = true;
                    if (confirm) {
                        hide = confirm.call(scope);
                    }
                    if (hide) {
                        $el.modal('hide')
                    }

                });
                $el.on('hide.bs.modal', function (inEvent) {
                    var model = self.getModel() || {};
                    var scope = model.get('scope');
                    var cancel = model.get('cancel');
                    if (self._confirmFlag) {
                        return;
                    }
                    if (cancel) {
                        return cancel.call(scope);
                    }
                });
            },
            setOpts: function (inOpts) {
                this.parent(inOpts);
            },
            show: function () {
                this.parent();
                this._confirmFlag = false;
            }
        }
    });
})();
