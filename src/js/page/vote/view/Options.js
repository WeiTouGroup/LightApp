/**
 * Created by lu on 2017/8/6.
 */
(function () {
    nb.define({
        name: 'app.page.vote.view.Option',
        view:{
            'data-optionId':nb.bind('optionId'),
            'class':'vote-option-item fade-in',
            $html:{
                'class':'am-form-group',
                $html:[{
                   'class':'group-title',
                    $html:[{
                        tag:'label',
                        $text:nb.bind('label')
                    },{
                       tag:'i',
                       'class':'am-icon-remove remove'
                    }]
                },{
                    $type:'app.view.form.Input',
                    $model:'titleModel'
                },{
                    $type:'app.page.vote.view.Textarea',
                    $model:'desModel'
                }]
            }
        },
        method:{
            init:function () {

            }
        }
    });
    nb.define({
        name:'app.page.vote.view.OptionItems',
        parent:'nb.view.List',
        view:{
            'class':'vote-option-list'
        },
        method:{
            init:function () {
                var self = this;
                var $el = this.$();
                $el.on('click','.am-icon-remove.remove',function (inEvent) {
                    var $item = $(this).parents('.vote-option-item');
                    var optionId = $item.attr('data-optionId');
                    var index = $item.attr('data-list-index');
                    var model = self.getModel();
                    AMUI.dialog.confirm({
                        title:'提示',
                        content:'您确认删除选项'+optionId+'吗？',
                        onConfirm: function() {
                            model.set('removeOption',{
                                index:index,
                                optionId:optionId
                            },{
                                skipSameValue:false
                            });
                        }
                    });
                });
            }
        }
    });
    nb.define({
        name: 'app.page.vote.view.Options',
        view:{
            'class':'vote-options',
            $html:[{
                $name:'items',
                $type:'app.page.vote.view.OptionItems',
                $model:'itemsModel'
            },{
                $name:'add',
                'class':'add-option',
                $html:[{
                    tag:'i',
                    'class':'am-icon-plus'
                },{
                    tag:'span',
                    $text:'新建投票选项'
                }]
            }]
        },
        method: {
            init: function () {
                var self = this;
                // var $items = this.$('items');
                var $add = this.$('add');
                $add.on('click',function (inEvent) {
                    var $Items = self.$('items',true);
                    $Items.getModel().set('addItem',new Date);
                });
            }
        }
    });
})();