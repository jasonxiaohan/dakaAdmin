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
  var merchant_id = router.search.merchant_id;

  //管理员管理
  table.render({
    elem: '#LAY-merchant-product-manage'
    ,url: setter.remoteurl+'/system-merchant-product/products'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
      merchant_id: merchant_id,
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'product_name', title: '商品名称', width: 180}
      ,{field: 'ticket_source', title: '出码来源', width: 150, templet:function(d){
        if (d.ticket_source == 1) {
          return '极速部落出码';
        } else if(d.ticket_source == 2) {
          return '票付通';
        }
      }}
      ,{field: 'ticket_code', title: '票源代码', width: 180}
      ,{field: 'sell_price', title: '售价', width: 80}
      ,{field: 'merchant_name', title: '商家名称', width: 150}
      ,{field: 'category_name', title: '商家类型', width: 150}
      ,{title: '操作', width: 220, align: 'center', fixed: 'right', toolbar: '#table-merchant-product-manager'}
    ]]
    ,done: function(res, curr, count) {
      layer.closeAll();
    }
    ,page: true
    ,limit: 10
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-merchant-product-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        layer.confirm('确定删除此商品？', function(index){
           admin.req({
            url: setter.remoteurl+'/system-merchant-product/product'
            ,method: 'DELETE'
            ,data: {product_id: data.product_id}
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
    } else if(obj.event === 'edit'){ 
      admin.popup({
        title: '编辑商家商品'
        ,area: ['750px', '750px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('scenic/merchant/product', data).done(function(){
            form.render(null, 'layuiadmin-form-product');
                     
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
                url: setter.remoteurl+'/system-merchant-product/product'
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
    } else if(obj.event === 'buy'){ 
      admin.popup({
        title: '产品购买'
        ,area: ['750px', '750px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('merchant/merchant-buy', data).done(function(){
            form.render(null, 'layuiadmin-form-product');
                     
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
                url: setter.remoteurl+'/mall-order/order'
                ,method: 'POST'
                ,data: field
                ,success: function(res){
                  if (res.code == 0) {
                    layer.msg("购买成功",{time: 1000,icon: 1},function(){
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
    } else if(obj.event === 'merchant-product-list'){ 
      location.href = '#/merchant/product-list/merchant_id='+data.merchant_id;
    } 
  });

  exports('merchant-product', {})
});