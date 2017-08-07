/**
 * Created by lu on 2017/8/6.
 */
(function () {
    var TitleModel = nb.define({
        parent:'app.model.Input',
        method:{
           init:function () {
               this.setOpts({
                   type:'text',
                   placeholder:'小标题'
               });
           }
        }
    });
    var DesModel = nb.define({
        parent:'nb.Model',
        method:{
            init:function () {
                this.setOpts({
                    placeholder:'选项内容',
                    rows:2
                });
            }
        }
    });
    var ItemModel = nb.define({
        parent:'nb.Model',
        method:{
            init:function () {
               var titleModel = new TitleModel();
               var desModel =  new DesModel();
               this.set('titleModel',titleModel);
               this.set('desModel',desModel);
               this.onChange({
                   name:'optionId',
                   scope:this,
                   fn:function (inEvent) {
                       var id = inEvent.data;
                       this.set('label',('选项'+id),{
                           skipSameVale:false
                       });
                   }
               })
            }
        }
    });
    var ItemsModel = nb.define({
        parent:'nb.Model',
        method:{
            init:function () {
                this.set('itemType','app.page.vote.view.Option');
                this.onChange({
                    name:'list',
                    scope:this,
                    fn:function (inEvent) {
                        var items = inEvent.data||[];
                        var itemModeList = [];
                        var optionsMap = {};
                        $.each(items,function (inIndex,inItem) {
                            var itemModel = new ItemModel();
                            inItem.optionId = inIndex+1;
                            itemModel.setOpts(inItem);
                            itemModeList.push(itemModel);
                            optionsMap[inItem.optionId] = itemModel;
                        });
                        this.set('optionsCount',itemModeList.length);
                        this.set('itemModeList',itemModeList);
                        this.set('optionsMap',optionsMap);
                        this.set('items',itemModeList);
                    }
                });
                //增加选项
                this.onChange({
                    name:'addItem',
                    before:true,
                    scope:this,
                    fn:function (inEvent) {
                        var itemData = inEvent.data;
                        var optionsCount = this.get('optionsCount');
                        var itemModel = new ItemModel();
                        itemModel.setOpts(itemData);
                        itemModel.set('optionId',optionsCount+1,{
                            skipSameValue:false
                        });
                        this.set('optionsCount',optionsCount+1,{
                            skipSameValue:false
                        });
                        return itemModel;
                    }
                });
                //删除选项
                this.onChange({
                    name:'removeOption',
                    scope:this,
                    fn:function (inEvent) {
                        var index = inEvent.data.index;
                        var itemModeList = this.get('itemModeList');
                        var optionsMap = this.get('optionsMap');
                        itemModeList.splice(index,1);
                        this.set('removeItem',index,{skipSameValue:false});
                        $.each(itemModeList,function (inIndex,inItem) {
                            inItem.set('optionId',inIndex+1);
                            optionsMap[inItem.get('optionId')] = inItem;
                        });
                        this.set('optionsCount',itemModeList.length,{skipSameValue:false});
                    }
                });
            }
        }
    });
    nb.define({
        name: 'app.page.vote.model.Options',
        parent:'nb.Model',
        method: {
            init: function () {
                var list = [{},{}];
                var itemsModel = new ItemsModel();
                itemsModel.set('list',list);
                this.set('itemsModel',itemsModel);
            }
        }
    });
})();