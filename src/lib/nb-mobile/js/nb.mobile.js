/**
 * Created by PuTi(编程即菩提) 10/21/16.
 */
/**
 * itemType
 * bg
 * list
 * refreshTipChangeOffset
 * moreTipChangeOffset
 * showBGOffset
 * pullDownIconClass
 * pullUpIconClass
 * refreshLoadingIconClass
 * moreLoadingIconClass
 */
nb.define({
    name: 'nb.mobile.model.PaginationList',
    parent: 'nb.Model',
    method: {
        init: function () {
            this.set('refreshTipChangeOffset', 50);
            this.set('moreTipChangeOffset', 50);
            this.set('showBGOffset', 50);
            this.set('pullDownIconClass', 'glyphicon glyphicon-chevron-down');
            this.set('pullUpIconClass', 'glyphicon glyphicon-chevron-up');
            this.set('refreshLoadingIconClass', 'glyphicon glyphicon-refresh');
            this.set('moreLoadingIconClass', 'glyphicon glyphicon-refresh');
        },
        setList: function (inList, inHasMore) {
            this.set('list', inList);
            this.set('hasMore', inHasMore);
            this.set('all', inList);
        },
        appendList: function (inList, inHasMore) {
            var all = this.get('all') || [];
            this.set('moreList', inList);
            this.set('hasMore', inHasMore);
            this.set('all', all.concat(inList));
        },
        /**
         * refresh list
         */
        refresh: function () {
        },
        /**
         * get more list data
         */
        getMore: function () {
        },
        /**
         * get all
         */
        getAll: function () {
        }
    }
});
/**
 * Created by PuTi(编程即菩提) 10/20/16.
 */
nb.define({
    name: 'nb.mobile.model.Header',
    parent: 'nb.Model',
    method: {
        init: function () {
            var defaultStatus = 'header-visible-t';
            var defaultReturnStatus = 'visible-t';
            this.set('status', defaultStatus);
            this.set('returnStatus', defaultReturnStatus);
            this.set('title', 'Title');
            this.initOptionModel();
            this.onChange({
                name: 'visible',
                scope: this,
                fn: function (inEvent) {
                    var visible = inEvent.data;
                    var status = defaultStatus;
                    if (visible === false) {
                        status = 'header-visible-f';
                    }
                    this.set('status', status);
                }
            });
            this.onChange({
                name: 'returnVisible',
                scope: this,
                fn: function (inEvent) {
                    var visible = inEvent.data;
                    var status = defaultReturnStatus;
                    if (visible === false) {
                        status = 'visible-f';
                    }
                    this.set('returnStatus', status);
                }
            });
            this.onChange({
                name: 'return',
                scope: this,
                fn: function (inEvent) {
                    var fn = this.get('returnFn');
                    var scope = this.get('scope');
                    var flag = false;
                    if (fn) {
                        flag = fn.call(scope)
                    }
                }
            })
        },
        initOptionModel: function () {
            var options = new nb.Model();
            this.set('options', options);
        }
    }
});
/**
 * Created by PuTi(编程即菩提) 10/21/16.
 */
nb.define({
    name: 'nb.mobile.model.DotLoading',
    parent: 'nb.Model',
    method: {
        init: function () {
            this._dotList = ['.', '..', '...'];
            this.set('text', 'Loading');
            this.onChange({
                name: 'loading',
                scope: this,
                fn: function (inEvent) {
                    if (inEvent.data) {
                        this._start();
                    } else {
                        this._stop();
                    }
                }
            });
        },
        _start: function () {
            this._dotIndex = 0;
            this._changeDot();
        },
        _stop: function () {
            clearTimeout(this._timeout);
        },
        _changeDot: function () {
            var self = this;
            var dot = this._dotList[this._dotIndex++];
            this.set('dot', dot);
            this._timeout = setTimeout(function () {
                if (self._dotIndex === 3) {
                    self._dotIndex = 0;
                }
                self._changeDot();
            }, 500);
        }
    }
});
/**
 * Created by PuTi(编程即菩提) 10/18/16.
 */
nb.define({
    name: 'nb.mobile.model.Page',
    parent: 'nb.Model',
    method: {
        init: function () {
            var header = this.initHeader();
            var content = this.initContent();
            this.initLoading();
            this.set('dataReady', false);
            this.onReady(header, content);
            this.onChange({
                name: 'contentData',
                before: true,
                scope: this,
                fn: function (inEvent) {
                    var data = inEvent.data;
                    this.onDataReady(content, data);
                    return null;
                }
            });
            this.onChange({
                name: 'requireRequestPageData',
                scope: this,
                fn: function (inEvent) {
                    var flag = inEvent.data;
                    if (flag) {
                        this.requestPageData();
                    }
                }
            })
        },
        initHeader: function () {
            var header = new nb.mobile.model.Header();
            this.set('header', header);
            return header;
        },
        initContent: function () {
            var content = new nb.Model();
            this.set('content', content);
            return content;
        },
        initLoading: function () {
            var loading = new nb.mobile.model.DotLoading();
            this.set('loading', loading);
            this.onChange({
                name: 'dataReady',
                scope: this,
                fn: function (inEvent) {
                    var ready = inEvent.data;
                    loading.set('loading', !ready);
                }
            })
        },
        createQueryData: function () {
            //template method
        },
        onReady: function (inHeader, inContent) {
            //template method
        },
        onDataReady: function (inContent, inData) {
            //template method
        },
        onEnter: function () {
            //template method
        },
        onLeave: function () {
            //template method
        },
        requestPageData: function () {
            var self = this;
            var inKey = this.get('key');
            var ioPath = this.get('ioPath');
            var io = nb.get(ioPath || 'app.io');
            var ioMethodName = ['get', inKey[0].toUpperCase(), inKey.substring(1), 'PageData'].join('');
            var ioMethod = io ? io[ioMethodName] : null;
            var contentModel;
            var data;
            this.set('dataReady', false);
            data = self.createQueryData();
            if (ioMethod) {
                contentModel = self.get('content');
                ioMethod.call(this, {
                    data: data,
                    success: function (inResult) {
                        //$.each(inResult, function (inName, inValue) {
                        //    contentModel.set(inName, inValue);
                        //});
                        self.set('contentData', inResult);
                        //for hide loading modal
                        self.set('dataReady', true);
                    },
                    //error: function (inResult) {
                    //
                    //},
                    always: function (inResult) {

                    }
                });
            } else {
                self.set('contentData', {});
                self.set('dataReady', true);
            }
        }
    }
});
/**
 * Created by PuTi(编程即菩提) 10/11/16.
 */
(function () {
    var returnOpts = {};
    nb.define({
        name: 'nb.mobile.model.Pages',
        parent: 'nb.Model',
        method: {
            init: function () {
                this._$initEvent();
            },
            getPageModel: function (inPageName) {
                var index = inPageName.lastIndexOf('.');
                var name;
                if (index > 0) {
                    name = [inPageName.substring(0, index), '.model', inPageName.substring(index)].join('');
                } else {
                    name = [inPageName, 'Model'].join('');
                }
                return name;
            },
            _$initEvent: function () {
                var self = this;
                this.onChange({
                    name: 'pages',
                    scope: this,
                    fn: function (inEvent) {
                        var self = this;
                        var data = inEvent.data;
                        var items = [];
                        var itemType = [];
                        var pageModelMap = {};
                        var pageHistory = [];
                        $.each(data, function (inKey, inPageName) {
                            var name = self.getPageModel(inPageName);
                            var modelType = nb.get(name) || nb.getType('nb.mobile.model.Page');
                            var model = new modelType;
                            var headerModel = model.get('header');
                            headerModel.onChange({
                                name: 'return',
                                scope: self,
                                fn: function (inEvent) {
                                    self.hidePage(inEvent.data);
                                }
                            });
                            model.set('key', inKey);
                            pageModelMap[inKey] = model;
                            model.set('key', inKey);
                            items.push(model);
                            itemType.push(inPageName);
                        });
                        this.set('itemType', itemType);
                        this.set('items', items);
                        this.set('pageModelMap', pageModelMap);
                        this.set('pageHistory', pageHistory);
                    }
                });
            },
            showPage: function (inKey, inOpts) {
                var pageModelMap = this.get('pageModelMap');
                var pageHistory = this.get('pageHistory');
                var pageModel = pageModelMap[inKey];
                var lastActivePageModel = pageHistory[pageHistory.length - 1];
                var lastStatus = 'slideOutLeft';
                var currentStatus = 'slideInRight';
                if (lastActivePageModel) {
                    $.each(pageHistory, function (inIndex, inPageModel) {
                        //TODO
                    });
                } else {
                    currentStatus = 'fadeIn';
                }

                if (lastActivePageModel) {
                    lastActivePageModel.set('activeStatus', '');
                    lastActivePageModel.set('status', lastStatus);
                }
                pageModel.set('status', currentStatus);
                pageModel.set('activeStatus', 'active');
                pageModel.onEnter();
                pageModel.set('requireRequestPageData', true, {skipSameValue: false});
                //pageModel.requestPageData();
                pageHistory.push(pageModel);
                this._lastPageModel = lastActivePageModel;
                this._animationTimeout();
            },
            hidePage: function (inOpts) {
                var opts = inOpts || {};
                var page = opts.page;
                var pageHistory = this.get('pageHistory');
                var currentPage = pageHistory.pop();
                var nextPage;
                currentPage.set('status', 'slideOutRight');
                currentPage.set('activeStatus', '');
                currentPage.onLeave();
                while (pageHistory.length > 0) {
                    nextPage = pageHistory[pageHistory.length - 1];
                    if (page) {
                        if (nextPage.get('key') === page) {
                            break;
                        }
                    } else {
                        break;
                    }
                    pageHistory.pop();
                }
                nextPage.set('status', 'slideInLeft');
                nextPage.set('activeStatus', 'active');
                nextPage.onEnter();
                this._lastPageModel = currentPage;
                this._animationTimeout();
            },
            showLoading: function () {
                this.set('loading', 'loading');
            },
            hideLoading: function () {
                this.set('loading', '');
            },
            _animationTimeout: function () {
                var self = this;
                var last = this._lastPageModel;
                this.set('animating', 'animating');
                setTimeout(function () {
                    if (last) {
                        last.set('status', '');
                    }
                    self.set('animating', '');
                }, 500);
            }
        }
    });
})();
/**
 * Created by PuTi(编程即菩提) 10/26/16.
 */
(function () {
    nb.define({
        name: 'nb.mobile.view.HorizontalTabListItem',
        view: {
            tag: 'li',
            'class': 'nb-v-item',
            style: {
                float: 'left',
                width: 110,
                'text-align': 'center'
            },
            $text: nb.bind('name')
        }
    });
    var TabList = nb.define({
        parent: 'nb.view.List',
        view: {
            tag: 'ul',
            style: {
                'list-style': 'none',
                padding: 0
            },
            'class': 'nb-m-h-tab-list'
        },
        method: {
            init: function () {
                var self = this;
                var $el = this.$();
                $el.on('click', '.nb-v-item', function (inEvent) {
                    var $item = $(this);
                    var index = $item.attr('data-list-index');
                    self.getModel().set('activeIndex', index);
                    $el.addClass('nb-v-active');
                });
            },
            onItemReady: function (inItem) {
            },
            onItemsReady: function (inItemList) {
                var count = inItemList.length;
                var itemWidth = this.getModel().get('itemWidth');
                var totalWidth = itemWidth * count;
                var $el = this.$();
                $el.css('width', totalWidth);
            }
        }
    });
    nb.define({
        name: 'nb.mobile.view.HorizontalTabList',
        view: {
            'class': 'nb-m-h-tab-list-scroll',
            $html: {
                $name: 'list',
                $type: TabList
            }
        },
        method: {
            onModelReady: function (inModel) {
                var defaultItemWidth = 110;
                var defaultItemType = 'nb.mobile.view.HorizontalTabListItem';
                var itemWidth = inModel.get('itemWidth');
                var itemType = inModel.get('itemType');
                if (itemWidth === undefined) {
                    inModel.set('itemWidth', defaultItemWidth);
                }
                if (itemType === undefined) {
                    inModel.set('itemType', defaultItemType);
                }
                this.$('list', true).setModel(inModel);
                inModel.onChange({
                    name: 'activeIndex',
                    scope: this,
                    fn: function () {
                        var $el = this.$();
                        var $list = this.$('list');
                        var inActivateView = $list.find('.nb-v-active');
                        setTimeout(function () {
                            var pos = inActivateView.position();
                            var left = pos.left;
                            var scrollLeft = $el.scrollLeft();
                            var width = $el.width();

                            if (left < 0) {
                                $el.animate({scrollLeft: scrollLeft + pos.left}, 300);
                            } else if (left + defaultItemWidth < width) {

                            } else {
                                $el.animate({scrollLeft: scrollLeft + left + defaultItemWidth - width}, 300);
                            }
                        }, 50);
                    }
                });
            }
        }
    });
})();

/**
 * Created by PuTi(编程即菩提) 5/28/16.
 */
(function () {
    var TEXT_PULL_DOWN_TO_REFRESH = '下拉刷新...';
    var TEXT_RELEASE_TO_REFRESH = '放开刷新...';
    var TEXT_REFRESH_DATA = '正在刷新...';
    var TEXT_PULL_UP_TO_MORE = '上拉获取更多...';
    var TEXT_RELEASE_TO_MORE = '放开获取更多...';
    var TEXT_GET_MORE = '正在获取更多...';
    var STATE_LIST = 'data-list-state';
    var STATE_LIST_INIT = 'init';
    var STATE_LIST_PULL_DOWN_TO_REFRESH = 'pullDownToRefresh';
    var STATE_LIST_RELEASE_TO_REFRESH = 'releaseToRefresh';
    var STATE_LIST_REFRESH_DATA = 'refreshData';
    var STATE_LIST_PULL_UP_TO_MORE = 'pullUpToMore';
    var STATE_LIST_RELEASE_TO_MORE = 'releaseToMore';
    var STATE_LIST_GET_MORE = 'getMore';
    var Item = nb.define({
        view: {
            tag: 'li',
            'class': 'list-group-item'
        },
        method: {
            setOpts: function (inOpts) {
                var opts = inOpts || {};
                var label = opts.label;
                this.$().text(label);
            }
        }
    });
    nb.define({
        name: 'nb.mobile.view.PaginationList',
        view: {
            'class': 'nb-m-p-list',
            $html: [{
                $name: 'bg',
                'class': 'nb-m-p-list-bg'
            }, {
                $name: 'refreshBar',
                'class': 'nb-m-p-list-refresh',
                $html: [{
                    $name: 'refreshIcon',
                    tag: 'i',
                    'class': 'icon-refresh glyphicon glyphicon-chevron-down'
                }, {
                    $name: 'refreshTip',
                    'class': 'tip',
                    tag: 'span'
                }]
            }, {
                $name: 'scroll',
                'class': 'nb-m-scroll',
                $html: {
                    $name: 'list',
                    tag: 'ul',
                    'class': 'list-group nb-m-p-list-list'
                }
            }, {
                $name: 'moreBar',
                'class': 'nb-m-p-list-more',
                $html: [{
                    $name: 'moreIcon',
                    tag: 'i',
                    'class': 'icon-more glyphicon glyphicon-chevron-up'
                }, {
                    $name: 'moreTip',
                    'class': 'tip',
                    tag: 'span'
                }]
            }]
        },
        method: {
            init: function () {

            },
            onModelReady: function (inModel) {
                this.parent(inModel);
                this._refreshBarHeight = 0;
                this._lock = false;
                this._reset();
                this._initEvent();
                inModel.onChange({
                    name: 'bg',
                    scope: this,
                    fn: function (inEvent) {
                        var BGType = inEvent.data;
                        if (BGType) {
                            BGType = nb.getType(BGType);
                            var $bg = this.$('bg');
                            $bg.empty();
                            $bg.append(new BGType().$());
                        }
                    }
                });
                inModel.onChange({
                    name: 'list',
                    scope: this,
                    fn: function (inEvent) {
                        var list = inEvent.data;
                        this._setList(list);
                    }
                });
                inModel.onChange({
                    name: 'hasMore',
                    scope: this,
                    fn: function (inEvent) {
                        this._hasMore = inEvent.data;
                    }
                });
                inModel.onChange({
                    name: 'moreList',
                    scope: this,
                    fn: function (inEvent) {
                        var list = inEvent.data;
                        this._appendList(list);
                    }
                });
            },
            initHandler: function () {
                var model = this._model;
                if (!model) {
                    throw new Error('The model of PaginationList is null.');
                }
                this._setStateWithRefreshTip(STATE_LIST_INIT, TEXT_PULL_DOWN_TO_REFRESH, model.get('pullDownIconClass'));
                this._setStateWithMoreTip(STATE_LIST_INIT, TEXT_GET_MORE, model.get('pullUpIconClass'));
                this._moveBackScroll();
            },
            pullDownToRefreshHandler: function () {
                this._setStateWithRefreshTip(STATE_LIST_PULL_DOWN_TO_REFRESH, TEXT_PULL_DOWN_TO_REFRESH);
            },
            releaseToRefreshHandler: function () {
                this._setStateWithRefreshTip(STATE_LIST_RELEASE_TO_REFRESH, TEXT_RELEASE_TO_REFRESH);
            },
            refreshDataHandler: function () {
                var model = this._model;
                this._setStateWithRefreshTip(STATE_LIST_REFRESH_DATA, TEXT_REFRESH_DATA, model.get('refreshLoadingIconClass'));
                this._moveBackScroll(this._refreshBarHeight);
                this._refresh();
            },
            releaseToMoreHandler: function () {
                this._setStateWithMoreTip(STATE_LIST_RELEASE_TO_MORE, TEXT_RELEASE_TO_MORE);
            },
            pullUpToMoreHandler: function () {
                this._setStateWithMoreTip(STATE_LIST_PULL_UP_TO_MORE, TEXT_PULL_UP_TO_MORE);
            },
            getMoreHandler: function () {
                var model = this._model;
                this._setStateWithMoreTip(STATE_LIST_GET_MORE, TEXT_GET_MORE, model.get('moreLoadingIconClass'));
                this._moveBackScroll(-this._moreBarHeight);
                this._getMore();
            },
            _initEvent: function () {
                var self = this;
                var $el = this.$();
                var $scroll = this.$('scroll');
                var $list = this.$('list');
                var $refreshBar = this.$('refreshBar');
                var $moreBar = this.$('moreBar');
                var $bg = this.$('bg');
                $el.on('touchstart', function (inEvent) {
                    var p = inEvent.originalEvent.touches[0];
                    self._scrollTop = $scroll.scrollTop();
                    self._scrollHeight = $scroll.height();
                    self._listHeight = $list.height();
                    self._lastX = p.clientX;
                    self._lastY = p.clientY;
                });
                $el.on('touchmove', function (inEvent) {
                    var p = inEvent.originalEvent.touches[0];
                    var x = p.clientX;
                    var y = p.clientY;
                    var dy = y - self._lastY - self._scrollTop;
                    var refreshBarHeight = self._refreshBarHeight = self._refreshBarHeight || $refreshBar.height();
                    var moreBarHeight = self._moreBarHeight = self._moreBarHeight || $moreBar.height();
                    var model = self._model;
                    var offset = $el.offset();
                    if (y < offset.top || y > offset.top + $el.parent().height()) {
                        self._onTouchEnd();
                        inEvent.preventDefault();
                        return;
                    }
                    if (self._lock || self._state === STATE_LIST_REFRESH_DATA || self._state === STATE_LIST_GET_MORE || !model || !model.refresh) {
                        return;
                    }
                    if (dy > 0) {
                        //pull down
                        $scroll.css({
                            transform: 'translate3d(0,' + dy + 'px,0)'
                        });
                        $refreshBar.css({
                            transform: 'translate3d(0,' + (dy - refreshBarHeight) + 'px,0)'
                        });
                        if (dy > model.get('showBGOffset')) {
                            $bg.addClass('show');
                        } else {
                            $bg.removeClass('show');
                        }
                        inEvent.preventDefault();
                    } else if (self._hasMore && self._scrollHeight + self._scrollTop == self._listHeight) {
                        //pull up
                        dy += self._scrollTop;
                        $scroll.css({
                            transform: 'translate3d(0,' + dy + 'px,0)'
                        });
                        $moreBar.css({
                            transform: 'translate3d(0,' + (dy + moreBarHeight) + 'px,0)'
                        });
                        inEvent.preventDefault();
                    } else {
                        dy = 0;
                    }
                    self._setScrollTopOffset(dy);
                });
                $el.on('touchend', function (inEvent) {
                    self._onTouchEnd();
                });
                $scroll.on('transitionend', function (inEvent) {
                    $moreBar.css('transition', '');
                    $refreshBar.css('transition', '');
                    $scroll.css('transition', '');
                    if (self._state === STATE_LIST_REFRESH_DATA) {

                    } else if (self._state === STATE_LIST_GET_MORE) {

                    } else {
                        self._reset();
                    }
                    self._lock = false;
                    inEvent.preventDefault();
                });
            },
            _onTouchEnd: function () {
                var $bg = this.$('bg');
                if (this._state === STATE_LIST_RELEASE_TO_REFRESH) {
                    this.callHandler(STATE_LIST_REFRESH_DATA);
                } else if (this._state === STATE_LIST_RELEASE_TO_MORE) {
                    this.callHandler(STATE_LIST_GET_MORE);
                } else {
                    this._moveBackScroll();
                }
                $bg.removeClass('show');
            },
            _moveBackScroll: function (inY) {
                var $scroll = this.$('scroll');
                var $refreshBar = this.$('refreshBar');
                var $moreBar = this.$('moreBar');
                var y = inY || 0;
                var scrollTopOffset = this._scrollTopOffset || 0;
                var state = this._state;
                if (scrollTopOffset != 0) {
                    this._lock = true;
                    if (state === STATE_LIST_REFRESH_DATA || state === STATE_LIST_PULL_DOWN_TO_REFRESH || state === STATE_LIST_RELEASE_TO_REFRESH) {
                        $refreshBar.css({
                            transition: 'transform .5s ease-in-out'
                        });
                        $refreshBar.css({
                            transform: 'translate3d(0,' + (state === STATE_LIST_REFRESH_DATA ? 0 : -this._refreshBarHeight) + 'px,0)'
                        });
                    } else if (state === STATE_LIST_GET_MORE || state === STATE_LIST_PULL_UP_TO_MORE || state === STATE_LIST_RELEASE_TO_MORE) {
                        $moreBar.css({
                            transition: 'transform .5s ease-in-out'
                        });
                        $moreBar.css({
                            transform: 'translate3d(0,' + (state === STATE_LIST_GET_MORE ? 0 : this._moreBarHeight) + 'px,0)'
                        });
                    }
                    $scroll.css({
                        transition: 'transform .5s ease-in-out'
                    });
                    $scroll.css({
                        transform: 'translate3d(0,' + y + 'px,0)'
                    });
                    this._scrollTopOffset = y;
                }
            },
            _reset: function () {
                this._scrollTop = 0;
                this._setScrollTopOffset(0);
            },
            _setScrollTopOffset: function (inY) {
                var $el = this.$();
                var model = this._model;
                if (inY >= 0) {
                    //pull down
                    if (inY === 0) {
                        this.callHandler(STATE_LIST_INIT);
                    } else if (inY > model.get('refreshTipChangeOffset')) {
                        this.callHandler(STATE_LIST_RELEASE_TO_REFRESH);
                    } else {
                        this.callHandler(STATE_LIST_PULL_DOWN_TO_REFRESH);
                    }
                } else {
                    //pull up
                    if (inY < -model.get('moreTipChangeOffset')) {
                        this.callHandler(STATE_LIST_RELEASE_TO_MORE);
                    } else {
                        this.callHandler(STATE_LIST_PULL_UP_TO_MORE);
                    }
                }
                this._scrollTopOffset = inY;
            },
            _setStateWithRefreshTip: function (inState, inText, inClass) {
                var $el = this.$();
                var $refreshTip = this.$('refreshTip');
                var $refreshIcon = this.$('refreshIcon');
                $el.attr(STATE_LIST, inState);
                if (inClass) {
                    $refreshIcon.removeClass();
                    $refreshIcon.addClass('icon-refresh');
                    $refreshIcon.addClass(inClass);
                }
                $refreshTip.text(inText);
                this._state = inState;
            },
            _setStateWithMoreTip: function (inState, inText, inClass) {
                var $el = this.$();
                var $moreTip = this.$('moreTip');
                var $moreIcon = this.$('moreIcon');
                $el.attr(STATE_LIST, inState);
                if (inClass) {
                    $moreIcon.removeClass();
                    $moreIcon.addClass('icon-more');
                    $moreIcon.addClass(inClass);
                }
                $moreTip.text(inText);
                this._state = inState;
            },
            _refresh: function () {
                this._model.refresh();
            },
            _getMore: function () {
                this._model.getMore();
            },
            _setList: function (inList) {
                this._addList(inList, true);
            },
            _appendList: function (inList) {
                this._addList(inList);
            },
            _addList: function (inList, inRest) {
                var $el = this.$('list');
                var itemType = this._model.get('itemType');
                var Type = Item;
                if (itemType) {
                    Type = nb.getType(itemType);
                }
                if (inRest) {
                    $el.empty();
                }
                if (inList) {
                    $.each(inList, function (inIndex, inItem) {
                        var item = new Type();
                        item.setOpts(inItem);
                        $el.append(item.$());
                    });
                }
                this._setScrollTopOffset(0);
                this._resetTip();
            },
            _resetTip: function () {
                this.$('refreshTip').text(TEXT_PULL_DOWN_TO_REFRESH);
                this.$('moreTip').text(TEXT_PULL_UP_TO_MORE);
            }
        }
    });
})();
/**
 * Created by PuTi(编程即菩提) 10/20/16.
 */
nb.define({
    name: 'nb.mobile.view.Header',
    view: {
        'class': 'nb-m-page-header am-g',
        $html: [{
            'class': 'am-u-sm-2 return',
            $html: {
                $name: 'actionReturn',
                'class': ['inner', nb.bind('returnStatus')],
                $html: {
                    tag: 'i',
                    'class': 'am-icon-angle-left',
                    "aria-hidden": "true"
                }
            }
        }, {
            'class': 'am-u-sm-8 title',
            $text: nb.bind('title')
        }, {
            $name: 'optsWrapper',
            'class': 'am-u-sm-2 opts',
            $text:nb.bind('opts')
        }]
    },
    method: {
        init: function () {
            var self = this;
            this.$('actionReturn').on('click', function (inEvent) {
                var model = self.getModel();
                model.set('return', null, {skipSameValue: false});
            });
        },
        onModelReady: function (inModel) {
            inModel.onChange({
                name: 'optionsType',
                scope: this,
                fn: function (inEvent) {
                    var type = inEvent.data;
                    var view, viewType;
                    if (type) {
                        viewType = nb.getType(type);
                        view = new viewType;
                        view.setOpts(inModel.get('options'));
                        this.$('optsWrapper').empty().append(view.$());
                    }
                }
            });
        }
    }
});
/**
 * Created by PuTi(编程即菩提) 10/21/16.
 */
nb.define({
    name: 'nb.mobile.view.DotLoading',
    view: {
        tag: 'p',
        'class': 'nb-m-loading-dot',
        $html: [{
            tag: 'span',
            $text: nb.bind('text')
        }, {
            tag: 'span',
            $text: nb.bind('dot')
        }]
    }
});
/**
 * Created by PuTi(编程即菩提) 10/11/16.
 */
nb.define({
    name: 'nb.mobile.view.Page',
    view: {
        'class': ['nb-m-page', 'container-fluid', nb.bind('key'), nb.bind('activeStatus'), nb.bind('status'), nb.bind('header.status')],
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
                    $model: 'loading'
                }
            }]
        }]
    }
});
/**
 * Created by PuTi(编程即菩提) 10/10/16.
 */
nb.define({
    name: 'nb.mobile.view.Pages',
    parent: 'nb.view.List',
    view: {
        'class': 'nb-m-pages abs-full'
    }
});
/**
 * Created by PuTi(编程即菩提) 5/29/16.
 */
(function () {
    nb.define({
        name: 'nb.mobile.view.PageAnimationMask',
        view: {
            'class': ['nb-m-page-ani-mask abs-full', nb.bind('animating')]
        }
    })
})();
/**
 * Created by PuTi(编程即菩提) 5/29/16.
 */
(function () {
    nb.define({
        name: 'nb.mobile.view.PageLoadingMask',
        view: {
            'class': ['nb-m-page-loading-mask abs-full', nb.bind('loading')],
            $html: {
                $name: 'modal',
                'class': 'am-modal am-modal-loading am-modal-no-btn',
                tabindex: "-1",
                $html: {
                    'class': 'am-modal-dialog',
                    $html: [{
                        'class': 'am-modal-hd',
                        $text: '正在载入...'
                    }, {
                        'class': 'am-modal-hd',
                        $html: {
                            tag: 'span',
                            'class': 'am-icon-spinner am-icon-spin'
                        }
                    }]
                }
            }
        },
        method: {
            onModelReady: function (inModel) {
                inModel.onChange({
                    name: 'loading',
                    scope: this,
                    fn: function (inEvent) {
                        var loading = inEvent.data;
                        var $modal = this.$('modal');
                        if (loading == 'loading') {
                            $modal.modal();
                        } else {
                            $modal.modal('close');
                        }
                    }
                });
            }
        }
    })
})();
/**
 * Created by PuTi(编程即菩提) 10/8/16.
 */
nb.define({
    name: 'nb.mobile.Model',
    parent: 'nb.Model',
    method: {
        init: function () {
            this._$initModel();
            this._$initData();
            this._$initEvent();
        },
        _$initModel: function () {
            // this.set('footerModel', new nb.mobile.model.Footer());
            this.set('pagesModel', new nb.mobile.model.Pages());
        },
        _$initEvent: function () {
            var self = this;
            var pagesModel = this.get('pagesModel');
            this.onChange({
                name: 'pages',
                scope: this,
                fn: function (inEvent) {
                    var pages = inEvent.data;
                    var pagesModel = this.get('pagesModel');
                    pagesModel.set('pages', pages);
                }
            });
            pagesModel.onChange({
                name: 'pageModelMap',
                scope: this,
                fn: function (inEvent) {
                    var origin = inEvent.origin;
                    var data = inEvent.data;
                    if (origin) {
                        $.each(origin, function (inKey, inPageModel) {
                            //TODO clear change events
                        });
                    }
                    if (data) {
                        $.each(data, function (inKey, inPageModel) {
                            inPageModel.set('appModel', self);
                            self.onPageModelReady(inKey, inPageModel);
                        });
                    }
                }
            });
        },
        _$initData: function () {
            this._pageModelReadyListenerMap = {};
        },
        addPage: function () {

        },
        showPage: function (inKey, inOpts) {
            var pagesModel = this.get('pagesModel');
            pagesModel.showPage(inKey, inOpts);
        },
        hidePage: function (inOpts) {
            var pagesModel = this.get('pagesModel');
            pagesModel.hidePage(inOpts);
        },
        showLoading: function () {
            var pagesModel = this.get('pagesModel');
            pagesModel.showLoading();
        },
        hideLoading: function () {
            var pagesModel = this.get('pagesModel');
            pagesModel.hideLoading();
        },
        appPageModelReadyListener: function (inPageKey, inCallback) {
            //onMainPageModelReady
            var map = this._pageModelReadyListenerMap;
            map[inPageKey] = inCallback;
        },
        onPageModelReady: function (inKey, inPageModel) {
            var map = this._pageModelReadyListenerMap;
            var method = map[inKey];
            if (method) {
                method.call(this, inPageModel, inPageModel.get('content'));
            }
        }
    }
});
(function () {
    var ItemModel = nb.define({
        parent: 'nb.Model',
        method: {
            init: function () {
                this.onChange({
                    name: 'active',
                    scope: this,
                    fn: function (inEvent) {
                        var active = inEvent.data;
                        var defaultIcon = this.get('icon');
                        var selectedIcon = this.get('selectedIcon');
                        this.set('iconStatus', defaultIcon);
                        if (active) {
                            this.set('iconStatus', selectedIcon);
                        }
                    }
                });
            }
        }
    });
    nb.define({
        name: 'nb.mobile.model.Footer',
        parent: 'nb.Model',
        method: {
            init: function () {
                var items = [{
                    key: 'list',
                    grid: 'am-u-sm-4',
                    defaultIcon: 'am-icon-reorder',
                    label: '参与'
                }, {
                    key: 'add',
                    grid: 'am-u-sm-4',
                    defaultIcon: 'am-icon-plus',
                    label: '发起'
                }, {
                    key: 'home',
                    grid: 'am-u-sm-4',
                    defaultIcon: 'am-icon-user',
                    label: '我的'
                }];
                this.set('itemType', 'nb.mobile.view.FooterTabBarItem');
                this.set('items', items);
                this._$initEvent();
            },
            _$initEvent: function () {
                this.onChange({
                    name: 'items',
                    scope: this,
                    fn: function (inEvent) {
                        var items = inEvent.data || [];
                        var itemModelList = [];
                        var itemModelMap = {};
                        if (items) {
                            $.each(items, function (inIndex, inItem) {
                                var model = new ItemModel();
                                model.setOpts(inItem);
                                itemModelList.push(model);
                                itemModelMap[inItem.key] = model;
                            });
                            this.set('itemModelList', itemModelList);
                            this.set('itemModelMap', itemModelMap);
                        }
                        return itemModelList;
                    }
                });
            }
        }
    });
})();
nb.define({
    name: 'nb.mobile.view.FooterTabBarItem',
    view: {
        'class': ['footer-tab-bar-item', nb.bind('active'), nb.bind('key')],
        'data-key': nb.bind('key'),
        $html: [{
            tag: 'i',
            'class': ['tab-icon', nb.bind('iconStatus')]
        }, {
            'class': 'tab-label',
            $text: nb.bind('label')
        }]
    }
});
nb.define({
    name: 'nb.mobile.view.Footer',
    parent: 'nb.view.List',
    view: {
        'class': ['nb-m-footer', nb.bind('status')]
    }
});

nb.define({
    name: 'nb.mobile.view.modal.Confirm',
    view: {
        'class': 'nb-m-modal-confirm',
        $html: {
            $name: 'modal',
            'class': 'am-modal am-modal-confirm',
            tabindex: "-1",
            $html: {
                'class': 'am-modal-dialog',
                $html: [{
                    'class': 'am-modal-hd dialog-title',
                    $html: nb.bind('title')
                }, {
                    'class': 'am-modal-hd dialog-msg',
                    $html: nb.bind('msg')
                }, {
                    'class': 'am-modal-footer',
                    $html: [{
                        tag: 'span',
                        'class': 'am-modal-btn',
                        'data-am-modal-cancel': 'data-am-modal-cancel',
                        $text: '取消'
                    }, {
                        tag: 'span',
                        'class': 'am-modal-btn',
                        'data-am-modal-confirm': 'data-am-modal-confirm',
                        $text: '确定'
                    }]
                }]
            }
        }
    },
    method: {
        init: function () {
            var self = this;
            var $modal = this.$('modal');
            var $confirmBtn = $modal.find('[data-am-modal-confirm]');
            var $cancelBtn = $modal.find('[data-am-modal-cancel]');
            $confirmBtn.on('click', function (inEvent) {
                self._confirmFlag = true;
                var model = self.getModel() || {};
                var scope = model.get('scope');
                var confirm = model.get('onConfirm');
                var hide = true;
                if (confirm) {
                    hide = confirm.call(scope);
                }
                if (hide) {
                    $modal.modal('close')
                }
            });
            $cancelBtn.on('click', function (inEvent) {
                var model = self.getModel() || {};
                var scope = model.get('scope');
                var cancel = model.get('onCancel');
                if (self._confirmFlag) {
                    return;
                }
                if (cancel) {
                    return cancel.call(scope);
                }
            });
        },
        open: function () {
            this.$('modal').modal({
                closeViaDimmer: false
            });
            this._confirmFlag = false;
        }
    }
});
/**
 * Created by PuTi(编程即菩提) 10/8/16.
 */
nb.define({
    name: 'nb.mobile.Application',
    model: 'nb.mobile.Model',
    view: {
        'class': 'nb-m-app',
        $html: [{
            $name: 'pageContainer',
            'class': 'nb-m-page-container abs-full',
            $html: [{
                $name: 'pages',
                $type: 'nb.mobile.view.Pages',
                $model: 'pagesModel'
            }, {
                $name: 'pageAnimationMask',
                $type: 'nb.mobile.view.PageAnimationMask',
                $model: 'pagesModel'
            }, {
                $name: 'pageLoadingMask',
                $type: 'nb.mobile.view.PageLoadingMask',
                $model: 'pagesModel'
            }]
        }, {
            $name: 'dialogConfirm',
            $type: 'nb.mobile.view.modal.Confirm',
            $model: 'confirmModel'
        }, {
            $slot: 'extend'
        }]
    },
    method: {
        onModelReady: function (inModel) {
            inModel.onChange({
                name: 'confirmModel',
                scope: this,
                fn: function (inEvent) {
                    this.$('dialogConfirm', true).open();
                }
            });
        },
        onStart: function () {
            var model = this.getModel();
            nb.name('app.model', model);
        }
    }
});

/**
 * Created by PuTi(编程即菩提) 10/9/16.
 */
(function () {
    var pageMap = {};
    var pageModelReadyListenerMap = {};
    var defaultPageKey = 'main';
    var Application, application;
    var model;
    var showDefaultPage = false;
    var started = false;
    var Shell = nb.define({
        name: 'nb.mobile.Shell',
        method: {
            init: function () {

            },
            start: function () {
                Application = nb.get('app.Application') || nb.getType('nb.mobile.Application');
                application = new Application();
                model = application.getModel();
                $.each(pageModelReadyListenerMap, function (inPageKey, inCallback) {
                    model.appPageModelReadyListener(inPageKey, inCallback);
                });
                model.set('pages', pageMap);
                $(document).ready(function () {
                    application.$().appendTo(document.body);
                    if (defaultPageKey) {
                        model.showPage(defaultPageKey);
                        showDefaultPage = true;
                    }
                });
                application.onStart();
                started = true;
                nb.name('_model', model);
            },
            addPage: function (inKey, inPageTypeName) {
                pageMap[inKey] = inPageTypeName;
            },
            addPageModelReadyListener: function (inPageKey, inCallback) {
                pageModelReadyListenerMap[inPageKey] = inCallback;
            },
            setDefaultPage: function (inKey) {
                defaultPageKey = inKey;
                if (started && inKey && !showDefaultPage) {
                    model.showPage(defaultPageKey);
                }
            },
            showPage: function (inKey, inOpts) {
                model.showPage(inKey, inOpts);
            }
        }
    });
    var shell = new Shell();
    nb.name('nb.mobile.shell', shell);
})();
