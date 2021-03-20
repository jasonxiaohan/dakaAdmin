/**
 @Name： 用户管理 管理员管理 角色管理
 */

layui.define(['table', 'form','util'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,setter = layui.setter
  ,table = layui.table
  ,util = layui.util
  ,form = layui.form;


  var router = layui.router();
  var protocol_id = router.search.protocol_id;
  /*var d = {};
  var t = $('#layuiadmin-form-product [name]').serializeArray();
  $.each(t, function() {
      d[this.name] = this.value;
  });
  data = JSON.stringify(d);*/


  // 价格协议列表
  table.render({
    elem: '#LAY-channel-product-manage'
    ,url: setter.remoteurl+'/system-merchant-product/products'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
      protocol_selected: $('#protocol_id').val(),
    }
     ,toolbar: '#toolbarProduct'
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'product_name', title: '产品', width: 150}
      ,{field: 'original_price', title: '建议价', width: 150}
      ,{field: 'sell_price', title: '底价', width: 100}
      ,{field: 'float_price', title: '加减价', width: 100, edit: 'text'}
      ,{field: 'author_price', title: '授权价', width: 100, templet:function(d){
        if (d.float_price > 0) { 
          return parseFloat(d.sell_price) + parseFloat(d.float_price);
        } else {
          return d.author_price;
        }
      }}
      ,{field: 'invalid_end_time', title: '有效期', width: 150,templet:function(d){
        return util.toDateString(d.createTime, "yyyy-MM-dd");
      }}
      ,{field: 'is_show', title: '状态', width: 100, templet:function(d){
        if (d.is_show == 1) { 
          return '在售';
        } else {
          return '下架';
        }
      }}
    ]]
    ,done: function(res, curr, count) {
      //layer.closeAll();
    }
    ,page: true
    ,limit: 10
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-product-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        layer.confirm('确定删除此商品？', function(index){
           admin.req({
            url: setter.remoteurl+'/system-protocol/protocol'
            ,method: 'DELETE'
            ,data: {protocol_id: data.protocol_id}
            ,success: function(res){
              if (res.code == 0) {
                layer.msg("删除成功",{time: 1000,icon: 1},function(){
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                    window.parent.location.reload();
                });
              } else {
                layer.msg(res.msg, {icon: 5});
              }
            }
          }); 
          obj.del();
          layer.close(index);
        });
      });
    }else if(obj.event === 'edit'){ 
      /*admin.popup({
        title: '编辑价格协议'
        ,area: ['420px', '400px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('channel/product-list', data).done(function(){
            form.render(null, 'layuiadmin-form-protocol');
                     
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段
              var required= new Array();
              $("input[name='required']:checked").each(function(){
                  required.push($(this).val());
              });
              field.required = required.join(',');
              console.log(field.required);

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/system-protocol/protocol'
                ,method: 'PUT'
                ,data: field
                ,success: function(res){
                  if (res.code == 0) {
                    layer.msg("修改成功",{time: 1000,icon: 1},function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        window.parent.location.reload();
                    });
                  } else {
                    layer.msg(res.msg, {icon: 5});
                  }
                }
              }); 

              layui.table.reload('LAY-user-back-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });*/
    } /*else if(obj.event === 'author_product'){ 
      layer.open({
        title: '授权产品'
        ,area: ['920px', '700px']
        ,id: 'LAY-popup-user-add'
        ,btn :['保存', '取消']
        ,type: 1
        ,success: function(layero, index){
          view(this.id).render('channel/product-list', data).done(function(){

            form.render(null, 'layuiadmin-form-protocol');

            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段
              var required= new Array();
              $("input[name='required']:checked").each(function(){
                  required.push($(this).val());
              });
              field.required = required.join(',');

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/system-protocol/protocol'
                ,method: 'PUT'
                ,data: field
                ,success: function(res){
                  if (res.code == 0) {
                    layer.msg("修改成功",{time: 1000,icon: 1},function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        window.parent.location.reload();
                    });
                  } else {
                    layer.msg(res.msg, {icon: 5});
                  }
                }
              }); 

              layui.table.reload('LAY-user-back-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    } */
  });

  exports('channel-product', {})
});